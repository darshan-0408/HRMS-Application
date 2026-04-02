import gql from 'graphql-tag';

const authTypeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    role: String!
    tenant_id: ID
    tenant: Tenant
  }

  type Tenant {
    _id: ID!
    name: String!
    code: String!
    logoUrl: String
    primaryColor: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthResponse!
  }

  extend type Query {
    me: User
  }
`;

export default authTypeDefs;
