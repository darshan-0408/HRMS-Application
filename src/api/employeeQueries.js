import { gql } from './apollo.js';

export const LIST_EMPLOYEES = gql`
  query ListEmployees($filter: EmployeeFilterInput, $page: Int, $limit: Int) {
    listEmployees(filter: $filter, page: $page, limit: $limit) {
      total
      page
      totalPages
      employees {
        _id
        empId
        firstName
        lastName
        name
        email
        mobile
        status
        department { _id deptName }
        designation { _id name }
        empType { _id name }
        empCategory { _id name }
        doj
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      _id empId title
      firstName lastName name
      email mobile
      departmentId department { _id deptName }
      academicDept
      designationId designation { _id name }
      doj
      empTypeId empType { _id name }
      empSubType
      empCategoryId empCategory { _id name }
      hiringSource
      expYears expMonths qualification
      reportingTo reportingEmployee { _id name empId }
      status
      fatherName aadhaar pan passport pfNumber esicNumber
      dob bloodGroup gender maritalStatus religion caste personalCategory
      secondaryEmail secondaryContact scholarLink linkedinLink
      address { address1 address2 country state city pincode }
      bankAccounts { _id accountCategory accountType accountNo bankName ifsc }
      createdAt updatedAt
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      _id empId firstName lastName name email mobile status
      department { deptName } designation { name }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      _id empId firstName lastName name email mobile status
      department { deptName } designation { name }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) { deleteEmployee(id: $id) { _id status } }
`;

export const COUNT_EMPLOYEES = gql`
  query CountEmployees($filter: EmployeeFilterInput) { countEmployees(filter: $filter) }
`;
