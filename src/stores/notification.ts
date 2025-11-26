import { create } from "zustand";
import { getNotifications } from "@/services/notification";
import type { Notification } from "@/services/notification/typing";
import { toast } from "sonner";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: (token: string, unreadOnly?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (token: string, unreadOnly: boolean = false) => {
    if (!token) {
      set({ error: "No token provided" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await getNotifications(token, unreadOnly);
      const notifications = data.notifications || [];
      const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
      
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch notifications";
      set({ error: message, isLoading: false });
      toast.error("Không thể tải thông báo");
    }
  },

  clearError: () => set({ error: null }),
}));
