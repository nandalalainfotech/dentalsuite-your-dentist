import { useState } from 'react';
import {
    User, Stethoscope, Award, Trophy, FileText,
    Users, Image as ImageIcon, Calendar, HelpCircle,
    MessageSquare, Info, Save
} from 'lucide-react';

export default function DirectoryView() {
    const [activeSection, setActiveSection] = useState('basic-info');

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
            <div className="flex-shrink-0 border-b border-gray-200">
                <div
                    className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin"
                    style={{ scrollbarWidth: "thin" } as React.CSSProperties}
                >
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-all
                                    ${isActive ? "border-orange-500 text-orange-600 bg-orange-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                                    }`}>
                                <Icon
                                    className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-gray-400"
                                        }`}
                                />
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
    <div className="space-y-8">

        {/* Header with Save Button */}
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
                Practice Settings
            </h2>

            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium
                       hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
            </button>
        </div>

        {/* Practice Identity */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-4 h-4" /> Practice Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Practice Name</label>
                    <input
                        type="text"
                        defaultValue="Dental Clinic"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Specialization</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition"
                    >
                        <option>Dentistry</option>
                        <option>Cardiology</option>
                        <option>Dermatology</option>
                    </select>
                </div>

                <div className="col-span-full space-y-2">
                    <label className="text-sm font-medium text-gray-700">About the Practice</label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition resize-none"
                        placeholder="Describe your clinic..."
                    />
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
                    <input
                        type="email"
                        defaultValue="contact@clinic.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        defaultValue="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition"
                    />
                </div>

                <div className="col-span-full space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website URL</label>
                    <input
                        type="url"
                        placeholder="https://"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50
                     focus:bg-white focus:ring-2 focus:ring-orange-500/20
                     focus:border-orange-500 outline-none transition"
                    />
                </div>
            </div>
        </section>
    </div>

);