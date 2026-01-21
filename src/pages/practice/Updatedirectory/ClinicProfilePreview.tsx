import React from 'react';
import {
    Info, Briefcase, Users, Image as ImageIcon,
    Trophy, MessageSquareQuote, ShieldCheck, Building,
    Phone, MapPin, Star, CheckCircle, Mail, Globe, Clock,
    Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';
import type { Clinic } from '../../../types';

/* --- Helper Component for Section Headings --- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionHeading = ({ title, icon: Icon }: { title: string; icon: React.ComponentType<any> }) => (
    <div className="flex items-center gap-2 mb-8 border-b-4 border-orange-500 pb-2">
        <Icon className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
    </div>
);

export default function ClinicProfilePreview({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="bg-white pb-20 font-sans">

            {/* 1. HEADER CARD (Banner & Logo) */}
            <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-900 via-slate-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 text-center md:text-left">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden relative -mt-14 sm:-mt-12 flex-shrink-0">
                        <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-3xl">
                            {clinicData.name.substring(0, 2).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{clinicData.name}</h2>
                                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <Briefcase className="w-4 h-4 text-orange-500" /> {clinicData.tagline}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Sydney, NSW</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100"><Star className="w-3.5 h-3.5 fill-current" /> 4.8 (120 Reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-12 sm:gap-16 max-w-5xl mx-auto">

                    {/* 2. BASIC INFO SECTION */}
                    <section>
                        <SectionHeading title="Basic Info" icon={Info} />
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                            {clinicData.description}
                        </p>
                    </section>

                    {/* 3. SERVICES SECTION */}
                    <section>
                        <SectionHeading title="Our Services" icon={Briefcase} />
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {(clinicData.services || []).map((service, i) => (
                                <span key={i} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 transition cursor-default bg-white shadow-sm text-xs sm:text-sm">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* 4. TEAM SECTION */}
                    <section>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-4 border-orange-500 pb-2 gap-2">
                            <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-5 h-5 text-orange-500" /> Our Team
                            </h3>
                            <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">{(clinicData.team || []).length} Dentists</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {(clinicData.team || []).map((doc, i) => (
                                <div key={i} className="flex flex-col items-center p-6 sm:p-8 border border-gray-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition text-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 mb-6 border-4 border-white shadow-md overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                            <Users className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl">{doc.name}</h4>
                                    <p className="text-gray-500 mt-2 text-sm sm:text-base">{doc.qual} - {doc.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. GALLERY SECTION */}
                    <section>
                        <SectionHeading title="Clinic Gallery" icon={ImageIcon} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 hover:shadow-md transition cursor-pointer"></div>
                            ))}
                        </div>
                    </section>

                    {/* 6. ACHIEVEMENTS */}
                    <section>
                        <SectionHeading title="Achievements" icon={Trophy} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(clinicData.achievements || []).map((award, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-orange-200 transition">
                                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{award.title}</h4>
                                        <p className="text-sm text-gray-500">{award.org}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 7. REVIEWS */}
                    <section>
                        <SectionHeading title="Patient Reviews" icon={MessageSquareQuote} />
                        <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-sm font-bold text-gray-900 ml-2">Alice Johnson</span>
                            </div>
                            <p className="text-gray-600 italic">"Absolutely wonderful experience! Dr. Watson is amazing with kids. The facility is top notch."</p>
                        </div>
                    </section>

                    {/* 8. INSURANCES */}
                    <section>
                        <SectionHeading title="Insurances" icon={ShieldCheck} />
                        <ul className="space-y-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            {(clinicData.insurances || []).map((ins, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {ins}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 9. FACILITIES */}
                    <section>
                        <SectionHeading title="Facilities" icon={Building} />
                        <div className="flex flex-wrap gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            {(clinicData.facilities || []).map((fac, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-200">
                                    {fac}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* 10. CONTACT US */}
                    <section>
                        <SectionHeading title="Contact Us" icon={Phone} />

                        <div className="space-y-8">

                            {/* A. Address & Contact Info Block */}
                            <div className="space-y-4">
                                <h4 className="text-orange-600 font-bold flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Address
                                </h4>

                                {/* Full Address Box */}
                                <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                        {clinicData.address}
                                    </p>
                                </div>

                                {/* Phone & Email Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{clinicData.phone}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium truncate">{clinicData.email}</span>
                                    </div>
                                </div>

                                {/* Website Box */}
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 overflow-hidden">
                                    <Globe className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline truncate">{clinicData.website}</a>
                                </div>
                            </div>

                            {/* B. Location (Map) */}
                            <div>
                                <h4 className="text-orange-600 font-bold flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4" /> Location
                                </h4>
                                <div className="h-48 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_placeholder.svg')] bg-cover opacity-60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:text-orange-600 transition flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-500" /> View larger map
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* C. Opening Hours */}
                            <div>
                                <h4 className="text-orange-600 font-bold flex items-center gap-2 mb-4">
                                    <Clock className="w-4 h-4" /> Opening Hours
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                        <div key={day} className="flex justify-between items-center border-b border-gray-50 pb-2">
                                            <span className="text-gray-600 font-medium">{day}</span>
                                            <span className="text-gray-500">08:00 AM - 06:00 PM</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span className="text-gray-600 font-medium">Saturday</span>
                                        <span className="text-gray-500">08:00 AM - 03:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-red-500 font-medium">Sunday</span>
                                        <span className="text-red-500 font-bold">Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* D. Follow Us */}
                            <div>
                                <h4 className="text-orange-600 font-bold flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4" /> Follow Us
                                </h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <a href="#" className="h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 transition">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 hover:bg-pink-100 transition">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 hover:bg-sky-100 transition">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 transition">
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}