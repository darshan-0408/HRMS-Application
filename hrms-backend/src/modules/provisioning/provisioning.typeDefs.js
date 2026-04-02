import gql from 'graphql-tag';

const provisioningTypeDefs = gql`
  input TenantRegistrationInput {
    name: String!
    code: String!
    adminUsername: String!
    adminEmail: String!
    adminPassword: String!
    logoUrl: String
  }

  type RegistrationResponse {
    success: Boolean!
    message: String!
    tenant: Tenant
    admin: User
  }

  extend type Query {
    listTenants: [Tenant!]!
  }

  extend type Mutation {
    registerTenant(input: TenantRegistrationInput!): RegistrationResponse!
  }
`;

export default provisioningTypeDefs;
