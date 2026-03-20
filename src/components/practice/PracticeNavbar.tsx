import React, { useState } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
// vvv UPDATED IMPORT vvv
import { logout } from "../../features/auth/auth.slice";
import ConfirmLogoutModal from "../layout/ConfirmLogoutModal";

const PracticeNavbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // vvv UPDATED SELECTOR vvv
    // We now read directly from state.auth
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        setShowLogoutModal(false);
        navigate('/practice/signin', { replace: true });
    };

    const navLinks = [
        { name: "Directory", path: "/practice/dashboard/directory", view: "directory" },
        { name: "Appointments", path: "/practice/dashboard/appointments", view: "appointments" },
        { name: "Calendar", path: "/practice/dashboard/booking-calendar", view: "booking-calendar" },
    ];

    // Helper to style active link
    const isActive = (linkView: string) => {
        const params = new URLSearchParams(location.search);
        const currentView = params.get('view');
        
        // Default to appointments if on dashboard root
        if (!currentView && location.pathname === '/practice/dashboard' && linkView === 'appointments') {
            return true;
        }
        return currentView === linkView;
    };

    return (
        <nav className="w-full bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">

                {/* Logo Area */}
                <Link to="/practice/dashboard" className="flex items-center gap-2">
                    <img 
                        src={logo} 
                        alt="Dental Interface Logo" 
                        className="h-6 sm:h-7 md:h-8 w-auto" 
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-3 lg:gap-6">
                    
                    {/* Show Menu only if Logged In */}
                    {isAuthenticated && user && (
                        <>
                            {/* Links */}
                            <div className="flex items-center gap-3 lg:gap-6 mr-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`font-medium text-xs sm:text-xs md:text-base transition-colors duration-200 ${
                                            isActive(link.view)
                                                ? "text-orange-600 font-bold"
                                                : "text-gray-700 hover:text-orange-600"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-6 w-px bg-gray-200 mx-2"></div>

                            {/* Actions (Bell + Logout) */}
                            <div className="flex items-center gap-2 lg:gap-3">
                                <button className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                                    <Bell size={18} className="sm:w-5 sm:h-5" />
                                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full border-2 border-white">
                                        3
                                    </span>
                                </button>

                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} className="sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Show Login link if NOT logged in */}
                    {!isAuthenticated && (
                        <Link to="/practice/signin" className="text-sm font-medium text-orange-600 hover:underline">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    {isAuthenticated && user && (
                         <div className="text-sm font-bold text-gray-700 truncate max-w-[100px]">
                            {user.practiceName}
                         </div>
                    )}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 p-2">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && isAuthenticated && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-sm font-medium block py-2 ${
                                isActive(link.view) ? "text-orange-600 font-bold" : "text-gray-600"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                        onClick={() => setShowLogoutModal(true)} 
                        className="flex items-center gap-2 text-sm font-medium text-red-600 py-2"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            )}

            {/* Logout Confirmation */}
            <ConfirmLogoutModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </nav>
    );
};

export default PracticeNavbar;