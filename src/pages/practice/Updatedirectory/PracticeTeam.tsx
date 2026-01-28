import React, { useState, useRef, useEffect } from 'react';
import {
    Users, Edit2, ArrowLeft, HelpCircle,
    Info, Stethoscope, Check,
    ChevronRight, X, PlusCircle, Menu
} from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface ProfessionalInterestsDropdownProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

function ProfessionalInterestsDropdown({ value, onChange, placeholder }: ProfessionalInterestsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        "Cosmetic Dentistry", "Family Dentistry", "Pediatric Dentistry", "Orthodontics",
        "Endodontics", "Periodontics", "Oral Surgery", "Prosthodontics",
        "Dental Implants", "Invisalign", "Teeth Whitening", "Root Canal Therapy",
        "Wisdom Teeth Removal", "Emergency Dental Care", "Preventive Dentistry",
        "Restorative Dentistry"
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedValues = value ? value.split(', ').filter(i => i) : [];

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option: string) => {
        if (selectedValues.includes(option)) {
            const updated = selectedValues.filter(item => item !== option);
            onChange(updated.join(', '));
        } else {
            const updated = [...selectedValues, option];
            onChange(updated.join(', '));
        }
    };

    const removeOption = (option: string) => {
        const updated = selectedValues.filter(item => item !== option);
        onChange(updated.join(', '));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Search Input */}
            <div
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md bg-white flex items-center cursor-pointer focus-within:ring-2 focus-within:ring-orange-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    className="w-full outline-none bg-transparent text-sm sm:text-base placeholder-gray-400"
                    placeholder={placeholder}
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
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown with scroll */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    style={{
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}
                >
                    {filteredOptions.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500 text-center">
                            No options found
                        </div>
                    ) : (
                        <div className="p-1">
                            {filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-2.5 sm:p-2 hover:bg-gray-100 rounded-sm cursor-pointer ${selectedValues.includes(option) ? 'bg-orange-50' : ''}`}
                                    onClick={() => toggleOption(option)}
                                >
                                    <div className={`w-5 h-5 sm:w-4 sm:h-4 border rounded-sm mr-2 flex items-center justify-center flex-shrink-0 ${selectedValues.includes(option) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                                        {selectedValues.includes(option) && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-800">{option}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Selected tags */}
            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {selectedValues.map((interest, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium"
                        >
                            <span className="truncate max-w-[120px] sm:max-w-none">{interest}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(interest);
                                }}
                                className="ml-0.5 sm:ml-1 text-orange-600 hover:text-orange-800 transition-colors p-0.5"
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

interface AppointmentType {
    id: string;
    name: string;
    patientType: 'New' | 'Existing';
    duration: number;
    enabled: boolean;
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

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 sm:gap-3 animate-fade-in-up z-50">
        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
        <span className="font-medium text-sm sm:text-base flex-1">{message}</span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-gray-300" />
        </button>
    </div>
);

const Label = ({ children, info }: { children: React.ReactNode, info?: boolean }) => (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
        {children}
        {info && <Info className="w-4 h-4 text-blue-500 fill-current opacity-80" />}
    </label>
);

// Mobile-friendly appointment card for table alternative
const AppointmentCard = ({
    app,
    onToggle,
    onEdit
}: {
    app: AppointmentType;
    onToggle: (checked: boolean) => void;
    onEdit: () => void;
}) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={app.enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <div>
                    <h4 className="font-medium text-gray-900">{app.name}</h4>
                    <p className="text-sm text-gray-500">{app.patientType} Patient</p>
                </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                {app.enabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">{app.duration} mins</span>
            <button
                onClick={onEdit}
                className="px-4 py-1.5 border border-orange-400 text-orange-600 rounded-md bg-orange-50 hover:bg-orange-100 font-medium text-sm transition-colors"
            >
                Edit
            </button>
        </div>
    </div>
);

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
    const existingType = allTypes.find(t => t.name === appointmentName && t.patientType === 'Existing');
    const newType = allTypes.find(t => t.name === appointmentName && t.patientType === 'New');

    const [existingEnabled, setExistingEnabled] = useState(existingType?.enabled || false);
    const [newEnabled, setNewEnabled] = useState(newType?.enabled || false);

    const handleSave = () => {
        const updatedList = allTypes.map(t => {
            if (t.name === appointmentName) {
                if (t.patientType === 'Existing') return { ...t, enabled: existingEnabled };
                if (t.patientType === 'New') return { ...t, enabled: newEnabled };
            }
            return t;
        });
        onSave(updatedList);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white min-h-screen font-sans text-gray-800 px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-5 border-b border-gray-200 mb-4 sm:mb-6 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors self-start"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-base sm:text-lg">Back</span>
                    </button>
                    <div className="hidden sm:block h-7 w-px bg-gray-300 mx-2"></div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Edit <span className="text-orange-600 break-words">"{appointmentName}"</span>
                        <span className="block sm:inline text-gray-900"> for {practitionerName}</span>
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        <span>Need Help?</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 sm:py-2 bg-orange-600 text-white rounded-md shadow-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Content Box */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                    <div className="font-bold text-gray-800 text-base sm:text-lg">
                        Practitioner Settings
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 rounded-md flex items-start sm:items-center gap-2 text-xs sm:text-sm font-medium">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span>Editing this appointment type will not affect any other practitioners</span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="md:border-r md:border-gray-200 md:pr-8 pb-6 md:pb-0 border-b md:border-b-0 border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Existing Patients</h3>
                        <label className="flex items-center gap-3 cursor-pointer select-none p-2 -ml-2 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={existingEnabled}
                                onChange={(e) => setExistingEnabled(e.target.checked)}
                                className="w-5 h-5 sm:w-5 sm:h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-gray-700 text-sm sm:text-base">Available online</span>
                        </label>
                    </div>

                    <div className="md:pl-8 pt-6 md:pt-0">
                        <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">New Patients</h3>
                        <label className="flex items-center gap-3 cursor-pointer select-none p-2 -ml-2 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={newEnabled}
                                onChange={(e) => setNewEnabled(e.target.checked)}
                                className="w-5 h-5 sm:w-5 sm:h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-gray-700 text-sm sm:text-base">Available online</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PracticeTeam({ clinicData }: { clinicData: Clinic }) {

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
        return (clinicData.team || []).map((member, i) => ({
            id: i.toString(),
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
    };

    // --- State ---
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(generateInitialMembers());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingApptName, setEditingApptName] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamMember | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

        setToast(`Profile for ${finalData.name || 'Practitioner'} saved successfully.`);
        setTimeout(() => setToast(null), 3000);
        setEditingId(null);
        setFormData(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateField = (field: keyof TeamMember, value: any) => {
        if (formData) setFormData({ ...formData, [field]: value });
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

    if (editingId && formData) {
        const score = calculateScore(formData);

        return (
            <div className="max-w-7xl mx-auto bg-white min-h-screen pb-20 font-sans text-gray-800">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-5 border-b border-gray-200 mb-4 sm:mb-6 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={handleMainBack}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-base sm:text-lg">Back</span>
                        </button>
                        <div className="hidden sm:block h-7 w-px bg-gray-300 mx-2"></div>
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                            Edit <span className="text-orange-600">{formData.name || 'Practitioner'}</span>
                        </h1>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <HelpCircle className="w-4 h-4 text-gray-500" /> Need Help?
                    </button>
                </div>

                {/* Score Card - Responsive */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Score Circle */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="50" cy="50" r="40"
                                        stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444'}
                                        strokeWidth="8" fill="none"
                                        strokeDasharray={`${score * 2.51} 251`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
                                    <span className="text-2xl sm:text-3xl font-bold">{score}<span className="text-sm sm:text-base">%</span></span>
                                    <span className={`text-xs font-semibold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
                                        {score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : 'Poor'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 lg:border-r lg:border-gray-100 lg:pr-6">
                            <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">{formData.name || 'Practitioner'}'s Profile</h3>
                            <p className="text-gray-600 text-sm">Please fill out the following fields as required to complete the profile.</p>
                        </div>

                        {/* Checklist */}
                        <div className="flex-1 lg:pl-2">
                            <p className="text-gray-700 text-sm mb-3 font-semibold">Add this information to complete this profile:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {[
                                    { label: 'Profession', check: !!formData.role },
                                    { label: 'Professional Statement', check: !!formData.professionalStatement },
                                    { label: 'Appointment Types', check: formData.appointmentTypes.some(a => a.enabled) }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className={`text-left flex items-center gap-1 p-1 rounded hover:bg-gray-50 ${item.check ? 'text-gray-400 line-through' : 'text-orange-600 font-medium'}`}
                                    >
                                        {item.check && <Check className="w-4 h-4 text-green-500" />}
                                        {item.label}
                                        {!item.check && <ChevronRight className="w-3 h-3 text-orange-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form - Responsive */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 sm:mb-6 overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-800 text-base sm:text-lg">Practitioner Profile</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Left Column - Form Fields */}
                            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                                <div>
                                    <Label>Display Name</Label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => updateField('name', e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm sm:text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <Label>Gender</Label>
                                        <select
                                            value={formData.gender}
                                            onChange={e => updateField('gender', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm sm:text-base"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Profession</Label>
                                        <select
                                            value={formData.role}
                                            onChange={e => updateField('role', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm sm:text-base"
                                        >
                                            <option value="">Select a profession</option>
                                            <option value="Dentist">Dentist</option>
                                            <option value="Orthodontist">Orthodontist</option>
                                            <option value="Periodontist">Periodontist</option>
                                            <option value="Endodontist">Endodontist</option>
                                            <option value="Oral Surgeon">Oral Surgeon</option>
                                            <option value="Pediatric Dentist">Pediatric Dentist</option>
                                            <option value="Prosthodontist">Prosthodontist</option>
                                            <option value="Dental Hygienist">Dental Hygienist</option>
                                            <option value="Dental Assistant">Dental Assistant</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label>AHPRA Registration Number</Label>
                                    <input
                                        type="text"
                                        value={formData.ahpra}
                                        onChange={e => updateField('ahpra', e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm sm:text-base"
                                    />
                                </div>
                                <div>
                                    <Label>Qualifications</Label>
                                    <input
                                        type="text"
                                        value={formData.qualification}
                                        onChange={e => updateField('qualification', e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Right Column - Image & Statement */}
                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt={formData.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                                        )}
                                    </div>
                                    <button
                                        className="px-4 sm:px-5 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

                                <div>
                                    <Label>Professional Statement</Label>
                                    <textarea
                                        rows={4}
                                        value={formData.professionalStatement}
                                        onChange={e => updateField('professionalStatement', e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <Label info>Professional Areas of Interest</Label>
                                    <p className="text-xs text-gray-500 mb-2">e.g.: Women's health, Cosmetic dentistry</p>
                                    <ProfessionalInterestsDropdown
                                        value={formData.areasOfInterest}
                                        onChange={(value) => updateField('areasOfInterest', value)}
                                        placeholder="Type or select interests"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Settings - Responsive */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 sm:mb-6 overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-orange-50/20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-bold text-gray-800 text-base sm:text-lg">Online Bookings Settings</span>
                            <div className="flex items-center gap-1.5 text-orange-700 text-xs sm:text-sm font-medium">
                                <Info className="w-4 h-4 flex-shrink-0" />
                                <span>Link practitioner to Core Practice</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Visibility Options */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer p-2 -ml-2 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVisibleOnline}
                                        onChange={e => updateField('isVisibleOnline', e.target.checked)}
                                        className="w-5 h-5 border-gray-300 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700 text-sm sm:text-base flex items-center gap-1">
                                        Visible for Online Bookings
                                        <Info className="w-3 h-3 text-gray-400" />
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-2 -ml-2 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowMultipleBookings}
                                        onChange={e => updateField('allowMultipleBookings', e.target.checked)}
                                        className="w-5 h-5 border-gray-300 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700 text-sm sm:text-base">Allow multiple bookings</span>
                                </label>
                            </div>

                            {/* Time Limits */}
                            <div className="space-y-4">
                                {/* Book Until */}
                                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-700">
                                    <span className="w-20 sm:w-auto">Book until</span>
                                    <input
                                        type="number"
                                        className="w-16 sm:w-20 border border-gray-300 p-2 rounded-md text-center shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors"
                                        value={formData.bookingTimeLimit}
                                        onChange={e => updateField('bookingTimeLimit', parseInt(e.target.value) || 0)}
                                    />
                                    <select
                                        value={formData.bookingTimeLimitUnit}
                                        onChange={e => updateField('bookingTimeLimitUnit', e.target.value as 'minutes' | 'hours')}
                                        className="border border-gray-300 p-2 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm"
                                    >
                                        <option value="minutes">mins</option>
                                        <option value="hours">hrs</option>
                                    </select>
                                    <span className="text-xs sm:text-sm">before appt</span>
                                </div>

                                {/* Cancel Until */}
                                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-700">
                                    <span className="w-20 sm:w-auto">Cancel until</span>
                                    <input
                                        type="number"
                                        className="w-16 sm:w-20 border border-gray-300 p-2 rounded-md text-center shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors"
                                        value={formData.cancelTimeLimit}
                                        onChange={e => updateField('cancelTimeLimit', parseInt(e.target.value) || 0)}
                                    />
                                    <select
                                        value={formData.cancelTimeLimitUnit}
                                        onChange={e => updateField('cancelTimeLimitUnit', e.target.value as 'minutes' | 'hours')}
                                        className="border border-gray-300 p-2 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm"
                                    >
                                        <option value="minutes">mins</option>
                                        <option value="hours">hrs</option>
                                    </select>
                                    <span className="text-xs sm:text-sm">before appt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointment Types - Responsive */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 sm:mb-10 overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                                Appointment Types for <span className="text-orange-600">{formData.name}</span>
                            </h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <span className="text-sm font-semibold text-gray-600">Apply Template:</span>
                                <select
                                    className="w-full sm:w-auto text-sm border border-gray-300 rounded-md pl-3 pr-8 py-2 bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors"
                                    onChange={(e) => {
                                        const sourceMember = teamMembers.find(m => m.id === e.target.value);
                                        if (sourceMember) {
                                            updateField('appointmentTypes', [...sourceMember.appointmentTypes]);
                                        }
                                    }}
                                >
                                    <option value="">Copy from Practitioner</option>
                                    {teamMembers.filter(member => member.id !== formData.id && member.appointmentTypes.some(t => t.enabled)).map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-4 lg:px-6 py-3 w-20">Enabled</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3">Type</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3">Patient Type</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3">Duration</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3">T&C</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {formData.appointmentTypes.map((app, index) => (
                                    <tr key={app.id || index} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-4 lg:px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={app.enabled}
                                                onChange={(e) => {
                                                    const updatedTypes = formData.appointmentTypes.map(t =>
                                                        t.id === app.id ? { ...t, enabled: e.target.checked } : t
                                                    );
                                                    updateField('appointmentTypes', updatedTypes);
                                                }}
                                                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 text-gray-800 font-medium">{app.name}</td>
                                        <td className="px-4 lg:px-6 py-4 text-gray-600">{app.patientType}</td>
                                        <td className="px-4 lg:px-6 py-4 text-gray-600">{app.duration} mins</td>
                                        <td className="px-4 lg:px-6 py-4 text-gray-400">-</td>
                                        <td className="px-4 lg:px-6 py-4 text-right">
                                            <button
                                                onClick={() => setEditingApptName(app.name)}
                                                className="px-3 lg:px-5 py-2 border border-orange-400 text-orange-600 rounded-md bg-orange-50 hover:bg-orange-100 font-semibold text-sm transition-colors"
                                            >
                                                Edit Settings
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden p-4 space-y-3">
                        {formData.appointmentTypes.map((app, index) => (
                            <AppointmentCard
                                key={app.id || index}
                                app={app}
                                onToggle={(checked) => {
                                    const updatedTypes = formData.appointmentTypes.map(t =>
                                        t.id === app.id ? { ...t, enabled: checked } : t
                                    );
                                    updateField('appointmentTypes', updatedTypes);
                                }}
                                onEdit={() => setEditingApptName(app.name)}
                            />
                        ))}
                    </div>

                    {/* Save Button Footer */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex justify-center sm:justify-end bg-gray-50">
                        <button
                            onClick={handleMainSave}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md shadow-lg transition-colors"
                        >
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main List View - Responsive
    return (
        <div className="max-w-7xl mx-auto min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 pb-8">
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

            {/* Team Member Cards Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {teamMembers.map(member => (
                    <div
                        key={member.id}
                        onClick={() => startEdit(member)}
                        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:border-orange-400 transition-all duration-300 group relative active:scale-[0.98]"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gray-100 mb-3 sm:mb-4 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                            {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl mb-1 line-clamp-1">
                            {member.name || 'Unnamed Practitioner'}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-1">
                            {member.role || 'No Role Assigned'}
                        </p>
                        <div className="mt-auto w-full pt-3 sm:pt-4 border-t border-gray-100 flex justify-center">
                            <span className="text-orange-600 text-xs sm:text-sm font-medium flex items-center gap-1 group-hover:text-orange-700 transition-colors">
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit Profile
                            </span>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {teamMembers.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Team Members Yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Start by adding your first team member</p>
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
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add Team Member
                        </button>
                    </div>
                )}
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}