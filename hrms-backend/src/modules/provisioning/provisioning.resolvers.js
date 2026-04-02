import Tenant from '../../models/Tenant.model.js';
import User from '../../models/User.model.js';
import Department from '../settings/department/Department.model.js';
import Designation from '../settings/designation/Designation.model.js';
import LeaveType from '../settings/leave-type/LeaveType.model.js';
import EmployeeType from '../settings/employee-type/EmployeeType.model.js';
import MovementSetting from '../settings/movement-setting/MovementSetting.model.js';
import { contextStore } from '../../config/contextStore.js';
import { 
  DEFAULT_DEPARTMENTS, 
  DEFAULT_LEAVE_TYPES, 
  DEFAULT_DESIGNATIONS, 
  DEFAULT_EMPLOYEE_TYPES 
} from '../../config/bootstrapData.js';

const provisioningResolvers = {
  Query: {
    listTenants: async (_, __, { currentUser }) => {
      if (!currentUser || currentUser.role !== 'super-admin') {
        throw new Error('Unauthorized: Only Super Admin can list tenants');
      }
      return await Tenant.find({});
    }
  },
  Mutation: {
    registerTenant: async (_, { input }, { currentUser }) => {
      // 0. Authorization
      if (!currentUser || currentUser.role !== 'super-admin') {
        throw new Error('Unauthorized: Only Super Admin can register tenants');
      }

      // 1. Transactionally creation? (For now sequential)
      // Check for code unique
      const exists = await Tenant.findOne({ code: input.code.toUpperCase() });
      if (exists) throw new Error('Tenant code already exists');

      // Create Tenant
      const tenant = await Tenant.create({
        name: input.name,
        code: input.code.toUpperCase(),
        logoUrl: input.logoUrl || '',
        email: input.adminEmail
      });

      // Switch context to new tenant for bootstrapping
      await contextStore.run({ tenant_id: tenant._id.toString() }, async () => {
        // Create Initial Admin
        const admin = await User.create({
          username: input.adminUsername,
          email: input.adminEmail,
          password: input.adminPassword,
          tenant_id: tenant._id,
          role: 'admin'
        });

        // Bootstrap Seed Data
        await Department.insertMany(DEFAULT_DEPARTMENTS);
        await Designation.insertMany(DEFAULT_DESIGNATIONS);
        await LeaveType.insertMany(DEFAULT_LEAVE_TYPES);
        await EmployeeType.insertMany(DEFAULT_EMPLOYEE_TYPES);
        await MovementSetting.create({
          limitCount: 4,
          limitFrequency: 'monthly',
          maxDurationMinutes: 120,
          daysBeforeApply: 1,
          autoApprovalEnabled: true
        });

        console.log(`✅ Bootstrapped new tenant: ${tenant.name} (${tenant.code})`);
      });

      // Find the admin user created to return
      const admin = await User.findOne({ username: input.adminUsername });

      return {
        success: true,
        message: `Tenant ${tenant.name} registered and bootstrapped successfully.`,
        tenant,
        admin
      };
    }
  }
};

export default provisioningResolvers;
