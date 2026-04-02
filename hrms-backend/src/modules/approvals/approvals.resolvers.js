import LeaveApplication from '../leave-management/LeaveApplication.model.js';
import Movement from '../movement-management/Movement.model.js';
import Employee from '../employee/Employee.model.js';
import Department from '../settings/department/Department.model.js';
import LeaveType from '../settings/leave-type/LeaveType.model.js';

async function getFilteredEmployeeIds(search, department) {
  let searchIds = null;
  let deptIds = null;

  if (search) {
    const regex = new RegExp(search, 'i');
    searchIds = await Employee.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { empId: regex }
      ]
    }).distinct('_id');
  }

  if (department) {
    const dept = await Department.findOne({ deptName: department });
    if (!dept) return [];
    deptIds = await Employee.find({ departmentId: dept._id }).distinct('_id');
  }

  if (searchIds && deptIds) {
    const deptSet = new Set(deptIds.map(id => id.toString()));
    return searchIds.filter(id => deptSet.has(id.toString()));
  }
  return searchIds || deptIds || null;
}

const approvalsResolvers = {
  Query: {
    approvals: async (_, { filters = {}, page = 1, limit = 10 }) => {
      const { search, department, status, approvalType } = filters;

      const empIds = await getFilteredEmployeeIds(search, department);
      // If filters produced zero matching employees, return empty
      if (empIds !== null && empIds.length === 0) {
        return { data: [], total: 0, page, totalPages: 0 };
      }

      const showLeaves = !approvalType || approvalType === 'all' || approvalType === 'leave';
      const showMovements = !approvalType || approvalType === 'all' || approvalType === 'movement';

      let allItems = [];

      // Fetch leave applications
      if (showLeaves) {
        const leaveQuery = { isDeleted: { $ne: true } };
        if (status) leaveQuery.status = status;
        if (empIds) leaveQuery.employeeId = { $in: empIds.map(id => id.toString()) };

        const leaves = await LeaveApplication.find(leaveQuery)
          .sort({ created_at: -1 })
          .populate('leaveTypeId');

        for (const app of leaves) {
          const emp = await Employee.findById(app.employeeId).populate('departmentId');
          const lt = await LeaveType.findById(app.leaveTypeId);
          allItems.push({
            _id: app._id.toString() + '_leave',
            type: 'leave',
            empId: emp?.empId || '-',
            empName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown',
            department: emp?.departmentId?.deptName || '-',
            approvalType: 'Employee Leave',
            requestedDate: app.created_at ? app.created_at.toISOString().split('T')[0] : (app.createdAt ? app.createdAt.toISOString().split('T')[0] : ''),
            status: app.status,
            leaveRaw: app.toObject(),
            empObj: emp,
            leaveTypeObj: lt,
          });
        }
      }

      // Fetch movements
      if (showMovements) {
        const movQuery = {};
        if (status) movQuery.status = status;
        if (empIds) movQuery.employeeId = { $in: empIds };

        const movements = await Movement.find(movQuery)
          .sort({ createdAt: -1 })
          .populate({ path: 'employeeId', populate: { path: 'departmentId' } });

        for (const m of movements) {
          const d = m.toObject();
          allItems.push({
            _id: d._id.toString() + '_movement',
            type: 'movement',
            empId: d.employeeId?.empId || '-',
            empName: d.employeeId ? `${d.employeeId.firstName} ${d.employeeId.lastName}` : 'Unknown',
            department: d.employeeId?.departmentId?.deptName || '-',
            approvalType: 'Movement Register',
            requestedDate: d.createdAt ? d.createdAt.toISOString().split('T')[0] : '',
            status: d.status,
            movementRaw: d,
          });
        }
      }

      // Sort by requestedDate descending
      allItems.sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));

      const total = allItems.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginatedItems = allItems.slice(start, start + limit);

      // Build response with proper nested data for sliders
      const data = paginatedItems.map(item => {
        const base = {
          _id: item._id,
          type: item.type,
          empId: item.empId,
          empName: item.empName,
          department: item.department,
          approvalType: item.approvalType,
          requestedDate: item.requestedDate,
          status: item.status,
          leaveData: null,
          movementData: null,
        };

        if (item.type === 'leave' && item.leaveRaw) {
          base.leaveData = {
            ...item.leaveRaw,
            employee: item.empObj ? {
              _id: item.empObj._id,
              empId: item.empObj.empId,
              name: `${item.empObj.firstName} ${item.empObj.lastName}`,
              department: item.empObj.departmentId ? { deptName: item.empObj.departmentId.deptName } : null,
              designation: item.empObj.designationId ? { name: '' } : null,
            } : null,
            leaveType: item.leaveTypeObj ? {
              _id: item.leaveTypeObj._id,
              leaveName: item.leaveTypeObj.leaveName,
              leaveCode: item.leaveTypeObj.leaveCode,
            } : null,
          };
        }

        if (item.type === 'movement' && item.movementRaw) {
          const mr = item.movementRaw;
          base.movementData = {
            _id: mr._id,
            empId: item.empId,
            empName: item.empName,
            department: item.department,
            movementDate: mr.movementDate ? mr.movementDate.toISOString().split('T')[0] : '',
            movementTime: `${mr.startTime} - ${mr.endTime}`,
            startTime: mr.startTime,
            endTime: mr.endTime,
            reason: mr.reason,
            status: mr.status,
            reqDate: item.requestedDate,
          };
        }

        return base;
      });

      return { data, total, page, totalPages };
    }
  }
};

export default approvalsResolvers;
