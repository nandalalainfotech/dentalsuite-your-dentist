/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import {
    Info, Briefcase, Users, Image as ImageIcon,
    Trophy, MessageSquareQuote, ShieldCheck, Building,
    Phone, MapPin, Star, CheckCircle, Mail, Globe, Clock,
    Facebook, Instagram, Twitter, Youtube, FileText,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import type { DirectoryProfile } from '../../../../features/directory/directory.types';

/* --- Helper Component for Section Headings --- */
const SectionHeading = ({ title, icon: Icon }: { title: string; icon: React.ComponentType<any> }) => (
    <div className="flex items-center gap-2 mb-8 border-b-4 border-orange-500 pb-2">
        <Icon className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
    </div>
);

/* --- Gallery Carousel --- */
const GalleryCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (isHovered || images.length <= 1) return;
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, [isHovered, nextSlide, images.length]);

    if (images.length === 0) return null;

    return (
        <div
            className="w-full max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-gray-700 p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
                    <img
                        src={images[currentIndex]}
                        alt={`Gallery slide ${currentIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                        onError={(e) => (e.currentTarget.src = "")}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 group"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-black/90 w-6" : "bg-black/50 hover:bg-black/80"}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function ClinicProfilePreview({ clinicData }: { clinicData: DirectoryProfile }) {

    if (!clinicData) return null;

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Extract Image URLs string array for the Carousel
    const galleryImageUrls = clinicData.practice_galleries?.map(g => g.image_url).filter(Boolean) || [];

    // Check if any facility name mentions emergency
    const hasEmergency = clinicData.practice_facilities?.some(f => f.facility_name.toLowerCase().includes('emergency')) || false;

    // UI placeholder for Rating since it's not currently tracked in DB
    const displayRating = 5.0;

    return (
        <div className="bg-white pb-20 font-sans">

            {/* --- HERO BANNER --- */}
            <div className="relative h-56 sm:h-64 md:h-60 w-full overflow-visible">
                {clinicData.banner_image ? (
                    <img
                        src={clinicData.banner_image}
                        alt="Clinic Banner"
                        className="w-full h-full object-cover object-center bg-gray-100"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Banner Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex justify-start">
                        <div className="bg-black/60 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-2xl">
                            <div className="flex flex-col items-start gap-3">
                                <div className="w-full flex flex-col items-start text-left">
                                    {/* Logo & Name */}
                                    <h1 className="flex flex-row items-center justify-start gap-3 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 mb-2">
                                        <img
                                            src={clinicData.logo || ""}
                                            alt={clinicData.practice_name || clinicData.practice_name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-100 flex-shrink-0 bg-white"
                                            onError={(e) => (e.currentTarget.src = "")}
                                        />
                                        <span className="break-words line-clamp-2">
                                            {(clinicData.practice_name ||  "PRACTICE NAME").toUpperCase()}
                                        </span>
                                    </h1>

                                    {/* Address */}
                                    <div className="text-gray-300 text-sm sm:text-base mb-2">
                                        <p className="font-medium line-clamp-1 sm:line-clamp-none text-left">
                                            {clinicData.address || "No Address Provided"}
                                        </p>
                                    </div>

                                    {/* Emergency & Rating */}
                                    <div className="flex items-center justify-start mb-2 gap-2">
                                        {hasEmergency ? (
                                            <>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                                                <span className="text-green-400 font-semibold text-xs sm:text-sm">Emergency available</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                                                <span className="text-red-400 font-semibold text-xs sm:text-sm">No emergency service</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-start gap-2">
                                        <span className="text-white font-bold text-sm sm:text-base">{displayRating.toFixed(1)}</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(displayRating) ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-12 sm:gap-16 max-w-5xl mx-auto mt-5 px-4 sm:px-6">

                    {clinicData.description && (
                        <section>
                            <SectionHeading title="Basic Info" icon={Info} />
                            <div
                                className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: clinicData.description }}
                            />
                        </section>
                    )}

                    {/* 3. SERVICES */}
                    {clinicData.practice_services && clinicData.practice_services.length > 0 && (
                        <section>
                            <SectionHeading title="Our Services" icon={Briefcase} />
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {clinicData.practice_services.map((service) => (
                                    <span key={service.id} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 transition cursor-default bg-white shadow-sm text-xs sm:text-sm">
                                        {service.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 4. CERTIFICATES */}
                    {clinicData.practice_certifications && clinicData.practice_certifications.length > 0 && (
                        <section>
                            <SectionHeading title="Certifications" icon={FileText} />
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {clinicData.practice_certifications.map((cert) => (
                                    <div key={cert.id} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer h-full">
                                        <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100 flex items-center justify-center relative">
                                            <img
                                                src={cert.image_url}
                                                alt={cert.title}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-300">
                                                <FileText size={32} />
                                            </div>
                                        </div>
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-snug transition-colors">
                                            {cert.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 5. TEAM */}
                    {clinicData.practice_team_members && clinicData.practice_team_members.length > 0 && (
                        <section>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-4 border-orange-500 pb-2 gap-2">
                                <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-500" /> Our Team
                                </h3>
                                <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">
                                    {clinicData.practice_team_members.length} Practitioners
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {clinicData.practice_team_members.map((member) => (
                                    <div key={member.id} className="group flex flex-col items-center p-6 aspect-[3/3] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-default">
                                        <div className="relative w-28 h-28 mb-5 flex-shrink-0">
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-50 shadow-inner transition-colors duration-300 bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={member.image || ""}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover object-center"
                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-300">
                                                    <Users size={40} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center w-full">
                                            <h4 className="text-lg font-bold text-gray-900 mb-1 truncate w-full px-2" title={member.name}>
                                                {member.name}
                                            </h4>
                                            <div className="h-0.5 w-8 bg-orange-500 mx-auto my-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide truncate w-full px-2">
                                                {member.role || "Practitioner"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 6. GALLERY */}
                    <section>
                        <SectionHeading title="Clinic Gallery" icon={ImageIcon} />
                        {galleryImageUrls.length > 0 ? (
                            <GalleryCarousel images={galleryImageUrls} />
                        ) : (
                            <div className="text-gray-400 italic text-sm p-8 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                No images in gallery
                            </div>
                        )}
                    </section>

                    {/* 7. ACHIEVEMENTS */}
                    {clinicData.practice_achievements && clinicData.practice_achievements.length > 0 && (
                        <section>
                            <SectionHeading title="Achievements" icon={Trophy} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {clinicData.practice_achievements.map((award) => (
                                    <div key={award.id} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer h-full">
                                        <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100 flex items-center justify-center relative">
                                            {award.image_url ? (
                                                <img
                                                    src={award.image_url}
                                                    alt={award.title}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            ) : (
                                                <Trophy className="w-10 h-10 text-orange-200" />
                                            )}
                                        </div>
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-snug transition-colors">
                                            {award.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 8. REVIEWS (Placeholder for UI consistency) */}
                    <section>
                        <SectionHeading title="Patient Reviews" icon={MessageSquareQuote} />
                        <div className="flex flex-col items-center justify-center py-16 border border-gray-100 rounded-xl bg-gray-50/20 text-center">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                                <MessageSquareQuote className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm">No reviews available yet.</p>
                            <p className="text-gray-400 text-xs mt-1">Patient feedback will appear here.</p>
                        </div>
                    </section>

                    {/* 9. INSURANCES */}
                    {clinicData.practice_insurances && clinicData.practice_insurances.length > 0 && (
                        <section>
                            <SectionHeading title="Insurances" icon={ShieldCheck} />
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                {clinicData.practice_insurances.map((ins) => (
                                    <li key={ins.id} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {ins.provider_name}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* 10. FACILITIES */}
                    {clinicData.practice_facilities && clinicData.practice_facilities.length > 0 && (
                        <section>
                            <SectionHeading title="Facilities" icon={Building} />
                            <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                {clinicData.practice_facilities.map((fac) => (
                                    <span key={fac.id} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 text-gray-700 font-medium bg-gray-50 shadow-sm text-xs sm:text-sm">
                                        {fac.facility_name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 11. CONTACT US */}
                    <section>
                        <SectionHeading title="Contact Us" icon={Phone} />
                        <div className="space-y-8">

                            <div className="space-y-4">
                                <h4 className="text-orange-600 font-bold flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Address
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                        {clinicData.address || "No Address Provided"}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{clinicData.practice_phone || "No Phone Provided"}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium truncate">{clinicData.email || "No Email Provided"}</span>
                                    </div>
                                </div>
                                {clinicData.website && (
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 overflow-hidden">
                                        <Globe className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <a href={clinicData.website.startsWith('http') ? clinicData.website : `https://${clinicData.website}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium hover:underline truncate">
                                            {clinicData.website}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Opening Hours */}
                            <div>
                                <h4 className="text-orange-600 font-bold flex items-center gap-2 mb-4">
                                    <Clock className="w-4 h-4" /> Opening Hours
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {weekDays.map((day) => {
                                        // Match day safely with DB snake_case day_of_week
                                        const found = clinicData.practice_opening_hours?.find(
                                            loc => loc.day_of_week?.toLowerCase() === day.toLowerCase()
                                        );

                                        let timeString = "Closed";
                                        if (found && found.is_open) {
                                            // Handle JSONB time slots if they exist, otherwise show Open
                                            if (Array.isArray(found.time_slots) && found.time_slots.length > 0) {
                                                timeString = found.time_slots.map((s: any) => `${s.start} - ${s.end}`).join(', ');
                                            } else {
                                                timeString = "Open";
                                            }
                                        }

                                        return (
                                            <div key={day} className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                <span className="text-gray-600 font-medium">{day}</span>
                                                <span className={timeString !== "Closed" ? "text-gray-700" : "text-red-500 font-semibold"}>
                                                    {timeString}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Follow Us */}
                            <div>
                                <h4 className="text-orange-600 font-bold flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4" /> Follow Us
                                </h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <a href={clinicData.facebook_url || "#"} target="_blank" rel="noreferrer" className="h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 transition">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href={clinicData.instagram_url || "#"} target="_blank" rel="noreferrer" className="h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 hover:bg-pink-100 transition">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href={clinicData.twitter_url || "#"} target="_blank" rel="noreferrer" className="h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 hover:bg-sky-100 transition">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href={clinicData.youtube_url || "#"} target="_blank" rel="noreferrer" className="h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 transition">
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