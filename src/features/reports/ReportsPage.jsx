import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import useEmployeeStore from '@/store/employeeStore';
import { mockAttendance, mockLeaveRequests, mockPayroll } from '@/data/mockData';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { cn } from '@/shared/utils/cn';
import { DEPARTMENTS } from '@/config/constants';
import { useToast } from '@/shared/hooks/useToast';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#EC4899'];

const reportTypes = [
  { key: 'headcount', label: 'Headcount Report', icon: '👥' },
  { key: 'attrition', label: 'Attrition Report', icon: '📉' },
  { key: 'attendance', label: 'Attendance Summary', icon: '📋' },
  { key: 'leave', label: 'Leave Utilization', icon: '🏖️' },
  { key: 'payroll', label: 'Payroll Summary', icon: '💰' },
  { key: 'performance', label: 'Performance Overview', icon: '⭐' },
];

function exportCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const employees = useEmployeeStore((s) => s.employees);
  const [active, setActive] = useState('headcount');
  const toast = useToast();

  const deptData = useMemo(() => DEPARTMENTS.map(d => ({ department: d, count: employees.filter(e => e.department === d).length })), [employees]);
  const leaveTypeData = useMemo(() => { const m = {}; mockLeaveRequests.forEach(l => { m[l.type] = (m[l.type] || 0) + l.days; }); return Object.entries(m).map(([name, value]) => ({ name, value })); }, []);
  const payrollDeptData = useMemo(() => DEPARTMENTS.map(d => ({ department: d, cost: employees.filter(e => e.department === d).reduce((s, e) => s + e.salary, 0) })), [employees]);
  const attSummary = useMemo(() => { const m = {}; mockAttendance.forEach(r => { if (!m[r.date]) m[r.date] = { date: r.date, Present: 0, Absent: 0, Late: 0 }; if (r.status === 'Present' || r.status === 'WFH') m[r.date].Present++; else if (r.status === 'Absent') m[r.date].Absent++; else if (r.status === 'Late') m[r.date].Late++; }); return Object.values(m).sort((a, b) => a.date.localeCompare(b.date)).slice(-10).map(d => ({ ...d, day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })); }, []);

  const handleExport = () => {
    const dataMap = {
      headcount: deptData,
      attrition: [{ month: 'Jan', rate: 2.1 }, { month: 'Feb', rate: 1.8 }, { month: 'Mar', rate: 2.5 }, { month: 'Apr', rate: 1.2 }],
      attendance: attSummary,
      leave: leaveTypeData,
      payroll: payrollDeptData,
      performance: employees.map(e => ({ name: `${e.firstName} ${e.lastName}`, department: e.department, rating: e.performanceRating })),
    };
    exportCSV(dataMap[active], `nexushr_${active}_report`);
    toast.success('Report exported successfully!');
  };

  const attritionData = [{ month: 'Jan', rate: 2.1 }, { month: 'Feb', rate: 1.8 }, { month: 'Mar', rate: 2.5 }, { month: 'Apr', rate: 1.2 }, { month: 'May', rate: 0.9 }];

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}>Export CSV</Button>
          <Button variant="ghost" onClick={() => window.print()} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>}>Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card variant="solid" padding="sm" className="lg:col-span-1">
          <div className="space-y-1 p-2">
            {reportTypes.map(r => (
              <button key={r.key} onClick={() => setActive(r.key)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', active === r.key ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
                <span>{r.icon}</span>{r.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Chart Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="solid" padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{reportTypes.find(r => r.key === active)?.label}</h2>
            <ResponsiveContainer width="100%" height={320}>
              {active === 'headcount' ? (
                <BarChart data={deptData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="department" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} /></BarChart>
              ) : active === 'attrition' ? (
                <LineChart data={attritionData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
              ) : active === 'attendance' ? (
                <AreaChart data={attSummary}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="Present" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} /><Area type="monotone" dataKey="Absent" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} /><Area type="monotone" dataKey="Late" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} /></AreaChart>
              ) : active === 'leave' ? (
                <PieChart><Pie data={leaveTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value" isAnimationActive>{leaveTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
              ) : active === 'payroll' ? (
                <BarChart data={payrollDeptData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="department" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} /><Tooltip formatter={v => formatCurrency(v)} /><Bar dataKey="cost" fill="#6366F1" radius={[6, 6, 0, 0]} /></BarChart>
              ) : (
                <BarChart data={employees.map(e => ({ name: `${e.firstName.charAt(0)}. ${e.lastName}`, rating: e.performanceRating })).sort((a, b) => b.rating - a.rating).slice(0, 10)}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[0, 5]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="rating" fill="#F59E0B" radius={[6, 6, 0, 0]} /></BarChart>
              )}
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
