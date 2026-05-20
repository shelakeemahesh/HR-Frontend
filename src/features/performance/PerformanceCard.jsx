import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Button from '@/shared/components/Button';
import { cn } from '@/shared/utils/cn';

const trendIcons = { up: '↑', down: '↓', stable: '→' };
const trendColors = { up: 'text-emerald-500', down: 'text-red-500', stable: 'text-gray-400' };

function ProgressBar({ label, value, max, color = 'bg-primary-500' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-gray-500 dark:text-gray-400">{label}</span><span className="font-medium text-gray-700 dark:text-gray-300">{value}/{max}</span></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export default function PerformanceCard({ employee, onViewReview }) {
  const trend = employee.performanceRating >= 4.5 ? 'up' : employee.performanceRating >= 3.5 ? 'stable' : 'down';
  const goals = Math.round(employee.performanceRating * 2);
  const attendance = Math.round(75 + employee.performanceRating * 5);
  const peerScore = Math.min(5, (employee.performanceRating * 0.9 + 0.5).toFixed(1));

  return (
    <Card variant="glass" padding="md" hover>
      <div className="flex items-start gap-3 mb-4">
        <Avatar firstName={employee.firstName} lastName={employee.lastName} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{employee.firstName} {employee.lastName}</h3>
          <p className="text-xs text-gray-500">{employee.designation}</p>
          <Badge status="info" className="mt-1">{employee.department}</Badge>
        </div>
        <span className={cn('text-lg font-bold', trendColors[trend])}>{trendIcons[trend]}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className={cn('w-5 h-5', i <= Math.round(employee.performanceRating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600')} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{employee.performanceRating}</span>
      </div>

      <div className="space-y-3">
        <ProgressBar label="Goals Achieved" value={goals} max={10} color="bg-emerald-500" />
        <ProgressBar label="Attendance Score" value={attendance} max={100} color="bg-blue-500" />
        <ProgressBar label="Peer Review" value={peerScore} max={5} color="bg-purple-500" />
      </div>

      <p className="text-[10px] text-gray-400 mt-3">Reviewed 2 months ago</p>
      <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => onViewReview(employee)}>View Full Review</Button>
    </Card>
  );
}
