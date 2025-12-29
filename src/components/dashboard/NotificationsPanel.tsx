import React, { useState } from 'react';
import type { Notification } from '../../types/dashboard';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead
}) => {
  const [showAll, setShowAll] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment_reminder':
        return (
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'cancellation':
        return (
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'payment_update':
        return (
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      case 'feedback_request':
        return (
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const displayNotifications = showAll ? notifications : unreadNotifications.slice(0, 5);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Notifications</h2>
        <div className="flex items-center space-x-2">
          {unreadNotifications.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
              {unreadNotifications.length} new
            </span>
          )}
          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            View All
          </button>
        </div>
      </div>

      {displayNotifications.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${!notification.isRead
                ? 'bg-orange-50 border-orange-200'
                : 'bg-white border-gray-200'
                }`}
            >
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
              </div>

              {notification.actionUrl && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                    View Details →
                  </button>
                </div>
              )}
            </div>
          ))}

          {notifications.length > 5 && (
            <div className="text-center pt-3">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                {showAll ? 'Show Less' : `Show All (${notifications.length})`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Mark all as read
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};