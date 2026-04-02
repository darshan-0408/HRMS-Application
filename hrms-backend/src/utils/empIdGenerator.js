import Employee from '../modules/employee/Employee.model.js';

/**
 * Auto-generates next employee ID starting from 1001 for each tenant.
 * Format: em1001, em1002, etc.
 * 
 * Note: The tenant isolation is handled automatically by the Employee model's tenantPlugin.
 */
export const generateEmpId = async () => {
  // Find the last created employee to determine the next ID
  // Sort by createdAt descending to get the most recent one
  const lastEmployee = await Employee.findOne({}, { empId: 1 })
    .sort({ createdAt: -1 }) 
    .lean();

  if (!lastEmployee || !lastEmployee.empId) {
    return 'em1001';
  }

  // Extract the numeric part (e.g., "em1001" -> 1001)
  const match = lastEmployee.empId.match(/\d+/);
  if (!match) {
    return 'em1001';
  }

  const nextNumber = parseInt(match[0], 10) + 1;
  
  // Ensure we maintain at least 4 digits if it's less than 1000 for some reason, 
  // but starting from 1001 it's naturally 4+ digits.
  return `em${nextNumber < 1001 ? 1001 : nextNumber}`;
};
