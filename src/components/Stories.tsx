import { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import { useAuthStore } from '../stores/authStore';
import { Story } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stories() {
  const { addStory, viewStory, getActiveStories } = useStoryStore();
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryColor, setNewStoryColor] = useState('#00843D');

  const activeStories = getActiveStories();
  
  // Group stories by user
  const groupedStories = activeStories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = [];
    }
    acc[story.userId].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const handleCreateStory = () => {
    if (!user || !newStoryText.trim()) return;

    const newStory: Story = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userImage: user.profileImage,
      content: newStoryText,
      backgroundColor: newStoryColor,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      views: [],
    };

    addStory(newStory);
    setShowCreateModal(false);
    setNewStoryText('');
    setNewStoryColor('#00843D');
  };

  const handleViewStory = (story: Story) => {
    if (user) {
      viewStory(story.id, user.id);
    }
    setViewingStory(story);
    
    // Find the index of this story in activeStories
    const index = activeStories.findIndex(s => s.id === story.id);
    setCurrentStoryIndex(index);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < activeStories.length - 1) {
      const nextStory = activeStories[currentStoryIndex + 1];
      if (user) {
        viewStory(nextStory.id, user.id);
      }
      setViewingStory(nextStory);
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      const prevStory = activeStories[currentStoryIndex - 1];
      if (user) {
        viewStory(prevStory.id, user.id);
      }
      setViewingStory(prevStory);
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const colors = [
    { name: 'Green', value: '#00843D' },
    { name: 'Yellow', value: '#FFD100' },
    { name: 'Red', value: '#EA3721' },
    { name: 'Blue', value: '#1E40AF' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const hours = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    return `${hours}h left`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stories</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
        >
          + Add Story
        </button>
      </div>

      {/* Stories Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {Object.entries(groupedStories).map(([userId, userStories]) => {
          const latestStory = userStories[0];
          const hasViewed = user && latestStory.views.includes(user.id);
          
          return (
            <motion.button
              key={userId}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleViewStory(latestStory)}
              className="flex-shrink-0 text-center"
            >
              <div
                className={`relative w-16 h-16 rounded-full p-0.5 ${
                  hasViewed
                    ? 'bg-gray-300 dark:bg-gray-600'
                    : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500'
                }`}
              >
                <img
                  src={latestStory.userImage}
                  alt={latestStory.userName}
                  className="w-full h-full rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
                {userStories.length > 1 && (
                  <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {userStories.length}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[64px] truncate">
                {latestStory.userName.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {getTimeAgo(latestStory.createdAt)}
              </p>
            </motion.button>
          );
        })}

        {Object.keys(groupedStories).length === 0 && (
          <div className="text-center py-8 w-full">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No active stories. Be the first to share!
            </p>
          </div>
        )}
      </div>

      {/* Create Story Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Create Story
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewStoryColor(color.value)}
                      className={`w-12 h-12 rounded-lg border-2 ${
                        newStoryColor === color.value
                          ? 'border-white ring-2 ring-green-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  maxLength={150}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="Share what's on your mind..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {newStoryText.length}/150 characters
                </p>
              </div>

              {/* Preview */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview:
                </p>
                <motion.div
                  key={newStoryColor}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-lg p-8 text-white text-center flex items-center justify-center min-h-[200px]"
                  style={{ backgroundColor: newStoryColor }}
                >
                  <p className="text-lg font-medium">{newStoryText || 'Your story text...'}</p>
                </motion.div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateStory}
                  disabled={!newStoryText.trim()}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Share Story
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewStoryText('');
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Story Modal */}
      <AnimatePresence>
        {viewingStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewingStory(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>

            {/* Previous Button */}
            {currentStoryIndex > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePreviousStory}
                className="absolute left-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}

            {/* Next Button */}
            {currentStoryIndex < activeStories.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextStory}
                className="absolute right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-md w-full mx-4"
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <img
                  src={viewingStory.userImage}
                  alt={viewingStory.userName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{viewingStory.userName}</p>
                  <p className="text-gray-300 text-sm">
                    {getTimeAgo(viewingStory.createdAt)} • {getTimeRemaining(viewingStory.expiresAt)}
                  </p>
                </div>
              </div>

              {/* Story Content */}
              <div
                className="rounded-lg p-12 text-white text-center flex items-center justify-center aspect-[9/16] max-h-[600px]"
                style={{ backgroundColor: viewingStory.backgroundColor }}
              >
                {viewingStory.image ? (
                  <img
                    src={viewingStory.image}
                    alt="Story"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-2xl font-medium px-4">{viewingStory.content}</p>
                )}
              </div>

              {/* Views */}
              <div className="mt-4 text-white text-sm">
                <p className="text-gray-300">
                  👁️ {viewingStory.views.length} {viewingStory.views.length === 1 ? 'view' : 'views'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
