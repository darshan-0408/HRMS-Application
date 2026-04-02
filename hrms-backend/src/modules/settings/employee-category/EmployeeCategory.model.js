import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const EmployeeCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmployeeCategorySchema.plugin(tenantPlugin);

const EmployeeCategory = mongoose.model('EmployeeCategory', EmployeeCategorySchema);
export default EmployeeCategory;
