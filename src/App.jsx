import { ApolloProvider } from './api/apollo.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import client from './api/apolloClient';
import AppLayout from './components/AppLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList/EmployeeList';
import EmployeeDetail from './pages/Employees/EmployeeDetail/EmployeeDetail';
import Attendance from './pages/Attendance/Attendance';
import LeaveApplications from './pages/LeaveApplications/LeaveApplications';
import MovementRegister from './pages/MovementRegister/MovementRegister';
import Approvals from './pages/Approvals/Approvals';
import SettingsLayout from './pages/Settings/SettingsLayout/SettingsLayout';
import LeaveTypes from './pages/Settings/LeaveTypes/LeaveTypes';
import Departments from './pages/Settings/Departments/Departments';
import Designations from './pages/Settings/Designations/Designations';
import EmpCategories from './pages/Settings/EmpCategories/EmpCategories';
import EmpTypes from './pages/Settings/EmpTypes/EmpTypes';
import MovementSettings from './pages/Settings/MovementSettings/MovementSettings';
import OwnerPortal from './pages/OwnerPortal/OwnerPortal';
import './styles/global.css';

// Auth guard — check for token
function PrivateRoute({ children }) {
  const token = localStorage.getItem('hrms_token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave-applications" element={<LeaveApplications />} />
            <Route path="movement-register" element={<MovementRegister />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="owner" element={<OwnerPortal />} />
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="leave-types" replace />} />
              <Route path="leave-types" element={<LeaveTypes />} />
              <Route path="departments" element={<Departments />} />
              <Route path="designations" element={<Designations />} />
              <Route path="emp-categories" element={<EmpCategories />} />
              <Route path="emp-types" element={<EmpTypes />} />
              <Route path="movement" element={<MovementSettings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
