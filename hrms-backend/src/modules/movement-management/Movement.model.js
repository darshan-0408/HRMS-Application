import mongoose from 'mongoose';
import { tenantPlugin } from '../../config/tenantPlugin.js';

const MovementSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    movementDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

MovementSchema.plugin(tenantPlugin);

// index by employee and date
MovementSchema.index({ employeeId: 1, movementDate: -1 });

export default mongoose.model('Movement', MovementSchema);
