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
import type { PracticeInfo } from '../../../types/clinic';

/* --- Helper Component for Section Headings --- */
const SectionHeading = ({ title, icon: Icon }: { title: string; icon: React.ComponentType<any> }) => (
    <div className="flex items-center gap-2 mb-8 border-b-4 border-orange-500 pb-2">
        <Icon className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
    </div>
);

/* --- Gallery Carousel (Moved Outside) --- */
const GalleryCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Function to go to next slide
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    // Function to go to previous slide
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Auto-scroll effect
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
            {/* The Dark Frame Container */}
            <div className="bg-gray-700 p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">

                    {/* The Image */}
                    <img
                        src={images[currentIndex]}
                        alt={`Gallery slide ${currentIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                        onError={(e) => (e.currentTarget.src = "")}
                    />

                    {/* Navigation Arrows (Only show if > 1 image) */}
                    {images.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 group"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-black/90 w-6" : "bg-black/50 hover:bg-black/80"
                                            }`}
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

export default function ClinicProfilePreview({ clinicData }: { clinicData: PracticeInfo }) {

    // --- 1. DATA NORMALIZATION --- 
    const data = {
        company_name: clinicData.company_name || "",
        profession_type: clinicData.profession_type || "",
        name: clinicData.name || clinicData.business_name || "",
        banner: clinicData.banner || clinicData.banner_image || "",
        logo: clinicData.logo || clinicData.practiceLogo || "",
        address: clinicData.address || "No Address Provided",
        zipcode: clinicData.zipcode || "",
        description: clinicData.description || "No description available.",
        phone: clinicData.phone || clinicData.practicePhone || "Not Listed",
        email: clinicData.email || "Not Listed",
        website: clinicData.website || "#",
        rating: clinicData.rating || 4.0,
        emergency: clinicData.emergency ?? false,

        services:
            Array.isArray(clinicData.services) && clinicData.services.length > 0
                ? clinicData.services
                : Array.isArray(clinicData.directory_services)
                    ? clinicData.directory_services.map((s: any, index: number) => ({
                        id: s.id || (index + 1).toString(),
                        name: s.name || "",
                        description: s.description || "",
                    }))
                    : [],

        certificates: (() => {
            const raw = (clinicData as any).directory_certifications || (clinicData as any).certificates;
            if (Array.isArray(raw) && raw.length > 0) {
                return raw.map((c: any) => {
                    let url = "";
                    if (c.attachments?.url) url = c.attachments.url;
                    else if (typeof c.attachments === 'string') url = c.attachments;
                    else if (c.img) url = c.img;

                    return {
                        title: c.title || c.name || "",
                        url: url || ""
                    };
                });
            }
            return [];
        })(),

        team: clinicData.dentists || [],
        achievements:
            Array.isArray(clinicData.directory_achievements) && clinicData.directory_achievements.length > 0
                ? clinicData.directory_achievements
                : Array.isArray(clinicData.directory_achievements)
                    ? clinicData.directory_achievements
                    : [],

        // Gallery
        gallery:
            Array.isArray(clinicData.gallery) && clinicData.gallery.length > 0
                ? clinicData.gallery.flat().map((g: any) => typeof g === "string" ? g : g.url || "")
                : Array.isArray(clinicData.directory_gallery_posts)
                    ? clinicData.directory_gallery_posts.map((g: any) => {
                        if (Array.isArray(g.image) && g.image[0]?.url) return g.image[0].url;
                        return g.url || g.image || "";
                    })
                    : [],

        testimonials: (() => {
            const raw = clinicData.testimonials || clinicData.directory_testimonials;
            if (Array.isArray(raw)) return raw;
            try {
                return typeof raw === 'string' ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        })(),

        insurances: clinicData.insurances || [],
        facilities: clinicData.facilities || [],
        openingHours: clinicData.openingHours || []
    };

    const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    return (
        <div className="bg-white pb-20 font-sans">

            {/* --- HERO BANNER --- */}
            <div className="relative h-56 sm:h-64 md:h-60 w-full overflow-visible">
                <img
                    src={data.banner.url || data.banner}
                    alt="Clinic Banner"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => (e.currentTarget.src = "")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Banner Overlay Content */}
                <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto flex justify-start">
                        {/* Clinic Info Box */}
                        <div className="bg-black/60 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-2xl">
                            <div className="flex flex-col items-start gap-3">
                                <div className="w-full flex flex-col items-start text-left">
                                    {/* Logo & Name */}
                                    <h1 className="flex flex-row items-center justify-start gap-3 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 mb-2">
                                        <img
                                            src={data.logo.url || data.logo}
                                            alt={data.company_name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-100 flex-shrink-0"
                                            onError={(e) => (e.currentTarget.src = "")}
                                        />
                                        <span className="break-words line-clamp-2">
                                            {data.company_name?.toUpperCase() || "PRACTICE NAME"}
                                        </span>
                                    </h1>

                                    {/* Address */}
                                    <div className="text-gray-300 text-sm sm:text-base mb-2">
                                        <p className="font-medium line-clamp-1 sm:line-clamp-none text-left">
                                            {data.address}
                                        </p>
                                    </div>

                                    {/* Emergency & Rating (Kept existing logic) */}
                                    <div className="flex items-center justify-start mb-2 gap-2">
                                        {data.emergency ? (
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
                                        <span className="text-white font-bold text-sm sm:text-base">{Number(data.rating).toFixed(1)}</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(data.rating) ? "text-yellow-500" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
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
                <div className="grid grid-cols-1 gap-12 sm:gap-16 max-w-5xl mx-auto mt-5 px-4 sm:px-6">

                    {/* 2. BASIC INFO */}
                    {data.description && (
                        <section>
                            <SectionHeading title="Basic Info" icon={Info} />
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                                {data.description}
                            </p>
                        </section>
                    )}

                    {/* 3. SERVICES */}
                    {data.services.length > 0 && (
                        <section>
                            <SectionHeading title="Our Services" icon={Briefcase} />
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {data.services.map((service: any, index: number) => (
                                    <span key={index} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 transition cursor-default bg-white shadow-sm text-xs sm:text-sm">
                                        {service.name || service}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 4 MY CERTIFICATES */}
                    {data.certificates && data.certificates.length > 0 && (
                        <section>
                            <SectionHeading title="Certifications" icon={FileText} />
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {data.certificates.map((cert: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer h-full"
                                    >
                                        {/* Image Container */}
                                        <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100 flex items-center justify-center relative">
                                            <img
                                                src={cert.url}
                                                alt={cert.title}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                            {/* Fallback Icon if image fails */}
                                            <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-300">
                                                <FileText size={32} />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-snug transition-colors">
                                            {cert.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 5. TEAM */}
                    {data.team.length > 0 && (
                        <section>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-4 border-orange-500 pb-2 gap-2">
                                <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-500" /> Our Team
                                </h3>
                                <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">
                                    {data.team.length} Dentists
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {data.team.map((dentist: any, i: number) => (
                                    <div
                                        key={i}
                                        className="group flex flex-col items-center p-6 aspect-[3/3] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lgtransition-all duration-300 cursor-default"
                                    >
                                        {/* Profile Image Wrapper */}
                                        <div className="relative w-28 h-28 mb-5 flex-shrink-0">
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-50 shadow-inner transition-colors duration-300 bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={ dentist.image?.url || ""
                                                    }
                                                    alt={dentist.name}
                                                    className="w-full h-full object-cover object-center"
                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                />
                                                {/* Fallback Icon (Hidden if image loads) */}
                                                <div className="absolute inset-0 flex items-center justify-center -z-10 text-gray-300">
                                                    <Users size={40} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="text-center w-full">
                                            <h4 className="text-lg font-bold text-gray-900 mb-1 truncate w-full px-2" title={dentist.name}>
                                                {dentist.name}
                                            </h4>
                                            <div className="h-0.5 w-8 bg-orange-500 mx-auto my-3 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide truncate w-full px-2" title={dentist.role || dentist.qualification}>
                                                {dentist.specialization}
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

                        {data.gallery.length > 0 ? (
                            // Render the Carousel Component we created above
                            <GalleryCarousel images={data.gallery} />
                        ) : (
                            <div className="text-gray-400 italic text-sm p-8 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                No images in gallery
                            </div>
                        )}
                    </section>

                    {/* 7. ACHIEVEMENTS */}
                    {data.achievements.length > 0 && (
                        <section>
                            <SectionHeading title="Achievements" icon={Trophy} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {data.achievements.map((award: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer h-full"
                                    >
                                        {/* Image Container - Aspect Video for landscape awards */}
                                        <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3 border border-gray-100 flex items-center justify-center relative">
                                            {award.image ? (
                                                // Using 'org' field as image source if 'image' is missing based on your data mapping
                                                <img
                                                    src={award.image}
                                                    alt={award.title}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            ) : (
                                                // Fallback Icon
                                                <Trophy className="w-10 h-10 text-orange-200" />
                                            )}
                                        </div>

                                        {/* Content Container */}

                                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-snug transition-colors">
                                            {award.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 8. REVIEWS */}
                    {data.testimonials.length > 0 && (
                        <section>
                            <SectionHeading title="Patient Reviews" icon={MessageSquareQuote} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.testimonials.map((review: any, i: number) => (
                                    <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 ml-2">{review.name || "Anonymous"}</span>
                                        </div>
                                        <p className="text-gray-600 italic">"{review.message || review.content}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 9. INSURANCES */}
                    {data.insurances.length > 0 && (
                        <section>
                            <SectionHeading title="Insurances" icon={ShieldCheck} />
                            <ul className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                {data.insurances.map((ins: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {ins}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* 10. FACILITIES */}
                    {data.facilities.length > 0 && (
                        <section>
                            <SectionHeading title="Facilities" icon={Building} />
                            <div className="flex flex-wrap gap-3 bg-white p-4">
                                {data.facilities.map((fac: string, i: number) => (
                                    <span key={i} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-orange-500 hover:text-orange-600 transition cursor-default bg-white shadow-sm text-xs sm:text-sm">
                                        {fac}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 11 A. CONTACT US */}
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
                                        {data.address}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{data.phone}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium truncate">{data.email}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 overflow-hidden">
                                    <Globe className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                    <a href={data.website} className="text-blue-600 text-sm font-medium hover:underline truncate">
                                        {data.website}
                                    </a>
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
                                    {weekDays.map((day) => {
                                        const found = data.openingHours.find(
                                            (loc: any) => loc.week_name === day
                                        );

                                        return (
                                            <div
                                                key={day}
                                                className="flex justify-between items-center border-b border-gray-50 pb-2"
                                            >
                                                <span className="text-gray-600 font-medium">{day}</span>

                                                <span className={found ? "text-gray-500" : "text-red-500 font-semibold"}>
                                                    {found ? found.clinic_time : "Closed"}
                                                </span>
                                            </div>
                                        );
                                    })}
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