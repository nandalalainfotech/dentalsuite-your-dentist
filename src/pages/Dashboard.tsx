import React, { useState, useEffect } from 'react';
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
import type { DashboardUser } from '../types/dashboard';
import { Profile } from '../components/dashboard/Profile';
import { updateUserProfile } from '../data/users';
import { clinics } from '../data/clinics';
import BookingModal from '../components/booking/BookingModal';
import type { Clinic } from '../types';

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

// Mobile Navigation Drawer - Now works on Mobile AND Tablet (< 1024px)
const MobileNav: React.FC<{
  activeView: string;
  onNavClick: (view: string) => void;
  onClose: () => void;
  user: DashboardUser | null;
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
    { id: 'profile', label: 'Profile', icon: <Icons.User /> },
    { id: 'security', label: 'Security', icon: <Icons.Shield />, },
    { id: 'family', label: 'Family Members', icon: <Icons.Family /> },
    { id: 'help', label: 'Help Centre', icon: <Icons.Help /> },
    { id: 'logout', label: 'Log Out', icon: <Icons.Logout /> },
  ];

  return (
    <>
      {/* Overlay - Changed from md:hidden to lg:hidden for tablet support */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer - Changed from md:hidden to lg:hidden for tablet support */}
      <div className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white z-50 lg:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md"
            >
              <Icons.Close />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-orange-500/20 ring-4 ring-white/10">
              {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg sm:text-xl truncate text-gray-800">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400 truncate">{user?.email || ''}</p>
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
              `}
            >
              <span className={`${activeView === item.id ? 'text-orange-500' : 'text-gray-400'}`}>
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

        {/* Footer */}
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
  useAuth();
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
  const [activeView, setActiveView] = useState<ActiveViewType>(() => {
    const viewParam = searchParams.get('view');
    const validViews: ActiveViewType[] = ['appointments', 'notifications', 'profile', 'family', 'help', 'security'];
    return validViews.includes(viewParam as ActiveViewType) ? (viewParam as ActiveViewType) : 'appointments';
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState<string>('');

  // Update URL when active view changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', activeView);
    setSearchParams(newSearchParams, { replace: true });
  }, [activeView, searchParams, setSearchParams]);

  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    navigate('/');
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

    // Find clinic that contains the dentist
    const clinic = clinics.find(c =>
      c.dentists?.some(d => d.name === appointment.dentistName)
    );

    if (!clinic) {
      console.error('Clinic not found for dentist:', appointment.dentistName);
      return;
    }

    // Find the dentist ID
    const dentist = clinic.dentists?.find(d => d.name === appointment.dentistName);
    if (!dentist) {
      console.error('Dentist not found:', appointment.dentistName);
      return;
    }

    // Set reschedule appointment ID in booking context
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
            if (result) {
              // Update the dashboardUser state to reflect changes
              console.log('Profile updated:', result);
            }
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

  const getUserInitials = () => {
    if (!dashboardUser?.name) return 'U';
    return dashboardUser.name.split(' ').map(n => n[0]).join('');
  };


  // Add these states to your component
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Add these handler functions
  const handleTakePhoto = async () => {
    try {
      // This would use the device camera API
      // For web, you might use:
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // For React Native, you would use a camera library

      console.log('Opening camera...');
      setShowUploadOptions(false);

      // In a real app, you would implement camera capture here
      // For now, we'll simulate with a file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera on mobile
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleImageUpload(file);
      };
      input.click();
    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const handleUploadFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
    setShowUploadOptions(false);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);

      // In a real app, you would upload to your server here
      console.log('Uploading image:', file.name);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user profile image
      // You would call an API endpoint to update the user's profile image
      // For now, we'll update the local state
      if (dashboardUser) {
        // Update dashboardUser with new image URL
        // This should be replaced with your actual state update logic
        console.log('Profile image updated:', imageUrl);
      }

      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    try {
      setUploading(true);

      // In a real app, you would call an API to remove the profile image
      console.log('Removing profile picture...');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user to remove profile image
      if (dashboardUser) {
        // Update dashboardUser to remove profileImage
        // This should be replaced with your actual state update logic
        console.log('Profile picture removed');
      }

      setShowUploadOptions(false);
      alert('Profile picture removed successfully!');
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
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
      {/* Profile Image with Upload Overlay */}
      <div className="relative group">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center overflow-hidden">
          {dashboardUser?.profileImage ? (
            <img
              src={dashboardUser.profileImage}
              alt={dashboardUser?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
              <svg className="w-8 h-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Change profile picture"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Online Status Indicator */}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
    </div>

    <h2 className="font-bold text-gray-900 text-lg">
      {dashboardUser?.name || 'Loading...'}
    </h2>
    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
      User profile
    </p>
  </div>

  {/* Upload Options Modal - Bottom Positioned */}
  {showUploadOptions && (
    <div className="absolute left-0 right-0 -bottom-2 transform translate-y-full z-10 mt-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Change Profile Photo</h3>
            <button
              onClick={() => setShowUploadOptions(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose an option to update your profile picture</p>
        </div>

        {/* Options List */}
        <div className="p-2">
          {/* Take Photo Option */}
          <button
            onClick={handleTakePhoto}
            className="w-full p-3 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">Take a Photo</h4>
              <p className="text-xs text-gray-500">Use your camera</p>
            </div>
          </button>

          {/* Upload from Gallery Option */}
          <button
            onClick={handleUploadFromGallery}
            className="w-full p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">Choose from Gallery</h4>
              <p className="text-xs text-gray-500">Select from your device</p>
            </div>
          </button>

          {/* Remove Photo Option (if user has a profile image) */}
          {dashboardUser?.profileImage && (
            <button
              onClick={handleRemovePhoto}
              className="w-full p-3 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 text-sm">Remove Photo</h4>
                <p className="text-xs text-gray-500">Delete current picture</p>
              </div>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setShowUploadOptions(false)}
            className="w-full text-center text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Arrow pointing to profile image */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {navItems.find(item => item.id === activeView)?.label}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500">Overview</p>
                  </div>
                  <button
                    onClick={() => setShowMobileNav(true)}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                        {getUserInitials()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Quick Action Button for Mobile/Tablet */}
                <button
                  onClick={handleBookAppointment}
                  className="mt-4 w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  + New Appointment
                </button>
              </div>

              {/* Main View Area */}
              <div className="p-2 md:p-0">
                {renderContent()}
              </div>
            </div>
          </main>

          {/* Mobile/Tablet Bottom Navigation (< 1024px) */}
          <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl z-40 shadow-2xl shadow-gray-900/30">
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
        />
      )}
    </div>
  );
};

export default Dashboard;


