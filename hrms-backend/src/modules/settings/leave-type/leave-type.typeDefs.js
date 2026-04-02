import gql from 'graphql-tag';

const leaveTypeTypeDefs = gql`
  type LeaveType {
    _id: ID!
    leaveCode: String!
    leaveName: String!
    category: String!
    maxConsecutiveDays: Int!
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateLeaveTypeInput {
    leaveCode: String!
    leaveName: String!
    category: String!
    maxConsecutiveDays: Int!
  }

  input UpdateLeaveTypeInput {
    leaveCode: String
    leaveName: String
    category: String
    maxConsecutiveDays: Int
  }

  extend type Query {
    listLeaveTypes: [LeaveType!]!
    getLeaveType(id: ID!): LeaveType
  }

  extend type Mutation {
    createLeaveType(input: CreateLeaveTypeInput!): LeaveType!
    updateLeaveType(id: ID!, input: UpdateLeaveTypeInput!): LeaveType!
    deleteLeaveType(id: ID!): LeaveType!
    restoreLeaveType(id: ID!): LeaveType!
  }
`;

export default leaveTypeTypeDefs;
