# Scholar Monetization - Step-by-Step Implementation Guide

## 🎯 Overview

This guide provides a **practical, code-level implementation roadmap** for monetizing the Scholar platform. Follow these phases sequentially for systematic growth.

---

## 📋 PHASE 1: FOUNDATION (Week 1-2)

### Goal: Set up payment infrastructure and premium features framework

### Step 1.1: Install Required Dependencies

```bash
# Payment processing
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Mobile money (Paynow for Zimbabwe)
npm install paynow

# Form handling for payments
npm install react-hook-form zod @hookform/resolvers

# Icons for premium features
npm install lucide-react
```

### Step 1.2: Set Up Environment Variables

Create `.env.local`:
```env
# Stripe (for international payments)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Paynow (for EcoCash/OneMoney)
VITE_PAYNOW_INTEGRATION_ID=your_integration_id
VITE_PAYNOW_INTEGRATION_KEY=your_integration_key

# Feature flags
VITE_ENABLE_PREMIUM=true
VITE_ENABLE_PAYMENTS=true
```

### Step 1.3: Create Payment Types

**File: `src/types/payment.ts`**
```typescript
export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'ecocash' | 'onemoney' | 'paypal';
  name: string;
  icon: string;
  available: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: 'USD' | 'ZWL';
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: PaymentMethod['type'];
  description: string;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: 'free' | 'premium' | 'scholar-plus';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}
```

### Step 1.4: Create Subscription Store

**File: `src/stores/subscriptionStore.ts`**
```typescript
import { create } from 'zustand';
import { SubscriptionTier, UserSubscription, Transaction } from '../types/payment';

interface SubscriptionState {
  currentSubscription: UserSubscription | null;
  transactions: Transaction[];
  setSubscription: (subscription: UserSubscription) => void;
  addTransaction: (transaction: Transaction) => void;
  cancelSubscription: () => void;
  isFeatureAvailable: (feature: string) => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentSubscription: null,
  transactions: [],

  setSubscription: (subscription) => set({ currentSubscription: subscription }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  cancelSubscription: () =>
    set((state) => ({
      currentSubscription: state.currentSubscription
        ? { ...state.currentSubscription, status: 'cancelled', autoRenew: false }
        : null,
    })),

  isFeatureAvailable: (feature) => {
    const { currentSubscription } = get();
    if (!currentSubscription || currentSubscription.status !== 'active') {
      return false;
    }
    
    const premiumFeatures = [
      'unlimited_swipes',
      'advanced_filters',
      'profile_views',
      'ad_free',
      'priority_support',
    ];
    
    const scholarPlusFeatures = [
      ...premiumFeatures,
      'scholarship_matching',
      'application_tracking',
      'essay_templates',
      'career_services',
    ];

    if (currentSubscription.tier === 'scholar-plus') {
      return scholarPlusFeatures.includes(feature);
    }
    
    if (currentSubscription.tier === 'premium') {
      return premiumFeatures.includes(feature);
    }

    return false;
  },
}));

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic scholarship browsing',
      '10 discovery swipes per day',
      'Join up to 5 communities',
      'Basic profile',
      'Limited messaging',
    ],
  },
  {
    id: 'premium',
    name: 'Scholar Premium',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Free',
      'Unlimited discovery swipes',
      'Advanced filters',
      'See who viewed your profile',
      'Ad-free experience',
      'Priority community posts',
      'Unlimited communities',
    ],
  },
  {
    id: 'scholar-plus',
    name: 'Scholar Plus',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    popular: true,
    features: [
      'Everything in Premium',
      'Full scholarship database access',
      'AI-powered scholarship matching',
      'Application deadline tracking',
      'Essay templates & samples',
      'Document preparation help',
      '1 CV review per month',
      'Early access to new features',
      'Blue verification badge',
    ],
  },
];
```

---

## 🎓 PHASE 2: PREMIUM SCHOLARSHIPS (Week 3-4)

### Goal: Implement the #1 revenue driver - Premium Scholarship Features

### Step 2.1: Update Scholarship Types

**Update `src/types/index.ts`:**
```typescript
export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: string;
  deadline: Date;
  description: string;
  eligibility: string[];
  location: string;
  type: 'full' | 'partial' | 'grant';
  level: 'undergraduate' | 'postgraduate' | 'phd';
  fields: string[];
  applicationUrl: string;
  
  // Premium features
  isPremium?: boolean;
  matchScore?: number; // AI matching score (0-100)
  savedByUser?: boolean;
  applicationStatus?: 'not-started' | 'in-progress' | 'submitted' | 'awarded';
  
  // Analytics
  views?: number;
  applications?: number;
  competitiveness?: 'low' | 'medium' | 'high';
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  userId: string;
  status: 'draft' | 'in-progress' | 'submitted' | 'under-review' | 'awarded' | 'rejected';
  deadline: Date;
  documents: ApplicationDocument[];
  notes: string;
  createdAt: Date;
  submittedAt?: Date;
}

export interface ApplicationDocument {
  id: string;
  type: 'cv' | 'essay' | 'transcript' | 'recommendation' | 'other';
  name: string;
  status: 'pending' | 'complete';
  uploadedAt?: Date;
}
```

### Step 2.2: Create Premium Scholarship Features Component

**File: `src/components/PremiumScholarshipFeatures.tsx`**
```typescript
import React from 'react';
import { Crown, Target, Bell, FileText, CheckCircle } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function PremiumScholarshipFeatures() {
  const isFeatureAvailable = useSubscriptionStore((s) => s.isFeatureAvailable);
  const hasPremium = isFeatureAvailable('scholarship_matching');

  if (hasPremium) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 mb-6 text-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-6 h-6" />
        <h3 className="text-xl font-bold">Unlock Premium Scholarships</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">AI-Powered Matching</h4>
            <p className="text-sm opacity-90">Get personalized scholarship recommendations</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Deadline Tracking</h4>
            <p className="text-sm opacity-90">Never miss an application deadline</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Essay Templates</h4>
            <p className="text-sm opacity-90">Access winning essay samples</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Application Assistance</h4>
            <p className="text-sm opacity-90">Document prep & CV reviews</p>
          </div>
        </div>
      </div>

      <button className="w-full bg-gray-900 text-yellow-400 font-bold py-3 rounded-lg hover:bg-gray-800 transition">
        Upgrade to Scholar Plus - $9.99/month
      </button>
    </div>
  );
}
```

### Step 2.3: Update Scholarships Page with Premium Features

**Update `src/pages/Scholarships.tsx`:**
```typescript
import React, { useState } from 'react';
import { Search, Filter, Bookmark, Target, TrendingUp } from 'lucide-react';
import { useScholarshipStore } from '../stores/scholarshipStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { PremiumScholarshipFeatures } from '../components/PremiumScholarshipFeatures';

export function Scholarships() {
  const scholarships = useScholarshipStore((s) => s.scholarships);
  const isFeatureAvailable = useSubscriptionStore((s) => s.isFeatureAvailable);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const hasPremium = isFeatureAvailable('scholarship_matching');

  // Filter scholarships based on subscription
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Free users see only 50% of scholarships
    if (!hasPremium && scholarship.isPremium) {
      return false;
    }
    
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scholarship Opportunities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {hasPremium ? 'Full access to all scholarships' : `Showing ${filteredScholarships.length} of ${scholarships.length} scholarships`}
        </p>
      </div>

      <PremiumScholarshipFeatures />

      {/* AI Matching - Premium Feature */}
      {hasPremium && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-green-900 dark:text-green-100">Your Top Matches</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {filteredScholarships
              .filter(s => s.matchScore && s.matchScore > 80)
              .slice(0, 4)
              .map((scholarship) => (
                <div key={scholarship.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                  <div>
                    <p className="font-semibold text-sm">{scholarship.title}</p>
                    <p className="text-xs text-gray-600">{scholarship.organization}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">{scholarship.matchScore}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>
        <button className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Scholarship Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-green-500 transition"
          >
            {scholarship.matchScore && hasPremium && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">
                  {scholarship.matchScore}% Match
                </span>
                <Bookmark className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-500" />
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-2">{scholarship.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scholarship.organization}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-green-600">{scholarship.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-semibold">{new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Level:</span>
                <span className="capitalize">{scholarship.level}</span>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              {hasPremium ? 'View Details & Apply' : 'View Details'}
            </button>
          </div>
        ))}
      </div>

      {/* Upgrade CTA for free users */}
      {!hasPremium && (
        <div className="mt-8 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Want to see all scholarships?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upgrade to Scholar Plus to unlock {scholarships.filter(s => s.isPremium).length} more opportunities
          </p>
          <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-600">
            Upgrade Now - $9.99/month
          </button>
        </div>
      )}
    </div>
  );
}
```

### Step 2.4: Add Premium Scholarships to Store

**Update `src/stores/scholarshipStore.ts`:**
```typescript
// Add these properties to mock scholarships
const mockScholarships = [
  {
    id: '1',
    title: 'Chevening Scholarships',
    organization: 'UK Government',
    amount: 'Full tuition + living costs',
    deadline: new Date('2026-11-03'),
    description: 'Fully-funded scholarships for future leaders',
    eligibility: ['Undergraduate degree', '2+ years work experience', 'Leadership potential'],
    location: 'United Kingdom',
    type: 'full' as const,
    level: 'postgraduate' as const,
    fields: ['All fields'],
    applicationUrl: 'https://chevening.org',
    isPremium: true, // Premium only
    matchScore: 92, // AI match score
    competitiveness: 'high' as const,
  },
  // ... add isPremium: true to 50% of scholarships
  // ... add matchScore to simulate AI matching
];
```

---

## 🏫 PHASE 3: UNIVERSITY PARTNERSHIPS (Week 5-6)

### Goal: Create university partner dashboard and featured listings

### Step 3.1: Create University Partner Types

**File: `src/types/university.ts`**
```typescript
export interface UniversityPartner {
  id: string;
  name: string;
  country: string;
  logo: string;
  description: string;
  website: string;
  tier: 'basic' | 'featured' | 'premium';
  
  // Subscription details
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  monthlyFee: number;
  
  // Programs offered
  programs: UniversityProgram[];
  
  // Analytics
  profileViews: number;
  inquiries: number;
  applications: number;
}

export interface UniversityProgram {
  id: string;
  name: string;
  level: 'undergraduate' | 'postgraduate' | 'phd';
  field: string;
  duration: string;
  fees: string;
  scholarshipsAvailable: boolean;
  applicationDeadline: Date;
}

export interface UniversityInquiry {
  id: string;
  universityId: string;
  studentId: string;
  programId: string;
  message: string;
  status: 'new' | 'contacted' | 'enrolled' | 'declined';
  createdAt: Date;
}
```

### Step 3.2: Create University Partner Dashboard Component

**File: `src/components/UniversityPartnerDashboard.tsx`**
```typescript
import React from 'react';
import { TrendingUp, Users, Mail, DollarSign } from 'lucide-react';

interface UniversityPartnerDashboardProps {
  universityId: string;
}

export function UniversityPartnerDashboard({ universityId }: UniversityPartnerDashboardProps) {
  // Mock data - would come from API
  const stats = {
    profileViews: 1247,
    inquiries: 89,
    applications: 23,
    monthlySpend: 1500,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">University Partner Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Profile Views</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats.profileViews}</p>
          <p className="text-sm text-green-600 mt-1">+12% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Inquiries</h3>
            <Mail className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">{stats.inquiries}</p>
          <p className="text-sm text-green-600 mt-1">+8% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Applications</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{stats.applications}</p>
          <p className="text-sm text-green-600 mt-1">+15% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Monthly Spend</h3>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">${stats.monthlySpend}</p>
          <p className="text-sm text-gray-600 mt-1">Featured tier</p>
        </div>
      </div>

      {/* Programs Management */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Your Programs</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
          + Add New Program
        </button>
        
        {/* Programs list would go here */}
        <p className="text-gray-600">Manage your programs, set deadlines, and track applications</p>
      </div>
    </div>
  );
}
```

### Step 3.3: Add University Listings to Home Page

**Update `src/pages/Home.tsx` - Add featured universities section:**
```typescript
{/* Featured Universities */}
<section className="mb-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold">Featured Universities</h2>
    <button className="text-green-600 hover:underline">View All →</button>
  </div>
  
  <div className="grid md:grid-cols-3 gap-6">
    {featuredUniversities.map((uni) => (
      <div
        key={uni.id}
        className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <img src={uni.logo} alt={uni.name} className="w-12 h-12 rounded" />
          <div>
            <h3 className="font-bold">{uni.name}</h3>
            <p className="text-sm text-gray-600">{uni.country}</p>
          </div>
        </div>
        <p className="text-sm mb-4">{uni.description}</p>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg">
          View Programs
        </button>
      </div>
    ))}
  </div>
</section>
```

---

## 💳 PHASE 4: PAYMENT INTEGRATION (Week 7-8)

### Goal: Implement Stripe and EcoCash payment processing

### Step 4.1: Create Stripe Payment Component

**File: `src/components/StripeCheckout.tsx`**
```typescript
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  tierId: string;
  onSuccess: () => void;
}

function CheckoutForm({ amount, tierId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // In production, call your backend to create payment intent
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      'payment_intent_secret_from_backend',
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

export function StripeCheckout({ amount, tierId, onSuccess }: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} tierId={tierId} onSuccess={onSuccess} />
    </Elements>
  );
}
```

### Step 4.2: Create EcoCash Payment Component

**File: `src/components/EcoCashPayment.tsx`**
```typescript
import React, { useState } from 'react';
import { Smartphone, CheckCircle } from 'lucide-react';

interface EcoCashPaymentProps {
  amount: number;
  description: string;
  onSuccess: () => void;
}

export function EcoCashPayment({ amount, description, onSuccess }: EcoCashPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pollUrl, setPollUrl] = useState<string | null>(null);

  const initiatePayment = async () => {
    setProcessing(true);

    // In production, call your backend which uses Paynow API
    try {
      const response = await fetch('/api/payments/ecocash/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          phoneNumber,
          description,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPollUrl(data.pollUrl);
        // Poll for payment status
        pollPaymentStatus(data.pollUrl);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setProcessing(false);
    }
  };

  const pollPaymentStatus = async (url: string) => {
    const maxAttempts = 60; // 5 minutes
    let attempts = 0;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/payments/ecocash/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pollUrl: url }),
        });

        const data = await response.json();

        if (data.status === 'paid') {
          clearInterval(interval);
          onSuccess();
        } else if (data.status === 'cancelled' || attempts >= maxAttempts) {
          clearInterval(interval);
          setProcessing(false);
          setPollUrl(null);
        }

        attempts++;
      } catch (error) {
        clearInterval(interval);
        setProcessing(false);
      }
    }, 5000); // Check every 5 seconds
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Pay with EcoCash</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your EcoCash number to receive a payment prompt
        </p>
      </div>

      {!pollUrl ? (
        <>
          <input
            type="tel"
            placeholder="07XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
          />

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Amount:</span>
              <span className="font-bold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Description:</span>
              <span className="text-sm text-gray-600">{description}</span>
            </div>
          </div>

          <button
            onClick={initiatePayment}
            disabled={!phoneNumber || processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Send Payment Request'}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse mb-4">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto" />
          </div>
          <h3 className="text-lg font-bold mb-2">Check your phone</h3>
          <p className="text-gray-600 dark:text-gray-400">
            A payment prompt has been sent to {phoneNumber}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This page will update automatically once payment is complete
          </p>
        </div>
      )}
    </div>
  );
}
```

### Step 4.3: Create Subscription Selection Page

**File: `src/pages/Subscribe.tsx`**
```typescript
import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../stores/subscriptionStore';
import { StripeCheckout } from '../components/StripeCheckout';
import { EcoCashPayment } from '../components/EcoCashPayment';

export function Subscribe() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'ecocash' | null>(null);

  const handlePaymentSuccess = () => {
    // Update subscription in store
    alert('Payment successful! Welcome to Scholar Plus!');
    window.location.href = '/scholarships';
  };

  if (selectedTier && paymentMethod) {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)!;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-2">{tier.name}</h2>
          <p className="text-3xl font-bold text-green-600 mb-4">
            ${tier.price}
            <span className="text-sm text-gray-600">/{tier.interval}</span>
          </p>
        </div>

        {paymentMethod === 'stripe' && (
          <StripeCheckout
            amount={tier.price}
            tierId={tier.id}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {paymentMethod === 'ecocash' && (
          <EcoCashPayment
            amount={tier.price}
            description={`${tier.name} Subscription`}
            onSuccess={handlePaymentSuccess}
          />
        )}

        <button
          onClick={() => setPaymentMethod(null)}
          className="w-full mt-4 text-gray-600 hover:underline"
        >
          ← Choose different payment method
        </button>
      </div>
    );
  }

  if (selectedTier) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Choose Payment Method</h1>

        <div className="space-y-4">
          <button
            onClick={() => setPaymentMethod('ecocash')}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition text-left"
          >
            <h3 className="font-bold text-lg mb-2">EcoCash / OneMoney</h3>
            <p className="text-gray-600">Pay with mobile money (Zimbabwe)</p>
          </button>

          <button
            onClick={() => setPaymentMethod('stripe')}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition text-left"
          >
            <h3 className="font-bold text-lg mb-2">Credit / Debit Card</h3>
            <p className="text-gray-600">International payments via Stripe</p>
          </button>
        </div>

        <button
          onClick={() => setSelectedTier(null)}
          className="w-full mt-4 text-gray-600 hover:underline"
        >
          ← Back to plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Unlock your full potential with Scholar Plus
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`border-2 rounded-lg p-8 ${
              tier.popular
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 relative'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">${tier.price}</span>
              <span className="text-gray-600">/{tier.interval}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => tier.id !== 'free' && setSelectedTier(tier.id)}
              disabled={tier.id === 'free'}
              className={`w-full py-3 rounded-lg font-bold transition ${
                tier.popular
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : tier.id === 'free'
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {tier.id === 'free' ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 PHASE 5: ANALYTICS & TRACKING (Week 9)

### Goal: Track user behavior and revenue metrics

### Step 5.1: Install Analytics Dependencies

```bash
npm install @vercel/analytics posthog-js mixpanel-browser
```

### Step 5.2: Create Analytics Service

**File: `src/services/analytics.ts`**
```typescript
import mixpanel from 'mixpanel-browser';
import posthog from 'posthog-js';

class AnalyticsService {
  private initialized = false;

  init() {
    if (this.initialized) return;

    // Mixpanel for product analytics
    if (import.meta.env.VITE_MIXPANEL_TOKEN) {
      mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);
    }

    // PostHog for session replay
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: 'https://app.posthog.com',
      });
    }

    this.initialized = true;
  }

  // Track events
  track(eventName: string, properties?: Record<string, any>) {
    mixpanel.track(eventName, properties);
    posthog.capture(eventName, properties);
    
    console.log('📊 Event:', eventName, properties);
  }

  // Identify user
  identify(userId: string, traits?: Record<string, any>) {
    mixpanel.identify(userId);
    mixpanel.people.set(traits);
    posthog.identify(userId, traits);
  }

  // Track page view
  pageView(pageName: string) {
    this.track('Page View', { page: pageName });
  }

  // Revenue tracking
  trackRevenue(amount: number, properties?: Record<string, any>) {
    mixpanel.people.track_charge(amount);
    this.track('Revenue', { amount, ...properties });
  }
}

export const analytics = new AnalyticsService();

// Event types for type safety
export const EVENTS = {
  // User actions
  SIGNUP: 'User Signed Up',
  LOGIN: 'User Logged In',
  PROFILE_UPDATED: 'Profile Updated',
  
  // Discovery
  SWIPE_RIGHT: 'Swipe Right',
  SWIPE_LEFT: 'Swipe Left',
  MATCH_CREATED: 'Match Created',
  
  // Scholarships
  SCHOLARSHIP_VIEWED: 'Scholarship Viewed',
  SCHOLARSHIP_SAVED: 'Scholarship Saved',
  APPLICATION_STARTED: 'Application Started',
  APPLICATION_SUBMITTED: 'Application Submitted',
  
  // Communities
  COMMUNITY_JOINED: 'Community Joined',
  POST_CREATED: 'Post Created',
  
  // Monetization
  UPGRADE_CTA_CLICKED: 'Upgrade CTA Clicked',
  PAYMENT_METHOD_SELECTED: 'Payment Method Selected',
  PAYMENT_INITIATED: 'Payment Initiated',
  PAYMENT_COMPLETED: 'Payment Completed',
  PAYMENT_FAILED: 'Payment Failed',
  SUBSCRIPTION_CANCELLED: 'Subscription Cancelled',
  
  // University partners
  UNIVERSITY_VIEWED: 'University Profile Viewed',
  PROGRAM_INQUIRED: 'Program Inquiry Sent',
};
```

### Step 5.3: Add Analytics to Key Actions

**Update subscription store:**
```typescript
import { analytics, EVENTS } from '../services/analytics';

// In setSubscription function:
setSubscription: (subscription) => {
  set({ currentSubscription: subscription });
  analytics.track(EVENTS.PAYMENT_COMPLETED, {
    tier: subscription.tier,
    interval: subscription.endDate - subscription.startDate,
  });
  analytics.trackRevenue(/* subscription amount */);
},
```

---

## 🚀 PHASE 6: LAUNCH & MARKETING (Week 10-12)

### Step 6.1: Create Landing Page for Launch

**Update `src/pages/Landing.tsx` with conversion-optimized copy:**
```typescript
// Add pricing section, testimonials, FAQ, clear CTAs
// Focus on scholarship value proposition
// Add waitlist/early access form
// Include university partner logos
```

### Step 6.2: Set Up Email Marketing

```bash
npm install @sendgrid/mail resend
```

**File: `src/services/email.ts`**
```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'Scholar <hello@scholar.co.zw>',
    to: email,
    subject: 'Welcome to Scholar! 🎓',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>You're now part of Zimbabwe's largest student network.</p>
      <p>Get started by:</p>
      <ul>
        <li>Completing your profile</li>
        <li>Browsing scholarship opportunities</li>
        <li>Joining your university community</li>
      </ul>
      <a href="https://scholar.co.zw/scholarships">Browse Scholarships →</a>
    `,
  });
}

export async function sendScholarshipDeadlineReminder(
  email: string,
  scholarshipName: string,
  daysLeft: number
) {
  await resend.emails.send({
    from: 'Scholar <scholarships@scholar.co.zw>',
    to: email,
    subject: `⏰ ${daysLeft} days left: ${scholarshipName}`,
    html: `
      <h2>Don't miss out!</h2>
      <p>The ${scholarshipName} application deadline is in ${daysLeft} days.</p>
      <a href="https://scholar.co.zw/scholarships">Complete Application →</a>
    `,
  });
}
```

### Step 6.3: Create Referral System

**File: `src/stores/referralStore.ts`**
```typescript
import { create } from 'zustand';

interface ReferralState {
  referralCode: string;
  referrals: number;
  rewards: number;
  generateReferralCode: (userId: string) => string;
  trackReferral: (code: string) => void;
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  referralCode: '',
  referrals: 0,
  rewards: 0,

  generateReferralCode: (userId) => {
    const code = `SCHOLAR${userId.slice(0, 6).toUpperCase()}`;
    set({ referralCode: code });
    return code;
  },

  trackReferral: (code) => {
    set((state) => ({
      referrals: state.referrals + 1,
      // Give 1 month free for every 3 referrals
      rewards: state.rewards + (state.referrals % 3 === 2 ? 1 : 0),
    }));
  },
}));

// Rewards structure:
// 3 referrals = 1 month free
// 10 referrals = 3 months free + Scholar Plus badge
// 25 referrals = 1 year free + Ambassador status
```

---

## 📱 PHASE 7: BACKEND SETUP (Week 13-14)

### Step 7.1: Choose Backend Option

**Option A: Firebase (Recommended for MVP)**
```bash
npm install firebase
```

**Option B: Supabase (Better for PostgreSQL needs)**
```bash
npm install @supabase/supabase-js
```

**Option C: Custom Node.js Backend**
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv stripe paynow
```

### Step 7.2: Create Firebase Configuration

**File: `src/services/firebase.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
```

### Step 7.3: Create Cloud Functions for Payments

**File: `functions/src/index.ts`** (Firebase Functions)
```typescript
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { Paynow } from 'paynow';

const stripe = new Stripe(functions.config().stripe.secret_key);
const paynow = new Paynow(
  functions.config().paynow.integration_id,
  functions.config().paynow.integration_key
);

// Stripe payment intent
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { amount, currency, tierId } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: currency || 'usd',
    metadata: { tierId, userId: context.auth?.uid },
  });

  return { clientSecret: paymentIntent.client_secret };
});

// EcoCash payment
export const initiateEcoCashPayment = functions.https.onCall(async (data, context) => {
  const { amount, phoneNumber, description } = data;
  
  const payment = paynow.createPayment('Subscription');
  payment.add(description, amount);

  try {
    const response = await paynow.sendMobile(payment, phoneNumber, 'ecocash');
    
    return {
      success: response.success,
      pollUrl: response.pollUrl,
      instructions: response.instructions,
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Payment failed');
  }
});

// Check EcoCash payment status
export const checkEcoCashStatus = functions.https.onCall(async (data) => {
  const { pollUrl } = data;
  const status = await paynow.pollTransaction(pollUrl);
  
  return {
    status: status.status,
    paid: status.paid,
  };
});

// Stripe webhook handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      functions.config().stripe.webhook_secret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update user subscription in Firestore
    // Send confirmation email
  }

  res.json({ received: true });
});
```

---

## 📈 PHASE 8: GROWTH & OPTIMIZATION (Ongoing)

### Step 8.1: A/B Testing Setup

```bash
npm install @growthbook/growthbook-react
```

**Test these:**
- Pricing ($4.99 vs $9.99 vs $14.99)
- Free trial (7 days vs 14 days vs 30 days)
- CTA copy ("Upgrade Now" vs "Get Scholarships" vs "Unlock Full Access")
- Payment method order (EcoCash first vs Stripe first)

### Step 8.2: SEO Optimization

**Add to `index.html`:**
```html
<title>Scholar - Zimbabwe's #1 Student Network & Scholarship Platform</title>
<meta name="description" content="Connect with Zimbabwean students, find scholarships worth millions, join communities, and discover opportunities. Free to join!" />
<meta property="og:title" content="Scholar - Find Scholarships & Connect with Students" />
<meta property="og:image" content="/og-image.png" />
```

### Step 8.3: Performance Monitoring

```bash
npm install @sentry/react @sentry/tracing
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Week 1-2: Foundation
- [ ] Install payment dependencies
- [ ] Set up environment variables
- [ ] Create payment types
- [ ] Create subscription store
- [ ] Test local subscription logic

### Week 3-4: Premium Scholarships
- [ ] Update scholarship types with premium flags
- [ ] Build PremiumScholarshipFeatures component
- [ ] Update Scholarships page with premium tier
- [ ] Add AI matching scores (mock data)
- [ ] Test free vs premium experience

### Week 5-6: University Partnerships
- [ ] Create university partner types
- [ ] Build partner dashboard
- [ ] Add featured universities to home
- [ ] Create university onboarding flow
- [ ] Design partner pricing tiers

### Week 7-8: Payment Integration
- [ ] Set up Stripe account
- [ ] Set up Paynow account
- [ ] Build StripeCheckout component
- [ ] Build EcoCashPayment component
- [ ] Create Subscribe page
- [ ] Test payment flows end-to-end

### Week 9: Analytics
- [ ] Set up Mixpanel account
- [ ] Set up PostHog account
- [ ] Create analytics service
- [ ] Add event tracking to key actions
- [ ] Create revenue dashboard

### Week 10-12: Launch Preparation
- [ ] Update landing page
- [ ] Set up email service (Resend/SendGrid)
- [ ] Create referral system
- [ ] Build FAQ page
- [ ] Create help documentation
- [ ] Set up customer support (Intercom/Crisp)

### Week 13-14: Backend
- [ ] Choose backend (Firebase recommended)
- [ ] Set up authentication
- [ ] Set up database
- [ ] Deploy cloud functions
- [ ] Set up webhooks
- [ ] Test all integrations

### Week 15+: Growth
- [ ] Launch to 100 beta users
- [ ] Collect feedback
- [ ] Optimize conversion funnel
- [ ] A/B test pricing
- [ ] Scale to first 1000 users
- [ ] Secure first university partner
- [ ] Iterate based on data

---

## 💰 REVENUE MILESTONES

### Month 1: $500
- 10,000 registered users
- 50 paying subscribers
- 1 university partner

### Month 3: $3,000
- 25,000 users
- 200 paying subscribers
- 3 university partners
- First advertising deal

### Month 6: $10,000
- 50,000 users
- 500 paying subscribers
- 10 university partners
- 5 brand partnerships
- Marketplace launched

### Month 12: $30,000+
- 100,000 users
- 1,500 paying subscribers
- 20 university partners
- Job board active
- Regional expansion started

---

## 🎯 PRIORITY ORDER

**Do This First** (Highest ROI):
1. Premium Scholarship Tier ⭐⭐⭐⭐⭐
2. EcoCash Payment Integration ⭐⭐⭐⭐⭐
3. University Partner Dashboard ⭐⭐⭐⭐
4. Analytics Tracking ⭐⭐⭐⭐

**Do This Second** (Important):
5. Stripe Payment Integration ⭐⭐⭐
6. Referral System ⭐⭐⭐
7. Email Marketing ⭐⭐⭐

**Do Later** (Nice to Have):
8. A/B Testing
9. Advanced Analytics
10. SEO Optimization

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Don't over-engineer** - Start with mock data, add real backend later
2. **Don't launch with all features** - Focus on scholarships first
3. **Don't ignore mobile** - 90% of users are on mobile
4. **Don't skip analytics** - You need data to optimize
5. **Don't forget about support** - Have a way for users to get help
6. **Don't undervalue free tier** - Free users become paid users
7. **Don't launch without payment** - Have monetization ready day 1

---

## 📞 NEED HELP?

Each phase includes placeholder code that needs to be connected to real services. The implementation is progressive - you can launch with Phase 1-4, then add more features monthly.

**Next Step**: Start with Phase 1 this week!
