import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, CheckCheck, Heart, MessageCircle, Users, Award, UsersRound, AtSign, Mail } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
  const { 
    notifications, 
    isDropdownOpen, 
    setDropdownOpen, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    initializeMockData
  } = useNotificationStore();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mock data on mount
    if (notifications.length === 0) {
      initializeMockData();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, setDropdownOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'connection':
        return <Users className="h-4 w-4 text-[var(--color-primary-500)]" />;
      case 'scholarship':
        return <Award className="h-4 w-4 text-[#FFD100]" />;
      case 'community':
        return <UsersRound className="h-4 w-4 text-purple-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-orange-500" />;
      case 'message':
        return <Mail className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  if (!isDropdownOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium flex items-center gap-1"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex gap-3">
                {/* Avatar with icon badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notification.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNotification(notification.id);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </span>

                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
                        >
                          Mark read
                        </button>
                      )}
                      {notification.link && (
                        <Link
                          to={notification.link}
                          onClick={() => {
                            markAsRead(notification.id);
                            setDropdownOpen(false);
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/notifications"
            onClick={() => setDropdownOpen(false)}
            className="block text-center text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
