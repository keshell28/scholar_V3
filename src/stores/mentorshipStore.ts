import { create } from 'zustand';
import { MentorProfile, MentorshipRequest } from '../types';

interface MentorshipStore {
  mentors: MentorProfile[];
  requests: MentorshipRequest[];
  addMentorProfile: (profile: MentorProfile) => void;
  sendRequest: (request: MentorshipRequest) => void;
  respondToRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  updateMentorProfile: (profile: MentorProfile) => void;
}

// Mock mentor profiles
const mockMentors: MentorProfile[] = [
  {
    id: '1',
    userId: '101',
    name: 'Tendai Moyo',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    university: 'University of Cape Town',
    fieldOfStudy: 'Computer Science',
    yearOfStudy: 4,
    isMentor: true,
    bio: 'Final year CS student passionate about helping first-years navigate university life. Been through it all!',
    expertise: ['Programming', 'Time Management', 'Career Advice', 'Study Techniques'],
    availability: 'Weekends and Tuesday evenings',
    mentees: ['201', '202'],
    maxMentees: 5,
    rating: 4.8,
    reviewCount: 12,
    achievements: ['Dean\'s List 2024', 'Google Student Ambassador', 'Hackathon Winner'],
  },
  {
    id: '2',
    userId: '102',
    name: 'Chipo Ndlovu',
    profileImage: 'https://i.pravatar.cc/150?img=45',
    university: 'University of Johannesburg',
    fieldOfStudy: 'Medicine',
    yearOfStudy: 5,
    isMentor: true,
    bio: 'Med student who loves helping others succeed. I remember how tough first year was!',
    expertise: ['Medicine', 'Study Planning', 'Mental Health', 'Work-Life Balance'],
    availability: 'Flexible - message me anytime',
    mentees: ['203'],
    maxMentees: 3,
    rating: 5.0,
    reviewCount: 8,
    achievements: ['Top Student Award', 'Research Publication', 'Student Council President'],
  },
  {
    id: '3',
    userId: '103',
    name: 'Runako Sibanda',
    profileImage: 'https://i.pravatar.cc/150?img=33',
    university: 'University of Pretoria',
    fieldOfStudy: 'Engineering',
    yearOfStudy: 3,
    isMentor: true,
    bio: 'Engineering student passionate about mentoring. Let\'s tackle those tough subjects together!',
    expertise: ['Mathematics', 'Physics', 'Engineering', 'Problem Solving'],
    availability: 'Weekday evenings',
    mentees: ['204', '205', '206'],
    maxMentees: 6,
    rating: 4.6,
    reviewCount: 15,
    achievements: ['Engineering Excellence Award', 'Internship at Eskom'],
  },
  {
    id: '4',
    userId: '104',
    name: 'Nyasha Mutemwa',
    profileImage: 'https://i.pravatar.cc/150?img=28',
    university: 'Stellenbosch University',
    fieldOfStudy: 'Business Administration',
    yearOfStudy: 4,
    isMentor: true,
    bio: 'Business student with a passion for entrepreneurship. Happy to share what I\'ve learned!',
    expertise: ['Business', 'Entrepreneurship', 'Networking', 'Internships'],
    availability: 'Monday and Wednesday afternoons',
    maxMentees: 4,
    rating: 4.9,
    reviewCount: 10,
    achievements: ['Startup Founder', 'Business Plan Competition Winner'],
  },
];

export const useMentorshipStore = create<MentorshipStore>((set) => ({
  mentors: mockMentors,
  requests: [],

  addMentorProfile: (profile) =>
    set((state) => ({
      mentors: [profile, ...state.mentors],
    })),

  sendRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),

  respondToRequest: (requestId, status) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      ),
    })),

  updateMentorProfile: (profile) =>
    set((state) => ({
      mentors: state.mentors.map((m) =>
        m.id === profile.id ? profile : m
      ),
    })),
}));
