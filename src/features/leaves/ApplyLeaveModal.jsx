import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';

export default function ApplyLeaveModal({ isOpen, onClose, onSubmit, leaveBalance = { Annual: 12, Sick: 6, Casual: 3 } }) {
  const [form, setForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: '' })); };

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end < start) return 0;
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) { const dow = cur.getDay(); if (dow !== 0 && dow !== 6) count++; cur.setDate(cur.getDate() + 1); }
    return count;
  };

  const days = calcDays();

  const validate = () => {
    const e = {};
    const today = new Date().toISOString().split('T')[0];
    if (!form.startDate) e.startDate = 'Required';
    else if (form.startDate < today) e.startDate = 'Cannot be past date';
    if (!form.endDate) e.endDate = 'Required';
    else if (form.endDate < form.startDate) e.endDate = 'Must be after start date';
    if (!form.reason.trim()) e.reason = 'Required';
    if (form.type !== 'Unpaid' && days > (leaveBalance[form.type] || 0)) e.type = `Only ${leaveBalance[form.type] || 0} days available`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit({ ...form, days });
    setLoading(false);
    setForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
    onClose();
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const errCls = "text-xs text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave" size="md">
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Leave Type</label>
          <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
            <option>Annual</option><option>Sick</option><option>Casual</option><option>Unpaid</option>
          </select>
          {errors.type && <p className={errCls}>{errors.type}</p>}
          {form.type !== 'Unpaid' && (
            <p className="text-xs text-gray-500 mt-1">Balance: {leaveBalance[form.type] || 0} days available</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>From Date *</label><input type="date" className={inputCls} value={form.startDate} onChange={e => set('startDate', e.target.value)} />{errors.startDate && <p className={errCls}>{errors.startDate}</p>}</div>
          <div><label className={labelCls}>To Date *</label><input type="date" className={inputCls} value={form.endDate} onChange={e => set('endDate', e.target.value)} />{errors.endDate && <p className={errCls}>{errors.endDate}</p>}</div>
        </div>
        {days > 0 && (
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm font-medium text-primary-700 dark:text-primary-300">
            Duration: {days} working day{days !== 1 ? 's' : ''}
          </div>
        )}
        <div>
          <label className={labelCls}>Reason *</label>
          <textarea className={inputCls} rows={3} value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="Explain the reason for your leave..." />
          {errors.reason && <p className={errCls}>{errors.reason}</p>}
        </div>
        {form.type === 'Sick' && (
          <div>
            <label className={labelCls}>Attach Medical Certificate (optional)</label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 transition-colors">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={loading} onClick={handleSubmit}>Submit Request</Button>
      </div>
    </Modal>
  );
}
