import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Users, GraduationCap, Briefcase, Bell, MessageSquare, Search, Crown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const conversations = useChatStore((state: any) => state.conversations);
  const { unreadCount, toggleDropdown } = useNotificationStore();
  const { currentSubscription } = useSubscriptionStore();
  
  const totalUnread = conversations.reduce((sum: number, conv: any) => sum + conv.unreadCount, 0);
  const isPremium = currentSubscription?.tier !== 'free';

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/discover', label: 'Network', icon: Users },
    { path: '/scholarships', label: 'Opportunities', icon: Briefcase },
    { path: '/communities', label: 'Communities', icon: Compass },
    { path: '/recipes', label: 'Culture', icon: GraduationCap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-initial">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-[var(--color-primary-500)] rounded flex items-center justify-center">
                <span className="text-white font-bold text-base md:text-lg">S</span>
              </div>
            </Link>
            
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, opportunities..."
                className="w-48 lg:w-64 pl-10 pr-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded border-none text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              />
            </div>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center px-6 py-2 hover:text-[var(--color-primary-500)] transition-colors relative ${
                  isActive(path)
                    ? 'text-[var(--color-primary-500)]'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive(path) ? 2.5 : 2} />
                <span className="text-xs mt-0.5">{label}</span>
                {isActive(path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-500)]" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {!isPremium && (
              <Link 
                to="/subscribe" 
                className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </Link>
            )}
            
            <ThemeToggle />
            
            <Link to="/chat" className="hidden md:block relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </Link>
            
            <div className="hidden md:block relative">
              <button 
                onClick={toggleDropdown}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown />
            </div>

            {user && (
              <Link to="/profile" className="flex items-center gap-1 md:gap-2 hover:opacity-80 transition-opacity">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 dark:border-gray-700"
                />
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">Me</div>
                    {isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
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
          {navItems.map(({ path, label, icon: Icon }) => (
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
        </div>
      </div>
    </nav>
  );
}
