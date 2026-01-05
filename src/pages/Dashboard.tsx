import React, { useState } from 'react';
import { Appointments } from '../components/dashboard/Appointments';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { PaymentsSummary } from '../components/dashboard/PaymentsSummary';
import { FamilyMembers } from '../components/dashboard/FamilyMembers';
import { ProfileCompletionStatus } from '../components/dashboard/ProfileCompletionStatus';
import { HelpAndSupport } from '../components/dashboard/HelpAndSupport';
import { useDashboardData } from '../hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import SecuritySettings from '../components/dashboard/SecuritySettings';

// --- ICONS (Unchanged) ---
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Card: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Family: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Help: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

// --- COMPONENTS ---

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
      w-full flex items-center justify-between px-5 py-4 mb-2 rounded-2xl
      transition-all duration-300 group
      ${active
        ? 'bg-gray-800 text-white shadow-lg shadow-gray-900/20 trangray-x-1'
        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
      }
      ${className || ''}
    `}
  >
    <div className="flex items-center gap-3.5">
      <div className={`
        transition-all duration-300
        ${active
          ? 'text-orange-400'
          : 'text-gray-400 group-hover:text-orange-500 group-hover:scale-110'
        }
      `}>
        {icon}
      </div>
      <span className={`text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    </div>

    <div className="flex items-center gap-2">
      {badge && (
        <span className={`
          text-[10px] font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center border
          transition-all duration-300
          ${active
            ? 'bg-orange-500 border-orange-500 text-white'
            : 'bg-white border-gray-200 text-gray-600 group-hover:border-orange-200 group-hover:text-orange-600'
          }
        `}>
          {badge}
        </span>
      )}
      <div className={`transition-transform duration-300 text-gray-400 ${active ? 'trangray-x-0 opacity-100 text-white/50' : '-trangray-x-2 opacity-0 group-hover:trangray-x-0 group-hover:opacity-100'}`}>
        <Icons.ChevronRight />
      </div>
    </div>
  </button>
);

const MobileNav: React.FC<{
  activeView: string;
  onNavClick: (view: string) => void;
  onClose: () => void;
  user: any;
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
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md"
            >
              <Icons.Close />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20 ring-4 ring-white/10">
              {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl
                transition-all duration-200
                ${activeView === item.id
                  ? 'bg-orange-50 text-orange-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className={activeView === item.id ? 'text-orange-500' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`
                  text-xs font-bold px-2 py-1 rounded-full
                  ${activeView === item.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600'
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

  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    navigate('/');
  };

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

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'appointments' as ActiveViewType, label: 'Appointments', icon: <Icons.Calendar />, badge: appointments.filter(a => a.status === 'pending').length || undefined },
    { id: 'notifications' as ActiveViewType, label: 'Notifications', icon: <Icons.Bell />, badge: unreadNotifications || undefined },
    { id: 'payments' as ActiveViewType, label: 'Payments', icon: <Icons.Card /> },
    { id: 'profile' as ActiveViewType, label: 'Profile', icon: <Icons.User /> },
    { id: 'security' as ActiveViewType, label: 'Security', icon: <Icons.Shield />, badge: 'New' },
    { id: 'family' as ActiveViewType, label: 'Family Members', icon: <Icons.Family /> },
    { id: 'help' as ActiveViewType, label: 'Help Centre', icon: <Icons.Help /> },
  ];

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
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-in slide-in-from-top shadow-sm">
              <div className="text-emerald-500"><Icons.CheckCircle /></div>
              <span className="text-emerald-800 font-medium">
                Feedback submitted successfully. Thank you!
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

  const getUserInitials = () => {
    if (!dashboardUser?.name) return 'U';
    return dashboardUser.name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-orange-200 selection:text-orange-900">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-[20%] left-[-10%] w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* --- LEFT SIDEBAR (Desktop) --- */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-8">
              
              {/* Profile Card */}
              <div className="group relative bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-orange-400  rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {getUserInitials()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  
                  <h2 className="font-bold text-gray-900 text-lg">
                    {dashboardUser?.name || 'Loading...'}
                  </h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
                    Patient Account
                  </p>
                </div>

                {dashboardUser && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-semibold mb-2 text-gray-500">
                      <span>Profile Status</span>
                      <span className="text-orange-600">{dashboardUser.profileCompletion}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: `${dashboardUser.profileCompletion}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="">
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
                
                <div className="mt-8 pt-6 border-t border-gray-200/60">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
                    >
                        <Icons.Logout />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 min-w-0 pb-24 lg:pb-10">
            
            {/* Header */}
            <header className="hidden lg:flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {dashboardUser?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your dental care today
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 relative"
                >
                  <Icons.Bell />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="px-8 py-3.5 bg-gray-900  hover:bg-gray-800 text-white font-semibold rounded-2xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-300 transform hover:-trangray-y-0.5"
                >
                  + New Appointment
                </button>
              </div>
            </header>

            {/* Desktop Stats Grid */}
            <div className="hidden lg:grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {[
                { 
                  title: 'Next Appointment', 
                  value: appointments.length > 0 ? 'Upcoming' : 'None', 
                  sub: appointments.length > 0 ? appointments[0]?.dentistName : 'Book now',
                  icon: <Icons.Calendar />,
                  color: 'text-orange-500',
                  bg: 'bg-orange-50'
                },
                { 
                  title: 'Pending Payments', 
                  value: `$${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}`,
                  sub: `${payments.filter(p => p.status === 'pending').length} invoice(s)`,
                  icon: <Icons.Card />,
                  color: 'text-blue-500',
                  bg: 'bg-blue-50'
                },
                { 
                  title: 'Active Members', 
                  value: familyMembers.length.toString(), 
                  sub: 'Family Plan',
                  icon: <Icons.Family />,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50'
                }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.title}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm font-medium text-gray-500">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Container */}
            <div className="relative">
                {/* Mobile Header (Inline) */}
                <div className="lg:hidden mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {navItems.find(item => item.id === activeView)?.label}
                        </h2>
                        <p className="text-sm text-gray-500">Overview</p>
                    </div>
                    <button 
                        onClick={() => setShowMobileNav(true)}
                        className="w-10 h-10 flex items-center justify-center  shadow-sm border border-gray-200"
                    >
                        <div className="relative">
                            <div className="w-8 h-8  overflow-hidden">
                                {getUserInitials() !== 'U' && (
                                    <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xs">
                                        {getUserInitials()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Main View Area */}
                    <div className="p-2 md:p-0">
                      {renderContent()}
                    </div>
            </div>
          </main>

          {/* Mobile Bottom Navigation (Glass) */}
          <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl z-40 shadow-2xl shadow-gray-900/30">
            <div className="flex justify-around items-center h-16 px-2">
              <button
                onClick={() => handleNavClick('appointments')}
                className={`p-3 rounded-xl transition-all duration-300 ${activeView === 'appointments' ? 'bg-white/20 text-orange-400 trangray-y-[-4px]' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Calendar />
              </button>
              <button
                onClick={() => handleNavClick('payments')}
                className={`p-3 rounded-xl transition-all duration-300 ${activeView === 'payments' ? 'bg-white/20 text-orange-400 trangray-y-[-4px]' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Card />
              </button>
              
              <button
                onClick={() => handleNavClick('notifications')}
                className={`relative p-3 rounded-xl transition-all duration-300 ${activeView === 'notifications' ? 'bg-white/20 text-orange-400 trangray-y-[-4px]' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Bell />
                {unreadNotifications > 0 && <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
              </button>
              <button
                onClick={() => setShowMobileNav(true)}
                className={`p-3 rounded-xl transition-all duration-300 ${showMobileNav ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Menu />
              </button>
            </div>
          </nav>

        </div>
      </div>

      {/* Mobile Drawer */}
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