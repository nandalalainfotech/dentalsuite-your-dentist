import React, { useState } from 'react';
import {
    Settings,
    LayoutDashboard,
    Calendar,
    PieChart,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Clients from './Clients'; // <--- Import the new separate file
import SuperAdminNavbar from '../../components/superadmin/SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';

const SuperAdminDashboard: React.FC = () => {
    // State for managing the active view
    const [activeTab, setActiveTab] = useState('Clients');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole"); 
        localStorage.removeItem("user");
        navigate("/practice/signin"); 
    };

    // Content Switcher
    const renderContent = () => {
        switch (activeTab) {
            case 'Clients': return <Clients />; // <--- Use the imported component
            case 'Dashboard': return <PlaceholderContent title="Dashboard Overview" icon={<LayoutDashboard size={40} />} />;
            case 'Bookings': return <PlaceholderContent title="Booking Management" icon={<Calendar size={40} />} />;
            case 'Analytics': return <PlaceholderContent title="Analytics & Reports" icon={<PieChart size={40} />} />;
            case 'Invoices': return <PlaceholderContent title="Invoice History" icon={<FileText size={40} />} />;
            case 'Settings': return <PlaceholderContent title="System Settings" icon={<Settings size={40} />} />;
            default: return <Clients />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            
            {/* --- 1. TOP NAVBAR --- */}
            <SuperAdminNavbar />

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 lg:py-10">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* --- 2. SIDEBAR SECTION --- */}
                    <div className="hidden lg:block sticky top-24 h-fit z-30">
                        <SuperAdminSidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            onLogout={handleLogout} 
                        />
                    </div>

                    {/* --- 3. MAIN CONTENT SECTION --- */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-[20px] shadow-sm min-h-[600px] flex flex-col">
                            <div className="p-6 lg:p-8 flex-1">
                                {renderContent()}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Placeholder Component (Kept here as it's a generic utility for this page)
// ----------------------------------------------------------------------

const PlaceholderContent = ({ title, icon }: { title: string, icon: React.ReactNode }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-400 mt-2">This module is currently under development.</p>
        </div>
    )
}

export default SuperAdminDashboard;