import gql from 'graphql-tag';

export default gql`
  type Movement {
    _id: ID!
    empId: String
    empName: String
    department: String
    movementDate: String
    movementTime: String
    startTime: String
    endTime: String
    reason: String
    status: String
    reqDate: String
  }

  type PaginatedMovements {
    data: [Movement!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  input MovementFilters {
    status: String
    employeeId: ID
    search: String
    department: String
    month: String
  }

  input CreateMovementInput {
    employeeId: ID!
    movementDate: String!
    startTime: String!
    endTime: String!
    reason: String!
  }

  input UpdateMovementInput {
    startTime: String
    endTime: String
    reason: String
  }

  extend type Query {
    movements(filters: MovementFilters, page: Int = 1, limit: Int = 10): PaginatedMovements!
    employeeMovements(empId: ID!, page: Int = 1, limit: Int = 10): PaginatedMovements!
  }

  extend type Mutation {
    createMovement(input: CreateMovementInput!): Movement!
    updateMovement(id: ID!, input: UpdateMovementInput!): Movement!
    cancelMovement(id: ID!): Movement!
  }
`;
