/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Info, Briefcase, Users, Image as ImageIcon,
    Trophy, MessageSquareQuote, ShieldCheck, Building,
    Phone, Save, Plus, Trash2, Star, Upload, MapPin,
    Clock, CheckCircle, MoreVertical, Edit3,
    ArrowLeft, Mail, Globe,
    Facebook, Instagram, Twitter, Youtube, Image
} from 'lucide-react';
import type { Clinic } from '../../types/clinic';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';

export default function DirectoryView() {
    const { practice: authPractice, isAuthenticated } = usePracticeAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Use authenticated practice data or fallback to clinics[0]
    const getClinicData = () => {
        if (authPractice && isAuthenticated && 'practiceName' in authPractice) {
            // Transform practice data to match clinic structure
            return {
                ...clinicFallback,
                id: authPractice.id,
                name: authPractice.practiceName,
                tagline: 'Comprehensive dental care',
                description: 'Professional dental services provided by experienced practitioners.',
                address: `${authPractice.practiceAddress}, ${authPractice.practiceCity} ${authPractice.practiceState} ${authPractice.practicePostcode}`,
                phone: authPractice.practicePhone,
                email: authPractice.email,
                services: authPractice.practiceType === 'general_dentistry'
                    ? ['General Dentistry', 'Preventive Care', 'Oral Hygiene']
                    : ['Specialist Dental Care'],
                team: [{
                    name: `${authPractice.firstName} ${authPractice.lastName}`,
                    role: 'Practice Director',
                    qual: 'BDS'
                }],
                insurance: ['Private Health Insurance'],
                facilities: ['Modern Equipment', 'Sterilization Room'],
                specialities: [authPractice.practiceType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())],
            };
        }
        return (clinics[0] || clinicFallback) as Clinic & typeof clinicFallback;
    };

    const clinicData = getClinicData();

    return (
        <div className="flex flex-col w-full animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-screen">

            {/* --- TOP BAR ACTIONS --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {isEditing ? "Update Directory" : "My Directory"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isEditing
                            ? "Edit your clinic details and public profile settings."
                            : "This is how your clinic appears to patients on the website."}
                    </p>
                </div>

                {isEditing ? (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Cancel
                        </button>
                        <button
                            onClick={() => setIsEditing(false)} // Simulating save
                            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200 transition transform active:scale-95"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 flex items-center gap-2 transition transform active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" /> Update Directory
                    </button>
                )}
            </div>

            {/* --- MAIN CONTENT SWITCHER --- */}
            <div className="w-full relative">
                {isEditing ? (
                    <ClinicEditor clinicData={clinicData} />
                ) : (
                    <ClinicProfilePreview clinicData={clinicData} />
                )}
            </div>
        </div>
    );
}

/* SHARED DATA */
import { clinics } from '../../data/clinics';

const clinicFallback = {
    id: '0',
    name: 'Unnamed Clinic',
    tagline: '',
    description: '',
    services: [] as string[],
    team: [] as { name: string; role: string; qual?: string }[],
    address: '',
    phone: '',
    email: '',
    website: '',
    achievements: [] as { title: string; org?: string }[],
    insurances: [] as string[],
    facilities: [] as string[],
    specialities: [] as string[],
    time: {
        monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
    }
};

/* ==================================================================================
   VIEW 1: CLINIC PROFILE PREVIEW (What the patient sees)
   ================================================================================== */
const ClinicProfilePreview = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => {
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
                        <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-3xl">BS</div>
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
                            {(clinicData.insurances || clinicData.insurance || []).map((ins, i) => (
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

// Helper for Section Headings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionHeading = ({ title, icon: Icon }: { title: string; icon: React.ComponentType<any> }) => (
    <div className="flex items-center gap-2 mb-8 border-b-4 border-orange-500 pb-2">
        <Icon className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
    </div>
);


/* ==================================================================================
   VIEW 2: CLINIC EDITOR (The Form View)
   ================================================================================== */
const ClinicEditor = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => {
    const [activeSection, setActiveSection] = useState('basic-info');

    const menuItems = [
        { id: "basic-info", label: "Basic Info", icon: Info },
        { id: "services", label: "Services", icon: Briefcase },
        { id: "team", label: "Team", icon: Users },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "reviews", label: "Reviews", icon: MessageSquareQuote },
        { id: "insurances", label: "Insurances", icon: ShieldCheck },
        { id: "facilities", label: "Facilities", icon: Building },
        { id: "contact", label: "Contact Us", icon: Phone }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'basic-info': return <BasicInfoForm clinicData={clinicData} />;
            case 'services': return <ServicesList clinicData={clinicData} />;
            case 'team': return <TeamGrid clinicData={clinicData} />;
            case 'gallery': return <GalleryGrid />;
            case 'achievements': return <AchievementsList clinicData={clinicData} />;
            case 'reviews': return <ReviewsList />;
            case 'insurances': return <InsurancesGrid clinicData={clinicData} />;
            case 'facilities': return <FacilitiesList clinicData={clinicData} />;
            case 'contact': return <ContactSettings clinicData={clinicData} />;
            default: return <BasicInfoForm clinicData={clinicData} />;
        }
    };

    return (
        <div className="flex flex-col bg-gray-50/50 pb-10 min-h-screen">
            {/* Editor Tabs - Sticky below the main header */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 pt-2 shadow-sm z-20 sticky top-[81px]">
                <div className="flex items-center gap-4 overflow-x-auto pb-0 scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-all duration-200 relative
                                    ${isActive
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-900"
                                    }`}>
                                <Icon className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-gray-400"}`} />
                                {item.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_6px_rgba(249,115,22,0.4)]"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="p-6 lg:p-8">
                {/* Form Content */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

/* --- REUSABLE COMPONENTS FOR EDITOR --- */
const SectionHeader = ({ title, desc, actionLabel }: { title: string, desc: string, actionLabel?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
        {actionLabel && (
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95">
                <Plus className="w-4 h-4" /> {actionLabel}
            </button>
        )}
    </div>
);

interface InputGroupProps {
    label: string;
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    full?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, type = "text", defaultValue, placeholder, full = false }) => (
    <div className={`space-y-2 ${full ? 'col-span-full' : ''}`}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
        />
    </div>
);

/* --- EDITOR SECTIONS (Forms) - POPULATED WITH PREVIEW DATA --- */
const BasicInfoForm = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-4xl mx-auto">
        <SectionHeader title="Basic Information" desc="Manage your clinic's identity and primary details." />
        <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition group relative">
                    <Upload className="w-6 h-6 mb-2 group-hover:text-orange-500" />
                    <span className="text-xs font-medium">Upload Logo</span>
                </div>
            </div>

            {/* Added Banner Image Upload */}
            <div className="flex-shrink-0">
                <div className="w-full md:w-64 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition group relative">
                    <Image className="w-6 h-6 mb-2 group-hover:text-orange-500" />
                    <span className="text-xs font-medium">Upload Banner Image</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Practice Name" defaultValue={clinicData.name} />
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Specialization</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"><option>Dentistry</option></select>
            </div>
            <InputGroup label="Tagline" defaultValue={clinicData.tagline} />
            <InputGroup label="Establishment Date" type="date" defaultValue="2015-05-20" />
        </div>

        <div className="space-y-2 mt-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">About the Practice</label>
            <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition" defaultValue={clinicData.description} />
        </div>
    </div>
);

const ServicesList = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader title="Medical Services" desc="List the treatments and procedures provided." actionLabel="Add Service" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(clinicData.services || []).map((service: any, i: any) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center hover:bg-white hover:shadow-sm transition">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Briefcase className="w-5 h-5" /></div>
                            <div><h4 className="font-semibold text-gray-900">{service}</h4><div className="flex gap-3 text-xs text-gray-500 mt-1"><span>Active</span></div></div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamGrid = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-6xl mx-auto">
        <SectionHeader title="Our Team" desc="Doctors, nurses, and staff members." actionLabel="Add Member" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(clinicData.team || []).map((doc: any, i: any) => (
                <div key={i} className="relative flex flex-col items-center p-6 border border-gray-200 rounded-2xl bg-white text-center hover:border-orange-200 transition group">
                    <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"><Users className="w-8 h-8 text-gray-300" /></div>
                    <h3 className="font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.role}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                        <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const GalleryGrid = () => (
    <div className="max-w-5xl mx-auto">
        <SectionHeader title="Gallery" desc="Photos of clinic facilities." actionLabel="Upload" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl border border-gray-200"></div>)}
            <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-orange-400 transition cursor-pointer">
                <Plus className="w-6 h-6 mb-1" /> <span className="text-xs font-medium">Add Photo</span>
            </div>
        </div>
    </div>
);

const AchievementsList = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-4xl mx-auto">
        <SectionHeader title="Achievements" desc="Awards and certifications." actionLabel="Add Achievement" />
        <div className="space-y-3">
            {(clinicData.achievements || []).map((award: any, i: any) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><Trophy className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-gray-900">{award.title}</h4><p className="text-sm text-gray-500">{award.org}</p></div>
                </div>
            ))}
        </div>
    </div>
);

const ReviewsList = () => (
    <div className="max-w-4xl mx-auto">
        <SectionHeader title="Reviews" desc="Patient feedback." />
        <div className="space-y-4">
            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2"><span className="font-bold text-gray-900">Alice J.</span><div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div></div>
                <p className="text-sm text-gray-600">"Great experience!"</p>
            </div>
        </div>
    </div>
);

const InsurancesGrid = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-4xl mx-auto">
        <SectionHeader title="Insurances" desc="Accepted providers." />
        <div className="flex flex-wrap gap-3">
            {(clinicData.insurances || clinicData.insurance || []).map((ins: any, i: any) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 cursor-pointer transition"><ShieldCheck className="w-4 h-4" /><span className="text-sm font-medium">{ins}</span></div>
            ))}
        </div>
    </div>
);

const FacilitiesList = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-4xl mx-auto">
        <SectionHeader title="Facilities" desc="Amenities available." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(clinicData.facilities || []).map((fac: any, i: any) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-gray-700">{fac}</span></div>
            ))}
        </div>
    </div>
);

const ContactSettings = ({ clinicData }: { clinicData: Clinic & typeof clinicFallback }) => (
    <div className="max-w-5xl mx-auto">
        <SectionHeader title="Contact Info" desc="Edit contact details and opening hours." />

        {/* Part 1: Basic Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Location
                </h3>
                <InputGroup label="Street Address" defaultValue={clinicData.address} full />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="City" defaultValue="Sydney" />
                    <InputGroup label="Postal Code" defaultValue="2000" />
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Phone className="w-4 h-4 text-orange-500" /> Contact Channels
                </h3>
                <InputGroup label="Phone Number" defaultValue={clinicData.phone} full />
                <InputGroup label="Email Address" defaultValue={clinicData.email} full />
                <InputGroup label="Website URL" defaultValue={clinicData.website} full />
            </div>
        </div>

        {/* Part 2: Opening Hours Editor */}
        <div className="border-t border-gray-100 pt-8 mb-10">
            <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-orange-500" /> Opening Hours
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mon-Fri */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                    <div className="font-bold text-gray-700 text-sm">Mon - Fri</div>
                    <div className="flex items-center gap-2">
                        <input type="time" defaultValue="09:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                        <span className="text-gray-400">-</span>
                        <input type="time" defaultValue="18:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                    </div>
                </div>

                {/* Saturday */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                    <div className="font-bold text-gray-700 text-sm">Saturday</div>
                    <div className="flex items-center gap-2">
                        <input type="time" defaultValue="09:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                        <span className="text-gray-400">-</span>
                        <input type="time" defaultValue="14:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                    </div>
                </div>

                {/* Sunday */}
                <div className="p-4 rounded-xl border border-gray-200 bg-red-50/30 space-y-3">
                    <div className="font-bold text-gray-700 text-sm flex justify-between">
                        Sunday
                        <span className="text-xs text-red-500 font-bold bg-white px-2 py-0.5 rounded border border-red-100">Closed</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50 pointer-events-none">
                        <input type="time" disabled className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-100" />
                        <span className="text-gray-400">-</span>
                        <input type="time" disabled className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-100" />
                    </div>
                </div>
            </div>
        </div>

        {/* Part 3: Social Media Links */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 mb-6">
                <Globe className="w-4 h-4 text-orange-500" /> Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Facebook className="w-4 h-4 text-blue-600" />
                    </div>
                    <input type="url" placeholder="Facebook URL" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Instagram className="w-4 h-4 text-pink-600" />
                    </div>
                    <input type="url" placeholder="Instagram URL" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Twitter className="w-4 h-4 text-sky-500" />
                    </div>
                    <input type="url" placeholder="Twitter URL" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Youtube className="w-4 h-4 text-red-600" />
                    </div>
                    <input type="url" placeholder="Youtube URL" className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
            </div>
        </div>
    </div>
);