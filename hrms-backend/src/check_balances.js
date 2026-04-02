import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import LeaveBalance from './modules/leave-management/LeaveBalance.model.js';

async function check() {
  await connectDB();
  const balances = await LeaveBalance.find().limit(5);
  console.log('Sample Balances:');
  balances.forEach(b => {
    console.log(`- EmpId: ${b.employeeId}, Type: ${b.leaveTypeId}, Rem: ${b.remaining}`);
  });
  process.exit(0);
}

check();
