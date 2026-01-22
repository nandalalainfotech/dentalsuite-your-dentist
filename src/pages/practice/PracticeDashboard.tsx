/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import PracticeAppointmentsView from './PracticeAppointmentsView';
import PracticeDirectoryView from './PracticeDirectoryView';
import { Icons } from '../../components/dashboard/Icons';
import { AlertCircle, User, Calendar, LogOut, Menu, X } from 'lucide-react';
import PracticeBookingCalender from './PracticeBookingCalender';
import PracticeNewsFeeds from './PracticeNewsFeeds';
import PractiveViewProfile from './PractiveViewProfile';

type ActiveViewType = 'directory' | 'appointments' | 'bookingcalender' | 'newsfeeds' | 'viewprofile' | 'mylearningHub' | 'payments' | 'accountpayrequests' | 'supportrequest';
const isValidView = (v: any): v is ActiveViewType =>
  v === 'directory' || v === 'appointments' || v === 'bookingcalender' || v === 'newsfeeds' || v == 'viewprofile' || v == 'mylearningHub' || v == 'accountpayrequests' || v == 'supportrequest';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4
      group hover:bg-gray-50
      ${active
        ? 'border-orange-500 text-gray-900 bg-orange-50/30'
        : 'border-transparent text-gray-400 hover:text-gray-600'
      }
    `}
  >
    <div className={`${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {icon}
    </div>
    <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
      {label}
    </span>
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
    className={`
      relative pb-4 px-1 text-sm font-medium transition-all duration-200
      ${active
        ? 'text-gray-800 border-b-2 border-orange-500'
        : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
      }
    `}
  >
    <div className="flex items-center gap-2">
      {label}
      {count !== undefined && (
        <span className={`
          text-xs px-2 py-0.5 rounded-full border
          ${active
            ? 'border-orange-500 text-orange-500'
            : 'border-gray-200 text-gray-400'
          }
        `}>
          {count}
        </span>
      )}
    </div>
  </button>
);

const MobileNavDrawer: React.FC<{
  activeView: ActiveViewType;
  onNavClick: (view: ActiveViewType) => void;
  onClose: () => void;
  onLogout: () => void;
  practiceName: string;
}> = ({ activeView, onNavClick, onClose, onLogout, practiceName }) => {
  const navItems: Array<{ id: ActiveViewType | 'logout'; label: string; icon: React.ReactNode }> = [
    { id: 'directory', label: 'My Directory', icon: <User size={20} /> },
    { id: 'appointments', label: 'My Appointment', icon: <Calendar size={20} /> },
    { id: 'bookingcalender', label: 'Booking Calender', icon: <Calendar size={20} /> },
    { id: 'newsfeeds', label: 'News Feeds', icon: <Calendar size={20} /> },
    { id: 'mylearningHub', label: 'My LearningHub', icon: <Calendar size={20} /> },
    { id: 'supportrequest', label: 'Support Request', icon: <Calendar size={20} /> },
    { id: 'accountpayrequests', label: 'Account Pay Requests', icon: <Calendar size={20} /> },
    { id: 'viewprofile', label: 'View Profile', icon: <Calendar size={20} /> },
    { id: 'logout', label: 'Log Out', icon: <LogOut size={20} /> },
  ];

  const handleClick = (id: ActiveViewType | 'logout') => {
    if (id === 'logout') {
      onClose();
      onLogout();
      return;
    }
    onNavClick(id);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {practiceName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-900 truncate">{practiceName}</div>
              <div className="text-xs text-gray-500">Practice Admin</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`
                w-full flex items-center gap-4 px-6 py-4
                ${activeView === item.id ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-500'}
                ${item.id === 'logout' ? 'text-red-500 mt-4 border-t border-gray-100' : ''}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default function PracticeDashboard() {
  const { practice, logout } = usePracticeAuth();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 1) Initialize from URL or localStorage, fallback to 'appointments'
  const [activeView, setActiveView] = useState<ActiveViewType>(() => {
    if (typeof window === 'undefined') return 'appointments';

    const url = new URL(window.location.href);
    const fromSearch = url.searchParams.get('view');
    const fromHash = window.location.hash ? window.location.hash.slice(1) : null;

    if (fromSearch && isValidView(fromSearch)) return fromSearch;
    if (fromHash && isValidView(fromHash)) return fromHash;

    const saved = window.localStorage.getItem('practice:activeView');
    if (saved && isValidView(saved)) return saved;

    return 'appointments';
  });

  if (!practice) return null;

  // const badges = {
  //   appointments: 4,
  //   directory: 0
  // };

  const renderContent = () => {
    switch (activeView) {
      case 'appointments':
        return <PracticeAppointmentsView />;
      case 'bookingcalender':
        return <PracticeBookingCalender />;
      case 'newsfeeds':
        return <PracticeNewsFeeds />;
      case 'mylearningHub':
        return <PracticeNewsFeeds />;
      case 'accountpayrequests':
        return <PracticeNewsFeeds />;
      case 'supportrequest':
        return <PracticeNewsFeeds />;
      case 'viewprofile':
        return <PractiveViewProfile />;
      case 'directory':
      default:
        return <PracticeDirectoryView />;
    }
  };

  // const handleNavClick = (view: ActiveViewType) => {
  //   setActiveView(view);
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };
  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);

    if (typeof window !== 'undefined') {
      // Keep the URL in sync (no reload)
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());

      // Persist for refreshes
      window.localStorage.setItem('practice:activeView', view);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {practice.practiceName.charAt(0)}
            </div>
            <span className="font-bold text-gray-800">{practice.practiceName}</span>
          </div>
          <button onClick={() => setShowMobileNav(true)} className="text-gray-500">
            <Menu />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* --- LEFT SIDEBAR (Desktop) --- */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden sticky top-6">

              {/* Profile Section */}
              <div className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-md relative overflow-hidden">
                    <User className="text-white/90 w-8 h-8" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 mix-blend-overlay"></div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Welcome Back!</p>
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{practice.practiceName}</h2>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between px-8 mb-6">
                <div>
                  <span className="text-gray-400 text-xs font-medium">Following</span>
                  <span className="ml-1 text-orange-500 font-bold text-sm">0</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-medium">Followers</span>
                  <span className="ml-1 text-orange-500 font-bold text-sm">0</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 mx-6 mb-6"></div>

              {/* Navigation Menu */}
              <div>
                <h3 className="px-6 mb-4 text-sm font-bold text-gray-900 uppercase tracking-wide">Account info</h3>
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
                    label="My Appointment"
                    active={activeView === 'appointments'}
                    onClick={() => handleNavClick('appointments')}
                  />
                  <SidebarLink
                    icon={<Icons.Calendar />}
                    label="Booking Calender"
                    active={activeView === 'bookingcalender'}
                    onClick={() => handleNavClick('bookingcalender')}
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

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[20px] shadow-sm min-h-[600px] flex flex-col">

              {/* Tab Header - CONDITIONAL RENDERING */}
              {/* Only show the tabs if we are NOT on the booking calender */}
              {activeView !== 'bookingcalender' && activeView !== 'newsfeeds' && activeView !== 'viewprofile' && activeView !== 'mylearningHub' && activeView !== 'accountpayrequests' && activeView !== 'supportrequest' && (
                <div className="px-8 pt-8 border-b border-gray-100">
                  <div className="flex items-center gap-8">
                    <ContentTab
                      label="Directory Details"
                      active={activeView === 'directory'}
                      onClick={() => handleNavClick('directory')}
                    />
                    <ContentTab
                      label="Appointments"
                      // count={badges.appointments}
                      active={activeView === 'appointments'}
                      onClick={() => handleNavClick('appointments')}
                    />
                  </div>
                </div>
              )}

              {/* View Content */}
              <div className="p-6 lg:p-8 flex-1">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileNav && (
        <MobileNavDrawer
          activeView={activeView}
          onNavClick={handleNavClick}
          onClose={() => setShowMobileNav(false)}
          onLogout={() => setShowLogoutModal(true)}
          practiceName={practice.practiceName}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="text-red-500" size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign out?</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to sign out? You will need to log in again to access the dashboard.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowLogoutModal(false); logout(); }}
                    className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}