import { cn } from '@/shared/utils/cn';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Avatar from '@/shared/components/Avatar';
import Button from '@/shared/components/Button';

export default function EmployeeCard({ employee, onView }) {
  const statusMap = { 'Active': 'active', 'On Leave': 'on-leave', 'Terminated': 'terminated' };
  return (
    <Card variant="glass" padding="md" hover className="flex flex-col items-center text-center">
      <Avatar firstName={employee.firstName} lastName={employee.lastName} size="lg" />
      <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{employee.firstName} {employee.lastName}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{employee.designation}</p>
      <div className="flex gap-2 mt-2">
        <Badge status="info">{employee.department}</Badge>
        <Badge status={statusMap[employee.status] || 'neutral'} dot>{employee.status}</Badge>
      </div>
      <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400 w-full text-left">
        <p className="truncate">📧 {employee.email}</p>
        <p>📞 {employee.phone}</p>
      </div>
      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => onView(employee)}>View Profile</Button>
    </Card>
  );
}
