import { api } from '../../lib/api';

export type UserData = {
  name: string
  email: string
}

export const authService = {
  register: async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
      return { success: true };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registrasi gagal");
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user } = res.data;
      localStorage.setItem('auth-token', access_token);
      localStorage.setItem('current_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Email atau password salah");
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current_user');
  },

  getUser: (): UserData | null => {
    try {
      const userStr = localStorage.getItem('current_user');
      if (!userStr || userStr === 'undefined') return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  updateProfile: async (name: string) => {
    try {
      const res = await api.patch('/users/profile', { name });
      const user = authService.getUser();
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('user-updated'));
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal update profil");
    }
  },

  updatePassword: async (current: string, newPass: string) => {
    try {
      await api.post('/users/password', { currentPassword: current, newPassword: newPass });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal update password");
    }
  }
}
