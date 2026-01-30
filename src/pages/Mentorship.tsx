import { useState } from 'react';
import { useMentorshipStore } from '../stores/mentorshipStore';
import { useAuthStore } from '../stores/authStore';
import { MentorProfile } from '../types';

export default function Mentorship() {
  const { mentors, sendRequest } = useMentorshipStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.fieldOfStudy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesField =
      fieldFilter === 'all' || mentor.fieldOfStudy === fieldFilter;

    const matchesYear =
      yearFilter === 'all' || mentor.yearOfStudy.toString() === yearFilter;

    return matchesSearch && matchesField && matchesYear;
  });

  const fields = [...new Set(mentors.map((m) => m.fieldOfStudy))];

  const handleRequestMentor = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
  };

  const handleSendRequest = () => {
    if (!user || !selectedMentor) return;

    sendRequest({
      id: Date.now().toString(),
      menteeId: user.id,
      menteeName: user.name,
      menteeImage: user.profileImage,
      mentorId: selectedMentor.id,
      status: 'pending',
      message: requestMessage,
      createdAt: new Date(),
    });

    setSelectedMentor(null);
    setRequestMessage('');
    alert('Mentorship request sent! The mentor will review your request.');
  };

  const MentorCard = ({ mentor }: { mentor: MentorProfile }) => {
    const spotsLeft = mentor.maxMentees
      ? mentor.maxMentees - (mentor.mentees?.length || 0)
      : undefined;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-start space-x-4">
          <img
            src={mentor.profileImage}
            alt={mentor.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mentor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Year {mentor.yearOfStudy} • {mentor.fieldOfStudy}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.university}
                </p>
              </div>
              {mentor.rating && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                    {mentor.rating}
                  </span>
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({mentor.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
              {mentor.bio}
            </p>

            {/* Expertise Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {mentor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Achievements */}
            {mentor.achievements && mentor.achievements.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Achievements:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {mentor.achievements.slice(0, 2).map((achievement, idx) => (
                    <li key={idx}>• {achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Availability */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Availability:</span> {mentor.availability}
              </div>
              {spotsLeft !== undefined && (
                <div className="text-sm text-gray-900 dark:text-white">
                  {spotsLeft > 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {spotsLeft} spots left
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Full
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => handleRequestMentor(mentor)}
              disabled={spotsLeft === 0}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                spotsLeft === 0
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {spotsLeft === 0 ? 'Not Available' : 'Request Mentorship'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#1D1D1F] via-[#2C2C2E] to-[#007AFF] text-white py-20 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#007AFF]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[1.2rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl border border-white/20">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-6xl font-bold tracking-tight text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Mentorship</h1>
              <p className="text-white/80 text-lg mt-2 font-medium">Learn from experience</p>
            </div>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mb-8 leading-relaxed font-light">
            Connect with senior students for guidance on academics, career planning, and university life
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-[#FF9F0A] rounded-full"></div>
              <span className="font-semibold text-white">{mentors.length} Active Mentors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <span className="font-semibold text-white">Free Program</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <span className="font-semibold text-white">Instant Connect</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <svg
              className="w-6 h-6 text-blue-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                How it works
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Browse mentors, send a request, and connect with experienced students who can guide you through university life, academics, and career planning.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by name, field, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
          />

          <div className="flex flex-wrap gap-4">
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Fields</option>
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Years</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year+</option>
            </select>
          </div>
        </div>

        {/* Mentors List */}
        <div className="space-y-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No mentors found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Request Mentorship
            </h2>
            <div className="flex items-center mb-4">
              <img
                src={selectedMentor.profileImage}
                alt={selectedMentor.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedMentor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMentor.fieldOfStudy}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Why would you like {selectedMentor.name} as your mentor?
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                placeholder="Introduce yourself and explain what you hope to learn..."
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSendRequest}
                disabled={!requestMessage.trim()}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setSelectedMentor(null);
                  setRequestMessage('');
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
