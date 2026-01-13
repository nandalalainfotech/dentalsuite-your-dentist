import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { usePracticeAuth } from "../../hooks/usePracticeAuth";
import ConfirmLogoutModal from "../layout/ConfirmLogoutModal";

const PracticeNavbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { practice, isAuthenticated, logout } = usePracticeAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        setShowLogoutModal(false);
        navigate('/list-your-practice', { replace: true });
    };

    return (
        <nav className="w-full bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
                </Link>

                <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                    {isAuthenticated && practice ? (
                        <>
                            <span className="text-sm text-gray-600">
                                Welcome, {practice.practiceName}
                            </span>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="px-3 lg:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm md:text-base text-red-600 hover:text-red-700 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/practice/signin">
                            <button className="px-3 lg:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm md:text-base text-black hover:text-orange-600 transition">
                                Practice Login
                            </button>
                        </Link>
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
                <div className="md:hidden mt-2 sm:mt-3 space-y-2 pb-2 sm:pb-3">
                    {isAuthenticated && practice ? (
                        <>
                            <div className="px-4 py-2 text-sm text-gray-600">
                                Welcome, {practice.practiceName}
                            </div>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/practice/dashboard');
                                }}
                                className="w-full px-4 py-2 rounded-lg text-left font-medium text-sm text-gray-700 hover:text-orange-600 transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full px-4 py-2 rounded-lg font-bold text-sm text-red-600 hover:text-red-700 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/practice/signin">
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full px-4 py-2 rounded-lg font-bold text-sm text-black focus:text-orange-600 transition"
                            >
                                Practice Login
                            </button>
                        </Link>
                    )}
                </div>
            )}

            {/* Confirm Logout Modal */}
            <ConfirmLogoutModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </nav>
    );
};

export default PracticeNavbar;