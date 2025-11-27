export interface OverviewStatistics {
  totalClasses: number;
  totalStudents: number;
  totalLecturers: number;
  totalSessions: number;
  overallAttendanceRate: number;
  overallAbsentRate: number;
}

export interface DetailedStatistics {
  totalExpectedAttendances: number;
  totalActualAttendances: number;
  totalMissedAttendances: number;
}

export interface AdminOverviewResponse {
  overview: OverviewStatistics;
  details: DetailedStatistics;
}

// Class Statistics Types
export interface StudentAttendanceStats {
  studentId: string;
  name: string;
  email: string;
  totalSessions: number;
  attendedSessions: number;
  absentSessions: number;
  attendanceRate: number;
}

export interface ClassStatisticsResponse {
  classId: string;
  totalSessions: number;
  totalStudents: number;
  students: StudentAttendanceStats[];
}

// Session Statistics Types
export interface SessionInfo {
  id: string;
  name: string;
  date: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface SessionStatsSummary {
  totalStudents: number;
  attendedStudents: number;
  absentStudents: number;
  attendanceRate: number;
}

export interface AttendedStudent {
  studentId: string;
  name: string;
  method: string;
  matchedAt: string;
}

export interface AbsentStudent {
  studentId: string;
  name: string;
}

export interface SessionStatisticsResponse {
  session: SessionInfo;
  statistics: SessionStatsSummary;
  attended: AttendedStudent[];
  absent: AbsentStudent[];
}

// Weekly Statistics Types
export interface WeeklyStatsPeriod {
  startDate: string;
  endDate: string;
}

export interface WeeklyStat {
  weekStart: string;
  weekEnd: string;
  totalSessions: number;
  totalExpected: number;
  totalAttended: number;
  totalAbsent: number;
  attendanceRate: number;
  absentRate: number;
}

export interface WeeklyStatisticsResponse {
  period: WeeklyStatsPeriod;
  weeklyStats: WeeklyStat[];
}

export type WeeklyPeriod = "current-week" | "last-week";