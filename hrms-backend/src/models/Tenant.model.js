import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    domain: { type: String, trim: true },
    logoUrl: { type: String, trim: true }, // URL to institutional logo
    primaryColor: { type: String, default: '#2563eb' }, // Default brand color
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true
  }
);

const Tenant = mongoose.model('Tenant', TenantSchema);
export default Tenant;
