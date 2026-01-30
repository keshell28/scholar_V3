import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Storage keys
const AUTH_STORAGE_KEY = 'scholar_auth';

// Load initial state from localStorage
const loadInitialState = () => {
  const stored = storage.get<{ user: User | null; token: string | null; isAuthenticated: boolean }>(
    AUTH_STORAGE_KEY,
    { user: null, token: null, isAuthenticated: false }
  );
  // Also try to get token from localStorage directly (backward compatibility)
  const token = stored.token || localStorage.getItem('token');
  return { ...stored, token };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = loadInitialState();

  return {
    user: initialState.user,
    token: initialState.token,
    isAuthenticated: initialState.isAuthenticated,
    login: (user, token) => {
      set({ user, token, isAuthenticated: true });
      storage.set(AUTH_STORAGE_KEY, { user, token, isAuthenticated: true });
      localStorage.setItem('token', token); // Also store in localStorage for backward compatibility
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      storage.set(AUTH_STORAGE_KEY, { user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
    },
    updateProfile: (updates) =>
      set((state) => {
        const updatedUser = state.user ? { ...state.user, ...updates } : null;
        storage.set(AUTH_STORAGE_KEY, { user: updatedUser, token: state.token, isAuthenticated: state.isAuthenticated });
        return { user: updatedUser };
      }),
  };
});
