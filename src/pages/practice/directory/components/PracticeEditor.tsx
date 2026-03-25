import { useState, useEffect } from 'react';
import {
    Info, Briefcase, Users, Image as ImageIcon, Trophy,
    MessageSquareQuote, ShieldCheck, Building, Phone, FileText
} from 'lucide-react';

// Child Components
import PracticeBaseInfo from './PracticeBaseInfo';
import PracticeServices from './PracticeServices';
import PracticeTeam from './PracticeTeam';
import PracticeGallery from './PracticeGallery';
import PracticeAchievements from './PracticeAchievements';
import PracticeReviews from './PracticeReviews';
import PracticeInsurances from './PracticeInsurances';
import PracticeFacilities from './PracticeFacilities';
import PracticeContact from './PracticeContact';
import PracticeMyCertificate from './PracticeMyCertificate';

// 1. UPDATED: Import the new Redux Type instead of the old PracticeInfo
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

// 2. UPDATED: Use DirectoryProfile in the props
export default function PracticeEditor({ clinicData }: { clinicData: DirectoryProfile }) {
    
    const [activeSection, setActiveSection] = useState(() => {
        return sessionStorage.getItem('clinic_editor_active_tab') || 'basic-info';
    });

    useEffect(() => {
        sessionStorage.setItem('clinic_editor_active_tab', activeSection);
    }, [activeSection]);

    const navigateTo = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById('editor-tabs-container');
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const menuItems = [
        { id: "basic-info", label: "Basic Info", icon: Info },
        { id: "services", label: "Services", icon: Briefcase },
        { id: "my-certificate", label: "Certifications", icon: FileText },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "team", label: "Team", icon: Users },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "reviews", label: "Reviews", icon: MessageSquareQuote },
        { id: "insurances", label: "Insurances", icon: ShieldCheck },
        { id: "facilities", label: "Facilities", icon: Building },
        { id: "contact", label: "Contact Us", icon: Phone }
    ];

    const renderContent = () => {
        const commonProps = { clinicData };

        switch (activeSection) {
            case 'basic-info': return <PracticeBaseInfo key="basic" {...commonProps} onNext={() => navigateTo('services')} />;
            case 'services': return <PracticeServices key="services" {...commonProps} onNext={() => navigateTo('my-certificate')} />;
            case 'my-certificate': return <PracticeMyCertificate key="cert" {...commonProps} onNext={() => navigateTo('achievements')} />;
            case 'achievements': return <PracticeAchievements key="achieve" {...commonProps} onNext={() => navigateTo('team')} />;
            case 'team': return <PracticeTeam key="team" {...commonProps} onNext={() => navigateTo('gallery')} />;
            case 'gallery': return <PracticeGallery key="gallery" {...commonProps} onNext={() => navigateTo('reviews')} />;
            case 'reviews': return <PracticeReviews key="reviews" {...commonProps} onNext={() => navigateTo('insurances')} />;
            case 'insurances': return <PracticeInsurances key="insure" {...commonProps} onNext={() => navigateTo('facilities')} />;
            case 'facilities': return <PracticeFacilities key="facil" {...commonProps} onNext={() => navigateTo('contact')} />;
            case 'contact': return <PracticeContact key="contact" {...commonProps} onNext={() => navigateTo("directory")} />;
            default: return <PracticeBaseInfo key="default" {...commonProps} onNext={() => navigateTo('services')} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* Custom CSS for the Scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 5px; /* Thin scrollbar */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db; /* Gray-300 */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af; /* Gray-400 */
                }
            `}</style>

            {/* Sticky Header with Gradient Tabs */}
            <div
                id="editor-tabs-container"
                className="sticky top-[60px] z-20 bg-white border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 overflow-x-auto px-6 custom-scrollbar pb-0 pt-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigateTo(item.id)}
                                    className={`
                                        flex items-center gap-2.5 py-4 px-2 text-sm font-medium transition-all duration-300 relative group shrink-0
                                        ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-800"}
                                    `}
                                >
                                    {/* Icon */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isActive 
                                            ? "bg-orange-50 text-orange-600 scale-105" 
                                            : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"}
                                    `}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    
                                    <span>{item.label}</span>

                                    {/* The Active Gradient Line (Only one line now) */}
                                    <span className={`
                                        absolute bottom-0 left-0 w-full h-[5px] rounded-t-full transition-all duration-300
                                        bg-gradient-to-r from-orange-400 via-orange-500 to-red-500
                                        ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"}
                                    `}></span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="p-4 lg:p-4 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 pb-20">
                {renderContent()}
            </div>

        </div>
    );
}