import React from 'react';
import { Trophy } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeAchievements({ clinicData }: { clinicData: Clinic }) {
    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Achievements" desc="Awards and certifications." actionLabel="Add Achievement" />
            <div className="space-y-3">
                {(clinicData.achievements || []).map((award: { title: string; org?: string }, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{award.title}</h4>
                            <p className="text-sm text-gray-500">{award.org}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}