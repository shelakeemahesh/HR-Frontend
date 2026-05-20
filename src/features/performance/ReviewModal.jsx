import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import Modal from '@/shared/components/Modal';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import { cn } from '@/shared/utils/cn';

export default function ReviewModal({ isOpen, onClose, employee }) {
  const [tab, setTab] = useState(0);
  if (!employee) return null;

  const radarData = [
    { subject: 'Communication', current: 4.2, previous: 3.8 },
    { subject: 'Technical', current: employee.performanceRating, previous: employee.performanceRating - 0.3 },
    { subject: 'Teamwork', current: 4.0, previous: 3.5 },
    { subject: 'Leadership', current: 3.8, previous: 3.2 },
    { subject: 'Delivery', current: 4.5, previous: 4.0 },
    { subject: 'Initiative', current: 4.1, previous: 3.7 },
  ];

  const goals = [
    { desc: 'Complete project Alpha milestone', target: '100%', achieved: '95%', status: 'In Progress' },
    { desc: 'Mentor 2 junior developers', target: '2', achieved: '2', status: 'Completed' },
    { desc: 'Reduce bug count by 30%', target: '30%', achieved: '35%', status: 'Exceeded' },
    { desc: 'Obtain AWS certification', target: 'Pass', achieved: 'Scheduled', status: 'Pending' },
    { desc: 'Improve code review turnaround', target: '24h', achieved: '18h', status: 'Completed' },
  ];

  const goalStatusMap = { Completed: 'active', Exceeded: 'success', 'In Progress': 'pending', Pending: 'warning' };
  const tabs = ['Summary', 'Goals', 'Feedback'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Performance Review — ${employee.firstName} ${employee.lastName}`} size="xl">
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
        {tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} className={cn('flex-1 py-2 text-sm font-medium rounded-lg transition-colors', tab === i ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500')}>{t}</button>)}
      </div>

      {tab === 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} isAnimationActive />
              <Radar name="Previous" dataKey="previous" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.1} isAnimationActive />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 1 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Goals & Objectives</h3>
          <div className="space-y-2">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1"><p className="text-sm font-medium text-gray-900 dark:text-white">{g.desc}</p><p className="text-xs text-gray-500 mt-0.5">Target: {g.target} · Achieved: {g.achieved}</p></div>
                <Badge status={goalStatusMap[g.status] || 'neutral'} dot>{g.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Manager Feedback</h4>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300">
              Consistently delivers high-quality work. Excellent collaboration with cross-functional teams. Recommended for expanded responsibilities in the next quarter. Areas for growth include stakeholder communication and strategic planning skills.
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Peer Feedback</h4>
            {['Great team player, always willing to help.', 'Strong technical skills, very reliable.', 'Could improve on documentation practices.'].map((fb, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">Peer {i + 1}: </span>{fb}
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Self Assessment</h4>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300">
              I've focused on improving my technical depth and mentoring abilities this quarter. I'm proud of the bug reduction initiative and plan to continue investing in team development.
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
