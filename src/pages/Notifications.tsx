import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Users, Award, UsersRound, AtSign, Mail, Trash2, Check } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    initializeMockData
  } = useNotificationStore();

  useEffect(() => {
    // Initialize mock data on mount
    if (notifications.length === 0) {
      initializeMockData();
    }
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'connection':
        return <Users className="h-5 w-5 text-[var(--color-primary-500)]" />;
      case 'scholarship':
        return <Award className="h-5 w-5 text-[#FFD100]" />;
      case 'community':
        return <UsersRound className="h-5 w-5 text-purple-500" />;
      case 'mention':
        return <AtSign className="h-5 w-5 text-orange-500" />;
      case 'message':
        return <Mail className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            {unreadNotifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs sm:text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium flex items-center gap-2"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                Mark all as read
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
              NEW
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-blue-50 dark:bg-blue-900/10"
                >
                  <div className="flex gap-2 sm:gap-4">
                    {/* Avatar with icon badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
                        >
                          Mark as read
                        </button>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
              EARLIER
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
              {readNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Avatar with icon badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You have no notifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
