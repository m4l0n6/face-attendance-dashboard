import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, getMe } from '@/services/user/index';
import { toast } from "sonner";
import type { User } from '@/services/user/typing';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    isLoading: boolean;
    expectedRole: 'student' | 'lecturer';
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    validateStoredToken: () => Promise<void>;
    isRoleValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            expectedRole: 'lecturer',
            login: async (email: string, password: string): Promise<boolean> => {
                set({ isLoading: true });
                try {
                    const response = await login(email, password);
                    const isValidRole = response.user.role === get().expectedRole;
                    
                    if (!isValidRole) {
                        set({ isLoading: false });
                        toast.error(
                          `Web này chỉ dành cho ${get().expectedRole}`
                        );
                        return false;
                    }
                    
                    set({
                        isAuthenticated: true,
                        token: response.token,
                        user: response.user,
                        isLoading: false,
                    });
                    localStorage.setItem('auth_token', response.token);
                    toast.success('Đăng nhập thành công!');
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
                    toast.error(errorMessage);
                    return false;
                }
            },
            logout: () => {
                localStorage.removeItem('auth_token');
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null 
                });
                toast.success('Đăng xuất thành công!');
            },
            isRoleValid: () => {
                const { user, expectedRole } = get();
                return user?.role === expectedRole;
            },
            validateStoredToken: async () => {
                const token = get().token || localStorage.getItem('auth_token');
                if (!token) {
                    set({ isAuthenticated: false, token: null, user: null });
                    return;
                }

                set({ isLoading: true });
                try {
                    const user = await getMe(token);
                    const isValidRole = user.role === get().expectedRole;
                    
                    if (!isValidRole) {
                        localStorage.removeItem('auth_token');
                        set({ isAuthenticated: false, token: null, user: null, isLoading: false });
                        toast.error(
                          `Lỗi role, web này chỉ dành cho ${get().expectedRole}`
                        );
                        return;
                    }
                    
                    set({
                        isAuthenticated: true,
                        token,
                        user,
                        isLoading: false,
                    });
                } catch {
                    toast.error('Lỗi xác thực. Vui lòng đăng nhập lại.');
                    localStorage.removeItem('auth_token');
                    set({ 
                        isAuthenticated: false, 
                        token: null, 
                        user: null,
                        isLoading: false 
                    });
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);