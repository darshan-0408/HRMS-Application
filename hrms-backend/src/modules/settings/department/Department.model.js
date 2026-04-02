import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const DepartmentSchema = new mongoose.Schema(
  {
    deptName: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    deptCode: { type: String, trim: true },
    admin: { type: String, trim: true },
    adminContact: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DepartmentSchema.plugin(tenantPlugin);

// Ensure deptCode is unique within a tenant
DepartmentSchema.index({ tenant_id: 1, deptCode: 1 }, { unique: true, sparse: true });

DepartmentSchema.index({ deptName: 1 });
DepartmentSchema.index({ isDeleted: 1 });

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;
