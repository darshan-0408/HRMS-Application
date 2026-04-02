import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super-admin', 'admin', 'employee'], default: 'admin' },
    tenant_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      required: false // Optional for Super Admins
    },
    // Reference to the employee profile if applicable
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true
  }
);

// Scoped uniqueness: username must be unique within a tenant
UserSchema.index({ tenant_id: 1, username: 1 }, { unique: true });
UserSchema.index({ tenant_id: 1, email: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to verify password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
