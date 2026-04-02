import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const EmployeeTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmployeeTypeSchema.plugin(tenantPlugin);

const EmployeeType = mongoose.model('EmployeeType', EmployeeTypeSchema);
export default EmployeeType;
