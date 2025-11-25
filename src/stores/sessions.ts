import { create } from "zustand";
import { startSession, endSession, updateScheduleSession } from "@/services/sessions/index";
import { useAuthStore } from "./auth";
import { toast } from "sonner";
import type { StartSessionRequest, Session } from "@/services/sessions/typing";

interface SessionState {
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  startNewSession: (data: StartSessionRequest) => Promise<void>;
  endCurrentSession: (sessionId: string) => Promise<void>;
  cancelSession: (sessionId: string, note?: string) => Promise<void>;
  clearError: () => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  currentSession: null,
  isLoading: false,
  error: null,

  startNewSession: async (data: StartSessionRequest) => {
    try {
      set({ isLoading: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await startSession(token, data);
      set({ currentSession: response.session, isLoading: false });
      toast.success("Đã bắt đầu buổi học thành công");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start session";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  endCurrentSession: async (sessionId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await endSession(token, sessionId);
      set({ currentSession: null, isLoading: false });
      toast.success("Đã kết thúc buổi học thành công");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to end session";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  cancelSession: async (sessionId: string, note: string = "Nghỉ học") => {
    try {
      set({ isLoading: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await updateScheduleSession(token, sessionId, {
        status: "CANCELLED",
        note,
      });
      set({ isLoading: false });
      toast.success("Đã hủy buổi học thành công");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel session";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearSession: () => set({ currentSession: null }),
}));
