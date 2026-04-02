import { gql } from './apollo.js';

// ===== QUERIES =====
export const GET_ATTENDANCE_MONTHLY_GRID = gql`
  query GetAttendanceMonthlyGrid($month: Int!, $year: Int!, $filters: AttendanceFilters, $page: Int, $limit: Int) {
    attendanceMonthlyGrid(month: $month, year: $year, filters: $filters, page: $page, limit: $limit) {
      employees {
        empId
        empName
        department
        designation
        days {
          date
          status
        }
      }
      total
      page
      totalPages
    }
  }
`;

export const GET_EMPLOYEE_ATTENDANCE = gql`
  query GetEmployeeAttendance($empId: String!, $month: Int!, $year: Int!) {
    employeeAttendance(empId: $empId, month: $month, year: $year) {
      date
      checkIn
      checkOut
      status
      lateMinutes
    }
  }
`;

export const GET_ATTENDANCE_SUMMARY = gql`
  query GetAttendanceSummary($empId: String!, $month: Int!, $year: Int!) {
    attendanceSummary(empId: $empId, month: $month, year: $year) {
      totalPresent
      totalAbsent
      totalHalfDay
      totalLeave
      totalLateMinutes
      balanceMinutes
    }
  }
`;
