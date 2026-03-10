import { useState } from 'react';
import { Building, Plus, X, Wifi, Car, Accessibility, Thermometer, Tv, Stethoscope, Check, } from 'lucide-react';
import type { PracticeInfo } from '../../../types/clinic';

// Added onNext to props
export default function PracticeFacilities({ clinicData, onNext }: { clinicData: PracticeInfo, onNext: () => void }) {
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
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Building className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Facilities & Amenities</h2>
                    <p className="text-gray-500 text-sm mt-1">What amenities do you offer patients to make their visit comfortable?</p>
                </div>
            </div>

            {/* COMMON AMENITIES GRID */}
            <div className="mb-10">
                <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-wider">Common Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {commonAmenities.map((item) => {
                        const isSelected = facilities.includes(item.name);
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => toggleFacility(item.name)}
                                className={`
                                    relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 gap-3 group
                                    ${isSelected
                                        ? 'bg-orange-50/40 border-orange-500 shadow-sm'
                                        : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className={`p-3 rounded-full transition-colors ${isSelected ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-50'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-semibold text-center leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {item.name}
                                </span>
                                
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-orange-500 text-white p-0.5 rounded-full shadow-sm animate-in zoom-in">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CUSTOM INPUT */}
            <div className="mb-10 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <label className="text-sm font-bold text-gray-900 block mb-3">Add Other Facilities</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomFacility()}
                        placeholder="e.g. Pharmacy on-site, Children's Play Area"
                        className="flex-1 rounded-xl border border-gray-200 shadow-sm px-5 py-3 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm transition-all"
                    />
                    <button
                        onClick={addCustomFacility}
                        disabled={!customFacility.trim()}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-lg shadow-gray-900/10"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {/* SELECTED LIST SUMMARY */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                 <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Active Facilities <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{facilities.length}</span>
                    </h3>
                </div>

                <div className="p-6">
                    {facilities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <Building className="w-8 h-8 text-gray-300 mb-2 opacity-50" />
                            <p className="text-gray-500 text-sm italic">No facilities selected yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {facilities.map((fac) => (
                                <div
                                    key={fac}
                                    className="group flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span>{fac}</span>
                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                    <button
                                        onClick={() => removeFacility(fac)}
                                        className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <X className="w-3.5 h-3.5" />
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
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}