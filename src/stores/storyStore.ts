import { create } from 'zustand';
import { Story } from '../types';

interface StoryStore {
  stories: Story[];
  addStory: (story: Story) => void;
  viewStory: (storyId: string, userId: string) => void;
  deleteStory: (storyId: string) => void;
  getActiveStories: () => Story[];
}

// Mock stories
const mockStories: Story[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Tendai Moyo',
    userImage: 'https://i.pravatar.cc/150?img=12',
    content: 'First day of lectures! Excited for this semester 🎓',
    backgroundColor: '#00843D',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    views: ['2', '3', '4'],
  },
  {
    id: '2',
    userId: '2',
    userName: 'Chipo Ndlovu',
    userImage: 'https://i.pravatar.cc/150?img=45',
    content: '',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000),
    views: ['1', '3'],
  },
  {
    id: '3',
    userId: '3',
    userName: 'Runako Sibanda',
    userImage: 'https://i.pravatar.cc/150?img=33',
    content: 'Study session at the library! Join us 📚',
    backgroundColor: '#FFD100',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
    views: ['1', '2', '4', '5'],
  },
];

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: mockStories,

  addStory: (story) =>
    set((state) => ({
      stories: [story, ...state.stories],
    })),

  viewStory: (storyId, userId) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === storyId
          ? {
              ...story,
              views: story.views.includes(userId)
                ? story.views
                : [...story.views, userId],
            }
          : story
      ),
    })),

  deleteStory: (storyId) =>
    set((state) => ({
      stories: state.stories.filter((story) => story.id !== storyId),
    })),

  getActiveStories: () => {
    const now = new Date();
    return get().stories.filter((story) => story.expiresAt > now);
  },
}));
