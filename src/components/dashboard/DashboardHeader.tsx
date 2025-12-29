import React from 'react';
import type { DashboardUser } from '../../types/dashboard';

interface DashboardHeaderProps {
  user: DashboardUser;
  onBookAppointment: () => void;
  onSearchDentist: () => void;
  onViewNotifications: () => void;
  unreadCount: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onBookAppointment,
  onSearchDentist,
  onViewNotifications,
  unreadCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hi, {user.name} 👋
            </h1>
            <p className="text-gray-600">Welcome back to your dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBookAppointment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Book Appointment</span>
          </button>

          <button
            onClick={onSearchDentist}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search Dentist</span>
          </button>

          <button
            onClick={onViewNotifications}
            className="relative p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};