import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { scaleIn, fadeInUp } from '../utils/animations';
import toast from 'react-hot-toast';
import api from '../services/api';
import { COUNTRIES, FIELDS_OF_STUDY, getUniversitiesByCountry } from '../data/countries-universities';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const body = isSignup 
        ? {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            university: formData.university,
            fieldOfStudy: formData.fieldOfStudy,
            country: formData.country,
            city: formData.city
          }
        : {
            email: formData.email,
            password: formData.password
          };

      const response = await api.post(endpoint, body);
      const data = response.data;

      if (isSignup) {
        // Signup successful - automatically login with the returned token and user
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          login(data.user, data.token);
          toast.success('Welcome to Scholar! 🎉');
          navigate('/home');
        } else {
          // Fallback: show message and switch to login
          toast.success('Account created successfully! Please login to continue.');
          setIsSignup(false);
          setFormData({
            email: formData.email, // Keep email for convenience
            password: '',
            name: '',
            university: '',
            country: '',
            city: '',
            fieldOfStudy: '',
          });
        }
      } else {
        // Login successful - store token and navigate
        localStorage.setItem('token', data.token);
        login(data.user, data.token);
        toast.success('Welcome back!');
        navigate('/home');
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errorMsg);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-900 overflow-y-auto">
        <motion.div 
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="max-w-md w-full my-auto">
          
          {/* Logo & Header */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary-500)] mb-2">
              {isSignup ? 'Join Scholar!' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignup 
                ? 'Create your account and connect with Zimbabwean students worldwide 🇿🇼' 
                : 'Login to your account and continue your journey'}
            </p>
          </motion.div>

          {/* Tab Switcher */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSignup(false)}
              type="button"
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors ${
                !isSignup
                  ? 'bg-[var(--color-primary-500)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LogIn className="inline mr-2 h-4 w-4" />
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSignup(true)}
              type="button"
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors ${
                isSignup
                  ? 'bg-[var(--color-primary-500)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <UserPlus className="inline mr-2 h-4 w-4" />
              Sign Up
            </motion.button>
          </motion.div>

          {/* Form */}
          <motion.form 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isSignup && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <select
                    required={isSignup}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, university: '' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
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
                <select
                  required={isSignup}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  disabled={!formData.country}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{formData.country ? 'Select University' : 'Select Country First'}</option>
                  {formData.country && getUniversitiesByCountry(formData.country).map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field of Study
                </label>
                <select
                  required={isSignup}
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Field of Study</option>
                  {FIELDS_OF_STUDY.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignup ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </motion.button>
        </motion.form>

        <motion.p 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[#FFD100] items-center justify-center p-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD100]/10 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-white max-w-lg">
          
          {/* Animated circle loader */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full mb-8" 
          />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Connecting Zimbabwean students worldwide
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
            Join thousands of Zimbabwean students studying abroad. Discover opportunities, share experiences, and build meaningful connections across the globe.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Discover Scholarships</h3>
                <p className="text-white/80">Access curated scholarship opportunities worldwide</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Build Your Network</h3>
                <p className="text-white/80">Connect with fellow students at top universities</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Share Culture & Recipes</h3>
                <p className="text-white/80">Keep Zimbabwean culture alive, wherever you are</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm">
              Trusted by students at Harvard, Oxford, Tsinghua, and 200+ universities worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
