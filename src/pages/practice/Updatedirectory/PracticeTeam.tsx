/* eslint-disable react-hooks/static-components */
import { useState, useRef, useEffect } from 'react';
import {
    Users, Edit2, ArrowLeft, Trash2,
    Info, Check, ChevronDown, X, RotateCcw, Plus, Calendar
} from 'lucide-react';
import type { PracticeInfo } from '../../../types/clinic';

// --- TYPES ---
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
    name: string;
    role: string;
    qualification: string;
    gender: string;
    ahpra: string;
    education: string;
    languages: string;
    professionalStatement: string;
    areasOfInterest: string;
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

// --- HELPER: Multi-Select Dropdown ---

interface ProfessionalInterestsDropdownProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export function ProfessionalInterestsDropdown({ value, onChange, placeholder }: ProfessionalInterestsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const options = [
        "Cosmetic Dentistry", "Family Dentistry", "Pediatric Dentistry", "Orthodontics",
        "Endodontics", "Periodontics", "Oral Surgery", "Prosthodontics",
        "Dental Implants", "Invisalign", "Teeth Whitening", "Root Canal Therapy",
        "Wisdom Teeth Removal", "Emergency Dental Care", "Preventive Dentistry",
        "Restorative Dentistry", "Women's health", "Mental health", "Immunisations"
    ];

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

    const selectedValues = value
        ? value.split(',').map(s => s.trim()).filter(s => s !== '')
        : [];

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option: string) => {
        let updated: string[];
        if (selectedValues.includes(option)) {
            updated = selectedValues.filter(item => item !== option);
        } else {
            updated = [...selectedValues, option];
        }
        onChange(updated.join(', '));
        setSearchTerm(''); 
        inputRef.current?.focus(); 
    };

    const removeOption = (option: string) => {
        const updated = selectedValues.filter(item => item !== option);
        onChange(updated.join(', '));
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
                    placeholder={selectedValues.length === 0 ? placeholder : "Add another..."}
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
                        filteredOptions.map((option, index) => {
                            const isSelected = selectedValues.includes(option);
                            return (
                                <div
                                    key={index}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected
                                        ? 'bg-orange-50 text-orange-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => toggleOption(option)}
                                >
                                    <span>{option}</span>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">
                            No matching interests found.
                        </div>
                    )}
                </div>
            )}

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedValues.map((interest, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100"
                        >
                            {interest}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(interest);
                                }}
                                className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- HELPER: Appointment Type Editor ---

const AppointmentTypeEditor = ({
    practitionerName,
    appointmentName,
    allTypes,
    onBack,
    onSave
}: {
    practitionerName: string;
    appointmentName: string;
    allTypes: AppointmentType[];
    onBack: () => void;
    onSave: (updatedTypes: AppointmentType[]) => void;
}) => {
    const getType = (pt: 'New' | 'Existing') => allTypes.find(t => t.name === appointmentName && t.patientType === pt);
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
        const updatedList = allTypes.map(t => {
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

    const ColumnForm = ({
        title, enabled, setEnabled, duration, setDuration, limit, setLimit, terms, setTerms, limitLabel
    }: any) => (
        <div className="h-full bg-gray-50/50 rounded-xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                {title}
            </h3>

            <label className="flex items-center gap-3 cursor-pointer select-none mb-6 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors shadow-sm">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Available online</span>
            </label>

            {enabled && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Appointment Length</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                        >
                            {[15, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} mins</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Booking Limit (Days in future)</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                            placeholder="e.g. 30"
                        />
                        <p className="text-xs text-gray-500">{limitLabel}</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            Terms & Conditions <Info className="w-3.5 h-3.5 text-gray-400" />
                        </label>
                        <textarea
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none min-h-[100px] resize-none"
                            placeholder="Optional message to patients..."
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/30 font-sans text-gray-800 -m-6 sm:-m-8">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Edit "{appointmentName}"</h1>
                        <p className="text-xs text-gray-500">Settings for {practitionerName}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-gray-900/10 hover:bg-black transition-all"
                >
                    Save Changes
                </button>
            </div>

            <div className="max-w-5xl mx-auto p-6 lg:p-10">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-orange-50/50 border-b border-gray-100 flex items-center gap-3">
                        <Info className="w-5 h-5 text-orange-500" />
                        <p className="text-sm text-gray-600 font-medium">Changes here only affect this specific practitioner.</p>
                    </div>

                    <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ColumnForm
                            title="Existing Patients"
                            enabled={exEnabled} setEnabled={setExEnabled}
                            duration={exDuration} setDuration={setExDuration}
                            limit={exLimit} setLimit={setExLimit}
                            terms={exTerms} setTerms={setExTerms}
                            limitLabel="Max days existing patients can book ahead."
                        />
                        <ColumnForm
                            title="New Patients"
                            enabled={newEnabled} setEnabled={setNewEnabled}
                            duration={newDuration} setDuration={setNewDuration}
                            limit={newLimit} setLimit={setNewLimit}
                            terms={newTerms} setTerms={setNewTerms}
                            limitLabel="Max days new patients can book ahead."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function PracticeTeam({ clinicData, onNext }: { clinicData: PracticeInfo; onNext: () => void }) {

    const defaultAppointmentTypes: AppointmentType[] = [
        { id: '1', name: 'Consultation', patientType: 'New', duration: 30, enabled: false },
        { id: '2', name: 'Consultation', patientType: 'Existing', duration: 30, enabled: false },
        { id: '3', name: 'Check Up and Clean', patientType: 'New', duration: 30, enabled: false },
        { id: '4', name: 'Check Up and Clean', patientType: 'Existing', duration: 30, enabled: false },
        { id: '5', name: 'Recall', patientType: 'Existing', duration: 30, enabled: false },
        { id: '6', name: 'Emergency', patientType: 'New', duration: 30, enabled: false },
        { id: '7', name: 'Emergency', patientType: 'Existing', duration: 30, enabled: false },
    ];

    const generateInitialMembers = (): TeamMember[] => {
        const team = clinicData.team || [];
        const dentists = clinicData.dentists || [];
        const teamByName = new Map(team.map(member => [member.name, member]));
        const dentistByName = new Map(dentists.map(dentist => [dentist.name, dentist]));

        const membersFromDentists = dentists.map((dentist, i) => {
            const teamMatch = teamByName.get(dentist.name);
            return {
                id: `dentist-${i}`,
                name: dentist.name,
                role: teamMatch?.role || dentist.specialities?.[0] || '',
                qualification: teamMatch?.qual || dentist.qualification || '',
                gender: dentist.gender || '',
                ahpra: '',
                education: '',
                languages: dentist.languages?.join(', ') || '',
                professionalStatement: dentist.overview || '',
                areasOfInterest: dentist.specialities?.join(', ') || '',
                image: dentist.image || '',
                isVisibleOnline: false,
                allowMultipleBookings: true,
                bookingTimeLimit: 0,
                bookingTimeLimitUnit: 'minutes',
                cancelTimeLimit: 0,
                cancelTimeLimitUnit: 'minutes',
                appointmentTypes: JSON.parse(JSON.stringify(defaultAppointmentTypes))
            };
        });

        const membersFromTeamOnly = team
            .filter(member => !dentistByName.has(member.name))
            .map((member, i) => ({
                id: `team-${i}`,
                name: member.name,
                role: member.role || '',
                qualification: member.qual || '',
                gender: '',
                ahpra: '',
                education: '',
                languages: '',
                professionalStatement: '',
                areasOfInterest: '',
                isVisibleOnline: false,
                allowMultipleBookings: true,
                bookingTimeLimit: 0,
                bookingTimeLimitUnit: 'minutes',
                cancelTimeLimit: 0,
                cancelTimeLimitUnit: 'minutes',
                appointmentTypes: JSON.parse(JSON.stringify(defaultAppointmentTypes))
            }));

        return [...membersFromDentists, ...membersFromTeamOnly] as TeamMember[];
    };

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(generateInitialMembers());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingApptName, setEditingApptName] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'visible' | 'hidden'>('all');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateField = (field: keyof TeamMember, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
    };

    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleMainBack = () => {
        setEditingId(null);
        setFormData(null);
    };

    const handleMainSave = () => {
        if (!formData) return;
        const isNew = formData.id.startsWith('new-');
        const finalId = isNew ? Date.now().toString() : formData.id;
        const finalData = { ...formData, id: finalId };

        if (isNew) {
            setTeamMembers(prev => [...prev.filter(m => m.id !== formData.id), finalData]);
        } else {
            setTeamMembers(prev => prev.map(m => m.id === finalData.id ? finalData : m));
        }
        setEditingId(null);
        setFormData(null);
    };

    const handleDeleteMember = (id: string) => {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
        setMemberToDelete(null);
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
        if (data.areasOfInterest) filled++;
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

    // --- EXACT RESTORED HANDLER ---
    const handleSaveAndNext = () => {
        console.log('Saving Team Members:', teamMembers);
        onNext();
    };

    // 1. RENDER APPOINTMENT TYPE EDITOR
    if (editingId && formData && editingApptName) {
        return (
            <AppointmentTypeEditor
                practitionerName={formData.name}
                appointmentName={editingApptName}
                allTypes={formData.appointmentTypes}
                onBack={() => setEditingApptName(null)}
                onSave={handleApptSave}
            />
        );
    }

    // 2. RENDER PRACTITIONER EDITOR
    if (editingId && formData) {
        const score = calculateScore(formData);
        
        return (
            <div className="min-h-screen font-sans text-gray-800 -m-6 sm:-m-8 bg-gray-50/30">
                <div className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleMainBack}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
                            <p className="text-xs text-gray-500">{formData.name || 'New Practitioner'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleMainSave}
                        className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-gray-900/10 hover:bg-black transition-all"
                    >
                        Save & Close
                    </button>
                </div>

                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    
                    {/* Score Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-24 h-24 shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                <circle
                                    cx="50" cy="50" r="40"
                                    stroke={score > 80 ? '#22c55e' : score > 40 ? '#f97316' : '#ef4444'}
                                    strokeWidth="8" fill="none"
                                    strokeDasharray={`${score * 2.51} 251`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-900">{score}%</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Completeness</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                                A complete profile builds trust with patients. Add a photo, professional statement, and enable online bookings to reach 100%.
                            </p>
                        </div>
                    </div>

                    {/* Main Form - RESTORED ALL FIELDS */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900">Basic Information</h2>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                            
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Display Name */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. Dr. Sarah Smith"
                                    />
                                </div>

                                {/* Link to Core Practice (RESTORED) */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <label className="text-sm font-medium text-gray-700">Link to Core Practice</label>
                                            <Info className="w-3.5 h-3.5 text-blue-500 cursor-help" />
                                        </div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Refresh List
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white appearance-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a Practitioner</option>
                                            {/* Mapping would go here */}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                                    </div>
                                </div>

                                {/* Gender & Profession */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => updateField('gender', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Profession Type</label>
                                        <select
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white"
                                            defaultValue="Dental"
                                        >
                                            <option value="Dental">Dental</option>
                                            <option value="Medical">Medical</option>
                                            <option value="Allied">Allied Health</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Specific Role */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Specific Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => updateField('role', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="Orthodontist">Orthodontist</option>
                                        <option value="Hygienist">Hygienist</option>
                                        <option value="Therapist">Therapist</option>
                                    </select>
                                </div>

                                {/* AHPRA (RESTORED) */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">AHPRA Registration Number</label>
                                    <input
                                        type="text"
                                        value={formData.ahpra}
                                        onChange={(e) => updateField('ahpra', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. DEN000..."
                                    />
                                </div>

                                {/* Qualifications */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Qualifications</label>
                                    <input
                                        type="text"
                                        value={formData.qualification}
                                        onChange={(e) => updateField('qualification', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. BDS, MDS"
                                    />
                                </div>

                                {/* Education (RESTORED) */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Education</label>
                                    <input
                                        type="text"
                                        value={formData.education}
                                        onChange={(e) => updateField('education', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="e.g. University of Sydney"
                                    />
                                </div>

                                {/* Languages (RESTORED) */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Languages Spoken</label>
                                    <input
                                        type="text"
                                        value={formData.languages}
                                        onChange={(e) => updateField('languages', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="English, Spanish, Mandarin..."
                                    />
                                </div>
                            </div>

                            {/* Right Column (Image & Bio) */}
                            <div className="space-y-8">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-full bg-white mb-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative group">
                                        {formData.image ? (
                                            <img src={formData.image.url || formData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-12 h-12 text-gray-300" />
                                        )}
                                        
                                        <div 
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => document.getElementById('member-upload')?.click()}
                                        >
                                            <Edit2 className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <input
                                        id="member-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => updateField('image', { url: ev.target?.result });
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={() => document.getElementById('member-upload')?.click()}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Areas of Interest</label>
                                    <ProfessionalInterestsDropdown
                                        value={formData.areasOfInterest}
                                        onChange={(val) => updateField('areasOfInterest', val)}
                                        placeholder="Select areas..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Professional Statement</label>
                                    <textarea
                                        rows={6}
                                        value={formData.professionalStatement}
                                        onChange={(e) => updateField('professionalStatement', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm resize-none"
                                        placeholder="Tell patients about your experience and philosophy..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Booking Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Online Booking Settings
                            </h2>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-5">
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVisibleOnline}
                                        onChange={e => updateField('isVisibleOnline', e.target.checked)}
                                        className="mt-1 w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-gray-800">Visible for Online Booking</span>
                                        <span className="text-xs text-gray-500">Allow patients to find and book this practitioner online.</span>
                                    </div>
                                </label>
                                
                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowMultipleBookings}
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
                                        <input
                                            type="number"
                                            value={formData.bookingTimeLimit}
                                            onChange={e => updateField('bookingTimeLimit', e.target.value)}
                                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                                        />
                                        <select
                                            value={formData.bookingTimeLimitUnit}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={e => updateField('bookingTimeLimitUnit', e.target.value as any)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="minutes">Minutes</option>
                                            <option value="hours">Hours</option>
                                        </select>
                                        <span className="text-sm text-gray-500">before appointment</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Cancellation Lead Time</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={formData.cancelTimeLimit}
                                            onChange={e => updateField('cancelTimeLimit', e.target.value)}
                                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                                        />
                                        <select
                                            value={formData.cancelTimeLimitUnit}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={e => updateField('cancelTimeLimitUnit', e.target.value as any)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="minutes">Minutes</option>
                                            <option value="hours">Hours</option>
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
                                                    className="w-5 h-5 border-gray-300 rounded text-green-500 focus:ring-green-500 cursor-pointer"
                                                />
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
                                                    className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                >
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
            
            {/* Header */}
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
                        const newId = `new-${Date.now()}`;
                        const newMember: TeamMember = {
                            id: newId,
                            name: '',
                            role: '',
                            qualification: '',
                            gender: '',
                            ahpra: '',
                            education: '',
                            languages: '',
                            professionalStatement: '',
                            areasOfInterest: '',
                            isVisibleOnline: false,
                            allowMultipleBookings: true,
                            bookingTimeLimit: 0,
                            bookingTimeLimitUnit: 'minutes',
                            cancelTimeLimit: 0,
                            cancelTimeLimitUnit: 'minutes',
                            appointmentTypes: JSON.parse(JSON.stringify(defaultAppointmentTypes))
                        };
                        setTeamMembers(prev => [...prev, newMember]);
                        startEdit(newMember);
                    }}
                    className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black transition shadow-lg shadow-gray-900/20"
                >
                    <Plus className="w-4 h-4" /> Add Practitioner
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-50/50 rounded-xl w-fit border border-gray-100">
                {(['all', 'visible', 'hidden'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === tab 
                                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-100' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab === 'all' ? 'All Members' : tab === 'visible' ? 'Visible' : 'Not Visible'} 
                        <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeTab === tab ? 'bg-orange-50' : 'bg-gray-200'}`}>
                            {counts[tab]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                        <div
                            key={member.id}
                            className={`
                                relative bg-white border border-gray-300 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 group
                                ${member.isVisibleOnline 
                                    ? 'border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5' 
                                    : 'border-gray-100 bg-gray-50/30 opacity-80 hover:opacity-100'}
                            `}
                            onClick={() => startEdit(member)}
                        >
                            {/* Status Dot */}
                            <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${member.isVisibleOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} title={member.isVisibleOnline ? "Visible Online" : "Hidden"} />

                            {/* Image */}
                            <div className="w-24 h-24 rounded-full bg-white mb-4 p-1 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {member.image ? (
                                        <img src={member.image.url || member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Users className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate w-full px-2">{member.name || 'Unnamed'}</h3>
                            <p className="text-gray-500 text-sm mb-6 h-5 truncate w-full px-2">{member.role || 'No Role'}</p>

                            <div className="w-full mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                <button 
                                    className="flex-1 py-2 text-sm font-medium text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setMemberToDelete(member.id); }}
                                    className="flex-1 py-2 text-sm font-medium text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
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

            {/* RESTORED EXACT FOOTER UI & ACTION */}
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

            {/* Delete Confirmation Modal */}
            {memberToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Delete Practitioner</h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to delete this practitioner? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setMemberToDelete(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteMember(memberToDelete)}
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