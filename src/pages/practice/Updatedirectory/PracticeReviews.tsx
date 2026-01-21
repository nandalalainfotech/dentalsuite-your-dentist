import React from 'react';
import { Star } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';

export default function PracticeReviews() {
    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader title="Reviews" desc="Patient feedback." />
            <div className="space-y-4">
                <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">Alice J.</span>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">"Great experience! The staff was very professional."</p>
                </div>
            </div>
        </div>
    );
}