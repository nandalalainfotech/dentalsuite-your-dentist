import React, { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg"; // Make sure this path is correct for your project
import { useAuth } from "../../hooks/useAuth";

const SuperAdminNavbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    // We default to empty objects/strings to prevent errors if user is null temporarily
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/practice/signin'); // Redirect to Practice/Admin login page
    };

    return (
        <nav className="w-full bg-white px-4 md:px-6 py-3 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="max-w-[1300px] mx-auto flex items-center justify-between">

                {/* --- LEFT SIDE: Logo --- */}
                <Link to="/superadmin/dashboard" className="flex items-center gap-2 group">
                    <img src={logo} alt="Logo" className="h-7 md:h-8 w-auto" />
                </Link>

                {/* --- RIGHT SIDE: Desktop Menu --- */}
                <div className="hidden md:flex items-center space-x-6">

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* --- MOBILE: Toggle Button --- */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- MOBILE: Dropdown Menu --- */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-2 animate-fade-in-down">

                    {/* Mobile Links */}
                    <Link 
                        to="/superadmin/dashboard" 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link 
                        to="/superadmin/dashboard?view=settings" 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                    >
                        <User size={20} />
                        My Profile
                    </Link>

                    <div className="h-px bg-gray-100 my-1"></div>

                    {/* Mobile Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition font-medium w-full text-left"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default SuperAdminNavbar;