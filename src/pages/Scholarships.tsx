import { useState } from 'react';
import { Search, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { Scholarship } from '../types';

// Mock data
const mockScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Chinese Government Scholarship (CSC)',
    description: 'Full scholarship for international students to study in China. Covers tuition, accommodation, and living allowance.',
    country: 'China',
    university: 'Various Universities',
    fieldOfStudy: ['All Fields'],
    deadline: new Date('2026-03-31'),
    amount: 'Full scholarship + ¥3,000/month',
    link: 'https://www.campuschina.org',
    isVerified: true,
    requirements: [
      'Non-Chinese citizen in good health',
      'Bachelor: High school diploma',
      'Masters: Bachelor degree',
      'PhD: Master degree',
      'Good academic performance',
    ],
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Mastercard Foundation Scholars Program',
    description: 'Comprehensive scholarship for academically talented yet economically disadvantaged young Africans.',
    country: 'Multiple Countries',
    fieldOfStudy: ['All Fields'],
    deadline: new Date('2026-06-15'),
    amount: 'Full scholarship + stipend',
    link: 'https://mastercardfdn.org/all/scholars/',
    isVerified: true,
    requirements: [
      'African citizen',
      'Demonstrated financial need',
      'Strong academic record',
      'Leadership potential',
      'Commitment to giving back',
    ],
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Fulbright Foreign Student Program',
    description: 'Provides grants for graduate students, young professionals and artists to study in the United States.',
    country: 'USA',
    fieldOfStudy: ['All Fields'],
    deadline: new Date('2026-05-01'),
    amount: 'Full scholarship',
    link: 'https://foreign.fulbrightonline.org',
    isVerified: true,
    requirements: [
      'Zimbabwean citizen',
      'Bachelor degree',
      'English proficiency',
      'Leadership potential',
      'Intention to return to Zimbabwe',
    ],
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Commonwealth Scholarship',
    description: 'For students from low and middle-income Commonwealth countries to pursue Master\'s and PhD studies in the UK.',
    country: 'United Kingdom',
    fieldOfStudy: ['All Fields'],
    deadline: new Date('2026-12-15'),
    amount: 'Full scholarship',
    link: 'https://cscuk.fcdo.gov.uk',
    isVerified: true,
    requirements: [
      'Commonwealth citizen',
      'Cannot afford to study in the UK',
      'First class or upper second class degree',
      'Academic potential',
    ],
    createdAt: new Date(),
  },
];

export default function Scholarships() {
  const [scholarships] = useState(mockScholarships);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');

  const toggleSave = (id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === 'all' || s.country === filterCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Scholarships & Opportunities 🎓
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Find verified scholarships, exchange programs, and internships
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Countries</option>
              <option value="China">China</option>
              <option value="USA">USA</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Multiple Countries">Multiple Countries</option>
            </select>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredScholarships.map((scholarship) => (
            <div key={scholarship.id} className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                      {scholarship.title}
                    </h3>
                    {scholarship.isVerified && (
                      <span className="px-2 py-1 bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] text-[var(--color-primary-500)] dark:text-[var(--color-primary-300)] text-xs font-semibold rounded inline-block">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>📍 {scholarship.country}</span>
                    {scholarship.university && <span>🏫 {scholarship.university}</span>}
                    <span>💰 {scholarship.amount}</span>
                    <span className={
                      new Date(scholarship.deadline) < new Date() 
                        ? 'text-red-500 font-semibold' 
                        : 'text-yellow-600 dark:text-yellow-400 font-semibold'
                    }>
                      ⏰ Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleSave(scholarship.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {savedIds.includes(scholarship.id) ? (
                    <BookmarkCheck className="h-6 w-6 text-[var(--color-primary-500)]" />
                  ) : (
                    <Bookmark className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {scholarship.description}
              </p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {scholarship.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {scholarship.fieldOfStudy.map((field) => (
                  <span
                    key={field}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {field}
                  </span>
                ))}
              </div>

              <a
                href={scholarship.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-primary-500)] hover:text-primary-600 font-semibold"
              >
                Visit Official Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No scholarships found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
