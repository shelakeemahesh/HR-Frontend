import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import { mockAttendance } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { DEPARTMENTS } from '@/config/constants';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const statusBadge = { Present: 'active', Absent: 'rejected', Late: 'warning', 'Half-day': 'pending', WFH: 'info' };
const statusDot = { Present: 'bg-emerald-400', Absent: 'bg-red-400', Late: 'bg-amber-400', 'Half-day': 'bg-yellow-400', WFH: 'bg-blue-400' };

export default function AttendancePage() {
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2026-04-30');
  const [deptFilter, setDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedDay, setSelectedDay] = useState('');

  const filtered = useMemo(() => {
    return mockAttendance.filter(r => {
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      if (deptFilter) {
        const emp = r.employeeName;
        if (!emp) return false;
      }
      if (selectedDay && r.date !== selectedDay) return false;
      return true;
    });
  }, [dateFrom, dateTo, deptFilter, selectedDay]);

  const today = '2026-04-28';
  const todayData = mockAttendance.filter(r => r.date === today);
  const summary = {
    present: todayData.filter(r => r.status === 'Present' || r.status === 'WFH').length,
    absent: todayData.filter(r => r.status === 'Absent').length,
    late: todayData.filter(r => r.status === 'Late').length,
    halfDay: todayData.filter(r => r.status === 'Half-day').length,
  };

  const calendarDays = useMemo(() => {
    const days = {};
    mockAttendance.forEach(r => {
      if (!days[r.date]) days[r.date] = { Present: 0, Absent: 0, Late: 0, 'Half-day': 0, WFH: 0 };
      if (days[r.date][r.status] !== undefined) days[r.date][r.status]++;
    });
    return Object.entries(days).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const columns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'date', label: 'Date', render: v => formatDate(v) },
    { key: 'checkIn', label: 'Check-In', render: v => v || '—' },
    { key: 'checkOut', label: 'Check-Out', render: v => v || '—' },
    { key: 'hoursWorked', label: 'Duration', render: v => v ? `${v}h` : '—' },
    { key: 'status', label: 'Status', render: v => <Badge status={statusBadge[v] || 'neutral'} dot>{v}</Badge> },
  ];

  const kpis = [
    { label: 'Present Today', value: summary.present, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Absent Today', value: summary.absent, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Late Arrivals', value: summary.late, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Half-Day / WFH', value: summary.halfDay, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  ];

  const inputCls = "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50";

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <Button variant="secondary" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}>Export CSV</Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} variant="glass" padding="md">
            <div className="flex items-center gap-3">
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', k.bg)}>
                <span className={cn('text-2xl font-bold', k.color)}>{k.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{k.label}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp}>
        <Card variant="glass" padding="md">
          <div className="flex flex-wrap items-center gap-3">
            <div><label className="text-xs text-gray-500 block mb-1">From</label><input type="date" className={inputCls} value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
            <div><label className="text-xs text-gray-500 block mb-1">To</label><input type="date" className={inputCls} value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Department</label><select className={inputCls} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option value="">All</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="flex items-end gap-2 ml-auto">
              {selectedDay && <Button variant="ghost" size="sm" onClick={() => setSelectedDay('')}>Clear Day Filter</Button>}
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button onClick={() => setViewMode('table')} className={cn('px-3 py-2 text-sm', viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>Table</button>
                <button onClick={() => setViewMode('calendar')} className={cn('px-3 py-2 text-sm', viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>Calendar</button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeUp}>
        {viewMode === 'table' ? (
          <Card variant="solid" padding="none">
            <Table columns={columns} data={filtered} sortable paginated pageSize={15} searchable />
          </Card>
        ) : (
          <Card variant="solid" padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Calendar View</h3>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center text-xs font-medium text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map(([date, counts]) => {
                const d = new Date(date);
                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                const isSelected = selectedDay === date;
                return (
                  <button key={date} onClick={() => setSelectedDay(isSelected ? '' : date)}
                    className={cn('p-2 rounded-xl text-center transition-all hover:ring-2 hover:ring-primary-500/50', isSelected ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' : 'bg-gray-50 dark:bg-gray-800/50')}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{d.getDate()}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {counts.Present > 0 && <span className={cn('h-1.5 w-1.5 rounded-full', statusDot.Present)} />}
                      {counts.Absent > 0 && <span className={cn('h-1.5 w-1.5 rounded-full', statusDot.Absent)} />}
                      {counts.Late > 0 && <span className={cn('h-1.5 w-1.5 rounded-full', statusDot.Late)} />}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedDay && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Records for {formatDate(selectedDay)}</h4>
                <Table columns={columns} data={filtered} sortable paginated pageSize={10} />
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
