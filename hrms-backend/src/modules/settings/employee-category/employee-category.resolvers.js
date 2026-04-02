import EmployeeCategory from './EmployeeCategory.model.js';

const employeeCategoryResolvers = {
  Query: {
    listEmployeeCategories: async () => EmployeeCategory.find({ isDeleted: false }).sort({ name: 1 }),
    getEmployeeCategory: async (_, { id }) => EmployeeCategory.findById(id),
  },
  Mutation: {
    createEmployeeCategory: async (_, { input }) => new EmployeeCategory(input).save(),
    updateEmployeeCategory: async (_, { id, input }) =>
      EmployeeCategory.findByIdAndUpdate(id, input, { new: true, runValidators: true }),
    deleteEmployeeCategory: async (_, { id }) =>
      EmployeeCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true }),
    restoreEmployeeCategory: async (_, { id }) =>
      EmployeeCategory.findByIdAndUpdate(id, { isDeleted: false }, { new: true }),
  },
};

export default employeeCategoryResolvers;
