import gql from 'graphql-tag';

const employeeTypeDefs = gql`
  type Address {
    address1: String
    address2: String
    country: String
    state: String
    city: String
    pincode: String
  }

  type BankAccount {
    _id: ID
    accountCategory: String!
    accountType: String
    accountNo: String
    bankName: String
    ifsc: String
  }

  type Employee {
    _id: ID!
    empId: String!
    title: String
    firstName: String!
    lastName: String!
    name: String
    email: String!
    mobile: String!

    # Work
    departmentId: ID
    department: Department
    academicDept: String
    designationId: ID
    designation: Designation
    doj: String
    empTypeId: ID
    empType: EmployeeType
    empSubType: String
    empCategoryId: ID
    empCategory: EmployeeCategory
    hiringSource: String
    expYears: Int
    expMonths: Int
    qualification: String
    reportingTo: ID
    reportingEmployee: Employee
    status: String

    # Personal
    fatherName: String
    aadhaar: String
    pan: String
    passport: String
    pfNumber: String
    esicNumber: String
    dob: String
    bloodGroup: String
    gender: String
    maritalStatus: String
    religion: String
    caste: String
    personalCategory: String

    # Contact
    secondaryEmail: String
    secondaryContact: String
    scholarLink: String
    linkedinLink: String
    address: Address

    # Bank
    bankAccounts: [BankAccount]

    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  input AddressInput {
    address1: String
    address2: String
    country: String
    state: String
    city: String
    pincode: String
  }

  input BankAccountInput {
    accountCategory: String!
    accountType: String
    accountNo: String
    bankName: String
    ifsc: String
  }

  input CreateEmployeeInput {
    title: String
    firstName: String!
    lastName: String!
    email: String!
    mobile: String!
    departmentId: ID
    academicDept: String
    designationId: ID
    doj: String
    empTypeId: ID
    empSubType: String
    empCategoryId: ID
    hiringSource: String
    expYears: Int
    expMonths: Int
    qualification: String
    reportingTo: ID
    fatherName: String
    aadhaar: String
    pan: String
    passport: String
    pfNumber: String
    esicNumber: String
    dob: String
    bloodGroup: String
    gender: String
    maritalStatus: String
    religion: String
    caste: String
    personalCategory: String
    secondaryEmail: String
    secondaryContact: String
    scholarLink: String
    linkedinLink: String
    address: AddressInput
    bankAccounts: [BankAccountInput]
  }

  input UpdateEmployeeInput {
    title: String
    firstName: String
    lastName: String
    email: String
    mobile: String
    departmentId: ID
    academicDept: String
    designationId: ID
    doj: String
    empTypeId: ID
    empSubType: String
    empCategoryId: ID
    hiringSource: String
    expYears: Int
    expMonths: Int
    qualification: String
    reportingTo: ID
    status: String
    fatherName: String
    aadhaar: String
    pan: String
    passport: String
    pfNumber: String
    esicNumber: String
    dob: String
    bloodGroup: String
    gender: String
    maritalStatus: String
    religion: String
    caste: String
    personalCategory: String
    secondaryEmail: String
    secondaryContact: String
    scholarLink: String
    linkedinLink: String
    address: AddressInput
    bankAccounts: [BankAccountInput]
  }

  input EmployeeFilterInput {
    status: String
    departmentId: ID
    designationId: ID
    empTypeId: ID
    empCategoryId: ID
    search: String
  }

  extend type Query {
    listEmployees(filter: EmployeeFilterInput, page: Int, limit: Int): EmployeeListResult!
    getEmployee(id: ID!): Employee
    countEmployees(filter: EmployeeFilterInput): Int!
  }

  type EmployeeListResult {
    employees: [Employee!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Employee!
    restoreEmployee(id: ID!): Employee!
  }
`;

export default employeeTypeDefs;
