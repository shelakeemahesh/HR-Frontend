import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import { mockLeaveRequests } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';
import { ROLES, DEPARTMENTS } from '@/config/constants';
import LeaveApprovalCard from './LeaveApprovalCard';
import ApplyLeaveModal from './ApplyLeaveModal';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const statusBadge = { Pending: 'pending', Approved: 'approved', Rejected: 'rejected' };

export default function LeavesPage() {
  const role = useAuthStore((s) => s.role);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [leaves, setLeaves] = useState([...mockLeaveRequests]);
  const [showApply, setShowApply] = useState(false);
  const [adminTab, setAdminTab] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const pendingLeaves = useMemo(() => leaves.filter(l => l.status === 'Pending').sort((a, b) => new Date(a.startDate) - new Date(b.startDate)), [leaves]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      if (statusFilter && l.status !== statusFilter) return false;
      return true;
    });
  }, [leaves, statusFilter]);

  const handleApprove = (id, note) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved', approvedBy: 'Current User' } : l));
    addNotification({ title: 'Leave Approved', message: `Leave request ${id} has been approved.${note ? ' Note: ' + note : ''}`, type: 'success' });
  };

  const handleReject = (id, note) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected', approvedBy: 'Current User' } : l));
    addNotification({ title: 'Leave Rejected', message: `Leave request ${id} has been rejected.${note ? ' Reason: ' + note : ''}`, type: 'danger' });
  };

  const handleApplySubmit = (data) => {
    const newLeave = {
      id: `LR${String(Date.now()).slice(-3)}`,
      employeeId: 'EMP001',
      employeeName: 'Current Employee',
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      reason: data.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: null,
    };
    setLeaves(prev => [newLeave, ...prev]);
    addNotification({ title: 'Leave Applied', message: `Your ${data.type} leave request for ${data.days} days has been submitted.`, type: 'info' });
  };

  const handleCancel = (id) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
    addNotification({ title: 'Leave Cancelled', message: `Leave request ${id} has been cancelled.`, type: 'info' });
  };

  const allColumns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'type', label: 'Type', render: v => <Badge status="info">{v}</Badge> },
    { key: 'startDate', label: 'From', render: v => formatDate(v) },
    { key: 'endDate', label: 'To', render: v => formatDate(v) },
    { key: 'days', label: 'Days' },
    { key: 'reason', label: 'Reason', render: v => <span className="line-clamp-1 max-w-[200px]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <Badge status={statusBadge[v] || 'neutral'} dot>{v}</Badge> },
    { key: 'appliedOn', label: 'Applied', render: v => formatDate(v) },
  ];

  const myColumns = [
    { key: 'type', label: 'Type', render: v => <Badge status="info">{v}</Badge> },
    { key: 'startDate', label: 'From', render: v => formatDate(v) },
    { key: 'endDate', label: 'To', render: v => formatDate(v) },
    { key: 'days', label: 'Days' },
    { key: 'reason', label: 'Reason', render: v => <span className="line-clamp-1 max-w-[200px]">{v}</span> },
    { key: 'status', label: 'Status', render: v => <Badge status={statusBadge[v] || 'neutral'} dot>{v}</Badge> },
    { key: 'appliedOn', label: 'Applied', render: v => formatDate(v) },
    { key: 'actions', label: 'Actions', render: (_, row) => row.status === 'Pending' ? <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleCancel(row.id)}>Cancel</Button> : null },
  ];

  // ═══ EMPLOYEE VIEW ═══
  if (role === ROLES.EMPLOYEE) {
    const myLeaves = leaves.filter(l => l.employeeId === 'EMP001');
    return (
      <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Leaves</h1>
          <Button variant="primary" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} onClick={() => setShowApply(true)}>Apply Leave</Button>
        </motion.div>

        {/* Balance Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{ type: 'Annual', total: 12, used: 4 }, { type: 'Sick', total: 6, used: 2 }, { type: 'Casual', total: 3, used: 1 }].map(b => (
            <Card key={b.type} variant="glass" padding="md">
              <div className="flex justify-between items-start mb-3">
                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">{b.type} Leave</p><p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{b.total - b.used}<span className="text-sm text-gray-400 font-normal">/{b.total}</span></p></div>
                <Badge status={b.total - b.used > 2 ? 'success' : 'warning'}>{b.used} used</Badge>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(b.used / b.total) * 100}%` }} /></div>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card variant="solid" padding="none">
            <Table columns={myColumns} data={myLeaves} sortable paginated pageSize={10} />
          </Card>
        </motion.div>

        <ApplyLeaveModal isOpen={showApply} onClose={() => setShowApply(false)} onSubmit={handleApplySubmit} />
      </motion.div>
    );
  }

  // ═══ ADMIN / HR VIEW ═══
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
        <div className="flex items-center gap-3">
          <Badge status={pendingLeaves.length > 0 ? 'warning' : 'success'} dot>{pendingLeaves.length} Pending</Badge>
          <Button variant="secondary" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}>Export CSV</Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp}>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button onClick={() => setAdminTab('pending')} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', adminTab === 'pending' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500')}>
            Pending Approvals {pendingLeaves.length > 0 && <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{pendingLeaves.length}</span>}
          </button>
          <button onClick={() => setAdminTab('all')} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', adminTab === 'all' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500')}>
            All Requests
          </button>
        </div>
      </motion.div>

      {adminTab === 'pending' ? (
        <motion.div variants={fadeUp} className="space-y-3">
          <AnimatePresence>
            {pendingLeaves.length > 0 ? pendingLeaves.map(l => (
              <LeaveApprovalCard key={l.id} request={l} onApprove={handleApprove} onReject={handleReject} />
            )) : (
              <Card variant="solid" padding="lg" className="text-center">
                <svg className="w-16 h-16 mx-auto text-emerald-300 dark:text-emerald-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All caught up!</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">No pending leave requests to review.</p>
              </Card>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp}>
          <Card variant="glass" padding="sm" className="mb-4">
            <div className="flex flex-wrap gap-3 p-2">
              <select className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option><option>Pending</option><option>Approved</option><option>Rejected</option>
              </select>
            </div>
          </Card>
          <Card variant="solid" padding="none">
            <Table columns={allColumns} data={filteredLeaves} sortable searchable paginated pageSize={10} />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
