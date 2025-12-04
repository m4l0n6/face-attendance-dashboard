export enum AttendanceStatus {
  PRESENT = "PRESENT", // Có mặt
  LATE = "LATE", // Muộn/Về sớm
  EXCUSED = "EXCUSED", // Vắng có phép
  UNEXCUSED = "UNEXCUSED", // Vắng không phép
  NONE = "NONE", // Chưa điểm danh
}

export interface AttendanceStats {
  total: number; // Tổng sĩ số
  present: number; // Có mặt
  late: number; // Muộn/Về sớm
  excused: number; // Vắng có phép
  unexcused: number; // Vắng không phép
  none: number; // Chưa điểm danh
}

export interface StudentAttendance {
  id: string; // Attendance record ID
  studentId: string; // Mã sinh viên
  name: string; // Họ tên
  status: AttendanceStatus; // Trạng thái
  recordedAt?: string; // Thời gian điểm danh
  method?: string; // Phương thức (QR, Manual, Face)
  note?: string; // Ghi chú
}

export interface GetAttendanceListParams {
  sessionId: string;
  page?: number;
  limit?: number;
}

export interface GetAttendanceListResponse {
  data: StudentAttendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecordAttendanceRequest {
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  method?: string;
  note?: string;
}

export interface RecordAttendanceResponse {
  message: string;
  attendance: StudentAttendance;
}

export interface Schedule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  room: string;
  description: string;
  classId: string;
  sessions?: ScheduleSession[]; // Thêm dòng này
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleWithSessions {
  schedule: Schedule & {
    class?: {
      id: string;
      name: string;
      code: string;
    };
  };
  sessions: ScheduleSession[];
}

export interface ScheduleSession {
  id: string;
  sessionName: string;
  sessionDate: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  note?: string;
  sessions: Array<{
    id: string;
    startAt: string;
    endAt: string;
  }>;
}
