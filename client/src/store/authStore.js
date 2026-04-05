import { create } from 'zustand';
import { authAPI } from '../api/endpoints';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token, isAuthenticated: true });
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('accessToken', data.accessToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('accessToken', data.accessToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // silent
    }
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = get().accessToken;
      if (!token) return;
      const { data } = await authAPI.getMe();
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      // Try refresh
      try {
        const { data } = await authAPI.refresh();
        localStorage.setItem('accessToken', data.accessToken);
        set({ accessToken: data.accessToken });
        const { data: userData } = await authAPI.getMe();
        set({ user: userData.user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    }
  },

  setUser: (user) => set({ user }),
}));
