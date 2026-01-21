import React from 'react';
import { CheckCircle } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeFacilities({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Facilities" desc="Amenities available." />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(clinicData.facilities || []).map((fac: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">{fac}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}