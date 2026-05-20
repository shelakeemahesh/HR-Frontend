import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/shared/components/Avatar';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import { formatDate, formatRelativeTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';

export default function LeaveApprovalCard({ request, onApprove, onReject }) {
  const [action, setAction] = useState(null); // 'approve' | 'reject'
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    if (action === 'approve') onApprove(request.id, note);
    else onReject(request.id, note);
    setProcessing(false);
  };

  const nameParts = request.employeeName.split(' ');

  return (
    <motion.div layout exit={{ x: -200, opacity: 0 }} transition={{ duration: 0.3 }}
      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Avatar */}
        <div className="flex items-start gap-3 sm:w-48 shrink-0">
          <Avatar firstName={nameParts[0]} lastName={nameParts[1]} size="md" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{request.employeeName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Applied {formatRelativeTime(request.appliedOn)}</p>
          </div>
        </div>

        {/* Center: Details */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge status="info">{request.type}</Badge>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {formatDate(request.startDate)} — {formatDate(request.endDate)}
            </span>
            <Badge status="neutral">{request.days} days</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{request.reason}</p>
        </div>

        {/* Right: Actions */}
        {!action && (
          <div className="flex items-start gap-2 shrink-0">
            <Button variant="primary" size="sm" onClick={() => setAction('approve')}
              className="bg-emerald-600 hover:bg-emerald-700 from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600">
              Approve
            </Button>
            <Button variant="outline" size="sm" className="border-red-300 text-red-600 dark:text-red-400 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => setAction('reject')}>
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Inline Note */}
      <AnimatePresence>
        {action && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {action === 'approve' ? '✅ Add approval note (optional):' : '❌ Add rejection reason:'}
            </p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add a note..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none" />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={() => { setAction(null); setNote(''); }}>Cancel</Button>
              <Button variant="primary" size="sm" loading={processing} onClick={handleConfirm}
                className={action === 'approve' ? 'from-emerald-600 to-emerald-500' : 'from-red-600 to-red-500'}>
                Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
