import { gql } from './apollo.js';

export const GET_MOVEMENTS = gql`
  query GetMovements($filters: MovementFilters, $page: Int, $limit: Int) {
    movements(filters: $filters, page: $page, limit: $limit) {
      data {
        _id
        empId
        empName
        department
        movementDate
        movementTime
        startTime
        endTime
        reason
        status
        reqDate
      }
      total
      page
      totalPages
    }
  }
`;

export const GET_EMPLOYEE_MOVEMENTS = gql`
  query GetEmployeeMovements($empId: ID!, $page: Int, $limit: Int) {
    employeeMovements(empId: $empId, page: $page, limit: $limit) {
      data {
        _id
        empId
        empName
        department
        movementDate
        movementTime
        startTime
        endTime
        reason
        status
        reqDate
      }
      total
      page
      totalPages
    }
  }
`;

export const CREATE_MOVEMENT = gql`
  mutation CreateMovement($input: CreateMovementInput!) {
    createMovement(input: $input) { _id status reqDate }
  }
`;

export const UPDATE_MOVEMENT = gql`
  mutation UpdateMovement($id: ID!, $input: UpdateMovementInput!) {
    updateMovement(id: $id, input: $input) { _id status }
  }
`;

export const CANCEL_MOVEMENT = gql`
  mutation CancelMovement($id: ID!) { cancelMovement(id: $id) { _id status } }
`;
