import { useState } from 'react';
import { Heart, X, MapPin, GraduationCap, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data - replace with real data later
const mockStudents = [
  {
    id: '1',
    name: 'Tatenda Moyo',
    age: 22,
    university: 'Tsinghua University',
    fieldOfStudy: 'Computer Science',
    country: 'China',
    city: 'Beijing',
    bio: 'Love coding and making new friends! Looking for study buddies and someone to explore Beijing with.',
    profileImage: 'https://ui-avatars.com/api/?name=Tatenda+Moyo&size=400',
    connectionType: 'friendship',
    interests: ['Technology', 'Hiking', 'Photography'],
    yearsOfStudy: 3,
  },
  {
    id: '2',
    name: 'Rutendo Chikwava',
    age: 24,
    university: 'Harvard University',
    fieldOfStudy: 'Medicine',
    country: 'USA',
    city: 'Boston',
    bio: 'Med student from Harare. Happy to mentor pre-med students or just chat about life in Boston!',
    profileImage: 'https://ui-avatars.com/api/?name=Rutendo+Chikwava&size=400',
    connectionType: 'mentorship',
    interests: ['Medicine', 'Running', 'Cooking'],
    yearsOfStudy: 2,
  },
  {
    id: '3',
    name: 'Tinashe Ndlovu',
    age: 21,
    university: 'University of Cape Town',
    fieldOfStudy: 'Engineering',
    country: 'South Africa',
    city: 'Cape Town',
    bio: 'Engineering student who loves sadza and good vibes. Let\'s connect!',
    profileImage: 'https://ui-avatars.com/api/?name=Tinashe+Ndlovu&size=400',
    connectionType: 'study-buddy',
    interests: ['Engineering', 'Music', 'Soccer'],
    yearsOfStudy: 2,
  },
];

export default function Discovery() {
  const [students] = useState(mockStudents);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentStudent = students[currentIndex];

  const handleSwipe = (direction: 'like' | 'pass') => {
    // Set swipe direction for animation
    setSwipeDirection(direction === 'like' ? 'right' : 'left');
    
    if (direction === 'like') {
      // Handle connection logic
      console.log('Connected with:', currentStudent.name);
    }
    
    // Wait for animation to complete before changing index
    setTimeout(() => {
      if (currentIndex < students.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more students
        setCurrentIndex(0);
      }
      setSwipeDirection(null);
    }, 300);
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No more students nearby!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later or adjust your filters
          </p>
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
              <select className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>All Countries</option>
                <option>China</option>
                <option>USA</option>
                <option>UK</option>
                <option>South Africa</option>
              </select>
              
              <select className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option>All Connection Types</option>
                <option>Friendship</option>
                <option>Mentorship</option>
                <option>Study Buddy</option>
              </select>
            </div>
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
                  src={currentStudent.profileImage}
                  alt={currentStudent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[var(--color-primary-500)] text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  {currentStudent.connectionType}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {currentStudent.name}, {currentStudent.age}
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
          {currentIndex + 1} of {students.length} students
        </div>
      </div>
    </div>
  );
}
