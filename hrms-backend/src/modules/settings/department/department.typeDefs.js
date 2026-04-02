import gql from 'graphql-tag';

const departmentTypeDefs = gql`
  type Department {
    _id: ID!
    deptName: String!
    shortName: String
    deptCode: String
    admin: String
    adminContact: String
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateDepartmentInput {
    deptName: String!
    shortName: String
    deptCode: String
    admin: String
    adminContact: String
  }

  input UpdateDepartmentInput {
    deptName: String
    shortName: String
    deptCode: String
    admin: String
    adminContact: String
  }

  extend type Query {
    listDepartments: [Department!]!
    getDepartment(id: ID!): Department
  }

  extend type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department!
    updateDepartment(id: ID!, input: UpdateDepartmentInput!): Department!
    deleteDepartment(id: ID!): Department!
    restoreDepartment(id: ID!): Department!
  }
`;

export default departmentTypeDefs;
