import EmployeeType from './EmployeeType.model.js';

const employeeTypeResolvers = {
  Query: {
    listEmployeeTypes: async () => EmployeeType.find({ isDeleted: false }).sort({ name: 1 }),
    getEmployeeType: async (_, { id }) => EmployeeType.findById(id),
  },
  Mutation: {
    createEmployeeType: async (_, { input }) => new EmployeeType(input).save(),
    updateEmployeeType: async (_, { id, input }) =>
      EmployeeType.findByIdAndUpdate(id, input, { new: true, runValidators: true }),
    deleteEmployeeType: async (_, { id }) =>
      EmployeeType.findByIdAndUpdate(id, { isDeleted: true }, { new: true }),
    restoreEmployeeType: async (_, { id }) =>
      EmployeeType.findByIdAndUpdate(id, { isDeleted: false }, { new: true }),
  },
};

export default employeeTypeResolvers;
