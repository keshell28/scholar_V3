import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  Send, 
  Image as ImageIcon,
  Pin,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Calendar,
  TrendingUp,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  BadgeCheck,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCommunityStore } from '../stores/communityStore';
import { useAuthStore } from '../stores/authStore';
import { Community, Post } from '../types';

// Mock community data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: '🇨🇳 Zim Students in China',
    description: 'Connect with fellow Zimbabwean students studying across China',
    category: 'country',
    members: 1250,
    image: 'https://ui-avatars.com/api/?name=China+Community&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date('2024-01-15'),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '2',
    name: '🇺🇸 Zim Students in USA',
    description: 'For Zimbabweans studying in the United States',
    category: 'country',
    members: 890,
    image: 'https://ui-avatars.com/api/?name=USA+Community&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date('2024-02-10'),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '3',
    name: '👩‍⚕️ Nursing & Medicine Students',
    description: 'Medical students supporting each other',
    category: 'field',
    members: 560,
    image: 'https://ui-avatars.com/api/?name=Medicine&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date('2024-03-05'),
    isVerified: false,
    verificationStatus: 'pending',
  },
  {
    id: '4',
    name: '💻 IT & Engineering',
    description: 'Tech students sharing resources and opportunities',
    category: 'field',
    members: 2100,
    image: 'https://ui-avatars.com/api/?name=Tech&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date('2024-01-20'),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '5',
    name: '🍲 Zim Recipes Abroad',
    description: 'Share and find traditional recipes and ingredients',
    category: 'culture',
    members: 1800,
    image: 'https://ui-avatars.com/api/?name=Recipes&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date('2024-02-28'),
    isVerified: false,
    verificationStatus: 'none',
  },
];

// Mock posts
const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    authorName: 'Tatenda Moyo',
    authorImage: 'https://ui-avatars.com/api/?name=Tatenda+Moyo&size=100',
    content: 'Just wanted to share my experience with the visa renewal process in Beijing. Happy to answer any questions!',
    likes: 45,
    comments: [],
    createdAt: new Date('2025-01-26T10:30:00'),
    isPinned: true,
    type: 'share',
  },
  {
    id: '2',
    authorId: '2',
    authorName: 'Farai Ncube',
    authorImage: 'https://ui-avatars.com/api/?name=Farai+Ncube&size=100',
    content: 'Anyone know where to get good sadza mix in Shanghai? Missing home food 😊',
    likes: 23,
    comments: [],
    createdAt: new Date('2025-01-25T15:20:00'),
    type: 'question',
  },
  {
    id: '3',
    authorId: '3',
    authorName: 'Rudo Chikwamba',
    authorImage: 'https://ui-avatars.com/api/?name=Rudo+Chikwamba&size=100',
    content: '🎉 Community Meetup Alert! 🎉\n\nWe\'re organizing a gathering in Guangzhou next weekend. Location: TBD. Who\'s interested?',
    likes: 67,
    comments: [],
    createdAt: new Date('2025-01-24T09:15:00'),
    isPinned: false,
    type: 'event',
  },
  {
    id: '4',
    authorId: '4',
    authorName: 'Tinotenda Sibanda',
    authorImage: 'https://ui-avatars.com/api/?name=Tinotenda+Sibanda&size=100',
    content: 'PSA: The Chinese Embassy in Harare has updated their scholarship application process. Check their website for details!',
    likes: 89,
    comments: [],
    createdAt: new Date('2025-01-23T14:45:00'),
    type: 'announcement',
  },
];

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { joinedCommunities, joinCommunity, leaveCommunity } = useCommunityStore();
  
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [postType, setPostType] = useState<Post['type']>('share');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    // Load community data
    const foundCommunity = mockCommunities.find((c) => c.id === id);
    if (foundCommunity) {
      setCommunity(foundCommunity);
      setPosts(mockPosts);
    }
  }, [id]);

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Community not found
          </h2>
          <button
            onClick={() => navigate('/communities')}
            className="text-[var(--color-primary-500)] hover:underline"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  const isMember = joinedCommunities.includes(community.id);

  const handleJoinLeave = () => {
    if (isMember) {
      leaveCommunity(community.id);
      setIsNotificationsEnabled(false);
      toast.success(`Left ${community.name}`);
    } else {
      joinCommunity(community.id);
      toast.success(`Joined ${community.name}!`);
    }
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    if (!isMember) {
      toast.error('Join the community to post');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: currentUser?.id || '1',
      authorName: currentUser?.name || 'You',
      authorImage: currentUser?.profileImage || 'https://ui-avatars.com/api/?name=You&size=100',
      content: newPostContent,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      type: postType,
      communityId: community.id,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Post shared!');
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const toggleNotifications = () => {
    if (!isMember) {
      toast.error('Join the community first');
      return;
    }
    setIsNotificationsEnabled(!isNotificationsEnabled);
    toast.success(
      isNotificationsEnabled 
        ? 'Notifications disabled' 
        : 'Notifications enabled'
    );
  };

  const handleApplyForVerification = () => {
    setShowVerificationModal(false);
    toast.success('Verification application submitted! We\'ll review it within 5-7 business days.');
    // In real app: API call to submit verification request
  };

  const isAdmin = currentUser?.id === community.adminId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/communities')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Communities
          </button>

          <div className="flex items-start gap-4 mb-4">
            <img
              src={community.image}
              alt={community.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {community.name}
                </h1>
                {community.isVerified && (
                  <BadgeCheck className="h-7 w-7 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community.members.toLocaleString()} members
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Active
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {community.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleJoinLeave}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                isMember
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'btn-primary'
              }`}
            >
              {isMember ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  Leave
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Join Community
                </>
              )}
            </button>

            <button
              onClick={toggleNotifications}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isNotificationsEnabled ? (
                <Bell className="h-4 w-4 text-[var(--color-primary-500)]" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-3 px-1 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-[var(--color-primary-500)] border-b-2 border-[var(--color-primary-500)]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-1 font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'text-[var(--color-primary-500)] border-b-2 border-[var(--color-primary-500)]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'posts' ? (
          <div className="space-y-6">
            {/* Create Post */}
            {isMember && (
              <div className="card">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={currentUser?.profileImage || 'https://ui-avatars.com/api/?name=You&size=100'}
                    alt="You"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share something with the community..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as Post['type'])}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <option value="share">Share</option>
                      <option value="question">Question</option>
                      <option value="announcement">Announcement</option>
                      <option value="event">Event</option>
                    </select>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={handlePost}
                    disabled={!newPostContent.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Send className="h-4 w-4" />
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="card hover:shadow-lg transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.authorImage}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {post.authorName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{post.type}</span>
                          {post.isPinned && (
                            <>
                              <span>•</span>
                              <Pin className="h-3 w-3 text-[var(--color-primary-500)]" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary-500)] transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary-500)] transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary-500)] transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to share something with the community!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* About Tab */
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              About this community
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {community.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Community Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="h-6 w-6 text-[var(--color-primary-500)] mb-2" />
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {community.members.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="h-6 w-6 text-[var(--color-primary-500)] mb-2" />
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {new Date(community.createdAt).getFullYear()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </h3>
                <span className="inline-block px-3 py-1 bg-[var(--color-primary-500)] text-white rounded-full text-sm capitalize">
                  {community.category}
                </span>
              </div>

              {/* Verification Status Section */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Verification Status
                </h3>
                {community.isVerified ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Verified Community
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          This community has been verified by Scholar as an authentic and trusted space for students.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : community.verificationStatus === 'pending' ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          Verification Pending
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          This community has applied for verification. Review in progress.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : isAdmin ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-3 mb-3">
                      <Shield className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          Not Verified
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Apply for verification to show members this is an authentic community.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                      <BadgeCheck className="h-5 w-5" />
                      Apply for Verification
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm">Not verified</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Community Guidelines
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Be respectful and supportive of fellow members</li>
                  <li>Share relevant and helpful content</li>
                  <li>No spam or self-promotion without permission</li>
                  <li>Keep discussions on topic</li>
                  <li>Report inappropriate content to moderators</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Application Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BadgeCheck className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Apply for Verification
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Verified communities get a blue checkmark badge that shows members this is an authentic and trusted space.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Verification Criteria
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Active community with regular posts and engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Follows all community guidelines and terms of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Represents a legitimate student group or organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Minimum of 100 members (current: {community.members.toLocaleString()})</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Applications are typically reviewed within 5-7 business days. You'll receive a notification once your application is reviewed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyForVerification}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
