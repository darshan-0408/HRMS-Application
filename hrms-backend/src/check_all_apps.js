import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import LeaveApplication from './modules/leave-management/LeaveApplication.model.js';

async function checkAll() {
  await connectDB();
  const apps = await LeaveApplication.find({ employeeId: '69b12280011e3776c229746f' }).sort({ created_at: -1 });
  console.log('Applications for EMP1002:');
  apps.forEach(app => {
    console.log(`- ID: ${app._id}, Status: ${app.status}, From: ${app.fromDate.toISOString()}, Created: ${app.created_at.toISOString()}`);
  });
  process.exit(0);
}

checkAll();
