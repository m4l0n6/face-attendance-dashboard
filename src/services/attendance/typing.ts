// ✅ Đổi từ enum sang type union
export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "EXCUSED"
  | "UNEXCUSED"
  | "NONE";

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  excused: number;
  unexcused: number;
  none: number;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  name: string;
  status: AttendanceStatus;
  method: string;
  recordedAt: string | null;
}

export interface GetAttendanceListParams {
  sessionId: string;
  classId: string; // ✅ THÊM classId
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
