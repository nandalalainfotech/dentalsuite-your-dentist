/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../../features/auth/auth.hooks';
import { useDashboard } from '../../../../features/dashboard/dashboard.hooks';
import PracticeSidebar from './PracticeSidebar';
import ConfirmLogoutModal from '../../../../components/layout/ConfirmLogoutModal';

// New Hooks

// --- Components ---
interface ContentTabProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative pb-4 px-1 text-sm font-medium transition-all duration-200 ${active
      ? 'text-gray-800 border-b-2 border-orange-500'
      : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
      }`}
  >
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${active ? 'border-orange-500 text-orange-500' : 'border-gray-200 text-gray-400'}`}>
          {count}
        </span>
      )}
    </div>
  </button>
);

export default function PracticeDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Use new Auth Hook for Logout
  const { handleLogout, user: authUser } = useAuth();

  // 2. Use new Dashboard Hook for Profile Data
  const { profile, loading } = useDashboard();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Loading State
  if (loading && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
      </div>
    );
  }
  const DEFAULT_LOGO = "https://cdn-icons-png.flaticon.com/512/377/377429.png";
  const logoUrl = (profile?.logo && profile.logo !== "")
    ? profile.logo
    : DEFAULT_LOGO;

  const businessName = profile?.practiceName || authUser?.practiceName || "My Practice";

  const isTabbedView = location.pathname.includes('/directory') || location.pathname.includes('/appointments');

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- LEFT SIDEBAR COLUMN --- */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-[20px] shadow-sm overflow-hidden sticky top-26">

            {/* PROFILE SECTION */}
            <div className="hidden lg:flex flex-col p-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-14 rounded-full flex items-center justify-center shadow-md relative overflow-hidden bg-gray-100">
                  {/* Fixed Image Tag */}
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="w-10 h-10 sm:w-16 sm:h-14 rounded-full flex-shrink-0 object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Welcome Back!</p>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight truncate max-w-[150px]">
                    {businessName}
                  </h2>
                </div>
              </div>
            </div>

            {/* NAVIGATION LINKS */}
            <PracticeSidebar
              practiceId={profile?.id ?? ""}
              onLogout={() => setShowLogoutModal(true)}
            />
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-[20px] shadow-sm min-h-[600px] flex flex-col">

            {isTabbedView && (
              <div className="px-8 pt-8 border-b border-gray-100 overflow-x-auto">
                <div className="flex items-center gap-8 min-w-max">
                  <ContentTab
                    label="Directory Details"
                    active={location.pathname.includes('/directory')}
                    onClick={() => navigate('directory')}
                  />
                  <ContentTab
                    label="Online Bookings"
                    active={location.pathname.includes('/appointments')}
                    onClick={() => navigate('appointments')}
                  />
                </div>
              </div>
            )}

            <div className="p-4 lg:p-6 flex-1">
              <Outlet />
            </div>

          </div>
        </main>
      </div>

      {showLogoutModal &&
        createPortal(
          <ConfirmLogoutModal
            open={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
          />,
          document.body
        )}
    </div>
  );
}