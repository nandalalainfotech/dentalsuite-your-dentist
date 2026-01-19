// import { practiceApi } from "../../data/practiceApi";
// import type { PracticeWithDashboard } from "../../types/auth";

// export default function PracticeDirectoryView() {
//     const practices = practiceApi.getAllPractices();

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
//             {/* Header & Filter */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">My Directory</h2>
//                 <div className="flex gap-2">
//                     <button className="border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition bg-white flex items-center gap-2">
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                         </svg>
//                         Filter
//                     </button>
//                     <button className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm">
//                         Add Patient
//                     </button>
//                 </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative">
//                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                     type="text"
//                     placeholder="Search patients by name or email"
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 text-sm outline-none transition-all"
//                 />
//             </div>

//             {/* Practices Directory */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {practices.map((practice: PracticeWithDashboard) => (
//                     <div key={practice.id} className="border border-gray-100 rounded-2xl bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer">
//                         <div className="flex items-center gap-4 mb-4">
//                             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden">
//                                 {practice.profileImage ? (
//                                     <img src={practice.profileImage} alt={practice.practiceName} className="w-full h-full object-cover" />
//                                 ) : (
//                                     <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                     </svg>
//                                 )}
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold text-gray-900">{practice.practiceName}</h3>
//                                 <p className="text-sm text-gray-500">{practice.firstName} {practice.lastName}</p>
//                             </div>
//                         </div>

//                         <div className="space-y-2 text-sm">
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                 </svg>
//                                 {practice.email}
//                             </div>
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                 </svg>
//                                 {practice.mobileNumber}
//                             </div>
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                                 {practice.practiceCity}, {practice.practiceState}
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${practice.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                                 }`}>
//                                 {practice.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                             <div className="flex items-center gap-1">
//                                 <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                 </svg>
//                                 <span className="text-sm font-medium text-gray-700">{practice.rating}</span>
//                                 <span className="text-xs text-gray-500">({practice.totalReviews})</span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


import { useState } from 'react';
import {
    User, Stethoscope, Award, Trophy, FileText,
    Users, Image as ImageIcon, Calendar, HelpCircle,
    MessageSquare, Info, Save
} from 'lucide-react';

export default function DirectoryView() {
    const [activeSection, setActiveSection] = useState('basic-info');

    // --- CONFIGURATION MENU ---
    const menuItems = [
        { id: 'basic-info', label: 'Basic Info', icon: User },
        { id: 'services', label: 'Services', icon: Stethoscope },
        { id: 'certifications', label: 'My Certifications', icon: Award },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'team', label: 'Our Team', icon: Users },
        { id: 'gallery', label: 'My Gallery', icon: ImageIcon },
        { id: 'appt-settings', label: 'Appointments', icon: Calendar },
        { id: 'faqs', label: "FAQ's", icon: HelpCircle },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'other', label: 'Other Info', icon: Info },
    ];

    // --- CONTENT RENDERER ---
    const renderContent = () => {
        switch (activeSection) {
            case 'basic-info':
                return <BasicInfoForm />;
            case 'services':
                return <PlaceholderSection title="Services" desc="Manage the medical services and treatments you provide." />;
            case 'team':
                return <PlaceholderSection title="Our Team" desc="Add or remove doctors and staff members." />;
            default:
                return <PlaceholderSection title={menuItems.find(m => m.id === activeSection)?.label || 'Section'} desc="This section is under development." />;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 gap-4">

            {/* --- TOP HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Practice Profile</h2>
                    <p className="text-sm text-gray-500">Manage how your practice appears to patients.</p>
                </div>
                <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            {/* --- HORIZONTAL NAVIGATION (SCROLLABLE) --- */}
            <div className="flex-shrink-0 border-b border-gray-200">
                <div className="flex items-center gap-1 overflow-x-auto pb-0 custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-all ${isActive
                                    ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>

            {/* Hide scrollbar styles */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
        </div>
    );
}

// --- SUB-COMPONENTS ---

// 1. Placeholder
const PlaceholderSection = ({ title, desc }: { title: string, desc: string }) => (
    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl p-10 bg-gray-50/50">
        <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-gray-900 font-medium text-lg">{title}</h3>
        <p className="max-w-sm mx-auto mt-2 text-sm">{desc}</p>
    </div>
);

// 2. Basic Info Form
const BasicInfoForm = () => (
    <div className="max-w-4xl space-y-8">

        {/* Practice Identity */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-4 h-4" /> Practice Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Practice Name</label>
                    <input type="text" defaultValue="Dental Clinic" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Specialization</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition">
                        <option>Dentistry</option>
                        <option>Cardiology</option>
                        <option>Dermatology</option>
                    </select>
                </div>
                <div className="col-span-full space-y-2">
                    <label className="text-sm font-medium text-gray-700">About the Practice</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition resize-none" placeholder="Describe your clinic..."></textarea>
                    <p className="text-xs text-gray-400 text-right">0/500 characters</p>
                </div>
            </div>
        </section>

        {/* Contact Info */}
        <section className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                <Info className="w-4 h-4" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" defaultValue="contact@clinic.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
                <div className="col-span-full space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website URL</label>
                    <input type="url" placeholder="https://" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
                </div>
            </div>
        </section>
    </div>
);