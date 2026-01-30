import React, { useEffect, useState, useRef } from 'react';
import { Send, Search, ArrowLeft, Circle } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function Chat() {
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
    stopTyping
  } = useChatStore();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat on mount
  useEffect(() => {
    if (token) {
      console.log('🚀 Initializing chat with token');
      initializeSocket(token);
      fetchConversations();
    }
  }, [token]);

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
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping(activeConversationId, receiverId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    // Send typing indicator
    if (activeConversation && activeConversationId) {
      if (e.target.value.trim()) {
        startTyping(activeConversationId, activeConversation.participant.id);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping(activeConversationId, activeConversation.participant.id);
        }, 2000);
      } else {
        stopTyping(activeConversationId, activeConversation.participant.id);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.university?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] flex bg-white dark:bg-gray-900">
      {/* Conversations List */}
      <div className={`
        ${activeConversationId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 dark:border-gray-800
      `}>
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            {isConnected ? (
              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <Circle className="h-2 w-2 fill-current" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Circle className="h-2 w-2" />
                <span>Connecting...</span>
              </div>
            )}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {conversations.length === 0 
                  ? 'No conversations yet. Start chatting with other students!' 
                  : 'No conversations found'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 ${
                  activeConversationId === conversation.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.participant.profileImage || 'https://i.pravatar.cc/150'}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                      {conversation.participant.name}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                    {conversation.participant.university || 'Student'}
                  </p>
                  
                  {conversation.lastMessage && (
                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        ${activeConversationId ? 'flex' : 'hidden md:flex'} 
        flex-1 flex-col
      `}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <button
                onClick={() => setActiveConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <img
                src={activeConversation.participant.profileImage || 'https://i.pravatar.cc/150'}
                alt={activeConversation.participant.name}
                className="w-10 h-10 rounded-full"
              />
              
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {activeConversation.participant.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeConversation.participant.university || 'Student'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                activeMessages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-[var(--color-primary-500)] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              
              {typingUser && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {typingUser} is typing...
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <textarea
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none text-gray-900 dark:text-white placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
