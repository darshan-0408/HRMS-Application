import mongoose from 'mongoose';
import { tenantPlugin } from '../../../config/tenantPlugin.js';

const MovementSettingSchema = new mongoose.Schema(
  {
    limitCount: { type: Number, required: true, default: 4, min: 0 },
    limitFrequency: { type: String, enum: ['weekly', 'monthly'], required: true, default: 'monthly' },
    maxDurationMinutes: { type: Number, required: true, min: 15, default: 120 },
    daysBeforeApply: { type: Number, required: true, min: 0, default: 1 },
    autoApprovalEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MovementSettingSchema.plugin(tenantPlugin);

const MovementSetting = mongoose.model('MovementSetting', MovementSettingSchema);
export default MovementSetting;
