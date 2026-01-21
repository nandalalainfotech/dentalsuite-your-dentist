import React from 'react';
import { Briefcase, MoreVertical } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeServices({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader title="Medical Services" desc="List the treatments and procedures provided." actionLabel="Add Service" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(clinicData.services || []).map((service: string, i: number) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center hover:bg-white hover:shadow-sm transition">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{service}</h4>
                                <div className="flex gap-3 text-xs text-gray-500 mt-1"><span>Active</span></div>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}