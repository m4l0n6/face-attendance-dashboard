import { create } from "zustand";
import type {
  AttendanceStats,
  StudentAttendance,
  AttendanceStatus,
} from "@/services/attendance/typing";
import {
  getSessionStatistics,
  getAttendanceList,
  recordAttendance,
  exportAttendanceData,
} from "@/services/attendance";

interface AttendanceState {
  // Data
  stats: AttendanceStats | null;
  attendanceList: StudentAttendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  // Loading states
  isLoadingStats: boolean;
  isLoadingList: boolean;
  isRecording: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchStatistics: (token: string, scheduleSessionId: string) => Promise<void>;
  fetchAttendanceList: (
    token: string,
    sessionId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  updateAttendanceStatus: (
    token: string,
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    method?: string
  ) => Promise<void>;
  exportData: (token: string, sessionId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  stats: null,
  attendanceList: [],
  pagination: null,
  isLoadingStats: false,
  isLoadingList: false,
  isRecording: false,
  error: null,
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  ...initialState,

  fetchStatistics: async (token: string, scheduleSessionId: string) => {
    set({ isLoadingStats: true, error: null });
    try {
      const stats = await getSessionStatistics(token, scheduleSessionId);
      set({ stats, isLoadingStats: false });
    } catch {
      set({
        error: "Không thể tải thống kê điểm danh",
        isLoadingStats: false,
      });
    }
  },

  fetchAttendanceList: async (
    token: string,
    sessionId: string,
    page = 1,
    limit = 20
  ) => {
    set({ isLoadingList: true, error: null });
    try {
      console.log("📋 Fetching attendance list:", { sessionId, page, limit });
      const response = await getAttendanceList(token, {
        sessionId,
        page,
        limit,
      });
      console.log("✅ Attendance response:", response);

      // ⚠️ Đảm bảo response có cấu trúc đúng
      set({
        attendanceList: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        isLoadingList: false,
      });
    } catch (error) {
      console.error("❌ Error fetching attendance list:", error);
      set({
        error: "Không thể tải danh sách điểm danh",
        isLoadingList: false,
        attendanceList: [],
      });
    }
  },

  updateAttendanceStatus: async (
    token: string,
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    method = "MANUAL"
  ) => {
    const { stats, attendanceList } = get();

    // Optimistic update - Update UI immediately
    const oldStudent = attendanceList.find((s) => s.studentId === studentId);
    if (!oldStudent) return;

    const oldStatus = oldStudent.status;

    // Update student in list
    const updatedList = attendanceList.map((student) =>
      student.studentId === studentId
        ? {
            ...student,
            status,
            recordedAt: new Date().toISOString(),
            method,
          }
        : student
    );

    // Update statistics
    const updatedStats = { ...stats } as AttendanceStats;
    if (stats) {
      // Decrease old status count
      if (oldStatus === "PRESENT") updatedStats.present--;
      else if (oldStatus === "LATE") updatedStats.late--;
      else if (oldStatus === "EXCUSED") updatedStats.excused--;
      else if (oldStatus === "UNEXCUSED") updatedStats.unexcused--;
      else if (oldStatus === "NONE") updatedStats.none--;

      // Increase new status count
      if (status === "PRESENT") updatedStats.present++;
      else if (status === "LATE") updatedStats.late++;
      else if (status === "EXCUSED") updatedStats.excused++;
      else if (status === "UNEXCUSED") updatedStats.unexcused++;
      else if (status === "NONE") updatedStats.none++;
    }

    set({
      attendanceList: updatedList,
      stats: updatedStats,
      isRecording: true,
    });

    // Send API request in background
    try {
      await recordAttendance(token, {
        sessionId,
        studentId,
        status,
        method,
      });
      set({ isRecording: false });
    } catch {
      // Rollback on error
      set({
        attendanceList,
        stats,
        error: "Không thể cập nhật trạng thái điểm danh",
        isRecording: false,
      });
    }
  },

  exportData: async (token: string, sessionId: string) => {
    try {
      const blob = await exportAttendanceData(token, sessionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${sessionId}_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      set({ error: "Không thể xuất dữ liệu điểm danh" });
    }
  },

  reset: () => set(initialState),
}));
