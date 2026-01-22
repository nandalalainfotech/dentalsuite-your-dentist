import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

export default function PracticeFacilities({ clinicData }: { clinicData: Clinic }) {
    const [facilities, setFacilities] = useState<string[]>(
        (clinicData.facilities || [])
    );
    const [isAddingFacility, setIsAddingFacility] = useState(false);
    const [newFacility, setNewFacility] = useState('');

    const handleAddFacility = () => {
        if (newFacility.trim()) {
            setFacilities([...facilities, newFacility.trim()]);
            setNewFacility('');
            setIsAddingFacility(false);
        }
    };

    const handleDeleteFacility = (index: number) => {
        setFacilities(facilities.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                title="Facilities"
                desc="Amenities available."
                actionLabel="Add Facility"
                onActionClick={() => setIsAddingFacility(true)}
            />

            {isAddingFacility && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Facility</h3>
                    <div className="flex gap-4 mb-4">
                        <InputGroup
                            label="Facility Name"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            placeholder="e.g., Free Parking, Wheelchair Access"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddFacility}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Facility
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingFacility(false);
                                setNewFacility('');
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {facilities.map((facility, index) => (
                    <div key={index} className="group relative flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-orange-200 transition">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">{facility}</span>
                        <button
                            onClick={() => handleDeleteFacility(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {facilities.length === 0 && (
                    <div className="col-span-full w-full text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No facilities added yet.</p>
                        <p className="text-xs mt-1">Click "Add Facility" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}