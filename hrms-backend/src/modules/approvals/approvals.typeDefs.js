import gql from 'graphql-tag';

export default gql`
  type ApprovalItem {
    _id: ID!
    type: String!
    empId: String
    empName: String
    department: String
    approvalType: String!
    requestedDate: String
    status: String!
    # Raw data for sliders
    leaveData: LeaveApplication
    movementData: Movement
  }

  type PaginatedApprovals {
    data: [ApprovalItem!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  input ApprovalFilters {
    search: String
    department: String
    status: String
    approvalType: String
  }

  extend type Query {
    approvals(filters: ApprovalFilters, page: Int = 1, limit: Int = 10): PaginatedApprovals!
  }
`;
