import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type {
  AttendanceStats,
  GetAttendanceListParams,
  GetAttendanceListResponse,
  RecordAttendanceRequest,
  RecordAttendanceResponse,
} from "./typing";

// ✅ Statistics API - Đúng rồi
export async function getSessionStatistics(
  token: string,
  scheduleSessionId: string
): Promise<AttendanceStats> {
  console.log("📊 Fetching statistics for session:", scheduleSessionId);
  return axios
    .get(`${APP_CONFIG_API_URL}/statistics/session/${scheduleSessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("✅ Statistics response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("❌ Statistics error:", error);
      throw error;
    });
}

// ✅ Attendance List API - SỬA LẠI
export async function getAttendanceList(
  token: string,
  params: GetAttendanceListParams
): Promise<GetAttendanceListResponse> {
  console.log("📋 Fetching attendance list for session:", params.sessionId);

  // ⚠️ Theo Swagger: GET /attendance/{sessionId}
  return axios
    .get(`${APP_CONFIG_API_URL}/attendance/${params.sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Không cần params vì sessionId đã ở URL
    })
    .then((response) => {
      console.log("✅ Attendance list response:", response.data);

      // ⚠️ API có thể trả về trực tiếp array hoặc object {data, pagination}
      // Cần check response structure
      if (Array.isArray(response.data)) {
        // Nếu trả về array trực tiếp
        return {
          data: response.data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: response.data.length,
            totalPages: 1,
          },
        };
      }

      // Nếu trả về object {data, pagination}
      return response.data;
    })
    .catch((error) => {
      console.error("❌ Attendance list error:", error.response?.data || error);
      throw error;
    });
}

// ✅ Record Attendance API
export async function recordAttendance(
  token: string,
  data: RecordAttendanceRequest
): Promise<RecordAttendanceResponse> {
  return axios
    .post(`${APP_CONFIG_API_URL}/attendance/record`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

// ✅ Export API - Có thể chưa có endpoint này
export async function exportAttendanceData(
  token: string,
  sessionId: string
): Promise<Blob> {
  return axios
    .get(`${APP_CONFIG_API_URL}/attendance/${sessionId}/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("❌ Export error:", error);
      throw new Error("Chức năng xuất dữ liệu chưa được hỗ trợ");
    });
}
