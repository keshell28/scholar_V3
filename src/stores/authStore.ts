import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Default mock user for demo purposes
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@gg.com',
  university: 'University of Zimbabwe',
  fieldOfStudy: 'Computer Science',
  country: 'Zimbabwe',
  city: 'Harare',
  bio: 'Zimbabwean student abroad',
  profileImage: 'https://i.pravatar.cc/150?u=demo',
  connectionType: 'friendship',
  interests: ['Technology', 'Culture', 'Music'],
  yearsOfStudy: 2,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
