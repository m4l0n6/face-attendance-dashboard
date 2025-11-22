import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllClasses, createClass, updateClass, deleteClass } from "../services/api";
import { useAuthStore } from "./auth";
import { toast } from "sonner";


interface Class {
    id: string;
    name: string;
    code: string;
    description: string;
    lecturerId: string;
    _count: ClassCount;
    createdAt: string;
}

type ClassCount = {
    students: number;
    sessions: number;
}

interface ClassState {
    classes: Class[];
    isLoading: boolean;
    error: string | null;
    fetchClasses: () => Promise<void>;
    addClass: (data: { name: string; code: string; description: string }) => Promise<void>;
    editClass: (id: string, data: { name: string; code: string; description: string }) => Promise<void>;
    removeClass: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useClassStore = create<ClassState>()(
    persist(
        (set, get) => ({
            classes: [],
            isLoading: false,
            error: null,
            
            fetchClasses: async () => {
                try {
                    set({ isLoading: true, error: null });
                    
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    
                    const response = await getAllClasses(token);
                    set({ classes: response, isLoading: false });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch classes";
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                }
            },
            
            addClass: async (data) => {
                try {
                    set({ isLoading: true, error: null });
                    
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    
                    await createClass(token, data);
                    await get().fetchClasses();
                    toast.success("Tạo lớp học thành công");
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to create class";
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                    throw error;
                }
            },
            
            editClass: async (id, data) => {
                try {
                    set({ isLoading: true, error: null });
                    
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    
                    await updateClass(token, id, data);
                    await get().fetchClasses();
                    toast.success("Cập nhật lớp học thành công");
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to update class";
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                    throw error;
                }
            },
            
            removeClass: async (id) => {
                try {
                    set({ isLoading: true, error: null });
                    
                    const token = useAuthStore.getState().token;
                    if (!token) {
                        throw new Error("No authentication token found");
                    }
                    
                    await deleteClass(token, id);
                    await get().fetchClasses();
                    toast.success("Xóa lớp học thành công");
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Failed to delete class";
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                    throw error;
                }
            },
            
            clearError: () => set({ error: null }),
        }),
        {
            name: "class-storage",
            partialize: (state) => ({ classes: state.classes }),
        }
    )
);