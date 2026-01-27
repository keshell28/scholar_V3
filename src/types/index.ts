export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  fieldOfStudy: string;
  country: string;
  city: string;
  bio: string;
  profileImage: string;
  connectionType: 'friendship' | 'mentorship' | 'study-buddy';
  interests: string[];
  yearsOfStudy: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: 'country' | 'university' | 'field' | 'culture' | 'other';
  members: number;
  image: string;
  posts: Post[];
  adminId: string;
  createdAt: Date;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  communityId?: string;
  content: string;
  images?: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isPinned?: boolean;
  type: 'announcement' | 'question' | 'share' | 'event';
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  postId: string;
  content: string;
  likes: number;
  createdAt: Date;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  country: string;
  university?: string;
  organization?: string;
  fieldOfStudy: string[];
  deadline: Date;
  amount?: string;
  link: string;
  isVerified: boolean;
  requirements: string[];
  createdAt: Date;
  
  // Premium features
  isPremium?: boolean;
  matchScore?: number;
  type?: 'full' | 'partial' | 'grant';
  level?: 'undergraduate' | 'postgraduate' | 'phd';
  location?: string;
  eligibility?: string[];
  applicationUrl?: string;
  savedByUser?: boolean;
  competitiveness?: 'low' | 'medium' | 'high';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image: string;
  authorId: string;
  authorName: string;
  category: string;
  tips: string[];
  whereToFindIngredients?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface CulturalMusic {
  id: string;
  title: string;
  artist?: string;
  description: string;
  genre: string;
  image: string;
  spotifyLink?: string;
  culturalSignificance: string;
  country: string;
}

export interface CulturalArt {
  id: string;
  title: string;
  artist?: string;
  description: string;
  image: string;
  category: string;
  culturalInfo: string;
  country: string;
}

export interface CulturalEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  traditions: string[];
  image: string;
  country: string;
}

export interface Proverb {
  id: string;
  shona?: string;
  ndebele?: string;
  language?: string;
  original?: string;
  english: string;
  meaning: string;
  usage: string;
  country: string;
}

export interface LanguagePhrase {
  shona?: string;
  ndebele?: string;
  language?: string;
  original?: string;
  english: string;
  pronunciation: string;
  country: string;
}
