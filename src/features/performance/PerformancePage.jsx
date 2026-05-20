import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Table from '@/shared/components/Table';
import useEmployeeStore from '@/store/employeeStore';
import { cn } from '@/shared/utils/cn';
import { DEPARTMENTS } from '@/config/constants';
import PerformanceCard from './PerformanceCard';
import ReviewModal from './ReviewModal';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const medals = ['🥇', '🥈', '🥉'];

export default function PerformancePage() {
  const employees = useEmployeeStore((s) => s.employees);
  const [dept, setDept] = useState('');
  const [view, setView] = useState('cards');
  const [reviewEmp, setReviewEmp] = useState(null);

  const active = useMemo(() => employees.filter(e => e.status === 'Active'), [employees]);
  const filtered = useMemo(() => dept ? active.filter(e => e.department === dept) : active, [active, dept]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => b.performanceRating - a.performanceRating), [filtered]);
  const topPerformers = sorted.slice(0, 3);

  const columns = [
    { key: 'name', label: 'Employee', render: (_, r) => (
      <div className="flex items-center gap-3"><Avatar firstName={r.firstName} lastName={r.lastName} size="sm" /><div><p className="font-medium text-gray-900 dark:text-white">{r.firstName} {r.lastName}</p><p className="text-xs text-gray-500">{r.designation}</p></div></div>
    )},
    { key: 'department', label: 'Department', render: v => <Badge status="info">{v}</Badge> },
    { key: 'performanceRating', label: 'Rating', render: v => (
      <div className="flex items-center gap-1">{[1,2,3,4,5].map(i => <svg key={i} className={cn('w-4 h-4', i <= Math.round(v) ? 'text-amber-400' : 'text-gray-300')} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}<span className="text-sm font-bold ml-1">{v}</span></div>
    )},
    { key: 'goals', label: 'Goals Met', render: (_, r) => `${Math.round(r.performanceRating * 2)}/10` },
    { key: 'trend', label: 'Trend', render: (_, r) => <span className={cn('font-bold', r.performanceRating >= 4.5 ? 'text-emerald-500' : r.performanceRating >= 3.5 ? 'text-gray-400' : 'text-red-500')}>{r.performanceRating >= 4.5 ? '↑' : r.performanceRating >= 3.5 ? '→' : '↓'}</span> },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance</h1>
        <div className="flex items-center gap-3">
          <select value={dept} onChange={e => setDept(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-700 dark:text-gray-300">
            <option value="">All Departments</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button onClick={() => setView('cards')} className={cn('px-3 py-2 text-sm', view === 'cards' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>Cards</button>
            <button onClick={() => setView('table')} className={cn('px-3 py-2 text-sm', view === 'table' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>Table</button>
          </div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Performers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topPerformers.map((emp, i) => (
            <Card key={emp.id} variant="glass" padding="md" hover className="text-center">
              <span className="text-3xl">{medals[i]}</span>
              <Avatar firstName={emp.firstName} lastName={emp.lastName} size="lg" className="mx-auto mt-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mt-2 text-sm">{emp.firstName} {emp.lastName}</h3>
              <p className="text-xs text-gray-500">{emp.department}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1,2,3,4,5].map(j => <svg key={j} className={cn('w-5 h-5', j <= Math.round(emp.performanceRating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600')} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                <span className="font-bold text-sm ml-1">{emp.performanceRating}</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {view === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(e => <PerformanceCard key={e.id} employee={e} onViewReview={setReviewEmp} />)}
          </div>
        ) : (
          <Card variant="solid" padding="none">
            <Table columns={columns} data={sorted.map(e => ({ ...e, name: `${e.firstName} ${e.lastName}`, goals: Math.round(e.performanceRating * 2) }))} sortable searchable paginated pageSize={10} />
          </Card>
        )}
      </motion.div>

      <ReviewModal isOpen={!!reviewEmp} onClose={() => setReviewEmp(null)} employee={reviewEmp} />
    </motion.div>
  );
}
