/**
 * Seed Script — populates MongoDB with initial settings data
 * Run with: node src/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Department from './modules/settings/department/Department.model.js';
import Designation from './modules/settings/designation/Designation.model.js';
import EmployeeCategory from './modules/settings/employee-category/EmployeeCategory.model.js';
import EmployeeType from './modules/settings/employee-type/EmployeeType.model.js';
import LeaveType from './modules/settings/leave-type/LeaveType.model.js';
import MovementSetting from './modules/settings/movement-setting/MovementSetting.model.js';

await connectDB();

const seedData = async () => {
  console.log('🌱 Seeding database...');

  // --- Departments ---
  const deptCount = await Department.countDocuments();
  if (deptCount === 0) {
    await Department.insertMany([
      { deptName: 'Computer Science', shortName: 'CS', deptCode: 'D001', admin: 'Dr. Ramesh Kumar', adminContact: '9876543210' },
      { deptName: 'Human Resources', shortName: 'HR', deptCode: 'D002', admin: 'Priya Singh', adminContact: '9876543211' },
      { deptName: 'Finance & Accounts', shortName: 'FIN', deptCode: 'D003', admin: 'Anand Raj', adminContact: '9876543212' },
      { deptName: 'Electronics & Communication', shortName: 'EC', deptCode: 'D004', admin: 'Sneha Patel', adminContact: '9876543213' },
      { deptName: 'Mechanical Engineering', shortName: 'ME', deptCode: 'D005', admin: 'Kiran Mehta', adminContact: '9876543214' },
      { deptName: 'Administration', shortName: 'ADMIN', deptCode: 'D006', admin: 'Bala Suresh', adminContact: '9876543215' },
    ]);
    console.log('  ✅ Departments seeded');
  } else {
    console.log('  ⏭  Departments already exist, skipping');
  }

  // --- Designations ---
  const desigCount = await Designation.countDocuments();
  if (desigCount === 0) {
    await Designation.insertMany([
      { name: 'Professor' },
      { name: 'Associate Professor' },
      { name: 'Assistant Professor' },
      { name: 'Lecturer' },
      { name: 'Lab Instructor' },
      { name: 'HR Executive' },
      { name: 'Finance Officer' },
      { name: 'System Administrator' },
      { name: 'Office Superintendent' },
      { name: 'Principal' },
      { name: 'Vice Principal' },
    ]);
    console.log('  ✅ Designations seeded');
  } else {
    console.log('  ⏭  Designations already exist, skipping');
  }

  // --- Employee Categories ---
  const catCount = await EmployeeCategory.countDocuments();
  if (catCount === 0) {
    await EmployeeCategory.insertMany([
      { name: 'Permanent' },
      { name: 'Contract' },
      { name: 'Part-time' },
      { name: 'Consultant' },
      { name: 'Guest Faculty' },
    ]);
    console.log('  ✅ Employee Categories seeded');
  } else {
    console.log('  ⏭  Employee Categories already exist, skipping');
  }

  // --- Employee Types ---
  const typeCount = await EmployeeType.countDocuments();
  if (typeCount === 0) {
    await EmployeeType.insertMany([
      { name: 'Teaching' },
      { name: 'Non-Teaching' },
      { name: 'Technical Staff' },
      { name: 'Administrative Staff' },
    ]);
    console.log('  ✅ Employee Types seeded');
  } else {
    console.log('  ⏭  Employee Types already exist, skipping');
  }

  // --- Leave Types ---
  const leaveCount = await LeaveType.countDocuments();
  if (leaveCount === 0) {
    await LeaveType.insertMany([
      { leaveCode: 'CL', leaveName: 'Casual Leave', category: 'paid', maxConsecutiveDays: 3 },
      { leaveCode: 'SL', leaveName: 'Sick Leave', category: 'paid', maxConsecutiveDays: 7 },
      { leaveCode: 'EL', leaveName: 'Earned Leave', category: 'paid', maxConsecutiveDays: 15 },
      { leaveCode: 'LOP', leaveName: 'Loss of Pay', category: 'unpaid', maxConsecutiveDays: 30 },
      { leaveCode: 'ML', leaveName: 'Maternity Leave', category: 'paid', maxConsecutiveDays: 90 },
      { leaveCode: 'PL', leaveName: 'Paternity Leave', category: 'paid', maxConsecutiveDays: 7 },
      { leaveCode: 'OD', leaveName: 'On Duty', category: 'paid', maxConsecutiveDays: 5 },
    ]);
    console.log('  ✅ Leave Types seeded');
  } else {
    console.log('  ⏭  Leave Types already exist, skipping');
  }

  // --- Movement Settings ---
  const mvtCount = await MovementSetting.countDocuments();
  if (mvtCount === 0) {
    await MovementSetting.create({
      limitCount: 4,
      limitFrequency: 'monthly',
      maxDurationMinutes: 120,
      daysBeforeApply: 1,
      autoApprovalEnabled: true,
    });
    console.log('  ✅ Movement Settings seeded');
  } else {
    console.log('  ⏭  Movement Settings already exist, skipping');
  }

  console.log('\n✅ Seed complete!');
  await mongoose.disconnect();
};

seedData().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
