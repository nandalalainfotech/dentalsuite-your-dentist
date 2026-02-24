import React, { useState } from "react";
import { Menu, X, Bell, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { usePracticeAuth } from "../../hooks/usePracticeAuth";
import ConfirmLogoutModal from "../layout/ConfirmLogoutModal";

const PracticeNavbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { practice, isAuthenticated, logout } = usePracticeAuth();
    const navigate = useNavigate();
    const location = useLocation(); // To highlight active tab

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        setShowLogoutModal(false);
        navigate('/list-your-practice', { replace: true });
    };

    // Helper to style the active link
    const isActive = (path: string) => {
        return location.pathname + location.search === path;
    };

    const navLinks = [
        { name: "Home", path: "/practice/dashboard" },
        { name: "Learning Hub", path: "/practice/dashboard?view=mylearningHub" },
        { name: "Directory", path: "/practice/dashboard?view=directory" },
        { name: "Job Seek", path: "/job-seek" },
        { name: "Catalogue", path: "/catalogue" },
    ];

    return (
        <nav className="w-full bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-3 lg:gap-6">
                    {isAuthenticated && practice ? (
                        <>
                            <div className="flex items-center gap-3 lg:gap-6 mr-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`font-medium text-xs sm:text-sm md:text-base transition ${isActive(link.path)
                                            ? "text-orange-600 font-bold"
                                            : "text-gray-700 hover:text-orange-600"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 lg:gap-3 pl-2 border-l border-gray-200">
                                <button className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                                    <Bell size={16} className="sm:w-5 sm:h-5" />
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full border-2 border-white">
                                        99
                                    </span>
                                </button>

                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
                                >
                                    <LogOut size={16} className="sm:w-5 sm:h-5 ml-0.5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
                        >
                            <LogOut size={16} className="sm:w-5 sm:h-5 ml-0.5" />
                        </button>
                    )}
                </div>

                <button
                    className="md:hidden p-1.5 sm:p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden mt-2 sm:mt-3 space-y-2 pb-2 sm:pb-3 border-t border-gray-100 pt-2">
                    {isAuthenticated && practice ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block w-full px-4 py-2 font-medium text-sm transition ${isActive(link.path) ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="px-4 py-2 flex items-center gap-3">
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className="relative">
                                        <Bell size={18} />
                                        <span className="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] px-1 rounded-full">99</span>
                                    </div>
                                    Notifications
                                </button>
                            </div>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full text-left px-4 py-2 font-bold text-sm text-red-600 hover:text-red-700 transition flex items-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/practice/signin">
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-left px-4 py-2 rounded-lg font-bold text-sm text-black focus:text-orange-600 transition"
                            >
                                Practice Login
                            </button>
                        </Link>
                    )}
                </div>
            )}

            <ConfirmLogoutModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </nav>
    );
};

export default PracticeNavbar;