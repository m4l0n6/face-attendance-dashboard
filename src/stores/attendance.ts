import { create } from "zustand";
import {
  getAttendanceList,
  recordAttendance,
  exportAttendanceData,
} from "@/services/attendance";
import type {
  AttendanceStats,
  StudentAttendance,
  AttendanceStatus,
} from "@/services/attendance/typing";

interface AttendanceStore {
  stats: AttendanceStats | null;
  attendanceList: StudentAttendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoadingStats: boolean;
  isLoadingList: boolean;
  error: string | null;

  // ✅ Tự động tính statistics từ attendanceList
  calculateStatistics: () => void;
  fetchAttendanceList: (
    token: string,
    sessionId: string,
    classId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  updateAttendanceStatus: (
    token: string,
    sessionId: string,
    studentId: string,
    status: AttendanceStatus
  ) => Promise<void>;
  exportData: (token: string, sessionId: string) => Promise<void>;
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  stats: null,
  attendanceList: [],
  pagination: null,
  isLoadingStats: false,
  isLoadingList: false,
  error: null,

  // ✅ Tính toán statistics từ attendanceList
  calculateStatistics: () => {
    const { attendanceList } = get();

    if (!attendanceList || attendanceList.length === 0) {
      set({ stats: null });
      return;
    }

    const stats: AttendanceStats = {
      total: attendanceList.length,
      present: attendanceList.filter((s) => s.status === "PRESENT").length,
      late: attendanceList.filter((s) => s.status === "LATE").length,
      excused: attendanceList.filter((s) => s.status === "EXCUSED").length,
      unexcused: attendanceList.filter((s) => s.status === "UNEXCUSED").length,
      none: attendanceList.filter((s) => s.status === "NONE").length,
    };

    set({ stats });
  },

  fetchAttendanceList: async (
    token: string,
    sessionId: string,
    classId: string,
    page = 1,
    limit = 20
  ) => {
    set({ isLoadingList: true, isLoadingStats: true, error: null });
    try {
      const response = await getAttendanceList(token, {
        sessionId,
        classId,
        page,
        limit,
      });

      set({
        attendanceList: response.data,
        pagination: response.pagination,
        isLoadingList: false,
        isLoadingStats: false,
      });

      // ✅ Tự động tính statistics sau khi load data
      get().calculateStatistics();
    } catch (error) {
      console.error("Error fetching attendance list:", error);
      set({
        error: "Không thể tải danh sách điểm danh",
        isLoadingList: false,
        isLoadingStats: false,
        attendanceList: [],
        stats: null,
      });
    }
  },

  updateAttendanceStatus: async (
    token: string,
    sessionId: string,
    studentId: string,
    status: AttendanceStatus
  ) => {
    try {
      // Optimistic update
      const { attendanceList } = get();
      const updatedList = attendanceList.map((student) =>
        student.studentId === studentId
          ? { ...student, status, recordedAt: new Date().toISOString() }
          : student
      );

      set({ attendanceList: updatedList });

      // ✅ Tự động tính lại statistics
      get().calculateStatistics();

      // Call API
      await recordAttendance(token, {
        sessionId,
        studentId,
        status,
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      set({ error: "Không thể cập nhật trạng thái điểm danh" });
      throw error;
    }
  },

  exportData: async (token: string, sessionId: string) => {
    try {
      const blob = await exportAttendanceData(token, sessionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${sessionId}-${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  },

  reset: () => {
    set({
      stats: null,
      attendanceList: [],
      pagination: null,
      isLoadingStats: false,
      isLoadingList: false,
      error: null,
    });
  },
}));
