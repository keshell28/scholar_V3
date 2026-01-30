import { useState, useEffect } from 'react';
import { MapPin, GraduationCap, Calendar, Mail, Globe, Edit2, Check, X, Camera, Users, MessageSquare, Award, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { COUNTRIES, FIELDS_OF_STUDY, getUniversitiesByCountry } from '../data/countries-universities';

export default function Profile() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSave = () => {
    if (editedUser) {
      updateProfile(editedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const stats = [
    { label: 'Connections', value: 247, icon: Users },
    { label: 'Posts', value: 32, icon: MessageSquare },
    { label: 'Scholarships', value: 5, icon: Award },
  ];

  const activities = [
    {
      id: '1',
      type: 'post',
      title: 'Shared a post about studying abroad',
      time: '2 days ago',
    },
    {
      id: '2',
      type: 'connection',
      title: 'Connected with Tendai Moyo',
      time: '5 days ago',
    },
    {
      id: '3',
      type: 'scholarship',
      title: 'Applied for Fulbright Scholarship',
      time: '1 week ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6 sm:pb-8">
      {/* Cover Photo */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]">
        <div className="absolute inset-0 bg-black/20" />
        {isEditing && (
          <button className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors">
            <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 -mt-12 sm:-mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] rounded-full shadow-lg transition-colors">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    value={editedUser?.name || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white text-base sm:text-lg font-bold"
                    placeholder="Name"
                  />
                  
                  <select
                    value={editedUser?.country || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, country: e.target.value, university: '' })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={editedUser?.city || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, city: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                    placeholder="City"
                  />
                  
                  <select
                    value={editedUser?.university || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, university: e.target.value })}
                    disabled={!editedUser?.country}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{editedUser?.country ? 'Select University' : 'Select Country First'}</option>
                    {editedUser?.country && getUniversitiesByCountry(editedUser.country).map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={editedUser?.fieldOfStudy || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, fieldOfStudy: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Field of Study</option>
                    {FIELDS_OF_STUDY.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                  
                  <textarea
                    value={editedUser?.bio || ''}
                    onChange={(e) => setEditedUser({ ...editedUser!, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Bio"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.name}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3">
                    {user.fieldOfStudy}
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser?.university || ''}
                      onChange={(e) => setEditedUser({ ...editedUser!, university: e.target.value })}
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                      placeholder="University"
                    />
                  ) : (
                    <span>{user.university}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedUser?.city || ''}
                        onChange={(e) => setEditedUser({ ...editedUser!, city: e.target.value })}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-24 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={editedUser?.country || ''}
                        onChange={(e) => setEditedUser({ ...editedUser!, country: e.target.value })}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-24 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                        placeholder="Country"
                      />
                    </div>
                  ) : (
                    <span>{user.city}, {user.country}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Check className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-[var(--color-primary-500)]" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - About & Details */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={editedUser?.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser!, bio: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Education</h2>
                {isEditing && (
                  <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">
                    + Add
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary-500)] rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.university}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bachelor of Science in {user.fieldOfStudy}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>Year {user.yearsOfStudy} • 2022 - 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Interests & Skills */}
          <div className="space-y-6">
            {/* Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interests</h2>
                {isEditing && (
                  <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">
                    Edit
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Connection Type */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Looking For
              </h2>
              <div className="flex items-center gap-3 p-3 bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 rounded-lg">
                <Users className="h-5 w-5 text-[var(--color-primary-500)]" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {user.connectionType.replace('-', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open to connections
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Languages</h2>
                {isEditing && (
                  <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-900 dark:text-white">English</span>
                    <span className="text-sm text-gray-500">Native</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-900 dark:text-white">Shona</span>
                    <span className="text-sm text-gray-500">Native</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-900 dark:text-white">French</span>
                    <span className="text-sm text-gray-500">Intermediate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Links</h2>
                {isEditing && (
                  <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] text-sm font-medium">
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white text-sm">LinkedIn</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white text-sm">GitHub</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white text-sm">Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
