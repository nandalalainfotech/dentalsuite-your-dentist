import React, { useState, useRef, useEffect } from 'react';
import {
    Users, Edit2, ArrowLeft,
    Info, Check, ChevronDown, Stethoscope, ChevronRight, X, RotateCcw,
} from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';


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
    imageUrl?: string;
    linkedPractitionerId?: string;
    isVisibleOnline: boolean;
    allowMultipleBookings: boolean;
    bookingTimeLimit: number;
    bookingTimeLimitUnit: 'minutes' | 'hours';
    cancelTimeLimit: number;
    cancelTimeLimitUnit: 'minutes' | 'hours';
    appointmentTypes: AppointmentType[];
}

// --- Helper Component: Multi-Select Dropdown ---

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
        setSearchTerm(''); // Clear search to allow finding next item easily
        inputRef.current?.focus(); // Keep focus on input
    };

    const removeOption = (option: string) => {
        const updated = selectedValues.filter(item => item !== option);
        onChange(updated.join(', '));
    };

    return (
        <div className="font-sans" ref={containerRef}>
            {/* 1. INPUT & DROPDOWN WRAPPER */}
            <div className="relative">
                <div
                    className={`w-full px-3 py-2 border rounded bg-white flex items-center justify-between cursor-text transition-all ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
                        }`}
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
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    />
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu - Positioned Absolutely to the Input Wrapper */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => {
                                const isSelected = selectedValues.includes(option);
                                return (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected
                                            ? 'bg-blue-50 text-blue-700 font-medium'
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
                            <div className="px-3 py-2 text-sm text-gray-400 italic">
                                No matching interests found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 2. SELECTED TAGS */}
            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedValues.map((interest, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100 animate-fadeIn"
                        >
                            {interest}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(interest);
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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

// --- Helper Component: Appointment Type Editor ---

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
    // Helper to find initial state based on patient type
    const getType = (pt: 'New' | 'Existing') => allTypes.find(t => t.name === appointmentName && t.patientType === pt);
    const existingType = getType('Existing');
    const newType = getType('New');

    // State for Existing Patients
    const [exEnabled, setExEnabled] = useState(existingType?.enabled || false);
    const [exDuration, setExDuration] = useState(existingType?.duration || 30);
    const [exLimit, setExLimit] = useState(existingType?.bookingLimit || '');
    const [exTerms, setExTerms] = useState(existingType?.terms || '');

    // State for New Patients
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

    // Helper component for the form column
    const ColumnForm = ({
        title,
        enabled, setEnabled,
        duration, setDuration,
        limit, setLimit,
        terms, setTerms,
        limitLabel
    }: any) => (
        <div className="h-full">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">{title}</h3>

            <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-800">Available online</span>
            </label>

            {enabled && (
                <div className="space-y-4 animate-fade-in">
                    {/* Duration */}
                    <div className="flex items-center gap-3">
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                            {[15, 30, 45, 60, 90].map(m => (
                                <option key={m} value={m}>{m} mins</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-700">Appointment length</span>
                    </div>

                    {/* Booking Limit */}
                    <div className="text-sm text-gray-700 leading-relaxed">
                        <span>{limitLabel}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-16 border border-gray-300 rounded px-2 py-1.5 text-center focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <span>days in the future</span>
                        </div>
                    </div>

                    {/* Terms */}
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <label className="text-sm text-gray-700">Terms and Conditions</label>
                            <Info className="w-4 h-4 text-blue-500" />
                        </div>
                        <textarea
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none min-h-[80px]"
                            placeholder="(optional)"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen font-sans text-gray-800">
            {/* Header Bar */}
            <div className="mt-4 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-semibold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="h-6 w-px bg-gray-400"></div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Edit "{appointmentName}" settings for {practitionerName}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">

                    {/* Card Header with Info Banner */}
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-3">
                        <h2 className="font-bold text-gray-800 text-sm md:text-base whitespace-nowrap">Practitioners Settings</h2>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm flex items-center gap-2">
                            <Info className="w-4 h-4 flex-shrink-0" />
                            <span>Editing this appointment type will not affect any other practitioners</span>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
                        {/* Existing Patients Column */}
                        <div className="md:border-r md:border-gray-200 md:pr-8">
                            <ColumnForm
                                title="Existing Patients"
                                enabled={exEnabled} setEnabled={setExEnabled}
                                duration={exDuration} setDuration={setExDuration}
                                limit={exLimit} setLimit={setExLimit}
                                terms={exTerms} setTerms={setExTerms}
                                limitLabel="Existing patients can book an appointment online no more than"
                            />
                        </div>

                        {/* New Patients Column */}
                        <div className="md:pl-8">
                            <ColumnForm
                                title="New Patients"
                                enabled={newEnabled} setEnabled={setNewEnabled}
                                duration={newDuration} setDuration={setNewDuration}
                                limit={newLimit} setLimit={setNewLimit}
                                terms={newTerms} setTerms={setNewTerms}
                                limitLabel="New patients can book an appointment online no more than"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function PracticeTeam({ clinicData, onNext }: { clinicData: Clinic; onNext: () => void }) {

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
                imageUrl: dentist.image || '',
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

        return [...membersFromDentists, ...membersFromTeamOnly];
    };

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(generateInitialMembers());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingApptName, setEditingApptName] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamMember | null>(null);

    // List View Filter State
    const [activeTab, setActiveTab] = useState<'all' | 'visible' | 'hidden'>('all');

    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateField = (field: keyof TeamMember, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
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
        if (data.imageUrl) filled++;
        return Math.round((filled / total) * 100);
    };

    // --- VIEW LOGIC: Filter Lists ---
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

    // --- RENDER CONDITIONAL VIEWS ---

    // 1. Appointment Type Editor (Deepest Level)
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

    // 2. Main Practitioner Editor
    if (editingId && formData) {
        const score = calculateScore(formData);
        const checklist = [
            { label: 'Link to Core Practice', complete: false }, // Mock logic
            { label: 'Image', complete: !!formData.imageUrl },
            { label: 'Professional Statement', complete: !!formData.professionalStatement },
            { label: 'Appointment Types', complete: formData.appointmentTypes.some(a => a.enabled) },
        ];

        return (
            <div className="min-h-screen font-sans text-gray-800 -m-6 sm:-m-8">
                {/* Header Bar */}
                <div className="px-6 py-4 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleMainBack}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-semibold text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="h-6 w-px bg-gray-400"></div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Edit {formData.name || 'Practitioner'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleMainSave}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-blue-700"
                        >Save Changes
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6 space-y-6">

                    {/* Progress Card */}
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Score Circle */}
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                        <circle
                                            cx="50" cy="50" r="40"
                                            stroke={score > 80 ? '#22c55e' : score > 40 ? '#f97316' : '#ef4444'}
                                            strokeWidth="8" fill="none"
                                            strokeDasharray={`${score * 2.51} 251`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
                                        <span className="text-2xl font-bold">{score}<span className="text-sm">%</span></span>
                                        <span className={`text-[10px] font-bold uppercase ${score > 80 ? 'text-green-600' : score > 40 ? 'text-orange-500' : 'text-red-500'}`}>
                                            {score > 80 ? 'Excellent' : score > 40 ? 'Ok' : 'Poor'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{formData.name || 'Practitioner'}'s Profile</h3>
                                    <p className="text-gray-500 text-sm mt-1">Please fill out the following fields as required.</p>
                                </div>
                            </div>

                            {/* Checklist Links */}
                            <div className="flex-1 md:border-l md:border-gray-200 md:pl-8">
                                <p className="text-gray-700 text-sm mb-3">Add this information to complete this Practitioner Profile:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    {checklist.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-1 text-sm font-medium">
                                            {item.complete ? (
                                                <span className="text-gray-400 line-through flex items-center gap-1">
                                                    {item.label} <Check className="w-4 h-4 text-green-600" />
                                                </span>
                                            ) : (
                                                <button className="text-teal-600 hover:text-teal-700 flex items-center gap-1">
                                                    {item.label} <ChevronRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-sm font-medium mt-1">
                                        Take full guide again <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Practitioner Profile Form */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden font-sans">
                        {/* Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
                            <h2 className="font-bold text-gray-800 text-base sm:text-lg">Practitioner Profile</h2>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* LEFT COLUMN - Form Data */}
                                <div className="lg:col-span-2 space-y-5">
                                    {/* Display Name */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Display Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Link to Core Practice */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1">
                                                <label className="text-sm font-semibold text-gray-700">Link to Core Practice</label>
                                                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                                            </div>
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                                            >
                                                <RotateCcw className="w-3 h-3" /> Refresh
                                            </button>
                                        </div>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-600"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select a Practitioner</option>
                                        </select>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Gender</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => updateField('gender', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Profession */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700">Profession</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                            defaultValue="Dental"
                                        >
                                            <option value="Dental">Dental</option>
                                            <option value="Medical">Medical</option>
                                            <option value="Allied">Allied Health</option>
                                        </select>

                                        <select
                                            value={formData.role}
                                            onChange={(e) => updateField('role', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        >
                                            <option value="">Select profession</option>
                                            <option value="Dentist">Dentist</option>
                                            <option value="Orthodontist">Orthodontist</option>
                                            <option value="Dental Hygienist">Dental Hygienist</option>
                                        </select>
                                    </div>

                                    {/* AHPRA */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">AHPRA Registration Number</label>
                                        <input
                                            type="text"
                                            placeholder="Type your registration number"
                                            value={formData.ahpra}
                                            onChange={(e) => updateField('ahpra', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Qualifications */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Qualifications</label>
                                        <input
                                            type="text"
                                            placeholder="Type or select a qualification"
                                            value={formData.qualification}
                                            onChange={(e) => updateField('qualification', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Education */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Education</label>
                                        <input
                                            type="text"
                                            placeholder="Type and add education"
                                            value={formData.education || ''}
                                            onChange={(e) => updateField('education', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Languages Spoken */}
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Languages Spoken</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-500"
                                        >
                                            <option>Select languages</option>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="cn">Mandarin</option>
                                        </select>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN - Image & Statement */}
                                <div className="space-y-6">
                                    {/* Image Upload - Side by Side Layout */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden shrink-0">
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt={formData.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Stethoscope className="w-10 h-10 text-gray-400" />
                                            )}
                                        </div>

                                        <button
                                            className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            updateField('imageUrl', e.target?.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                };
                                                input.click();
                                            }}
                                        >
                                            Choose Image
                                        </button>
                                    </div>

                                    {/* Professional Statement */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">Professional Statement</label>
                                        <textarea
                                            rows={8}
                                            placeholder="A professional statement will help the patient get to know the practitioner better.."
                                            value={formData.professionalStatement}
                                            onChange={(e) => updateField('professionalStatement', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-white shadow-sm outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder-gray-400"
                                        />
                                    </div>

                                    {/* Areas of Interest */}
                                    <div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <label className="text-sm font-semibold text-gray-700">Professional Areas of Interest</label>
                                            <Info className="w-3.5 h-3.5 text-blue-500" />
                                        </div>

                                        <ProfessionalInterestsDropdown
                                            value={formData.areasOfInterest}
                                            onChange={(value) => updateField('areasOfInterest', value)}
                                            placeholder="Type or select an interest"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Bookings Settings */}
                    <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-800">Online Bookings Settings</span>
                            <span className="text-sm text-blue-600"> Link practitioner to Core Practice to customise their Online Booking Settings</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVisibleOnline}
                                        onChange={e => updateField('isVisibleOnline', e.target.checked)}
                                        className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Visible for Online Bookings
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowMultipleBookings}
                                        onChange={e => updateField('allowMultipleBookings', e.target.checked)}
                                        className="mt-1 w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600 ">
                                        Allow patients to book multiple appointments with {formData.name || 'practitioner'} or an appointment with another practitioner on the same day
                                    </span>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                                    <span>Patients can book an appointment online up until</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={formData.bookingTimeLimit}
                                            onChange={e => updateField('bookingTimeLimit', parseInt(e.target.value) || 0)}
                                            className="w-16 px-2 py-1.5 border border-gray-300 bg-gray-50 rounded text-center"
                                        />
                                        <select
                                            value={formData.bookingTimeLimitUnit}
                                            onChange={e => updateField('bookingTimeLimitUnit', e.target.value as any)}
                                            className="px-2 py-1.5 border border-gray-300 bg-gray-50 rounded"
                                        >
                                            <option value="minutes">minutes</option>
                                            <option value="hours">hours</option>
                                        </select>
                                    </div>
                                    <span>before the appointment</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                                    <span>Patients can cancel an appointment online up until</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={formData.cancelTimeLimit}
                                            onChange={e => updateField('cancelTimeLimit', parseInt(e.target.value) || 0)}
                                            className="w-16 px-2 py-1.5 border border-gray-300 bg-gray-50 rounded text-center"
                                        />
                                        <select
                                            value={formData.cancelTimeLimitUnit}
                                            onChange={e => updateField('cancelTimeLimitUnit', e.target.value as any)}
                                            className="px-2 py-1.5 border border-gray-300 bg-gray-50 rounded"
                                        >
                                            <option value="minutes">minutes</option>
                                            <option value="hours">hours</option>
                                        </select>
                                    </div>
                                    <span>before the appointment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Types */}
                    <div className="bg-white rounded shadow-sm border border-gray-200 mb-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="font-bold text-gray-800">Appointment Types for {formData.name || 'Practitioner'}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600">Apply Template:</span>
                                <div className="relative">
                                    <select
                                        className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm text-gray-600 bg-white appearance-none min-w-[200px]"
                                    >
                                        <option>Copy from Practitioner</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <table className="w-full text-left text-sm table-fixed">
                                <thead className="bg-white border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold text-gray-600 w-16">Enabled</th>
                                        <th className="px-6 py-3 font-semibold text-gray-600">Type</th>
                                        <th className="px-6 py-3 font-semibold text-gray-600">Patient Type</th>
                                        <th className="px-6 py-3 font-semibold text-gray-600">Duration</th>
                                        <th className="px-6 py-3 font-semibold text-gray-600">T&C</th>
                                        <th className="px-6 py-3 font-semibold text-gray-600 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.appointmentTypes.map((app, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={app.enabled}
                                                    onChange={e => {
                                                        const updated = [...formData.appointmentTypes];
                                                        updated[idx].enabled = e.target.checked;
                                                        updateField('appointmentTypes', updated);
                                                    }}
                                                    className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{app.name}</td>
                                            <td className="px-6 py-4 text-gray-700">{app.patientType}</td>
                                            <td className="px-6 py-4 text-gray-700">{app.duration} mins</td>
                                            <td className="px-6 py-4 text-gray-400">-</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setEditingApptName(app.name)}
                                                    className="px-4 py-1 border border-blue-400 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 bg-white transition-colors"
                                                >
                                                    Edit
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

    const handleSaveAndNext = () => {
        console.log('Saving Team Members:', teamMembers);
        onNext();
    };

    // 3. Main List View (Card Grid)
    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-10 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader
                title="Practice Team"
                desc="Manage your team members and their settings."
                actionLabel="Add New Member"
                onActionClick={() => {
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
            />

            {/* Filter Tabs */}
            <div className="px-4 sm:px-0 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'all'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All ({counts.all})
                    </button>
                    <button
                        onClick={() => setActiveTab('visible')}
                        className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'visible'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Visible Online ({counts.visible})
                    </button>
                    <button
                        onClick={() => setActiveTab('hidden')}
                        className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'hidden'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Not Visible ({counts.hidden})
                    </button>
                </div>
            </div>

            {/* Practitioners Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                        <div
                            key={member.id}
                            onClick={() => startEdit(member)}
                            className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group relative"
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${member.isVisibleOnline ? 'bg-green-500' : 'bg-red-500'}`} title={member.isVisibleOnline ? "Visible Online" : "Not Visible"} />

                            <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center border-4 border-white shadow overflow-hidden">
                                {member.imageUrl ? (
                                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate w-full">
                                {member.name || 'Unnamed Practitioner'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 h-5">
                                {member.role || 'No Role Assigned'}
                            </p>

                            <div className="mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${member.isVisibleOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {member.isVisibleOnline ? 'Visible Online' : 'Hidden'}
                                </span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                                <span className="text-blue-600 text-sm font-medium flex items-center justify-center gap-1 group-hover:text-blue-700">
                                    <Edit2 className="w-3 h-3" /> Edit Profile
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
                        <p>No practitioners found in this view.</p>
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
