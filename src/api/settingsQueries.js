import { gql } from './apollo.js';

// ===== Departments =====
export const GET_DEPARTMENTS = gql`
  query ListDepartments {
    listDepartments { _id deptName shortName deptCode admin adminContact }
  }
`;
export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) { _id deptName shortName deptCode admin adminContact }
  }
`;
export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) { _id deptName shortName deptCode admin adminContact }
  }
`;
export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) { deleteDepartment(id: $id) { _id } }
`;

// ===== Designations =====
export const GET_DESIGNATIONS = gql`
  query ListDesignations { listDesignations { _id name } }
`;
export const CREATE_DESIGNATION = gql`
  mutation CreateDesignation($input: CreateDesignationInput!) {
    createDesignation(input: $input) { _id name }
  }
`;
export const UPDATE_DESIGNATION = gql`
  mutation UpdateDesignation($id: ID!, $input: UpdateDesignationInput!) {
    updateDesignation(id: $id, input: $input) { _id name }
  }
`;
export const DELETE_DESIGNATION = gql`
  mutation DeleteDesignation($id: ID!) { deleteDesignation(id: $id) { _id } }
`;

// ===== Employee Categories =====
export const GET_EMP_CATEGORIES = gql`
  query ListEmployeeCategories { listEmployeeCategories { _id name } }
`;
export const CREATE_EMP_CATEGORY = gql`
  mutation CreateEmployeeCategory($input: CreateEmployeeCategoryInput!) {
    createEmployeeCategory(input: $input) { _id name }
  }
`;
export const UPDATE_EMP_CATEGORY = gql`
  mutation UpdateEmployeeCategory($id: ID!, $input: UpdateEmployeeCategoryInput!) {
    updateEmployeeCategory(id: $id, input: $input) { _id name }
  }
`;
export const DELETE_EMP_CATEGORY = gql`
  mutation DeleteEmployeeCategory($id: ID!) { deleteEmployeeCategory(id: $id) { _id } }
`;

// ===== Employee Types =====
export const GET_EMP_TYPES = gql`
  query ListEmployeeTypes { listEmployeeTypes { _id name } }
`;
export const CREATE_EMP_TYPE = gql`
  mutation CreateEmployeeType($input: CreateEmployeeTypeInput!) {
    createEmployeeType(input: $input) { _id name }
  }
`;
export const UPDATE_EMP_TYPE = gql`
  mutation UpdateEmployeeType($id: ID!, $input: UpdateEmployeeTypeInput!) {
    updateEmployeeType(id: $id, input: $input) { _id name }
  }
`;
export const DELETE_EMP_TYPE = gql`
  mutation DeleteEmployeeType($id: ID!) { deleteEmployeeType(id: $id) { _id } }
`;

// ===== Leave Types =====
export const GET_LEAVE_TYPES = gql`
  query ListLeaveTypes { listLeaveTypes { _id leaveCode leaveName category maxConsecutiveDays } }
`;
export const CREATE_LEAVE_TYPE = gql`
  mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
    createLeaveType(input: $input) { _id leaveCode leaveName category maxConsecutiveDays }
  }
`;
export const UPDATE_LEAVE_TYPE = gql`
  mutation UpdateLeaveType($id: ID!, $input: UpdateLeaveTypeInput!) {
    updateLeaveType(id: $id, input: $input) { _id leaveCode leaveName category maxConsecutiveDays }
  }
`;
export const DELETE_LEAVE_TYPE = gql`
  mutation DeleteLeaveType($id: ID!) { deleteLeaveType(id: $id) { _id } }
`;

// ===== Movement Settings =====
export const GET_MOVEMENT_SETTING = gql`
  query GetMovementSetting { getMovementSetting { _id limitCount limitFrequency maxDurationMinutes daysBeforeApply autoApprovalEnabled } }
`;
export const UPSERT_MOVEMENT_SETTING = gql`
  mutation UpsertMovementSetting($input: UpdateMovementSettingInput!) {
    upsertMovementSetting(input: $input) { _id limitCount limitFrequency maxDurationMinutes daysBeforeApply autoApprovalEnabled }
  }
`;
