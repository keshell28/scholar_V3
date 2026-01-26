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
  currentSubscription: {
    id: 'demo-sub-1',
    userId: 'demo-user',
    tier: 'free',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    autoRenew: false,
  },
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
