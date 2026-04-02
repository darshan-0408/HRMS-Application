import LeaveType from './LeaveType.model.js';

const leaveTypeResolvers = {
  Query: {
    listLeaveTypes: async () => LeaveType.find({ isDeleted: false }).sort({ leaveName: 1 }),
    getLeaveType: async (_, { id }) => LeaveType.findById(id),
  },
  Mutation: {
    createLeaveType: async (_, { input }) => new LeaveType(input).save(),
    updateLeaveType: async (_, { id, input }) =>
      LeaveType.findByIdAndUpdate(id, input, { new: true, runValidators: true }),
    deleteLeaveType: async (_, { id }) =>
      LeaveType.findByIdAndUpdate(id, { isDeleted: true }, { new: true }),
    restoreLeaveType: async (_, { id }) =>
      LeaveType.findByIdAndUpdate(id, { isDeleted: false }, { new: true }),
  },
};

export default leaveTypeResolvers;
