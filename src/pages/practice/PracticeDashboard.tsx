// // import React, { useMemo, useState } from 'react';
// // import { createPortal } from 'react-dom';
// // import { usePracticeAuth } from '../../hooks/usePracticeAuth';
// // import type { MenuItem } from '../../types/dashboard';
// // import PracticeAppointmentsView from './PracticeAppointmentsView';
// // import PracticeDirectoryView from './PracticeDirectoryView';
// // import { Icons } from '../../components/dashboard/Icons';
// // import { AlertCircle } from 'lucide-react';

// // type ActiveViewType = 'directory' | 'appointments';

// // interface NavLinkProps {
// //   icon: React.ReactNode;
// //   label: string;
// //   active?: boolean;
// //   badge?: string | number;
// //   onClick?: () => void;
// //   className?: string;
// // }

// // const NavLink: React.FC<NavLinkProps> = ({
// //   icon,
// //   label,
// //   active = false,
// //   badge,
// //   onClick,
// //   className,
// // }) => (
// //   <button
// //     onClick={onClick}
// //     className={`
// //       w-full flex items-center justify-between px-5 py-4 mb-2 rounded-2xl
// //       transition-all duration-300 group
// //       ${active
// //         ? 'bg-gray-800 text-white shadow-lg shadow-gray-900/20 transform translate-y-[-1px]'
// //         : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
// //       }
// //       ${className || ''}
// //     `}
// //   >
// //     <div className="flex items-center gap-3.5">
// //       <div
// //         className={`
// //           transition-all duration-300
// //           ${active
// //             ? 'text-orange-400'
// //             : 'text-gray-400 group-hover:text-orange-500 group-hover:scale-110'
// //           }
// //         `}
// //       >
// //         {icon}
// //       </div>
// //       <span className={`text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
// //         {label}
// //       </span>
// //     </div>

// //     <div className="flex items-center gap-2">
// //       {badge !== undefined && badge !== null && (
// //         <span
// //           className={`
// //             text-[10px] font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center border
// //             transition-all duration-300
// //             ${active
// //               ? 'bg-orange-500 border-orange-500 text-white'
// //               : 'bg-white border-gray-200 text-gray-600 group-hover:border-orange-200 group-hover:text-orange-600'
// //             }
// //           `}
// //         >
// //           {badge}
// //         </span>
// //       )}
// //       <div
// //         className={`transition-transform duration-300 text-gray-400 ${active
// //             ? 'translate-x-0 opacity-100 text-white/50'
// //             : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
// //           }`}
// //       >
// //         <Icons.ChevronRight />
// //       </div>
// //     </div>
// //   </button>
// // );

// // const MobileNavDrawer: React.FC<{
// //   activeView: ActiveViewType;
// //   onNavClick: (view: ActiveViewType) => void;
// //   onClose: () => void;
// //   onLogout: () => void;
// //   practiceName: string;
// // }> = ({ activeView, onNavClick, onClose, onLogout, practiceName }) => {
// //   const navItems: Array<{ id: ActiveViewType | 'logout'; label: string; icon: React.ReactNode }> = [
// //     { id: 'directory', label: 'My Directory', icon: <Icons.User /> },
// //     { id: 'appointments', label: 'Appointments', icon: <Icons.Calendar /> },
// //     { id: 'logout', label: 'Log Out', icon: <Icons.Logout /> },
// //   ];

// //   const handleClick = (id: ActiveViewType | 'logout') => {
// //     if (id === 'logout') {
// //       onClose();
// //       onLogout();
// //       return;
// //     }
// //     onNavClick(id);
// //     onClose();
// //   };

// //   return (
// //     <>
// //       <div
// //         className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
// //         onClick={onClose}
// //       />

// //       <div className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white z-50 lg:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
// //         {/* Header */}
// //         <div className="p-6 sm:p-8 bg-gray-100 text-gray-800">
// //           <div className="flex items-center justify-between mb-8">
// //             <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Menu</h2>
// //             <button onClick={onClose} className="p-2 bg-white/10 rounded-xl transition-colors backdrop-blur-md">
// //               <Icons.Close />
// //             </button>
// //           </div>

// //           <div className="bg-white rounded-3xl p-4 border border-gray-200">
// //             <div className="flex items-center gap-3">
// //               <img
// //                 src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
// //                 alt="Practice Avatar"
// //                 className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
// //               />
// //               <div className="min-w-0">
// //                 <div className="font-bold text-gray-900 truncate">{practiceName}</div>
// //                 <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Practice Admin</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Items */}
// //         <nav className="flex-1 overflow-y-auto py-4 px-3 sm:px-4">
// //           {navItems.map((item) => (
// //             <button
// //               key={item.id}
// //               onClick={() => handleClick(item.id)}
// //               className={`
// //                 w-full flex items-center gap-4 px-4 py-4 sm:py-5 mb-1 rounded-xl
// //                 transition-all duration-200
// //                 ${activeView === item.id
// //                   ? 'bg-orange-50 text-orange-700 font-semibold'
// //                   : 'text-gray-600 hover:bg-gray-50'
// //                 }
// //                 ${item.id === 'logout' ? 'text-red-500 hover:bg-red-50' : ''}
// //               `}
// //             >
// //               <span
// //                 className={
// //                   activeView === item.id
// //                     ? 'text-orange-500'
// //                     : item.id === 'logout'
// //                       ? 'text-red-500'
// //                       : 'text-gray-400'
// //                 }
// //               >
// //                 {item.icon}
// //               </span>
// //               <span className="flex-1 text-left text-base sm:text-lg">{item.label}</span>
// //             </button>
// //           ))}
// //         </nav>

// //         <div className="p-4 sm:p-6 border-t border-gray-100">
// //           <p className="text-xs text-gray-400 text-center">© 2026 Dental Care. All rights reserved.</p>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default function PracticeDashboard() {
// //   const { practice, logout } = usePracticeAuth();
// //   const [activeView, setActiveView] = useState<ActiveViewType>('directory');
// //   const [showMobileNav, setShowMobileNav] = useState(false);
// //   const [showLogoutModal, setShowLogoutModal] = useState(false);

// //   if (!practice) return null;

// //   const menuItems: MenuItem[] = [
// //     { id: 'directory', label: 'My Directory', icon: Icons.User },
// //     { id: 'appointments', label: 'Appointments', icon: Icons.Calendar },
// //   ];

// //   const viewBadgeMap = useMemo(() => {
// //     return {
// //       directory: menuItems.find(m => m.id === 'directory')?.badge,
// //       appointments: menuItems.find(m => m.id === 'appointments')?.badge,
// //     };
// //   }, [menuItems]);

// //   const renderContent = () => {
// //     switch (activeView) {
// //       case 'appointments':
// //         return <PracticeAppointmentsView />;
// //       case 'directory':
// //       default:
// //         return <PracticeDirectoryView />;
// //     }
// //   };

// //   const handleNavClick = (view: ActiveViewType) => {
// //     setActiveView(view);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const handleLogoutClick = () => setShowLogoutModal(true);
// //   const confirmLogout = () => {
// //     setShowLogoutModal(false);
// //     logout();
// //   };
// //   const cancelLogout = () => setShowLogoutModal(false);

// //   return (
// //     <div className="min-h-screen bg-gray-100 text-gray-900">
// //       <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
// //         <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

// //           {/* --- LEFT SIDEBAR (Desktop Only) --- */}
// //           <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
// //             <div className="sticky top-20 space-y-8">
// //               {/* Practice Card */}
// //               <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
// //                 <div className="flex flex-col items-center text-center">
// //                   <div className="w-20 h-20 rounded-full overflow-hidden shadow-md mb-4">
// //                     <img
// //                       src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
// //                       alt="Practice Avatar"
// //                       className="w-full h-full object-cover"
// //                     />
// //                   </div>
// //                   <h2 className="font-bold text-gray-900 text-lg">{practice.practiceName}</h2>
// //                   <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
// //                     Practice Admin
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Navigation */}
// //               <nav>
// //                 {menuItems.map((item) => {
// //                   const Icon = item.icon;
// //                   return (
// //                     <NavLink
// //                       key={item.id}
// //                       icon={<Icon />}
// //                       label={item.label}
// //                       active={activeView === (item.id as ActiveViewType)}
// //                       badge={item.badge}
// //                       onClick={() => handleNavClick(item.id as ActiveViewType)}
// //                     />
// //                   );
// //                 })}

// //                 <div className="mt-4 border-t border-gray-200/60">
// //                   <button
// //                     onClick={handleLogoutClick}
// //                     className="w-full flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-red-500 rounded-2xl transition-all duration-200 group"
// //                   >
// //                     <Icons.Logout />
// //                     <span className="font-medium text-sm">Sign Out</span>
// //                   </button>
// //                 </div>
// //               </nav>
// //             </div>
// //           </aside>

// //           {/* --- MAIN CONTENT AREA --- */}
// //           <main className="flex-1 min-w-0 pb-28 lg:pb-10">

// //             {/* Mobile/Tablet Header */}
// //             <div className="lg:hidden mb-6">
// //               <div className="flex items-center gap-4">
// //                 <div className="w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0">
// //                   <img
// //                     src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
// //                     alt="Practice Avatar"
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>

// //                 <div className="flex-1 min-w-0">
// //                   <h2 className="font-bold text-gray-900 text-lg truncate">{practice.practiceName}</h2>
// //                   <p className="text-gray-500 text-sm truncate">Practice Admin</p>
// //                   <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
// //                     Practice dashboard
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Main content */}
// //             <div className="flex-1 overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm relative">
// //               <div className="h-full  no-scrollbar p-6 lg:p-8 pb-28 lg:pb-8">
// //                 {renderContent()}
// //               </div>
// //             </div>
// //           </main>

// //           {/* --- Mobile/Tablet Bottom Nav (same style as User dashboard) --- */}
// //           <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-800 border border-orange-500/20 backdrop-blur-md text-white rounded-2xl z-40 shadow-2xl shadow-gray-900/30">
// //             <div className="flex justify-around items-center h-16 sm:h-18 px-2">
// //               <button
// //                 onClick={() => handleNavClick('directory')}
// //                 className={`relative p-3 sm:p-4 rounded-xl transition-all duration-300 ${activeView === 'directory' ? 'bg-white/20 text-orange-400' : 'text-gray-400 hover:text-white'
// //                   }`}
// //               >
// //                 <Icons.User />
// //                 {!!viewBadgeMap.directory && (
// //                   <span className="absolute top-2 right-2 sm:top-3 sm:right-3 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold bg-orange-500 text-white flex items-center justify-center">
// //                     {viewBadgeMap.directory}
// //                   </span>
// //                 )}
// //               </button>

// //               <button
// //                 onClick={() => handleNavClick('appointments')}
// //                 className={`relative p-3 sm:p-4 rounded-xl transition-all duration-300 ${activeView === 'appointments' ? 'bg-white/20 text-orange-400' : 'text-gray-400 hover:text-white'
// //                   }`}
// //               >
// //                 <Icons.Calendar />
// //                 {!!viewBadgeMap.appointments && (
// //                   <span className="absolute top-2 right-2 sm:top-3 sm:right-3 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold bg-red-500 text-white flex items-center justify-center">
// //                     {viewBadgeMap.appointments}
// //                   </span>
// //                 )}
// //               </button>

// //               <button
// //                 onClick={() => setShowMobileNav(true)}
// //                 className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${showMobileNav ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
// //                   }`}
// //               >
// //                 <Icons.Menu />
// //               </button>
// //             </div>
// //           </nav>
// //         </div>
// //       </div>

// //       {/* Mobile Drawer */}
// //       {showMobileNav && (
// //         <MobileNavDrawer
// //           activeView={activeView}
// //           onNavClick={handleNavClick}
// //           onClose={() => setShowMobileNav(false)}
// //           onLogout={handleLogoutClick}
// //           practiceName={practice.practiceName}
// //         />
// //       )}

// //       {/* Logout Confirmation Modal */}
// //       {showLogoutModal &&
// //         createPortal(
// //           <div className="fixed inset-0 z-[9999] flex items-center justify-center">
// //             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelLogout} />
// //             <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all m-4 animate-in zoom-in-95 duration-200">
// //               <div className="p-6 text-center">
// //                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                   <AlertCircle className="text-red-600" size={24} />
// //                 </div>

// //                 <h3 className="text-lg font-bold text-gray-900 mb-2">Sign out?</h3>

// //                 <p className="text-sm text-gray-600 mb-6">
// //                   Are you sure you want to sign out? You will need to log in again to access the dashboard.
// //                 </p>

// //                 <div className="flex gap-3">
// //                   <button
// //                     onClick={cancelLogout}
// //                     className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={confirmLogout}
// //                     className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
// //                   >
// //                     Sign Out
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>,
// //           document.body
// //         )}
// //     </div>
// //   );
// // }


// import React, { useMemo, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { usePracticeAuth } from '../../hooks/usePracticeAuth';
// import type { MenuItem } from '../../types/dashboard';
// import PracticeAppointmentsView from './PracticeAppointmentsView';
// import PracticeDirectoryView from './PracticeDirectoryView';
// import { Icons } from '../../components/dashboard/Icons';
// import { AlertCircle, User, Calendar, LogOut, ChevronRight, Menu, X } from 'lucide-react';
// import PracticeBookingCalender from './PracticeBookingCalender';

// type ActiveViewType = 'directory' | 'appointments' | 'bookingcalender';

// // --- Components ---

// interface SidebarLinkProps {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
//   onClick?: () => void;
// }

// const SidebarLink: React.FC<SidebarLinkProps> = ({
//   icon,
//   label,
//   active = false,
//   onClick,
// }) => (
//   <button
//     onClick={onClick}
//     className={`
//       w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4
//       group hover:bg-gray-50
//       ${active
//         ? 'border-orange-500 text-gray-900 bg-orange-50/30'
//         : 'border-transparent text-gray-400 hover:text-gray-600'
//       }
//     `}
//   >
//     <div className={`${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
//       {icon}
//     </div>
//     <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
//       {label}
//     </span>
//   </button>
// );

// interface ContentTabProps {
//   label: string;
//   count?: number;
//   active: boolean;
//   onClick: () => void;
// }

// const ContentTab: React.FC<ContentTabProps> = ({ label, count, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`
//       relative pb-4 px-1 text-sm font-medium transition-all duration-200
//       ${active
//         ? 'text-gray-800 border-b-2 border-orange-500'
//         : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
//       }
//     `}
//   >
//     <div className="flex items-center gap-2">
//       {label}
//       {count !== undefined && (
//         <span className={`
//           text-xs px-2 py-0.5 rounded-full border
//           ${active
//             ? 'border-orange-500 text-orange-500'
//             : 'border-gray-200 text-gray-400'
//           }
//         `}>
//           {count}
//         </span>
//       )}
//     </div>
//   </button>
// );

// const MobileNavDrawer: React.FC<{
//   activeView: ActiveViewType;
//   onNavClick: (view: ActiveViewType) => void;
//   onClose: () => void;
//   onLogout: () => void;
//   practiceName: string;
// }> = ({ activeView, onNavClick, onClose, onLogout, practiceName }) => {
//   const navItems: Array<{ id: ActiveViewType | 'logout'; label: string; icon: React.ReactNode }> = [
//     { id: 'directory', label: 'My Directory', icon: <User size={20} /> },
//     { id: 'appointments', label: 'My Appointment', icon: <Calendar size={20} /> },
//     { id: 'bookingcalender', label: 'Booking Calender', icon: <Calendar size={20} /> },
//     { id: 'logout', label: 'Log Out', icon: <LogOut size={20} /> },
//   ];

//   const handleClick = (id: ActiveViewType | 'logout') => {
//     if (id === 'logout') {
//       onClose();
//       onLogout();
//       return;
//     }
//     onNavClick(id);
//     onClose();
//   };

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
//         onClick={onClose}
//       />
//       <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
//         <div className="p-6 bg-gray-50">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-xl font-bold text-gray-800">Menu</h2>
//             <button onClick={onClose} className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//             <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
//               {practiceName.charAt(0)}
//             </div>
//             <div>
//               <div className="font-bold text-gray-900 truncate">{practiceName}</div>
//               <div className="text-xs text-gray-500">Practice Admin</div>
//             </div>
//           </div>
//         </div>
//         <nav className="flex-1 py-4">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleClick(item.id)}
//               className={`
//                 w-full flex items-center gap-4 px-6 py-4
//                 ${activeView === item.id ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-500'}
//                 ${item.id === 'logout' ? 'text-red-500 mt-4 border-t border-gray-100' : ''}
//               `}
//             >
//               {item.icon}
//               <span className="font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import PracticeAppointmentsView from './PracticeAppointmentsView';
import PracticeDirectoryView from './PracticeDirectoryView';
import { Icons } from '../../components/dashboard/Icons';
import { AlertCircle, User, Calendar, LogOut, Menu, X } from 'lucide-react';
import PracticeBookingCalender from './PracticeBookingCalender';

type ActiveViewType = 'directory' | 'appointments' | 'bookingcalender';

// --- Components ---

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
  const [activeView, setActiveView] = useState<ActiveViewType>('appointments');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!practice) return null;

  const badges = {
    appointments: 4,
    directory: 0
  };

  const renderContent = () => {
    switch (activeView) {
      case 'appointments':
        return <PracticeAppointmentsView />;
      case 'bookingcalender':
        return <PracticeBookingCalender />;
      case 'directory':
      default:
        return <PracticeDirectoryView />;
    }
  };

  const handleNavClick = (view: ActiveViewType) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                    icon={<Icons.User />}
                    label="My Directory"
                    active={activeView === 'directory'}
                    onClick={() => handleNavClick('directory')}
                  />
                  <SidebarLink
                    icon={<Icons.Calendar />}
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
              {activeView !== 'bookingcalender' && (
                <div className="px-8 pt-8 border-b border-gray-100">
                  <div className="flex items-center gap-8">
                    <ContentTab
                      label="Directory Details"
                      active={activeView === 'directory'}
                      onClick={() => handleNavClick('directory')}
                    />
                    <ContentTab
                      label="Appointments"
                      count={badges.appointments}
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