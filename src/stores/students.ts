import { create } from "zustand";
import { getAllStudents, getStudentByClassID } from "@/services/students";
import type { Student, PaginationMeta, GetStudentsParams } from "@/services/students/typing";
import { toast } from "sonner";
import { useAuthStore } from "./auth";

interface StudentStore {
  students: Student[];
  studentsByClassId: Student[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  selectedClassId: string | null;

  fetchStudents: (params?: GetStudentsParams) => Promise<void>;
  fetchStudentsByClassId: (classId: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedClass: (classId: string | null) => void;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  studentsByClassId: [],
  pagination: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  searchQuery: "",
  selectedClassId: null,

  fetchStudents: async (params?: GetStudentsParams) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const state = get();
      const response = await getAllStudents(token, {
        page: params?.page || state.currentPage,
        limit: params?.limit || state.pageSize,
        search: params?.search !== undefined ? params.search : state.searchQuery,
        classId: params?.classId !== undefined ? params.classId : state.selectedClassId || undefined,
      });

      set({ 
        students: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch students";
      console.error("Fetch students error:", error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchStudentsByClassId: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await getStudentByClassID(token, classId);
      set({ 
        studentsByClassId: response.data,
        isLoading: false 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch students by class ID";
      console.error("Fetch students by class ID error:", error);
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchStudents({ page });
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchStudents({ limit: size, page: 1 });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchStudents({ search: query, page: 1 });
  },

  setSelectedClass: (classId: string | null) => {
    set({ selectedClassId: classId, currentPage: 1 });
    get().fetchStudents({ classId: classId || undefined, page: 1 });
  },

}));
