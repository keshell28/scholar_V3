import { ThumbsUp, MessageSquare, Share2, Send, Briefcase, GraduationCap, TrendingUp, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

// Mock feed data - LinkedIn style
const feedPosts = [
  {
    id: '1',
    author: 'Tatenda Moyo',
    authorImage: 'https://ui-avatars.com/api/?name=Tatenda+Moyo&size=150',
    title: 'Software Engineer',
    university: 'Tsinghua University',
    time: '2h',
    type: 'post',
    content: 'Excited to share that I\'ve just completed my Machine Learning internship at Huawei! 🎉\n\nKey takeaways from this incredible experience:\n• Working with cutting-edge AI technology\n• Collaborating with brilliant minds from around the world\n• Learning the importance of perseverance in tech\n\nTo my fellow Zimbabwean students in China - keep pushing! The opportunities are endless if we stay focused. Happy to connect and share more insights.\n\n#TechCareer #MachineLearning #ZimStudents',
    likes: 234,
    comments: 45,
    shares: 12,
  },
  {
    id: '2',
    author: 'Rutendo Chikwava',
    authorImage: 'https://ui-avatars.com/api/?name=Rutendo+Chikwava&size=150',
    title: 'Medical Student',
    university: 'Harvard Medical School',
    time: '5h',
    type: 'article',
    content: 'Breaking into Medical School as an International Student: My Journey 📚\n\nI often get asked about the scholarship application process. Here\'s what worked for me:\n\n1. Start early - Begin researching 2 years before application\n2. Build a strong academic profile\n3. Get involved in healthcare volunteering\n4. Network with alumni from your target schools\n5. Perfect your personal statement - tell YOUR unique story\n\nRemember: Your background as a Zimbabwean student is an ASSET, not a limitation.\n\nDM me if you need guidance - always happy to help the next generation! 💪',
    likes: 567,
    comments: 89,
    shares: 156,
  },
  {
    id: '3',
    author: 'Scholar Team',
    authorImage: 'https://ui-avatars.com/api/?name=Scholar&size=150',
    title: 'Student Network',
    university: '',
    time: '1d',
    type: 'opportunity',
    content: '🎓 NEW SCHOLARSHIP ALERT 🎓\n\nChevening Scholarships 2026 - Now Open!\n\n📍 Location: United Kingdom\n💰 Coverage: Full tuition + living expenses\n📅 Deadline: November 7, 2026\n\nEligible for Zimbabwean students pursuing Master\'s degrees. This is one of the most prestigious scholarships available.\n\nClick the link in comments for full details and application guidelines.\n\n#Scholarship #UKEducation #Chevening',
    likes: 1203,
    comments: 234,
    shares: 567,
  },
];

const suggestedConnections = [
  {
    id: '1',
    name: 'Tinashe Ndlovu',
    title: 'Engineering Student',
    university: 'University of Cape Town',
    image: 'https://ui-avatars.com/api/?name=Tinashe+Ndlovu&size=100',
    mutualConnections: 12,
  },
  {
    id: '2',
    name: 'Chipo Moyo',
    title: 'Business Administration',
    university: 'CEIBS Shanghai',
    image: 'https://ui-avatars.com/api/?name=Chipo+Moyo&size=100',
    mutualConnections: 8,
  },
];

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { currentSubscription } = useSubscriptionStore();
  const isPremium = currentSubscription?.tier !== 'free';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <Link to="/subscribe" className="block mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 transition cursor-pointer">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">Unlock Premium Scholarships</h3>
                    <p className="text-sm opacity-90">Get AI-powered matching and access to exclusive opportunities</p>
                  </div>
                </div>
                <button className="bg-gray-900 text-yellow-400 px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                  Upgrade Now
                </button>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:h-[calc(100vh-120px)]">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-3 space-y-4 lg:overflow-y-auto lg:h-full scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-12 sm:h-16 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]" />
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <img
                  src={user?.profileImage}
                  alt={user?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white dark:border-gray-900 -mt-8 sm:-mt-10"
                />
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mt-2">{user?.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {user?.fieldOfStudy} Student at {user?.university}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Connections</span>
                    <span className="text-[var(--color-primary-500)] font-semibold">142</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Profile views</span>
                    <span className="text-[var(--color-primary-500)] font-semibold">67</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
              <h4 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white mb-3">Quick Access</h4>
              <div className="space-y-2">
                <Link to="/scholarships" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary-500)]">
                  <GraduationCap className="h-4 w-4" />
                  Scholarships
                </Link>
                <Link to="/discover" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary-500)]">
                  <Briefcase className="h-4 w-4" />
                  Find Students
                </Link>
                <Link to="/communities" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary-500)]">
                  <TrendingUp className="h-4 w-4" />
                  Communities
                </Link>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-4 lg:overflow-y-auto lg:h-full scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Create Post */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-3">
                <img
                  src={user?.profileImage}
                  alt={user?.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <button className="flex-1 text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Start a post...
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <Link to="/profile" className="font-semibold text-gray-900 dark:text-white hover:text-[var(--color-primary-500)] hover:underline">
                        {post.author}
                      </Link>
                      {post.title && <p className="text-sm text-gray-600 dark:text-gray-400">{post.title}</p>}
                      {post.university && <p className="text-sm text-gray-600 dark:text-gray-400">{post.university}</p>}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{post.time} • 🌍</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mt-3 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                    {post.content}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="border-t border-gray-200 dark:border-gray-800">
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments · {post.shares} shares</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 px-2 sm:px-4 py-2 flex items-center justify-around">
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400">
                    <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Like</span>
                  </button>
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Comment</span>
                  </button>
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Share</span>
                  </button>
                  <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400">
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Send</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4 lg:overflow-y-auto lg:h-full scrollbar-hide hidden lg:block" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Suggested Connections */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">People you may know</h4>
              <div className="space-y-4">
                {suggestedConnections.map((connection) => (
                  <div key={connection.id} className="flex gap-3">
                    <img
                      src={connection.image}
                      alt={connection.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to="/profile" className="font-semibold text-sm text-gray-900 dark:text-white hover:text-[var(--color-primary-500)] block truncate">
                        {connection.name}
                      </Link>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{connection.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{connection.university}</p>
                      <button className="mt-2 px-4 py-1 border border-[var(--color-primary-500)] text-[var(--color-primary-500)] rounded-full text-sm font-semibold hover:bg-[var(--color-primary-50)] dark:hover:bg-green-950 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Trending in Zimbabwe</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">#ZimStudentsAbroad</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">2,345 posts</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">#ScholarshipOpportunities</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">1,892 posts</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">#StudyInChina</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">956 posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
