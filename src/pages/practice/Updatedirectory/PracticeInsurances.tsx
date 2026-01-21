import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeInsurances({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Insurances" desc="Accepted providers." />
            <div className="flex flex-wrap gap-3">
                {(clinicData.insurances || []).map((ins: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 cursor-pointer transition">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-medium">{ins}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}