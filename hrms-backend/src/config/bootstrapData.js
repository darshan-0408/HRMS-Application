export const DEFAULT_DEPARTMENTS = [
  { deptName: 'Computer Science', shortName: 'CS', deptCode: 'CS101' },
  { deptName: 'Human Resources', shortName: 'HR', deptCode: 'HR101' },
  { deptName: 'Administration', shortName: 'ADMIN', deptCode: 'ADM101' },
];

export const DEFAULT_LEAVE_TYPES = [
  { leaveCode: 'CL', leaveName: 'Casual Leave', category: 'paid', maxConsecutiveDays: 3 },
  { leaveCode: 'SL', leaveName: 'Sick Leave', category: 'paid', maxConsecutiveDays: 7 },
  { leaveCode: 'EL', leaveName: 'Earned Leave', category: 'paid', maxConsecutiveDays: 15 },
];

export const DEFAULT_DESIGNATIONS = [
  { name: 'Professor' },
  { name: 'Lecturer' },
  { name: 'Administrator' },
];

export const DEFAULT_EMPLOYEE_TYPES = [
  { name: 'Teaching' },
  { name: 'Non-Teaching' },
];
