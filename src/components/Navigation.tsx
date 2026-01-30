import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Users, GraduationCap, Briefcase, Bell, MessageSquare, Search, Crown, Globe2, ChevronDown, Calendar, UserCheck, Award } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pulseBadge } from '../utils/animations';

export default function Navigation() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const conversations = useChatStore((state: any) => state.conversations);
  const { unreadCount, toggleDropdown } = useNotificationStore();
  const { currentSubscription } = useSubscriptionStore();
  const [showGlobalMenu, setShowGlobalMenu] = useState(false);
  
  const totalUnread = conversations.reduce((sum: number, conv: any) => sum + conv.unreadCount, 0);
  const isPremium = currentSubscription?.tier !== 'free';

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/communities', label: 'Communities', icon: Users },
    { path: '/scholarships', label: 'Scholarships', icon: Briefcase },
    { path: '/recipes', label: 'Recipes', icon: GraduationCap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-initial min-w-0">
            <Link to="/home" className="flex items-center flex-shrink-0">
              <div className="w-9 h-9 bg-[var(--color-primary-500)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            </Link>
            
            <div className="hidden lg:block relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search students, opportunities..."
                className="w-56 xl:w-72 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              />
            </div>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center px-3 lg:px-5 py-2 hover:text-[var(--color-primary-500)] transition-colors ${
                    isActive(path)
                      ? 'text-[var(--color-primary-500)]'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive(path) ? 2.5 : 2} />
                  <span className="text-xs mt-0.5 font-medium whitespace-nowrap">{label}</span>
                </motion.div>
                {isActive(path) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-500)]" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Global Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowGlobalMenu(true)}
              onMouseLeave={() => setShowGlobalMenu(false)}
            >
              <button
                className={`flex flex-col items-center px-3 lg:px-5 py-2 hover:text-[var(--color-primary-500)] transition-colors relative ${
                  ['/events', '/mentorship', '/alumni'].includes(location.pathname)
                    ? 'text-[var(--color-primary-500)]'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Globe2 className="h-5 w-5" strokeWidth={['/events', '/mentorship', '/alumni'].includes(location.pathname) ? 2.5 : 2} />
                <div className="flex items-center gap-0.5">
                  <span className="text-xs mt-0.5 font-medium whitespace-nowrap">Global</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
                {['/events', '/mentorship', '/alumni'].includes(location.pathname) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-500)]" />
                )}
              </button>
              
              {showGlobalMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[180px] z-50 animate-fadeIn origin-top">
                  <Link
                    to="/events"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:pl-5"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </Link>
                  <Link
                    to="/mentorship"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:pl-5"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Mentorship</span>
                  </Link>
                  <Link
                    to="/alumni"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:pl-5"
                  >
                    <Award className="h-4 w-4" />
                    <span>Alumni Network</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
            {!isPremium && (
              <Link to="/subscribe" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm shadow-sm"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </motion.div>
              </Link>
            )}
            
            <ThemeToggle />
            
            <Link to="/chat" className="hidden md:block relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {totalUnread > 0 && (
                <motion.span 
                  variants={pulseBadge}
                  animate="animate"
                  className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </motion.span>
              )}
            </Link>
            
            <div className="hidden md:block relative flex-shrink-0">
              <button 
                onClick={toggleDropdown}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <motion.span 
                    variants={pulseBadge}
                    animate="animate"
                    className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>
              <NotificationDropdown />
            </div>

            {user && (
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 ml-1">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Me</div>
                    {isPremium && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-bottom">
        <div className="flex items-center justify-around px-1">
          {navItems.slice(0, 4).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-2 flex-1 max-w-[80px] ${
                isActive(path)
                  ? 'text-[var(--color-primary-500)]'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={isActive(path) ? 2.5 : 2} />
              <span className="text-[10px] sm:text-xs mt-1 truncate w-full text-center">{label}</span>
            </Link>
          ))}
          
          {/* Global Button - Mobile */}
          <button
            onClick={() => setShowGlobalMenu(!showGlobalMenu)}
            className={`flex flex-col items-center py-2 px-2 flex-1 max-w-[80px] ${
              ['/events', '/mentorship', '/alumni'].includes(location.pathname)
                ? 'text-[var(--color-primary-500)]'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Globe2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={['/events', '/mentorship', '/alumni'].includes(location.pathname) ? 2.5 : 2} />
            <span className="text-[10px] sm:text-xs mt-1 truncate w-full text-center">Global</span>
          </button>
        </div>
        
        <AnimatePresence>
          {showGlobalMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2">
              <Link
                to="/events"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 transition-all duration-200 hover:pl-5"
                onClick={() => setShowGlobalMenu(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[var(--color-primary-600)]" />
                </div>
                <div>
                  <div className="font-medium">Events</div>
                  <div className="text-xs text-gray-500">Student meetups & parties</div>
                </div>
              </Link>
              <Link
                to="/mentorship"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 transition-all duration-200 hover:pl-5"
                onClick={() => setShowGlobalMenu(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-[var(--color-primary-600)]" />
                </div>
                <div>
                  <div className="font-medium">Mentorship</div>
                  <div className="text-xs text-gray-500">Connect with senior students</div>
                </div>
              </Link>
              <Link
                to="/alumni"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:pl-5"
                onClick={() => setShowGlobalMenu(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] flex items-center justify-center">
                  <Award className="h-5 w-5 text-[var(--color-primary-600)]" />
                </div>
                <div>
                  <div className="font-medium">Alumni Network</div>
                  <div className="text-xs text-gray-500">Career advice from graduates</div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
