import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const DesignationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DesignationSchema.plugin(tenantPlugin);

DesignationSchema.index({ name: 1 });
DesignationSchema.index({ isDeleted: 1 });

const Designation = mongoose.model('Designation', DesignationSchema);
export default Designation;
