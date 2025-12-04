import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type {
  GetAttendanceListParams,
  GetAttendanceListResponse,
  RecordAttendanceRequest,
  RecordAttendanceResponse,
  StudentAttendance,
} from "./typing";

// ✅ Thêm interfaces cho backend responses
interface BackendStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  faceImage?: {
    id: string;
    imageUrl: string;
    faceDescriptor: string;
  };
}

interface BackendAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  method: string;
  matchedAt: string;
  status?: string;
}

// ❌ XÓA hàm getSessionStatistics - Không cần nữa

export async function getAttendanceList(
  token: string,
  params: GetAttendanceListParams
): Promise<GetAttendanceListResponse> {
  const { sessionId, classId, page = 1, limit = 20 } = params;

  try {
    // 1. Lấy danh sách sinh viên trong lớp
    const studentsResponse = await axios.get<{ data: BackendStudent[] }>(
      `${APP_CONFIG_API_URL}/students/class/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 2. Lấy danh sách attendance records của session
    const attendanceResponse = await axios.get<BackendAttendanceRecord[]>(
      `${APP_CONFIG_API_URL}/attendance/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const students = studentsResponse.data.data || [];
    const attendanceRecords = attendanceResponse.data || [];

    // 3. Map student với attendance status
    const data: StudentAttendance[] = students.map((student) => {
      const attendanceRecord = attendanceRecords.find(
        (record) => record.studentId === student.studentId
      );

      return {
        id: attendanceRecord?.id || student.id,
        studentId: student.studentId,
        name: student.name,
        status:
          (attendanceRecord?.status as StudentAttendance["status"]) || "NONE",
        recordedAt: attendanceRecord?.matchedAt || null,
        method: attendanceRecord?.method || "MANUAL",
      };
    });

    // 4. Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching attendance list:", error);
    throw error;
  }
}

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
    .then((response) => response.data);
}
