import { gql } from './apollo.js';

export const GET_APPROVALS = gql`
  query GetApprovals($filters: ApprovalFilters, $page: Int, $limit: Int) {
    approvals(filters: $filters, page: $page, limit: $limit) {
      data {
        _id
        type
        empId
        empName
        department
        approvalType
        requestedDate
        status
        leaveData {
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
        movementData {
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
      }
      total
      page
      totalPages
    }
  }
`;
