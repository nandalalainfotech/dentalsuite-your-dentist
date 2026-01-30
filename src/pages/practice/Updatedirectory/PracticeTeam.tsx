import React, { useState, useRef, useEffect } from 'react';
import {
    Users, Edit2, ArrowLeft, HelpCircle,
    Info, Stethoscope, Check,
    ChevronRight, X, PlusCircle
} from 'lucide-react';
import type { Clinic } from '../../../types';

// --- HELPER COMPONENTS ---

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
            <div
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-xl bg-white flex items-center cursor-pointer focus-within:ring-2 focus-within:ring-orange-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    className="w-full outline-none bg-transparent text-sm placeholder-gray-400"
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
                <ChevronRight
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500 text-center">No options found</div>
                    ) : (
                        <div className="p-1">
                            {filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${selectedValues.includes(option) ? 'bg-orange-50' : ''}`}
                                    onClick={() => toggleOption(option)}
                                >
                                    <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center flex-shrink-0 ${selectedValues.includes(option) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                                        {selectedValues.includes(option) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-800">{option}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedValues.map((interest, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                            <span>{interest}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(interest);
                                }}
                                className="text-orange-600 hover:text-orange-800"
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

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
        <Check className="w-5 h-5 text-green-400" />
        <span className="font-medium text-sm">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full">
            <X className="w-4 h-4 text-gray-400" />
        </button>
    </div>
);

const Label = ({ children, info }: { children: React.ReactNode, info?: boolean }) => (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
        {children}
        {info && <Info className="w-4 h-4 text-blue-500 opacity-80" />}
    </label>
);

// --- TYPES ---

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
    isVisibleOnline: boolean;
    allowMultipleBookings: boolean;
    bookingTimeLimit: number;
    bookingTimeLimitUnit: 'minutes' | 'hours';
    cancelTimeLimit: number;
    cancelTimeLimitUnit: 'minutes' | 'hours';
    appointmentTypes: AppointmentType[];
}

// --- SUB-EDITORS ---

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
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">
                        Edit <span className="text-orange-600">{appointmentName}</span> for {practitionerName}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                >
                    Save Changes
                </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 p-4 border-b border-gray-100 flex gap-2 text-sm text-blue-700">
                    <Info className="w-4 h-4 mt-0.5" />
                    Editing this appointment type will not affect other practitioners.
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border-r border-gray-100 pr-8">
                        <h3 className="font-bold text-gray-800 mb-4">Existing Patients</h3>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-500 cursor-pointer transition">
                            <input
                                type="checkbox"
                                checked={existingEnabled}
                                onChange={(e) => setExistingEnabled(e.target.checked)}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-gray-700">Available online</span>
                        </label>
                    </div>
                    <div className="pl-8">
                        <h3 className="font-bold text-gray-800 mb-4">New Patients</h3>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-500 cursor-pointer transition">
                            <input
                                type="checkbox"
                                checked={newEnabled}
                                onChange={(e) => setNewEnabled(e.target.checked)}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-gray-700">Available online</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function PracticeTeam({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const members = (clinicData as any).team || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return members.map((member: any, i: number) => ({
            id: i.toString(),
            name: member.name || '',
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

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(generateInitialMembers());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingApptName, setEditingApptName] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamMember | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMainBack = () => {
        setEditingId(null);
        setFormData(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // --- RENDER: APPOINTMENT EDITOR ---
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
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <button onClick={handleMainBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition">
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">
                            Edit <span className="text-orange-500">{formData.name || 'Practitioner'}</span>
                        </h2>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        <HelpCircle className="w-4 h-4" /> Help
                    </button>
                </div>

                {/* Score & Checklist */}
                <div className="p-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-8 items-center mb-8">
                        {/* Circle */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="40" stroke={score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444'} strokeWidth="8" fill="none" strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold">{score}%</span>
                                <span className={`text-xs font-bold ${score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>Quality</span>
                            </div>
                        </div>
                        {/* Text */}
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Profile Completeness</h3>
                            <p className="text-sm text-gray-500 mb-3">Complete the following to improve online visibility:</p>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {[
                                    { l: 'Profession', c: !!formData.role },
                                    { l: 'Statement', c: !!formData.professionalStatement },
                                    { l: 'Appt Types', c: formData.appointmentTypes.some(a => a.enabled) }
                                ].map((i, idx) => (
                                    <span key={idx} className={`px-2 py-1 rounded border ${i.c ? 'bg-green-50 border-green-200 text-green-700 line-through' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                                        {i.l}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Basic Info */}
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <Label>Display Name</Label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => updateField('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Gender</Label>
                                    <select value={formData.gender} onChange={e => updateField('gender', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Profession</Label>
                                    <select value={formData.role} onChange={e => updateField('role', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none">
                                        <option value="">Select</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="Orthodontist">Orthodontist</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <Label>Qualifications</Label>
                                <input type="text" value={formData.qualification} onChange={e => updateField('qualification', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none" />
                            </div>
                        </div>

                        {/* Image & Statement */}
                        <div className="space-y-5">
                            <div className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Stethoscope className="w-10 h-10 text-gray-300" />
                                    )}
                                </div>
                                <label className="text-sm font-medium text-orange-600 cursor-pointer hover:underline">
                                    Upload Photo
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => updateField('imageUrl', ev.target?.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                            </div>
                            <div>
                                <Label>Professional Statement</Label>
                                <textarea rows={4} value={formData.professionalStatement} onChange={e => updateField('professionalStatement', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none resize-none" />
                            </div>
                            <div>
                                <Label info>Areas of Interest</Label>
                                <ProfessionalInterestsDropdown
                                    value={formData.areasOfInterest}
                                    onChange={(v) => updateField('areasOfInterest', v)}
                                    placeholder="Select interests..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appointment Types List */}
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="font-bold text-gray-900 mb-4">Appointment Types</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 w-16">On/Off</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Duration</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.appointmentTypes.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={app.enabled}
                                                    onChange={(e) => {
                                                        const updated = formData.appointmentTypes.map(t => t.id === app.id ? { ...t, enabled: e.target.checked } : t);
                                                        updateField('appointmentTypes', updated);
                                                    }}
                                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{app.patientType}</td>
                                            <td className="px-6 py-4 text-gray-600">{app.duration}m</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setEditingApptName(app.name)} className="text-orange-600 hover:text-orange-800 font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Editor Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleMainSave}
                            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 shadow-lg"
                        >
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
                        <p className="text-sm text-gray-500">Manage practitioners and staff.</p>
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition shadow-sm w-full sm:w-auto justify-center"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(member => (
                    <div
                        key={member.id}
                        onClick={() => startEdit(member)}
                        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-orange-400 hover:shadow-md transition group relative"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <Users className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate w-full">
                            {member.name || 'Unnamed Practitioner'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 truncate w-full">
                            {member.role || 'No Role Assigned'}
                        </p>
                        <div className="mt-auto w-full pt-4 border-t border-gray-100">
                            <span className="text-orange-600 text-sm font-medium flex items-center justify-center gap-1 group-hover:text-orange-700">
                                <Edit2 className="w-3 h-3" /> Edit Profile
                            </span>
                        </div>
                    </div>
                ))}

                {teamMembers.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No team members yet.</p>
                        <p className="text-sm text-gray-400">Click "Add Member" to get started.</p>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            {/* NAV FOOTER (Only shows on main list view) */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}