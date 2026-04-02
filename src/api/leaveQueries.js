import { gql } from './apollo.js';

export const GET_LEAVE_BALANCES = gql`
  query GetLeaveBalances($employeeId: String!) {
    getLeaveBalances(employeeId: $employeeId) {
      _id
      leaveTypeId
      allotted
      consumed
      remaining
      leaveType {
        _id
        leaveName
        leaveCode
        maxConsecutiveDays
      }
    }
  }
`;

export const GET_LEAVE_APPLICATIONS = gql`
  query ListLeaveApplications($filter: JSON, $page: Int, $limit: Int) {
    listLeaveApplications(filter: $filter, page: $page, limit: $limit) {
      employees {
        _id
        employeeId
        leaveTypeId
        fromDate
        toDate
        reason
        totalDays
        status
        deptAdminApproval
        adminApproval
        created_at
        employee {
          _id
          empId
          name
          designation { name }
          department { deptName }
        }
        leaveType {
          _id
          leaveName
          leaveCode
        }
        days {
          date
          dayType
        }
      }
      total
      page
      totalPages
    }
  }
`;

export const GET_LEAVE_APPLICATION = gql`
  query GetLeaveApplication($id: ID!) {
    getLeaveApplication(id: $id) {
      _id
      employeeId
      leaveTypeId
      fromDate
      toDate
      reason
      totalDays
      status
      deptAdminApproval
      adminApproval
      document
      created_at
      employee {
        _id
        empId
        name
        designation { name }
        department { deptName }
      }
      leaveType {
        _id
        leaveName
        leaveCode
      }
      days {
        date
        dayType
      }
    }
  }
`;

export const APPLY_LEAVE = gql`
  mutation ApplyLeave($input: ApplyLeaveInput!) {
    applyLeave(input: $input) {
      _id
      status
    }
  }
`;

export const UPDATE_LEAVE = gql`
  mutation UpdateLeave($input: UpdateLeaveInput!) {
    updateLeave(input: $input) {
      _id
      status
    }
  }
`;

export const CANCEL_LEAVE = gql`
  mutation CancelLeave($id: ID!) {
    cancelLeave(id: $id) {
      _id
      status
    }
  }
`;

export const UPDATE_LEAVE_STATUS = gql`
  mutation UpdateLeaveStatus($id: ID!, $status: String!, $role: String!) {
    updateLeaveStatus(id: $id, status: $status, role: $role) {
      _id
      status
      deptAdminApproval
      adminApproval
    }
  }
`;
