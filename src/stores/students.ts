import { create } from "zustand";
import { studentService } from "@/services/students";
import type { Student, ImportStudentsDto } from "@/services/students/typing";
import { toast } from "sonner";

// Mock data for development
const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    studentId: "SV001",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    classId: "class1",
    className: "Lớp 12A1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    studentId: "SV002",
    name: "Trần Thị Bình",
    email: "tranthibinh@example.com",
    classId: "class1",
    className: "Lớp 12A1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    studentId: "SV003",
    name: "Lê Văn Cường",
    email: "levancuong@example.com",
    classId: "class2",
    className: "Lớp 12A2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    studentId: "SV004",
    name: "Phạm Thị Dung",
    email: "phamthidung@example.com",
    classId: "class2",
    className: "Lớp 12A2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    studentId: "SV005",
    name: "Hoàng Văn Em",
    email: "hoangvanem@example.com",
    classId: "class1",
    className: "Lớp 12A1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    studentId: "SV006",
    name: "Đỗ Thị Phương",
    email: "dothiphuong@example.com",
    classId: "class3",
    className: "Lớp 12A3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    studentId: "SV007",
    name: "Vũ Văn Giang",
    email: "vuvangiang@example.com",
    classId: "class3",
    className: "Lớp 12A3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    studentId: "SV008",
    name: "Bùi Thị Hoa",
    email: "buithihoa@example.com",
    classId: "class1",
    className: "Lớp 12A1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface StudentStore {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  selectedClassId: string | null;
  
  fetchStudents: () => Promise<void>;
  fetchStudentsByClass: (classId: string) => Promise<void>;
  setSelectedClass: (classId: string | null) => void;
  importStudents: (classId: string, data: ImportStudentsDto) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: MOCK_STUDENTS, // Start with mock data
  isLoading: false,
  error: null,
  selectedClassId: null,

  setSelectedClass: (classId: string | null) => {
    set({ selectedClassId: classId });
    if (classId) {
      const filteredStudents = MOCK_STUDENTS.filter(s => s.classId === classId);
      set({ students: filteredStudents });
    } else {
      set({ students: MOCK_STUDENTS });
    }
  },

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const students = await studentService.getAll();
      if (students && students.length > 0) {
        set({ students, isLoading: false });
      } else {
        // Keep mock data if API returns empty
        set({ isLoading: false, students: MOCK_STUDENTS });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch students";
      console.error("Fetch students error:", error);
      console.log("Using mock data for students");
      // Keep mock data on error
      set({ error: message, isLoading: false });
    }
  },

  fetchStudentsByClass: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const students = await studentService.getByClassId(classId);
      if (students && students.length > 0) {
        set({ students, isLoading: false });
      } else {
        const filteredStudents = MOCK_STUDENTS.filter(s => s.classId === classId);
        set({ isLoading: false, students: filteredStudents });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch students";
      console.error("Fetch students by class error:", error);
      const filteredStudents = MOCK_STUDENTS.filter(s => s.classId === classId);
      set({ error: message, isLoading: false, students: filteredStudents });
    }
  },

  importStudents: async (classId: string, data: ImportStudentsDto) => {
    set({ isLoading: true, error: null });
    try {
      await studentService.importToClass(classId, data);
      await get().fetchStudentsByClass(classId);
      toast.success(`Import ${data.students.length} sinh viên thành công`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to import students";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },
}));
