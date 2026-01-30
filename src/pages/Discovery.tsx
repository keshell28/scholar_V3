import { useEffect, useState } from 'react';
import { Heart, X, MapPin, GraduationCap, Filter, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryStore } from '../stores/discoveryStore';
import { useChatStore } from '../stores/chatStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../stores/toastStore';
import { COUNTRIES } from '../data/countries-universities';

export default function Discovery() {
  const navigate = useNavigate();
  const { 
    users, 
    currentIndex, 
    isLoading,
    fetchDiscoveryFeed, 
    swipe,
    setFilters,
    nextUser
  } = useDiscoveryStore();
  
  const { createConversation, setActiveConversation } = useChatStore();
  const { success: showSuccessToast } = useToastStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterConnectionType, setFilterConnectionType] = useState<string>('all');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);

  // Fetch users on mount
  useEffect(() => {
    fetchDiscoveryFeed();
  }, []);

  const currentStudent = users[currentIndex];

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!currentStudent) return;
    
    // Set swipe direction for animation
    setSwipeDirection(action === 'like' ? 'right' : 'left');
    
    // Send swipe to backend
    const result = await swipe(currentStudent.id, action);
    
    if (result?.isMatch) {
      console.log('🎉 Match!', result);
      setMatchedUser(currentStudent);
      setShowMatchModal(true);
      
      showSuccessToast(`It's a match with ${currentStudent.name}! 🎉`);
    }
    
    // Wait for animation to complete before changing index
    setTimeout(() => {
      if (currentIndex < users.length - 1) {
        nextUser();
      } else {
        // No more users - fetch more
        fetchDiscoveryFeed({ 
          country: filterCountry !== 'all' ? filterCountry : undefined,
          connectionType: filterConnectionType !== 'all' ? filterConnectionType : undefined
        });
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleMessageMatch = async () => {
    if (!matchedUser) return;
    
    // Create or get conversation
    const conversation = await createConversation(matchedUser.id);
    
    if (conversation) {
      setActiveConversation(conversation.id);
      navigate('/chat');
    }
    
    setShowMatchModal(false);
  };

  const applyFilters = () => {
    setFilters({
      country: filterCountry !== 'all' ? filterCountry : undefined,
      connectionType: filterConnectionType !== 'all' ? filterConnectionType : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <Sparkles className="h-16 w-16 text-[var(--color-primary-500)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No more students nearby!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {users.length === 0 
              ? 'Check back later for new students'
              : 'You\'ve seen all available students. Check back later or adjust your filters'}
          </p>
          <button
            onClick={() => {
              setFilterCountry('all');
              setFilterConnectionType('all');
              fetchDiscoveryFeed();
            }}
            className="px-6 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-3 sm:py-4 px-3 sm:px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Discover Students
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-primary-500)]" />
          </button>
        </div>

        {showFilters && (
          <div className="mb-3 sm:mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white text-xs sm:text-sm">Filters</h3>
            <div className="space-y-2">
              <select 
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Countries</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              
              <select 
                value={filterConnectionType}
                onChange={(e) => setFilterConnectionType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Connection Types</option>
                <option value="friendship">Friendship</option>
                <option value="mentorship">Mentorship</option>
                <option value="study-buddy">Study Buddy</option>
              </select>
              
              <button
                onClick={applyFilters}
                className="w-full py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
            {(filterCountry !== 'all' || filterConnectionType !== 'all') && (
              <button
                onClick={() => {
                  setFilterCountry('all');
                  setFilterConnectionType('all');
                  fetchDiscoveryFeed();
                }}
                className="mt-2 w-full text-sm text-[var(--color-primary-600)] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStudent.id}
            initial={{ scale: 0.8, opacity: 0, x: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{
              x: swipeDirection === 'right' ? 400 : swipeDirection === 'left' ? -400 : 0,
              opacity: 0,
              rotate: swipeDirection === 'right' ? 15 : swipeDirection === 'left' ? -15 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-48 sm:h-56">
                <img
                  src={currentStudent.profileImage || 'https://i.pravatar.cc/400'}
                  alt={currentStudent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {currentStudent.matchScore !== undefined && currentStudent.matchScore > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      {currentStudent.matchScore}% Match
                    </div>
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-[var(--color-primary-500)] text-white px-2.5 py-1 rounded-full text-xs font-semibold capitalize">
                  {currentStudent.connectionType?.replace('-', ' ')}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {currentStudent.name}
                </h2>
                
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <GraduationCap className="h-4 w-4 mr-2 text-[var(--color-primary-500)]" />
                    {currentStudent.fieldOfStudy} • {currentStudent.university}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-[var(--color-primary-500)]" />
                    {currentStudent.city}, {currentStudent.country}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                  {currentStudent.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {currentStudent.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-0.5 bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] text-[var(--color-primary-500)] dark:text-[var(--color-primary-300)] rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => handleSwipe('pass')}
                className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="h-7 w-7 text-red-500" />
              </button>
              
              <button
                onClick={() => handleSwipe('like')}
                className="w-16 h-16 rounded-full bg-[var(--color-primary-500)] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart className="h-8 w-8 text-white" fill="white" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} of {users.length} students
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center"
          >
            <div className="mb-4">
              <Sparkles className="h-16 w-16 text-[var(--color-primary-500)] mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                It's a Match!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You and {matchedUser.name} liked each other
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src={matchedUser.profileImage || 'https://i.pravatar.cc/150'}
                alt={matchedUser.name}
                className="w-20 h-20 rounded-full border-4 border-[var(--color-primary-500)]"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleMessageMatch}
                className="w-full py-3 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Send Message
              </button>
              <button
                onClick={() => setShowMatchModal(false)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Keep Swiping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
