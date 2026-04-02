import { gql } from './apollo.js';

export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary($date: String) {
    dashboardSummary(date: $date) {
      date
      totalEmployees
      present
      absent
      halfDay
      onLeave
      pendingLeaves
      pendingMovements
      pendingApprovals
      onLeaveToday {
        empId
        name
        department
        leaveType
      }
      birthdays {
        empId
        name
        dob
        department
      }
      anniversaries {
        empId
        name
        doj
        years
        department
      }
      newHires {
        empId
        name
        doj
        department
        designation
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      pendingApprovals
      pendingLeaves
      pendingMovements
    }
  }
`;
