import React from 'react';
import {
    Users,
    LayoutDashboard,
    Calendar,
    Settings,
    PieChart,
    FileText,
    LogOut
} from 'lucide-react';
import { usePracticeAuth } from '../../hooks/usePracticeAuth'; // <--- 1. Import Auth Hook

// --- Types ---
export type SuperAdminView = 'Clients' | 'Dashboard' | 'Bookings' | 'Analytics' | 'Invoices' | 'Settings';

interface SuperAdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

// --- Internal Helper Component ---
interface SidebarLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 group hover:bg-gray-50
       ${active
                ? 'border-orange-500 text-gray-900 bg-orange-50/30'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
    >
        <div className={`${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
            {icon}
        </div>
        <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
    </button>
);

// --- Main Sidebar Component ---
const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
    
    // 2. Get the authenticated practice data from Context
    const { practice } = usePracticeAuth();

    // 3. Prepare Display Data
    // Fallbacks provided just in case data is loading
    const displayName = practice?.practiceName || 'Admin User';
    const displayRole = practice?.role === 'superadmin' ? 'Super Admin' : 'Administrator';
    
    // Get first letter for avatar if no logo
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden sticky top-6">

                {/* Profile Header (Connected to DB) */}
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-4 mb-2">
                        
                        {/* Dynamic Avatar / Logo */}
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md relative overflow-hidden bg-orange-500 text-white text-xl font-bold">
                            {practice?.practiceLogo ? (
                                <img 
                                    src={practice.practiceLogo} 
                                    alt={displayName} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span>{initial}</span>
                            )}
                        </div>

                        {/* Dynamic Name & Role */}
                        <div className="min-w-0 flex-1">
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                                {displayRole}
                            </p>
                            <h2 className="font-bold text-gray-900 text-sm leading-tight truncate" title={displayName}>
                                {displayName}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col pb-4">
                    
                    <SidebarLink
                        icon={<Users size={20} />}
                        label="Clients"
                        active={activeTab === 'Clients'}
                        onClick={() => setActiveTab('Clients')}
                    />
                    
                    <SidebarLink
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={activeTab === 'Dashboard'}
                        onClick={() => setActiveTab('Dashboard')}
                    />
                    <SidebarLink
                        icon={<Calendar size={20} />}
                        label="Bookings"
                        active={activeTab === 'Bookings'}
                        onClick={() => setActiveTab('Bookings')}
                    />
                    <SidebarLink
                        icon={<PieChart size={20} />}
                        label="Analytics"
                        active={activeTab === 'Analytics'}
                        onClick={() => setActiveTab('Analytics')}
                    />
                    <SidebarLink
                        icon={<FileText size={20} />}
                        label="Invoices"
                        active={activeTab === 'Invoices'}
                        onClick={() => setActiveTab('Invoices')}
                    />
                    <SidebarLink
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={activeTab === 'Settings'}
                        onClick={() => setActiveTab('Settings')}
                    />

                    {/* Logout Action */}
                    <div className="mt-4 pt-4 border-t border-gray-50 mx-6">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium w-full py-2"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;