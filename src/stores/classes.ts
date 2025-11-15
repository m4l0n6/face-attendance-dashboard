import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllClasses } from "../services/api";
import { useAuthStore } from "./auth";

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
    clearError: () => void;
}

export const useClassStore = create<ClassState>()(
    persist(
        (set) => ({
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
                }
            },
            
            clearError: () => set({ error: null }),
        }),
        {
            name: "class-storage",
            partialize: (state) => ({ classes: state.classes }),
        }
    )
)

