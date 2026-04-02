// Status Maps
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half_day',
  LEAVE: 'leave',
  PENDING: 'pending',
};

export const ATTENDANCE_LETTER = {
  present: 'P',
  absent: 'A',
  half_day: 'H',
  leave: 'L',
  pending: '?',
  holiday: 'Ho',
  week_off: 'W',
};

export const ATTENDANCE_COLOR = {
  present: '#10b981',
  absent: '#ef4444',
  half_day: '#f59e0b',
  leave: '#6366f1',
  pending: '#9ca3af',
  holiday: '#3b82f6',
  week_off: '#6b7280',
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const MOVEMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const APPROVAL_TYPE = {
  LEAVE: 'leave',
  MOVEMENT: 'movement',
};

export const LEAVE_CATEGORY = {
  PAID: 'paid',
  UNPAID: 'unpaid',
};

// Route Paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  ATTENDANCE: '/attendance',
  LEAVE_APPLICATIONS: '/leave-applications',
  MOVEMENT_REGISTER: '/movement-register',
  APPROVALS: '/approvals',
  SETTINGS: '/settings',
  SETTINGS_LEAVE_TYPES: '/settings/leave-types',
  SETTINGS_DEPARTMENTS: '/settings/departments',
  SETTINGS_DESIGNATIONS: '/settings/designations',
  SETTINGS_EMP_CATEGORY: '/settings/emp-category',
  SETTINGS_EMP_TYPE: '/settings/emp-type',
  SETTINGS_MOVEMENT: '/settings/movement',
};

// Months
export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const MONTHS_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

export const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
