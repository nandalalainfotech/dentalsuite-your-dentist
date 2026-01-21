import React from 'react';
import { Plus } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';

export default function PracticeGallery() {
    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader title="Gallery" desc="Photos of clinic facilities." actionLabel="Upload" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl border border-gray-200"></div>
                ))}
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-orange-400 transition cursor-pointer">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Add Photo</span>
                </div>
            </div>
        </div>
    );
}