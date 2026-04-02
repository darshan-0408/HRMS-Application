import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Department from './modules/settings/department/Department.model.js';
import Designation from './modules/settings/designation/Designation.model.js';
import EmployeeCategory from './modules/settings/employee-category/EmployeeCategory.model.js';
import EmployeeType from './modules/settings/employee-type/EmployeeType.model.js';
import LeaveType from './modules/settings/leave-type/LeaveType.model.js';
import MovementSetting from './modules/settings/movement-setting/MovementSetting.model.js';
import { contextStore } from './config/contextStore.js';

const TENANT_ID = '69b6d56f4833649eedc97b1c';

await connectDB();

const seedTenantData = async () => {
  console.log(`🌱 Seeding settings data for tenant: ${TENANT_ID}...`);

  await contextStore.run({ tenant_id: TENANT_ID }, async () => {
    try {
      // --- Departments ---
      const depts = [
        { deptName: 'Computer Science', shortName: 'CS', deptCode: 'D001', admin: 'Dr. Ramesh Kumar', adminContact: '9876543210' },
        { deptName: 'Human Resources', shortName: 'HR', deptCode: 'D002', admin: 'Priya Singh', adminContact: '9876543211' },
        { deptName: 'Finance & Accounts', shortName: 'FIN', deptCode: 'D003', admin: 'Anand Raj', adminContact: '9876543212' },
        { deptName: 'Electronics & Communication', shortName: 'EC', deptCode: 'D004', admin: 'Sneha Patel', adminContact: '9876543213' },
        { deptName: 'Mechanical Engineering', shortName: 'ME', deptCode: 'D005', admin: 'Kiran Mehta', adminContact: '9876543214' },
        { deptName: 'Administration', shortName: 'ADMIN', deptCode: 'D006', admin: 'Bala Suresh', adminContact: '9876543215' },
      ];
      await Department.deleteMany({}); // Optional: clear existing for this tenant if intended
      await Department.insertMany(depts);
      console.log('  ✅ Departments seeded');

      // --- Designations ---
      const desigs = [
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
      ];
      await Designation.deleteMany({});
      await Designation.insertMany(desigs);
      console.log('  ✅ Designations seeded');

      // --- Employee Categories ---
      const cats = [
        { name: 'Permanent' },
        { name: 'Contract' },
        { name: 'Part-time' },
        { name: 'Consultant' },
        { name: 'Guest Faculty' },
      ];
      await EmployeeCategory.deleteMany({});
      await EmployeeCategory.insertMany(cats);
      console.log('  ✅ Employee Categories seeded');

      // --- Employee Types ---
      const types = [
        { name: 'Teaching' },
        { name: 'Non-Teaching' },
        { name: 'Technical Staff' },
        { name: 'Administrative Staff' },
      ];
      await EmployeeType.deleteMany({});
      await EmployeeType.insertMany(types);
      console.log('  ✅ Employee Types seeded');

      // --- Leave Types ---
      const leaves = [
        { leaveCode: 'CL', leaveName: 'Casual Leave', category: 'paid', maxConsecutiveDays: 3 },
        { leaveCode: 'SL', leaveName: 'Sick Leave', category: 'paid', maxConsecutiveDays: 7 },
        { leaveCode: 'EL', leaveName: 'Earned Leave', category: 'paid', maxConsecutiveDays: 15 },
        { leaveCode: 'LOP', leaveName: 'Loss of Pay', category: 'unpaid', maxConsecutiveDays: 30 },
        { leaveCode: 'ML', leaveName: 'Maternity Leave', category: 'paid', maxConsecutiveDays: 90 },
        { leaveCode: 'PL', leaveName: 'Paternity Leave', category: 'paid', maxConsecutiveDays: 7 },
        { leaveCode: 'OD', leaveName: 'On Duty', category: 'paid', maxConsecutiveDays: 5 },
      ];
      await LeaveType.deleteMany({});
      await LeaveType.insertMany(leaves);
      console.log('  ✅ Leave Types seeded');

      // --- Movement Settings ---
      await MovementSetting.deleteMany({});
      await MovementSetting.create({
        limitCount: 4,
        limitFrequency: 'monthly',
        maxDurationMinutes: 120,
        daysBeforeApply: 1,
        autoApprovalEnabled: true,
      });
      console.log('  ✅ Movement Settings seeded');

      console.log('\n✨ Seed complete for tenant 69b6d56f4833649eedc97b1c!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    }
  });
};

seedTenantData().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
