import gql from 'graphql-tag';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

// --- Type Defs ---
import departmentTypeDefs from './modules/settings/department/department.typeDefs.js';
import designationTypeDefs from './modules/settings/designation/designation.typeDefs.js';
import employeeCategoryTypeDefs from './modules/settings/employee-category/employee-category.typeDefs.js';
import employeeTypeTypeDefs from './modules/settings/employee-type/employee-type.typeDefs.js';
import leaveTypeTypeDefs from './modules/settings/leave-type/leave-type.typeDefs.js';
import movementSettingTypeDefs from './modules/settings/movement-setting/movement-setting.typeDefs.js';
import movementTypeDefs from './modules/movement-management/movement.typeDefs.js';
import employeeTypeDefs from './modules/employee/employee.typeDefs.js';
import leaveManagementTypeDefs from './modules/leave-management/leave.typeDefs.js';
import authTypeDefs from './modules/auth/auth.typeDefs.js';
import provisioningTypeDefs from './modules/provisioning/provisioning.typeDefs.js';
import approvalsTypeDefs from './modules/approvals/approvals.typeDefs.js';

// --- Resolvers ---
import departmentResolvers from './modules/settings/department/department.resolvers.js';
import designationResolvers from './modules/settings/designation/designation.resolvers.js';
import employeeCategoryResolvers from './modules/settings/employee-category/employee-category.resolvers.js';
import employeeTypeResolvers from './modules/settings/employee-type/employee-type.resolvers.js';
import leaveTypeResolvers from './modules/settings/leave-type/leave-type.resolvers.js';
import movementSettingResolvers from './modules/settings/movement-setting/movement-setting.resolvers.js';
import movementResolvers from './modules/movement-management/movement.resolvers.js';
import employeeResolvers from './modules/employee/employee.resolvers.js';
import leaveManagementResolvers from './modules/leave-management/leave.resolvers.js';
import authResolvers from './modules/auth/auth.resolvers.js';
import provisioningResolvers from './modules/provisioning/provisioning.resolvers.js';
import approvalsResolvers from './modules/approvals/approvals.resolvers.js';

import { GraphQLScalarType, Kind } from 'graphql';

// Root type stubs so extensions work
const rootTypeDefs = gql`
  scalar JSON
  scalar Date
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const scalarResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value) { return value; },
    parseValue(value) { return value; },
    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
          return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
          return parseFloat(ast.value);
        case Kind.OBJECT:
          throw new Error('JSON scalar parseLiteral for OBJECT not implemented in this simple version');
        default:
          return null;
      }
    }
  })
};

export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  departmentTypeDefs,
  designationTypeDefs,
  employeeCategoryTypeDefs,
  employeeTypeTypeDefs,
  leaveTypeTypeDefs,
  movementSettingTypeDefs,
  movementTypeDefs,
  employeeTypeDefs,
  leaveManagementTypeDefs,
  authTypeDefs,
  provisioningTypeDefs,
  approvalsTypeDefs,
]);

export const resolvers = mergeResolvers([
  scalarResolvers,
  departmentResolvers,
  designationResolvers,
  employeeCategoryResolvers,
  employeeTypeResolvers,
  leaveTypeResolvers,
  movementSettingResolvers,
  movementResolvers,
  employeeResolvers,
  leaveManagementResolvers,
  authResolvers,
  provisioningResolvers,
  approvalsResolvers,
]);
