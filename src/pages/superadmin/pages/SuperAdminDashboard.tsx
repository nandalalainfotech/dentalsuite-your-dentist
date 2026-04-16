/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../../features/auth/auth.hooks';
import ConfirmLogoutModal from '../../../components/layout/ConfirmLogoutModal';
import SuperAdminNavbar from '../../../components/superadmin/SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';

interface ContentTabProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative pb-4 px-1 text-sm font-semibold transition-all duration-200 ${active
            ? 'text-gray-900 border-b-2 border-[#f47521]'
            : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
            }`}
    >
        {label}
    </button>
);

export default function SuperAdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleLogout, loading } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="w-10 h-10 animate-spin text-[#f47521] mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Admin Panel...</h2>
            </div>
        );
    }

    const isManagementView = location.pathname.includes('/practices') || location.pathname.includes('/users');

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <SuperAdminNavbar />

            <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- LEFT SIDEBAR COLUMN --- */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                            
                            {/* PROFILE HEADER SECTION */}
                            <div className="flex items-center gap-4 p-8 border-b border-gray-50">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-orange-50 text-[#f47521]">
                                    <Shield size={28} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Welcome back!</p>
                                    <h2 className="font-bold text-[#1a2b3c] text-lg leading-tight truncate">
                                        Super Admin
                                    </h2>
                                </div>
                            </div>

                            <SuperAdminSidebar onLogout={() => setShowLogoutModal(true)} />
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT AREA --- */}
                    <main className="flex-1 w-full min-w-0">
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 min-h-[700px] flex flex-col overflow-hidden">
                            
                            {/* TABBED NAVIGATION INSIDE MAIN CONTENT */}
                            {isManagementView && (
                                <div className="px-10 pt-8 border-b border-gray-50">
                                    <div className="flex items-center gap-10">
                                        <ContentTab
                                            label="Practices List"
                                            active={location.pathname.includes('/practices')}
                                            onClick={() => navigate('practices')}
                                        />
                                        <ContentTab
                                            label="User Management"
                                            active={location.pathname.includes('/users')}
                                            onClick={() => navigate('users')}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="p-8 lg:p-10 flex-1">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {showLogoutModal &&
                createPortal(
                    <ConfirmLogoutModal
                        open={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={handleLogout}
                    />,
                    document.body
                )}
        </div>
    );
}