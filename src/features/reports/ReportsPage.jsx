import { useState, useMemo, useEffect } from 'react';
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
import api from '@/config/axios';
import Modal from '@/shared/components/Modal';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';

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

  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (active === 'attrition') {
      const fetchPredictions = async () => {
        setIsLoadingPredictions(true);
        try {
          const response = await api.get('/employees/attrition-predictions');
          setPredictions(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch attrition predictions", error);
          toast.error("Failed to connect to the backend AI prediction service.");
        } finally {
          setIsLoadingPredictions(false);
        }
      };
      fetchPredictions();
    }
  }, [active]);

  const handleAnalyzeClick = async (empId) => {
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    setSelectedPrediction(null);
    try {
      const response = await api.get(`/employees/${empId}/attrition-risk`);
      setSelectedPrediction(response.data.data);
    } catch (error) {
      console.error("Failed to fetch detailed risk analysis", error);
      toast.error("Failed to load detailed attrition risk analysis.");
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

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

          {active === 'attrition' && (
            <Card variant="solid" padding="md">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🧠</span> Predictive AI Attrition Risk Assessment
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leverages multi-dimensional features (net salary competitiveness, leave approval rates, recent attendance, and tenure) to estimate attrition probability.
                  </p>
                </div>
              </div>

              {isLoadingPredictions ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
                        <th className="px-4 py-3 text-left">Employee Name</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Designation</th>
                        <th className="px-4 py-3 text-left">Risk Score</th>
                        <th className="px-4 py-3 text-left">Risk Level</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {predictions.length > 0 ? (
                        predictions.map((pred) => (
                          <tr key={pred.employeeId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{pred.name}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{pred.department}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{pred.designation}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      'h-full rounded-full',
                                      pred.riskScore > 70 ? 'bg-red-500' : pred.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                                    )}
                                    style={{ width: `${pred.riskScore}%` }}
                                  />
                                </div>
                                <span className="font-semibold">{pred.riskScore}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                status={
                                  pred.riskLevel === 'HIGH' ? 'danger' : pred.riskLevel === 'MEDIUM' ? 'warning' : 'success'
                                }
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button variant="secondary" size="xs" onClick={() => handleAnalyzeClick(pred.employeeId)}>
                                Analyze Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                            No prediction data available. Make sure backend is running and data is seeded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* AI Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Attrition Risk Analysis" size="lg">
        {isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner size="lg" />
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Running feature-weight correlation model...</span>
          </div>
        ) : selectedPrediction ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPrediction.employeeName}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPrediction.department} Department</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">Risk Probability</div>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className={cn(
                    'text-3xl font-extrabold',
                    selectedPrediction.riskScore > 70 ? 'text-red-500' : selectedPrediction.riskScore >= 40 ? 'text-amber-500' : 'text-emerald-500'
                  )}>
                    {selectedPrediction.riskScore}%
                  </span>
                  <Badge status={selectedPrediction.riskLevel === 'HIGH' ? 'danger' : selectedPrediction.riskLevel === 'MEDIUM' ? 'warning' : 'success'} />
                </div>
              </div>
            </div>

            {/* Risk factors */}
            <div>
              <h5 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">Key Attrition Risk Factors</h5>
              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4">
                {selectedPrediction.riskFactors && selectedPrediction.riskFactors.length > 0 ? (
                  <ul className="space-y-2.5">
                    {selectedPrediction.riskFactors.map((f, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-red-500 shrink-0 select-none">⚠️</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No significant risk drivers identified. Employee shows high stability profiles.</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h5 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">AI Recommendations & Retention Plan</h5>
              <div className="bg-primary-50/30 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/20 rounded-2xl p-4">
                <ul className="space-y-3">
                  {selectedPrediction.recommendations && selectedPrediction.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                        id={`rec-${i}`}
                      />
                      <label htmlFor={`rec-${i}`} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                        {r}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Error loading details.</div>
        )}
      </Modal>
    </motion.div>
  );
}
