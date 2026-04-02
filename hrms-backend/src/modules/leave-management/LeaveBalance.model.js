import mongoose from 'mongoose';
import { tenantPlugin } from '../../config/tenantPlugin.js';

const leaveBalanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true },
  leaveTypeId: { type: String, required: true, index: true },
  allotted: { type: Number, required: true, default: 0 },
  consumed: { type: Number, required: true, default: 0 },
  remaining: { type: Number, required: true, default: 0 }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

leaveBalanceSchema.plugin(tenantPlugin);

// Unique index per employee per leave type
// Unique index per employee per leave type (within a tenant)
leaveBalanceSchema.index({ tenant_id: 1, employeeId: 1, leaveTypeId: 1 }, { unique: true });

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);
export default LeaveBalance;
