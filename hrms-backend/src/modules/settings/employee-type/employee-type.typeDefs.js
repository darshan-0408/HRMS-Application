import gql from 'graphql-tag';

const employeeTypeTypeDefs = gql`
  type EmployeeType {
    _id: ID!
    name: String!
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateEmployeeTypeInput {
    name: String!
  }

  input UpdateEmployeeTypeInput {
    name: String
  }

  extend type Query {
    listEmployeeTypes: [EmployeeType!]!
    getEmployeeType(id: ID!): EmployeeType
  }

  extend type Mutation {
    createEmployeeType(input: CreateEmployeeTypeInput!): EmployeeType!
    updateEmployeeType(id: ID!, input: UpdateEmployeeTypeInput!): EmployeeType!
    deleteEmployeeType(id: ID!): EmployeeType!
    restoreEmployeeType(id: ID!): EmployeeType!
  }
`;

export default employeeTypeTypeDefs;
