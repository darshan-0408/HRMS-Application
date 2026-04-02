import Movement from './Movement.model.js';
import Employee from '../employee/Employee.model.js';
import MovementSetting from '../settings/movement-setting/MovementSetting.model.js';
import Department from '../settings/department/Department.model.js';

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

const movementResolvers = {
  Query: {
    movements: async (_, { filters, page, limit }) => {
      const query = {};
      if (filters?.status) query.status = filters.status;
      if (filters?.employeeId) query.employeeId = filters.employeeId;

      // Month filter (YYYY-MM)
      if (filters?.month) {
        const [year, month] = filters.month.split('-').map(Number);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        query.movementDate = { $gte: start, $lte: end };
      }

      // Department filter - find employees in that department first
      if (filters?.department) {
        const dept = await Department.findOne({ deptName: filters.department });
        if (dept) {
          const empIds = await Employee.find({ departmentId: dept._id }).distinct('_id');
          query.employeeId = { ...(query.employeeId || {}), $in: empIds };
        } else {
          return { data: [], total: 0, page, totalPages: 0 };
        }
      }

      // Search filter - find employees matching search term
      if (filters?.search) {
        const searchRegex = new RegExp(filters.search, 'i');
        const matchingEmps = await Employee.find({
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { empId: searchRegex }
          ]
        }).distinct('_id');

        if (query.employeeId?.$in) {
          // Intersect with department filter
          const deptSet = new Set(query.employeeId.$in.map(id => id.toString()));
          const intersected = matchingEmps.filter(id => deptSet.has(id.toString()));
          query.employeeId = { $in: intersected };
        } else {
          query.employeeId = { $in: matchingEmps };
        }
      }

      const skip = (page - 1) * limit;
      const total = await Movement.countDocuments(query);
      const dataRaw = await Movement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'employeeId', populate: { path: 'departmentId' } });

      const data = dataRaw.map(m => {
        const d = m.toObject();
        return {
          _id: d._id,
          empId: d.employeeId?.empId,
          empName: d.employeeId ? `${d.employeeId.firstName} ${d.employeeId.lastName}` : 'Unknown',
          department: d.employeeId?.departmentId?.deptName || 'Unknown',
          movementDate: d.movementDate.toISOString().split('T')[0],
          movementTime: `${d.startTime} - ${d.endTime}`,
          startTime: d.startTime,
          endTime: d.endTime,
          reason: d.reason,
          status: d.status,
          reqDate: d.createdAt.toISOString().split('T')[0],
        };
      });

      return { data, total, page, totalPages: Math.ceil(total / limit) };
    },
    employeeMovements: async (_, { empId, page, limit }) => {
      const query = { employeeId: empId };
      const skip = (page - 1) * limit;
      const total = await Movement.countDocuments(query);
      const dataRaw = await Movement.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({ path: 'employeeId', populate: { path: 'departmentId' } });

      const data = dataRaw.map(m => {
        const d = m.toObject();
        return {
          _id: d._id,
          empId: d.employeeId?.empId,
          empName: d.employeeId ? `${d.employeeId.firstName} ${d.employeeId.lastName}` : 'Unknown',
          department: d.employeeId?.departmentId?.deptName || 'Unknown',
          movementDate: d.movementDate.toISOString().split('T')[0],
          movementTime: `${d.startTime} - ${d.endTime}`,
          startTime: d.startTime,
          endTime: d.endTime,
          reason: d.reason,
          status: d.status,
          reqDate: d.createdAt.toISOString().split('T')[0],
        };
      });

      return { data, total, page, totalPages: Math.ceil(total / limit) };
    }
  },
  Mutation: {
    createMovement: async (_, { input }) => {
      const setting = await MovementSetting.findOne().sort({ createdAt: -1 });
      if (!setting) throw new Error('Movement settings not configured.');

      const mDate = new Date(input.movementDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      const diffDays = Math.floor((mDate - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays < setting.daysBeforeApply) {
        throw new Error(`Movements must be applied at least ${setting.daysBeforeApply} days in advance.`);
      }

      const durMins = timeToMinutes(input.endTime) - timeToMinutes(input.startTime);
      if (durMins <= 0) throw new Error('End time must be after start time.');
      if (durMins > setting.maxDurationMinutes) {
        throw new Error(`Movement duration cannot exceed ${setting.maxDurationMinutes} minutes.`);
      }

      // Check frequency limits
      let startDate = new Date(mDate);
      let endDate = new Date(mDate);
      if (setting.limitFrequency === 'monthly') {
        startDate.setDate(1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
      } else {
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59);
      }
      
      const count = await Movement.countDocuments({
        employeeId: input.employeeId,
        movementDate: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      });

      if (count >= setting.limitCount) {
        throw new Error(`Maximum movement limit reached for this ${setting.limitFrequency} period.`);
      }

      const status = setting.autoApprovalEnabled ? 'approved' : 'pending';

      const m = await Movement.create({
        employeeId: input.employeeId,
        movementDate: mDate,
        startTime: input.startTime,
        endTime: input.endTime,
        reason: input.reason,
        status,
      });

      const d = await Movement.findById(m._id).populate({ path: 'employeeId', populate: { path: 'departmentId' } });
      const obj = d.toObject();

      return {
          _id: obj._id,
          empId: obj.employeeId?.empId,
          empName: obj.employeeId ? `${obj.employeeId.firstName} ${obj.employeeId.lastName}` : 'Unknown',
          department: obj.employeeId?.departmentId?.deptName || 'Unknown',
          movementDate: obj.movementDate.toISOString().split('T')[0],
          movementTime: `${obj.startTime} - ${obj.endTime}`,
          startTime: obj.startTime,
          endTime: obj.endTime,
          reason: obj.reason,
          status: obj.status,
          reqDate: obj.createdAt.toISOString().split('T')[0],
      };
    },
    updateMovement: async (_, { id, input }) => {
      const setting = await MovementSetting.findOne().sort({ createdAt: -1 });
      const m = await Movement.findById(id);
      if (!m) throw new Error('Movement not found');

      if (input.startTime && input.endTime) {
        const durMins = timeToMinutes(input.endTime) - timeToMinutes(input.startTime);
        if (durMins <= 0) throw new Error('End time must be after start time.');
        if (setting && durMins > setting.maxDurationMinutes) {
          throw new Error(`Movement duration cannot exceed ${setting.maxDurationMinutes} minutes.`);
        }
        m.startTime = input.startTime;
        m.endTime = input.endTime;
      }
      if (input.reason) m.reason = input.reason;
      
      await m.save();
      const d = await Movement.findById(id).populate({ path: 'employeeId', populate: { path: 'departmentId' } });
      const obj = d.toObject();
      return {
          _id: obj._id,
          status: obj.status,
          startTime: obj.startTime,
          endTime: obj.endTime,
          movementTime: `${obj.startTime} - ${obj.endTime}`,
      };
    },
    cancelMovement: async (_, { id }) => {
      const m = await Movement.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
      return { _id: m._id, status: m.status };
    }
  }
};

export default movementResolvers;
