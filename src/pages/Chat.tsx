import { useEffect, useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
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
    initializeMockData 
  } = useChatStore();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // Initialize mock data on component mount
    if (conversations.length === 0) {
      initializeMockData();
    }
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation) {
      const participantId = activeConversation.participant.id;
      sendMessage(participantId, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.university.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={`w-full p-3 sm:p-4 flex items-start gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 ${
                  activeConversationId === conversation.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={conversation.participant.profileImage}
                    alt={conversation.participant.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--color-primary-50)]0 border-2 border-white dark:border-gray-900 rounded-full" />
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {conversation.participant.name}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                    {conversation.participant.university}
                  </p>
                  
                  {conversation.lastMessage && (
                    <p className={`text-xs sm:text-sm truncate ${
                      conversation.unreadCount > 0
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {conversation.lastMessage.senderId === 'current-user' ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-white font-bold">{conversation.unreadCount}</span>
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <img
                  src={activeConversation.participant.profileImage}
                  alt={activeConversation.participant.name}
                  className="w-10 h-10 rounded-full"
                />
                
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {activeConversation.participant.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeConversation.participant.university}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {activeMessages.map((message, index) => {
                const isCurrentUser = message.senderId === 'current-user';
                const showAvatar = index === 0 || activeMessages[index - 1].senderId !== message.senderId;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <img
                            src={activeConversation.participant.profileImage}
                            alt={activeConversation.participant.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-[var(--color-primary-500)] text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    
                    {isCurrentUser && (
                      <div className="flex-shrink-0">
                        {showAvatar && user ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 pr-12 bg-gray-100 dark:bg-gray-800 rounded-lg border-none resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] max-h-32"
                    style={{ minHeight: '40px' }}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your Messages
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
