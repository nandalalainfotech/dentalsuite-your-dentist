import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import logo from "../assets/logo.svg";

const ListYourPractice: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    
                    {/* Logo area */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="/"
                            className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors hidden sm:block"
                        >
                            I'm a Patient
                        </Link>
                        <Link
                            to="/practice/signin"
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all whitespace-nowrap"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-grow">
                {/* HERO SECTION */}
                <section className="w-full bg-gray-50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>
                                    Now accepting new clinics in NSW & VIC
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                    Expand your reach,<br className="hidden sm:block" /> 
                                    simplify your<br className="hidden sm:block" /> 
                                    <span className="text-orange-500"> workflow.</span>
                                </h1>

                                <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
                                    Join the network where millions of Australians find and book local healthcare.
                                    We provide the tools you need to fill your calendar and reduce administrative overhead.
                                </p>

                                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <Link 
                                        to="/practice/signup" 
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition text-center shadow-orange-200 text-sm sm:text-base"
                                    >
                                        Join for free
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="relative flex justify-center order-1 lg:order-2">
                                {/* Decorator blob */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/20 blur-3xl rounded-full -z-10"></div>

                                <div className="relative max-w-sm sm:max-w-md w-full">
                                    <img
                                        src="/assets/doctor-phone.png"
                                        alt="Healthcare professional using app"
                                        className="rounded-2xl shadow-2xl border-4 border-white w-full"
                                    />

                                    {/* Floating Card - Hidden on mobile, shown on sm and up */}
                                    <div className="absolute top-4 sm:top-10 -left-4 sm:-left-10 bg-white/90 backdrop-blur shadow-xl border border-white/50 rounded-2xl p-3 sm:p-4 w-48 sm:w-64 z-20 animate-bounce-slow hidden sm:block">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm sm:text-base">DC</div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-gray-900">Downtown Dental</p>
                                                <p className="text-[8px] sm:text-[10px] text-gray-500">45 Medical Plaza, NSW</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium">
                                            <span>● Live Booking</span>
                                            <span className="text-xs">Just now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENEFITS SECTION */}
                <section id="benefits" className="py-12 sm:py-16 lg:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Everything you need to succeed
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
                                We don't just list your practice; we provide an ecosystem that
                                drives growth and improves patient satisfaction.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
                            {[
                                { icon: "📈", title: "Boost Patient Volume", desc: "Position your clinic in front of high-intent patients looking specifically for your services in your local area." },
                                { icon: "⚡", title: "Seamless Integration", desc: "Our platform syncs effortlessly with your existing practice management software to automate bookings and reminders." },
                                { icon: "🛡️", title: "Trust & Credibility", desc: "Leverage verified patient reviews to showcase your expertise and turn profile visitors into loyal, long-term patients." }
                            ].map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-gray-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 rounded-2xl border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-xl sm:text-2xl border border-gray-100">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STATS & TESTIMONIAL */}
                <section id="stats" className="bg-slate-900 py-12 sm:py-16 lg:py-24 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            {/* Stats */}
                            <div>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-10 leading-tight">
                                    Australia's most trusted <br className="hidden sm:block" /> 
                                    <span className="text-orange-500">healthcare marketplace</span>
                                </h2>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-8">
                                    {[
                                        { num: "33%", label: "Market Share" },
                                        { num: "23k+", label: "Active Providers" },
                                        { num: "13M+", label: "Yearly Bookings" },
                                        { num: "98%", label: "Partner Retention" }
                                    ].map((stat, i) => (
                                        <div key={i} className="border-l-4 border-orange-500 pl-4 sm:pl-6">
                                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{stat.num}</p>
                                            <p className="text-slate-400 mt-1 text-xs sm:text-sm font-medium uppercase tracking-wide">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="bg-slate-800 p-6 sm:p-8 lg:p-10 rounded-3xl relative">
                                <span className="text-6xl sm:text-7xl lg:text-8xl text-slate-700 absolute -top-4 sm:-top-6 -left-2 sm:-left-4 font-serif leading-none">"</span>
                                <blockquote className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-medium leading-relaxed mb-6 lg:mb-8 relative z-10">
                                    We needed a solution that reduced no-shows and filled
                                    last-minute cancellations. This platform didn't just solve that;
                                    they completely revitalized how we acquire new patients.
                                </blockquote>

                                <div className="flex items-center gap-3 sm:gap-4 border-t border-slate-700 pt-4 sm:pt-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-base sm:text-lg">SP</div>
                                    <div>
                                        <p className="font-bold text-white text-sm sm:text-base">
                                            Dr. Sandeep Peddi
                                        </p>
                                        <p className="text-slate-400 text-xs sm:text-sm">
                                            Clinical Director, Bright Smile Group
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GET STARTED SECTION */}
                <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-orange-50 to-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Take your practice to the next level
                        </h2>
                        <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                            Setup takes less than 10 minutes. Create your profile now and
                            start welcoming new patients as early as tomorrow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                            <Link 
                                to="/practice/signup" 
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition text-center shadow-lg shadow-orange-200"
                            >
                                Create Practice Profile
                            </Link>
                            <button className="bg-white hover:bg-gray-50 text-gray-800 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg border border-gray-200 transition">
                                Talk to an Expert
                            </button>
                        </div>

                        <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200 px-4 sm:px-0">
                            <p className="text-gray-500 text-xs sm:text-sm mb-2">
                                Already have a practice account?
                                <Link to="/practice/signin" className="text-orange-600 hover:underline font-semibold ml-1">Sign in here</Link>
                            </p>
                            <p className="text-gray-400 text-xs">
                                Need help onboarding? Call our support line at <span className="font-medium text-gray-600">1800 123 456</span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default ListYourPractice;