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



import React from 'react';
import { MapPin, Phone, Clock, Globe, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeContact({ clinicData }: { clinicData: Clinic }) {
    return (
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
                    <SocialInput Icon={Facebook} color="text-blue-600" placeholder="Facebook URL" />
                    <SocialInput Icon={Instagram} color="text-pink-600" placeholder="Instagram URL" />
                    <SocialInput Icon={Twitter} color="text-sky-500" placeholder="Twitter URL" />
                    <SocialInput Icon={Youtube} color="text-red-600" placeholder="Youtube URL" />
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialInput = ({ Icon, color, placeholder }: { Icon: any, color: string, placeholder: string }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <input type="url" placeholder={placeholder} className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition" />
    </div>
);