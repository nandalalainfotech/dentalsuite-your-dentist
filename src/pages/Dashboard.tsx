import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Appointments } from '../components/dashboard/Appointments';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { FamilyMembers } from '../components/dashboard/FamilyMembers';
import { HelpAndSupport } from '../components/dashboard/HelpAndSupport';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../hooks/booking/useBookingContext';
import SecuritySettings from '../components/dashboard/SecuritySettings';
import { Icons } from '../components/dashboard/Icons';
import { AlertCircle } from 'lucide-react';
import type { DashboardUser } from '../types/dashboard';
import { Profile } from '../components/dashboard/Profile';
import { updateUserProfile } from '../data/userApi';
import { clinics } from '../data/clinics';
import BookingModal from '../components/booking/BookingModal';
import type { Clinic } from '../types';
import Footer from '../components/layout/Footer';

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
        ? 'bg-gray-800 text-white shadow-lg shadow-gray-900/20 transform translate-y-[-1px]'
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
      <div className={`transition-transform duration-300 text-gray-400 ${active ? 'translate-x-0 opacity-100 text-white/50' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
        <Icons.ChevronRight />
      </div>
    </div>
  </button>
);

const MobileNav: React.FC<{
  activeView: string;
  onNavClick: (view: string) => void;
  onClose: () => void;
  onLogout: () => void;
  user: DashboardUser | null;
  unreadCount: number;
}> = ({ activeView, onNavClick, onClose, onLogout, user, unreadCount }) => {

  const handleNavClick = (view: string) => {
    if (view === 'logout') {
      onClose();
      onLogout();
      return;
    }
    onNavClick(view);
    onClose();
  };

  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: <Icons.Calendar /> },
    { id: 'notifications', label: 'Notifications', icon: <Icons.Bell />, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: <Icons.User /> },
    { id: 'security', label: 'Security', icon: <Icons.Shield />, },
    { id: 'family', label: 'Family Members', icon: <Icons.Family /> },
    { id: 'help', label: 'Help Centre', icon: <Icons.Help /> },
    { id: 'logout', label: 'Log Out', icon: <Icons.Logout /> },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white z-50 lg:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gray-100 text-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 rounded-xl transition-colors backdrop-blur-md"
            >
              <Icons.Close />
            </button>
          </div>

          <div className="group relative bg-white backdrop-blur-md rounded-3xl p-3 border border-white/20 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white/20">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-orange-600 to-gray-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="font-bold text-gray-700 text-base">
                {user?.name || 'Loading...'}
              </h2>
              <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mt-1">
                User profile
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 sm:px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-4 sm:py-5 mb-1 rounded-xl
                transition-all duration-200
                ${activeView === item.id
                  ? 'bg-orange-50 text-orange-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${item.id === 'logout' ? 'text-red-500 hover:bg-red-50' : ''}
              `}
            >
              <span className={`${activeView === item.id ? 'text-orange-500' : (item.id === 'logout' ? 'text-red-500' : 'text-gray-400')}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left text-base sm:text-lg">{item.label}</span>
              {item.badge && (
                <span className={`
                  text-xs font-bold px-2.5 py-1 rounded-full
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

        <div className="p-4 sm:p-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            © 2026 Dental Care. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

type ActiveViewType = 'appointments' | 'notifications' | 'profile' | 'family' | 'help' | 'security';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    dashboardUser,
    fullUserData,
    appointments,
    notifications,
    familyMembers,
    updateAppointments,
    updateNotifications,
    updateFamilyMembers
  } = useDashboardData();

  const { setRescheduleAppointmentId } = useBooking();

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 4. State for logout modal
  const [activeView, setActiveView] = useState<ActiveViewType>(() => {
    const viewParam = searchParams.get('view');
    const validViews: ActiveViewType[] = ['appointments', 'notifications', 'profile', 'family', 'help', 'security'];
    return validViews.includes(viewParam as ActiveViewType) ? (viewParam as ActiveViewType) : 'appointments';
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState<string>('');

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', activeView);
    setSearchParams(newSearchParams, { replace: true });
  }, [activeView, searchParams, setSearchParams]);

  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleBookAppointment = () => navigate('/');
  const handleContactSupport = () => console.log('Contact support');
  const handleSubmitFeedback = () => {
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };
  const handleRescheduleAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const clinic = clinics.find(c =>
      c.dentists?.some(d => d.name === appointment.dentistName)
    );

    if (!clinic) {
      console.error('Clinic not found for dentist:', appointment.dentistName);
      return;
    }

    const dentist = clinic.dentists?.find(d => d.name === appointment.dentistName);
    if (!dentist) {
      console.error('Dentist not found:', appointment.dentistName);
      return;
    }

    setRescheduleAppointmentId(appointmentId);
    setSelectedClinic(clinic);
    setSelectedDentistId(dentist.id);
    setShowBookingModal(true);
  };
  const handleMarkAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    updateNotifications(updatedNotifications);
  };
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
    { id: 'profile' as ActiveViewType, label: 'Profile', icon: <Icons.User /> },
    { id: 'security' as ActiveViewType, label: 'Security', icon: <Icons.Shield />, },
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
        />
      ),
      notifications: (
        <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} />
      ),
      profile: fullUserData ? (
        <Profile
          user={fullUserData}
          onUpdateUser={(updatedUser) => {
            const result = updateUserProfile(updatedUser.id, {
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              dateOfBirth: updatedUser.dateOfBirth,
              gender: updatedUser.gender,
              mobileNumber: updatedUser.mobileNumber
            });
            if (result) console.log('Profile updated:', result);
          }}
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* --- LEFT SIDEBAR (Desktop Only - 1024px+) --- */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-8">

              {/* Profile Card */}
              <div className="group relative bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                      {dashboardUser?.profileImage ? (
                        <img
                          src={dashboardUser.profileImage}
                          alt={dashboardUser?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 via-orange-600 to-gray-200 flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="font-bold text-gray-900 text-lg">
                    {dashboardUser?.name || 'Loading...'}
                  </h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
                    User profile
                  </p>
                </div>
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

                <div className="mt-4 border-t border-gray-200/60">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-red-500 rounded-2xl transition-all duration-200 group"
                  >
                    <Icons.Logout />
                    <span className="font-medium text-sm">Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 min-w-0 pb-10 lg:pb-10">

            {/* Desktop Header (1024px+) */}
            <header className="hidden lg:flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back,
                  <span className='text-orange-500 mx-1'>{dashboardUser?.name?.split(' ')[0] || 'User'}!
                  </span>
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
                  className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  + New Appointment
                </button>
              </div>
            </header>

            {/* Desktop Stats Grid (1024px+) */}
            <div className="hidden lg:grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                  title: 'Active Members',
                  value: familyMembers.length.toString(),
                  sub: 'Family Members',
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
              {/* Mobile/Tablet Header (< 1024px) */}
              <div className="lg:hidden mb-6">
                {/* Profile Card (Mobile/Tablet) */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                      {dashboardUser?.profileImage ? (
                        <img
                          src={dashboardUser.profileImage}
                          alt={dashboardUser?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 via-orange-600 to-gray-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg truncate">
                      {dashboardUser?.name || 'Loading...'}
                    </h2>
                    <p className="text-gray-500 text-sm truncate">{dashboardUser?.email || ''}</p>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
                      User profile
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBookAppointment}
                  className="mt-4 w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  + New Appointment
                </button>
              </div>

              {/* Main View Area */}
              <div className="p-1 md:p-0">
                {renderContent()}
              </div>
            </div>
          </main>

          {/* Mobile/Tablet Bottom Navigation (< 1024px) */}
          <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-800 border-orange-500backdrop-blur-md text-white rounded-2xl z-40 shadow-2xl shadow-gray-900/30">
            <div className="flex justify-around items-center h-16 sm:h-18 px-2">
              <button
                onClick={() => handleNavClick('appointments')}
                className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${activeView === 'appointments' ? 'bg-white/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Calendar />
              </button>

              <button
                onClick={() => handleNavClick('notifications')}
                className={`relative p-3 sm:p-4 rounded-xl transition-all duration-300 ${activeView === 'notifications' ? 'bg-white/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Bell />
                {unreadNotifications > 0 && <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${activeView === 'profile' ? 'bg-white/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.User />
              </button>

              <button
                onClick={() => setShowMobileNav(true)}
                className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${showMobileNav ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Icons.Menu />
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Navigation */}
      {showMobileNav && (
        <MobileNav
          activeView={activeView}
          onNavClick={(view) => {
            if (['appointments', 'notifications', 'profile', 'family', 'help', 'security'].includes(view)) {
              handleNavClick(view as ActiveViewType);
            }
          }}
          onClose={() => setShowMobileNav(false)}
          onLogout={handleLogoutClick}
          user={dashboardUser}
          unreadCount={unreadNotifications}
        />
      )}

      {/* Booking Modal for Reschedule */}
      {showBookingModal && selectedClinic && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setRescheduleAppointmentId(null);
          }}
          clinic={selectedClinic}
          selectedDentistId={selectedDentistId}
          mode="update"
          onAppointmentUpdated={(appointmentId: string, newDate: string, newTime: string) => {
            const updatedAppointments = appointments.map(apt => {
              if (apt.id === appointmentId) {
                const [year, month, day] = newDate.split('-').map(Number);
                const [hours, minutes] = newTime.split(':').map(Number);
                const newDateTime = new Date(year, month - 1, day, hours, minutes);

                return { ...apt, dateTime: newDateTime };
              }
              return apt;
            });
            updateAppointments(updatedAppointments);
          }}
        />
      )}

      {/* --- 8. LOGOUT CONFIRMATION MODAL (PORTAL) --- */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Full Screen Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelLogout}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 m-4 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Sign out?
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to sign out? You will need to log in again to access your dashboard.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;