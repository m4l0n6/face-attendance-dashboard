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
