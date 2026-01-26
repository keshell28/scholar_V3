# 🗺️ Scholar Platform - Routes & Features Map

## 📍 All Available Routes

### Public Routes
- `/landing` - Landing page (marketing)
- `/login` - Login/Signup page

### Protected Routes (Requires Auth)

#### Main Navigation
- `/` - **Home** - Feed with premium upgrade banner
- `/discover` - **Discovery** - Student matching (swipe interface)
- `/communities` - **Communities** - Student groups
- `/scholarships` - **Scholarships** - Premium scholarship system ⭐
- `/recipes` - **Recipes** - Cultural content

#### Monetization Features ⭐
- `/subscribe` - **Subscribe** - Subscription selection & payment
- `/university-dashboard` - **University Dashboard** - Partner analytics (B2B)

#### Communication
- `/chat` - **Chat** - Messaging system
- `/notifications` - **Notifications** - Activity feed
- `/profile` - **Profile** - User settings

---

## 💰 Monetization Routes Explained

### `/subscribe` - Subscription Page
**Purpose**: Convert free users to paid subscribers

**Features**:
- 3 pricing tiers display (Free, Premium $4.99, Scholar Plus $9.99)
- "Most Popular" badge on Scholar Plus
- Feature comparison lists
- Payment method selection (EcoCash vs Stripe)
- Demo payment processing

**User Flow**:
1. View pricing tiers
2. Select plan (Premium or Scholar Plus)
3. Choose payment method (EcoCash or Credit Card)
4. Complete payment (auto-completes in demo)
5. Subscription activated → Return to scholarships

---

### `/scholarships` - Premium Scholarships
**Purpose**: Primary value proposition - scholarship database access

**Free Tier Experience**:
- See 3 out of 6 scholarships
- Premium scholarship banners (CTAs)
- Upgrade prompts
- Limited details

**Premium Tier Experience**:
- All 6 scholarships unlocked
- AI matching scores (85-92%)
- "Top Matches" section
- Full scholarship details
- Application tracking UI
- Export options

**Features**:
- Search functionality
- Level filters (undergraduate, postgraduate, PhD)
- Save/bookmark scholarships
- Match score indicators
- Competitiveness badges
- Deadline tracking
- Direct application links

---

### `/university-dashboard` - Partner Dashboard
**Purpose**: B2B revenue stream - university recruitment

**Features**:
- Analytics overview (views, inquiries, applications)
- ROI metrics (340% demo ROI)
- Conversion tracking (25.8% demo rate)
- Monthly spend display ($1,500/mo demo)
- Recent inquiries list
- Quick action buttons
- Performance graphs

**Target Users**:
- Zimbabwean universities (UZ, NUST, MSU)
- International universities recruiting Zimbabweans
- Online education providers

---

## 🎯 Premium Features by Route

### Home (`/`)
**Free Users**:
- Yellow upgrade banner at top
- "Unlock Premium Scholarships" CTA
- Feed posts
- Profile stats

**Premium Users**:
- No upgrade banner
- Crown badge in profile
- Premium-only content in feed
- Enhanced profile stats

---

### Discover (`/discover`)
**Free Users**:
- 10 swipes per day
- Basic filters
- Standard profile views

**Premium Users** (Future):
- Unlimited swipes
- Advanced filters
- See who viewed you
- Priority matching

---

### Communities (`/communities`)
**Free Users**:
- Join up to 5 communities
- Basic posting
- Standard features

**Premium Users** (Future):
- Unlimited communities
- Priority posts
- Admin privileges
- Custom communities

---

## 🔐 Feature Access Control

### Subscription Tiers

#### Free ($0)
```javascript
features: [
  'Basic scholarship browsing',
  '10 discovery swipes per day',
  'Join up to 5 communities',
  'Basic profile',
  'Limited messaging'
]
```

#### Scholar Premium ($4.99/mo)
```javascript
features: [
  'Everything in Free',
  'Unlimited discovery swipes',
  'Advanced filters',
  'See who viewed your profile',
  'Ad-free experience',
  'Priority community posts',
  'Unlimited communities'
]
```

#### Scholar Plus ($9.99/mo) ⭐ MOST POPULAR
```javascript
features: [
  'Everything in Premium',
  'Full scholarship database access', // KEY FEATURE
  'AI-powered scholarship matching',
  'Application deadline tracking',
  'Essay templates & samples',
  'Document preparation help',
  '1 CV review per month',
  'Early access to new features',
  'Blue verification badge'
]
```

---

## 💳 Payment Flow Routes

### Step 1: Tier Selection
**Route**: `/subscribe`
**View**: Pricing cards with features
**Action**: User clicks "Select Plan"

### Step 2: Payment Method
**Route**: `/subscribe` (payment method view)
**Options**:
- 💵 EcoCash/OneMoney (Zimbabwe)
- 💳 Credit/Debit Card (International)
**Action**: User selects payment type

### Step 3: Payment Details
**Route**: `/subscribe` (payment form)

**For EcoCash**:
- Enter phone number
- System sends payment request
- User confirms on phone
- Auto-completes in 3 seconds (demo)

**For Stripe**:
- Enter card details
- Enter expiry & CVC
- Review amount
- Auto-completes in 2 seconds (demo)

### Step 4: Success
**Result**: 
- Subscription activated
- Redirect to `/scholarships`
- Crown badge appears
- All features unlocked

---

## 📊 Analytics Events by Route

### `/` (Home)
- `Page View` - Home
- `Upgrade CTA Clicked` (if banner clicked)

### `/scholarships`
- `Page View` - Scholarships Page
- `Scholarship Viewed` (click on scholarship)
- `Scholarship Saved` (bookmark)
- `Upgrade CTA Clicked` (if CTA clicked)

### `/subscribe`
- `Page View` - Subscribe Page
- `Upgrade CTA Clicked` (tier selection)
- `Payment Method Selected` (EcoCash or Stripe)
- `Payment Initiated`
- `Payment Completed` ✅
- `Payment Failed` ❌

### `/university-dashboard`
- `Page View` - University Dashboard
- `University Profile Viewed`
- `Program Inquiry Sent`

---

## 🎨 UI Components by Feature

### Premium Indicators
**Where**: All routes
- 👑 Crown icon (navigation, profile)
- Yellow "Upgrade" button (navigation)
- Premium badges on features
- Match score displays

### Paywalls
**Where**: `/scholarships`, `/discover`
- Blur effects on locked content
- "Upgrade to see more" overlays
- Feature comparison tooltips
- Upgrade CTAs

### Payment UIs
**Where**: `/subscribe`
- Pricing cards
- Payment method selection
- Credit card form (Stripe)
- Mobile money form (EcoCash)
- Loading states
- Success/error messages

---

## 🔄 User Journey Map

### New User (Free)
```
Landing → Signup → Home (sees banner) → Scholarships (limited)
→ Clicks "Upgrade" → Subscribe page → Selects plan → Pays
→ Success → Scholarships (unlocked) → All features available
```

### Returning Premium User
```
Login → Home (no banner, crown badge) → Scholarships (full access)
→ Views match scores → Saves scholarships → Applies via links
```

### University Partner
```
Login → University Dashboard → Views analytics → Tracks ROI
→ Manages programs → Responds to inquiries → Downloads reports
```

---

## 📱 Mobile vs Desktop Differences

### Desktop
- Full navigation bar (top)
- Sidebar layouts
- Hover effects
- Larger premium banners
- Multi-column grids

### Mobile
- Bottom navigation bar
- Single column
- Touch gestures
- Compact CTAs
- Stack layouts

---

## 🚀 Future Routes (Planned)

### Revenue Generating:
- `/marketplace` - Student marketplace (textbooks, services)
- `/jobs` - Job board for students
- `/courses` - Premium courses and content
- `/events` - Paid events and webinars

### Supporting:
- `/scholarships/:id` - Individual scholarship pages
- `/universities/:id` - University profile pages
- `/referrals` - Referral program dashboard
- `/billing` - Subscription management
- `/analytics` - Personal analytics (premium feature)

---

## 📈 Conversion Optimization Points

### High-Intent Pages (Good for CTAs):
1. `/scholarships` - Users actively seeking value
2. `/` (Home) - First impression
3. `/discover` - Feature-limited on free tier

### Low-Intent Pages (Soft CTAs):
1. `/communities` - Social focus
2. `/recipes` - Content browsing
3. `/chat` - Communication focus

---

## 🎯 Key Metrics by Route

### `/scholarships`
- Scholarship views
- Premium CTA clicks
- Free tier limitations hit
- Upgrade conversions
- **Target**: 3-5% conversion to paid

### `/subscribe`
- Page views
- Tier selections
- Payment method choices
- Completions
- **Target**: 80%+ completion rate

### `/university-dashboard`
- Partner logins
- Engagement metrics
- Inquiry response rates
- **Target**: 25%+ student conversion

---

## 🔥 Most Important Routes for Revenue

1. **`/scholarships`** - Primary value delivery
2. **`/subscribe`** - Conversion point
3. **`/`** - First touchpoint for CTAs
4. **`/university-dashboard`** - B2B revenue
5. **`/discover`** - Engagement driver

---

## ✅ Testing Checklist by Route

### `/scholarships` (Priority 1)
- [ ] Free tier shows 3 scholarships
- [ ] Premium tier shows 6 scholarships
- [ ] Match scores display (premium only)
- [ ] Upgrade CTAs visible (free tier)
- [ ] Search works
- [ ] Filters work
- [ ] Save/unsave works

### `/subscribe` (Priority 1)
- [ ] All 3 tiers display
- [ ] "Most Popular" badge shows
- [ ] Payment method selection works
- [ ] EcoCash demo completes
- [ ] Stripe demo completes
- [ ] Subscription activates
- [ ] Redirect works

### `/university-dashboard` (Priority 2)
- [ ] Stats display correctly
- [ ] Charts render
- [ ] Inquiries list shows
- [ ] Action buttons work
- [ ] Demo notice visible

### Navigation (All Routes)
- [ ] "Upgrade" button (free users)
- [ ] Crown badge (premium users)
- [ ] Routes all accessible
- [ ] Mobile nav works

---

**Last Updated**: January 26, 2026
**Status**: ✅ All routes implemented and functional
