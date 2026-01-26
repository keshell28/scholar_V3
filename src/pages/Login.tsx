import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    university: '',
    country: '',
    city: '',
    fieldOfStudy: '',
  });

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - replace with real auth later
    const mockUser = {
      id: '1',
      name: formData.name || 'Demo User',
      email: formData.email,
      university: formData.university || 'University of Zimbabwe',
      fieldOfStudy: formData.fieldOfStudy || 'Computer Science',
      country: formData.country || 'Zimbabwe',
      city: formData.city || 'Harare',
      bio: 'Zimbabwean student abroad',
      profileImage: `https://i.pravatar.cc/150?u=${formData.email}`,
      connectionType: 'friendship' as const,
      interests: ['Technology', 'Culture', 'Music'],
      yearsOfStudy: 2,
    };

    login(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[#FFD100] flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary-500)] mb-2">Scholar</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Connect with Zimbabwean students worldwide 🇿🇼
          </p>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
              !isSignup
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <LogIn className="inline mr-2 h-4 w-4" />
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              isSignup
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <UserPlus className="inline mr-2 h-4 w-4" />
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required={isSignup}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {isSignup && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required={isSignup}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                    placeholder="China"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required={isSignup}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                    placeholder="Shanghai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  University
                </label>
                <input
                  type="text"
                  required={isSignup}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                  placeholder="University of Zimbabwe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  required={isSignup}
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                  placeholder="Computer Science"
                />
              </div>
            </>
          )}

          <button type="submit" className="w-full btn-primary">
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
