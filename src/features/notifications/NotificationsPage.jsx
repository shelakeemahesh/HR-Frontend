import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import useNotificationStore from '@/store/notificationStore';
import { cn } from '@/shared/utils/cn';
import { useToast } from '@/shared/hooks/useToast';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const typeConfig = {
  success: { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  info: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> },
  warning: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg> },
  danger: { color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg> },
};

function timeAgo(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function NotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const toast = useToast();
  const [filter, setFilter] = useState('all');

  // Simulate new notification arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({ title: 'Payroll Reminder', message: 'May payroll processing deadline is approaching. Please review pending items.', type: 'warning' });
      toast.info('New notification received');
    }, 5000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const tabs = [
    { key: 'all', label: 'All' }, { key: 'unread', label: `Unread (${unreadCount})` },
    { key: 'success', label: 'Leave' }, { key: 'warning', label: 'Alerts' }, { key: 'info', label: 'System' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {unreadCount > 0 && <Button variant="ghost" onClick={markAllAsRead}>Mark all as read</Button>}
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap', filter === t.key ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500')}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  layout
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={cn('flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer',
                    n.read ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800' : 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/30')}
                >
                  <div className={cn('shrink-0 h-10 w-10 rounded-xl flex items-center justify-center', cfg.color)}>{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn('text-sm', n.read ? 'text-gray-700 dark:text-gray-300' : 'font-semibold text-gray-900 dark:text-white')}>{n.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card variant="solid" padding="lg" className="text-center">
            <svg className="w-16 h-16 mx-auto text-emerald-300 dark:text-emerald-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All caught up!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">No notifications to show.</p>
          </Card>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
