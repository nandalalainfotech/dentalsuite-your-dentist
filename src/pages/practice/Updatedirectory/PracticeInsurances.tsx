import { useState } from 'react';
import { ShieldCheck, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import type { Clinic } from '../../../types';

// Common US Insurance providers for "Quick Add" suggestions
const POPULAR_INSURANCES = [
    "Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", 
    "Medicare", "Medicaid", "Humana", "Kaiser Permanente", 
    "Anthem", "Tricare", "Guardian", "MetLife"
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PracticeInsurances({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    // State to hold selected insurances
    const [selectedInsurances, setSelectedInsurances] = useState<string[]>([
        // You can pre-fill based on clinicData if available, or leave empty
        "Medicare" 
    ]);

    const [inputValue, setInputValue] = useState('');

    // Add insurance from Input
    const handleAddManual = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !selectedInsurances.includes(trimmed)) {
            setSelectedInsurances(prev => [...prev, trimmed]);
            setInputValue('');
        }
    };

    // Handle "Enter" key in input
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddManual();
        }
    };

    // Toggle (Add/Remove) from the Popular list
    const toggleInsurance = (name: string) => {
        if (selectedInsurances.includes(name)) {
            setSelectedInsurances(prev => prev.filter(item => item !== name));
        } else {
            setSelectedInsurances(prev => [...prev, name]);
        }
    };

    // Remove specific item
    const removeInsurance = (name: string) => {
        setSelectedInsurances(prev => prev.filter(item => item !== name));
    };

    const handleSaveAndNext = () => {
        console.log('Saving Insurances:', selectedInsurances);
        // Here you would typically update your backend/context
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Insurance Accepted</h2>
                    <p className="text-sm text-gray-500">List the insurance providers your practice accepts.</p>
                </div>
            </div>

            {/* INPUT SECTION */}
            <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 block mb-2">Add Insurance Provider</label>
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type provider name (e.g. Delta Dental)..."
                        className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition"
                    />
                    <button
                        onClick={handleAddManual}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* QUICK ADD / POPULAR LIST */}
            <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Providers</h3>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_INSURANCES.map((ins) => {
                        const isSelected = selectedInsurances.includes(ins);
                        return (
                            <button
                                key={ins}
                                onClick={() => toggleInsurance(ins)}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                                    }
                                `}
                            >
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {ins}
                                {isSelected ? null : <Plus className="w-3.5 h-3.5 opacity-50" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SELECTED LIST CONTAINER */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[160px]">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-sm font-bold text-gray-700">
                        Selected Providers ({selectedInsurances.length})
                    </h3>
                    {selectedInsurances.length > 0 && (
                        <button 
                            onClick={() => setSelectedInsurances([])}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {selectedInsurances.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <ShieldCheck className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">No insurances added yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {selectedInsurances.map((ins, index) => (
                            <div 
                                key={index} 
                                className="group flex items-center gap-2 pl-4 pr-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm animate-in zoom-in-95 duration-200"
                            >
                                <span className="text-gray-800 font-medium">{ins}</span>
                                <button
                                    onClick={() => removeInsurance(ins)}
                                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleSaveAndNext}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}