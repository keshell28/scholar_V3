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
