import { create } from 'zustand';
import { Community, Post } from '../types';

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  joinedCommunities: string[];
  addCommunity: (community: Community) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  setCurrentCommunity: (community: Community | null) => void;
  addPost: (communityId: string, post: Post) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  communities: [],
  currentCommunity: null,
  joinedCommunities: [],
  addCommunity: (community) =>
    set((state) => ({ communities: [...state.communities, community] })),
  joinCommunity: (communityId) =>
    set((state) => ({
      joinedCommunities: [...state.joinedCommunities, communityId],
    })),
  leaveCommunity: (communityId) =>
    set((state) => ({
      joinedCommunities: state.joinedCommunities.filter((id) => id !== communityId),
    })),
  setCurrentCommunity: (community) => set({ currentCommunity: community }),
  addPost: (communityId, post) =>
    set((state) => ({
      communities: state.communities.map((c) =>
        c.id === communityId ? { ...c, posts: [post, ...c.posts] } : c
      ),
    })),
}));
