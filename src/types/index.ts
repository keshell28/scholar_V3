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
  isOnline?: boolean;
  lastSeen?: Date;
  matchScore?: number;
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

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  creatorId: string;
  creatorName?: string;
  creatorImage?: string;
  members?: User[];
  memberCount?: number;
  maxMembers: number;
  schedule?: string;
  location?: string;
  isOnline: boolean;
  createdAt: Date;
  nextSession?: Date;
  tags: string[];
  isMember?: boolean;
  isCreator?: boolean;
}

export interface StudySession {
  id: string;
  groupId: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  isOnline: boolean;
  attendees: string[]; // user IDs
  notes?: string;
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

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'meetup' | 'party' | 'cultural' | 'academic' | 'sports' | 'workshop';
  date: Date;
  time: string;
  location: string;
  isOnline: boolean;
  organizerId: string;
  organizerName: string;
  organizerImage: string;
  image: string;
  maxAttendees?: number;
  attendees: string[]; // user IDs
  interested: string[]; // user IDs
  createdAt: Date;
  tags: string[];
  university?: string;
  isPaid: boolean;
  price?: number;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  university: string;
  fieldOfStudy: string;
  yearOfStudy: number;
  isMentor: boolean;
  bio: string;
  expertise: string[];
  availability: string;
  mentees?: string[]; // user IDs
  maxMentees?: number;
  rating?: number;
  reviewCount?: number;
  achievements?: string[];
}

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeImage: string;
  mentorId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Date;
}

export interface AlumniProfile {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  university: string;
  graduationYear: number;
  degree: string;
  fieldOfStudy: string;
  currentCompany?: string;
  currentPosition?: string;
  location: string;
  bio: string;
  expertise: string[];
  willingToMentor: boolean;
  careerPath: string[];
  achievements: string[];
  linkedIn?: string;
  email?: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  image?: string;
  backgroundColor?: string;
  createdAt: Date;
  expiresAt: Date;
  views: string[]; // user IDs who viewed
}

export interface VideoCallSession {
  id: string;
  roomId: string;
  participants: string[]; // user IDs
  initiatorId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  type: 'audio' | 'video';
}
