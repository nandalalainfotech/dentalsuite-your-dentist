import React, { useState } from 'react';
import { Appointments } from '../components/dashboard/Appointments';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { PaymentsSummary } from '../components/dashboard/PaymentsSummary';
import { FamilyMembers } from '../components/dashboard/FamilyMembers';
import { ProfileCompletionStatus } from '../components/dashboard/ProfileCompletionStatus';
import { HelpAndSupport } from '../components/dashboard/HelpAndSupport';
import { useDashboardData } from '../hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';

// Modern icon set
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Card: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Family: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Help: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, badge, onClick, className }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-4 py-3.5
      transition-all duration-200 group relative overflow-hidden
      ${active
        ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600'
        : 'text-gray-700 hover:bg-gray-50/80'
      }
      ${className || ''}
    `}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600" />
    )}

    <div className="flex items-center gap-3 relative z-10">
      <div className={`
        p-2 rounded-lg transition-all duration-200
        ${active
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        }
      `}>
        {icon}
      </div>
      <span className={`font-medium text-sm ${active ? 'font-semibold' : ''}`}>
        {label}
      </span>
    </div>

    <div className="flex items-center gap-2">
      {badge && (
        <span className={`
          text-xs font-bold px-2.5 py-1 rounded-full min-w-6 text-center
          transition-all duration-200
          ${active
            ? 'bg-orange-500 text-white shadow-sm'
            : 'bg-orange-100 text-orange-600'
          }
        `}>
          {badge}
        </span>
      )}
      <div className={`transition-transform duration-200 ${active ? 'translate-x-0.5' : ''}`}>
        <Icons.ChevronRight />
      </div>
    </div>
  </button>
);

// Security Settings Component
const SecuritySettings: React.FC<{
  onChangePassword: () => void;
  onEnable2FA: () => void;
}> = ({ onChangePassword, onEnable2FA }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Icons.Shield />
          Security Settings
        </h2>
        <p className="text-gray-600">
          Manage your account security and authentication preferences
        </p>
      </div>

      <div className="grid gap-4">
        {/* Change Password Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icons.Key />
                </div>
                <h3 className="font-semibold text-gray-900">Change Password</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Update your password regularly to keep your account secure
              </p>
              <p className="text-xs text-gray-500">
                Last changed: 30 days ago
              </p>
            </div>
            <button
              onClick={onChangePassword}
              className="ml-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
            >
              Change
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icons.Shield />
                </div>
                <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                {twoFactorEnabled && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Icons.CheckCircle />
                    Enabled
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Add an extra layer of security to your account with 2FA
              </p>
              <p className="text-xs text-gray-500">
                {twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Recommended for enhanced security'}
              </p>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                onEnable2FA();
              }}
              className={`ml-4 px-4 py-2 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow ${twoFactorEnabled
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Icons.Sparkles />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Security Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use a strong, unique password with at least 12 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Enable two-factor authentication for maximum security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Never share your password with anyone</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Navigation Component
const MobileNav: React.FC<{
  activeView: string;
  onNavClick: (view: string) => void;
  onClose: () => void;
  user: user;
  unreadCount: number;
}> = ({ activeView, onNavClick, onClose, user, unreadCount }) => {
  const navigate = useNavigate();

  const handleNavClick = (view: string) => {
    if (view === 'logout') {
      navigate('/');
      return;
    }
    onNavClick(view);
    onClose();
  };

  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: <Icons.Calendar /> },
    { id: 'notifications', label: 'Notifications', icon: <Icons.Bell />, badge: unreadCount },
    { id: 'payments', label: 'Payments', icon: <Icons.Card /> },
    { id: 'profile', label: 'Profile', icon: <Icons.User /> },
    { id: 'security', label: 'Security', icon: <Icons.Shield />, badge: 'New' },
    { id: 'family', label: 'Family Members', icon: <Icons.Family /> },
    { id: 'help', label: 'Help Centre', icon: <Icons.Help /> },
    { id: 'logout', label: 'Log Out', icon: <Icons.Logout /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <Icons.Close />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>

          {/* Profile Progress */}
          {user?.profileCompletion !== undefined && (
            <div className="mt-4 p-3 bg-white rounded-xl">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-600 font-medium">Profile Complete</span>
                <span className="font-bold text-orange-600">{user.profileCompletion}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${user.profileCompletion}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto h-[calc(100vh-250px)]">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-6 py-4
                transition-all duration-200
                ${activeView === item.id
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 border-l-4 border-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${index !== navItems.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              <span className={activeView === item.id ? 'text-orange-600' : 'text-gray-600'}>
                {item.icon}
              </span>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`
                  text-xs font-bold px-2 py-1 rounded-full
                  ${activeView === item.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-orange-600'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

type ActiveViewType = 'appointments' | 'notifications' | 'payments' | 'profile' | 'family' | 'help' | 'security';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Get data from API hook
  const {
    dashboardUser,
    appointments,
    payments,
    notifications,
    familyMembers,
    updateAppointments,
    updateNotifications,
    updateFamilyMembers
  } = useDashboardData();

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeView, setActiveView] = useState<ActiveViewType>('appointments');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Handle navigation
  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Event handlers
  const handleBookAppointment = () => navigate('/booking');
  const handleContactSupport = () => console.log('Contact support');
  const handleSubmitFeedback = () => {
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };
  const handleRescheduleAppointment = (appointmentId: string) => console.log('Reschedule:', appointmentId);
  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    updateNotifications(updatedNotifications);
  };
  const handleDownloadInvoice = (paymentId: string) => console.log('Download invoice:', paymentId);
  const handleAddFamilyMember = () => {
    const newFamilyMembers = [
      ...familyMembers,
      { id: String(Date.now()), name: 'New Member', relationship: 'child' as const, isActive: false }
    ];
    updateFamilyMembers(newFamilyMembers);
  };
  const handleSwitchActiveMember = (memberId: string) => {
    const updatedFamilyMembers = familyMembers.map(m => ({
      ...m,
      isActive: m.id === memberId
    }));
    updateFamilyMembers(updatedFamilyMembers);
  };
  const handleEditMember = (memberId: string) => console.log('Edit member:', memberId);
  const handleDeleteMember = (memberId: string) => {
    const updatedFamilyMembers = familyMembers.filter(m => m.id !== memberId);
    updateFamilyMembers(updatedFamilyMembers);
  };
  const handleCompleteProfile = () => console.log('Complete profile');
  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    );
    updateAppointments(updatedAppointments);
  };
  const handleChangePassword = () => console.log('Change password clicked');
  const handleEnable2FA = () => console.log('Enable 2FA clicked');

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Navigation items configuration
  const navItems = [
    { id: 'appointments' as ActiveViewType, label: 'Appointments', icon: <Icons.Calendar />, badge: appointments.filter(a => a.status === 'pending').length || undefined },
    { id: 'notifications' as ActiveViewType, label: 'Notifications', icon: <Icons.Bell />, badge: unreadNotifications || undefined },
    { id: 'payments' as ActiveViewType, label: 'Payments', icon: <Icons.Card /> },
    { id: 'profile' as ActiveViewType, label: 'Profile', icon: <Icons.User /> },
    { id: 'security' as ActiveViewType, label: 'Security', icon: <Icons.Shield />, badge: 'New' },
    { id: 'family' as ActiveViewType, label: 'Family Members', icon: <Icons.Family /> },
    { id: 'help' as ActiveViewType, label: 'Help Centre', icon: <Icons.Help /> },
  ];

  // Render content based on active view
  const renderContent = () => {
    const contentMap: Record<ActiveViewType, React.ReactNode> = {
      appointments: (
        <Appointments
          appointments={appointments}
          appointmentHistory={[]}
          onBookAppointment={handleBookAppointment}
          onReschedule={handleRescheduleAppointment}
          onCancel={handleCancelAppointment}
          onViewDetails={(id) => console.log('View details:', id)}
        />
      ),
      notifications: (
        <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} />
      ),
      payments: (
        <PaymentsSummary payments={payments} onDownloadInvoice={handleDownloadInvoice} />
      ),
      profile: dashboardUser ? (
        <ProfileCompletionStatus
          completionPercentage={dashboardUser.profileCompletion}
          onCompleteProfile={handleCompleteProfile}
        />
      ) : null,
      family: (
        <FamilyMembers
          members={familyMembers}
          onAddMember={handleAddFamilyMember}
          onSwitchActive={handleSwitchActiveMember}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />
      ),
      help: (
        <>
          {feedbackSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-in slide-in-from-top">
              <Icons.CheckCircle />
              <span className="text-green-800 font-medium">
                Thanks — your feedback has been submitted successfully!
              </span>
            </div>
          )}
          <HelpAndSupport onContactSupport={handleContactSupport} onSubmitFeedback={handleSubmitFeedback} />
        </>
      ),
      security: (
        <SecuritySettings
          onChangePassword={handleChangePassword}
          onEnable2FA={handleEnable2FA}
        />
      ),
    };

    return contentMap[activeView];
  };

  // Get user initials
  const getUserInitials = () => {
    if (!dashboardUser?.name) return 'U';
    return dashboardUser.name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-sans">
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* User Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-black font-bold text-2xl shadow-lg">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg truncate">
                      {dashboardUser?.name || 'Loading...'}
                    </h2>
                    <p className="text-gray-500 text-sm truncate">
                      {dashboardUser?.email || 'Loading...'}
                    </p>
                  </div>
                </div>

                {dashboardUser && (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Profile Completion</span>
                        <span className="font-bold text-gray-900">{dashboardUser.profileCompletion}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${dashboardUser.profileCompletion}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {dashboardUser.profileCompletion < 100
                          ? 'Complete your profile to unlock all features'
                          : 'Your profile is complete!'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full py-3  bg-orange-600 hover:bg-orange-700 hover:to-orange-600 text-white font-medium rounded-xl"
                    >
                      View Full Profile
                    </button>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <nav className="divide-y divide-gray-100">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeView === item.id}
                      badge={item.badge}
                      onClick={() => handleNavClick(item.id)}
                    />
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
                        <span className="text-gray-600 group-hover:text-red-600">
                          <Icons.Logout />
                        </span>
                      </div>
                      <span className="font-medium text-sm">Log Out</span>
                    </div>
                    <Icons.ChevronRight />
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {dashboardUser?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your dental care today
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBookAppointment}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="p-3 hover:bg-gray-100 rounded-xl relative transition-colors duration-200"
                >
                  <Icons.Bell />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Cards - Desktop Only */}
            <div className="hidden lg:grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Upcoming Appointments</h3>
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <Icons.Calendar />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{appointments.length}</p>
                <p className="text-sm text-gray-500">
                  {appointments.length > 0
                    ? `Next: ${appointments[0]?.dentistName}`
                    : 'No upcoming appointments'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Pending Payments</h3>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Icons.Card />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {payments.filter(p => p.status === 'pending').length} payment{payments.filter(p => p.status === 'pending').length !== 1 ? 's' : ''} pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Family Members</h3>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Icons.Family />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{familyMembers.length}</p>
                <p className="text-sm text-gray-500">
                  Active: {familyMembers.find(m => m.isActive)?.name || 'None'}
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Mobile Content Header */}
              <div className="lg:hidden border-b border-gray-200 bg-gradient-to-r from-orange-50/50 to-white">
                <div className="px-4 py-4">
                  <h2 className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
                    {navItems.find(item => item.id === activeView)?.icon}
                    {activeView.replace('_', ' ')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeView === 'appointments' && 'Manage your dental appointments'}
                    {activeView === 'notifications' && 'Stay updated with notifications'}
                    {activeView === 'payments' && 'View and manage payments'}
                    {activeView === 'profile' && 'Complete your profile'}
                    {activeView === 'family' && 'Manage family members'}
                    {activeView === 'help' && 'Get help and support'}
                    {activeView === 'security' && 'Manage your security settings'}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div>
                {renderContent()}
              </div>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
            <div className="grid grid-cols-4 h-16">
              <button
                onClick={() => handleNavClick('appointments')}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeView === 'appointments' ? 'text-orange-600' : 'text-gray-500'
                  }`}
              >
                <Icons.Calendar />
                <span className="text-xs mt-1 font-medium">Appointments</span>
              </button>
              <button
                onClick={() => handleNavClick('payments')}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeView === 'payments' ? 'text-orange-600' : 'text-gray-500'
                  }`}
              >
                <Icons.Card />
                <span className="text-xs mt-1 font-medium">Payments</span>
              </button>
              <button
                onClick={() => handleNavClick('family')}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeView === 'family' ? 'text-orange-600' : 'text-gray-500'
                  }`}
              >
                <Icons.Family />
                <span className="text-xs mt-1 font-medium">Family</span>
              </button>
              <button
                onClick={() => setShowMobileNav(true)}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${showMobileNav ? 'text-orange-600' : 'text-gray-500'
                  }`}
              >
                <Icons.Menu />
                <span className="text-xs mt-1 font-medium">More</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileNav && (
        <MobileNav
          activeView={activeView}
          onNavClick={(view) => {
            if (['appointments', 'notifications', 'payments', 'profile', 'family', 'help', 'security'].includes(view)) {
              handleNavClick(view as ActiveViewType);
            }
          }}
          onClose={() => setShowMobileNav(false)}
          user={dashboardUser}
          unreadCount={unreadNotifications}
        />
      )}
    </div>
  );
};

export default Dashboard;	