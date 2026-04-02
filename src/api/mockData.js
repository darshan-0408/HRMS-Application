// ===== MOCK DATA — Replace service function bodies with api.get/post/etc =====

import dayjs from 'dayjs';

// --- Departments ---
export const mockDepartments = [
  { _id: 'd1', deptName: 'Engineering', shortName: 'ENG', deptCode: 'D001', admin: 'Ravi Kumar', adminContact: '9876543210' },
  { _id: 'd2', deptName: 'Human Resources', shortName: 'HR', deptCode: 'D002', admin: 'Priya Singh', adminContact: '9876543211' },
  { _id: 'd3', deptName: 'Finance', shortName: 'FIN', deptCode: 'D003', admin: 'Anand Raj', adminContact: '9876543212' },
  { _id: 'd4', deptName: 'Marketing', shortName: 'MKT', deptCode: 'D004', admin: 'Sneha Patel', adminContact: '9876543213' },
  { _id: 'd5', deptName: 'Operations', shortName: 'OPS', deptCode: 'D005', admin: 'Kiran Mehta', adminContact: '9876543214' },
];

// --- Designations ---
export const mockDesignations = [
  { _id: 'dg1', name: 'Software Engineer' },
  { _id: 'dg2', name: 'Senior Software Engineer' },
  { _id: 'dg3', name: 'Team Lead' },
  { _id: 'dg4', name: 'HR Executive' },
  { _id: 'dg5', name: 'Manager' },
  { _id: 'dg6', name: 'Finance Analyst' },
  { _id: 'dg7', name: 'Marketing Executive' },
  { _id: 'dg8', name: 'Operations Manager' },
];

// --- Employee Categories ---
export const mockEmpCategories = [
  { _id: 'ec1', name: 'Permanent' },
  { _id: 'ec2', name: 'Contract' },
  { _id: 'ec3', name: 'Intern' },
  { _id: 'ec4', name: 'Consultant' },
];

// --- Employee Types ---
export const mockEmpTypes = [
  { _id: 'et1', name: 'Full-time' },
  { _id: 'et2', name: 'Part-time' },
  { _id: 'et3', name: 'Remote' },
];

// --- Leave Types ---
export const mockLeaveTypes = [
  { _id: 'lt1', leaveCode: 'CL', leaveName: 'Casual Leave', category: 'paid', maxConsecutiveDays: 3 },
  { _id: 'lt2', leaveCode: 'SL', leaveName: 'Sick Leave', category: 'paid', maxConsecutiveDays: 7 },
  { _id: 'lt3', leaveCode: 'EL', leaveName: 'Earned Leave', category: 'paid', maxConsecutiveDays: 15 },
  { _id: 'lt4', leaveCode: 'LOP', leaveName: 'Loss of Pay', category: 'unpaid', maxConsecutiveDays: 30 },
  { _id: 'lt5', leaveCode: 'ML', leaveName: 'Maternity Leave', category: 'paid', maxConsecutiveDays: 90 },
];

// --- Employees ---
export const mockEmployees = [
  {
    _id: 'e1', empId: 'EMP1001', firstName: 'Arjun', lastName: 'Sharma', name: 'Arjun Sharma', status: 'active',
    designation: 'Software Engineer', designationId: 'dg1',
    department: 'Engineering', departmentId: 'd1',
    mobile: '9876501001', email: 'arjun.sharma@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2022-06-01', dob: '1995-04-15',
    gender: 'Male', bloodGroup: 'B+',
    fatherName: 'Rajesh Sharma', aadhaar: '1234-5678-9012', pan: 'ABCDE1234F',
    bankDetails: {
      primary: { accountType: 'Savings', accountNo: '40012345678', bankName: 'HDFC Bank', ifsc: 'HDFC0001234' },
      secondary: { accountType: '', accountNo: '', bankName: '', ifsc: '' }
    },
    address1: '12 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', country: 'India'
  },
  {
    _id: 'e2', empId: 'EMP1002', firstName: 'Priya', lastName: 'Nair', name: 'Priya Nair', status: 'active',
    designation: 'HR Executive', designationId: 'dg4',
    department: 'Human Resources', departmentId: 'd2',
    mobile: '9876501002', email: 'priya.nair@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2021-03-15', dob: '1993-07-22',
    gender: 'Female', bloodGroup: 'O+',
    bankDetails: {
      primary: { accountType: 'Savings', accountNo: '50023456789', bankName: 'SBI', ifsc: 'SBIN0002345' },
      secondary: { accountType: '', accountNo: '', bankName: '', ifsc: '' }
    },
    address1: '45 Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', country: 'India'
  },
  {
    _id: 'e3', empId: 'EMP1003', name: 'Rahul Gupta', status: 'active',
    designation: 'Finance Analyst', designationId: 'dg6',
    department: 'Finance', departmentId: 'd3',
    mobile: '9876501003', email: 'rahul.gupta@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2020-11-01', dob: '1990-12-05',
    gender: 'Male', bloodGroup: 'A+',
    personalEmail: 'rahul.gupta@gmail.com',
    address: { street: '7 Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', country: 'India' },
    emergencyContact: { name: 'Sunita Gupta', relation: 'Mother', mobile: '9876502003' },
    bank: { accountNo: '60034567890', bankName: 'ICICI Bank', ifscCode: 'ICIC0003456', branch: 'Connaught Place, Delhi' },
    workDetails: { reportingManager: 'Anand Raj', workLocation: 'Delhi Office', shift: 'General (9 AM - 6 PM)', weeklyOff: 'Saturday, Sunday' },
    annualCtc: '₹7,20,000',
  },
  {
    _id: 'e4', empId: 'EMP1004', name: 'Sneha Reddy', status: 'inactive',
    designation: 'Marketing Executive', designationId: 'dg7',
    department: 'Marketing', departmentId: 'd4',
    mobile: '9876501004', email: 'sneha.reddy@college.edu',
    empCategory: 'Contract', empCategoryId: 'ec2',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2023-01-10', dob: '1997-09-30',
    gender: 'Female', bloodGroup: 'AB-',
    personalEmail: 'sneha.reddy@gmail.com',
    address: { street: '22 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
    emergencyContact: { name: 'Ramesh Reddy', relation: 'Father', mobile: '9876502004' },
    bank: { accountNo: '70045678901', bankName: 'Axis Bank', ifscCode: 'UTIB0004567', branch: 'Jubilee Hills, Hyderabad' },
    workDetails: { reportingManager: 'Sneha Patel', workLocation: 'Hyderabad Office', shift: 'General (9 AM - 6 PM)', weeklyOff: 'Sunday' },
    annualCtc: '₹4,00,000',
  },
  {
    _id: 'e5', empId: 'EMP1005', name: 'Vikram Joshi', status: 'active',
    designation: 'Team Lead', designationId: 'dg3',
    department: 'Engineering', departmentId: 'd1',
    mobile: '9876501005', email: 'vikram.joshi@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2019-07-22', dob: '1988-03-11',
    gender: 'Male', bloodGroup: 'O-',
    personalEmail: 'vikram.joshi@gmail.com',
    address: { street: '33 Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', country: 'India' },
    emergencyContact: { name: 'Meera Joshi', relation: 'Spouse', mobile: '9876502005' },
    bank: { accountNo: '80056789012', bankName: 'HDFC Bank', ifscCode: 'HDFC0005678', branch: 'Koregaon Park, Pune' },
    workDetails: { reportingManager: 'Ravi Kumar', workLocation: 'Pune Office', shift: 'General (9 AM - 6 PM)', weeklyOff: 'Saturday, Sunday' },
    annualCtc: '₹14,00,000',
  },
  {
    _id: 'e6', empId: 'EMP1006', name: 'Ananya Das', status: 'active',
    designation: 'Senior Software Engineer', designationId: 'dg2',
    department: 'Engineering', departmentId: 'd1',
    mobile: '9876501006', email: 'ananya.das@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Remote', empTypeId: 'et3',
    doj: '2021-09-01', dob: '1992-06-28',
    gender: 'Female', bloodGroup: 'B-',
    personalEmail: 'ananya.das@gmail.com',
    address: { street: '5 Salt Lake', city: 'Kolkata', state: 'West Bengal', pincode: '700064', country: 'India' },
    emergencyContact: { name: 'Subhash Das', relation: 'Father', mobile: '9876502006' },
    bank: { accountNo: '90067890123', bankName: 'SBI', ifscCode: 'SBIN0006789', branch: 'Salt Lake, Kolkata' },
    workDetails: { reportingManager: 'Vikram Joshi', workLocation: 'Remote', shift: 'Flexible', weeklyOff: 'Saturday, Sunday' },
    annualCtc: '₹11,00,000',
  },
  {
    _id: 'e7', empId: 'EMP1007', name: 'Sanjay Mehta', status: 'active',
    designation: 'Operations Manager', designationId: 'dg8',
    department: 'Operations', departmentId: 'd5',
    mobile: '9876501007', email: 'sanjay.mehta@college.edu',
    empCategory: 'Permanent', empCategoryId: 'ec1',
    empType: 'Full-time', empTypeId: 'et1',
    doj: '2018-02-14', dob: '1985-11-20',
    gender: 'Male', bloodGroup: 'A-',
    personalEmail: 'sanjay.mehta@gmail.com',
    address: { street: '14 Nariman Point', city: 'Mumbai', state: 'Maharashtra', pincode: '400021', country: 'India' },
    emergencyContact: { name: 'Lata Mehta', relation: 'Wife', mobile: '9876502007' },
    bank: { accountNo: '10078901234', bankName: 'Axis Bank', ifscCode: 'UTIB0007890', branch: 'Nariman Point, Mumbai' },
    workDetails: { reportingManager: 'Kiran Mehta', workLocation: 'Mumbai HQ', shift: 'General (9 AM - 6 PM)', weeklyOff: 'Sunday' },
    annualCtc: '₹18,00,000',
  },
  {
    _id: 'e8', empId: 'EMP1008', name: 'Kavitha Pillai', status: 'active',
    designation: 'HR Executive', designationId: 'dg4',
    department: 'Human Resources', departmentId: 'd2',
    mobile: '9876501008', email: 'kavitha.pillai@college.edu',
    empCategory: 'Intern', empCategoryId: 'ec3',
    empType: 'Part-time', empTypeId: 'et2',
    doj: '2025-12-01', dob: '2001-01-15',
    gender: 'Female', bloodGroup: 'O+',
    personalEmail: 'kavitha.pillai@gmail.com',
    address: { street: '8 Vyttila', city: 'Kochi', state: 'Kerala', pincode: '682019', country: 'India' },
    emergencyContact: { name: 'Suresh Pillai', relation: 'Father', mobile: '9876502008' },
    bank: { accountNo: '20089012345', bankName: 'Federal Bank', ifscCode: 'FDRL0008901', branch: 'Vyttila, Kochi' },
    workDetails: { reportingManager: 'Priya Nair', workLocation: 'Kochi Office', shift: 'Morning (9 AM - 1 PM)', weeklyOff: 'Saturday, Sunday' },
    annualCtc: '₹1,80,000',
  },
];

// --- Attendance (per employee, current month) ---
export const generateMockAttendance = (empId, year, month) => {
  const statuses = ['present', 'present', 'present', 'absent', 'half_day', 'leave', 'pending', 'present'];
  const days = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`).daysInMonth();
  return Array.from({ length: days }, (_, i) => {
    const d = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
    const isWeekend = d.day() === 0 || d.day() === 6;
    const status = isWeekend ? 'week_off' : statuses[Math.floor(Math.random() * statuses.length)];
    const checkIn = status === 'present' ? `09:${String(Math.floor(Math.random() * 20)).padStart(2, '0')}` : status === 'half_day' ? '09:30' : null;
    const checkOut = status === 'present' ? `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : status === 'half_day' ? '13:00' : null;
    const lateMinutes = checkIn && checkIn > '09:05' ? parseInt(checkIn.split(':')[1]) : 0;
    return { date: d.format('YYYY-MM-DD'), checkIn, checkOut, status, lateMinutes };
  });
};

// --- Leave Applications ---
export const mockLeaves = [
  { _id: 'lv1', empId: 'EMP1001', empName: 'Arjun Sharma', department: 'Engineering', leaveType: 'Casual Leave', leaveCode: 'CL', fromDate: '2026-03-05', toDate: '2026-03-06', noOfDays: 2, reason: 'Personal work', docUrl: null, deptAdminApproval: 'approved', adminApproval: 'approved', status: 'approved', reqDate: '2026-03-03' },
  { _id: 'lv2', empId: 'EMP1002', empName: 'Priya Nair', department: 'Human Resources', leaveType: 'Sick Leave', leaveCode: 'SL', fromDate: '2026-03-08', toDate: '2026-03-08', noOfDays: 1, reason: 'Fever', docUrl: 'medical_cert.pdf', deptAdminApproval: 'approved', adminApproval: 'pending', status: 'pending', reqDate: '2026-03-07' },
  { _id: 'lv3', empId: 'EMP1003', empName: 'Rahul Gupta', department: 'Finance', leaveType: 'Earned Leave', leaveCode: 'EL', fromDate: '2026-03-12', toDate: '2026-03-14', noOfDays: 3, reason: 'Family trip', docUrl: null, deptAdminApproval: 'pending', adminApproval: 'pending', status: 'pending', reqDate: '2026-03-09' },
  { _id: 'lv4', empId: 'EMP1005', empName: 'Vikram Joshi', department: 'Engineering', leaveType: 'Casual Leave', leaveCode: 'CL', fromDate: '2026-02-20', toDate: '2026-02-21', noOfDays: 2, reason: 'Personal', docUrl: null, deptAdminApproval: 'approved', adminApproval: 'rejected', status: 'rejected', reqDate: '2026-02-18' },
  { _id: 'lv5', empId: 'EMP1006', empName: 'Ananya Das', department: 'Engineering', leaveType: 'Loss of Pay', leaveCode: 'LOP', fromDate: '2026-03-18', toDate: '2026-03-20', noOfDays: 3, reason: 'Extended leave', docUrl: null, deptAdminApproval: 'pending', adminApproval: 'pending', status: 'pending', reqDate: '2026-03-10' },
];

// --- Movements ---
export const mockMovements = [
  { _id: 'mv1', empId: 'EMP1001', empName: 'Arjun Sharma', department: 'Engineering', movementDate: '2026-03-05', movementTime: '11:00 AM - 01:00 PM', reason: 'Client meeting at downtown office', status: 'approved', reqDate: '2026-03-04' },
  { _id: 'mv2', empId: 'EMP1002', empName: 'Priya Nair', department: 'Human Resources', movementDate: '2026-03-07', movementTime: '02:00 PM - 04:00 PM', reason: 'Recruitment event at college', status: 'pending', reqDate: '2026-03-06' },
  { _id: 'mv3', empId: 'EMP1003', empName: 'Rahul Gupta', department: 'Finance', movementDate: '2026-03-09', movementTime: '10:00 AM - 12:00 PM', reason: 'Bank visit for college account', status: 'approved', reqDate: '2026-03-08' },
  { _id: 'mv4', empId: 'EMP1007', empName: 'Sanjay Mehta', department: 'Operations', movementDate: '2026-03-10', movementTime: '09:00 AM - 11:00 AM', reason: 'Vendor meeting', status: 'rejected', reqDate: '2026-03-09' },
  { _id: 'mv5', empId: 'EMP1005', empName: 'Vikram Joshi', department: 'Engineering', movementDate: '2026-03-11', movementTime: '03:00 PM - 05:00 PM', reason: 'Tech conference', status: 'pending', reqDate: '2026-03-10' },
];

// --- Approvals ---
export const mockApprovals = [
  { _id: 'ap1', empId: 'EMP1002', empName: 'Priya Nair', department: 'Human Resources', approvalType: 'leave', refId: 'lv2', reqDate: '2026-03-07', status: 'pending', details: mockLeaves.find(l => l._id === 'lv2') },
  { _id: 'ap2', empId: 'EMP1003', empName: 'Rahul Gupta', department: 'Finance', approvalType: 'leave', refId: 'lv3', reqDate: '2026-03-09', status: 'pending', details: mockLeaves.find(l => l._id === 'lv3') },
  { _id: 'ap3', empId: 'EMP1006', empName: 'Ananya Das', department: 'Engineering', approvalType: 'leave', refId: 'lv5', reqDate: '2026-03-10', status: 'pending', details: mockLeaves.find(l => l._id === 'lv5') },
  { _id: 'ap4', empId: 'EMP1002', empName: 'Priya Nair', department: 'Human Resources', approvalType: 'movement', refId: 'mv2', reqDate: '2026-03-06', status: 'pending', details: mockMovements.find(m => m._id === 'mv2') },
  { _id: 'ap5', empId: 'EMP1005', empName: 'Vikram Joshi', department: 'Engineering', approvalType: 'movement', refId: 'mv5', reqDate: '2026-03-10', status: 'pending', details: mockMovements.find(m => m._id === 'mv5') },
  { _id: 'ap6', empId: 'EMP1001', empName: 'Arjun Sharma', department: 'Engineering', approvalType: 'leave', refId: 'lv1', reqDate: '2026-03-03', status: 'approved', details: mockLeaves.find(l => l._id === 'lv1') },
];

// --- Dashboard Snapshot ---
export const mockDashboardSummary = {
  date: new Date().toISOString().split('T')[0],
  totalEmployees: mockEmployees.length,
  present: 5,
  absent: 1,
  halfDay: 1,
  onLeave: 1,
  onLeaveToday: [
    { empId: 'EMP1002', name: 'Priya Nair', department: 'Human Resources', leaveType: 'Sick Leave' },
  ],
  pendingLeaves: mockLeaves.filter(l => l.status === 'pending').length,
  pendingMovements: mockMovements.filter(m => m.status === 'pending').length,
  pendingApprovals: mockApprovals.filter(a => a.status === 'pending').length,
  birthdays: [
    { empId: 'EMP1002', name: 'Priya Nair', dob: '1993-03-10', department: 'Human Resources' },
  ],
  anniversaries: [
    { empId: 'EMP1005', name: 'Vikram Joshi', doj: '2019-03-10', years: 7, department: 'Engineering' },
  ],
  newHires: [
    { empId: 'EMP1008', name: 'Kavitha Pillai', doj: '2025-12-01', department: 'Human Resources', designation: 'HR Executive' },
  ],
};

// --- Movement Settings ---
export const mockMovementSettings = {
  maxDuration: 4,
  daysBeforeApply: 1,
  limitFrequency: 'monthly',
  limitCount: 3,
};
