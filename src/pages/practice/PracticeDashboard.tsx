import { useState } from 'react';
import { Icons } from '../../components/dashboard/Icons';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import type { MenuItem } from '../../types/dashboard';
import PracticeAppointmentsView from './PracticeAppointmentsView';
import PracticeDirectoryView from './PracticeDirectoryView';

export default function PracticeDashboard() {
  const { practice, logout } = usePracticeAuth();

  // Set default tab
  const [activeTab, setActiveTab] = useState<string>('directory');

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


        {/* Dynamic Content Container */}
        <div className="bg-white rounded-3xl shadow-sm p-6 lg:p-8 flex-1 overflow-y-auto no-scrollbar">
          {renderContent()}
        </div>

      </main>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}