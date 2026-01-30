-- ============================================================================
-- SCHOLAR DATABASE SCHEMA - PostgreSQL
-- Complete database schema for Zimbabwean Student Social Network
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================================
-- DROP TABLES (for clean setup - run only when needed)
-- ============================================================================
DROP TABLE IF EXISTS story_views CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS video_call_sessions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS university_inquiries CASCADE;
DROP TABLE IF EXISTS university_programs CASCADE;
DROP TABLE IF EXISTS university_partners CASCADE;
DROP TABLE IF EXISTS alumni_profiles CASCADE;
DROP TABLE IF EXISTS mentorship_requests CASCADE;
DROP TABLE IF EXISTS mentor_profiles CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS study_group_members CASCADE;
DROP TABLE IF EXISTS study_groups CASCADE;
DROP TABLE IF EXISTS recipe_ratings CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS saved_scholarships CASCADE;
DROP TABLE IF EXISTS scholarships CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cultural_music CASCADE;
DROP TABLE IF EXISTS cultural_art CASCADE;
DROP TABLE IF EXISTS cultural_events CASCADE;
DROP TABLE IF EXISTS proverbs CASCADE;

-- ============================================================================
-- USERS TABLE - Core user profiles and authentication
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500) DEFAULT 'https://i.pravatar.cc/150',
  university VARCHAR(255),
  field_of_study VARCHAR(255),
  country VARCHAR(100),
  city VARCHAR(100),
  bio TEXT,
  connection_type VARCHAR(20) CHECK (connection_type IN ('friendship', 'mentorship', 'study-buddy')) DEFAULT 'friendship',
  interests JSONB DEFAULT '[]',
  years_of_study INTEGER DEFAULT 1,
  
  -- Authentication fields
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  
  -- Subscription
  subscription_tier VARCHAR(20) CHECK (subscription_tier IN ('free', 'premium', 'scholar-plus')) DEFAULT 'free',
  
  -- Activity tracking
  last_seen TIMESTAMP DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country_city ON users(country, city);
CREATE INDEX idx_users_university ON users(university);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_users_last_seen ON users(last_seen DESC);

-- Full-text search on users
CREATE INDEX idx_users_search ON users USING GIN(to_tsvector('english', name || ' ' || COALESCE(bio, '') || ' ' || COALESCE(university, '')));

-- ============================================================================
-- CONNECTIONS TABLE - Student discovery and matching
-- ============================================================================
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('pending', 'matched', 'passed', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique connection between two users
  CONSTRAINT unique_connection UNIQUE(user_id, target_user_id),
  -- Prevent self-connections
  CONSTRAINT no_self_connection CHECK (user_id != target_user_id)
);

CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_connections_target_user_id ON connections(target_user_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_connections_matched ON connections(user_id, status) WHERE status = 'matched';

-- ============================================================================
-- COMMUNITIES TABLE
-- ============================================================================
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(20) CHECK (category IN ('country', 'university', 'field', 'culture', 'other')) DEFAULT 'other',
  image VARCHAR(500),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(20) CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected')) DEFAULT 'none',
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_communities_admin ON communities(admin_id);
CREATE INDEX idx_communities_verified ON communities(is_verified);
CREATE INDEX idx_communities_search ON communities USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- COMMUNITY MEMBERS TABLE
-- ============================================================================
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_community_member UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_role ON community_members(role);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  type VARCHAR(20) CHECK (type IN ('announcement', 'question', 'share', 'event')) DEFAULT 'share',
  is_pinned BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_community_created ON posts(community_id, created_at DESC);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_pinned ON posts(is_pinned, created_at DESC);
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', content));

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at ASC);
CREATE INDEX idx_comments_author ON comments(author_id);

-- ============================================================================
-- POST LIKES TABLE
-- ============================================================================
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_post_like UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- ============================================================================
-- COMMENT LIKES TABLE
-- ============================================================================
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_comment_like UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

-- ============================================================================
-- SCHOLARSHIPS TABLE
-- ============================================================================
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  organization VARCHAR(255),
  country VARCHAR(100),
  university VARCHAR(255),
  field_of_study JSONB DEFAULT '[]',
  deadline DATE,
  amount VARCHAR(100),
  link VARCHAR(1000),
  application_url VARCHAR(1000),
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Additional metadata
  type VARCHAR(20) CHECK (type IN ('full', 'partial', 'grant')) DEFAULT 'partial',
  level VARCHAR(20) CHECK (level IN ('undergraduate', 'postgraduate', 'phd')),
  location VARCHAR(255),
  requirements JSONB DEFAULT '[]',
  eligibility JSONB DEFAULT '[]',
  competitiveness VARCHAR(20) CHECK (competitiveness IN ('low', 'medium', 'high')) DEFAULT 'medium',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scholarships_country ON scholarships(country);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_verified ON scholarships(is_verified);
CREATE INDEX idx_scholarships_premium ON scholarships(is_premium);
CREATE INDEX idx_scholarships_type ON scholarships(type);
CREATE INDEX idx_scholarships_level ON scholarships(level);
CREATE INDEX idx_scholarships_search ON scholarships USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(organization, '')));

-- ============================================================================
-- SAVED SCHOLARSHIPS TABLE
-- ============================================================================
CREATE TABLE saved_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  notes TEXT,
  status VARCHAR(20) CHECK (status IN ('saved', 'applied', 'accepted', 'rejected')) DEFAULT 'saved',
  saved_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_saved_scholarship UNIQUE(user_id, scholarship_id)
);

CREATE INDEX idx_saved_scholarships_user ON saved_scholarships(user_id);
CREATE INDEX idx_saved_scholarships_scholarship ON saved_scholarships(scholarship_id);
CREATE INDEX idx_saved_scholarships_status ON saved_scholarships(status);

-- ============================================================================
-- CONVERSATIONS TABLE - Chat conversations between users
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_id UUID,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT no_self_conversation CHECK (user1_id != user2_id),
  CONSTRAINT unique_conversation UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- ============================================================================
-- MESSAGES TABLE - Chat system
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT no_self_message CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================================================
-- RECIPES TABLE
-- ============================================================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  image VARCHAR(500),
  category VARCHAR(100),
  tips JSONB DEFAULT '[]',
  where_to_find_ingredients TEXT,
  rating_avg DECIMAL(3, 2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_rating ON recipes(rating_avg DESC);
CREATE INDEX idx_recipes_search ON recipes USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================================================
-- RECIPE RATINGS TABLE
-- ============================================================================
CREATE TABLE recipe_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_recipe_rating UNIQUE(recipe_id, user_id)
);

CREATE INDEX idx_recipe_ratings_recipe ON recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_ratings_user ON recipe_ratings(user_id);

-- ============================================================================
-- STUDY GROUPS TABLE
-- ============================================================================
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 10,
  is_online BOOLEAN DEFAULT TRUE,
  schedule VARCHAR(255),
  location VARCHAR(255),
  tags JSONB DEFAULT '[]',
  next_session TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_groups_creator ON study_groups(creator_id);
CREATE INDEX idx_study_groups_subject ON study_groups(subject);
CREATE INDEX idx_study_groups_online ON study_groups(is_online);
CREATE INDEX idx_study_groups_next_session ON study_groups(next_session);

-- ============================================================================
-- STUDY GROUP MEMBERS TABLE
-- ============================================================================
CREATE TABLE study_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_study_group_member UNIQUE(group_id, user_id)
);

CREATE INDEX idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX idx_study_group_members_user ON study_group_members(user_id);

-- ============================================================================
-- STUDY SESSIONS TABLE
-- ============================================================================
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  duration INTEGER, -- in minutes
  location VARCHAR(255),
  is_online BOOLEAN DEFAULT TRUE,
  attendees JSONB DEFAULT '[]', -- Array of user IDs
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_group ON study_sessions(group_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(date DESC);

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(20) CHECK (category IN ('meetup', 'party', 'cultural', 'academic', 'sports', 'workshop')) DEFAULT 'meetup',
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(500),
  is_online BOOLEAN DEFAULT FALSE,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image VARCHAR(500),
  max_attendees INTEGER,
  is_paid BOOLEAN DEFAULT FALSE,
  price DECIMAL(10, 2),
  tags JSONB DEFAULT '[]',
  university VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_date ON events(date ASC);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_university ON events(university);
CREATE INDEX idx_events_search ON events USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================================================
-- EVENT ATTENDEES TABLE
-- ============================================================================
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('attending', 'interested', 'not_attending')) DEFAULT 'interested',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_event_attendee UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);

-- ============================================================================
-- MENTOR PROFILES TABLE
-- ============================================================================
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  is_mentor BOOLEAN DEFAULT FALSE,
  expertise JSONB DEFAULT '[]',
  availability VARCHAR(255),
  max_mentees INTEGER DEFAULT 5,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mentor_profiles_user ON mentor_profiles(user_id);
CREATE INDEX idx_mentor_profiles_active ON mentor_profiles(is_mentor) WHERE is_mentor = TRUE;
CREATE INDEX idx_mentor_profiles_rating ON mentor_profiles(rating DESC);

-- ============================================================================
-- MENTORSHIP REQUESTS TABLE
-- ============================================================================
CREATE TABLE mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  message TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  CONSTRAINT no_self_mentorship CHECK (mentee_id != mentor_id)
);

CREATE INDEX idx_mentorship_requests_mentee ON mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_requests_mentor ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_status ON mentorship_requests(status);

-- ============================================================================
-- ALUMNI PROFILES TABLE
-- ============================================================================
CREATE TABLE alumni_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  graduation_year INTEGER NOT NULL,
  degree VARCHAR(255) NOT NULL,
  current_company VARCHAR(255),
  current_position VARCHAR(255),
  location VARCHAR(255),
  expertise JSONB DEFAULT '[]',
  willing_to_mentor BOOLEAN DEFAULT FALSE,
  career_path JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  linkedin VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alumni_profiles_user ON alumni_profiles(user_id);
CREATE INDEX idx_alumni_profiles_year ON alumni_profiles(graduation_year);
CREATE INDEX idx_alumni_profiles_company ON alumni_profiles(current_company);
CREATE INDEX idx_alumni_profiles_willing_mentor ON alumni_profiles(willing_to_mentor) WHERE willing_to_mentor = TRUE;

-- ============================================================================
-- UNIVERSITY PARTNERS TABLE
-- ============================================================================
CREATE TABLE university_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  logo VARCHAR(500),
  description TEXT,
  website VARCHAR(500),
  tier VARCHAR(20) CHECK (tier IN ('basic', 'featured', 'premium')) DEFAULT 'basic',
  
  -- Subscription
  subscription_start_date DATE,
  subscription_end_date DATE,
  monthly_fee DECIMAL(10, 2),
  
  -- Analytics
  profile_views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_university_partners_country ON university_partners(country);
CREATE INDEX idx_university_partners_tier ON university_partners(tier);

-- ============================================================================
-- UNIVERSITY PROGRAMS TABLE
-- ============================================================================
CREATE TABLE university_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES university_partners(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level VARCHAR(20) CHECK (level IN ('undergraduate', 'postgraduate', 'phd')),
  field VARCHAR(255),
  duration VARCHAR(100),
  fees VARCHAR(100),
  scholarships_available BOOLEAN DEFAULT FALSE,
  application_deadline DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_university_programs_university ON university_programs(university_id);
CREATE INDEX idx_university_programs_level ON university_programs(level);
CREATE INDEX idx_university_programs_field ON university_programs(field);

-- ============================================================================
-- UNIVERSITY INQUIRIES TABLE
-- ============================================================================
CREATE TABLE university_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES university_partners(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES university_programs(id) ON DELETE SET NULL,
  message TEXT,
  status VARCHAR(20) CHECK (status IN ('new', 'contacted', 'enrolled', 'declined')) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_university_inquiries_university ON university_inquiries(university_id);
CREATE INDEX idx_university_inquiries_student ON university_inquiries(student_id);
CREATE INDEX idx_university_inquiries_status ON university_inquiries(status);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) CHECK (tier IN ('free', 'premium', 'scholar-plus')) DEFAULT 'free',
  status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')) DEFAULT 'active',
  
  -- Payment provider details
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  ecocash_subscriber_id VARCHAR(255),
  
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  method VARCHAR(20) CHECK (method IN ('stripe', 'ecocash', 'onemoney', 'paypal')),
  description TEXT,
  
  -- Payment provider references
  stripe_payment_intent_id VARCHAR(255),
  ecocash_reference VARCHAR(255),
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_method ON transactions(method);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================================
-- STORIES TABLE
-- ============================================================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  image VARCHAR(500),
  background_color VARCHAR(20),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_stories_user ON stories(user_id);
CREATE INDEX idx_stories_expires ON stories(expires_at);
CREATE INDEX idx_stories_created ON stories(created_at DESC);

-- ============================================================================
-- STORY VIEWS TABLE
-- ============================================================================
CREATE TABLE story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_story_view UNIQUE(story_id, viewer_id)
);

CREATE INDEX idx_story_views_story ON story_views(story_id);
CREATE INDEX idx_story_views_viewer ON story_views(viewer_id);

-- ============================================================================
-- VIDEO CALL SESSIONS TABLE
-- ============================================================================
CREATE TABLE video_call_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id VARCHAR(255) NOT NULL UNIQUE,
  participants JSONB DEFAULT '[]', -- Array of user IDs
  initiator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  type VARCHAR(10) CHECK (type IN ('audio', 'video')) DEFAULT 'video',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_video_calls_initiator ON video_call_sessions(initiator_id);
CREATE INDEX idx_video_calls_active ON video_call_sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_video_calls_created ON video_call_sessions(created_at DESC);

-- ============================================================================
-- CULTURAL CONTENT TABLES
-- ============================================================================

CREATE TABLE cultural_music (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  description TEXT,
  genre VARCHAR(100),
  image VARCHAR(500),
  spotify_link VARCHAR(500),
  cultural_significance TEXT,
  country VARCHAR(100) DEFAULT 'Zimbabwe',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cultural_art (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  description TEXT,
  image VARCHAR(500),
  category VARCHAR(100),
  cultural_info TEXT,
  country VARCHAR(100) DEFAULT 'Zimbabwe',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cultural_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  date VARCHAR(100),
  description TEXT,
  traditions JSONB DEFAULT '[]',
  image VARCHAR(500),
  country VARCHAR(100) DEFAULT 'Zimbabwe',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proverbs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original VARCHAR(500),
  language VARCHAR(50) DEFAULT 'Shona',
  english VARCHAR(500) NOT NULL,
  meaning TEXT NOT NULL,
  usage TEXT,
  country VARCHAR(100) DEFAULT 'Zimbabwe',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cultural_music_country ON cultural_music(country);
CREATE INDEX idx_cultural_art_country ON cultural_art(country);
CREATE INDEX idx_cultural_events_country ON cultural_events(country);
CREATE INDEX idx_proverbs_country ON proverbs(country);

-- ============================================================================
-- TRIGGERS - Auto-update timestamps
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_mentor_profiles_updated_at BEFORE UPDATE ON mentor_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_mentorship_requests_updated_at BEFORE UPDATE ON mentorship_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_alumni_profiles_updated_at BEFORE UPDATE ON alumni_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS - Auto-increment counters
-- ============================================================================

-- Update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_members_count 
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes 
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_likes 
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Update post comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments 
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Update story views count
CREATE OR REPLACE FUNCTION update_story_views_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE stories SET views_count = views_count + 1 WHERE id = NEW.story_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_story_views 
AFTER INSERT ON story_views
FOR EACH ROW EXECUTE FUNCTION update_story_views_count();

-- ============================================================================
-- VIEWS - Convenient queries
-- ============================================================================

-- Active stories (not expired)
CREATE VIEW active_stories AS
SELECT s.*, u.name as user_name, u.profile_image as user_image
FROM stories s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;

-- Active subscriptions
CREATE VIEW active_subscriptions AS
SELECT s.*, u.name, u.email
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active' AND (s.end_date IS NULL OR s.end_date > NOW());

-- Upcoming events
CREATE VIEW upcoming_events AS
SELECT e.*, u.name as organizer_name, u.profile_image as organizer_image
FROM events e
JOIN users u ON e.organizer_id = u.id
WHERE e.date >= CURRENT_DATE
ORDER BY e.date ASC, e.time ASC;

-- Popular communities
CREATE VIEW popular_communities AS
SELECT c.*, u.name as admin_name,
       (SELECT COUNT(*) FROM posts WHERE community_id = c.id) as post_count
FROM communities c
JOIN users u ON c.admin_id = u.id
ORDER BY c.member_count DESC;

-- ============================================================================
-- FUNCTIONS - Helper functions
-- ============================================================================

-- Get conversation messages between two users
CREATE OR REPLACE FUNCTION get_conversation_messages(
  user1_id UUID,
  user2_id UUID,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  receiver_id UUID,
  content TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.sender_id, m.receiver_id, m.content, m.is_read, m.created_at
  FROM messages m
  WHERE (m.sender_id = user1_id AND m.receiver_id = user2_id)
     OR (m.sender_id = user2_id AND m.receiver_id = user1_id)
  ORDER BY m.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get user's matches (mutual swipes)
CREATE OR REPLACE FUNCTION get_user_matches(user_uuid UUID)
RETURNS TABLE (
  matched_user_id UUID,
  matched_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT c1.target_user_id, c1.created_at
  FROM connections c1
  WHERE c1.user_id = user_uuid
    AND c1.status = 'matched'
    AND EXISTS (
      SELECT 1 FROM connections c2
      WHERE c2.user_id = c1.target_user_id
        AND c2.target_user_id = user_uuid
        AND c2.status = 'matched'
    );
END;
$$ LANGUAGE plpgsql;

-- Clean up expired stories (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM stories WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA - Admin user and sample data
-- ============================================================================

-- Insert default admin user (password: Admin123!)
-- Password hash for 'Admin123!' using bcrypt
INSERT INTO users (
  email, 
  password_hash, 
  name, 
  university,
  field_of_study,
  country,
  city,
  bio,
  is_email_verified,
  subscription_tier
) VALUES (
  'admin@scholarapp.com',
  '$2b$10$rZK8qJKYQXfJxAKZP5p5HO9kZnKZBjlKZqJKYQXfJxAKZP5p5HO9k', -- Admin123!
  'Scholar Admin',
  'University of Zimbabwe',
  'Computer Science',
  'Zimbabwe',
  'Harare',
  'Platform Administrator',
  TRUE,
  'scholar-plus'
);

-- ============================================================================
-- PERFORMANCE TUNING RECOMMENDATIONS
-- ============================================================================

-- Enable query statistics
-- ALTER DATABASE scholar SET log_statement = 'all';
-- ALTER DATABASE scholar SET log_duration = on;

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE communities;
ANALYZE posts;
ANALYZE messages;
ANALYZE scholarships;

-- ============================================================================
-- BACKUP & MAINTENANCE
-- ============================================================================

-- To backup database:
-- pg_dump -U admin -d Scholar -F c -f scholar_backup.dump

-- To restore database:
-- pg_restore -U admin -d Scholar -c scholar_backup.dump

-- ============================================================================
-- SCHEMA VERSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_version (version, description) 
VALUES (1, 'Initial schema creation with all core tables')
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
