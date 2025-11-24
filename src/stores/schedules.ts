import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSchedulesByClass, createSchedule, deleteSchedule } from "../services/api";
import { useAuthStore } from "./auth";
import { toast } from "sonner";
import type { Schedule, CreateScheduleRequest } from "@/services/schedules/typing";

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: (classId: string) => Promise<void>;
  addSchedule: (data: CreateScheduleRequest) => Promise<void>;
  removeSchedule: (id: string) => Promise<void>;
  clearError: () => void;
  clearSchedules: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      isLoading: false,
      error: null,

      fetchSchedules: async (classId: string) => {
        try {
          set({ isLoading: true, error: null });

          const token = useAuthStore.getState().token;
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await getSchedulesByClass(token, classId);
          set({ schedules: response, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch schedules";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      addSchedule: async (data: CreateScheduleRequest) => {
        try {
          set({ isLoading: true, error: null });

          const token = useAuthStore.getState().token;
          if (!token) {
            throw new Error("No authentication token found");
          }

          await createSchedule(token, data);
          await get().fetchSchedules(data.classId);
          toast.success("Tạo lịch học thành công");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create schedule";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      removeSchedule: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const token = useAuthStore.getState().token;
          if (!token) {
            throw new Error("No authentication token found");
          }

          await deleteSchedule(token, id);
          
          // Remove from local state
          set((state) => ({
            schedules: state.schedules.filter((s) => s.id !== id),
            isLoading: false,
          }));
          
          toast.success("Xóa lịch học thành công");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete schedule";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      clearSchedules: () => set({ schedules: [] }),
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({ schedules: state.schedules }),
    }
  )
);
