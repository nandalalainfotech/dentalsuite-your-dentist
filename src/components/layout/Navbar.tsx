import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* LEFT — LOGO / PROJECT NAME */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
                </Link>

                {/* RIGHT SIDE — DESKTOP BUTTONS */}
                <div className="hidden md:flex items-center space-x-2 lg:space-x-4">

                    {/* List Your Practice */}
                    <Link to="/list-your-practice">
                        <button className="px-3 lg:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm md:text-base text-black hover:text-orange-600 transition">
                            List Your Practice
                        </button>
                    </Link>

                    {/* Login */}
                    <Link to="/login">
                        <button className="px-3 lg:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm md:text-base text-black hover:text-orange-600 transition">
                            Login
                        </button>
                    </Link>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                    className="md:hidden p-1.5 sm:p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
                </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {menuOpen && (
                <div className="md:hidden mt-2 sm:mt-3 space-y-2 pb-2 sm:pb-3">

                    {/* List Your Practice */}
                    <Link to="/list-your-practice">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="w-full px-4 py-2 rounded-lg font-bold text-sm text-black focus:text-orange-600 transition"
                        >
                            List Your Practice
                        </button>
                    </Link>

                    {/* Login */}
                    <Link to="/login">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="w-full px-4 py-2 rounded-lg font-bold text-sm text-black focus:text-orange-600 transition"
                        >
                            Login
                        </button>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
