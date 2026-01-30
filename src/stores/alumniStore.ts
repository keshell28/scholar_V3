import { create } from 'zustand';
import { AlumniProfile } from '../types';

interface AlumniStore {
  alumni: AlumniProfile[];
  addAlumniProfile: (profile: AlumniProfile) => void;
  updateAlumniProfile: (profile: AlumniProfile) => void;
}

// Mock alumni profiles
const mockAlumni: AlumniProfile[] = [
  {
    id: '1',
    userId: '301',
    name: 'Tatenda Mapfumo',
    profileImage: 'https://i.pravatar.cc/150?img=22',
    university: 'University of Cape Town',
    graduationYear: 2023,
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    currentCompany: 'Amazon Web Services',
    currentPosition: 'Software Engineer',
    location: 'Cape Town, South Africa',
    bio: 'UCT grad now working at AWS. Passionate about cloud computing and mentoring aspiring developers.',
    expertise: ['Cloud Computing', 'Software Engineering', 'Career Development', 'Interview Prep'],
    willingToMentor: true,
    careerPath: ['Intern at Takealot', 'Junior Dev at Yoco', 'Software Engineer at AWS'],
    achievements: [
      'AWS Certified Solutions Architect',
      'Published research paper',
      'Hackathon Winner 2022',
    ],
    linkedIn: 'linkedin.com/in/tatendamapfumo',
    email: 'tatenda.m@example.com',
  },
  {
    id: '2',
    userId: '302',
    name: 'Rudo Chikomba',
    profileImage: 'https://i.pravatar.cc/150?img=47',
    university: 'University of Johannesburg',
    graduationYear: 2022,
    degree: 'Bachelor of Commerce',
    fieldOfStudy: 'Accounting',
    currentCompany: 'PwC',
    currentPosition: 'Senior Auditor',
    location: 'Johannesburg, South Africa',
    bio: 'Chartered Accountant helping students navigate the professional world. Happy to chat about finance careers!',
    expertise: ['Accounting', 'Auditing', 'Professional Exams', 'Career Planning'],
    willingToMentor: true,
    careerPath: ['Audit Intern at KPMG', 'Junior Auditor at PwC', 'Senior Auditor at PwC'],
    achievements: [
      'Chartered Accountant (SA)',
      'Top 10 Audit Student',
      'Board Member - Young Professionals Network',
    ],
    linkedIn: 'linkedin.com/in/rudochikomba',
  },
  {
    id: '3',
    userId: '303',
    name: 'Kudakwashe Nhamo',
    profileImage: 'https://i.pravatar.cc/150?img=56',
    university: 'Stellenbosch University',
    graduationYear: 2021,
    degree: 'Master of Business Administration',
    fieldOfStudy: 'Business Administration',
    currentCompany: 'Standard Bank',
    currentPosition: 'Investment Analyst',
    location: 'Johannesburg, South Africa',
    bio: 'MBA grad working in investment banking. Love helping students understand the finance industry.',
    expertise: ['Finance', 'Investment Banking', 'MBA Applications', 'Networking'],
    willingToMentor: true,
    careerPath: [
      'Financial Analyst at FNB',
      'Associate at Investec',
      'Investment Analyst at Standard Bank',
    ],
    achievements: [
      'CFA Level 2 Candidate',
      'MBA with Distinction',
      'Published in Financial Review',
    ],
    linkedIn: 'linkedin.com/in/kudakwashe-nhamo',
    email: 'k.nhamo@example.com',
  },
  {
    id: '4',
    userId: '304',
    name: 'Shamiso Makoni',
    profileImage: 'https://i.pravatar.cc/150?img=38',
    university: 'University of Pretoria',
    graduationYear: 2024,
    degree: 'Bachelor of Engineering',
    fieldOfStudy: 'Civil Engineering',
    currentCompany: 'Aurecon',
    currentPosition: 'Graduate Engineer',
    location: 'Pretoria, South Africa',
    bio: 'Recent engineering grad. Still remember the struggles of student life! Here to help.',
    expertise: ['Civil Engineering', 'Project Management', 'Career Transition', 'Graduate Programs'],
    willingToMentor: true,
    careerPath: ['Internship at Group Five', 'Graduate Engineer at Aurecon'],
    achievements: [
      'Engineering Council Candidate',
      'Final Year Project Award',
      'SAICE Student Member',
    ],
    linkedIn: 'linkedin.com/in/shamiso-makoni',
  },
  {
    id: '5',
    userId: '305',
    name: 'Tinotenda Zvobgo',
    profileImage: 'https://i.pravatar.cc/150?img=15',
    university: 'University of the Witwatersrand',
    graduationYear: 2020,
    degree: 'Doctor of Medicine',
    fieldOfStudy: 'Medicine',
    currentCompany: 'Chris Hani Baragwanath Hospital',
    currentPosition: 'Medical Officer',
    location: 'Johannesburg, South Africa',
    bio: 'Medical doctor passionate about healthcare and education. Survived med school and ready to help!',
    expertise: ['Medicine', 'Medical School Applications', 'Work-Life Balance', 'Residency'],
    willingToMentor: true,
    careerPath: [
      'Medical Student',
      'Intern Doctor',
      'Community Service Doctor',
      'Medical Officer',
    ],
    achievements: [
      'Registered Medical Practitioner',
      'Research Publication in SAMJ',
      'Excellence in Clinical Practice Award',
    ],
  },
];

export const useAlumniStore = create<AlumniStore>((set) => ({
  alumni: mockAlumni,

  addAlumniProfile: (profile) =>
    set((state) => ({
      alumni: [profile, ...state.alumni],
    })),

  updateAlumniProfile: (profile) =>
    set((state) => ({
      alumni: state.alumni.map((a) => (a.id === profile.id ? profile : a)),
    })),
}));
