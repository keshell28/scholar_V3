import { create } from 'zustand';
import { Scholarship } from '../types';

interface ScholarshipState {
  scholarships: Scholarship[];
  savedScholarships: string[];
  filters: {
    country?: string;
    fieldOfStudy?: string;
    searchQuery?: string;
  };
  setScholarships: (scholarships: Scholarship[]) => void;
  saveScholarship: (id: string) => void;
  unsaveScholarship: (id: string) => void;
  setFilters: (filters: Partial<ScholarshipState['filters']>) => void;
}

export const useScholarshipStore = create<ScholarshipState>((set) => ({
  scholarships: [
    {
      id: '1',
      title: 'Chevening Scholarships',
      organization: 'UK Government',
      description: 'Fully-funded scholarships for future leaders to study at any UK university',
      country: 'United Kingdom',
      fieldOfStudy: ['All fields'],
      deadline: new Date('2026-11-03'),
      amount: 'Full tuition + living costs',
      link: 'https://chevening.org',
      isVerified: true,
      requirements: ['Undergraduate degree', '2+ years work experience', 'Leadership potential'],
      createdAt: new Date('2025-01-01'),
      isPremium: true,
      matchScore: 92,
      type: 'full',
      level: 'postgraduate',
      location: 'United Kingdom',
      competitiveness: 'high',
    },
    {
      id: '2',
      title: 'Mastercard Foundation Scholars Program',
      organization: 'Mastercard Foundation',
      description: 'Comprehensive scholarship for African students',
      country: 'Multiple',
      fieldOfStudy: ['All fields'],
      deadline: new Date('2026-09-30'),
      amount: '$50,000 per year',
      link: 'https://mastercardfdn.org',
      isVerified: true,
      requirements: ['African citizen', 'Academic excellence', 'Financial need'],
      createdAt: new Date('2025-01-05'),
      isPremium: true,
      matchScore: 88,
      type: 'full',
      level: 'undergraduate',
      location: 'Africa',
      competitiveness: 'high',
    },
    {
      id: '3',
      title: 'ZESA Engineering Scholarship',
      organization: 'ZESA Holdings',
      description: 'Scholarship for Zimbabwean engineering students',
      country: 'Zimbabwe',
      university: 'University of Zimbabwe',
      fieldOfStudy: ['Engineering', 'Electrical Engineering'],
      deadline: new Date('2026-08-15'),
      amount: '$5,000',
      link: 'https://zesa.co.zw',
      isVerified: true,
      requirements: ['Zimbabwean citizen', 'Engineering student', 'Good academic record'],
      createdAt: new Date('2025-01-10'),
      isPremium: false,
      matchScore: 75,
      type: 'partial',
      level: 'undergraduate',
      location: 'Zimbabwe',
      competitiveness: 'medium',
    },
    {
      id: '4',
      title: 'Rhodes Scholarship',
      organization: 'Rhodes Trust',
      description: 'Prestigious scholarship to study at Oxford University',
      country: 'United Kingdom',
      university: 'University of Oxford',
      fieldOfStudy: ['All fields'],
      deadline: new Date('2026-10-01'),
      amount: 'Full funding',
      link: 'https://rhodeshouse.ox.ac.uk',
      isVerified: true,
      requirements: ['Outstanding academic achievement', 'Leadership', 'Commitment to service'],
      createdAt: new Date('2025-01-15'),
      isPremium: true,
      matchScore: 85,
      type: 'full',
      level: 'postgraduate',
      location: 'United Kingdom',
      competitiveness: 'high',
    },
    {
      id: '5',
      title: 'African Development Bank Scholarship',
      organization: 'African Development Bank',
      description: 'Scholarships for African students in development fields',
      country: 'Multiple',
      fieldOfStudy: ['Economics', 'Development Studies', 'Public Policy'],
      deadline: new Date('2026-07-31'),
      amount: '$15,000',
      link: 'https://afdb.org',
      isVerified: true,
      requirements: ['African citizen', 'Academic merit'],
      createdAt: new Date('2025-01-20'),
      isPremium: false,
      matchScore: 70,
      type: 'partial',
      level: 'postgraduate',
      location: 'Africa',
      competitiveness: 'medium',
    },
    {
      id: '6',
      title: 'Commonwealth Scholarship',
      organization: 'Commonwealth Scholarship Commission',
      description: 'Scholarships for Commonwealth country students',
      country: 'United Kingdom',
      fieldOfStudy: ['All fields'],
      deadline: new Date('2026-12-15'),
      amount: 'Full tuition + stipend',
      link: 'https://cscuk.fcdo.gov.uk',
      isVerified: true,
      requirements: ['Commonwealth citizen', 'Strong academic record'],
      createdAt: new Date('2025-01-25'),
      isPremium: true,
      matchScore: 80,
      type: 'full',
      level: 'postgraduate',
      location: 'United Kingdom',
      competitiveness: 'high',
    },
  ],
  savedScholarships: [],
  filters: {},
  setScholarships: (scholarships) => set({ scholarships }),
  saveScholarship: (id) =>
    set((state) => ({
      savedScholarships: [...state.savedScholarships, id],
    })),
  unsaveScholarship: (id) =>
    set((state) => ({
      savedScholarships: state.savedScholarships.filter((sid) => sid !== id),
    })),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
