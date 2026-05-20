import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Table from '@/shared/components/Table';
import useEmployeeStore from '@/store/employeeStore';
import useAuthStore from '@/store/authStore';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatDate } from '@/shared/utils/formatDate';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { cn } from '@/shared/utils/cn';
import { DEPARTMENTS, ROLES } from '@/config/constants';
import EmployeeCard from './EmployeeCard';
import AddEmployeeModal from './AddEmployeeModal';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const statusMap = { 'Active': 'active', 'On Leave': 'on-leave', 'Terminated': 'terminated' };

export default function EmployeesPage() {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const employees = useEmployeeStore((s) => s.employees);
  const deleteEmployee = useEmployeeStore((s) => s.deleteEmployee);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState('table');
  const [showAdd, setShowAdd] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return employees.filter(e => {
      if (deptFilter && e.department !== deptFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (typeFilter && e.employmentType !== typeFilter) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!`${e.firstName} ${e.lastName} ${e.email} ${e.department} ${e.designation}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [employees, deptFilter, statusFilter, typeFilter, debouncedSearch]);

  const columns = [
    { key: 'name', label: 'Employee', render: (_, row) => (
      <div className="flex items-center gap-3">
        <Avatar firstName={row.firstName} lastName={row.lastName} size="sm" />
        <div><p className="font-medium text-gray-900 dark:text-white">{row.firstName} {row.lastName}</p><p className="text-xs text-gray-500">{row.email}</p></div>
      </div>
    )},
    { key: 'department', label: 'Department', render: v => <Badge status="info">{v}</Badge> },
    { key: 'designation', label: 'Designation' },
    { key: 'status', label: 'Status', render: v => <Badge status={statusMap[v] || 'neutral'} dot>{v}</Badge> },
    { key: 'dateOfJoining', label: 'Joined', render: v => formatDate(v) },
    { key: 'salary', label: 'Salary', render: v => formatCurrency(v) },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${row.id}`)}>View</Button>
        {(role === ROLES.ADMIN || role === ROLES.HR) && (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${row.id}`)}>Edit</Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteEmployee(row.id)}>Delete</Button>
          </>
        )}
      </div>
    )},
  ];

  const selectCls = "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50";

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
          <Badge status="info">{employees.length}</Badge>
        </div>
        {(role === ROLES.ADMIN || role === ROLES.HR) && (
          <Button variant="primary" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} onClick={() => setShowAdd(true)}>Add Employee</Button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp}>
        <Card variant="glass" padding="md">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-900 dark:text-gray-100" />
            </div>
            <select className={selectCls} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option value="">All Departments</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select className={selectCls} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="">All Status</option><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Terminated">Terminated</option></select>
            <select className={selectCls} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option value="">All Types</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option></select>
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button onClick={() => setView('table')} className={cn('px-3 py-2 text-sm', view === 'table' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>
              <button onClick={() => setView('grid')} className={cn('px-3 py-2 text-sm', view === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeUp}>
        {filtered.length === 0 ? (
          <Card variant="solid" padding="lg" className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No employees found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters</p>
            <Button variant="secondary" className="mt-4" onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); setTypeFilter(''); }}>Clear Filters</Button>
          </Card>
        ) : view === 'table' ? (
          <Card variant="solid" padding="none">
            <Table columns={columns} data={filtered.map(e => ({ ...e, name: `${e.firstName} ${e.lastName}` }))} sortable paginated pageSize={10} onRowClick={(row) => navigate(`/employees/${row.id}`)} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(e => <EmployeeCard key={e.id} employee={e} onView={(emp) => navigate(`/employees/${emp.id}`)} />)}
          </div>
        )}
      </motion.div>

      <AddEmployeeModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </motion.div>
  );
}
