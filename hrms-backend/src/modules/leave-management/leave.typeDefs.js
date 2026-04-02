import gql from 'graphql-tag';

const leaveTypeDefs = gql`
  type LeaveDay {
    date: Date!
    dayType: String!
  }

  input LeaveDayInput {
    date: Date!
    dayType: String!
  }

  type LeaveApplication {
    _id: ID!
    employeeId: String!
    leaveTypeId: String!
    fromDate: Date!
    toDate: Date!
    reason: String!
    document: String
    days: [LeaveDay!]!
    totalDays: Float!
    status: String!
    deptAdminApproval: String!
    adminApproval: String!
    created_at: Date
    updated_at: Date
    
    # Virtuals/Populated
    employee: Employee
    leaveType: LeaveType
  }

  type LeaveBalance {
    _id: ID!
    employeeId: String!
    leaveTypeId: String!
    allotted: Float!
    consumed: Float!
    remaining: Float!
    leaveType: LeaveType
  }

  input ApplyLeaveInput {
    employeeId: String!
    leaveTypeId: String!
    fromDate: Date!
    toDate: Date!
    reason: String!
    days: [LeaveDayInput!]!
    totalDays: Float!
    document: String
  }

  input UpdateLeaveInput {
    id: ID!
    fromDate: Date!
    toDate: Date!
    days: [LeaveDayInput!]!
    totalDays: Float!
  }

  extend type Query {
    getLeaveApplication(id: ID!): LeaveApplication
    listLeaveApplications(filter: JSON, page: Int, limit: Int): LeaveApplicationConnection
    getLeaveBalances(employeeId: String!): [LeaveBalance!]!
  }

  type LeaveApplicationConnection {
    employees: [LeaveApplication!]! # Should be 'items' but matches existing pattern if needed
    total: Int
    page: Int
    totalPages: Int
  }

  extend type Mutation {
    applyLeave(input: ApplyLeaveInput!): LeaveApplication
    updateLeave(input: UpdateLeaveInput!): LeaveApplication
    cancelLeave(id: ID!): LeaveApplication
    updateLeaveStatus(id: ID!, status: String!, role: String!): LeaveApplication
    
    # Tool for internal/admin use
    setLeaveBalance(employeeId: String!, leaveTypeId: String!, allotted: Float!): LeaveBalance
  }
`;

export default leaveTypeDefs;
