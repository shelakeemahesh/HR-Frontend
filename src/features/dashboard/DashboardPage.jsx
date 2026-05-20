import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Avatar from '@/shared/components/Avatar';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import { mockLeaveRequests, mockAttendance, mockNotifications } from '@/data/mockData';
import { formatRelativeTime, formatDate } from '@/shared/utils/formatDate';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { cn } from '@/shared/utils/cn';
import { ROLES } from '@/config/constants';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const DEPT_COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  const employees = useEmployeeStore((s) => s.employees);

  const now = new Date();
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = mockLeaveRequests.filter(r => r.status === 'Approved' && new Date(r.startDate) <= now && new Date(r.endDate) >= now).length;
  const newJoinees = employees.filter(e => { const d = new Date(e.dateOfJoining); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const pendingLeaves = mockLeaveRequests.filter(r => r.status === 'Pending');

  // Department distribution
  const deptData = useMemo(() => {
    const map = {};
    employees.forEach(e => { map[e.department] = (map[e.department] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // Attendance trends (last 7 unique dates)
  const attendanceTrend = useMemo(() => {
    const dateMap = {};
    mockAttendance.forEach(r => {
      if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, Present: 0, Absent: 0, Late: 0 };
      if (r.status === 'Present' || r.status === 'WFH') dateMap[r.date].Present++;
      else if (r.status === 'Absent') dateMap[r.date].Absent++;
      else if (r.status === 'Late') dateMap[r.date].Late++;
    });
    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date)).slice(-7).map(d => ({ ...d, day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
  }, []);

  // Activity feed
  const activityFeed = useMemo(() => {
    const items = [
      ...mockLeaveRequests.map(l => ({ id: `lr-${l.id}`, type: 'leave', text: `${l.employeeName} applied for ${l.type} Leave (${l.days} days)`, time: l.appliedOn, color: 'border-amber-400' })),
      ...mockNotifications.slice(0, 5).map(n => ({ id: `n-${n.id}`, type: n.type, text: n.title + ': ' + n.message, time: n.createdAt, color: n.type === 'success' ? 'border-emerald-400' : n.type === 'danger' ? 'border-red-400' : n.type === 'warning' ? 'border-amber-400' : 'border-blue-400' })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    return items;
  }, []);

  const kpis = [
    { label: 'Total Employees', value: employees.length, trend: '+3 this month', trendUp: true, icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>), bg: 'bg-primary-100 dark:bg-primary-900/30', iconColor: 'text-primary-600 dark:text-primary-400' },
    { label: 'Active Employees', value: activeCount, trend: `${Math.round((activeCount / employees.length) * 100)}% active`, trendUp: true, icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), bg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'On Leave Today', value: onLeaveCount, trend: `${pendingLeaves.length} pending`, trendUp: false, icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>), bg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
    { label: 'New Joinees', value: newJoinees || 2, trend: 'This month', trendUp: true, icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>), bg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  ];

  const quickActions = [
    { label: 'Add Employee', icon: '➕', action: () => navigate('/employees'), roles: [ROLES.ADMIN, ROLES.HR] },
    { label: 'Apply Leave', icon: '📝', action: () => navigate('/leaves'), roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE] },
    { label: 'Download Payslip', icon: '📄', action: () => navigate('/payroll'), roles: [ROLES.ADMIN, ROLES.HR] },
    { label: 'Mark Attendance', icon: '✅', action: () => navigate('/attendance'), roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE] },
    { label: 'Upload Document', icon: '📎', action: () => {}, roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE] },
    { label: 'Generate Report', icon: '📊', action: () => navigate('/reports'), roles: [ROLES.ADMIN, ROLES.HR] },
  ].filter(a => a.roles.includes(role));

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.firstName} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your team today.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} variants={fadeUp}>
            <Card variant="glass" padding="md" hover className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1"><AnimatedCounter target={kpi.value} /></p>
                  <p className={cn('text-xs mt-2 font-medium', kpi.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400')}>
                    {kpi.trendUp ? '↑' : '•'} {kpi.trend}
                  </p>
                </div>
                <div className={cn('p-3 rounded-xl', kpi.bg)}>
                  <span className={kpi.iconColor}>{kpi.icon}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(a => (
            <Card key={a.label} variant="glass" padding="sm" hover onClick={a.action}>
              <div className="flex flex-col items-center gap-2 py-2">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{a.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Main Grid: Pending Actions + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card variant="solid" padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {role === ROLES.EMPLOYEE ? 'My Pending Requests' : 'Requires Your Attention'}
            </h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {role !== ROLES.EMPLOYEE ? (
                pendingLeaves.length > 0 ? pendingLeaves.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={l.employeeName.split(' ')[0]} lastName={l.employeeName.split(' ')[1]} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{l.employeeName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{l.type} Leave · {l.days} days · {formatDate(l.startDate)} – {formatDate(l.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status="warning" dot>Pending</Badge>
                      <Button variant="primary" size="sm" onClick={() => navigate('/leaves')}>Review</Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No pending actions 🎉</p>
                )
              ) : (
                pendingLeaves.filter(l => l.employeeId === 'EMP001').length > 0 ? pendingLeaves.filter(l => l.employeeId === 'EMP001').map(l => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{l.type} Leave</p>
                      <p className="text-xs text-gray-500">{formatDate(l.startDate)} – {formatDate(l.endDate)} · {l.days} days</p>
                    </div>
                    <Badge status="pending" dot>Pending</Badge>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-8">No pending requests</p>
                )
              )}
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeUp}>
          <Card variant="solid" padding="md" className="h-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {activityFeed.map(item => (
                <div key={item.id} className={cn('flex gap-3 p-2 border-l-2 rounded-r-lg', item.color)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{item.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatRelativeTime(item.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card variant="solid" padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" isAnimationActive={true} animationDuration={800}>
                {deptData.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '13px' }} />
              <Legend formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance Trends */}
        <Card variant="solid" padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                <linearGradient id="gLate" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '13px' }} />
              <Area type="monotone" dataKey="Present" stroke="#10B981" fill="url(#gPresent)" strokeWidth={2} isAnimationActive={true} />
              <Area type="monotone" dataKey="Absent" stroke="#EF4444" fill="url(#gAbsent)" strokeWidth={2} isAnimationActive={true} />
              <Area type="monotone" dataKey="Late" stroke="#F59E0B" fill="url(#gLate)" strokeWidth={2} isAnimationActive={true} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </motion.div>
  );
}
