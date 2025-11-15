export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  classId: string;
  className: string;
  status: 'active' | 'inactive' | 'suspended';
  enrolledAt: string;
  lastAttendance?: string;
  attendanceRate: number; // percentage
}