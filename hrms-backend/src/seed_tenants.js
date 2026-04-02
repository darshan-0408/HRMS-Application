import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Tenant from './models/Tenant.model.js';
import User from './models/User.model.js';
import Department from './modules/settings/department/Department.model.js';
import Designation from './modules/settings/designation/Designation.model.js';
import EmployeeCategory from './modules/settings/employee-category/EmployeeCategory.model.js';
import EmployeeType from './modules/settings/employee-type/EmployeeType.model.js';
import LeaveType from './modules/settings/leave-type/LeaveType.model.js';
import MovementSetting from './modules/settings/movement-setting/MovementSetting.model.js';
import Employee from './modules/employee/Employee.model.js';
import LeaveBalance from './modules/leave-management/LeaveBalance.model.js';
import LeaveApplication from './modules/leave-management/LeaveApplication.model.js';
import { contextStore } from './config/contextStore.js';

await connectDB();

const seedTenants = async () => {
  console.log('🌱 Seeding FULL PRODUCTION Multi-Tenant Data...');

  // 0. Global Cleanup (Ignore tenant context to sweep everything)
  console.log('  🧹 Performing global cleanup...');
  await Tenant.deleteMany({});
  await User.deleteMany({});
  await Department.deleteMany({});
  await Designation.deleteMany({});
  await EmployeeCategory.deleteMany({});
  await EmployeeType.deleteMany({});
  await LeaveType.deleteMany({});
  await MovementSetting.deleteMany({});
  await Employee.deleteMany({});
  await LeaveBalance.deleteMany({});
  await LeaveApplication.deleteMany({});

  // 1. Create Tenants
  const tenantA = await Tenant.create({ 
    name: 'Global University', 
    code: 'UNIV_A', 
    isActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1594312180796-ca420e5250bb?w=80&h=80&fit=crop', // Education symbol
    primaryColor: '#2563eb' 
  });

  const tenantB = await Tenant.create({ 
    name: 'Heritage College', 
    code: 'UNIV_B', 
    isActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=80&h=80&fit=crop', // College building
    primaryColor: '#7c3aed' 
  });
  console.log(`  ✅ Tenants created: ${tenantA.name}, ${tenantB.name}`);

  // Create Global Super Admin (Owner)
  await User.create({
    username: 'platform_owner',
    email: 'owner@hrms.com',
    password: 'admin123',
    role: 'super-admin',
    tenant_id: null
  });
  console.log('  ✅ Global Super Admin created: platform_owner');

  const seedTenantData = async (tenant, adminUser, domain) => {
    await contextStore.run({ tenant_id: tenant._id }, async () => {
      // --- Auth ---
      await User.create({
        username: adminUser,
        email: `admin@${domain}`,
        password: 'admin123',
        tenant_id: tenant._id,
        role: 'admin'
      });

      // --- Settings: Departments ---
      const depts = await Department.insertMany([
        { deptName: 'Computer Science', shortName: 'CS', deptCode: 'D001', admin: 'Dr. Ramesh Kumar', adminContact: '9876543210' },
        { deptName: 'Human Resources', shortName: 'HR', deptCode: 'D002', admin: 'Priya Singh', adminContact: '9876543211' },
        { deptName: 'Finance & Accounts', shortName: 'FIN', deptCode: 'D003', admin: 'Anand Raj', adminContact: '9876543212' },
      ]);

      // --- Settings: Designations ---
      const desigs = await Designation.insertMany([
        { name: 'Professor' },
        { name: 'Assistant Professor' },
        { name: 'Lecturer' },
      ]);

      // --- Settings: Employee Categories ---
      const cats = await EmployeeCategory.insertMany([
        { name: 'Permanent' },
        { name: 'Contract' },
      ]);

      // --- Settings: Employee Types ---
      const types = await EmployeeType.insertMany([
        { name: 'Teaching' },
        { name: 'Non-Teaching' },
      ]);

      // --- Settings: Leave Types ---
      await LeaveType.insertMany([
        { leaveCode: 'CL', leaveName: 'Casual Leave', category: 'paid', maxConsecutiveDays: 3 },
        { leaveCode: 'SL', leaveName: 'Sick Leave', category: 'paid', maxConsecutiveDays: 7 },
        { leaveCode: 'EL', leaveName: 'Earned Leave', category: 'paid', maxConsecutiveDays: 15 },
        { leaveCode: 'LOP', leaveName: 'Loss of Pay', category: 'unpaid', maxConsecutiveDays: 30 },
      ]);

      // --- Settings: Movement ---
      await MovementSetting.create({ limitCount: 4, limitFrequency: 'monthly', maxDurationMinutes: 120, daysBeforeApply: 1, autoApprovalEnabled: true });

      // --- Employees (2 per tenant) ---
      await Employee.create({
        empId: `em1001`,
        firstName: 'John',
        lastName: 'Doe',
        email: `john.${tenant.code.toLowerCase()}@${domain}`,
        mobile: '9870000001',
        doj: new Date('2023-01-15'),
        departmentId: depts[0]._id,
        designationId: desigs[0]._id,
        empTypeId: types[0]._id,
        status: 'active'
      });

      await Employee.create({
        empId: `em1002`,
        firstName: 'Jane',
        lastName: 'Smith',
        email: `jane.${tenant.code.toLowerCase()}@${domain}`,
        mobile: '9870000002',
        doj: new Date('2023-02-20'),
        departmentId: depts[1]._id,
        designationId: desigs[1]._id,
        empTypeId: types[0]._id,
        status: 'active'
      });

      console.log(`  ✅ All data seeded for ${tenant.name}`);
    });
  };

  await seedTenantData(tenantA, 'admin_univ_a', 'univ-a.edu');
  await seedTenantData(tenantB, 'admin_heritage', 'heritage.edu');

  console.log('\n🚀 FULL PRODUCTION Multi-Tenant Seed complete!');
  console.log('   Credentials: admin_univ_a / admin123, admin_heritage / admin123');
  process.exit(0);
};

seedTenants().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
