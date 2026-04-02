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

await connectDB();

const clearData = async () => {
  console.log('🧹 Clearing all tenant-specific data...');

  try {
    // 1. Delete all tenants
    const tenantResult = await Tenant.deleteMany({});
    console.log(`  ✅ Deleted ${tenantResult.deletedCount} tenants`);

    // 2. Delete all users EXCEPT super-admins
    const userResult = await User.deleteMany({ role: { $ne: 'super-admin' } });
    console.log(`  ✅ Deleted ${userResult.deletedCount} non-super-admin users`);

    // 3. Delete all settings and operational data
    const collections = [
      { name: 'Departments', model: Department },
      { name: 'Designations', model: Designation },
      { name: 'Employee Categories', model: EmployeeCategory },
      { name: 'Employee Types', model: EmployeeType },
      { name: 'Leave Types', model: LeaveType },
      { name: 'Movement Settings', model: MovementSetting },
      { name: 'Employees', model: Employee },
      { name: 'Leave Balances', model: LeaveBalance },
      { name: 'Leave Applications', model: LeaveApplication },
    ];

    for (const col of collections) {
      const res = await col.model.deleteMany({});
      console.log(`  ✅ Deleted ${res.deletedCount} ${col.name}`);
    }

    // 4. Ensure a Super Admin exists for the user to log in
    const superAdmin = await User.findOne({ role: 'super-admin' });
    if (!superAdmin) {
      console.log('  ⚠️ No Super Admin found. Creating default platform_owner...');
      await User.create({
        username: 'platform_owner',
        email: 'owner@hrms.com',
        password: 'admin123',
        role: 'super-admin',
        tenant_id: null
      });
      console.log('  ✅ Default Super Admin created: platform_owner / admin123');
    } else {
      console.log(`  ℹ️ Super Admin found: ${superAdmin.username}`);
    }

    console.log('\n✨ Database cleared successfully. You can now create tenants manually.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing database:', err);
    process.exit(1);
  }
};

clearData();
