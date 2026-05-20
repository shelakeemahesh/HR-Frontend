import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Button from '@/shared/components/Button';
import useEmployeeStore from '@/store/employeeStore';
import useAuthStore from '@/store/authStore';
import { mockLeaveRequests, mockAttendance } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatDate';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { cn } from '@/shared/utils/cn';
import { ROLES } from '@/config/constants';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const statusMap = { 'Active': 'active', 'On Leave': 'on-leave', 'Terminated': 'terminated' };
const attColors = { Present: 'bg-emerald-400', Absent: 'bg-red-400', Late: 'bg-amber-400', 'Half-day': 'bg-yellow-300', WFH: 'bg-blue-400' };

const mockDocs = [
  { name: 'Offer Letter.pdf', date: '2021-03-01', size: '245 KB' },
  { name: 'ID Proof.pdf', date: '2021-03-05', size: '1.2 MB' },
  { name: 'Resume.pdf', date: '2021-02-20', size: '380 KB' },
  { name: 'NDA Agreement.pdf', date: '2021-03-10', size: '120 KB' },
  { name: 'Tax Declaration.pdf', date: '2022-04-01', size: '90 KB' },
];

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const employees = useEmployeeStore((s) => s.employees);
  const emp = employees.find(e => e.id === id);
  const [tab, setTab] = useState(0);

  const empLeaves = useMemo(() => mockLeaveRequests.filter(l => l.employeeId === id), [id]);
  const empAttendance = useMemo(() => mockAttendance.filter(a => a.employeeId === id).slice(-22), [id]);

  if (!emp) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Employee not found</h2>
      <Button variant="primary" onClick={() => navigate('/employees')}>Back to Employees</Button>
    </div>
  );

  const yearsAtCompany = Math.max(0, ((new Date() - new Date(emp.dateOfJoining)) / (365.25 * 86400000)).toFixed(1));
  const tabs = ['Overview', 'Attendance', 'Leaves', 'Documents'];
  const attSummary = { Present: 0, Absent: 0, Late: 0, WFH: 0, 'Half-day': 0 };
  empAttendance.forEach(a => { if (attSummary[a.status] !== undefined) attSummary[a.status]++; });

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Employees
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card variant="solid" padding="lg" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar firstName={emp.firstName} lastName={emp.lastName} size="xl" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{emp.designation}</p>
            <div className="flex gap-2 mt-2">
              <Badge status="info">{emp.department}</Badge>
              <Badge status={statusMap[emp.status] || 'neutral'} dot>{emp.status}</Badge>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg><span className="truncate">{emp.email}</span></div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>{emp.phone}</div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>{emp.location}</div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800"><p className="text-lg font-bold text-gray-900 dark:text-white">{yearsAtCompany}</p><p className="text-[10px] text-gray-500">Years</p></div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800"><p className="text-lg font-bold text-gray-900 dark:text-white">{emp.leaveBalance}</p><p className="text-[10px] text-gray-500">Leave Bal</p></div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
              <p className="text-[10px] font-medium text-gray-500 mb-1.5">Performance</p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className={cn('w-5 h-5 shrink-0', i <= Math.round(emp.performanceRating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600')} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{emp.performanceRating}</span>
              </div>
            </div>
          </div>
          {(role === ROLES.ADMIN || role === ROLES.HR) && <Button variant="outline" className="w-full mt-4">Edit Profile</Button>}
        </Card>

        {/* Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} className={cn('flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors', tab === i ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>{t}</button>)}
          </div>

          {tab === 0 && (
            <Card variant="solid" padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[['Employee ID', emp.id], ['Date of Joining', formatDate(emp.dateOfJoining)], ['Employment Type', emp.employmentType], ['Manager', emp.manager || '—'], ['Salary', formatCurrency(emp.salary)], ['Department', emp.department]].map(([k, v]) => (
                  <div key={k}><p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">{k}</p><p className="font-medium text-gray-900 dark:text-white">{v}</p></div>
                ))}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">Timeline</h3>
              <div className="relative border-l-2 border-primary-200 dark:border-primary-800 pl-6 space-y-4">
                <div><div className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary-600 border-2 border-white dark:border-gray-900" /><p className="text-sm font-medium text-gray-900 dark:text-white">Joined as {emp.designation}</p><p className="text-xs text-gray-500">{formatDate(emp.dateOfJoining)}</p></div>
                <div className="ml-0"><div className="absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" style={{ marginTop: '0px' }} /><p className="text-sm font-medium text-gray-900 dark:text-white">Current Position</p><p className="text-xs text-gray-500">{emp.designation} · {emp.department}</p></div>
              </div>
            </Card>
          )}

          {tab === 1 && (
            <Card variant="solid" padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Attendance (Last 30 Days)</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {Object.entries(attSummary).map(([k, v]) => (
                  <div key={k} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{v}</p>
                    <p className="text-[10px] text-gray-500">{k}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {empAttendance.map(a => (
                  <div key={a.id} title={`${a.date}: ${a.status}`} className={cn('h-8 rounded-lg flex items-center justify-center text-[9px] font-medium text-white', attColors[a.status] || 'bg-gray-300')}>
                    {new Date(a.date).getDate()}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 2 && (
            <Card variant="solid" padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leave History</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[['Annual', 12, emp.leaveBalance], ['Sick', 6, Math.max(0, 6 - 2)], ['Casual', 3, Math.max(0, 3 - 1)]].map(([type, total, rem]) => (
                  <div key={type} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{type}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{rem}/{total} days</p>
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(rem / total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {empLeaves.length > 0 ? (
                <div className="space-y-2">
                  {empLeaves.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div><p className="text-sm font-medium text-gray-900 dark:text-white">{l.type}</p><p className="text-xs text-gray-500">{formatDate(l.startDate)} – {formatDate(l.endDate)} · {l.days} days</p></div>
                      <Badge status={l.status.toLowerCase()} dot>{l.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 text-center py-4">No leave records</p>}
            </Card>
          )}

          {tab === 3 && (
            <Card variant="solid" padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
              <div className="space-y-2">
                {mockDocs.map(d => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
                      <div><p className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</p><p className="text-xs text-gray-500">{formatDate(d.date)} · {d.size}</p></div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
