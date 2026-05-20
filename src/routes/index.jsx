import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROLES } from '../config/constants';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../shared/components/MainLayout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import EmployeesPage from '../features/employees/EmployeesPage';
import EmployeeProfile from '../features/employees/EmployeeProfile';
import AttendancePage from '../features/attendance/AttendancePage';
import LeavesPage from '../features/leaves/LeavesPage';
import PayrollPage from '../features/payroll/PayrollPage';
import PerformancePage from '../features/performance/PerformancePage';
import ReportsPage from '../features/reports/ReportsPage';
import NotificationsPage from '../features/notifications/NotificationsPage';
import SettingsPage from '../features/settings/SettingsPage';
import ProfilePage from '../features/profile/ProfilePage';
import NotFoundPage from '../features/errors/NotFoundPage';
import UnauthorizedPage from '../features/errors/UnauthorizedPage';

const allRoles = [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE];
const adminHR = [ROLES.ADMIN, ROLES.HR];

function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Part 2 — Core Modules */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><EmployeesPage /></MainLayout></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><EmployeeProfile /></MainLayout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><AttendancePage /></MainLayout></ProtectedRoute>} />
      <Route path="/leaves" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><LeavesPage /></MainLayout></ProtectedRoute>} />

      {/* Part 3 — Feature Modules */}
      <Route path="/payroll" element={<ProtectedRoute allowedRoles={adminHR}><MainLayout><PayrollPage /></MainLayout></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><PerformancePage /></MainLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={adminHR}><MainLayout><ReportsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><NotificationsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={allRoles}><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
