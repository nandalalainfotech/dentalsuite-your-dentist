import React from 'react';
import { Upload, Image } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic'; // Adjust path as needed

export default function PracticeBaseInfo({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Basic Information" desc="Manage your clinic's identity and primary details." />
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition group relative">
                        <Upload className="w-6 h-6 mb-2 group-hover:text-orange-500" />
                        <span className="text-xs font-medium">Upload Logo</span>
                    </div>
                </div>

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
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition">
                        <option>Dentistry</option>
                        <option>General Practice</option>
                    </select>
                </div>
                <InputGroup label="Tagline" defaultValue={clinicData.tagline} />
                <InputGroup label="Establishment Date" type="date" defaultValue="2015-05-20" />
            </div>

            <div className="space-y-2 mt-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">About the Practice</label>
                <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                    defaultValue={clinicData.description}
                />
            </div>
        </div>
    );
}