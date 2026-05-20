import { EMPLOYEE_STATUS, EMPLOYMENT_TYPE, LEAVE_STATUS } from '../config/constants';

export const mockEmployees = [
  { id: 'EMP001', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@nexushr.com', phone: '+1 (555) 234-5001', department: 'Engineering', designation: 'Senior Software Engineer', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2021-03-15', salary: 125000, manager: 'Priya Sharma', avatar: null, location: 'San Francisco, CA', performanceRating: 4.5, leaveBalance: 18 },
  { id: 'EMP002', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@nexushr.com', phone: '+1 (555) 234-5002', department: 'Engineering', designation: 'Engineering Manager', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2019-07-01', salary: 165000, manager: 'Rajesh Gupta', avatar: null, location: 'San Francisco, CA', performanceRating: 4.8, leaveBalance: 22 },
  { id: 'EMP003', firstName: 'Marcus', lastName: 'Williams', email: 'marcus.williams@nexushr.com', phone: '+1 (555) 234-5003', department: 'HR', designation: 'HR Business Partner', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2020-01-10', salary: 95000, manager: 'Elena Rodriguez', avatar: null, location: 'New York, NY', performanceRating: 4.2, leaveBalance: 15 },
  { id: 'EMP004', firstName: 'Elena', lastName: 'Rodriguez', email: 'elena.rodriguez@nexushr.com', phone: '+1 (555) 234-5004', department: 'HR', designation: 'VP of People', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2018-05-20', salary: 185000, manager: 'Rajesh Gupta', avatar: null, location: 'New York, NY', performanceRating: 4.9, leaveBalance: 20 },
  { id: 'EMP005', firstName: 'David', lastName: 'Chen', email: 'david.chen@nexushr.com', phone: '+1 (555) 234-5005', department: 'Finance', designation: 'Financial Analyst', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2022-02-14', salary: 88000, manager: 'Sarah Johnson', avatar: null, location: 'Chicago, IL', performanceRating: 3.8, leaveBalance: 12 },
  { id: 'EMP006', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@nexushr.com', phone: '+1 (555) 234-5006', department: 'Finance', designation: 'Finance Director', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2017-11-03', salary: 155000, manager: 'Rajesh Gupta', avatar: null, location: 'Chicago, IL', performanceRating: 4.6, leaveBalance: 25 },
  { id: 'EMP007', firstName: 'Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@nexushr.com', phone: '+1 (555) 234-5007', department: 'Marketing', designation: 'Marketing Specialist', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ON_LEAVE, dateOfJoining: '2023-01-09', salary: 72000, manager: 'Aisha Patel', avatar: null, location: 'Austin, TX', performanceRating: 3.5, leaveBalance: 5 },
  { id: 'EMP008', firstName: 'Aisha', lastName: 'Patel', email: 'aisha.patel@nexushr.com', phone: '+1 (555) 234-5008', department: 'Marketing', designation: 'Head of Marketing', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2019-04-22', salary: 140000, manager: 'Rajesh Gupta', avatar: null, location: 'Austin, TX', performanceRating: 4.4, leaveBalance: 17 },
  { id: 'EMP009', firstName: 'James', lastName: "O'Brien", email: 'james.obrien@nexushr.com', phone: '+1 (555) 234-5009', department: 'Operations', designation: 'Operations Coordinator', employmentType: EMPLOYMENT_TYPE.PART_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2023-06-15', salary: 52000, manager: 'Liam Foster', avatar: null, location: 'Denver, CO', performanceRating: 3.2, leaveBalance: 8 },
  { id: 'EMP010', firstName: 'Liam', lastName: 'Foster', email: 'liam.foster@nexushr.com', phone: '+1 (555) 234-5010', department: 'Operations', designation: 'Director of Operations', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2018-09-01', salary: 148000, manager: 'Rajesh Gupta', avatar: null, location: 'Denver, CO', performanceRating: 4.3, leaveBalance: 19 },
  { id: 'EMP011', firstName: 'Sofia', lastName: 'Andersson', email: 'sofia.andersson@nexushr.com', phone: '+1 (555) 234-5011', department: 'Design', designation: 'Senior UX Designer', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2021-08-10', salary: 112000, manager: 'Nina Volkov', avatar: null, location: 'Seattle, WA', performanceRating: 4.7, leaveBalance: 14 },
  { id: 'EMP012', firstName: 'Nina', lastName: 'Volkov', email: 'nina.volkov@nexushr.com', phone: '+1 (555) 234-5012', department: 'Design', designation: 'Head of Design', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2019-02-18', salary: 145000, manager: 'Rajesh Gupta', avatar: null, location: 'Seattle, WA', performanceRating: 4.6, leaveBalance: 21 },
  { id: 'EMP013', firstName: 'Carlos', lastName: 'Rivera', email: 'carlos.rivera@nexushr.com', phone: '+1 (555) 234-5013', department: 'Sales', designation: 'Account Executive', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2022-10-01', salary: 78000, manager: 'Rachel Kim', avatar: null, location: 'Miami, FL', performanceRating: 4.0, leaveBalance: 10 },
  { id: 'EMP014', firstName: 'Rachel', lastName: 'Kim', email: 'rachel.kim@nexushr.com', phone: '+1 (555) 234-5014', department: 'Sales', designation: 'VP of Sales', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2018-01-15', salary: 170000, manager: 'Rajesh Gupta', avatar: null, location: 'Miami, FL', performanceRating: 4.8, leaveBalance: 23 },
  { id: 'EMP015', firstName: 'Tom', lastName: 'Mitchell', email: 'tom.mitchell@nexushr.com', phone: '+1 (555) 234-5015', department: 'Engineering', designation: 'DevOps Engineer', employmentType: EMPLOYMENT_TYPE.CONTRACT, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2024-01-08', salary: 105000, manager: 'Priya Sharma', avatar: null, location: 'Portland, OR', performanceRating: 3.9, leaveBalance: 6 },
  { id: 'EMP016', firstName: 'Olivia', lastName: 'Taylor', email: 'olivia.taylor@nexushr.com', phone: '+1 (555) 234-5016', department: 'Engineering', designation: 'Frontend Developer', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2023-04-03', salary: 98000, manager: 'Priya Sharma', avatar: null, location: 'San Francisco, CA', performanceRating: 4.1, leaveBalance: 13 },
  { id: 'EMP017', firstName: 'Rajesh', lastName: 'Gupta', email: 'rajesh.gupta@nexushr.com', phone: '+1 (555) 234-5017', department: 'Operations', designation: 'Chief Operating Officer', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2016-06-01', salary: 220000, manager: null, avatar: null, location: 'San Francisco, CA', performanceRating: 4.9, leaveBalance: 30 },
  { id: 'EMP018', firstName: 'Hannah', lastName: 'Lee', email: 'hannah.lee@nexushr.com', phone: '+1 (555) 234-5018', department: 'HR', designation: 'Talent Acquisition Specialist', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ON_LEAVE, dateOfJoining: '2022-07-18', salary: 82000, manager: 'Elena Rodriguez', avatar: null, location: 'New York, NY', performanceRating: 3.7, leaveBalance: 3 },
  { id: 'EMP019', firstName: 'Daniel', lastName: 'Murphy', email: 'daniel.murphy@nexushr.com', phone: '+1 (555) 234-5019', department: 'Finance', designation: 'Senior Accountant', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.TERMINATED, dateOfJoining: '2020-11-09', salary: 92000, manager: 'Sarah Johnson', avatar: null, location: 'Chicago, IL', performanceRating: 2.8, leaveBalance: 0 },
  { id: 'EMP020', firstName: 'Amara', lastName: 'Okafor', email: 'amara.okafor@nexushr.com', phone: '+1 (555) 234-5020', department: 'Engineering', designation: 'Backend Developer', employmentType: EMPLOYMENT_TYPE.FULL_TIME, status: EMPLOYEE_STATUS.ACTIVE, dateOfJoining: '2023-09-25', salary: 110000, manager: 'Priya Sharma', avatar: null, location: 'San Francisco, CA', performanceRating: 4.3, leaveBalance: 16 },
];

export const mockLeaveRequests = [
  { id: 'LR001', employeeId: 'EMP007', employeeName: 'Kenji Tanaka', type: 'Vacation', startDate: '2026-05-10', endDate: '2026-05-16', days: 5, reason: 'Family vacation to Japan', status: LEAVE_STATUS.APPROVED, appliedOn: '2026-04-20', approvedBy: 'Aisha Patel' },
  { id: 'LR002', employeeId: 'EMP018', employeeName: 'Hannah Lee', type: 'Medical', startDate: '2026-05-05', endDate: '2026-05-12', days: 6, reason: 'Post-surgery recovery', status: LEAVE_STATUS.APPROVED, appliedOn: '2026-04-28', approvedBy: 'Elena Rodriguez' },
  { id: 'LR003', employeeId: 'EMP001', employeeName: 'Arjun Mehta', type: 'Personal', startDate: '2026-05-20', endDate: '2026-05-21', days: 2, reason: 'Moving to new apartment', status: LEAVE_STATUS.PENDING, appliedOn: '2026-05-06', approvedBy: null },
  { id: 'LR004', employeeId: 'EMP011', employeeName: 'Sofia Andersson', type: 'Vacation', startDate: '2026-06-01', endDate: '2026-06-10', days: 8, reason: 'Summer holiday in Sweden', status: LEAVE_STATUS.PENDING, appliedOn: '2026-05-05', approvedBy: null },
  { id: 'LR005', employeeId: 'EMP013', employeeName: 'Carlos Rivera', type: 'Personal', startDate: '2026-05-15', endDate: '2026-05-15', days: 1, reason: 'Car inspection appointment', status: LEAVE_STATUS.REJECTED, appliedOn: '2026-05-01', approvedBy: 'Rachel Kim' },
  { id: 'LR006', employeeId: 'EMP016', employeeName: 'Olivia Taylor', type: 'Medical', startDate: '2026-05-08', endDate: '2026-05-09', days: 2, reason: 'Dental procedure', status: LEAVE_STATUS.APPROVED, appliedOn: '2026-05-02', approvedBy: 'Priya Sharma' },
  { id: 'LR007', employeeId: 'EMP005', employeeName: 'David Chen', type: 'Vacation', startDate: '2026-05-25', endDate: '2026-05-30', days: 4, reason: 'Wedding attendance in Boston', status: LEAVE_STATUS.PENDING, appliedOn: '2026-05-07', approvedBy: null },
  { id: 'LR008', employeeId: 'EMP003', employeeName: 'Marcus Williams', type: 'Personal', startDate: '2026-05-18', endDate: '2026-05-19', days: 2, reason: 'Volunteering event', status: LEAVE_STATUS.APPROVED, appliedOn: '2026-04-30', approvedBy: 'Elena Rodriguez' },
  { id: 'LR009', employeeId: 'EMP020', employeeName: 'Amara Okafor', type: 'Vacation', startDate: '2026-06-15', endDate: '2026-06-22', days: 6, reason: 'Visiting family in Nigeria', status: LEAVE_STATUS.PENDING, appliedOn: '2026-05-08', approvedBy: null },
  { id: 'LR010', employeeId: 'EMP009', employeeName: "James O'Brien", type: 'Medical', startDate: '2026-05-12', endDate: '2026-05-13', days: 2, reason: 'Annual health check-up', status: LEAVE_STATUS.REJECTED, appliedOn: '2026-05-03', approvedBy: 'Liam Foster' },
];

function generatePayrollForEmployee(emp) {
  const months = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
  const monthlySalary = Math.round(emp.salary / 12);
  return months.map((month, i) => ({
    id: `PAY-${emp.id}-${month}`, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, month,
    basicPay: monthlySalary, deductions: Math.round(monthlySalary * 0.22), bonus: i === 2 ? Math.round(monthlySalary * 0.1) : 0,
    netPay: monthlySalary - Math.round(monthlySalary * 0.22) + (i === 2 ? Math.round(monthlySalary * 0.1) : 0),
    status: month === '2026-05' ? 'Processing' : 'Paid', paidOn: month === '2026-05' ? null : `${month}-28`,
  }));
}
export const mockPayroll = mockEmployees.flatMap(generatePayrollForEmployee);

function generateAttendanceRecords() {
  const records = [];
  const statuses = ['Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Half-day', 'WFH'];
  const activeEmps = mockEmployees.filter(e => e.status === EMPLOYEE_STATUS.ACTIVE);
  for (let day = 1; day <= 30; day++) {
    const date = `2026-04-${String(day).padStart(2, '0')}`;
    const dow = new Date(date).getDay();
    if (dow === 0 || dow === 6) continue;
    activeEmps.forEach(emp => {
      const st = statuses[Math.floor(Math.random() * statuses.length)];
      const ci = st === 'Absent' ? null : `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`;
      const co = st === 'Absent' ? null : st === 'Half-day' ? `13:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : `17:${String(30 + Math.floor(Math.random() * 30)).padStart(2, '0')}`;
      records.push({ id: `ATT-${emp.id}-${date}`, employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}`, date, status: st, checkIn: ci, checkOut: co,
        hoursWorked: ci && co ? parseFloat(((parseInt(co.split(':')[0]) + parseInt(co.split(':')[1]) / 60) - (parseInt(ci.split(':')[0]) + parseInt(ci.split(':')[1]) / 60)).toFixed(1)) : 0 });
    });
  }
  return records;
}
export const mockAttendance = generateAttendanceRecords();

export const mockNotifications = [
  { id: 'N001', title: 'Leave Request Approved', message: 'Your vacation leave from May 10-16 has been approved by Aisha Patel.', type: 'success', read: false, createdAt: '2026-05-08T09:30:00Z', link: '/leaves' },
  { id: 'N002', title: 'New Employee Onboarded', message: 'Amara Okafor has joined the Engineering department as Backend Developer.', type: 'info', read: false, createdAt: '2026-05-07T14:15:00Z', link: '/employees/EMP020' },
  { id: 'N003', title: 'Payroll Processing', message: 'May 2026 payroll is currently being processed. Expected completion: May 28.', type: 'warning', read: false, createdAt: '2026-05-07T10:00:00Z', link: '/payroll' },
  { id: 'N004', title: 'Performance Review Due', message: 'Q2 performance reviews are due by May 31. Please submit evaluations.', type: 'warning', read: false, createdAt: '2026-05-06T16:45:00Z', link: '/performance' },
  { id: 'N005', title: 'Leave Request Rejected', message: "Carlos Rivera's personal leave on May 15 was rejected due to project deadline.", type: 'danger', read: true, createdAt: '2026-05-06T11:20:00Z', link: '/leaves' },
  { id: 'N006', title: 'System Maintenance', message: 'Scheduled maintenance on May 12, 2:00-4:00 AM EST. System may be unavailable.', type: 'info', read: true, createdAt: '2026-05-05T09:00:00Z', link: null },
  { id: 'N007', title: 'Attendance Alert', message: '3 employees had irregular attendance patterns last week. Review required.', type: 'warning', read: false, createdAt: '2026-05-05T08:30:00Z', link: '/attendance' },
  { id: 'N008', title: 'New Policy Published', message: 'Updated remote work policy has been published. All employees must acknowledge.', type: 'info', read: true, createdAt: '2026-05-04T15:00:00Z', link: null },
  { id: 'N009', title: 'Birthday Celebration', message: 'Happy Birthday to Sofia Andersson! Celebration at 3 PM in the break room.', type: 'info', read: true, createdAt: '2026-05-04T08:00:00Z', link: null },
  { id: 'N010', title: 'Expense Report Approved', message: 'Your travel expense report for $2,340 has been approved and queued for reimbursement.', type: 'success', read: false, createdAt: '2026-05-03T12:00:00Z', link: null },
  { id: 'N011', title: 'Training Session Available', message: 'New leadership training program is now open for enrollment. Limited spots available.', type: 'info', read: true, createdAt: '2026-05-02T10:30:00Z', link: null },
  { id: 'N012', title: 'Contract Renewal', message: "Tom Mitchell's contract is expiring on July 8. Renewal process should begin.", type: 'warning', read: false, createdAt: '2026-05-01T14:00:00Z', link: '/employees/EMP015' },
  { id: 'N013', title: 'Employee Terminated', message: "Daniel Murphy's employment has been terminated effective immediately.", type: 'danger', read: true, createdAt: '2026-04-30T16:00:00Z', link: '/employees/EMP019' },
  { id: 'N014', title: 'Quarterly Report Ready', message: 'Q1 2026 HR analytics report is now available for review.', type: 'success', read: true, createdAt: '2026-04-29T09:00:00Z', link: '/reports' },
  { id: 'N015', title: 'Team Meeting Scheduled', message: 'All-hands meeting scheduled for May 15 at 10:00 AM. Attendance is mandatory.', type: 'info', read: true, createdAt: '2026-04-28T11:00:00Z', link: null },
];

export const mockUsers = {
  'admin@nexushr.com': { id: 'USR001', email: 'admin@nexushr.com', firstName: 'Rajesh', lastName: 'Gupta', role: 'ADMIN', avatar: null, department: 'Operations', designation: 'Chief Operating Officer' },
  'hr@nexushr.com': { id: 'USR002', email: 'hr@nexushr.com', firstName: 'Elena', lastName: 'Rodriguez', role: 'HR', avatar: null, department: 'HR', designation: 'VP of People' },
  'employee@nexushr.com': { id: 'USR003', email: 'employee@nexushr.com', firstName: 'Arjun', lastName: 'Mehta', role: 'EMPLOYEE', avatar: null, department: 'Engineering', designation: 'Senior Software Engineer' },
};
