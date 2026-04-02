import mongoose from 'mongoose';
import { getTenantId } from './contextStore.js';

/**
 * Multi-tenancy Mongoose plugin.
 * 
 * 1. Adds 'tenant_id' to every document.
 * 2. Injects 'tenant_id' into all find/count/update/delete queries.
 * 3. Ensures 'tenant_id' is set on save.
 */
export const tenantPlugin = (schema) => {
  // 1. Add tenant_id field
  schema.add({
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true
    }
  });

  // 2. Global Query Middleware
  // Injects tenant_id filter whenever a query is executed.
  // Note: This requires 'tenant_id' to be set in the query options or context.
  const filterByTenant = function (next) {
    const tenantId = getTenantId();
    if (tenantId) {
      this.where({ tenant_id: tenantId });
    }
    next();
  };

  schema.pre('find', filterByTenant);
  schema.pre('findOne', filterByTenant);
  schema.pre('countDocuments', filterByTenant);
  schema.pre('updateOne', filterByTenant);
  schema.pre('updateMany', filterByTenant);
  schema.pre('deleteOne', filterByTenant);
  schema.pre('deleteMany', filterByTenant);

  // 3. Document Middleware for Save
  schema.pre('validate', function (next) {
    const tenantId = getTenantId();
    if (this.isNew && !this.tenant_id && tenantId) {
      this.tenant_id = tenantId;
    }
    next();
  });
};
