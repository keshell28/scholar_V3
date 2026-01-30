import { useState } from 'react';
import { useAlumniStore } from '../stores/alumniStore';
import { AlumniProfile } from '../types';

export default function AlumniNetwork() {
  const { alumni } = useAlumniStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [mentorOnly, setMentorOnly] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.currentCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.currentPosition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesField = fieldFilter === 'all' || alum.fieldOfStudy === fieldFilter;

    const matchesLocation =
      locationFilter === 'all' || alum.location.includes(locationFilter);

    const matchesMentor = !mentorOnly || alum.willingToMentor;

    return matchesSearch && matchesField && matchesLocation && matchesMentor;
  });

  const fields = [...new Set(alumni.map((a) => a.fieldOfStudy))];
  const locations = [...new Set(alumni.map((a) => a.location.split(',')[1]?.trim() || a.location))];

  const AlumniCard = ({ alum }: { alum: AlumniProfile }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={alum.profileImage}
          alt={alum.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {alum.name}
              </h3>
              {alum.currentPosition && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {alum.currentPosition}
                </p>
              )}
              {alum.currentCompany && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {alum.currentCompany}
                </p>
              )}
            </div>
            {alum.willingToMentor && (
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                Willing to Mentor
              </span>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Education:</span> {alum.degree} in{' '}
              {alum.fieldOfStudy}
            </p>
            <p>
              <span className="font-medium">Graduated:</span> {alum.graduationYear} •{' '}
              {alum.university}
            </p>
            <p>
              <span className="font-medium">Location:</span> {alum.location}
            </p>
          </div>

          <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">{alum.bio}</p>

          {/* Expertise */}
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Expertise:
            </p>
            <div className="flex flex-wrap gap-2">
              {alum.expertise.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Career Path */}
          {alum.careerPath && alum.careerPath.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Career Journey:
              </p>
              <div className="space-y-1">
                {alum.careerPath.map((step, idx) => (
                  <div key={idx} className="flex items-start text-xs text-gray-600 dark:text-gray-400">
                    <span className="mr-2">→</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {alum.achievements && alum.achievements.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Achievements:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {alum.achievements.slice(0, 3).map((achievement, idx) => (
                  <li key={idx}>• {achievement}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSelectedAlumni(alum)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              View Full Profile
            </button>
            {alum.linkedIn && (
              <a
                href={`https://${alum.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#5856D6] via-[#007AFF] to-[#5AC8FA] text-white py-20 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[1.2rem] bg-white/15 backdrop-blur-2xl flex items-center justify-center shadow-2xl border border-white/20">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-6xl font-bold tracking-tight text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Alumni Network</h1>
              <p className="text-white/80 text-lg mt-2 font-medium">Build your future</p>
            </div>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mb-8 leading-relaxed font-light">
            Connect with successful graduates for career advice, industry insights, and professional networking
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-[#5AC8FA] rounded-full"></div>
              <span className="font-semibold text-white">{alumni.length} Alumni</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <span className="font-semibold text-white">Career Guidance</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <span className="font-semibold text-white">Global Network</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-500 p-4 mb-6">
          <div className="flex">
            <svg
              className="w-6 h-6 text-purple-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Why Connect with Alumni?
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                Alumni can provide insights about career paths, job opportunities, industry advice, and help you navigate your professional journey.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by name, company, position, or expertise..."
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
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <label className="flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={mentorOnly}
                onChange={(e) => setMentorOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-2"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                Willing to mentor only
              </span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">{alumni.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Alumni</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">
              {alumni.filter((a) => a.willingToMentor).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Available Mentors
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">
              {fields.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fields Represented</div>
          </div>
        </div>

        {/* Alumni List */}
        <div className="space-y-6">
          {filteredAlumni.map((alum) => (
            <AlumniCard key={alum.id} alum={alum} />
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No alumni found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Alumni Profile
              </h2>
              <button
                onClick={() => setSelectedAlumni(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <img
                src={selectedAlumni.profileImage}
                alt={selectedAlumni.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedAlumni.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedAlumni.currentPosition}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedAlumni.currentCompany}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedAlumni.location}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About</h4>
                <p className="text-gray-700 dark:text-gray-300">{selectedAlumni.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Education
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedAlumni.degree} in {selectedAlumni.fieldOfStudy}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {selectedAlumni.university} • Class of {selectedAlumni.graduationYear}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Career Path
                </h4>
                <div className="space-y-2">
                  {selectedAlumni.careerPath.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="mr-2">→</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Achievements
                </h4>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                  {selectedAlumni.achievements.map((achievement, idx) => (
                    <li key={idx}>• {achievement}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedAlumni.email && (
                  <a
                    href={`mailto:${selectedAlumni.email}`}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                  >
                    Send Email
                  </a>
                )}
                {selectedAlumni.linkedIn && (
                  <a
                    href={`https://${selectedAlumni.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
