# HRMS Backend — GraphQL API

A standalone Node.js GraphQL API backend for the HRMS College Admin application.

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express + Apollo Server 4
- **Database**: MongoDB (Mongoose 8)
- **API**: GraphQL (single `/graphql` endpoint)

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or an Atlas URI

### 2. Install Dependencies
```bash
cd hrms-backend
npm install
```

### 3. Configure Environment
The `.env` file is already created with default values:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/hrms_college
```
Update `MONGODB_URI` if you're using MongoDB Atlas.

### 4. Seed the Database
Populates Settings (Departments, Designations, etc.) with initial college data:
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:4000/graphql**
Apollo Sandbox (browser UI): open that URL in any browser

---

## API Modules

### Settings Module
| Entity | Queries | Mutations |
|---|---|---|
| Department | `listDepartments`, `getDepartment` | `createDepartment`, `updateDepartment`, `deleteDepartment`, `restoreDepartment` |
| Designation | `listDesignations`, `getDesignation` | `createDesignation`, `updateDesignation`, `deleteDesignation`, `restoreDesignation` |
| EmployeeCategory | `listEmployeeCategories` | `createEmployeeCategory`, `updateEmployeeCategory`, `deleteEmployeeCategory` |
| EmployeeType | `listEmployeeTypes` | `createEmployeeType`, `updateEmployeeType`, `deleteEmployeeType` |
| LeaveType | `listLeaveTypes` | `createLeaveType`, `updateLeaveType`, `deleteLeaveType` |
| MovementSetting | `getMovementSetting` | `upsertMovementSetting` |

### Employee Module
| Query | Description |
|---|---|
| `listEmployees(filter, page, limit)` | Paginated, filterable, searchable list |
| `getEmployee(id)` | Full employee detail with nested refs |
| `countEmployees(filter)` | Count for pagination |

| Mutation | Description |
|---|---|
| `createEmployee(input)` | Creates with auto-generated empId + cross-entity validation |
| `updateEmployee(id, input)` | Updates with cross-entity validation |
| `deleteEmployee(id)` | Soft deletes (isDeleted=true, status=inactive) |
| `restoreEmployee(id)` | Restores deleted employee |

---

## Example Queries

### List all departments
```graphql
query {
  listDepartments {
    _id
    deptName
    shortName
    deptCode
  }
}
```

### Create an employee
```graphql
mutation {
  createEmployee(input: {
    firstName: "Arjun"
    lastName: "Sharma"
    email: "arjun@college.edu"
    mobile: "9876543210"
    departmentId: "<dept_id>"
    designationId: "<desig_id>"
    doj: "2024-06-01"
  }) {
    _id
    empId
    name
    department { deptName }
    designation { name }
  }
}
```
