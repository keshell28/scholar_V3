import { create } from 'zustand';
import { Message, User, StudyGroup } from '../types';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  studyGroups: StudyGroup[];
  socket: Socket | null;
  isConnected: boolean;
  typingUsers: Record<string, string>; // conversationId -> userName
  
  // Actions
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (participantId: string) => Promise<Conversation | null>;
  sendMessage: (conversationId: string, receiverId: string, content: string) => void;
  markAsRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  startTyping: (conversationId: string, receiverId: string) => void;
  stopTyping: (conversationId: string, receiverId: string) => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  
  // Study groups
  fetchStudyGroups: (filters?: { subject?: string; isOnline?: boolean }) => Promise<void>;
  fetchMyStudyGroups: () => Promise<void>;
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'createdAt' | 'members'>) => Promise<StudyGroup | null>;
  joinStudyGroup: (groupId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string) => Promise<void>;
  deleteStudyGroup: (groupId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  studyGroups: [],
  socket: null,
  isConnected: false,
  typingUsers: {},

  // ============================================================================
  // SOCKET.IO INITIALIZATION
  // ============================================================================
  initializeSocket: (token: string) => {
    const state = get();
    
    // Prevent multiple connections
    if (state.socket?.connected) {
      console.log('🔌 Socket already connected');
      return;
    }
    
    console.log('🔌 Initializing Socket.IO connection...');
    
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    
    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      set({ isConnected: true });
    });
    
    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
      set({ isConnected: false });
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      set({ isConnected: false });
    });
    
    // Chat events
    socket.on('message:new', (data) => {
      console.log('💬 New message received:', data);
      const { conversationId, senderId, receiverId, content, createdAt, id } = data;
      
      const message: Message = {
        id: id || `temp-${Date.now()}`,
        senderId,
        receiverId,
        content,
        read: false,
        createdAt: new Date(createdAt)
      };
      
      set((state) => {
        const conversationMessages = state.messages[conversationId] || [];
        
        // Avoid duplicates
        if (conversationMessages.some(m => m.id === message.id)) {
          return state;
        }
        
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...conversationMessages, message]
          }
        };
      });
      
      // Update conversation's last message
      get().fetchConversations();
    });
    
    socket.on('message:notification', (data) => {
      console.log('🔔 Message notification:', data);
      // Could trigger browser notification here
    });
    
    socket.on('messages:read', (data) => {
      console.log('👀 Messages marked as read:', data);
      const { conversationId, messageIds } = data;
      
      set((state) => {
        const conversationMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: conversationMessages.map(msg =>
              messageIds.includes(msg.id) ? { ...msg, read: true } : msg
            )
          }
        };
      });
    });
    
    socket.on('typing:start', (data) => {
      const { conversationId, userName } = data;
      set((state) => ({
        typingUsers: { ...state.typingUsers, [conversationId]: userName }
      }));
    });
    
    socket.on('typing:stop', (data) => {
      const { conversationId } = data;
      set((state) => {
        const newTypingUsers = { ...state.typingUsers };
        delete newTypingUsers[conversationId];
        return { typingUsers: newTypingUsers };
      });
    });
    
    socket.on('user:online', (data) => {
      console.log('🟢 User online:', data.userId);
      // Update user online status in conversations
    });
    
    socket.on('user:offline', (data) => {
      console.log('🔴 User offline:', data.userId);
      // Update user offline status in conversations
    });
    
    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log('🔴 Disconnecting socket...');
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // ============================================================================
  // FETCH CONVERSATIONS
  // ============================================================================
  fetchConversations: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get(`${API_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const conversations = response.data.map((conv: any) => ({
        id: conv.id,
        participant: {
          id: conv.participant.id,
          name: conv.participant.name,
          email: conv.participant.email,
          profileImage: conv.participant.profileImage,
          university: conv.participant.university,
          fieldOfStudy: conv.participant.fieldOfStudy,
          isOnline: conv.participant.isOnline,
          lastSeen: conv.participant.lastSeen
        },
        lastMessage: conv.lastMessage ? {
          id: conv.lastMessage.id,
          content: conv.lastMessage.content,
          senderId: conv.lastMessage.senderId,
          receiverId: conv.lastMessage.receiverId,
          read: conv.lastMessage.isRead,
          createdAt: new Date(conv.lastMessage.createdAt)
        } : undefined,
        unreadCount: conv.unreadCount,
        updatedAt: new Date(conv.updatedAt)
      }));
      
      set({ conversations });
      console.log(`✅ Fetched ${conversations.length} conversations`);
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
    }
  },

  // ============================================================================
  // FETCH MESSAGES
  // ============================================================================
  fetchMessages: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get(
        `${API_URL}/api/chat/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 }
        }
      );
      
      const messages = response.data.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        read: msg.read,
        createdAt: new Date(msg.createdAt)
      }));
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: messages
        }
      }));
      
      console.log(`✅ Fetched ${messages.length} messages for conversation ${conversationId}`);
      
      // Join conversation room
      const socket = get().socket;
      if (socket?.connected) {
        socket.emit('conversation:join', conversationId);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  },

  // ============================================================================
  // CREATE CONVERSATION
  // ============================================================================
  createConversation: async (participantId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await api.post(
        `${API_URL}/api/chat/conversations`,
        { participantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const conv = response.data;
      const conversation: Conversation = {
        id: conv.id,
        participant: {
          id: conv.participant.id,
          name: conv.participant.name,
          email: conv.participant.email,
          profileImage: conv.participant.profileImage,
          university: conv.participant.university,
          fieldOfStudy: conv.participant.fieldOfStudy,
          country: conv.participant.country || '',
          city: conv.participant.city || '',
          bio: conv.participant.bio || '',
          connectionType: conv.participant.connectionType || 'friendship',
          interests: conv.participant.interests || [],
          yearsOfStudy: conv.participant.yearsOfStudy || 0,
          isOnline: conv.participant.isOnline,
          lastSeen: conv.participant.lastSeen
        },
        unreadCount: 0,
        updatedAt: new Date(conv.updatedAt)
      };
      
      set((state) => ({
        conversations: [conversation, ...state.conversations]
      }));
      
      console.log(`✅ Created conversation: ${conversation.id}`);
      return conversation;
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      return null;
    }
  },

  // ============================================================================
  // SEND MESSAGE
  // ============================================================================
  sendMessage: async (conversationId: string, receiverId: string, content: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const tempId = `temp-${Date.now()}`;
      const currentUserId = JSON.parse(atob(token.split('.')[1])).userId;
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: tempId,
        senderId: currentUserId,
        receiverId,
        content,
        read: false,
        createdAt: new Date()
      };
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), tempMessage]
        }
      }));
      
      // Send to server
      const response = await api.post(
        `${API_URL}/api/chat/conversations/${conversationId}/messages`,
        { receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const serverMessage = response.data;
      
      // Replace temp message with server message
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg =>
            msg.id === tempId
              ? {
                  id: serverMessage.id,
                  senderId: serverMessage.senderId,
                  receiverId: serverMessage.receiverId,
                  content: serverMessage.content,
                  read: serverMessage.read,
                  createdAt: new Date(serverMessage.createdAt)
                }
              : msg
          )
        }
      }));
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  },

  // ============================================================================
  // MARK AS READ
  // ============================================================================
  markAsRead: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await api.put(
        `${API_URL}/api/chat/conversations/${conversationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        ),
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg => ({
            ...msg,
            read: true
          }))
        }
      }));
      
      console.log('✅ Messages marked as read');
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  },

  // ============================================================================
  // SET ACTIVE CONVERSATION
  // ============================================================================
  setActiveConversation: (conversationId: string | null) => {
    const prevConversationId = get().activeConversationId;
    
    // Leave previous conversation room
    if (prevConversationId) {
      const socket = get().socket;
      if (socket?.connected) {
        socket.emit('conversation:leave', prevConversationId);
      }
    }
    
    set({ activeConversationId: conversationId });
    
    // Fetch messages and mark as read
    if (conversationId) {
      get().fetchMessages(conversationId);
      get().markAsRead(conversationId);
    }
  },

  // ============================================================================
  // TYPING INDICATORS
  // ============================================================================
  startTyping: (conversationId: string, receiverId: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('typing:start', { conversationId, receiverId });
    }
  },

  stopTyping: (conversationId: string, receiverId: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('typing:stop', { conversationId, receiverId });
    }
  },

  // ============================================================================
  // DELETE CONVERSATION
  // ============================================================================
  deleteConversation: async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await api.delete(
        `${API_URL}/api/chat/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      set((state) => ({
        conversations: state.conversations.filter(conv => conv.id !== conversationId),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([id]) => id !== conversationId)
        ),
        activeConversationId: state.activeConversationId === conversationId 
          ? null 
          : state.activeConversationId
      }));
      
      console.log('✅ Conversation deleted');
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
    }
  },

  // ============================================================================
  // STUDY GROUPS
  // ============================================================================
  
  // Fetch all study groups with optional filters
  fetchStudyGroups: async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.isOnline !== undefined) params.append('isOnline', String(filters.isOnline));

      const response = await api.get(
        `${API_URL}/api/studygroups${params.toString() ? `?${params.toString()}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ studyGroups: response.data });
      console.log(`✅ Fetched ${response.data.length} study groups`);
    } catch (error) {
      console.error('❌ Error fetching study groups:', error);
    }
  },

  // Fetch user's joined study groups
  fetchMyStudyGroups: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get(
        `${API_URL}/api/studygroups/user/my-groups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ studyGroups: response.data });
      console.log(`✅ Fetched ${response.data.length} user study groups`);
    } catch (error) {
      console.error('❌ Error fetching user study groups:', error);
    }
  },

  // Create a new study group
  createStudyGroup: async (groupData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No authentication token found');
        throw new Error('You must be logged in to create a study group');
      }

      console.log('📚 Creating study group:', groupData.name);
      const response = await api.post(
        `${API_URL}/api/studygroups`,
        groupData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newGroup = response.data;
      set((state) => ({
        studyGroups: [newGroup, ...state.studyGroups]
      }));

      console.log(`✅ Created study group: ${newGroup.name}`);
      return newGroup;
    } catch (error: any) {
      console.error('❌ Error creating study group:', error);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || 'Failed to create study group';
        
        if (status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        } else if (status === 403) {
          throw new Error('You do not have permission to create study groups.');
        } else if (status === 400) {
          throw new Error(message);
        } else {
          throw new Error(`Server error: ${message}`);
        }
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to create study group');
      }
    }
  },

  // Join a study group
  joinStudyGroup: async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.post(
        `${API_URL}/api/studygroups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      set((state) => ({
        studyGroups: state.studyGroups.map(group =>
          group.id === groupId
            ? { ...group, isMember: true, memberCount: (group.memberCount || 0) + 1 }
            : group
        )
      }));

      console.log(`✅ Joined study group: ${groupId}`);
    } catch (error: any) {
      console.error('❌ Error joining study group:', error);
      throw new Error(error.response?.data?.error || 'Failed to join study group');
    }
  },

  // Leave a study group
  leaveStudyGroup: async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.post(
        `${API_URL}/api/studygroups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      set((state) => ({
        studyGroups: state.studyGroups.map(group =>
          group.id === groupId
            ? { ...group, isMember: false, memberCount: (group.memberCount || 1) - 1 }
            : group
        )
      }));

      console.log(`✅ Left study group: ${groupId}`);
    } catch (error: any) {
      console.error('❌ Error leaving study group:', error);
      throw new Error(error.response?.data?.error || 'Failed to leave study group');
    }
  },

  // Delete a study group (creator only)
  deleteStudyGroup: async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.delete(
        `${API_URL}/api/studygroups/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from local state
      set((state) => ({
        studyGroups: state.studyGroups.filter(group => group.id !== groupId)
      }));

      console.log(`✅ Deleted study group: ${groupId}`);
    } catch (error: any) {
      console.error('❌ Error deleting study group:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete study group');
    }
  },
}));
