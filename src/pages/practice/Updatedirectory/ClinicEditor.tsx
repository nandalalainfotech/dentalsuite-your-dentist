import { useState } from 'react';
import { Info, Briefcase, Users, Image as ImageIcon, Trophy, MessageSquareQuote, ShieldCheck, Building, Phone, FileText } from 'lucide-react';
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
import type { Clinic } from '../../../types';

export default function ClinicEditor({ clinicData }: { clinicData: Clinic }) {
    const [activeSection, setActiveSection] = useState('basic-info');
    const navigateTo = (sectionId: string) => {
        setActiveSection(sectionId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const menuItems = [
        { id: "basic-info", label: "Basic Info", icon: Info },
        { id: "services", label: "Services", icon: Briefcase },
        { id: "my-certificate", label: "My Certificate", icon: FileText },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "team", label: "Team", icon: Users },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "reviews", label: "Reviews", icon: MessageSquareQuote },
        { id: "insurances", label: "Insurances", icon: ShieldCheck },
        { id: "facilities", label: "Facilities", icon: Building },
        { id: "contact", label: "Contact Us", icon: Phone }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'basic-info':
                return <PracticeBaseInfo clinicData={clinicData} onNext={() => navigateTo('services')} />;

            case 'services':
                return <PracticeServices clinicData={clinicData} onNext={() => navigateTo('my-certificate')} />;

            case 'my-certificate':
                return <PracticeMyCertificate clinicData={clinicData} onNext={() => navigateTo('team')} />;

            case 'achievements':
                return <PracticeAchievements clinicData={clinicData} onNext={() => navigateTo('reviews')} />;

            case 'team':
                return <PracticeTeam clinicData={clinicData} onNext={() => navigateTo('gallery')} />;

            case 'gallery':
                return <PracticeGallery clinicData={clinicData} onNext={() => navigateTo('achievements')} />;

            case 'reviews':
                return <PracticeReviews clinicData={clinicData} onNext={() => navigateTo('insurances')} />;

            case 'insurances':
                return <PracticeInsurances clinicData={clinicData} onNext={() => navigateTo('facilities')} />;

            case 'facilities':
                return <PracticeFacilities clinicData={clinicData} onNext={() => navigateTo('contact')} />;

            case 'contact':
                return <PracticeContact clinicData={clinicData} onNext={() => alert("All steps completed!")} />;

            default:
                return <PracticeBaseInfo clinicData={clinicData} onNext={() => navigateTo('services')} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* Editor Tabs */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 pt-2 shadow-sm z-20 sticky top-[50px]">
                <div className="flex items-center gap-4 overflow-x-auto pb-0 scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(item.id)}
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
            <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
                {renderContent()}
            </div>

        </div>
    );
}