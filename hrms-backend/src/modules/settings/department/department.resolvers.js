import Department from './Department.model.js';

const departmentResolvers = {
  Query: {
    listDepartments: async () => {
      return Department.find({ isDeleted: false }).sort({ deptName: 1 });
    },
    getDepartment: async (_, { id }) => {
      return Department.findById(id);
    },
  },
  Mutation: {
    createDepartment: async (_, { input }) => {
      const dept = new Department(input);
      return dept.save();
    },
    updateDepartment: async (_, { id, input }) => {
      return Department.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    },
    deleteDepartment: async (_, { id }) => {
      return Department.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },
    restoreDepartment: async (_, { id }) => {
      return Department.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    },
  },
};

export default departmentResolvers;
