// // src/components/directory/editor/PracticeContact.tsx
// import React from 'react';
// import { MapPin, Phone, Clock, Globe, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
// import { SectionHeader, InputGroup } from './SharedEditorComponents';
// import type { Clinic } from '../../../types/clinic';

// export default function PracticeContact({ clinicData }: { clinicData: Clinic }) {
//     return (
//         <div className="max-w-5xl mx-auto">
//             <SectionHeader title="Contact Info" desc="Edit contact details and opening hours." />

//             {/* Part 1: Basic Contact Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//                 <div className="space-y-6">
//                     <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
//                         <MapPin className="w-4 h-4 text-orange-500" /> Location
//                     </h3>
//                     <InputGroup label="Street Address" defaultValue={clinicData.address} full />
//                     <div className="grid grid-cols-2 gap-4">
//                         <InputGroup label="City" defaultValue="Sydney" />
//                         <InputGroup label="Postal Code" defaultValue="2000" />
//                     </div>
//                 </div>
//                 <div className="space-y-6">
//                     <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
//                         <Phone className="w-4 h-4 text-orange-500" /> Contact Channels
//                     </h3>
//                     <InputGroup label="Phone Number" defaultValue={clinicData.phone} full />
//                     <InputGroup label="Email Address" defaultValue={clinicData.email} full />
//                     <InputGroup label="Website URL" defaultValue={clinicData.website} full />
//                 </div>
//             </div>

//             {/* Part 2: Opening Hours Editor */}
//             <div className="border-t border-gray-100 pt-8 mb-10">
//                 <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 mb-6">
//                     <Clock className="w-4 h-4 text-orange-500" /> Opening Hours
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
//                         <div className="font-bold text-gray-700 text-sm">Mon - Fri</div>
//                         <div className="flex items-center gap-2">
//                             <input type="time" defaultValue="09:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
//                             <span className="text-gray-400">-</span>
//                             <input type="time" defaultValue="18:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none" />
//                         </div>
//                     </div>
//                     {/* Add Sat/Sun blocks here similarly... */}
//                 </div>
//             </div>

//             {/* Part 3: Social Media Links */}
//             <div className="border-t border-gray-100 pt-8">
//                 <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 mb-6">
//                     <Globe className="w-4 h-4 text-orange-500" /> Social Media Links
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <SocialInput Icon={Facebook} color="text-blue-600" placeholder="Facebook URL" />
//                     <SocialInput Icon={Instagram} color="text-pink-600" placeholder="Instagram URL" />
//                     <SocialInput Icon={Twitter} color="text-sky-500" placeholder="Twitter URL" />
//                     <SocialInput Icon={Youtube} color="text-red-600" placeholder="Youtube URL" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const SocialInput = ({ Icon, color, placeholder }: { Icon: any, color: string, placeholder: string }) => (
//     <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Icon className={`w-4 h-4 ${color}`} />
//         </div>
//         <input type="url" placeholder={placeholder} className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
//     </div>
// );



import { useState } from 'react';
import { MapPin, Phone, Clock, Globe, Facebook, Instagram, Twitter, Youtube, Save } from 'lucide-react';
import { InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface ContactFormData {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    website: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
}

export default function PracticeContact({ clinicData }: { clinicData: Clinic }) {
    const [formData, setFormData] = useState<ContactFormData>({
        address: clinicData.address || '',
        city: 'Sydney',
        postalCode: '2000',
        phone: clinicData.phone || '',
        email: clinicData.email || '',
        website: clinicData.website || '',
        monday: clinicData.time?.monday || '09:00-18:00',
        tuesday: clinicData.time?.tuesday || '09:00-18:00',
        wednesday: clinicData.time?.wednesday || '09:00-18:00',
        thursday: clinicData.time?.thursday || '09:00-18:00',
        friday: clinicData.time?.friday || '09:00-18:00',
        saturday: clinicData.time?.saturday || '09:00-14:00',
        sunday: clinicData.time?.sunday || 'Closed',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleTimeChange = (day: keyof ContactFormData, startTime: string, endTime: string) => {
        const timeRange = startTime && endTime ? `${startTime}-${endTime}` : 'Closed';
        handleInputChange(day, timeRange);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHasChanges(false);
        setIsSaving(false);
    };

    const parseTimeRange = (timeRange: string) => {
        if (timeRange === 'Closed') return { start: '', end: '', closed: true };
        const [start, end] = timeRange.split('-');
        return { start: start || '', end: end || '', closed: false };
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Info</h2>
                    <p className="text-sm text-gray-500 mt-1">Edit contact details and opening hours.</p>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* Part 1: Basic Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
                        <MapPin className="w-4 h-4 text-orange-500" /> Location
                    </h3>
                    <InputGroup
                        label="Street Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        full
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup
                            label="City"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                        <InputGroup
                            label="Postal Code"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Phone className="w-4 h-4 text-orange-500" /> Contact Channels
                    </h3>
                    <InputGroup
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        full
                    />
                    <InputGroup
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        full
                    />
                    <InputGroup
                        label="Website URL"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        full
                    />
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
                            <input
                                type="time"
                                value={parseTimeRange(formData.monday).start}
                                onChange={(e) => handleTimeChange('monday', e.target.value, parseTimeRange(formData.monday).end)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="time"
                                value={parseTimeRange(formData.monday).end}
                                onChange={(e) => handleTimeChange('monday', parseTimeRange(formData.monday).start, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Saturday */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="font-bold text-gray-700 text-sm">Saturday</div>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                value={parseTimeRange(formData.saturday).start}
                                onChange={(e) => handleTimeChange('saturday', e.target.value, parseTimeRange(formData.saturday).end)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="time"
                                value={parseTimeRange(formData.saturday).end}
                                onChange={(e) => handleTimeChange('saturday', parseTimeRange(formData.saturday).start, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none"
                            />
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
                    <SocialInput
                        Icon={Facebook}
                        color="text-blue-600"
                        placeholder="Facebook URL"
                        value={formData.facebook}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                    />
                    <SocialInput
                        Icon={Instagram}
                        color="text-pink-600"
                        placeholder="Instagram URL"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                    />
                    <SocialInput
                        Icon={Twitter}
                        color="text-sky-500"
                        placeholder="Twitter URL"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                    />
                    <SocialInput
                        Icon={Youtube}
                        color="text-red-600"
                        placeholder="Youtube URL"
                        value={formData.youtube}
                        onChange={(e) => handleInputChange('youtube', e.target.value)}
                    />
                </div>
            </div>

            {hasChanges && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-6 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialInput = ({ Icon, color, placeholder, value, onChange }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: any,
    color: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <input
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
        />
    </div>
);