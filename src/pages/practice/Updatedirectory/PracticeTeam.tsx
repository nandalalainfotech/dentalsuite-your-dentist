// src/components/directory/editor/PracticeTeam.tsx
import React from 'react';
import { Users, Trash2 } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeTeam({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-6xl mx-auto">
            <SectionHeader title="Our Team" desc="Doctors, nurses, and staff members." actionLabel="Add Member" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(clinicData.team || []).map((doc: { name: string; role: string; qual?: string }, i: number) => (
                    <div key={i} className="relative flex flex-col items-center p-6 border border-gray-200 rounded-2xl bg-white text-center hover:border-orange-200 transition group">
                        <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="font-bold text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.role}</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                            <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}