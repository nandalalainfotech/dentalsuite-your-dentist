/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Briefcase, Loader2, CheckCircle2, ChevronDown, Check, X } from 'lucide-react';
import toast from "react-hot-toast";

// Redux & Services
import { useAppDispatch } from '../../../../store/hooks';
import { updateDirectoryServices } from '../../../../features/directory/directory.slice';
import type { DirectoryProfile, AllService } from '../../../../features/directory/directory.types';
import directoryService from '../../../../features/directory/directory.service';

interface SelectedService {
    name: string;
    all_service_id: string | null;
}

interface MasterServicesDropdownProps {
    selectedServices: SelectedService[];
    onChange: (services: SelectedService[]) => void;
    masterServices: AllService[];
}

function MasterServicesDropdown({ selectedServices, onChange, masterServices }: MasterServicesDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = masterServices.filter(service =>
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exactMatch = masterServices.find(s => s.service_name.toLowerCase() === searchTerm.toLowerCase());

    const toggleOption = (service: SelectedService) => {
        let updated: SelectedService[];
        if (selectedServices.some(s => s.name === service.name)) {
            updated = selectedServices.filter(item => item.name !== service.name);
        } else {
            updated = [...selectedServices, service];
        }
        onChange(updated);
        setSearchTerm('');
        inputRef.current?.focus();
    };

    return (
        <div className="font-sans relative w-full md:w-2/3 lg:w-1/2 mb-8" ref={containerRef}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Search & Add Services</label>
            <div className={`w-full px-4 py-3 border rounded-xl bg-white flex items-center justify-between cursor-text transition-all 
                ${isOpen ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 0);
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                    placeholder="Type to search or add custom service..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                />
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {searchTerm.trim() !== '' && !exactMatch && (
                        <div
                            className="px-4 py-2.5 text-sm cursor-pointer font-medium text-orange-600 hover:bg-orange-50 border-b border-gray-100"
                            onClick={() => toggleOption({ name: searchTerm.trim(), all_service_id: null })}
                        >
                            + Add custom service "{searchTerm.trim()}"
                        </div>
                    )}

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((service) => {
                            const isSelected = selectedServices.some(s => s.name === service.service_name);
                            return (
                                <div key={service.id} className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => toggleOption({ name: service.service_name, all_service_id: service.id })}>
                                    <span>{service.service_name}</span>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </div>
                            );
                        })
                    ) : (
                        !searchTerm &&
                        <div className="px-4 py-3 text-sm text-gray-400 italic">No matching services found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function PracticeServices({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();

    const [masterServices, setMasterServices] = useState<AllService[]>([]);
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Master Services from DB
    useEffect(() => {
        const fetchMasterServices = async () => {
            try {
                const data = await directoryService.getAllServices();
                setMasterServices(data);
            } catch (err) {
                console.error("Failed to load master services", err);
            }
        };
        fetchMasterServices();
    }, []);

    // Load active practice services from clinicData
    useEffect(() => {
        if (!clinicData?.practice_services) return;
        const active = clinicData.practice_services.map(s => ({
            name: s.name,
            all_service_id: s.all_service_id
        }));
        setSelectedServices(active);
    }, [clinicData]);

    const handleRemoveService = (nameToRemove: string) => {
        setSelectedServices(prev => prev.filter(s => s.name !== nameToRemove));
    };

    const handleSaveAndNext = async () => {
        setIsSaving(true);
        try {
            // Pass exactly the structure the Upsert query needs
            const dbServices = selectedServices.map(s => ({
                name: s.name,
                all_service_id: s.all_service_id,
                show_in_appointment: true
            }));

            await dispatch(updateDirectoryServices({
                practiceId: clinicData.id,
                services: dbServices
            })).unwrap();

            toast.success("Services updated successfully!");
            onNext();
        } catch (error: any) {
            console.error("Failed to sync services:", error);
            toast.error(error.message || "Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* Header Section */}
            <div className="flex items-start gap-4 mb-6 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Briefcase className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Practice Services</h2>
                    <p className="text-gray-500 text-sm mt-1">Select the master services or add custom services your clinic offers.</p>
                </div>
            </div>

            {/* Master & Custom Service Dropdown Selector */}
            <MasterServicesDropdown
                selectedServices={selectedServices}
                onChange={setSelectedServices}
                masterServices={masterServices}
            />

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                        Active Services <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{selectedServices.length}</span>
                    </h3>
                </div>

                {selectedServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <Briefcase className="w-6 h-6 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-medium">No services activated</h4>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs">Use the dropdown above to add services.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedServices.map((service) => (
                            <div
                                key={service.name}
                                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between transition-colors hover:border-orange-200 hover:bg-orange-50/30 group"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className="font-semibold text-gray-800 text-sm">{service.name}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveService(service.name)}
                                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remove Service"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button type="button" onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition">Skip
                </button>
                <button onClick={handleSaveAndNext} disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition disabled:opacity-50 flex items-center gap-2">
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save & Next'}
                </button>
            </div>
        </div>
    );
}