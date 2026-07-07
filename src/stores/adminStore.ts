import { create } from 'zustand';
import { api } from '@/services/api';

interface AdminState {
  token: string | null;
  admin: {
    id: number;
    username: string;
    name: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: localStorage.getItem('admin_token'),
  admin: null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.login(username, password);
      localStorage.setItem('admin_token', response.token);
      set({
        token: response.token,
        admin: response.admin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({
      token: null,
      admin: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const admin = await api.getMe();
      set({ admin, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('admin_token');
      set({ token: null, admin: null, isAuthenticated: false });
    }
  },
}));
