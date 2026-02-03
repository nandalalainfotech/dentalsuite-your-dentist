import { useState } from 'react';
import { Building, Plus, X, Wifi, Car, Accessibility, Thermometer, Tv, Stethoscope, Check } from 'lucide-react';
import type { Clinic } from '../../../types';

// Added onNext to props
export default function PracticeFacilities({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialFacilities = (clinicData as any).facilities || [];
    const [facilities, setFacilities] = useState<string[]>(initialFacilities);
    const [customFacility, setCustomFacility] = useState('');

    const commonAmenities = [
        { name: 'Free Wi-Fi', icon: Wifi },
        { name: 'Parking Available', icon: Car },
        { name: 'Wheelchair Access', icon: Accessibility },
        { name: 'Air Conditioned', icon: Thermometer },
        { name: 'TV in Waiting Area', icon: Tv },
        { name: 'Emergency Service', icon: Stethoscope },
    ];

    const toggleFacility = (name: string) => {
        if (facilities.includes(name)) {
            setFacilities(facilities.filter(f => f !== name));
        } else {
            setFacilities([...facilities, name]);
        }
    };

    const addCustomFacility = () => {
        if (customFacility.trim() && !facilities.includes(customFacility.trim())) {
            setFacilities([...facilities, customFacility.trim()]);
            setCustomFacility('');
        }
    };

    const removeFacility = (name: string) => {
        setFacilities(facilities.filter(f => f !== name));
    };

    const handleSaveAndNext = () => {
        console.log('Saving Facilities:', facilities);
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Building className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Clinic Facilities</h2>
                    <p className="text-sm text-gray-500">What amenities do you offer patients?</p>
                </div>
            </div>

            {/* COMMON AMENITIES GRID */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Common Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {commonAmenities.map((item) => {
                        const isSelected = facilities.includes(item.name);
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => toggleFacility(item.name)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition duration-200 gap-2
                                    ${isSelected
                                        ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-full ${isSelected ? 'bg-orange-200' : 'bg-gray-100'}`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-700' : 'text-gray-500'}`} />
                                </div>
                                <span className="text-sm font-medium text-center leading-tight">{item.name}</span>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <Check className="w-4 h-4 text-orange-500" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CUSTOM INPUT */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-2">Other Facilities</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomFacility()}
                        placeholder="e.g. Pharmacy on-site"
                        className="flex-1 rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                        onClick={addCustomFacility}
                        disabled={!customFacility.trim()}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {/* SELECTED LIST SUMMARY */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-4">Selected Facilities ({facilities.length})</h3>

                {facilities.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">No facilities selected.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {facilities.map((fac) => (
                            <div
                                key={fac}
                                className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm"
                            >
                                <span>{fac}</span>
                                <button
                                    onClick={() => removeFacility(fac)}
                                    className="p-1 rounded-full hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
                                >
                                    <X className="w-3 h-3" />
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