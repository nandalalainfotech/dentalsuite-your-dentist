import React from 'react';
import { Plus } from 'lucide-react';

export const SectionHeader = ({ title, desc, actionLabel, onActionClick }: { 
    title: string, 
    desc: string, 
    actionLabel?: string,
    onActionClick?: () => void 
}) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
        {actionLabel && (
            <button 
                onClick={onActionClick}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95"
            >
                <Plus className="w-4 h-4" /> {actionLabel}
            </button>
        )}
    </div>
);

interface InputGroupProps {
    label: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    full?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
    label, 
    type = "text", 
    defaultValue, 
    value, 
    placeholder, 
    full = false,
    onChange 
}) => (
    <div className={`space-y-2 ${full ? 'col-span-full' : ''}`}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
        />
    </div>
);