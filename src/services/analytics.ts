// Analytics service for tracking user behavior and revenue
class AnalyticsService {
  private initialized = false;

  init() {
    if (this.initialized) return;
    console.log('📊 Analytics initialized (Demo mode)');
    this.initialized = true;
  }

  // Track events
  track(eventName: string, properties?: Record<string, any>) {
    console.log('📊 Event:', eventName, properties);
  }

  // Identify user
  identify(userId: string, traits?: Record<string, any>) {
    console.log('👤 User identified:', userId, traits);
  }

  // Track page view
  pageView(pageName: string) {
    this.track('Page View', { page: pageName });
  }

  // Revenue tracking
  trackRevenue(amount: number, properties?: Record<string, any>) {
    console.log('💰 Revenue:', amount, properties);
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
