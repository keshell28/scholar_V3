import { useState, useEffect } from 'react';
import { Search, Bookmark, BookmarkCheck, Target, TrendingUp, Crown, ExternalLink } from 'lucide-react';
import { useScholarshipStore } from '../stores/scholarshipStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { PremiumScholarshipFeatures } from '../components/PremiumScholarshipFeatures';
import { useNavigate } from 'react-router-dom';
import { analytics, EVENTS } from '../services/analytics';

export function Scholarships() {
  const navigate = useNavigate();
  const scholarships = useScholarshipStore((s) => s.scholarships);
  const { savedScholarships, saveScholarship, unsaveScholarship } = useScholarshipStore();
  const { isFeatureAvailable } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const hasPremium = isFeatureAvailable('scholarship_matching');

  useEffect(() => {
    analytics.pageView('Scholarships Page');
  }, []);

  // Filter scholarships based on subscription
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scholarship.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || scholarship.level === selectedLevel;
    
    // Free users see only non-premium scholarships
    if (!hasPremium && scholarship.isPremium) {
      return false;
    }
    
    return matchesSearch && matchesLevel;
  });

  const premiumCount = scholarships.filter(s => s.isPremium).length;
  const topMatches = hasPremium 
    ? scholarships.filter(s => s.matchScore && s.matchScore > 80).slice(0, 4)
    : [];

  const handleSaveToggle = (id: string) => {
    if (savedScholarships.includes(id)) {
      unsaveScholarship(id);
    } else {
      saveScholarship(id);
      analytics.track(EVENTS.SCHOLARSHIP_SAVED, { scholarshipId: id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Scholarship Opportunities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {hasPremium 
            ? `Full access to ${scholarships.length} scholarships` 
            : `Showing ${filteredScholarships.length} of ${scholarships.length} scholarships`}
          {!hasPremium && ` • ${premiumCount} premium scholarships available`}
        </p>
      </div>

      <PremiumScholarshipFeatures />

      {/* AI Matching - Premium Feature */}
      {hasPremium && topMatches.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-lg text-green-900 dark:text-green-100">Your Top Matches</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {topMatches.map((scholarship) => (
              <div key={scholarship.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-semibold text-sm truncate">{scholarship.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{scholarship.organization}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">{scholarship.matchScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="all">All Levels</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="postgraduate">Postgraduate</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      {/* Scholarship Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredScholarships.map((scholarship) => {
          const isSaved = savedScholarships.includes(scholarship.id);
          
          return (
            <div
              key={scholarship.id}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:border-green-500 transition cursor-pointer bg-white dark:bg-gray-800"
              onClick={() => {
                analytics.track(EVENTS.SCHOLARSHIP_VIEWED, { scholarshipId: scholarship.id });
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {scholarship.matchScore && hasPremium && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded inline-block mb-2">
                      {scholarship.matchScore}% Match
                    </span>
                  )}
                  {scholarship.competitiveness && (
                    <span className={`text-xs px-2 py-1 rounded inline-block mb-2 ml-2 ${
                      scholarship.competitiveness === 'high' 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        : scholarship.competitiveness === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    }`}>
                      {scholarship.competitiveness} competition
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToggle(scholarship.id);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{scholarship.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                {scholarship.organization || scholarship.university}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-green-600">{scholarship.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                  <span className="font-semibold">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>
                {scholarship.level && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                    <span className="capitalize">{scholarship.level}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="line-clamp-1">{scholarship.location || scholarship.country}</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                {hasPremium ? (
                  <>
                    <span>View Details & Apply</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                ) : (
                  'View Details'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Upgrade CTA for free users */}
      {!hasPremium && premiumCount > 0 && (
        <div className="mt-8 text-center p-6 sm:p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border-2 border-yellow-400">
          <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Want to see all {premiumCount} premium scholarships?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upgrade to Scholar Plus to unlock premium opportunities worth millions of dollars
          </p>
          <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
            <li className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>AI-powered scholarship matching</span>
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Application tracking & deadlines</span>
            </li>
            <li className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-green-600" />
              <span>Essay templates & CV reviews</span>
            </li>
          </ul>
          <button 
            onClick={() => navigate('/subscribe')}
            className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            Upgrade Now - $9.99/month
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No scholarships found</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
            }}
            className="text-green-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Scholarships;
