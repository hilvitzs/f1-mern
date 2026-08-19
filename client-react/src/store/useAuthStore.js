import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),

  login: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    set({ token: data.token });
  },

  signup: async (email, password) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
}));
