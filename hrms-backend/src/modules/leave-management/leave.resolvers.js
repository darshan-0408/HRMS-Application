import mongoose from 'mongoose';
import LeaveApplication from './LeaveApplication.model.js';
import LeaveBalance from './LeaveBalance.model.js';
import Employee from '../employee/Employee.model.js';
import LeaveType from '../settings/leave-type/LeaveType.model.js';
import Department from '../settings/department/Department.model.js';

const leaveResolvers = {
  Query: {
    getLeaveApplication: async (_, { id }) => {
      return await LeaveApplication.findById(id);
    },
    listLeaveApplications: async (_, { filter = {}, page = 1, limit = 10 }) => {
      let query = { isDeleted: { $ne: true } };

      // Status filter
      if (filter.status) query.status = filter.status;

      // Employee ID filter
      if (filter.employeeId) query.employeeId = filter.employeeId;

      // Fix month regex filter for Date fields
      if (filter.fromDate && typeof filter.fromDate === 'object' && filter.fromDate.$regex) {
        const monthStr = filter.fromDate.$regex.replace('^', ''); // "2026-03"
        const start = new Date(`${monthStr}-01`);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        query.fromDate = { $gte: start, $lt: end };
      }

      // Search filter - find employees matching search term
      if (filter.search) {
        const searchRegex = new RegExp(filter.search, 'i');
        const matchingEmps = await Employee.find({
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { empId: searchRegex }
          ]
        }).distinct('_id');
        
        if (query.employeeId) {
          // already has employeeId filter, intersect
          query.employeeId = { $in: matchingEmps.filter(id => id.toString() === query.employeeId) };
        } else {
          query.employeeId = { $in: matchingEmps.map(id => id.toString()) };
        }
      }

      // Department filter
      if (filter.department) {
        const dept = await Department.findOne({ deptName: filter.department });
        if (dept) {
          const deptEmpIds = await Employee.find({ departmentId: dept._id }).distinct('_id');
          const deptEmpStrIds = deptEmpIds.map(id => id.toString());

          if (query.employeeId?.$in) {
            // Intersect with existing employee filter (from search)
            const existingSet = new Set(query.employeeId.$in.map(id => id.toString()));
            query.employeeId = { $in: deptEmpStrIds.filter(id => existingSet.has(id)) };
          } else if (query.employeeId && typeof query.employeeId === 'string') {
            // Single employee filter - check if in department
            if (!deptEmpStrIds.includes(query.employeeId)) {
              return { employees: [], total: 0, page, totalPages: 0 };
            }
          } else {
            query.employeeId = { $in: deptEmpStrIds };
          }
        } else {
          return { employees: [], total: 0, page, totalPages: 0 };
        }
      }

      const total = await LeaveApplication.countDocuments(query);
      const items = await LeaveApplication.find(query)
        .sort({ fromDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      
      return {
        employees: items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    },
    getLeaveBalances: async (_, { employeeId }) => {
      // First, ensure all existing leave types have a balance record for this employee
      const leaveTypes = await LeaveType.find({ isDeleted: { $ne: true } });
      const balances = await LeaveBalance.find({ employeeId });
      
      const existingTypeIds = balances.map(b => b.leaveTypeId);
      const missingTypes = leaveTypes.filter(t => !existingTypeIds.includes(t._id.toString()));
      
      if (missingTypes.length > 0) {
        // Find existing emp to inherited some values if needed or just use default
        const emp = await Employee.findOne({ $or: [{ _id: mongoose.isValidObjectId(employeeId) ? employeeId : null }, { empId: employeeId }] });

        const newBalances = missingTypes.map(t => ({
          employeeId,
          leaveTypeId: t._id.toString(),
          allotted: t.maxConsecutiveDays * 2,
          consumed: 0,
          remaining: t.maxConsecutiveDays * 2
        }));
        await LeaveBalance.insertMany(newBalances);
        return await LeaveBalance.find({ employeeId });
      }
      
      return balances;
    },
  },

  Mutation: {
    applyLeave: async (_, { input }) => {
      const { employeeId, leaveTypeId, fromDate, toDate, days, totalDays } = input;
      
      // 1. Check for overlapping leaves
      const overlap = await LeaveApplication.findOne({
        employeeId,
        status: 'approved',
        isDeleted: { $ne: true },
        $or: [
          { fromDate: { $lte: toDate }, toDate: { $gte: fromDate } }
        ]
      });
      
      if (overlap) {
        throw new Error('Leave already applied for the selected dates');
      }
      
      // 2. Check balance
      const balance = await LeaveBalance.findOne({ employeeId, leaveTypeId });
      if (!balance || balance.remaining < totalDays) {
        throw new Error('Insufficient leave balance');
      }
      
      // 3. Create application as APPROVED
      const app = new LeaveApplication({
        ...input,
        status: 'approved',
        deptAdminApproval: 'approved',
        adminApproval: 'approved'
      });
      await app.save();

      // 4. Immediate Balance Deduction
      await LeaveBalance.findOneAndUpdate(
        { employeeId, leaveTypeId },
        { $inc: { consumed: totalDays, remaining: -totalDays } }
      );
      
      return app;
    },

    updateLeave: async (_, { input }) => {
      const { id, fromDate, toDate, days, totalDays } = input;
      const app = await LeaveApplication.findById(id);
      if (!app) throw new Error('Leave application not found');
      if (app.status === 'cancelled' || app.status === 'rejected') {
        throw new Error('Only active leaves can be updated');
      }
      
      const oldDays = app.totalDays;
      const sameType = true; // For now assuming same leave type.

      // Validation logic: check if remaining + old > new
      const balance = await LeaveBalance.findOne({ employeeId: app.employeeId, leaveTypeId: app.leaveTypeId });
      if (!balance || (balance.remaining + oldDays) < totalDays) {
        throw new Error('Insufficient leave balance for this update');
      }
      
      // Update app
      Object.assign(app, { fromDate, toDate, days, totalDays });
      await app.save();

      // Adjust balance: restore old, deduct new
      await LeaveBalance.findOneAndUpdate(
        { employeeId: app.employeeId, leaveTypeId: app.leaveTypeId },
        { $inc: { consumed: totalDays - oldDays, remaining: oldDays - totalDays } }
      );

      return app;
    },

    cancelLeave: async (_, { id }) => {
      const app = await LeaveApplication.findById(id);
      if (!app) throw new Error('Leave application not found');
      if (app.status === 'cancelled') throw new Error('Leave already cancelled');
      
      const oldStatus = app.status;
      app.status = 'cancelled';
      await app.save();

      // If it was approved, restore the balance
      if (oldStatus === 'approved') {
        await LeaveBalance.findOneAndUpdate(
          { employeeId: app.employeeId, leaveTypeId: app.leaveTypeId },
          { $inc: { consumed: -app.totalDays, remaining: app.totalDays } }
        );
      }

      return app;
    },

    updateLeaveStatus: async (_, { id, status, role }) => {
      const app = await LeaveApplication.findById(id);
      if (!app) throw new Error('Leave application not found');
      
      if (role === 'deptAdmin') {
        app.deptAdminApproval = status;
      } else if (role === 'admin') {
        app.adminApproval = status;
      }
      
      // If both approved, set overall status to approved and deduct balance
      if (app.deptAdminApproval === 'approved' && app.adminApproval === 'approved') {
        if (app.status !== 'approved') {
          app.status = 'approved';
          // Deduct from balance
          await LeaveBalance.findOneAndUpdate(
            { employeeId: app.employeeId, leaveTypeId: app.leaveTypeId },
            { $inc: { consumed: app.totalDays, remaining: -app.totalDays } }
          );
        }
      } else if (app.deptAdminApproval === 'rejected' || app.adminApproval === 'rejected') {
        app.status = 'rejected';
      }
      
      await app.save();
      return app;
    },

    setLeaveBalance: async (_, { employeeId, leaveTypeId, allotted }) => {
      return await LeaveBalance.findOneAndUpdate(
        { employeeId, leaveTypeId },
        { allotted, remaining: allotted, consumed: 0 },
        { upsert: true, new: true }
      );
    }
  },

  LeaveApplication: {
    employee: async (app) => {
      if (!app.employeeId) return null;
      if (mongoose.isValidObjectId(app.employeeId)) {
        return await Employee.findById(app.employeeId);
      }
      return await Employee.findOne({ empId: app.employeeId });
    },
    leaveType: async (app) => await LeaveType.findById(app.leaveTypeId),
  },

  LeaveBalance: {
    leaveType: async (bal) => await LeaveType.findById(bal.leaveTypeId),
  }
};

export default leaveResolvers;
