/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, X, Search, Check, Save, Loader2 } from 'lucide-react';
import toast from "react-hot-toast";

// 1. Redux Imports
import { useAppDispatch } from '../../../../store/hooks';
import { updateDirectoryInsurances } from '../../../../features/directory/directory.slice';
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

// Common US Insurance providers for "Quick Add" suggestions
const POPULAR_INSURANCES = [
    "Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", 
    "Medicare", "Medicaid", "Humana", "Kaiser Permanente", 
    "Anthem", "Tricare", "Guardian", "MetLife"
];

export default function PracticeInsurances({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();
    
    // State to hold selected insurances
    const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Load initial data from Hasura
    useEffect(() => {
        if (clinicData?.practice_insurances) {
            // Map the DB objects to just an array of strings
            const dbInsurances = clinicData.practice_insurances.map((i: any) => i.provider_name);
            setSelectedInsurances(dbInsurances);
        }
    }, [clinicData]);

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

    const handleSaveAndNext = async () => {
        setIsSaving(true);
        try {
            await dispatch(updateDirectoryInsurances({
                practiceId: clinicData.id,
                insurances: selectedInsurances
            })).unwrap();

            toast.success("Insurances saved successfully!");
            onNext();
        } catch (error: any) {
            console.error("Failed to save insurances:", error);
            toast.error(error.message || "Failed to save insurances. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Insurances Accepted</h2>
                    <p className="text-gray-500 text-sm mt-1">List the insurance providers your practice accepts to help patients find you.</p>
                </div>
            </div>

            {/* INPUT SECTION */}
            <div className="mb-10">
                <label className="text-sm font-bold text-gray-900 block mb-2">Add Insurance Provider</label>
                <div className="relative flex items-center group">
                    <div className="absolute left-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type provider name (e.g. Delta Dental)..."
                        className="w-full pl-12 pr-24 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                    />
                    <div className="absolute right-2">
                        <button
                            onClick={handleAddManual}
                            disabled={!inputValue.trim()}
                            className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* QUICK ADD / POPULAR LIST */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Popular Providers</h3>
                <div className="flex flex-wrap gap-2.5">
                    {POPULAR_INSURANCES.map((ins) => {
                        const isSelected = selectedInsurances.includes(ins);
                        return (
                            <button
                                key={ins}
                                onClick={() => toggleInsurance(ins)}
                                className={`
                                    group flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200 shadow-sm' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {isSelected ? (
                                    <Check className="w-3.5 h-3.5 text-orange-500" strokeWidth={3} />
                                ) : (
                                    <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                                )}
                                {ins}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SELECTED LIST CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Active Providers <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{selectedInsurances.length}</span>
                    </h3>
                    {selectedInsurances.length > 0 && (
                        <button 
                            onClick={() => setSelectedInsurances([])}
                            className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="p-6 min-h-[120px]">
                    {selectedInsurances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <ShieldCheck className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm">No insurances added yet.</p>
                            <p className="text-gray-400 text-xs mt-1">Select from popular list or add manually above.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {selectedInsurances.map((ins, index) => (
                                <div 
                                    key={index} 
                                    className="group flex items-center gap-3 pl-4 pr-2 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 animate-in zoom-in-95"
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-gray-700 font-medium text-sm">{ins}</span>
                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                    <button
                                        onClick={() => removeInsurance(ins)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleSaveAndNext}
                    disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save & Next</>
                    )}
                </button>
            </div>
        </div>
    );
}