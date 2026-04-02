import gql from 'graphql-tag';

const designationTypeDefs = gql`
  type Designation {
    _id: ID!
    name: String!
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateDesignationInput {
    name: String!
  }

  input UpdateDesignationInput {
    name: String
  }

  extend type Query {
    listDesignations: [Designation!]!
    getDesignation(id: ID!): Designation
  }

  extend type Mutation {
    createDesignation(input: CreateDesignationInput!): Designation!
    updateDesignation(id: ID!, input: UpdateDesignationInput!): Designation!
    deleteDesignation(id: ID!): Designation!
    restoreDesignation(id: ID!): Designation!
  }
`;

export default designationTypeDefs;
