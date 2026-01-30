import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DiscoveryFilters {
  country?: string;
  connectionType?: string;
  fieldOfStudy?: string;
}

interface Match {
  connectionId: string;
  matchedAt: Date;
  user: User;
}

interface SwipeResult {
  success: boolean;
  action: 'like' | 'pass';
  isMatch: boolean;
  conversation?: {
    id: string;
    participant: {
      id: string;
      name: string;
      profileImage: string;
      university: string;
    };
  };
}

interface DiscoveryState {
  users: User[];
  currentIndex: number;
  filters: DiscoveryFilters;
  matches: Match[];
  isLoading: boolean;
  
  // Actions
  fetchDiscoveryFeed: (filters?: DiscoveryFilters) => Promise<void>;
  swipe: (targetUserId: string, action: 'like' | 'pass') => Promise<SwipeResult | null>;
  fetchMatches: () => Promise<void>;
  setFilters: (filters: DiscoveryFilters) => void;
  nextUser: () => void;
  resetIndex: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  users: [],
  currentIndex: 0,
  filters: {},
  matches: [],
  isLoading: false,

  // ============================================================================
  // FETCH DISCOVERY FEED
  // ============================================================================
  fetchDiscoveryFeed: async (filters?: DiscoveryFilters) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        return;
      }
      
      console.log('🔍 Fetching discovery feed...');
      
      const params = new URLSearchParams();
      if (filters?.country && filters.country !== 'all') {
        params.append('country', filters.country);
      }
      if (filters?.connectionType && filters.connectionType !== 'all') {
        params.append('connectionType', filters.connectionType);
      }
      if (filters?.fieldOfStudy && filters.fieldOfStudy !== 'all') {
        params.append('fieldOfStudy', filters.fieldOfStudy);
      }
      
      const response = await api.get(
        `${API_URL}/api/discovery/feed?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const users = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || 'https://i.pravatar.cc/150',
        university: user.university,
        fieldOfStudy: user.fieldOfStudy,
        country: user.country,
        city: user.city,
        bio: user.bio,
        connectionType: user.connectionType,
        interests: user.interests || [],
        yearsOfStudy: user.yearsOfStudy,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        matchScore: user.matchScore || 0
      }));
      
      set({ users, currentIndex: 0, isLoading: false });
      console.log(`✅ Fetched ${users.length} users (sorted by match score)`);
      if (users.length > 0) {
        console.log(`🎯 Top match score: ${users[0].matchScore}%`);
      }
    } catch (error) {
      console.error('❌ Error fetching discovery feed:', error);
      set({ isLoading: false });
    }
  },

  // ============================================================================
  // SWIPE ACTION
  // ============================================================================
  swipe: async (targetUserId: string, action: 'like' | 'pass') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      console.log(`👉 Swiping ${action} on user ${targetUserId}`);
      
      const response = await api.post(
        `${API_URL}/api/discovery/swipe`,
        { targetUserId, action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const result: SwipeResult = response.data;
      
      if (result.isMatch) {
        console.log('🎉 It\'s a match!');
        // Refresh matches
        get().fetchMatches();
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error swiping:', error);
      return null;
    }
  },

  // ============================================================================
  // FETCH MATCHES
  // ============================================================================
  fetchMatches: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      console.log('💚 Fetching matches...');
      
      const response = await api.get(
        `${API_URL}/api/discovery/matches`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const matches = response.data.map((match: any) => ({
        connectionId: match.connectionId,
        matchedAt: new Date(match.matchedAt),
        user: {
          ...match.user,
          profileImage: match.user.profileImage || 'https://i.pravatar.cc/150'
        }
      }));
      
      set({ matches });
      console.log(`✅ Fetched ${matches.length} matches`);
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
    }
  },

  // ============================================================================
  // SET FILTERS
  // ============================================================================
  setFilters: (filters: DiscoveryFilters) => {
    set({ filters });
    get().fetchDiscoveryFeed(filters);
  },

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  nextUser: () => {
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.users.length - 1)
    }));
  },

  resetIndex: () => {
    set({ currentIndex: 0 });
  },
}));
