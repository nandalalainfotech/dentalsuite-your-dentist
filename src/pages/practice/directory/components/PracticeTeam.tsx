/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import {
    Users, Edit2, ArrowLeft, Trash2,
    Info, Check, ChevronDown, X, Plus, Calendar, Loader2
} from 'lucide-react';
import toast from "react-hot-toast";

// Redux & Services
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { deleteDirectoryTeamMember, updateDirectoryTeam } from '../../../../features/directory/directory.slice';
import type { DirectoryProfile, PracticeService } from '../../../../features/directory/directory.types';
import { fetchAppointmentData } from '../../../../features/appointment_types/appointment_types.slice';

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

interface AppointmentType {
    id: string;
    name: string;
    patientType: 'New' | 'Existing';
    duration: number;
    enabled: boolean;
    bookingLimit?: number;
    terms?: string;
}

interface TeamMember {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    qualification: string;
    gender: string;
    ahpra: string;
    education: string;
    languages: string;
    professionalStatement: string;
    selectedServiceIds: string[];
    image?: string | any;
    linkedPractitionerId?: string;
    isVisibleOnline: boolean;
    allowMultipleBookings: boolean;
    bookingTimeLimit: number;
    bookingTimeLimitUnit: 'minutes' | 'hours';
    cancelTimeLimit: number;
    cancelTimeLimitUnit: 'minutes' | 'hours';
    appointmentTypes: AppointmentType[];
}

interface PracticeServicesDropdownProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    practiceServices: PracticeService[];
}

export function PracticeServicesDropdown({ selectedIds, onChange, practiceServices }: PracticeServicesDropdownProps) {
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

    const filteredOptions = practiceServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (id: string) => {
        let updated: string[];
        if (selectedIds.includes(id)) {
            updated = selectedIds.filter(item => item !== id);
        } else {
            updated = [...selectedIds, id];
        }
        onChange(updated);
        setSearchTerm('');
        inputRef.current?.focus();
    };

    return (
        <div className="font-sans relative" ref={containerRef}>
            <div
                className={`w-full px-4 py-3 border rounded-xl bg-white flex items-center justify-between cursor-text transition-all ${isOpen ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 0);
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                    placeholder={selectedIds.length === 0 ? "Select services..." : "Add another..."}
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
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((service) => {
                            const isSelected = selectedIds.includes(service.id);
                            return (
                                <div
                                    key={service.id}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected
                                        ? 'bg-orange-50 text-orange-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => toggleOption(service.id)}
                                >
                                    <span>{service.name}</span>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">
                            No matching services found. Did you activate them in Practice Services?
                        </div>
                    )}
                </div>
            )}

            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedIds.map(id => {
                        const serviceObj = practiceServices.find(s => s.id === id);
                        if (!serviceObj) return null;
                        return (
                            <span
                                key={id}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100"
                            >
                                {serviceObj.name}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleOption(id); }}
                                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const AppointmentTypeEditor = ({ practitionerName, appointmentName, allTypes, onBack, onSave }: any) => {
    const getType = (pt: 'New' | 'Existing') => allTypes.find((t: any) => t.name === appointmentName && t.patientType === pt);
    const existingType = getType('Existing');
    const newType = getType('New');

    const [exEnabled, setExEnabled] = useState(existingType?.enabled || false);
    const [exDuration, setExDuration] = useState(existingType?.duration || 30);
    const [exLimit, setExLimit] = useState(existingType?.bookingLimit || '');
    const [exTerms, setExTerms] = useState(existingType?.terms || '');

    const [newEnabled, setNewEnabled] = useState(newType?.enabled || false);
    const [newDuration, setNewDuration] = useState(newType?.duration || 30);
    const [newLimit, setNewLimit] = useState(newType?.bookingLimit || '');
    const [newTerms, setNewTerms] = useState(newType?.terms || '');

    const handleSave = () => {
        const updatedList = allTypes.map((t: any) => {
            if (t.name === appointmentName) {
                if (t.patientType === 'Existing') {
                    return { ...t, enabled: exEnabled, duration: exDuration, bookingLimit: Number(exLimit), terms: exTerms };
                }
                if (t.patientType === 'New') {
                    return { ...t, enabled: newEnabled, duration: newDuration, bookingLimit: Number(newLimit), terms: newTerms };
                }
            }
            return t;
        });
        onSave(updatedList);
    };

    const ColumnForm = ({ title, enabled, setEnabled, duration, setDuration, limit, setLimit, terms, setTerms, limitLabel }: any) => (
        <div className="h-full bg-gray-50/50 rounded-xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                {title}
            </h3>
            <label className="flex items-center gap-3 cursor-pointer select-none mb-6 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors shadow-sm">
                <input type="checkbox" checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Available online</span>
            </label>
            {enabled && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Appointment Length</label>
                        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none">
                            {[15, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} mins</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Booking Limit (Days in future)</label>
                        <input type="number" value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                            placeholder="e.g. 30"
                        />
                        <p className="text-xs text-gray-500">{limitLabel}</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">Terms & Conditions
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                        </label>
                        <textarea value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none min-h-[100px] resize-none"
                            placeholder="Optional message to patients..."
                        />
                    </div>
                </div>
            )}
        </div>
    );

    // If only one is available, center it, else side-by-side
    const colClass = (existingType && newType) ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl mx-auto';

    return (
        <div className="bg-white font-sans text-gray-800 pt-4">
            <div className="bg-white  px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Edit "{appointmentName}"</h1>
                        <p className="text-xs text-gray-500">Settings for {practitionerName}</p>
                    </div>
                </div>
                <button onClick={handleSave} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-gray-900/10 hover:bg-black transition-all">Save Changes</button>
            </div>
            <div className="max-w-5xl mx-auto p-6 lg:p-10">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-orange-50/50 border-b border-gray-100 flex items-center gap-3">
                        <Info className="w-5 h-5 text-orange-500" />
                        <p className="text-sm text-gray-600 font-medium">Changes here only affect this specific practitioner.</p>
                    </div>
                    <div className={`p-6 lg:p-8 grid grid-cols-1 ${colClass} gap-8`}>
                        {existingType && (
                            <ColumnForm title="Existing Patients" enabled={exEnabled} setEnabled={setExEnabled} duration={exDuration} setDuration={setExDuration} limit={exLimit} setLimit={setExLimit} terms={exTerms} setTerms={setExTerms} limitLabel="Max days existing patients can book ahead." />
                        )}
                        {newType && (
                            <ColumnForm title="New Patients" enabled={newEnabled} setEnabled={setNewEnabled} duration={newDuration} setDuration={setNewDuration} limit={newLimit} setLimit={setNewLimit} terms={newTerms} setTerms={setNewTerms} limitLabel="Max days new patients can book ahead." />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PracticeTeam({ clinicData, onNext }: { clinicData: DirectoryProfile; onNext: () => void }) {
    const dispatch = useAppDispatch();
    const masterApptTypes = useAppSelector((state: any) => state.appointmentTypes?.data || []);

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingApptName, setEditingApptName] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'visible' | 'hidden'>('all');

    useEffect(() => {
        if (clinicData?.id) {
            dispatch(fetchAppointmentData(clinicData.id));
        }
    }, [dispatch, clinicData?.id]);

    // --- FIXED: Only generate New/Existing rows if the Master Type actually has them enabled! ---
    const generateDynamicApptTypes = () => {
        const types: AppointmentType[] = [];
        masterApptTypes.forEach((master: any) => {
            // Only push 'New' if the Master Type allows New Patients
            if (master.newEnabled) {
                types.push({
                    id: master.id,
                    name: master.name,
                    patientType: 'New',
                    duration: master.newDuration || 30,
                    enabled: false
                });
            }
            // Only push 'Existing' if the Master Type allows Existing Patients
            if (master.existingEnabled) {
                types.push({
                    id: master.id,
                    name: master.name,
                    patientType: 'Existing',
                    duration: master.existingDuration || 30,
                    enabled: false
                });
            }
        });
        return types;
    };

    useEffect(() => {
        if (!clinicData?.practice_team_members) return;

        const dynamicBaseAppts = generateDynamicApptTypes();

        const dbTeam = clinicData.practice_team_members.map((t: any) => {
            const savedAppts = t.appointment_types || [];

            let finalAppts = [];
            if (dynamicBaseAppts.length > 0) {
                finalAppts = dynamicBaseAppts.map(base => {
                    // Match securely using the real ID we added in the service earlier
                    const found = savedAppts.find((s: any) => s.id === base.id && s.patientType === base.patientType);
                    return found ? { ...base, ...found } : base;
                });
            } else {
                finalAppts = savedAppts;
            }

            return {
                id: t.id,
                first_name: t.first_name || '',
                last_name: t.last_name || '',
                email: t.email || '',
                role: t.role || '',
                qualification: t.qualification || '',
                gender: t.gender || '',
                ahpra: t.ahpra_number || '',
                education: t.education || '',
                languages: t.languages || '',
                professionalStatement: t.professional_statement || '',

                selectedServiceIds: t.practitioner_practice_services?.map((ps: any) => ps.practice_service_id).filter(Boolean) || [],

                image: t.image || '',
                isVisibleOnline: t.is_visible_online || false,
                allowMultipleBookings: t.allow_multiple_bookings ?? true,
                bookingTimeLimit: t.booking_time_limit || 0,
                bookingTimeLimitUnit: t.booking_time_limit_unit || 'minutes',
                cancelTimeLimit: t.cancel_time_limit || 0,
                cancelTimeLimitUnit: t.cancel_time_limit_unit || 'minutes',
                appointmentTypes: finalAppts
            };
        });

        setTeamMembers(dbTeam);
    }, [clinicData, masterApptTypes]);

    const updateField = (field: keyof TeamMember, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
    };

    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
    };

    const handleMainBack = () => {
        setEditingId(null);
        setFormData(null);
    };

    const handleMainSave = () => {
        if (!formData) return;
        const isNew = formData.id.startsWith('new-');
        const finalId = isNew ? generateUUID() : formData.id;
        const finalData = { ...formData, id: finalId };

        if (isNew) {
            setTeamMembers(prev => [...prev.filter(m => m.id !== formData.id), finalData]);
        } else {
            setTeamMembers(prev => prev.map(m => m.id === finalData.id ? finalData : m));
        }
        setEditingId(null);
        setFormData(null);
    };

    const handleDeleteMember = async (id: string | null) => {
        if (!id) return;

        if (id.startsWith('new-')) {
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            setMemberToDelete(null);
            toast.success("Removed unsaved practitioner.");
            return;
        }
        try {
            await dispatch(deleteDirectoryTeamMember(id)).unwrap();
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            toast.success("Practitioner deleted successfully.");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete practitioner.");
        } finally {
            setMemberToDelete(null);
        }
    };

    const handleApptSave = (updatedTypes: AppointmentType[]) => {
        updateField('appointmentTypes', updatedTypes);
        setEditingApptName(null);
    };

    const calculateScore = (data: TeamMember) => {
        let filled = 0;
        const total = 7;
        if (data.role) filled++;
        if (data.professionalStatement) filled++;
        if (data.appointmentTypes.some(a => a.enabled)) filled++;
        if (data.ahpra) filled++;
        if (data.languages) filled++;
        if (data.selectedServiceIds && data.selectedServiceIds.length > 0) filled++;
        if (data.image) filled++;
        return Math.round((filled / total) * 100);
    };

    const counts = {
        all: teamMembers.length,
        visible: teamMembers.filter(m => m.isVisibleOnline).length,
        hidden: teamMembers.filter(m => !m.isVisibleOnline).length
    };

    const filteredMembers = teamMembers.filter(member => {
        if (activeTab === 'visible') return member.isVisibleOnline;
        if (activeTab === 'hidden') return !member.isVisibleOnline;
        return true;
    });

    const handleSaveAndNext = async () => {
        setIsSaving(true);
        try {
            await dispatch(updateDirectoryTeam({
                practiceId: clinicData.id,
                team: teamMembers
            })).unwrap();

            toast.success("Team updated successfully!");
            onNext();
        } catch (error: any) {
            toast.error(error.message || "Failed to save team.");
        } finally {
            setIsSaving(false);
        }
    };

    if (editingId && formData && editingApptName) {
        return <AppointmentTypeEditor practitionerName={formData.first_name && formData.last_name} appointmentName={editingApptName} allTypes={formData.appointmentTypes} onBack={() => setEditingApptName(null)} onSave={handleApptSave} />;
    }

    if (editingId && formData) {
        const score = calculateScore(formData);
        return (
            <div className="font-sans text-gray-800 pt-4 bg-white">
                <div className="px-6 py-4 bg-white sticky top-0 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleMainBack}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
                            <p className="text-xs text-gray-500">{formData.first_name && formData.last_name || 'New Practitioner'}</p>
                        </div>
                    </div>
                    <button onClick={handleMainSave}
                        className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg shadow-gray-900/10 hover:bg-black transition-all">
                        Save & Close
                    </button>
                </div>

                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-24 h-24 shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="40" stroke={score > 80 ? '#22c55e' : score > 40 ? '#f97316' : '#ef4444'} strokeWidth="8" fill="none" strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">{score}%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Completeness</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">A complete profile builds trust with patients. Add a photo, professional statement, and enable online bookings to reach 100%.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900">Basic Information</h2>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input type="text" value={formData.first_name}
                                            onChange={(e) => updateField('first_name', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <input type="text" value={formData.last_name}
                                            onChange={(e) => updateField('last_name', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Email</label>
                                    <input type="text" value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-medium text-gray-700">Link to Core Practice</label>
                                            <Info className="w-3.5 h-3.5 text-blue-500 cursor-help" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white appearance-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a Practitioner</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Gender</label>
                                        <select value={formData.gender}
                                            onChange={(e) => updateField('gender', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Profession Type</label>
                                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white"
                                            defaultValue="Dental"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Specific Role</label>
                                    <input value={formData.role}
                                        onChange={(e) => updateField('role', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">AHPRA Registration Number</label>
                                    <input type="text" value={formData.ahpra}
                                        onChange={(e) => updateField('ahpra', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. DEN000..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Qualifications</label>
                                    <input type="text" value={formData.qualification}
                                        onChange={(e) => updateField('qualification', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. BDS, MDS"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Education</label>
                                    <input type="text" value={formData.education}
                                        onChange={(e) => updateField('education', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. University of Sydney"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Languages Spoken</label>
                                    <input type="text" value={formData.languages}
                                        onChange={(e) => updateField('languages', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="English, Spanish, Mandarin..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-full bg-white mb-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative group">
                                        {formData.image ?
                                            <img src={formData.image.url || formData.image}
                                                alt="Profile"
                                                className="w-full h-full object-cover" /> :
                                            <Users className="w-12 h-12 text-gray-300" />
                                        }
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => document.getElementById('member-upload')?.click()}>
                                            <Edit2 className="text-white w-6 h-6"
                                            />
                                        </div>
                                    </div>
                                    <input id="member-upload" type="file" className="hidden" accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => updateField('image', ev.target?.result);
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    <button onClick={() => document.getElementById('member-upload')?.click()}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700">Change Photo
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Services Offered</label>

                                    <PracticeServicesDropdown
                                        selectedIds={formData.selectedServiceIds}
                                        onChange={(ids) => updateField('selectedServiceIds', ids)}
                                        practiceServices={clinicData.practice_services || []}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Professional Statement</label>
                                    <textarea rows={6} value={formData.professionalStatement}
                                        onChange={(e) => updateField('professionalStatement', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm resize-y"
                                        placeholder="Tell patients about your experience and philosophy..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Booking Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600"
                                />
                                Online Booking Settings
                            </h2>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-5">
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                    <input type="checkbox" checked={formData.isVisibleOnline}
                                        onChange={e => updateField('isVisibleOnline', e.target.checked)}
                                        className="mt-1 w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Visible for Online Booking</span>
                                        <span className="text-xs text-gray-500">Allow patients to find and book this practitioner online.</span>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                    <input type="checkbox" checked={formData.allowMultipleBookings}
                                        onChange={e => updateField('allowMultipleBookings', e.target.checked)}
                                        className="mt-1 w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Allow Multiple Bookings</span>
                                        <span className="text-xs text-gray-500">Allow patients to book multiple appointments on the same day.</span>
                                    </div>
                                </label>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Booking Lead Time</p>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={formData.bookingTimeLimit}
                                            onChange={e => updateField('bookingTimeLimit', e.target.value)}
                                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                                        />
                                        <select value={formData.bookingTimeLimitUnit}
                                            onChange={e => updateField('bookingTimeLimitUnit', e.target.value as any)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg bg-white">
                                            <option value="minutes">Minutes</option><option value="hours">
                                                Hours
                                            </option>
                                        </select>
                                        <span className="text-sm text-gray-500">before appointment</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Cancellation Lead Time</p>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={formData.cancelTimeLimit}
                                            onChange={e => updateField('cancelTimeLimit', e.target.value)}
                                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                                        />
                                        <select value={formData.cancelTimeLimitUnit}
                                            onChange={e => updateField('cancelTimeLimitUnit', e.target.value as any)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg bg-white">
                                            <option value="minutes">Minutes</option><option value="hours">
                                                Hours
                                            </option>
                                        </select>
                                        <span className="text-sm text-gray-500">before appointment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appt Types Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Appointment Types</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600 w-20 text-center">Active</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Type Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Patient</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Duration</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.appointmentTypes.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-6 text-center text-gray-500">
                                                No appointment types created yet. Create one in Practice Setup first.
                                            </td>
                                        </tr>
                                    )}
                                    {formData.appointmentTypes.map((app, idx) => (
                                        <tr key={idx} className={`hover:bg-gray-50 transition-colors ${app.enabled ? 'bg-white' : 'bg-gray-50/30'}`}>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={app.enabled}
                                                    onChange={e => {
                                                        const updated = [...formData.appointmentTypes];
                                                        updated[idx].enabled = e.target.checked;
                                                        updateField('appointmentTypes', updated);
                                                    }}
                                                    className="w-5 h-5 border-gray-300 rounded text-green-500 focus:ring-green-500 cursor-pointer" />
                                            </td>
                                            <td className={`px-6 py-4 font-medium ${app.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{app.name}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <span className={`px-2 py-1 rounded text-xs ${app.patientType === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {app.patientType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{app.duration} mins</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setEditingApptName(app.name)}
                                                    className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                                    Configure
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. RENDER MAIN LIST
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Practice Team</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your practitioners and their booking availability.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        const newId = `new-${generateUUID()}`;
                        const newMember: TeamMember = {
                            id: newId,
                            first_name: '',
                            last_name: '',
                            email: '',
                            role: '',
                            qualification: '',
                            gender: '',
                            ahpra: '',
                            education: '',
                            languages: '',
                            professionalStatement: '',
                            selectedServiceIds: [],
                            isVisibleOnline: false,
                            allowMultipleBookings: true,
                            bookingTimeLimit: 0,
                            bookingTimeLimitUnit: 'minutes',
                            cancelTimeLimit: 0,
                            cancelTimeLimitUnit: 'minutes',
                            appointmentTypes: generateDynamicApptTypes()
                        }; setTeamMembers(prev => [...prev, newMember]); startEdit(newMember);
                    }}
                    className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black transition shadow-lg shadow-gray-900/20">
                    <Plus className="w-4 h-4"
                    />
                    Add Practitioner
                </button>
            </div>
            <div className="flex gap-2 mb-6 p-1 bg-gray-50/50 rounded-xl w-fit border border-gray-100">
                {(['all', 'visible', 'hidden'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>{tab === 'all' ? 'All Members' : tab === 'visible' ? 'Visible' : 'Not Visible'} <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeTab === tab ? 'bg-orange-50' : 'bg-gray-200'}`}>{counts[tab]}</span></button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                        <div key={member.id} className={`relative bg-white border border-gray-300 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 group 
                        ${member.isVisibleOnline ? 'border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5' : 'border-gray-100 bg-gray-50/30 '}`}>
                            <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${member.isVisibleOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}
                                title={member.isVisibleOnline ? "Visible Online" : "Hidden"}
                            />
                            <div className="w-24 h-24 rounded-full bg-white mb-4 p-1 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {member.image ?
                                        <img src={member.image.url || member.image}
                                            alt={member.first_name}
                                            className="w-full h-full object-cover"
                                        /> :
                                        <Users className="w-8 h-8 text-gray-300" />
                                    }
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate w-full px-2">
                                {member.first_name || member.last_name
                                    ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim()
                                    : 'Unnamed'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 h-5 truncate w-full px-2">{member.role || 'No Role'}</p>
                            <div className="w-full mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                <button
                                    onClick={() => startEdit(member)}
                                    className="flex-1 py-2 text-sm font-medium text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMemberToDelete(member.id); }}
                                    className="flex-1 py-2 text-sm font-medium text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No practitioners found in this category.</p>
                    </div>
                )}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button type="button" onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition">Skip</button>
                <button onClick={handleSaveAndNext} disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition flex items-center gap-2 disabled:opacity-50">
                    {isSaving ?
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save & Next'}
                </button>
            </div>
            {memberToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Delete Practitioner</h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Are you sure you want to delete this practitioner? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setMemberToDelete(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button onClick={() => handleDeleteMember(memberToDelete)}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}