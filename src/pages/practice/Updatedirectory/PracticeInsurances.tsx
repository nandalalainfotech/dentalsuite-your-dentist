import { useState } from 'react';
import { ShieldCheck, Plus, X } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeInsurances({ clinicData }: { clinicData: Clinic }) {
    const [insurances, setInsurances] = useState<string[]>(
        (clinicData.insurances || clinicData.insurance || [])
    );
    const [isAddingInsurance, setIsAddingInsurance] = useState(false);
    const [newInsurance, setNewInsurance] = useState('');

    const handleAddInsurance = () => {
        if (newInsurance.trim()) {
            setInsurances([...insurances, newInsurance.trim()]);
            setNewInsurance('');
            setIsAddingInsurance(false);
        }
    };

    const handleDeleteInsurance = (index: number) => {
        setInsurances(insurances.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader 
                title="Insurances" 
                desc="Accepted providers." 
                actionLabel="Add Insurance"
                onActionClick={() => setIsAddingInsurance(true)}
            />

            {isAddingInsurance && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Insurance Provider</h3>
                    <div className="flex gap-4 mb-4">
                        <InputGroup
                            label="Insurance Provider Name"
                            value={newInsurance}
                            onChange={(e) => setNewInsurance(e.target.value)}
                            placeholder="e.g., Blue Cross Blue Shield"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddInsurance}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Insurance
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingInsurance(false);
                                setNewInsurance('');
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                {insurances.map((insurance, index) => (
                    <div key={index} className="group relative flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 transition">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-medium">{insurance}</span>
                        <button
                            onClick={() => handleDeleteInsurance(index)}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {insurances.length === 0 && (
                    <div className="w-full text-center py-8 text-gray-500">
                        <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No insurance providers added yet.</p>
                        <p className="text-xs mt-1">Click "Add Insurance" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}