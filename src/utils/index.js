import dayjs from 'dayjs';
import { ATTENDANCE_LETTER, ATTENDANCE_COLOR, DAYS_SHORT } from '../constants';

// ===== Date Utilities =====
export const formatDate = (date, format = 'DD MMM YYYY') =>
  date ? dayjs(date).format(format) : '-';

export const formatDateShort = (date) => formatDate(date, 'DD/MM/YYYY');

export const getDaysInMonth = (year, month) => dayjs(`${year}-${month + 1}-01`).daysInMonth();

export const buildCalendarDays = (year, month) => {
  const daysCount = getDaysInMonth(year, month);
  return Array.from({ length: daysCount }, (_, i) => {
    const d = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
    return {
      day: i + 1,
      dayName: DAYS_SHORT[d.day()],
      date: d,
      isWeekend: d.day() === 0 || d.day() === 6,
    };
  });
};

export const getCurrentMonthYear = () => {
  const now = dayjs();
  return { month: now.month(), year: now.year() };
};

export const monthLabel = (month, year) => `${['January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${year}`;

// ===== Attendance Utilities =====
export const getAttendanceLetter = (status) => ATTENDANCE_LETTER[status] || '-';
export const getAttendanceColor = (status) => ATTENDANCE_COLOR[status] || '#9ca3af';

// ===== Status Badge Class =====
export const getStatusBadgeClass = (status) => {
  const map = {
    active: 'badge-active',
    inactive: 'badge-inactive',
    present: 'badge-present',
    absent: 'badge-absent',
    half_day: 'badge-half-day',
    leave: 'badge-leave',
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    cancelled: 'badge-cancelled',
  };
  return map[status?.toLowerCase()] || 'badge-inactive';
};

export const formatStatus = (status) => {
  if (!status) return '-';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ===== Name Utilities =====
export const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (name[0] || '').toUpperCase();
};

// ===== Employee ID Generator =====
let empIdCounter = 1001;
export const generateEmpId = (existingIds = []) => {
  const prefix = 'EMP';
  const maxExisting = existingIds
    .filter((id) => id?.startsWith(prefix))
    .map((id) => parseInt(id.replace(prefix, ''), 10))
    .filter(Boolean)
    .sort((a, b) => b - a)[0];
  const next = (maxExisting || empIdCounter - 1) + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

// ===== Number Utilities =====
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ===== File Utilities =====
export const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// ===== Debounce =====
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
