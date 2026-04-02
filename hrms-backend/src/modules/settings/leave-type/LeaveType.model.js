import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const LeaveTypeSchema = new mongoose.Schema(
  {
    leaveCode: { type: String, required: true, trim: true },
    leaveName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['paid', 'unpaid', 'restricted'],
    },
    maxConsecutiveDays: { type: Number, required: true, min: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeaveTypeSchema.plugin(tenantPlugin);

// Leave code must be unique within a tenant
LeaveTypeSchema.index({ tenant_id: 1, leaveCode: 1 }, { unique: true });

const LeaveType = mongoose.model('LeaveType', LeaveTypeSchema);
export default LeaveType;
