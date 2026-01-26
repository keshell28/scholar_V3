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
