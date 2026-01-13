import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import logo from "../assets/logo.svg";

const ListYourPractice: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Logo area */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
                        </Link>
                        <span className="hidden sm:inline-block bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ml-2">
                            For Practices
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors hidden sm:block"
                        >
                            I'm a Patient
                        </Link>
                        <Link
                            to="/practice/signin"
                            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-grow">
                {/* HERO SECTION */}
                <section className="w-full bg-gray-50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                Now accepting new clinics in NSW & VIC
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                Expand your reach, <br />
                                simplify your <br />
                                <span className="text-orange-600">workflow.</span>
                            </h1>

                            <p className="mt-6 text-gray-600 text-lg max-w-lg leading-relaxed">
                                Join the network where millions of Australians find and book local healthcare.
                                We provide the tools you need to fill your calendar and reduce administrative overhead.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link to="/practice/signup" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition text-center shadow-lg shadow-orange-200">
                                    Join for free
                                </Link>
                                <button className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-semibold border border-gray-200 transition shadow-sm">
                                    Book a demo
                                </button>
                            </div>

                            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                                    <span>No hidden costs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative flex justify-center lg:justify-end">
                            {/* Decorator blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/20 blur-3xl rounded-full -z-10"></div>

                            <div className="relative">
                                <img
                                    src="/assets/doctor-phone.png" // Ensure this image exists
                                    alt="Healthcare professional using app"
                                    className="rounded-2xl shadow-2xl border-4 border-white max-w-sm w-full relative z-10"
                                />

                                {/* Floating Card */}
                                <div className="absolute top-10 -left-10 bg-white/90 backdrop-blur shadow-xl border border-white/50 rounded-2xl p-4 w-64 z-20 animate-bounce-slow hidden sm:block">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">DC</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Downtown Dental</p>
                                            <p className="text-[10px] text-gray-500">45 Medical Plaza, NSW</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg font-medium">
                                        <span>● Live Booking</span>
                                        <span>Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENEFITS SECTION */}
                <section id="benefits" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Everything you need to succeed
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                We don't just list your practice; we provide an ecosystem that
                                drives growth and improves patient satisfaction.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: "📈", title: "Boost Patient Volume", desc: "Position your clinic in front of high-intent patients looking specifically for your services in your local area." },
                                { icon: "⚡", title: "Seamless Integration", desc: "Our platform syncs effortlessly with your existing practice management software to automate bookings and reminders." },
                                { icon: "🛡️", title: "Trust & Credibility", desc: "Leverage verified patient reviews to showcase your expertise and turn profile visitors into loyal, long-term patients." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-gray-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 rounded-2xl border border-transparent hover:border-gray-100">
                                    <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center mb-6 text-2xl border border-gray-100">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STATS & TESTIMONIAL */}
                <section id="stats" className="bg-slate-900 py-24 text-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Stats */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">
                                Australia's most trusted <br /> <span className="text-orange-500">healthcare marketplace</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                {[
                                    { num: "33%", label: "Market Share" },
                                    { num: "23k+", label: "Active Providers" },
                                    { num: "13M+", label: "Yearly Bookings" },
                                    { num: "98%", label: "Partner Retention" }
                                ].map((stat, i) => (
                                    <div key={i} className="border-l-4 border-orange-500 pl-6">
                                        <p className="text-4xl font-bold text-white">{stat.num}</p>
                                        <p className="text-slate-400 mt-1 text-sm font-medium uppercase tracking-wide">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="bg-slate-800 p-10 rounded-3xl relative">
                            <span className="text-8xl text-slate-700 absolute -top-6 -left-4 font-serif leading-none">"</span>
                            <blockquote className="text-xl text-slate-200 font-medium leading-relaxed mb-8 relative z-10">
                                We needed a solution that reduced no-shows and filled
                                last-minute cancellations. This platform didn't just solve that;
                                they completely revitalized how we acquire new patients.
                            </blockquote>

                            <div className="flex items-center gap-4 border-t border-slate-700 pt-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">SP</div>
                                <div>
                                    <p className="font-bold text-white">
                                        Dr. Sandeep Peddi
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        Clinical Director, Bright Smile Group
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GET STARTED SECTION */}
                <section className="py-24 bg-gradient-to-b from-orange-50 to-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Take your practice to the next level
                        </h2>
                        <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
                            Setup takes less than 10 minutes. Create your profile now and
                            start welcoming new patients as early as tomorrow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/practice/signup" className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition text-center shadow-lg shadow-orange-200">
                                Create Practice Profile
                            </Link>
                            <button className="bg-white hover:bg-gray-50 text-gray-800 px-10 py-4 rounded-xl font-semibold text-lg border border-gray-200 transition">
                                Talk to an Expert
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-gray-500 text-sm mb-2">
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