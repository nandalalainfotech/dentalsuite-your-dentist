import React, { useState, useEffect } from 'react';
import { Appointments } from '../components/dashboard/Appointments';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { PaymentsSummary } from '../components/dashboard/PaymentsSummary';
import { FamilyMembers } from '../components/dashboard/FamilyMembers';
import { ProfileCompletionStatus } from '../components/dashboard/ProfileCompletionStatus';
import { HelpAndSupport } from '../components/dashboard/HelpAndSupport';
import type { DashboardUser, Appointment, Payment, Notification, FamilyMember } from '../types/dashboard';
import { useNavigate } from 'react-router-dom';

const Icons = {
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Card: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Family: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Help: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
};

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  isLast?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, badge, isLast, onClick, className }) => (
  <button
    onClick={onClick}
    className={`relative w-full flex items-center justify-between px-6 py-4 md:py-3.5 transition-colors bg-white hover:bg-gray-50 group
      ${!isLast ? 'border-b border-gray-100' : ''}
      ${className || ''}
    `}>

    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600" />
    )}

    <div className="flex items-center min-w-0">
      <span className={`mr-4 flex-shrink-0 ${active ? 'text-orange-600' : 'text-gray-700'}`}>
        {icon}
      </span>
      <span className={`text-[15px] font-medium truncate ${active ? 'text-orange-600' : 'text-gray-900'}`}>
        {label}
      </span>

      {badge && (
        <span className="ml-3 bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0">
          {badge}
        </span>
      )}
    </div>

    <span className="text-gray-400 group-hover:text-gray-600 md:hidden">
      <Icons.ChevronRight />
    </span>
  </button>
);

const Dashboard: React.FC = () => {
  const [user] = useState<DashboardUser>({
    id: '1',
    name: 'Sandeep Peddi',
    email: 'drspeddi@gmail.com',
    avatar: '',
    profileCompletion: 75
  });

  const [showMobileContent, setShowMobileContent] = useState(false);
  const [activeView, setActiveView] = useState<'appointments' | 'notifications' | 'payments' | 'profile' | 'family' | 'help' | 'security' | 'feedback'>('appointments');

  const navigate = useNavigate();

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    { id: '1', dentistName: 'Dr. Sarah Johnson', clinicName: 'Smile Dental Care', dateTime: new Date('2024-01-15T10:00:00'), status: 'confirmed', treatment: 'Regular Checkup', price: 150 },
    { id: '2', dentistName: 'Dr. Michael Chen', clinicName: 'City Dental Clinic', dateTime: new Date('2024-01-20T14:30:00'), status: 'pending', treatment: 'Teeth Cleaning', price: 120 }
  ]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Sandeep', relationship: 'self', isActive: true },
    { id: '2', name: 'Ramesh', relationship: 'father', isActive: false },
    { id: '3', name: 'Sunita', relationship: 'mother', isActive: false }
  ]);

  const [payments,] = useState<Payment[]>([
    { id: '1', appointmentId: '1', amount: 150, date: new Date('2024-01-10T10:00:00'), type: 'deposit', status: 'paid', invoiceUrl: '/invoices/inv_001.pdf' },
    { id: '2', appointmentId: '2', amount: 120, date: new Date('2024-01-18T14:30:00'), type: 'full_payment', status: 'pending' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    // eslint-disable-next-line react-hooks/purity
    { id: '1', type: 'appointment_reminder', title: 'Appointment Reminder', message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), isRead: false },
    // eslint-disable-next-line react-hooks/purity
    { id: '2', type: 'payment_update', title: 'Payment Confirmation', message: 'Your payment of $150 has been confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isRead: true }
  ]);

  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileContent(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (view: typeof activeView) => {
    setActiveView(view);
    setShowMobileContent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setShowMobileContent(false);
  };

  const handleBookAppointment = () => console.log('Navigate to booking page');
  const handleContactSupport = () => console.log('Contact support');
  const handleSubmitFeedback = () => {
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };
  const handleRescheduleAppointment = (appointmentId: string) => console.log('Reschedule:', appointmentId);
  const handleMarkAsRead = (notificationId: string) => setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  const handleDownloadInvoice = (paymentId: string) => console.log('Download invoice:', paymentId);
  const handleAddFamilyMember = () => setFamilyMembers(prev => [...prev, { id: String(Date.now()), name: 'New Member', relationship: 'child', isActive: false }]);
  const handleSwitchActiveMember = (memberId: string) => setFamilyMembers(prev => prev.map(m => ({ ...m, isActive: m.id === memberId })));
  const handleEditMember = (memberId: string) => console.log('Edit member:', memberId);
  const handleDeleteMember = (memberId: string) => setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
  const handleCompleteProfile = () => console.log('Complete profile');
  const handleCancelAppointment = (appointmentId: string) => setUpcomingAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt));


  const renderContent = () => {
    return (
      <div className="">
        <div className="md:hidden bg-white px-4 py-3 border-b border-gray-200 flex items-center sticky top-0 z-20 shadow-sm">
          <button onClick={handleBackToMenu} className="flex items-center text-gray-600 font-medium active:text-gray-900">
            <Icons.ArrowLeft />
            <span className="ml-2">Back</span>
          </button>
          <span className="ml-auto font-semibold capitalize text-gray-800">
            {activeView.replace('_', ' ')}
          </span>
        </div>
        <div className="bg-white md:rounded-lg shadow-sm border-b md:border border-gray-200 min-h-[calc(100vh-60px)] md:min-h-0">
          {activeView === 'appointments' && (
            <div className="overflow-x-auto">
              <Appointments
                appointments={upcomingAppointments}
                appointmentHistory={[]}
                onBookAppointment={handleBookAppointment}
                onReschedule={handleRescheduleAppointment}
                onCancel={handleCancelAppointment}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            </div>
          )}

          {activeView === 'notifications' && (
            <div className="">
              <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} />
            </div>
          )}

          {activeView === 'payments' && (
            <div className="  overflow-x-auto">
              <PaymentsSummary payments={payments} onDownloadInvoice={handleDownloadInvoice} />
            </div>
          )}

          {activeView === 'profile' && (
            <div className=" ">
              <ProfileCompletionStatus completionPercentage={user.profileCompletion} onCompleteProfile={handleCompleteProfile} />
            </div>
          )}

          {activeView === 'family' && (
            <div className="  overflow-x-auto">
              <FamilyMembers members={familyMembers} onAddMember={handleAddFamilyMember} onSwitchActive={handleSwitchActiveMember} onEditMember={handleEditMember} onDeleteMember={handleDeleteMember} />
            </div>
          )}

          {(activeView === 'help' || activeView === 'feedback') && (
            <div className=" ">
              {feedbackSuccess && (
                <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
                  Thanks — your feedback has been submitted.
                </div>
              )}
              <HelpAndSupport onContactSupport={handleContactSupport} onSubmitFeedback={handleSubmitFeedback} />
            </div>
          )}

          {activeView === 'security' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
              <p className="text-sm text-gray-600 mb-6">Manage your password and two-factor authentication settings here.</p>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-600">Update your password regularly</p>
                  </div>
                  <button className="text-orange-600 hover:text-orange-800 font-medium">Change</button>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="text-orange-600 hover:text-orange-800 font-medium">Enable</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F7F8F9] min-h-screen font-sans text-gray-900">
      <main className="max-w-7xl mx-auto md:px-6 lg:px-8 md:py-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 lg:gap-8 items-start">
          <div className={`
             md:sticky md:top-4
             md:col-span-4 lg:col-span-3 
             ${showMobileContent ? 'hidden md:block' : 'block'}
          `}>

            <div className="bg-white md:bg-transparent p-6 md:px-1 md:py-0 mb-0 md:mb-6 border-b md:border-none border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{user.name}</h2>
              <p className="text-gray-500 text-sm mt-1 truncate">{user.email}</p>
            </div>

            <div className="bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden">
              <nav className="flex flex-col">
                <NavLink icon={<Icons.Calendar />} label="Appointments" active={activeView === 'appointments'} onClick={() => handleNavClick('appointments')} />
                <NavLink icon={<Icons.Bell />} label="Notifications" active={activeView === 'notifications'} onClick={() => handleNavClick('notifications')} />
                <NavLink icon={<Icons.Card />} label="Payments" active={activeView === 'payments'} onClick={() => handleNavClick('payments')} />
                <NavLink icon={<Icons.User />} label="Profile" active={activeView === 'profile'} onClick={() => handleNavClick('profile')} />
                <NavLink icon={<Icons.Shield />} label="Security" badge="New" active={activeView === 'security'} onClick={() => handleNavClick('security')} />
                <NavLink icon={<Icons.Family />} label="Family members" active={activeView === 'family'} onClick={() => handleNavClick('family')} />
                <NavLink icon={<Icons.Help />} label="Help centre" active={activeView === 'help'} onClick={() => handleNavClick('help')} />
                <NavLink icon={<Icons.Logout />} label="Log out" isLast onClick={() => navigate("/")} />
              </nav>
            </div>
          </div>
          <div className={`
             md:col-span-8 lg:col-span-9 
             ${!showMobileContent ? 'hidden md:block' : 'block'}
          `}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

