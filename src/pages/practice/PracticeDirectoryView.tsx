import React, { useState } from 'react';
import { ArrowLeft, Edit3, Save } from 'lucide-react';
import type { Clinic } from '../../types';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import { clinics } from '../../data/clinics';
import ClinicEditor from './Updatedirectory/ClinicEditor';
import ClinicProfilePreview from './Updatedirectory/ClinicProfilePreview';

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
    time: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' }
};

const DEFAULT_PRACTICE_DATA = {
    tagline: 'Comprehensive dental care',
    description: 'Professional dental services provided by experienced practitioners.',
    services: {
        general: ['General Dentistry', 'Preventive Care', 'Oral Hygiene'],
        specialist: ['Specialist Dental Care']
    },
    defaultTeamRole: {
        role: 'Practice Director',
        qualification: 'BDS'
    },
    commonInsurance: ['Private Health Insurance'],
    commonFacilities: ['Modern Equipment', 'Sterilization Room']
};


const formatPracticeType = (type: string): string => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function DirectoryView() {
    const { practice: authPractice, isAuthenticated } = usePracticeAuth();
    const [isEditing, setIsEditing] = useState(false);

    const getClinicData = () => {
        if (authPractice && isAuthenticated && 'practiceName' in authPractice) {
            const practiceServices = authPractice.practiceType === 'general_dentistry'
                ? DEFAULT_PRACTICE_DATA.services.general
                : DEFAULT_PRACTICE_DATA.services.specialist;

            return {
                ...clinicFallback,
                id: authPractice.id,
                name: authPractice.practiceName,
                tagline: DEFAULT_PRACTICE_DATA.tagline,
                description: DEFAULT_PRACTICE_DATA.description,
                address: `${authPractice.practiceAddress}, ${authPractice.practiceCity} ${authPractice.practiceState} ${authPractice.practicePostcode}`,
                phone: authPractice.practicePhone,
                email: authPractice.email,
                services: practiceServices,
                team: [{
                    name: `${authPractice.firstName} ${authPractice.lastName}`,
                    role: DEFAULT_PRACTICE_DATA.defaultTeamRole.role,
                    qual: DEFAULT_PRACTICE_DATA.defaultTeamRole.qualification
                }],
                insurance: DEFAULT_PRACTICE_DATA.commonInsurance,
                facilities: DEFAULT_PRACTICE_DATA.commonFacilities,
                specialities: [formatPracticeType(authPractice.practiceType)],
            };
        }

        return (clinics[0] || clinicFallback) as Clinic & typeof clinicFallback;
    };

    const clinicData = getClinicData();

    return (
        <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-screen">
            {/* Top Bar Actions */}
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
                            onClick={() => setIsEditing(false)}
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

            {/* Main Content Switcher */}
            <div className="w-full max-w-full relative">
                {isEditing ? (
                    <ClinicEditor clinicData={clinicData} />
                ) : (
                    <ClinicProfilePreview clinicData={clinicData} />
                )}
            </div>
        </div>
    );
}