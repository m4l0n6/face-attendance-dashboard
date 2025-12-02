import { create } from "zustand";
import { toast } from "sonner";
import {
  getAllAllowedIPs,
  createAllowedIP,
  updateAllowedIP,
  deleteAllowedIP,
  toggleAllowedIP,
  bulkCreateAllowedIPs,
  getIPConfig,
  updateIPConfig,
  toggleIPCheck,
  getCurrentIP,
} from "@/services/ip-config";
import { useAuthStore } from "./auth";
import type {
  AllowedIP,
  IPConfig,
  CreateAllowedIPDto,
  UpdateAllowedIPDto,
  CurrentIPResponse,
} from "@/services/ip-config/typing";

interface IPConfigState {
  // Allowed IPs State
  allowedIPs: AllowedIP[];
  isLoadingIPs: boolean;
  
  // IP Config State
  config: IPConfig | null;
  isLoadingConfig: boolean;
  
  // Current IP State
  currentIP: CurrentIPResponse | null;
  
  // Error State
  error: string | null;
  
  // Allowed IPs Actions
  fetchAllowedIPs: () => Promise<void>;
  addAllowedIP: (data: CreateAllowedIPDto) => Promise<void>;
  editAllowedIP: (id: string, data: UpdateAllowedIPDto) => Promise<void>;
  removeAllowedIP: (id: string) => Promise<void>;
  toggleAllowedIPStatus: (id: string) => Promise<void>;
  bulkAddAllowedIPs: (ips: CreateAllowedIPDto[]) => Promise<void>;
  
  // IP Config Actions
  fetchIPConfig: () => Promise<void>;
  editIPConfig: (data: { enabled?: boolean; errorMessage?: string }) => Promise<void>;
  toggleIPCheckStatus: () => Promise<void>;
  
  // Current IP Actions
  fetchCurrentIP: () => Promise<void>;
  
  // Utility Actions
  clearError: () => void;
}

export const useIPConfigStore = create<IPConfigState>()((set, get) => ({
  // Initial State
  allowedIPs: [],
  isLoadingIPs: false,
  config: null,
  isLoadingConfig: false,
  currentIP: null,
  error: null,

  // Allowed IPs Actions
  fetchAllowedIPs: async () => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getAllAllowedIPs(token);
      set({ allowedIPs: response, isLoadingIPs: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch allowed IPs";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
    }
  },

  addAllowedIP: async (data) => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await createAllowedIP(token, data);
      await get().fetchAllowedIPs();
      toast.success("Thêm IP thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create allowed IP";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  editAllowedIP: async (id, data) => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await updateAllowedIP(token, id, data);
      await get().fetchAllowedIPs();
      toast.success("Cập nhật IP thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update allowed IP";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  removeAllowedIP: async (id) => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await deleteAllowedIP(token, id);
      await get().fetchAllowedIPs();
      toast.success("Xóa IP thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete allowed IP";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  toggleAllowedIPStatus: async (id) => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      await toggleAllowedIP(token, id);
      await get().fetchAllowedIPs();
      toast.success("Đã thay đổi trạng thái IP");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to toggle allowed IP";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  bulkAddAllowedIPs: async (ips) => {
    try {
      set({ isLoadingIPs: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const result = await bulkCreateAllowedIPs(token, { ips });
      await get().fetchAllowedIPs();
      
      if (result.created.length > 0) {
        toast.success(`Đã thêm ${result.created.length} IP thành công`);
      }
      if (result.skipped.length > 0) {
        toast.warning(`${result.skipped.length} IP đã bị bỏ qua (đã tồn tại)`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to bulk create allowed IPs";
      set({ error: errorMessage, isLoadingIPs: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // IP Config Actions
  fetchIPConfig: async () => {
    try {
      set({ isLoadingConfig: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getIPConfig(token);
      set({ config: response, isLoadingConfig: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch IP config";
      set({ error: errorMessage, isLoadingConfig: false });
      toast.error(errorMessage);
    }
  },

  editIPConfig: async (data) => {
    try {
      set({ isLoadingConfig: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await updateIPConfig(token, data);
      set({ config: response, isLoadingConfig: false });
      toast.success("Cập nhật cấu hình thành công");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update IP config";
      set({ error: errorMessage, isLoadingConfig: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  toggleIPCheckStatus: async () => {
    try {
      set({ isLoadingConfig: true, error: null });

      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await toggleIPCheck(token);
      set({ config: response, isLoadingConfig: false });
      toast.success(
        response.enabled
          ? "Đã bật kiểm tra IP"
          : "Đã tắt kiểm tra IP"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to toggle IP check";
      set({ error: errorMessage, isLoadingConfig: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Current IP Actions
  fetchCurrentIP: async () => {
    try {
      const response = await getCurrentIP();
      set({ currentIP: response });
    } catch (error) {
      console.error("Failed to fetch current IP:", error);
    }
  },

  // Utility Actions
  clearError: () => set({ error: null }),
}));
