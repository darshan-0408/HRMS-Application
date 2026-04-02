import gql from 'graphql-tag';

const movementSettingTypeDefs = gql`
  type MovementSetting {
    _id: ID!
    limitCount: Int!
    limitFrequency: String!
    maxDurationMinutes: Int!
    daysBeforeApply: Int!
    autoApprovalEnabled: Boolean!
    createdAt: String
    updatedAt: String
  }

  input UpdateMovementSettingInput {
    limitCount: Int
    limitFrequency: String
    maxDurationMinutes: Int
    daysBeforeApply: Int
    autoApprovalEnabled: Boolean
  }

  extend type Query {
    getMovementSetting: MovementSetting
  }

  extend type Mutation {
    upsertMovementSetting(input: UpdateMovementSettingInput!): MovementSetting!
  }
`;

export default movementSettingTypeDefs;
