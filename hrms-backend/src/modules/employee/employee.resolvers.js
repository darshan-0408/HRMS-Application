import Employee from './Employee.model.js';
import Department from '../settings/department/Department.model.js';
import Designation from '../settings/designation/Designation.model.js';
import EmployeeType from '../settings/employee-type/EmployeeType.model.js';
import EmployeeCategory from '../settings/employee-category/EmployeeCategory.model.js';
import { generateEmpId } from '../../utils/empIdGenerator.js';

const buildFilter = (filter = {}) => {
  const query = { isDeleted: false };
  if (filter.status) query.status = filter.status;
  if (filter.departmentId) query.departmentId = filter.departmentId;
  if (filter.designationId) query.designationId = filter.designationId;
  if (filter.empTypeId) query.empTypeId = filter.empTypeId;
  if (filter.empCategoryId) query.empCategoryId = filter.empCategoryId;
  if (filter.search) {
    const regex = new RegExp(filter.search, 'i');
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { empId: regex },
      { mobile: regex },
    ];
  }
  return query;
};

const employeeResolvers = {
  Query: {
    listEmployees: async (_, { filter, page = 1, limit = 20 }) => {
      const query = buildFilter(filter);
      const skip = (page - 1) * limit;
      const [employees, total] = await Promise.all([
        Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Employee.countDocuments(query),
      ]);
      return {
        employees,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    },
    getEmployee: async (_, { id }) => Employee.findById(id),
    countEmployees: async (_, { filter }) => {
      const query = buildFilter(filter);
      return Employee.countDocuments(query);
    },
  },

  Mutation: {
    createEmployee: async (_, { input }) => {
      // Validate cross-entity refs
      if (input.departmentId) {
        const dept = await Department.findOne({ _id: input.departmentId, isDeleted: false });
        if (!dept) throw new Error('Department not found or has been deleted');
      }
      if (input.designationId) {
        const desig = await Designation.findOne({ _id: input.designationId, isDeleted: false });
        if (!desig) throw new Error('Designation not found or has been deleted');
      }
      // Auto-generate empId
      const empId = await generateEmpId();
      const employee = new Employee({ ...input, empId });
      return employee.save();
    },

    updateEmployee: async (_, { id, input }) => {
      if (input.departmentId) {
        const dept = await Department.findOne({ _id: input.departmentId, isDeleted: false });
        if (!dept) throw new Error('Department not found or has been deleted');
      }
      if (input.designationId) {
        const desig = await Designation.findOne({ _id: input.designationId, isDeleted: false });
        if (!desig) throw new Error('Designation not found or has been deleted');
      }
      return Employee.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    },

    deleteEmployee: async (_, { id }) =>
      Employee.findByIdAndUpdate(id, { isDeleted: true, status: 'inactive' }, { new: true }),

    restoreEmployee: async (_, { id }) =>
      Employee.findByIdAndUpdate(id, { isDeleted: false, status: 'active' }, { new: true }),
  },

  // Field resolvers for nested entity population
  Employee: {
    name: (parent) => `${parent.firstName} ${parent.lastName}`.trim(),
    department: async (parent) => {
      if (!parent.departmentId) return null;
      return Department.findById(parent.departmentId);
    },
    designation: async (parent) => {
      if (!parent.designationId) return null;
      return Designation.findById(parent.designationId);
    },
    empType: async (parent) => {
      if (!parent.empTypeId) return null;
      return EmployeeType.findById(parent.empTypeId);
    },
    empCategory: async (parent) => {
      if (!parent.empCategoryId) return null;
      return EmployeeCategory.findById(parent.empCategoryId);
    },
    reportingEmployee: async (parent) => {
      if (!parent.reportingTo) return null;
      return Employee.findById(parent.reportingTo);
    },
    doj: (parent) => parent.doj ? parent.doj.toISOString().split('T')[0] : null,
    dob: (parent) => parent.dob ? parent.dob.toISOString().split('T')[0] : null,
    createdAt: (parent) => parent.createdAt?.toISOString(),
    updatedAt: (parent) => parent.updatedAt?.toISOString(),
  },
};

export default employeeResolvers;
