import React, { useEffect, useState, useRef } from 'react';
import { Send, Search, ArrowLeft, Circle, Users, Plus, X, Calendar, MapPin, Globe, Clock, UserPlus, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { formatDistanceToNow } from 'date-fns';
import { StudyGroup } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWithGroups() {
  const { 
    conversations, 
    messages, 
    activeConversationId, 
    sendMessage, 
    setActiveConversation,
    initializeSocket,
    fetchConversations,
    isConnected,
    typingUsers,
    startTyping,
    stopTyping,
    studyGroups,
    fetchMyStudyGroups,
    fetchStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    deleteStudyGroup
  } = useChatStore();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupBrowser, setShowGroupBrowser] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { success: showSuccess, error: showError } = useToastStore();

  // Initialize chat on mount
  useEffect(() => {
    if (token && isAuthenticated) {
      console.log('🚀 Initializing chat with token');
      initializeSocket(token);
      fetchConversations();
      fetchMyStudyGroups();
    } else {
      console.log('⚠️ No valid token - user needs to login');
    }
  }, [token, isAuthenticated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const typingUser = activeConversationId ? typingUsers[activeConversationId] : null;

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation && activeConversationId) {
      const receiverId = activeConversation.participant.id;
      sendMessage(activeConversationId, receiverId, messageInput.trim());
      setMessageInput('');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping(activeConversationId, receiverId);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!activeConversation || !activeConversationId) return;

    const receiverId = activeConversation.participant.id;
    
    if (value.trim()) {
      startTyping(activeConversationId, receiverId);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(activeConversationId, receiverId);
      }, 1000);
    } else {
      stopTyping(activeConversationId, receiverId);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myStudyGroups = studyGroups.filter(g => g.isMember);

  // Show login prompt if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-500 mb-4">Please login to access chat and study groups</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-full sm:w-96 lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${
        showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header with tabs */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Circle 
                  className={`w-2 h-2 ${isConnected ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} 
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'chats'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                activeTab === 'groups'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Groups
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder={activeTab === 'chats' ? "Search messages..." : "Search groups..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations or Groups List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {activeTab === 'chats' ? (
            // Conversations list
            filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <div className="max-w-xs mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">No conversations yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start a conversation from Discovery!</p>
                </div>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    activeConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <img
                    src={conversation.participant.profileImage}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conversation.participant.name}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage?.content || 'Start a conversation'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )
          ) : (
            // Study groups list
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Create Group
                </button>
                <button
                  onClick={() => {
                    setShowGroupBrowser(true);
                    fetchStudyGroups();
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Search className="w-4 h-4" />
                  Browse
                </button>
              </div>

              {myStudyGroups.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No study groups yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create or join a group to collaborate with peers!</p>
                </div>
              ) : (
                myStudyGroups.map(group => (
                  <StudyGroupCard 
                    key={group.id} 
                    group={group}
                    onLeave={() => leaveStudyGroup(group.id)}
                    onDelete={group.isCreator ? () => deleteStudyGroup(group.id) : undefined}
                    onManageMembers={group.isCreator ? () => {
                      setSelectedGroup(group);
                      setShowAddMembers(true);
                    } : undefined}
                    onShare={group.isCreator ? () => {
                      setSelectedGroup(group);
                      setShowShareLink(true);
                    } : undefined}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full min-w-0">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setActiveConversation(null);
                    setShowSidebar(true);
                  }}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeConversation.participant.profileImage}
                  alt={activeConversation.participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {activeConversation.participant.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeConversation.participant.university}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-0">
              {activeMessages.map((message) => {
                const isOwn = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-green-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {typingUser && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-500">{typingUser} is typing...</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
            <div className="text-center max-w-md">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
              >
                Open Conversations
              </button>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Send className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Select a conversation to start messaging</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Or create a study group to collaborate with peers</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={async (groupData) => {
          try {
            const created = await createStudyGroup(groupData);
            if (created) {
              setShowCreateGroup(false);
              showSuccess('Study group created successfully!');
              setSelectedGroup(created);
              setShowAddMembers(true); // Show add members modal after creation
              await fetchMyStudyGroups();
            }
          } catch (error: any) {
            showError(error.message || 'Failed to create study group');
          }
        }}
      />

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddMembers}
        onClose={() => {
          setShowAddMembers(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        connections={conversations.map(c => c.participant)}
        onSkip={() => {
          const { info } = useToastStore.getState();
          setShowAddMembers(false);
          setSelectedGroup(null);
          info('You can add members later from group settings');
        }}
        onShare={() => {
          setShowAddMembers(false);
          setShowShareLink(true);
        }}
      />

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={showShareLink}
        onClose={() => {
          setShowShareLink(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
      />

      {/* Browse Groups Modal */}
      <BrowseGroupsModal
        isOpen={showGroupBrowser}
        onClose={() => setShowGroupBrowser(false)}
        groups={studyGroups}
        onJoin={async (groupId) => {
          await joinStudyGroup(groupId);
          fetchMyStudyGroups();
        }}
      />
    </div>
  );
}

// Study Group Card Component
function StudyGroupCard({ 
  group, 
  onLeave, 
  onDelete,
  onManageMembers,
  onShare
}: { 
  group: StudyGroup; 
  onLeave: () => void;
  onDelete?: () => void;
  onManageMembers?: () => void;
  onShare?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">{group.name}</h4>
            {group.isCreator && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                Creator
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{group.subject}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {group.description}
      </p>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Users className="w-3.5 h-3.5" />
          <span className="font-medium">{group.memberCount || 1}/{group.maxMembers}</span>
        </span>
        {group.isOnline && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Circle className="w-2 h-2 fill-current" />
            <span className="font-medium">Online</span>
          </span>
        )}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {group.isCreator && (
          <>
            <button
              onClick={onManageMembers}
              className="flex-1 min-w-[120px] px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add Members
            </button>
            <button
              onClick={onShare}
              className="flex-1 min-w-[100px] px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            Delete
          </button>
        )}
        {!group.isCreator && (
          <button
            onClick={onLeave}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Leave Group
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Create Group Modal - Wizard Style
function CreateGroupModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    maxMembers: 10,
    isOnline: true,
    schedule: '',
    location: '',
    tags: [] as string[]
  });

  const totalSteps = 4;

  // Reset to step 1 when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onCreate(formData);
    // Don't reset here - let the modal close and reset via useEffect
  };

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      description: '',
      maxMembers: 10,
      isOnline: true,
      schedule: '',
      location: '',
      tags: []
    });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.subject.trim() !== '';
      case 2:
        return true; // Description is optional
      case 3:
        return formData.isOnline || formData.location.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8"
      >
        {/* Header with better gradient */}
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 px-6 sm:px-8 py-6 rounded-t-2xl">
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
          </button>
          
          <div className="pr-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Study Group</h3>
            <p className="text-green-50 text-sm sm:text-base">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="px-6 sm:px-8 pt-6">
          <div className="flex gap-2 sm:gap-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex-1 relative">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index + 1 <= currentStep
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
                {index + 1 <= currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step labels for larger screens */}
          <div className="hidden sm:flex gap-2 sm:gap-3 mt-3">
            {['Basics', 'Details', 'Meeting', 'Review'].map((label, index) => (
              <div key={label} className="flex-1 text-center">
                <span className={`text-xs font-medium transition-colors ${
                  index + 1 <= currentStep 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content with better padding and responsive design */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[320px] sm:min-h-[400px]"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                      <span className="text-3xl">📚</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Basic Information
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Let's start with the basics. What's your group called and what subject will you be studying?
                    </p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Group Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition-all text-base placeholder:text-gray-400"
                        placeholder="e.g., Calculus Study Squad"
                        autoFocus
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Choose a catchy, memorable name
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition-all text-base placeholder:text-gray-400"
                        placeholder="e.g., Mathematics, Physics, Chemistry"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        What subject will your group focus on?
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                      <span className="text-3xl">✍️</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Group Details
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Tell potential members what this group is about and how many people can join.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition-all text-base placeholder:text-gray-400 resize-none"
                        rows={5}
                        placeholder="What topics will you cover? What's the goal of this study group?"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Optional - but helps others understand your group better
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
                        Maximum Members
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="2"
                          max="50"
                          value={formData.maxMembers}
                          onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                          className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((formData.maxMembers - 2) / 48) * 100}%, #d1d5db ${((formData.maxMembers - 2) / 48) * 100}%, #d1d5db 100%)`
                          }}
                        />
                        <div className="flex items-center justify-center min-w-[70px] h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                          <span className="text-3xl font-bold text-white">
                            {formData.maxMembers}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 flex items-start gap-2">
                        <span className="text-base">💡</span>
                        <span>Recommended: 5-15 members for effective collaboration</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                      <span className="text-3xl">📍</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Meeting Details
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Where and when will your group meet?
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border-2 border-green-200 dark:border-green-800 transition-all">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="flex items-center h-6">
                          <input
                            type="checkbox"
                            checked={formData.isOnline}
                            onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                            className="w-5 h-5 rounded-md text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Online Group (Virtual Meetings)
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Meet via video calls, collaborate remotely from anywhere
                          </p>
                        </div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {!formData.isOnline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              Meeting Location <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition-all text-base placeholder:text-gray-400"
                              placeholder="e.g., University Library Room 204, Student Center"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Schedule <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.schedule}
                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition-all text-base placeholder:text-gray-400"
                        placeholder="e.g., Tuesdays & Thursdays 6pm, Weekends 2-4pm"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        When do you plan to meet? You can update this later
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      Review & Confirm
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Everything looks good? Let's create your study group!
                    </p>
                  </div>

                  {/* Enhanced Preview Card */}
                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 sm:p-8 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-lg">
                    <div className="flex items-start justify-between mb-5">
                      <h5 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white pr-4 leading-tight">
                        {formData.name}
                      </h5>
                      <div className="flex-shrink-0 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        NEW
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-3 bg-white/60 dark:bg-gray-900/30 rounded-xl">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📚</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white break-words">
                            {formData.subject}
                          </p>
                        </div>
                      </div>
                      
                      {formData.description && (
                        <div className="flex items-start gap-4 p-3 bg-white/60 dark:bg-gray-900/30 rounded-xl">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                            <span className="text-lg">💬</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">About</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                              {formData.description}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-900/30 rounded-xl">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Capacity</p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {formData.maxMembers} members
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-900/30 rounded-xl">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                            {formData.isOnline ? (
                              <Globe className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            ) : (
                              <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Format</p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white break-words">
                              {formData.isOnline ? 'Online' : formData.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {formData.schedule && (
                        <div className="flex items-start gap-4 p-3 bg-white/60 dark:bg-gray-900/30 rounded-xl">
                          <div className="flex-shrink-0 w-8 h-8 bg-pink-100 dark:bg-pink-900/40 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Schedule</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                              {formData.schedule}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 text-2xl">
                        💡
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                          You're almost there!
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          You'll be added as the first member and creator. You can invite others and manage settings after creation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className="flex-1 sm:min-w-[140px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {currentStep === totalSteps ? (
                <span className="flex items-center justify-center gap-2">
                  🎉 Create Group
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Browse Groups Modal
function BrowseGroupsModal({ 
  isOpen, 
  onClose, 
  groups,
  onJoin 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  groups: StudyGroup[];
  onJoin: (groupId: string) => void;
}) {
  const availableGroups = groups.filter(g => !g.isMember);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Browse Study Groups</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {availableGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No available groups to join</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableGroups.map(group => (
              <div key={group.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{group.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{group.subject}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {group.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {group.memberCount}/{group.maxMembers}
                  </span>
                  {group.isOnline && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Online
                    </span>
                  )}
                  {group.schedule && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {group.schedule}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => onJoin(group.id)}
                  disabled={!!(group.memberCount && group.memberCount >= group.maxMembers)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {group.memberCount && group.memberCount >= group.maxMembers ? 'Group Full' : 'Join Group'}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Add Members Modal
function AddMembersModal({
  isOpen,
  onClose,
  group,
  connections,
  onSkip,
  onShare
}: {
  isOpen: boolean;
  onClose: () => void;
  group: StudyGroup | null;
  connections: any[];
  onSkip: () => void;
  onShare: () => void;
}) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { success: showSuccess, error: showError } = useToastStore();

  const toggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleInvite = async () => {
    if (selectedMembers.length === 0) {
      showError('Please select at least one member to invite');
      return;
    }
    
    // TODO: Implement invite API call
    showSuccess(`Invited ${selectedMembers.length} members to the group!`);
    setSelectedMembers([]);
    onClose();
  };

  const filteredConnections = connections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Add Members</h3>
            <p className="text-sm text-gray-500 mt-1">{group.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto mb-4">
          {filteredConnections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No connections available</p>
              <p className="text-sm mt-2">Connect with students on the Discovery page!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConnections.map(connection => (
                <button
                  key={connection.id}
                  onClick={() => toggleMember(connection.id)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedMembers.includes(connection.id)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={connection.profileImage}
                      alt={connection.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white">{connection.name}</h4>
                      <p className="text-sm text-gray-500">{connection.university}</p>
                    </div>
                    {selectedMembers.includes(connection.id) && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedMembers.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={onShare}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Link
          </button>
          {filteredConnections.length > 0 && (
            <button
              onClick={handleInvite}
              disabled={selectedMembers.length === 0}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Invite Selected
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Share Link Modal
function ShareLinkModal({
  isOpen,
  onClose,
  group
}: {
  isOpen: boolean;
  onClose: () => void;
  group: StudyGroup | null;
}) {
  const [copied, setCopied] = useState(false);
  const { success: showSuccess, error: showError } = useToastStore();

  if (!isOpen || !group) return null;

  const shareLink = `${window.location.origin}/groups/join/${group.id}`;
  const shareMessage = `Join my study group "${group.name}" on Scholar! 📚\n\nSubject: ${group.subject}\n${group.description ? `About: ${group.description}\n` : ''}${shareLink}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      showSuccess('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Failed to copy link');
    }
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Join my study group: ${group.name}&body=${encodeURIComponent(shareMessage)}`;
  };

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Share Study Group</h3>
            <p className="text-sm text-gray-500 mt-1">{group.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Link Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Share this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div>
            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Or share via:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={shareViaEmail}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Email
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> Anyone with this link can request to join your study group. You'll be able to approve or decline requests.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
