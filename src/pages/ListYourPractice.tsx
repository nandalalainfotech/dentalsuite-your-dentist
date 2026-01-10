import React from "react";
import Footer from "../components/layout/Footer";

const ListYourPractice: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                {/* HERO SECTION */}
                <section className="w-full bg-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <p className="text-orange-600 font-medium mb-3">Partner with Us</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Expand your reach <br />
                                and simplify your <br />
                                workflow
                            </h1>

                            <p className="mt-6 text-gray-600 text-lg max-w-md">
                                Join the network where millions of Australians find and book local healthcare.
                                We provide the tools you need to fill your calendar and reduce administrative overhead.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition">
                                    Join for free
                                </button>
                                <button className="bg-white hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium border border-gray-300 transition">
                                    Book a consultation
                                </button>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                <span className="text-green-600">✓</span>
                                <span>No hidden costs</span>
                                <span className="mx-2">•</span>
                                <span className="text-green-600">✓</span>
                                <span>Cancel anytime</span>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative flex justify-center">
                            <div className="absolute bg-orange-700 w-72 h-72 rounded-xl -z-10"></div>

                            <img
                                src="/assets/doctor-phone.png"
                                alt="Healthcare professional using app"
                                className="rounded-xl shadow-lg max-w-sm"
                            />

                            {/* Floating Card */}
                            <div className="absolute top-6 left-6 bg-white shadow-lg rounded-lg p-4 w-64">
                                <p className="text-sm font-semibold text-gray-800">
                                    Downtown Dental Care
                                </p>
                                <p className="text-xs text-gray-500">
                                    45 Medical Plaza, NSW
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                    ● Live · Accepting Bookings
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENEFITS SECTION */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Everything you need to succeed
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We don't just list your practice; we provide an ecosystem that
                                drives growth and improves patient satisfaction.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">📈</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Boost Patient Volume
                                </h3>
                                <p className="text-gray-600">
                                    Position your clinic in front of high-intent patients looking
                                    specifically for your services in your local area.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Seamless Integration
                                </h3>
                                <p className="text-gray-600">
                                    Our platform syncs effortlessly with your existing practice
                                    management software to automate bookings and reminders.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">🛡️</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Trust & Credibility
                                </h3>
                                <p className="text-gray-600">
                                    Leverage verified patient reviews to showcase your expertise
                                    and turn profile visitors into loyal, long-term patients.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS & TESTIMONIAL */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Stats */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-10">
                                Australia's most trusted <br /> healthcare marketplace
                            </h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">33%</p>
                                    <p className="text-gray-600 mt-2">
                                        of Australians book via our platform
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">23k+</p>
                                    <p className="text-gray-600 mt-2">
                                        active healthcare providers
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">13M+</p>
                                    <p className="text-gray-600 mt-2">
                                        appointments facilitated yearly
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">98%</p>
                                    <p className="text-gray-600 mt-2">
                                        retention rate among clinics
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <a
                                href="#"
                                className="text-sm text-orange-600 font-medium flex items-center gap-2 mb-6 hover:text-orange-700 transition"
                            >
                                View case study →
                            </a>

                            <blockquote className="text-xl text-gray-800 font-medium leading-relaxed mb-6">
                                "We needed a solution that reduced no-shows and filled
                                last-minute cancellations. YourDentist didn't just solve that;
                                they completely revitalized how we acquire new patients."
                            </blockquote>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Dr. Sandeep Peddi
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Clinical Director <br />
                                        Bright Smile Dental Group
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GET STARTED SECTION */}
                <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Take your practice to the next level
                        </h2>
                        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                            Setup takes less than 10 minutes. Create your profile now and
                            start welcoming new patients as early as tomorrow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition">
                                Create Practice Profile
                            </button>
                            <button className="bg-white hover:bg-gray-300 text-gray-800 px-10 py-4 rounded-lg font-semibold text-lg border border-gray-300 transition">
                                Talk to an Expert
                            </button>
                        </div>

                        <p className="mt-8 text-gray-500 text-sm">
                            Need help onboarding? Reach our dedicated support line at
                            <span className="font-medium text-gray-700"> 1800 123 456</span>
                        </p>
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
