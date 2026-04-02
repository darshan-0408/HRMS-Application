import mongoose from 'mongoose';
import { tenantPlugin } from '../../config/tenantPlugin.js';

const leaveDaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayType: { type: String, required: true }, // full, halfMorning, halfAfternoon, weekend, holiday
}, { _id: false });

const leaveApplicationSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true },
  leaveTypeId: { type: String, required: true, index: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  document: { type: String },
  days: [leaveDaySchema],
  totalDays: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled', 'rejected'], 
    default: 'pending',
    index: true
  },
  deptAdminApproval: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminApproval: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

leaveApplicationSchema.plugin(tenantPlugin);

// Soft delete support
leaveApplicationSchema.add({
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date }
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
export default LeaveApplication;
