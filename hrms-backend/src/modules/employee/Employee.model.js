import mongoose from 'mongoose';
import { tenantPlugin } from '../../config/tenantPlugin.js';

// --- Sub-schemas ---
const AddressSchema = new mongoose.Schema(
  {
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const BankAccountSchema = new mongoose.Schema(
  {
    accountCategory: { type: String, enum: ['primary', 'secondary'], required: true },
    accountType: { type: String, enum: ['Savings', 'Current'] },
    accountNo: { type: String, trim: true },
    bankName: { type: String, trim: true },
    ifsc: { type: String, trim: true },
  },
  { _id: true }
);

// --- Main Employee Schema ---
const EmployeeSchema = new mongoose.Schema(
  {
    // Basic Details
    empId: { type: String, required: true, trim: true },
    title: { type: String, enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof'] },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },

    // Work Details — references by _id strings
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    academicDept: { type: String, trim: true },
    designationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
    doj: { type: Date, required: true },
    empTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeType' },
    empSubType: { type: String, trim: true },
    empCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeCategory' },
    hiringSource: { type: String, trim: true },
    expYears: { type: Number, min: 0, default: 0 },
    expMonths: { type: Number, min: 0, max: 11, default: 0 },
    qualification: { type: String, trim: true },
    reportingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Personal Details
    fatherName: { type: String, trim: true },
    aadhaar: { type: String, trim: true },
    pan: { type: String, trim: true },
    passport: { type: String, trim: true },
    pfNumber: { type: String, trim: true },
    esicNumber: { type: String, trim: true },
    dob: { type: Date },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    religion: { type: String, trim: true },
    caste: { type: String, trim: true },
    personalCategory: { type: String, trim: true },

    // Contact Details
    secondaryEmail: { type: String, lowercase: true, trim: true },
    secondaryContact: { type: String, trim: true },
    scholarLink: { type: String, trim: true },
    linkedinLink: { type: String, trim: true },
    address: { type: AddressSchema, default: {} },

    // Bank Accounts (array — primary + secondary)
    bankAccounts: { type: [BankAccountSchema], default: [] },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EmployeeSchema.plugin(tenantPlugin);

// Compound Unique Indexes for Multi-tenancy
EmployeeSchema.index({ tenant_id: 1, empId: 1 }, { unique: true });
EmployeeSchema.index({ tenant_id: 1, email: 1 }, { unique: true });

// Indexes
EmployeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text', empId: 'text' });
EmployeeSchema.index({ departmentId: 1 });
EmployeeSchema.index({ designationId: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ isDeleted: 1 });

// Virtual: full name
EmployeeSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
