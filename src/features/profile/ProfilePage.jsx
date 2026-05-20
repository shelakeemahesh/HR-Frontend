import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Button from '@/shared/components/Button';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import { mockLeaveRequests, mockAttendance } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatDate';
import { formatCurrency } from '@/shared/utils/formatCurrency';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const employees = useEmployeeStore((s) => s.employees);

  const emp = useMemo(() => {
    if (!user) return null;
    return employees.find(e => e.email === user.email) || {
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, department: user.department || 'Operations',
      designation: user.designation || 'Staff', salary: 100000,
      status: 'Active', dateOfJoining: '2020-01-01', leaveBalance: 15,
      performanceRating: 4.2, phone: '+1 (555) 000-0000', location: 'Office',
      employmentType: 'Full-time', manager: null,
    };
  }, [user, employees]);

  const myLeaves = useMemo(() => mockLeaveRequests.filter(l => l.employeeId === emp?.id), [emp]);
  const myAttendance = useMemo(() => mockAttendance.filter(a => a.employeeId === emp?.id).slice(-10), [emp]);

  if (!emp) return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;

  const yearsAtCompany = Math.max(0, ((Date.now() - new Date(emp.dateOfJoining).getTime()) / (365.25 * 86400000)).toFixed(1));

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card variant="solid" padding="lg" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar firstName={emp.firstName} lastName={emp.lastName} size="xl" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</h2>
            <p className="text-sm text-gray-500">{emp.designation}</p>
            <div className="flex gap-2 mt-2"><Badge status="info">{emp.department}</Badge><Badge status="active" dot>{emp.status}</Badge></div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg><span className="truncate">{emp.email}</span></div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>{emp.location}</div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800"><p className="text-lg font-bold text-gray-900 dark:text-white">{yearsAtCompany}</p><p className="text-[10px] text-gray-500">Years</p></div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800"><p className="text-lg font-bold text-gray-900 dark:text-white">{emp.leaveBalance}</p><p className="text-[10px] text-gray-500">Leave Bal</p></div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800"><p className="text-lg font-bold text-gray-900 dark:text-white">{emp.performanceRating}</p><p className="text-[10px] text-gray-500">Rating</p></div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/settings')}>Edit Profile</Button>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="solid" padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[['Employee ID', emp.id], ['Joined', formatDate(emp.dateOfJoining)], ['Type', emp.employmentType], ['Salary', formatCurrency(emp.salary)], ['Manager', emp.manager || '—'], ['Department', emp.department]].map(([k, v]) => (
                <div key={k}><p className="text-gray-500 text-xs mb-0.5">{k}</p><p className="font-medium text-gray-900 dark:text-white">{v}</p></div>
              ))}
            </div>
          </Card>
          <Card variant="solid" padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Leave Requests</h3>
            {myLeaves.length > 0 ? myLeaves.slice(0, 3).map(l => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-2 last:mb-0">
                <div><p className="text-sm font-medium text-gray-900 dark:text-white">{l.type}</p><p className="text-xs text-gray-500">{formatDate(l.startDate)} – {formatDate(l.endDate)}</p></div>
                <Badge status={l.status === 'Approved' ? 'active' : l.status === 'Pending' ? 'pending' : 'rejected'} dot>{l.status}</Badge>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No leave records</p>}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
