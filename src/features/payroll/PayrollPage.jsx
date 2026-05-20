import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import Modal from '@/shared/components/Modal';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import { mockPayroll } from '@/data/mockData';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useToast } from '@/shared/hooks/useToast';
import { ROLES } from '@/config/constants';
import PayslipModal from './PayslipModal';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const statusBadge = { Paid: 'active', Processing: 'pending', 'On Hold': 'rejected' };

export default function PayrollPage() {
  const role = useAuthStore((s) => s.role);
  const employees = useEmployeeStore((s) => s.employees);
  const toast = useToast();
  const [month, setMonth] = useState('2026-05');
  const [payrollData, setPayrollData] = useState([...mockPayroll]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showRunConfirm, setShowRunConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const monthData = useMemo(() => payrollData.filter(p => p.month === month), [payrollData, month]);
  const totalCost = monthData.reduce((s, p) => s + p.netPay, 0);
  const processed = monthData.filter(p => p.status === 'Paid').length;
  const pending = monthData.filter(p => p.status === 'Processing').length;
  const avgSalary = monthData.length ? Math.round(totalCost / monthData.length) : 0;

  const handleRunPayroll = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPayrollData(prev => prev.map(p => p.month === month && p.status === 'Processing' ? { ...p, status: 'Paid', paidOn: new Date().toISOString().split('T')[0] } : p));
    setProcessing(false);
    setShowRunConfirm(false);
    toast.success(`Payroll processed for ${pending} employees!`);
  };

  const getEmployee = (id) => employees.find(e => e.id === id);

  const columns = [
    { key: 'employeeName', label: 'Employee' },
    { key: 'basicPay', label: 'Basic', render: v => formatCurrency(v) },
    { key: 'bonus', label: 'Allowances', render: (v, row) => formatCurrency(Math.round(row.basicPay * 0.53) + (v || 0)) },
    { key: 'deductions', label: 'Deductions', render: v => <span className="text-red-500">{formatCurrency(v)}</span> },
    { key: 'netPay', label: 'Net Pay', render: v => <span className="font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', label: 'Status', render: v => <Badge status={statusBadge[v] || 'neutral'} dot>{v}</Badge> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(row)}>View Payslip</Button>
      </div>
    )},
  ];

  const kpis = [
    { label: 'Total Payroll Cost', value: formatCurrency(totalCost), color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-100 dark:bg-primary-900/30' },
    { label: 'Processed', value: processed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Pending', value: pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Average Salary', value: formatCurrency(avgSalary), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  ];

  const monthLabel = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll</h1>
        <div className="flex items-center gap-3">
          <select value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
            <option value="2026-05">May 2026</option><option value="2026-04">Apr 2026</option><option value="2026-03">Mar 2026</option><option value="2026-02">Feb 2026</option><option value="2026-01">Jan 2026</option><option value="2025-12">Dec 2025</option>
          </select>
          {role === ROLES.ADMIN && pending > 0 && (
            <Button variant="primary" onClick={() => setShowRunConfirm(true)}>Run Payroll</Button>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} variant="glass" padding="md">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card variant="solid" padding="none">
          <Table columns={columns} data={monthData} sortable searchable paginated pageSize={10} />
        </Card>
      </motion.div>

      {/* Run Payroll Confirmation */}
      <Modal isOpen={showRunConfirm} onClose={() => setShowRunConfirm(false)} title="Run Payroll" size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-400">Process payroll for <strong>{monthLabel}</strong> for <strong>{pending} employees</strong> totaling <strong>{formatCurrency(monthData.filter(p => p.status === 'Processing').reduce((s, p) => s + p.netPay, 0))}</strong>?</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => setShowRunConfirm(false)}>Cancel</Button>
          <Button variant="primary" loading={processing} onClick={handleRunPayroll}>Confirm</Button>
        </div>
      </Modal>

      {/* Payslip Modal */}
      <PayslipModal isOpen={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} payroll={selectedPayslip} employee={selectedPayslip ? getEmployee(selectedPayslip.employeeId) : null} />
    </motion.div>
  );
}
