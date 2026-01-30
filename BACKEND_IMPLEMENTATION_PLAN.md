# 🚀 Scholar Backend Implementation Plan

## 📋 Executive Summary

This document provides a comprehensive roadmap for implementing a production-ready backend for the Scholar Zimbabwean Student Social Network. The backend will support all existing features including authentication, real-time chat, communities, scholarships, events, mentorship, payments, and more.

---

## 🎯 Project Overview

### Current State
- ✅ Complete React TypeScript frontend
- ✅ 15+ features implemented (mock data)
- ✅ Payment UI (Stripe, EcoCash)
- ✅ Real-time features (mock)
- ⚠️ All data is currently mock/localStorage

### Goal State
- ✅ Production-ready backend API
- ✅ Real database with relationships
- ✅ Real-time capabilities (WebSocket/SSE)
- ✅ Authentication & authorization
- ✅ Payment processing integration
- ✅ File storage & CDN
- ✅ Email/SMS notifications
- ✅ Analytics & monitoring

---

## 🗺️ Backend Architecture Mind Map

```
SCHOLAR BACKEND
│
├── 🔐 AUTHENTICATION & AUTHORIZATION
│   ├── User Registration/Login
│   ├── OAuth (Google, Facebook)
│   ├── JWT Token Management
│   ├── Password Reset Flow
│   ├── Email Verification
│   ├── Role-Based Access Control (RBAC)
│   └── Session Management
│
├── 👥 USER MANAGEMENT
│   ├── Profile CRUD
│   ├── Profile Images (upload/storage)
│   ├── User Discovery/Matching Algorithm
│   ├── Connection Management (swipe system)
│   ├── User Search & Filters
│   └── Privacy Settings
│
├── 💬 REAL-TIME COMMUNICATION
│   ├── Chat System (1-on-1)
│   │   ├── WebSocket Server
│   │   ├── Message Storage
│   │   ├── Read Receipts
│   │   ├── Typing Indicators
│   │   └── Message History
│   ├── Study Groups Chat
│   ├── Video/Audio Calls (WebRTC)
│   └── Online Presence
│
├── 🏘️ COMMUNITIES
│   ├── Community CRUD
│   ├── Member Management
│   ├── Posts & Comments
│   ├── Community Verification
│   ├── Moderation Tools
│   ├── File/Image Uploads
│   └── Community Analytics
│
├── 🎓 SCHOLARSHIPS
│   ├── Scholarship CRUD (Admin)
│   ├── Search & Filtering
│   ├── AI Matching Algorithm
│   ├── Application Tracking
│   ├── Saved Scholarships
│   ├── Deadline Notifications
│   └── Premium Features
│
├── 📅 EVENTS
│   ├── Event CRUD
│   ├── RSVP Management
│   ├── Calendar Integration
│   ├── Event Reminders
│   └── Event Analytics
│
├── 🧑‍🏫 MENTORSHIP
│   ├── Mentor Profiles
│   ├── Matching System
│   ├── Request Management
│   ├── Session Scheduling
│   ├── Rating & Reviews
│   └── Progress Tracking
│
├── 🎓 ALUMNI NETWORK
│   ├── Alumni Profiles
│   ├── Company Database
│   ├── Career Path Tracking
│   └── Networking Events
│
├── 🍲 RECIPES & CULTURE
│   ├── Recipe CRUD
│   ├── Image Upload
│   ├── Categories & Tags
│   ├── Ratings & Reviews
│   └── Ingredient Database
│
├── 📖 STORIES
│   ├── Story Creation/Upload
│   ├── 24-hour Auto-Delete
│   ├── View Tracking
│   └── Story Analytics
│
├── 💳 PAYMENTS & SUBSCRIPTIONS
│   ├── Stripe Integration
│   ├── EcoCash Integration
│   ├── Subscription Management
│   ├── Transaction History
│   ├── Invoicing
│   ├── Refunds
│   └── Revenue Analytics
│
├── 🔔 NOTIFICATIONS
│   ├── In-App Notifications
│   ├── Email Notifications
│   ├── SMS (Africa-focused)
│   ├── Push Notifications (PWA)
│   └── Notification Preferences
│
├── 📊 ANALYTICS
│   ├── User Behavior Tracking
│   ├── Feature Usage Stats
│   ├── Engagement Metrics
│   ├── Revenue Analytics
│   └── Custom Dashboards
│
├── 🔍 SEARCH
│   ├── Full-Text Search
│   ├── Elasticsearch/Algolia
│   ├── Smart Filters
│   └── Search Suggestions
│
├── 📁 FILE STORAGE
│   ├── Image Upload/Optimization
│   ├── Video Storage
│   ├── Document Storage
│   ├── CDN Integration
│   └── File Validation
│
├── 🏢 UNIVERSITY PARTNERSHIPS
│   ├── University Profiles
│   ├── Analytics Dashboard
│   ├── Featured Listings
│   └── Recruitment Tools
│
└── 🛡️ INFRASTRUCTURE
    ├── API Rate Limiting
    ├── Caching Strategy
    ├── Error Logging
    ├── Monitoring & Alerts
    ├── Backup & Recovery
    ├── CI/CD Pipeline
    └── Security Hardening
```

---

## 🛠️ Technology Stack Recommendations

### Option 1: Firebase (⭐ RECOMMENDED for MVP)

**Why Firebase?**
- ✅ Fastest time to market (2-4 weeks)
- ✅ Built-in real-time database
- ✅ Authentication out-of-box
- ✅ Automatic scaling
- ✅ Generous free tier
- ✅ Good for mobile apps (future)

**Stack:**
```
Frontend: React TypeScript (existing)
Backend: Firebase
├── Authentication: Firebase Auth
├── Database: Firestore
├── Real-time: Firestore + Firebase Realtime Database
├── Storage: Firebase Storage
├── Functions: Cloud Functions (Node.js/TypeScript)
├── Hosting: Firebase Hosting
└── Analytics: Firebase Analytics
```

**Pros:**
- No server management
- Real-time by default
- Excellent documentation
- Fast development
- Mobile SDK ready

**Cons:**
- Vendor lock-in
- More expensive at scale
- Limited complex queries
- Less control

**Cost Estimate:**
- **Free tier:** 0-1000 users
- **Blaze plan:** $50-200/month (1000-5000 users)
- **Enterprise:** $500+/month (10000+ users)

---

### Option 2: Supabase (⭐ RECOMMENDED for Long-term)

**Why Supabase?**
- ✅ Open source
- ✅ PostgreSQL (powerful queries)
- ✅ Built-in real-time
- ✅ Easy migration path
- ✅ Self-hostable
- ✅ Better pricing at scale

**Stack:**
```
Frontend: React TypeScript (existing)
Backend: Supabase
├── Authentication: Supabase Auth
├── Database: PostgreSQL
├── Real-time: Supabase Realtime
├── Storage: Supabase Storage
├── Edge Functions: Deno
└── API: Auto-generated REST & GraphQL
```

**Pros:**
- SQL database (complex queries)
- No vendor lock-in
- Better cost at scale
- Row-level security
- Open source

**Cons:**
- Newer platform
- Smaller community
- Fewer integrations

**Cost Estimate:**
- **Free tier:** 0-500 users
- **Pro plan:** $25/month (unlimited users)
- **Enterprise:** Custom pricing

---

### Option 3: Custom Node.js Backend (Best for Full Control)

**Stack:**
```
Frontend: React TypeScript (existing)
Backend: Node.js + Express/Fastify
├── Authentication: Passport.js + JWT
├── Database: PostgreSQL
├── ORM: Prisma/TypeORM
├── Real-time: Socket.io
├── Cache: Redis
├── Queue: Bull/BullMQ
├── Storage: AWS S3/Cloudinary
├── Email: SendGrid/Resend
├── SMS: Twilio/Africa's Talking
├── Search: Elasticsearch/Meilisearch
└── Hosting: Railway/Render/Digital Ocean
```

**Pros:**
- Full control
- Best performance potential
- Custom business logic
- Technology flexibility

**Cons:**
- Longer development (2-3 months)
- More maintenance
- DevOps required
- Higher initial cost

**Cost Estimate:**
- **Development:** $5000-15000 (if outsourced)
- **Monthly:** $50-200 (hosting + services)

---

## 📊 Feature Priority Matrix

### Phase 1: MVP (4-6 weeks) 🚀
**Goal:** Get to production with core features

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Authentication | CRITICAL | Medium | High |
| User Profiles | CRITICAL | Low | High |
| Student Discovery | HIGH | Medium | High |
| Basic Chat | HIGH | High | High |
| Communities | HIGH | Medium | High |
| Scholarships | HIGH | Low | High |
| File Upload | MEDIUM | Medium | Medium |
| Notifications | MEDIUM | Medium | Medium |

### Phase 2: Growth (6-8 weeks) 📈
**Goal:** Increase engagement & retention

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Real-time Chat | HIGH | High | High |
| Study Groups | MEDIUM | Medium | High |
| Events | MEDIUM | Low | Medium |
| Stories | MEDIUM | Medium | Medium |
| Search | HIGH | Medium | High |
| Mobile Optimization | HIGH | Low | High |

### Phase 3: Monetization (8-12 weeks) 💰
**Goal:** Generate revenue

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Stripe Payments | HIGH | Medium | High |
| EcoCash Integration | HIGH | High | High |
| Subscriptions | HIGH | Medium | High |
| Premium Scholarships | MEDIUM | Low | High |
| University Dashboard | MEDIUM | Medium | Medium |
| Analytics | HIGH | Medium | High |

### Phase 4: Scale (12+ weeks) 🚀
**Goal:** Expand & optimize

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Mentorship | MEDIUM | Medium | Medium |
| Alumni Network | LOW | Low | Medium |
| Video Calls | LOW | High | Medium |
| AI Matching | MEDIUM | High | High |
| Advanced Analytics | MEDIUM | High | Medium |

---

## 🗄️ Database Schema Design

### Core Entities & Relationships

```sql
-- USERS TABLE
users {
  id: UUID PRIMARY KEY
  email: VARCHAR(255) UNIQUE NOT NULL
  password_hash: VARCHAR(255)
  name: VARCHAR(255) NOT NULL
  profile_image: VARCHAR(500)
  university: VARCHAR(255)
  field_of_study: VARCHAR(255)
  country: VARCHAR(100)
  city: VARCHAR(100)
  bio: TEXT
  connection_type: ENUM('friendship', 'mentorship', 'study-buddy')
  interests: JSONB
  years_of_study: INTEGER
  is_verified: BOOLEAN DEFAULT false
  subscription_tier: ENUM('free', 'premium', 'scholar-plus')
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  last_seen: TIMESTAMP
}

-- CONNECTIONS TABLE (Discovery swipes)
connections {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  target_user_id: UUID FOREIGN KEY -> users.id
  status: ENUM('pending', 'matched', 'passed', 'blocked')
  created_at: TIMESTAMP
  UNIQUE(user_id, target_user_id)
}

-- COMMUNITIES TABLE
communities {
  id: UUID PRIMARY KEY
  name: VARCHAR(255) NOT NULL
  description: TEXT
  category: ENUM('country', 'university', 'field', 'culture', 'other')
  image: VARCHAR(500)
  admin_id: UUID FOREIGN KEY -> users.id
  is_verified: BOOLEAN DEFAULT false
  verification_status: ENUM('none', 'pending', 'approved', 'rejected')
  member_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- COMMUNITY MEMBERS TABLE
community_members {
  id: UUID PRIMARY KEY
  community_id: UUID FOREIGN KEY -> communities.id
  user_id: UUID FOREIGN KEY -> users.id
  role: ENUM('admin', 'moderator', 'member')
  joined_at: TIMESTAMP
  UNIQUE(community_id, user_id)
}

-- POSTS TABLE
posts {
  id: UUID PRIMARY KEY
  author_id: UUID FOREIGN KEY -> users.id
  community_id: UUID FOREIGN KEY -> communities.id (nullable)
  content: TEXT NOT NULL
  images: JSONB
  type: ENUM('announcement', 'question', 'share', 'event')
  is_pinned: BOOLEAN DEFAULT false
  likes_count: INTEGER DEFAULT 0
  comments_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- COMMENTS TABLE
comments {
  id: UUID PRIMARY KEY
  post_id: UUID FOREIGN KEY -> posts.id
  author_id: UUID FOREIGN KEY -> users.id
  content: TEXT NOT NULL
  likes_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- SCHOLARSHIPS TABLE
scholarships {
  id: UUID PRIMARY KEY
  title: VARCHAR(500) NOT NULL
  description: TEXT
  organization: VARCHAR(255)
  country: VARCHAR(100)
  university: VARCHAR(255)
  field_of_study: JSONB
  deadline: DATE
  amount: VARCHAR(100)
  link: VARCHAR(1000)
  is_verified: BOOLEAN DEFAULT false
  is_premium: BOOLEAN DEFAULT false
  type: ENUM('full', 'partial', 'grant')
  level: ENUM('undergraduate', 'postgraduate', 'phd')
  requirements: JSONB
  eligibility: JSONB
  competitiveness: ENUM('low', 'medium', 'high')
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- SAVED SCHOLARSHIPS TABLE
saved_scholarships {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  scholarship_id: UUID FOREIGN KEY -> scholarships.id
  notes: TEXT
  status: ENUM('saved', 'applied', 'accepted', 'rejected')
  saved_at: TIMESTAMP
  UNIQUE(user_id, scholarship_id)
}

-- MESSAGES TABLE
messages {
  id: UUID PRIMARY KEY
  sender_id: UUID FOREIGN KEY -> users.id
  receiver_id: UUID FOREIGN KEY -> users.id
  content: TEXT NOT NULL
  is_read: BOOLEAN DEFAULT false
  created_at: TIMESTAMP
  INDEX(sender_id, receiver_id, created_at)
}

-- STUDY GROUPS TABLE
study_groups {
  id: UUID PRIMARY KEY
  name: VARCHAR(255) NOT NULL
  subject: VARCHAR(255)
  description: TEXT
  creator_id: UUID FOREIGN KEY -> users.id
  max_members: INTEGER DEFAULT 10
  is_online: BOOLEAN DEFAULT true
  schedule: VARCHAR(255)
  location: VARCHAR(255)
  tags: JSONB
  next_session: TIMESTAMP
  created_at: TIMESTAMP
}

-- STUDY GROUP MEMBERS TABLE
study_group_members {
  id: UUID PRIMARY KEY
  group_id: UUID FOREIGN KEY -> study_groups.id
  user_id: UUID FOREIGN KEY -> users.id
  joined_at: TIMESTAMP
  UNIQUE(group_id, user_id)
}

-- EVENTS TABLE
events {
  id: UUID PRIMARY KEY
  title: VARCHAR(500) NOT NULL
  description: TEXT
  category: ENUM('meetup', 'party', 'cultural', 'academic', 'sports', 'workshop')
  date: DATE NOT NULL
  time: TIME NOT NULL
  location: VARCHAR(500)
  is_online: BOOLEAN DEFAULT false
  organizer_id: UUID FOREIGN KEY -> users.id
  image: VARCHAR(500)
  max_attendees: INTEGER
  is_paid: BOOLEAN DEFAULT false
  price: DECIMAL(10, 2)
  tags: JSONB
  university: VARCHAR(255)
  created_at: TIMESTAMP
}

-- EVENT ATTENDEES TABLE
event_attendees {
  id: UUID PRIMARY KEY
  event_id: UUID FOREIGN KEY -> events.id
  user_id: UUID FOREIGN KEY -> users.id
  status: ENUM('attending', 'interested', 'not_attending')
  created_at: TIMESTAMP
  UNIQUE(event_id, user_id)
}

-- MENTORSHIP TABLE
mentorships {
  id: UUID PRIMARY KEY
  mentor_id: UUID FOREIGN KEY -> users.id
  mentee_id: UUID FOREIGN KEY -> users.id
  status: ENUM('pending', 'active', 'completed', 'cancelled')
  expertise: JSONB
  message: TEXT
  rating: INTEGER
  review: TEXT
  created_at: TIMESTAMP
  completed_at: TIMESTAMP
}

-- STORIES TABLE
stories {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  content: TEXT
  image: VARCHAR(500)
  background_color: VARCHAR(20)
  views_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  expires_at: TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
  INDEX(expires_at) -- For auto-deletion
}

-- STORY VIEWS TABLE
story_views {
  id: UUID PRIMARY KEY
  story_id: UUID FOREIGN KEY -> stories.id
  viewer_id: UUID FOREIGN KEY -> users.id
  viewed_at: TIMESTAMP
  UNIQUE(story_id, viewer_id)
}

-- RECIPES TABLE
recipes {
  id: UUID PRIMARY KEY
  author_id: UUID FOREIGN KEY -> users.id
  title: VARCHAR(500) NOT NULL
  description: TEXT
  ingredients: JSONB NOT NULL
  instructions: JSONB NOT NULL
  prep_time: INTEGER
  cook_time: INTEGER
  servings: INTEGER
  image: VARCHAR(500)
  category: VARCHAR(100)
  tips: JSONB
  where_to_find_ingredients: TEXT
  rating_avg: DECIMAL(3, 2)
  rating_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
}

-- SUBSCRIPTIONS TABLE
subscriptions {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  tier: ENUM('free', 'premium', 'scholar-plus')
  status: ENUM('active', 'cancelled', 'expired', 'past_due')
  stripe_customer_id: VARCHAR(255)
  stripe_subscription_id: VARCHAR(255)
  start_date: TIMESTAMP
  end_date: TIMESTAMP
  auto_renew: BOOLEAN DEFAULT true
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- TRANSACTIONS TABLE
transactions {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  amount: DECIMAL(10, 2) NOT NULL
  currency: VARCHAR(10) DEFAULT 'USD'
  status: ENUM('pending', 'completed', 'failed', 'refunded')
  method: ENUM('stripe', 'ecocash', 'onemoney', 'paypal')
  description: TEXT
  stripe_payment_intent_id: VARCHAR(255)
  ecocash_reference: VARCHAR(255)
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- NOTIFICATIONS TABLE
notifications {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  type: ENUM('message', 'match', 'community', 'scholarship', 'event', 'mentorship')
  title: VARCHAR(255) NOT NULL
  content: TEXT
  link: VARCHAR(500)
  is_read: BOOLEAN DEFAULT false
  created_at: TIMESTAMP
  INDEX(user_id, is_read, created_at)
}

-- ALUMNI PROFILES TABLE
alumni_profiles {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY -> users.id
  graduation_year: INTEGER
  degree: VARCHAR(255)
  current_company: VARCHAR(255)
  current_position: VARCHAR(255)
  location: VARCHAR(255)
  expertise: JSONB
  willing_to_mentor: BOOLEAN DEFAULT false
  career_path: JSONB
  achievements: JSONB
  linkedin: VARCHAR(500)
  created_at: TIMESTAMP
}
```

### Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country_city ON users(country, city);
CREATE INDEX idx_users_university ON users(university);

-- Connections
CREATE INDEX idx_connections_user_target ON connections(user_id, target_user_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Communities
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_community_members_user ON community_members(user_id);

-- Posts
CREATE INDEX idx_posts_community_created ON posts(community_id, created_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);

-- Messages
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id, created_at);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read);

-- Scholarships
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_country ON scholarships(country);

-- Full-text search
CREATE INDEX idx_scholarships_fulltext ON scholarships USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_posts_fulltext ON posts USING GIN(to_tsvector('english', content));
```

---

## 🔐 Authentication & Security Implementation

### Authentication Flow

```typescript
// Registration Flow
1. User submits: email, password, name, university, etc.
2. Validate input (Zod schema)
3. Check email uniqueness
4. Hash password (bcrypt/argon2)
5. Create user record
6. Send verification email
7. Return JWT token (short-lived: 15min)
8. Return refresh token (long-lived: 7 days)

// Login Flow
1. User submits: email, password
2. Find user by email
3. Verify password hash
4. Check if email verified
5. Generate JWT + refresh token
6. Update last_seen timestamp
7. Return tokens + user data

// OAuth Flow (Google/Facebook)
1. Redirect to OAuth provider
2. Receive OAuth callback
3. Exchange code for token
4. Fetch user profile
5. Find or create user
6. Generate JWT + refresh token
7. Return tokens + user data
```

### JWT Token Structure

```typescript
// Access Token (15 minutes)
{
  sub: userId,
  email: user.email,
  role: user.role,
  subscription: user.subscriptionTier,
  exp: timestamp + 15min,
  iat: timestamp
}

// Refresh Token (7 days)
{
  sub: userId,
  type: 'refresh',
  exp: timestamp + 7days,
  iat: timestamp
}
```

### Security Best Practices

```typescript
✅ Password Requirements:
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase
- At least 1 number
- At least 1 special character

✅ Rate Limiting:
- Login attempts: 5 per 15 minutes
- API requests: 100 per minute
- File uploads: 10 per hour

✅ Input Validation:
- Zod schemas on all inputs
- Sanitize HTML content
- Validate file types/sizes

✅ API Security:
- JWT verification middleware
- Role-based access control
- Request signing for payments
- CORS configuration
- HTTPS only

✅ Data Protection:
- Password hashing (bcrypt cost 12)
- PII encryption at rest
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitization)
- CSRF tokens
```

---

## 💬 Real-time Communication Architecture

### Option 1: WebSocket (Socket.io)

```typescript
// Server Setup
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.sub;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Events
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join user's personal room
  socket.join(`user:${socket.userId}`);
  
  // Update online status
  updateUserOnlineStatus(socket.userId, true);
  
  // Handle sending messages
  socket.on('send_message', async (data) => {
    const message = await saveMessage({
      senderId: socket.userId,
      receiverId: data.receiverId,
      content: data.content
    });
    
    // Send to receiver
    io.to(`user:${data.receiverId}`).emit('new_message', message);
    
    // Send confirmation to sender
    socket.emit('message_sent', message);
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    io.to(`user:${data.receiverId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: true
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    updateUserOnlineStatus(socket.userId, false);
  });
});
```

### Option 2: Server-Sent Events (SSE)

```typescript
// Lighter alternative for one-way real-time updates
app.get('/api/notifications/stream', authenticateJWT, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const userId = req.user.id;
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  
  // Set up notification listener
  const listener = (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };
  
  notificationEmitter.on(`user:${userId}`, listener);
  
  // Clean up on close
  req.on('close', () => {
    notificationEmitter.off(`user:${userId}`, listener);
  });
});
```

---

## 💳 Payment Integration

### Stripe Integration

```typescript
// Initialize Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create subscription
async function createSubscription(userId: string, priceId: string) {
  // Get or create customer
  const user = await getUser(userId);
  let customerId = user.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId }
    });
    customerId = customer.id;
    await updateUser(userId, { stripeCustomerId: customerId });
  }
  
  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
  
  return {
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret
  };
}

// Webhook handler
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle events
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
  }
  
  res.json({ received: true });
});
```

### EcoCash Integration

```typescript
// EcoCash Payment API Integration
async function initiateEcoCashPayment(data: {
  amount: number;
  phoneNumber: string;
  reference: string;
}) {
  // EcoCash API endpoint
  const response = await fetch('https://api.ecocash.co.zw/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ECOCASH_API_KEY}`
    },
    body: JSON.stringify({
      amount: data.amount,
      currency: 'USD',
      phoneNumber: data.phoneNumber,
      merchantReference: data.reference,
      callbackUrl: `${process.env.API_URL}/webhooks/ecocash`
    })
  });
  
  const result = await response.json();
  
  // Save transaction
  await createTransaction({
    reference: data.reference,
    method: 'ecocash',
    status: 'pending',
    amount: data.amount,
    ecocashTransactionId: result.transactionId
  });
  
  return result;
}

// EcoCash Webhook
app.post('/webhooks/ecocash', async (req, res) => {
  const { transactionId, status, reference } = req.body;
  
  // Verify webhook signature
  if (!verifyEcoCashSignature(req)) {
    return res.status(400).send('Invalid signature');
  }
  
  // Update transaction
  await updateTransaction(reference, {
    status: status === 'success' ? 'completed' : 'failed',
    ecocashTransactionId: transactionId
  });
  
  if (status === 'success') {
    await activateSubscription(reference);
  }
  
  res.json({ success: true });
});
```

---

## 📧 Notification System

### Email Notifications (Resend/SendGrid)

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const emailTemplates = {
  welcome: (user) => ({
    subject: 'Welcome to Scholar! 🎓',
    html: `
      <h1>Welcome ${user.name}!</h1>
      <p>We're excited to have you join the Zimbabwean student community...</p>
    `
  }),
  
  newMatch: (user, match) => ({
    subject: 'You have a new connection! 🤝',
    html: `
      <h1>New Connection</h1>
      <p>${match.name} wants to connect with you!</p>
    `
  }),
  
  scholarshipDeadline: (scholarship) => ({
    subject: `Reminder: ${scholarship.title} deadline approaching`,
    html: `
      <h1>Scholarship Deadline Reminder</h1>
      <p>The deadline for ${scholarship.title} is in 7 days!</p>
    `
  })
};

// Send email function
async function sendEmail(to: string, template: string, data: any) {
  const { subject, html } = emailTemplates[template](data);
  
  await resend.emails.send({
    from: 'Scholar <noreply@scholarapp.com>',
    to,
    subject,
    html
  });
}
```

### SMS Notifications (Africa's Talking)

```typescript
import AfricasTalking from 'africas-talking';

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africastalking.SMS;

async function sendSMS(phoneNumber: string, message: string) {
  try {
    const result = await sms.send({
      to: [phoneNumber],
      message,
      from: 'Scholar'
    });
    console.log('SMS sent:', result);
  } catch (error) {
    console.error('SMS error:', error);
  }
}

// Example usage
await sendSMS('+263771234567', 'You have a new message on Scholar!');
```

---

## 🔍 Search Implementation

### Option 1: PostgreSQL Full-Text Search

```typescript
// Create search function
async function searchScholarships(query: string, filters: any) {
  const sql = `
    SELECT *, 
           ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
    FROM scholarships
    WHERE search_vector @@ plainto_tsquery('english', $1)
    ${filters.country ? 'AND country = $2' : ''}
    ${filters.fieldOfStudy ? 'AND field_of_study ? $3' : ''}
    ORDER BY rank DESC, deadline ASC
    LIMIT 50
  `;
  
  return await db.query(sql, [query, filters.country, filters.fieldOfStudy]);
}

// Create search index
CREATE INDEX idx_scholarships_search 
ON scholarships 
USING GIN(to_tsvector('english', title || ' ' || description));
```

### Option 2: Elasticsearch (Better for large scale)

```typescript
import { Client } from '@elastic/elasticsearch';
const es = new Client({ node: process.env.ELASTICSEARCH_URL });

// Index scholarship
async function indexScholarship(scholarship: Scholarship) {
  await es.index({
    index: 'scholarships',
    id: scholarship.id,
    document: {
      title: scholarship.title,
      description: scholarship.description,
      country: scholarship.country,
      fieldOfStudy: scholarship.fieldOfStudy,
      deadline: scholarship.deadline,
      organization: scholarship.organization
    }
  });
}

// Search scholarships
async function searchScholarships(query: string, filters: any) {
  const { body } = await es.search({
    index: 'scholarships',
    body: {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'description^2', 'organization'],
                fuzziness: 'AUTO'
              }
            }
          ],
          filter: [
            filters.country && { term: { country: filters.country } },
            filters.fieldOfStudy && { term: { fieldOfStudy: filters.fieldOfStudy } }
          ].filter(Boolean)
        }
      },
      sort: [
        { _score: 'desc' },
        { deadline: 'asc' }
      ]
    }
  });
  
  return body.hits.hits.map(hit => hit._source);
}
```

---

## 📁 File Storage Strategy

### Option 1: Cloudinary (⭐ Recommended)

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
async function uploadImage(file: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `scholar/${folder}`,
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    
    uploadStream.end(file);
  });
}

// Usage in API
app.post('/api/upload/profile', upload.single('image'), async (req, res) => {
  const imageUrl = await uploadImage(req.file.buffer, 'profiles');
  res.json({ url: imageUrl });
});
```

### Option 2: AWS S3

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function uploadToS3(file: Buffer, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  });
  
  await s3.send(command);
  
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
```

---

## 📊 Analytics & Monitoring

### Analytics Events to Track

```typescript
// User Events
- user_registered
- user_logged_in
- profile_completed
- profile_updated

// Discovery Events
- student_viewed
- student_swiped_right
- student_swiped_left
- match_created

// Community Events
- community_joined
- community_left
- post_created
- comment_created
- post_liked

// Scholarship Events
- scholarship_viewed
- scholarship_saved
- scholarship_applied
- scholarship_search

// Chat Events
- message_sent
- conversation_started
- video_call_initiated

// Payment Events
- subscription_started
- payment_completed
- payment_failed
- subscription_cancelled

// Engagement Metrics
- daily_active_users
- weekly_active_users
- monthly_active_users
- average_session_duration
- feature_usage_rate
```

### Implementation (Mixpanel/Amplitude)

```typescript
import Mixpanel from 'mixpanel';
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);

// Track event
function trackEvent(userId: string, event: string, properties?: any) {
  mixpanel.track(event, {
    distinct_id: userId,
    ...properties,
    timestamp: new Date()
  });
}

// Usage
trackEvent(userId, 'scholarship_saved', {
  scholarshipId: scholarship.id,
  scholarshipTitle: scholarship.title,
  country: scholarship.country
});

// Set user properties
mixpanel.people.set(userId, {
  $email: user.email,
  $name: user.name,
  university: user.university,
  subscription: user.subscriptionTier
});
```

---

## 🚀 Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────────────────────────────┐
│                     CLOUDFLARE CDN                       │
│                   (DNS + DDoS Protection)                │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
┌────────▼─────────┐   ┌────────▼─────────┐
│   VERCEL/NETLIFY │   │   BACKEND API    │
│   (Frontend)     │   │   (Railway/      │
│   React App      │   │    Render/       │
│                  │   │    Fly.io)       │
└──────────────────┘   └────────┬─────────┘
                                │
                     ┌──────────┴─────────┐
                     │                    │
            ┌────────▼────────┐  ┌────────▼────────┐
            │   SUPABASE/     │  │   CLOUDINARY    │
            │   FIREBASE      │  │   (Images)      │
            │   (Database +   │  │                 │
            │    Storage)     │  │                 │
            └─────────────────┘  └─────────────────┘
```

### Cost Breakdown (Monthly)

**Option 1: Lean Startup (0-1000 users)**
- Frontend (Vercel): $0 (hobby tier)
- Backend (Railway): $5
- Database (Supabase): $0 (free tier)
- Storage (Cloudinary): $0 (free tier)
- Email (Resend): $0 (free tier)
- **Total: $5/month**

**Option 2: Growth (1000-10000 users)**
- Frontend (Vercel): $20/month
- Backend (Railway): $50/month
- Database (Supabase Pro): $25/month
- Storage (Cloudinary): $99/month
- Email (Resend): $20/month
- Search (Meilisearch Cloud): $15/month
- Monitoring (Sentry): $26/month
- **Total: $255/month**

**Option 3: Scale (10000+ users)**
- Frontend (Vercel Pro): $20/month
- Backend (AWS ECS): $100/month
- Database (RDS PostgreSQL): $100/month
- Redis (ElastiCache): $50/month
- Storage (S3 + CloudFront): $100/month
- Email (SendGrid): $50/month
- Search (Elasticsearch): $100/month
- Monitoring (Datadog): $100/month
- **Total: $620/month**

---

## 📝 API Endpoints Structure

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/me
```

### Users
```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/search
POST   /api/users/:id/upload-image
```

### Discovery
```
GET    /api/discovery/students
POST   /api/discovery/swipe
GET    /api/discovery/matches
DELETE /api/discovery/matches/:id
```

### Communities
```
GET    /api/communities
POST   /api/communities
GET    /api/communities/:id
PUT    /api/communities/:id
DELETE /api/communities/:id
POST   /api/communities/:id/join
POST   /api/communities/:id/leave
GET    /api/communities/:id/posts
POST   /api/communities/:id/posts
```

### Posts
```
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/comments
DELETE /api/posts/:id/comments/:commentId
```

### Scholarships
```
GET    /api/scholarships
POST   /api/scholarships (admin)
GET    /api/scholarships/:id
PUT    /api/scholarships/:id (admin)
DELETE /api/scholarships/:id (admin)
POST   /api/scholarships/:id/save
DELETE /api/scholarships/:id/save
GET    /api/scholarships/saved
```

### Messages
```
GET    /api/messages/conversations
GET    /api/messages/:conversationId
POST   /api/messages
PUT    /api/messages/:id/read
DELETE /api/messages/:id
```

### Study Groups
```
GET    /api/study-groups
POST   /api/study-groups
GET    /api/study-groups/:id
PUT    /api/study-groups/:id
DELETE /api/study-groups/:id
POST   /api/study-groups/:id/join
POST   /api/study-groups/:id/leave
```

### Events
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/rsvp
```

### Mentorship
```
GET    /api/mentors
GET    /api/mentors/:id
POST   /api/mentorship/request
PUT    /api/mentorship/:id/accept
PUT    /api/mentorship/:id/reject
GET    /api/mentorship/my-mentees
GET    /api/mentorship/my-mentors
```

### Stories
```
GET    /api/stories
POST   /api/stories
DELETE /api/stories/:id
POST   /api/stories/:id/view
```

### Recipes
```
GET    /api/recipes
POST   /api/recipes
GET    /api/recipes/:id
PUT    /api/recipes/:id
DELETE /api/recipes/:id
```

### Subscriptions
```
GET    /api/subscriptions/plans
POST   /api/subscriptions/create
POST   /api/subscriptions/cancel
GET    /api/subscriptions/current
```

### Payments
```
POST   /api/payments/stripe/create-intent
POST   /api/payments/ecocash/initiate
POST   /webhooks/stripe
POST   /webhooks/ecocash
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

---

## 📅 Implementation Timeline

### Phase 1: Foundation (Week 1-2) 🏗️
**Goal:** Basic backend infrastructure

- [ ] Set up project structure
- [ ] Choose & configure database (Supabase/Firebase)
- [ ] Set up authentication system
- [ ] Create user registration/login
- [ ] Deploy backend to Railway/Render
- [ ] Set up error logging (Sentry)
- [ ] Configure CORS
- [ ] Set up environment variables

**Deliverables:**
- Users can register and login
- JWT authentication working
- Basic API deployed

---

### Phase 2: Core Features (Week 3-4) 🚀
**Goal:** Main features working

- [ ] User profiles (CRUD)
- [ ] Student discovery (swipe system)
- [ ] Communities (CRUD + join/leave)
- [ ] Posts & comments
- [ ] Scholarships (CRUD + save)
- [ ] File upload (Cloudinary)
- [ ] Basic search

**Deliverables:**
- Discovery page fully functional
- Communities working
- Scholarships searchable
- Images uploading

---

### Phase 3: Real-time & Communication (Week 5-6) 💬
**Goal:** Real-time features

- [ ] WebSocket server setup
- [ ] 1-on-1 chat messaging
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Online presence
- [ ] Study groups chat
- [ ] Notifications system

**Deliverables:**
- Chat working in real-time
- Notifications appearing
- Online status visible

---

### Phase 4: Additional Features (Week 7-8) ✨
**Goal:** Complete feature set

- [ ] Events system
- [ ] Mentorship matching
- [ ] Alumni profiles
- [ ] Stories (24hr auto-delete)
- [ ] Recipes sharing
- [ ] Email notifications
- [ ] Advanced search (Elasticsearch)

**Deliverables:**
- All frontend features connected
- Email notifications working
- Search optimized

---

### Phase 5: Payments & Monetization (Week 9-10) 💰
**Goal:** Revenue generation

- [ ] Stripe integration
- [ ] EcoCash integration
- [ ] Subscription system
- [ ] Payment webhooks
- [ ] Transaction history
- [ ] Premium features gating
- [ ] University dashboard (analytics)

**Deliverables:**
- Users can subscribe
- Payments processing
- Premium features locked

---

### Phase 6: Polish & Optimization (Week 11-12) 🎨
**Goal:** Production-ready

- [ ] Performance optimization
- [ ] Caching strategy (Redis)
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Mobile optimization
- [ ] Analytics setup (Mixpanel)
- [ ] Monitoring dashboards
- [ ] Backup strategy

**Deliverables:**
- Fast, secure, scalable app
- Monitoring in place
- Documentation complete

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example: User service tests
describe('UserService', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Test123!',
      name: 'Test User'
    };
    
    const user = await userService.createUser(userData);
    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
  });
  
  it('should not allow duplicate emails', async () => {
    await expect(
      userService.createUser({ email: 'existing@test.com' })
    ).rejects.toThrow('Email already exists');
  });
});
```

### Integration Tests
```typescript
describe('Authentication Flow', () => {
  it('should register, login, and access protected route', async () => {
    // Register
    const regResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'Test123!' });
    
    expect(regResponse.status).toBe(201);
    
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Test123!' });
    
    const token = loginResponse.body.token;
    
    // Access protected route
    const profileResponse = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(profileResponse.status).toBe(200);
  });
});
```

### End-to-End Tests (Playwright/Cypress)
```typescript
test('User can swipe and match with students', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@test.com');
  await page.fill('[name=password]', 'Test123!');
  await page.click('button[type=submit]');
  
  await page.goto('/discovery');
  await page.waitForSelector('.student-card');
  
  // Swipe right
  await page.click('[data-testid=swipe-right]');
  
  // Check for match
  await page.waitForSelector('[data-testid=match-notification]');
});
```

---

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add appropriate indexes
CREATE INDEX idx_users_country_city ON users(country, city);
CREATE INDEX idx_messages_participants ON messages(sender_id, receiver_id);

-- Use materialized views for expensive queries
CREATE MATERIALIZED VIEW community_stats AS
SELECT 
  c.id,
  c.name,
  COUNT(DISTINCT cm.user_id) as member_count,
  COUNT(DISTINCT p.id) as post_count
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
LEFT JOIN posts p ON c.id = p.community_id
GROUP BY c.id, c.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW community_stats;
```

### Caching Strategy (Redis)
```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache user profile
async function getUserProfile(userId: string) {
  const cached = await redis.get(`user:${userId}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const user = await db.users.findUnique({ where: { id: userId } });
  
  // Cache for 5 minutes
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user));
  
  return user;
}

// Cache invalidation
async function updateUserProfile(userId: string, updates: any) {
  await db.users.update({ where: { id: userId }, data: updates });
  
  // Invalidate cache
  await redis.del(`user:${userId}`);
}
```

### API Response Optimization
```typescript
// Implement pagination
app.get('/api/scholarships', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const [scholarships, total] = await Promise.all([
    db.scholarships.findMany({ skip: offset, take: limit }),
    db.scholarships.count()
  ]);
  
  res.json({
    data: scholarships,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Use field selection
app.get('/api/users/:id', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name', 'email'];
  
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    select: fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
  });
  
  res.json(user);
});
```

---

## 🔒 Security Checklist

### Before Production
- [ ] Environment variables properly secured
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF tokens on state-changing operations
- [ ] Password hashing (bcrypt/argon2)
- [ ] JWT secret rotation strategy
- [ ] File upload validation (type, size)
- [ ] API input validation (Zod schemas)
- [ ] Sensitive data encryption at rest
- [ ] Audit logging for critical actions
- [ ] Security headers (helmet.js)
- [ ] Regular dependency updates
- [ ] Penetration testing
- [ ] GDPR compliance (data export/deletion)
- [ ] Terms of Service & Privacy Policy

---

## 📊 Success Metrics & KPIs

### User Acquisition
- Daily sign-ups
- Activation rate (completed profile)
- User acquisition cost (CAC)
- Viral coefficient

### Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)
- Average session duration
- Features used per session

### Retention
- Day 1, 7, 30 retention
- Churn rate
- Monthly cohort retention

### Monetization
- Conversion rate (free → paid)
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- LTV:CAC ratio

### Feature-Specific
- Discovery: Swipes per user, Match rate
- Communities: Posts per community, Engagement rate
- Chat: Messages sent, Response time
- Scholarships: Applications submitted, Saved scholarships

---

## 🚀 Next Steps - Getting Started

### Immediate Actions (This Week)

1. **Choose Your Stack** (1 day)
   - ✅ Decide: Firebase vs Supabase vs Custom
   - ✅ Set up accounts
   - ✅ Review pricing

2. **Set Up Development Environment** (1 day)
   - ✅ Install dependencies
   - ✅ Create .env file
   - ✅ Set up database

3. **Implement Authentication** (2 days)
   - ✅ User registration
   - ✅ Login/logout
   - ✅ JWT tokens
   - ✅ Protected routes

4. **Connect First Feature** (2 days)
   - ✅ User profiles
   - ✅ Update frontend to use real API
   - ✅ Test end-to-end

5. **Deploy MVP** (1 day)
   - ✅ Deploy backend
   - ✅ Deploy frontend
   - ✅ Test in production

---

## 📚 Resources & Documentation

### Learning Resources
- **Firebase:** https://firebase.google.com/docs
- **Supabase:** https://supabase.com/docs
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Socket.io:** https://socket.io/docs/
- **Stripe:** https://stripe.com/docs/api
- **JWT:** https://jwt.io/introduction

### Boilerplates
- **Supabase + React:** https://github.com/supabase/supabase/tree/master/examples
- **Firebase + React:** https://github.com/firebase/quickstart-js
- **Node.js API:** https://github.com/goldbergyoni/nodebestpractices

### Tools
- **API Testing:** Postman, Insomnia
- **Database GUI:** TablePlus, pgAdmin
- **Monitoring:** Sentry, LogRocket
- **Analytics:** Mixpanel, Amplitude

---

## 💡 Recommendations

### For Fastest Time to Market (2-4 weeks)
**Use:** Firebase or Supabase
- Pre-built authentication
- Real-time out of box
- No server management
- Focus on features

### For Best Long-term Cost (3+ months)
**Use:** Custom Node.js + PostgreSQL
- More control
- Better pricing at scale
- Custom optimizations
- Full ownership

### For African Market Specifically
**Must-haves:**
- ✅ EcoCash/Mobile Money integration
- ✅ SMS notifications (Africa's Talking)
- ✅ Low bandwidth optimization
- ✅ Offline-first approach
- ✅ Multiple currency support

---

## 🎯 Final Checklist Before Launch

- [ ] All features tested end-to-end
- [ ] Payment processing working
- [ ] Email/SMS notifications sending
- [ ] Error monitoring set up
- [ ] Analytics tracking
- [ ] Backup strategy in place
- [ ] Terms of Service written
- [ ] Privacy Policy published
- [ ] GDPR compliance
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Beta testers recruited
- [ ] Marketing materials ready
- [ ] Customer support setup
- [ ] Feedback collection system

---

## 📞 Support & Questions

This plan is comprehensive but flexible. Choose what works for your timeline and budget. Start with MVP features and iterate based on user feedback.

**Recommended Approach:**
1. Start with Firebase/Supabase for speed
2. Launch MVP in 4-6 weeks
3. Get real users and feedback
4. Iterate and add features
5. Migrate to custom backend if needed (later)

Good luck! 🚀🇿🇼
