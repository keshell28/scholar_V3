import { create } from 'zustand';

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'connection' 
  | 'message' 
  | 'scholarship' 
  | 'community' 
  | 'mention';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  avatar: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDropdownOpen: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  toggleDropdown: () => void;
  setDropdownOpen: (open: boolean) => void;
  initializeMockData: () => void;
}

const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: 'notif-1',
      type: 'connection',
      title: 'New Connection Request',
      message: 'Tendai Moyo wants to connect with you',
      avatar: 'https://i.pravatar.cc/150?u=tendai',
      link: '/discover',
      read: false,
      createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 min ago
    },
    {
      id: 'notif-2',
      type: 'like',
      title: 'Post Liked',
      message: 'Nyasha Chikwamba and 12 others liked your post about studying abroad',
      avatar: 'https://i.pravatar.cc/150?u=nyasha',
      link: '/',
      read: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
    },
    {
      id: 'notif-3',
      type: 'comment',
      title: 'New Comment',
      message: 'Rumbidzai Ndlovu commented on your post: "Great insights! I had a similar experience..."',
      avatar: 'https://i.pravatar.cc/150?u=rumbidzai',
      link: '/',
      read: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'notif-4',
      type: 'scholarship',
      title: 'New Scholarship Match',
      message: 'Fulbright Scholarship deadline is in 7 days - Computer Science, USA',
      avatar: 'https://ui-avatars.com/api/?name=Scholarship&background=00843D&color=fff',
      link: '/scholarships',
      read: true,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: 'notif-5',
      type: 'community',
      title: 'Community Update',
      message: 'Zimbabwe Students South Africa posted: "Braai this weekend in Johannesburg!"',
      avatar: 'https://ui-avatars.com/api/?name=ZSA&background=FFD100&color=000',
      link: '/communities',
      read: true,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      id: 'notif-6',
      type: 'message',
      title: 'New Message',
      message: 'Tinashe Mukasa sent you a message',
      avatar: 'https://i.pravatar.cc/150?u=tinashe',
      link: '/chat',
      read: true,
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      id: 'notif-7',
      type: 'mention',
      title: 'You Were Mentioned',
      message: 'Chenai Mapfumo mentioned you in a comment',
      avatar: 'https://i.pravatar.cc/150?u=chenai',
      link: '/',
      read: true,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 'notif-8',
      type: 'connection',
      title: 'Connection Accepted',
      message: 'Tafadzwa Moyo accepted your connection request',
      avatar: 'https://i.pravatar.cc/150?u=tafadzwa',
      link: '/discover',
      read: true,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isDropdownOpen: false,

  initializeMockData: () => {
    const notifications = generateMockNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter(n => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  toggleDropdown: () => {
    set((state) => ({ isDropdownOpen: !state.isDropdownOpen }));
  },

  setDropdownOpen: (open) => {
    set({ isDropdownOpen: open });
  },
}));
