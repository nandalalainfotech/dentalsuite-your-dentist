/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import PracticeAppointmentsView from './PracticeAppointmentsView';
import PracticeDirectoryView from './PracticeDirectoryView';
import { Icons } from '../../components/dashboard/Icons';
// 1. Import BarChart2 for the icon
import { User, LogOut, BarChart2 } from 'lucide-react';
import PracticeBookingCalender from './PracticeBookingCalender';
import PracticeNewsFeeds from './PracticeNewsFeeds';
import PractiveViewProfile from './PractiveViewProfile';
import ConfirmLogoutModal from '../../components/layout/ConfirmLogoutModal';
import PracticeAppointmentType from './PracticeAppointmentType';
import PracticeAnalyticsView from './PracticeAnalyticsView';

// 3. Update Type Definition
type ActiveViewType =
  | 'directory'
  | 'appointments'
  | 'appointmenttype'
  | 'bookingcalender'
  | 'analytics'
  | 'newsfeeds'
  | 'viewprofile'
  | 'mylearningHub'
  | 'payments'
  | 'accountpayrequests'
  | 'supportrequest';

// 3. Update Validation Logic
const isValidView = (v: any): v is ActiveViewType =>
  [
    'directory',
    'appointments',
    'appointmenttype',
    'bookingcalender',
    'analytics',
    'newsfeeds',
    'viewprofile',
    'mylearningHub',
    'accountpayrequests',
    'supportrequest'
  ].includes(v);

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 group hover:bg-gray-50 ${active ? 'border-orange-500 text-gray-900 bg-orange-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</div>
    <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

interface ContentTabProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative pb-4 px-1 text-sm font-medium transition-all duration-200 ${active ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'}`}
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
  const { practice, logout } = usePracticeAuth();
  const [,] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const [activeView, setActiveView] = useState<ActiveViewType>('appointments');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');

    if (viewParam && isValidView(viewParam)) {
      setActiveView(viewParam);
    } else {
      setActiveView('appointments');
    }
  }, [location.search]);

  if (!practice) return null;

  // 4. Update Render Content Switch
  const renderContent = () => {
    switch (activeView) {
      case 'appointments': return <PracticeAppointmentsView />;
      case 'appointmenttype': return <PracticeAppointmentType />;
      case 'bookingcalender': return <PracticeBookingCalender />;
      case 'analytics': return <PracticeAnalyticsView />; // <-- Added here
      case 'newsfeeds': return <PracticeNewsFeeds />;
      case 'mylearningHub': return <PracticeNewsFeeds />;
      case 'accountpayrequests': return <PracticeNewsFeeds />;
      case 'supportrequest': return <PracticeNewsFeeds />;
      case 'viewprofile': return <PractiveViewProfile />;
      case 'directory': default: return <PracticeDirectoryView />;
    }
  };

  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden sticky top-18">
              {/* Profile Header */}
              <div className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-md relative overflow-hidden">
                    <User className="text-white/90 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Welcome Back!</p>
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{practice.practiceName}</h2>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <nav className="flex flex-col pb-4">
                  <SidebarLink
                    icon={<Icons.News />}
                    label="News Feeds"
                    active={activeView === 'newsfeeds'}
                    onClick={() => handleNavClick('newsfeeds')}
                  />
                  <SidebarLink
                    icon={<Icons.User />}
                    label="View Profile"
                    active={activeView === 'viewprofile'}
                    onClick={() => handleNavClick('viewprofile')}
                  />
                  <SidebarLink
                    icon={<Icons.Folder />}
                    label="My Directory"
                    active={activeView === 'directory'}
                    onClick={() => handleNavClick('directory')}
                  />
                  <SidebarLink
                    icon={<Icons.Appointment />}
                    label="Online Bookings"
                    active={activeView === 'appointments'}
                    onClick={() => handleNavClick('appointments')}
                  />
                  <SidebarLink
                    icon={<Icons.AppointmentType />}
                    label="Appointment Type"
                    active={activeView === 'appointmenttype'}
                    onClick={() => handleNavClick('appointmenttype')}
                  />
                  <SidebarLink
                    icon={<Icons.Calendar />}
                    label="Booking Calender"
                    active={activeView === 'bookingcalender'}
                    onClick={() => handleNavClick('bookingcalender')}
                  />

                  {/* 5. Added Analytics Sidebar Link */}
                  <SidebarLink
                    icon={<Icons.BarChart />}
                    label="Analytics"
                    active={activeView === 'analytics'}
                    onClick={() => handleNavClick('analytics')}
                  />

                  <SidebarLink
                    icon={<Icons.LearningHub />}
                    label="My LearningHub"
                    active={activeView === 'mylearningHub'}
                    onClick={() => handleNavClick('mylearningHub')}
                  />
                  <SidebarLink
                    icon={<Icons.AccountPay />}
                    label="Account Pay Requests"
                    active={activeView === 'accountpayrequests'}
                    onClick={() => handleNavClick('accountpayrequests')}
                  />
                  <SidebarLink
                    icon={<Icons.Support />}
                    label="Support Request"
                    active={activeView === 'supportrequest'}
                    onClick={() => handleNavClick('supportrequest')}
                  />
                  {/* Logout Action */}
                  <div className="mt-4 pt-4 border-t border-gray-50 mx-6">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium w-full py-2"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[20px] shadow-sm min-h-[600px] flex flex-col">
              {/* Only show tabs for directory/appointments */}
              {(activeView === 'appointments' || activeView === 'directory') && (
                <div className="px-8 pt-8 border-b border-gray-100">
                  <div className="flex items-center gap-8">
                    <ContentTab label="Directory Details" active={activeView === 'directory'} onClick={() => handleNavClick('directory')} />
                    <ContentTab label="Appointments" active={activeView === 'appointments'} onClick={() => handleNavClick('appointments')} />
                  </div>
                </div>
              )}
              <div className="p-6 lg:p-8 flex-1">{renderContent()}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && createPortal(
        <ConfirmLogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={logout} />,
        document.body
      )}
    </div>
  );
}