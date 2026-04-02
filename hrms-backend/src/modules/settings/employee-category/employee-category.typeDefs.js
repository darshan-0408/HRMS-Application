import gql from 'graphql-tag';

const employeeCategoryTypeDefs = gql`
  type EmployeeCategory {
    _id: ID!
    name: String!
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateEmployeeCategoryInput {
    name: String!
  }

  input UpdateEmployeeCategoryInput {
    name: String
  }

  extend type Query {
    listEmployeeCategories: [EmployeeCategory!]!
    getEmployeeCategory(id: ID!): EmployeeCategory
  }

  extend type Mutation {
    createEmployeeCategory(input: CreateEmployeeCategoryInput!): EmployeeCategory!
    updateEmployeeCategory(id: ID!, input: UpdateEmployeeCategoryInput!): EmployeeCategory!
    deleteEmployeeCategory(id: ID!): EmployeeCategory!
    restoreEmployeeCategory(id: ID!): EmployeeCategory!
  }
`;

export default employeeCategoryTypeDefs;
