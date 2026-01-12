import { useState } from 'react';
import { Icons } from '../../components/dashboard/Icons';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import type { MenuItem } from '../../types/dashboard';

export default function PracticeDashboard() {
  const { practice, logout } = usePracticeAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'overview' | 'profile' | 'patients' | 'settings' | 'Help Centre'>(
    'appointments'
  );

  if (!practice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    { id: 'appointments', label: 'My Directory', icon: Icons.appointments, badge: 1 },
    { id: 'overview', label: 'View Profile', icon: Icons.User, badge: 10 },
    { id: 'profile', label: 'Appointments', icon: Icons.Clock, badge: 12 },
    { id: 'certificate', label: 'My Certificate', icon: Icons.Certificate, badge: 5 },
    { id: 'patients', label: 'Patients', icon: Icons.patients, badge: 18 },
    { id: 'settings', label: 'Settings', icon: Icons.settings, badge: 18 },
    { id: 'Help Centre', label: 'Help Centre', icon: Icons.HelpDesk, badge: 0 },
  ];



  return (
    <div className="min-h-screen bg-[#F2F5F9] p-4 lg:p-6 flex flex-col md:flex-row gap-6">

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
          <img
            src="https://ui-avatars.com/api/?name=Dental+Clinic&background=FFEDD5&color=EA580C&size=128"
            alt="Practice Avatar"
            className="w-20 h-20 rounded-full object-cover mb-4"
          />

          <h2 className="text-lg font-bold">{practice.practiceName}</h2>
          <p className="text-xs text-slate-400 uppercase mt-1">Practice Admin</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return isActive ? (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-orange-500"><Icon /></span>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-orange-500 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <Icons.ChevronRight />
                </div>
              </button>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="px-6 py-4 flex items-center justify-between text-slate-500 hover:text-slate-900"
              >
                <div className="flex items-center gap-4">
                  <Icon />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-slate-100 text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>

            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-2 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-red-600"
          >
            <Icons.logout />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col gap-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="text-orange-500">{practice.practiceName.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Here's what's happening with your practice today.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex-1">
          {/* {activeTab === 'appointments' ? (
            <p className="text-slate-500">Appointments UI (already implemented)</p>
          ) : ( */}
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            {(() => {
              const item = menuItems.find(i => i.id === activeTab);
              const Icon = item?.icon;
              return Icon ? <Icon /> : null;
            })()}
            <h3 className="text-xl font-bold">{menuItems.find(i => i.id === activeTab)?.label}</h3>
            <p className="text-slate-500 mt-2">This section is under development.</p>
          </div>
          {/* )} */}
        </div>

      </main>
    </div>
  );
}
