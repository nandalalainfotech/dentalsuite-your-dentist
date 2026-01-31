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

            <div className="relative h-56 sm:h-64 md:h-60 w-full overflow-visible">
                {<img
                    src={clinicData.banner}
                    alt="Clinic Banner"
                    className="w-full h-full object-cover object-center"
                />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Banner Overlay Content */}
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex justify-start">
                        {/* Clinic Info Box */}
                        <div className="bg-black/60 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-2xl">
                            <div className="flex flex-col items-start gap-3">
                                {/* Clinic Information Wrapper */}
                                <div className="w-full flex flex-col items-start text-left">
                                    {/* Clinic Name & Logo */}
                                    <h1 className="flex flex-row items-center justify-start gap-3 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 mb-2">
                                        <img
                                            src={clinicData.logo}
                                            alt={clinicData.name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-100 flex-shrink-0"
                                        />
                                        <span className="break-words line-clamp-2">
                                            {clinicData.name.toUpperCase()}
                                        </span>
                                    </h1>

                                    {/* Address */}
                                    <div className="text-gray-300 text-sm sm:text-base mb-2">
                                        <p className="font-medium line-clamp-1 sm:line-clamp-none text-left">
                                            {clinicData.address}
                                        </p>
                                    </div>

                                    {/* Emergency Badge */}
                                    {clinicData.emergency !== undefined && (
                                        <div className="flex items-center justify-start mb-2 gap-2">
                                            {clinicData.emergency ? (
                                                <>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                                                    <span className="text-green-400 font-semibold text-xs sm:text-sm">
                                                        Emergency available
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                                                    <span className="text-red-400 font-semibold text-xs sm:text-sm">
                                                        No emergency service
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div className="flex items-center justify-start gap-2">
                                        <span className="text-white font-bold text-sm sm:text-base">
                                            {clinicData.rating || 0}
                                        </span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(clinicData.rating || 0)
                                                        ? "text-yellow-500"
                                                        : "text-gray-400"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-12 sm:gap-16 max-w-5xl mx-auto mt-5">

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
                            <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">{(clinicData.dentists || []).length} Dentists</span>
                        </div>

                        <div className="p-2 sm:p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {(clinicData.dentists || []).map((dentist, i) => (
                                <div key={i} className="flex flex-col items-center p-6 sm:p-8 border border-gray-200 rounded-2xl bg-white">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 mb-6 border-4 border-white shadow-md overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                            <img
                                                src={dentist.image}
                                                alt={dentist.name}
                                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
                                            />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg sm:text-xl">{dentist.name}</h4>
                                    <p className="text-gray-500 mt-2 text-sm sm:text-base">{dentist.qualification}</p>
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
                        <div className="flex flex-wrap gap-3 bg-white p-6">
                            {(clinicData.facilities || []).map((fac, i) => (
                                <span key={i} className="px-3 py-2 font-medium text-sm text-gray-800 rounded-full border-2 transition-all">
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