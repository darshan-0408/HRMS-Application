import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import LeaveApplication from './modules/leave-management/LeaveApplication.model.js';

async function check() {
  await connectDB();
  const latest = await LeaveApplication.findOne().sort({ created_at: -1 });
  console.log('Latest Application:', JSON.stringify(latest, null, 2));
  process.exit(0);
}

check();
