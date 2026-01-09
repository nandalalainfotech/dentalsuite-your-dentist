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
                            <p className="text-orange-600 font-medium mb-3">For Healthcare Providers</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                More visibility and <br />
                                a better patient <br />
                                experience
                            </h1>

                            <p className="mt-6 text-gray-600 text-lg max-w-md">
                                YourDentist helps over 13 million patients connect and engage
                                with practices just like yours. Join Australia's largest healthcare
                                platform to grow your practice.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium">
                                    Get started now
                                </button>
                                <button className="bg-white hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium border border-gray-300 transition">
                                    Schedule a demo
                                </button>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                <span className="text-green-600">✓</span>
                                <span>No setup fees</span>
                                <span className="mx-2">•</span>
                                <span className="text-green-600">✓</span>
                                <span>Free trial available</span>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative flex justify-center">
                            <div className="absolute bg-orange-700 w-72 h-72 rounded-xl -z-10"></div>

                            <img
                                src="/assets/doctor-phone.png"
                                alt="Doctor using phone"
                                className="rounded-xl shadow-lg max-w-sm"
                            />

                            {/* Floating Card */}
                            <div className="absolute top-6 left-6 bg-white shadow-lg rounded-lg p-4 w-64">
                                <p className="text-sm font-semibold text-gray-800">
                                    Your Health Practice
                                </p>
                                <p className="text-xs text-gray-500">
                                    123 Health Street, VIC
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                    ● Open · Closes 10pm
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
                                Grow your practice with YourDentist
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Join thousands of healthcare providers who are already enhancing their
                                practice management and patient relationships
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">👥</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Reach More Patients
                                </h3>
                                <p className="text-gray-600">
                                    Get discovered by patients actively searching for healthcare
                                    providers in your area. Our platform connects you with
                                    patients who need your services.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">📱</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Modern Practice Management
                                </h3>
                                <p className="text-gray-600">
                                    Streamline appointments, patient communication, and
                                    administrative tasks with our integrated practice
                                    management tools.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-orange-600 text-xl">⭐</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Build Your Reputation
                                </h3>
                                <p className="text-gray-600">
                                    Collect and showcase patient reviews to build trust and
                                    credibility. Positive feedback helps attract more patients
                                    to your practice.
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
                                Be part of Australia's <br /> biggest patient platform
                            </h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">1 in 3</p>
                                    <p className="text-gray-600 mt-2">
                                        Australians use YourDentist to find healthcare providers
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">23,000+</p>
                                    <p className="text-gray-600 mt-2">
                                        practitioners trust our platform
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">13M+</p>
                                    <p className="text-gray-600 mt-2">
                                        patient connections made annually
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <p className="text-4xl font-bold text-gray-900">4.8/5</p>
                                    <p className="text-gray-600 mt-2">
                                        average practitioner satisfaction rating
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
                                Read full story →
                            </a>

                            <blockquote className="text-xl text-gray-800 font-medium leading-relaxed mb-6">
                                "Patient engagement is really the foundation of everything
                                we do, which is why we first started using YourDentist.
                                The platform has helped us grow our practice by 40% in
                                the first year alone."
                            </blockquote>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Dr Tamsin Franklin
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Owner & Principal GP <br />
                                        Turn the Corner Medical Clinic
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
                            Ready to join thousands of successful practitioners?
                        </h2>
                        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                            Getting started is easy. List your practice today and begin
                            accepting new patients within 24 hours.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition">
                                List Your Practice Now
                            </button>
                            <button className="bg-white hover:bg-gray-300 text-gray-800 px-10 py-4 rounded-lg font-semibold text-lg border border-gray-300 transition">
                                Contact Sales
                            </button>
                        </div>

                        <p className="mt-8 text-gray-500 text-sm">
                            Have questions? Call our practitioner support team at
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
