import { useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { formatCurrency } from '@/shared/utils/formatCurrency';

const numberToWords = (n) => {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (n === 0) return 'Zero';
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + convert(num % 100) : '');
    if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
  };
  return convert(Math.round(n)) + ' Only';
};

export default function PayslipModal({ isOpen, onClose, payroll, employee }) {
  const printRef = useRef();
  if (!payroll || !employee) return null;

  const basicPay = payroll.basicPay;
  const hra = Math.round(basicPay * 0.4);
  const transport = Math.round(basicPay * 0.08);
  const medical = Math.round(basicPay * 0.05);
  const bonus = payroll.bonus || 0;
  const totalEarnings = basicPay + hra + transport + medical + bonus;

  const pf = Math.round(basicPay * 0.12);
  const profTax = 200;
  const tds = Math.round(basicPay * 0.08);
  const leaveDed = 0;
  const totalDeductions = pf + profTax + tds + leaveDed;
  const netPay = totalEarnings - totalDeductions;

  const monthLabel = new Date(payroll.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrint = () => {
    const content = printRef.current;
    const w = window.open('', '', 'width=800,height=600');
    w.document.write('<html><head><title>Payslip - ' + employee.firstName + '</title><style>body{font-family:Inter,system-ui,sans-serif;padding:40px;color:#1f2937}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{padding:8px 12px;text-align:left;border-bottom:1px solid #e5e7eb;font-size:13px}th{font-weight:600;background:#f9fafb}.net-box{background:#4F46E5;color:white;padding:16px;border-radius:12px;text-align:center;margin-top:16px}.net-box h3{font-size:24px;margin:4px 0}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #4F46E5;padding-bottom:12px;margin-bottom:20px}.section-title{font-weight:700;font-size:14px;color:#4F46E5;margin:16px 0 4px;text-transform:uppercase;letter-spacing:0.5px}</style></head><body>');
    w.document.write(content.innerHTML);
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payslip" size="lg">
      <div ref={printRef}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-primary-600 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="10" r="3.5" fill="#818CF8"/><circle cx="10" cy="22" r="3.5" fill="#6366F1"/><circle cx="26" cy="22" r="3.5" fill="#A5B4FC"/><circle cx="18" cy="10" r="2" fill="#EEF2FF"/><circle cx="10" cy="22" r="2" fill="#EEF2FF"/><circle cx="26" cy="22" r="2" fill="#EEF2FF"/></svg>
            <span className="font-bold text-lg text-gray-900 dark:text-white">NexusHR</span>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-primary-600">PAYSLIP</h3>
            <p className="text-xs text-gray-500">{monthLabel}</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-5">
          {[['Name', `${employee.firstName} ${employee.lastName}`], ['Employee ID', employee.id], ['Department', employee.department], ['Designation', employee.designation], ['Account No.', 'XXXX XXXX 1234'], ['PAN', 'XXXXX1234X']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">{k}</span><span className="font-medium text-gray-900 dark:text-white">{v}</span>
            </div>
          ))}
        </div>

        {/* Earnings */}
        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Earnings</p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <tbody>
              {[['Basic Salary', basicPay], ['HRA', hra], ['Transport Allowance', transport], ['Medical Allowance', medical], ['Performance Bonus', bonus]].map(([l, v]) => (
                <tr key={l} className="border-b border-gray-100 dark:border-gray-800 last:border-0"><td className="px-4 py-2 text-gray-600 dark:text-gray-400">{l}</td><td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(v)}</td></tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800 font-semibold"><td className="px-4 py-2 text-gray-900 dark:text-white">Total Earnings</td><td className="px-4 py-2 text-right text-emerald-600">{formatCurrency(totalEarnings)}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Deductions</p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <tbody>
              {[['Provident Fund (PF)', pf], ['Professional Tax', profTax], ['Tax Deducted at Source (TDS)', tds], ['Leave Deductions', leaveDed]].map(([l, v]) => (
                <tr key={l} className="border-b border-gray-100 dark:border-gray-800 last:border-0"><td className="px-4 py-2 text-gray-600 dark:text-gray-400">{l}</td><td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{formatCurrency(v)}</td></tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800 font-semibold"><td className="px-4 py-2 text-gray-900 dark:text-white">Total Deductions</td><td className="px-4 py-2 text-right text-red-500">{formatCurrency(totalDeductions)}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Net Pay */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-5 text-center text-white">
          <p className="text-xs uppercase tracking-wider opacity-80">Net Pay</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(netPay)}</p>
          <p className="text-xs mt-1 opacity-70">{numberToWords(netPay)}</p>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-4 italic">This is a system-generated payslip and does not require a signature.</p>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handlePrint} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}>Download PDF</Button>
      </div>
    </Modal>
  );
}
