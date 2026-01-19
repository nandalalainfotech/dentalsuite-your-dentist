// import { useState } from 'react';
// import { Icons } from '../../components/dashboard/Icons';
// import { usePracticeAuth } from '../../hooks/usePracticeAuth';
// import type { MenuItem } from '../../types/dashboard';

// export default function PracticeDashboard() {
//   const { practice, logout } = usePracticeAuth();
//   const [activeTab, setActiveTab] = useState<MenuItem['id']>('appointments');

//   if (!practice) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
//           <div className="h-4 w-32 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   const menuItems: MenuItem[] = [
//     { id: 'appointments', label: 'My Directory', icon: Icons.appointments, badge: 1 },
//     { id: 'profile', label: 'Appointments', icon: Icons.Clock, badge: 12 },
//   ];

//   return (
//     // If it's still cut off, increase '100px' to '110px' or '120px'.
//     <div className="h-[calc(100vh-100px)] bg-[#F2F5F9] p-4 lg:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">

//       {/* ================= LEFT SIDEBAR ================= */}
//       <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 h-full">

//         {/* A. Profile Card (Fixed at Top) */}
//         <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center flex-shrink-0">
//           <img
//             src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
//             alt="Practice Avatar"
//             className="w-16 h-16 rounded-full object-cover mb-3"
//           />
//           <h2 className="text-base font-bold truncate w-full">{practice.practiceName}</h2>
//           <p className="text-[10px] text-slate-400 uppercase mt-1">Practice Admin</p>
//         </div>

//         {/* B. Navigation (SCROLLABLE MIDDLE SECTION) */}
//         <nav className="flex-1 overflow-y-auto no-scrollbar min-h-0 space-y-2 pr-2">
//           {menuItems.map(item => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.id;

//             return isActive ? (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg flex-shrink-0 transition-all"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-orange-500"><Icon /></span>
//                   <span className="font-semibold text-sm">{item.label}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {item.badge && (
//                     <span className="bg-orange-500 text-xs px-2 py-0.5 rounded-full">
//                       {item.badge}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             ) : (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className="w-full px-6 py-4 flex items-center justify-between text-slate-500 hover:text-slate-900 flex-shrink-0 transition-colors"
//               >
//                 <div className="flex items-center gap-4">
//                   <Icon />
//                   <span className="text-sm">{item.label}</span>
//                 </div>
//                 {item.badge && (
//                   <span className="bg-slate-100 text-xs px-2 py-0.5 rounded-full">
//                     {item.badge}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* C. Logout (Fixed at Bottom) */}
//         <div className="flex-shrink-0 pt-2">
//           <button
//             onClick={logout}
//             className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-red-600 transition-colors bg-white/50 rounded-2xl md:bg-transparent"
//           >
//             <Icons.logout />
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 flex flex-col gap-6 h-full overflow-hidden">

//         {/* Header (Fixed) */}
//         <header className="flex flex-col md:flex-row justify-between gap-4 flex-shrink-0">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">
//               Welcome back, <span className="text-orange-500">{practice.practiceName.split(' ')[0]}!</span>
//             </h1>
//             <p className="text-slate-500 mt-1 text-sm md:text-base">
//               Here's what's happening with your practice today.
//             </p>
//           </div>
//         </header>

//         {/* Content Card (Scrollable) */}
//         <div className="bg-white rounded-3xl shadow-sm p-6 flex-1 overflow-y-auto no-scrollbar">
//           <div className="flex flex-col items-center justify-center min-h-[300px] text-center h-full">
//             {(() => {
//               const item = menuItems.find(i => i.id === activeTab);
//               const Icon = item?.icon;
//               return Icon ? <Icon /> : null;
//             })()}
//             <h3 className="text-xl font-bold mt-4">{menuItems.find(i => i.id === activeTab)?.label}</h3>
//             <p className="text-slate-500 mt-2">This section is under development.</p>
//           </div>
//         </div>

//       </main>

//       {/* Styles for hiding scrollbars */}
//       <style>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// }


import { useState } from 'react';
import { Icons } from '../../components/dashboard/Icons';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import type { MenuItem } from '../../types/dashboard';
import PracticeAppointmentsView from './practiceAppointmentsView';
import PracticeDirectoryView from './PracticeDirectoryView';

export default function PracticeDashboard() {
  const { practice, logout } = usePracticeAuth();

  // Set default tab
  const [activeTab, setActiveTab] = useState<string>('appointments');

  if (!practice) return null; // Or your loading state

  const menuItems: MenuItem[] = [
    { id: 'directory', label: 'My Directory', icon: Icons.User, badge: 1 },
    { id: 'appointments', label: 'Appointments', icon: Icons.Calendar, badge: 12 },
  ];

  // Logic to switch between pages
  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <PracticeAppointmentsView />;
      case 'directory':
        return <PracticeDirectoryView />;
      default:
        return <PracticeAppointmentsView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5F9] p-4 lg:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">

      {/* ... (Keep your SIDEBAR code exactly as it was) ... */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 h-full">
        {/* Profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center flex-shrink-0">
          <img
            src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
            alt="Practice Avatar"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h2 className="text-base font-bold truncate w-full">{practice.practiceName}</h2>
          <p className="text-[10px] text-slate-400 uppercase mt-1">Practice Admin</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto no-scrollbar min-h-0 space-y-2 pr-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-orange-500" : ""}><Icon /></span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 pt-2">
          <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-red-600 transition-colors">
            <Icons.logout /> Sign Out
          </button>
        </div>
      </aside>


      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col gap-6 h-full overflow-hidden">

        {/* <header className="flex flex-col md:flex-row justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, <span className="text-orange-500">{practice.practiceName.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Here's what's happening with your practice today.
            </p>
          </div>
        </header> */}

        {/* Dynamic Content Container */}
        <div className="bg-white rounded-3xl shadow-sm p-6 lg:p-8 flex-1 overflow-y-auto no-scrollbar">
          {renderContent()}
        </div>

      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}