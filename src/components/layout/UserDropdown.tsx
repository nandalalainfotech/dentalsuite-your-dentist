import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDashboard = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Avatar/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <User size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {user.firstName} {user.lastName}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleDashboard}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors flex items-center space-x-2"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;