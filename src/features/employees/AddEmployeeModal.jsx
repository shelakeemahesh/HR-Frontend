import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import useEmployeeStore from '@/store/employeeStore';
import { DEPARTMENTS } from '@/config/constants';

const steps = ['Personal Info', 'Job Details', 'Review'];

const initialForm = { firstName: '', lastName: '', email: '', phone: '', location: '', department: '', designation: '', employmentType: 'Full-time', dateOfJoining: '', salary: '', manager: '', status: 'Active' };

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const employees = useEmployeeStore((s) => s.employees);

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: '' })); };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim()) e.lastName = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
      if (!form.phone.trim()) e.phone = 'Required';
    }
    if (step === 1) {
      if (!form.department) e.department = 'Required';
      if (!form.designation.trim()) e.designation = 'Required';
      if (!form.dateOfJoining) e.dateOfJoining = 'Required';
      if (!form.salary || isNaN(Number(form.salary))) e.salary = 'Must be a number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 2)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    addEmployee({ ...form, salary: Number(form.salary), avatar: null, performanceRating: 0, leaveBalance: 20 });
    setLoading(false);
    setForm({ ...initialForm });
    setStep(0);
    onClose();
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const errCls = "text-xs text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" size="lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>First Name *</label><input className={inputCls} value={form.firstName} onChange={e => set('firstName', e.target.value)} />{errors.firstName && <p className={errCls}>{errors.firstName}</p>}</div>
              <div><label className={labelCls}>Last Name *</label><input className={inputCls} value={form.lastName} onChange={e => set('lastName', e.target.value)} />{errors.lastName && <p className={errCls}>{errors.lastName}</p>}</div>
              <div><label className={labelCls}>Email *</label><input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} />{errors.email && <p className={errCls}>{errors.email}</p>}</div>
              <div><label className={labelCls}>Phone *</label><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} />{errors.phone && <p className={errCls}>{errors.phone}</p>}</div>
              <div className="sm:col-span-2"><label className={labelCls}>Location</label><input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} /></div>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Department *</label><select className={inputCls} value={form.department} onChange={e => set('department', e.target.value)}><option value="">Select</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>{errors.department && <p className={errCls}>{errors.department}</p>}</div>
              <div><label className={labelCls}>Designation *</label><input className={inputCls} value={form.designation} onChange={e => set('designation', e.target.value)} />{errors.designation && <p className={errCls}>{errors.designation}</p>}</div>
              <div><label className={labelCls}>Employment Type</label><select className={inputCls} value={form.employmentType} onChange={e => set('employmentType', e.target.value)}><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
              <div><label className={labelCls}>Date of Joining *</label><input type="date" className={inputCls} value={form.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} />{errors.dateOfJoining && <p className={errCls}>{errors.dateOfJoining}</p>}</div>
              <div><label className={labelCls}>Salary *</label><input type="number" className={inputCls} value={form.salary} onChange={e => set('salary', e.target.value)} />{errors.salary && <p className={errCls}>{errors.salary}</p>}</div>
              <div><label className={labelCls}>Manager</label><select className={inputCls} value={form.manager} onChange={e => set('manager', e.target.value)}><option value="">None</option>{employees.map(emp => <option key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>{emp.firstName} {emp.lastName}</option>)}</select></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Review Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Name', `${form.firstName} ${form.lastName}`], ['Email', form.email], ['Phone', form.phone], ['Location', form.location || '—'], ['Department', form.department], ['Designation', form.designation], ['Type', form.employmentType], ['Joining', form.dateOfJoining], ['Salary', `$${Number(form.salary).toLocaleString()}`], ['Manager', form.manager || '—']].map(([k, v]) => (
                  <div key={k}><p className="text-gray-500 dark:text-gray-400 text-xs">{k}</p><p className="font-medium text-gray-900 dark:text-white">{v}</p></div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={step === 0 ? onClose : prev}>{step === 0 ? 'Cancel' : 'Back'}</Button>
        {step < 2 ? <Button variant="primary" onClick={next}>Continue</Button> : <Button variant="primary" loading={loading} onClick={handleSubmit}>Add Employee</Button>}
      </div>
    </Modal>
  );
}
