import React, { useState } from 'react';
import {
    Users, Edit2, ArrowLeft, HelpCircle,
    Info, RefreshCw, Stethoscope, Check,
    ChevronRight, X,
} from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

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
    <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-6 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
        <Check className="w-5 h-5 text-green-400" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-gray-300"><X className="w-4 h-4" /></button>
    </div>
);

const Label = ({ children, info }: { children: React.ReactNode, info?: boolean }) => (
    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
        {children}
        {info && <Info className="w-4 h-4 text-blue-500 fill-current opacity-80" />}
    </label>
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
        <div className=" mx-auto bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center py-5">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 font-medium">
                        <ArrowLeft className="w-4 h-4" /> <span className="text-lg">Back</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <h1 className="text-2xl text-gray-800">
                        Edit <span className="font-bold">"{appointmentName}"</span> settings for {practitionerName}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-600">
                        <HelpCircle className="w-4 h-4" /> Need Help?
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-orange-500 text-white rounded shadow-sm font-medium hover:bg-orange-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Content Box */}
            <div className="bg-white border border-gray-200 rounded shadow-sm">
                <div className="border-b border-gray-200 flex items-center">
                    <div className="px-6 py-4 font-bold text-gray-800 text-sm border-b-2 border-transparent">
                        Practitioners Settings
                    </div>
                    <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded flex items-center gap-2 text-sm font-medium ml-2">
                        <Info className="w-4 h-4" />
                        Editing this appointment type will not affect any other practitioners
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2">
                    <div className="border-r border-gray-200 pr-8">
                        <h3 className="font-bold text-gray-800 mb-4">Existing Patients</h3>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={existingEnabled}
                                onChange={(e) => setExistingEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-gray-700">Available online</span>
                        </label>
                    </div>

                    <div className="pl-8">
                        <h3 className="font-bold text-gray-800 mb-4">New Patients</h3>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={newEnabled}
                                onChange={(e) => setNewEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-gray-700">Available online</span>
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
    const startEdit = (member: TeamMember) => {
        setFormData(JSON.parse(JSON.stringify(member)));
        setEditingId(member.id);
        window.scrollTo(0, 0);
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

        setToast(`Profile for ${finalData.name} saved successfully.`);
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
            <div className=" mx-auto bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-center py-5">
                    <div className="flex items-center gap-3">
                        <button onClick={handleMainBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 font-medium">
                            <ArrowLeft className="w-5 h-5" /> <span className="text-lg">Back</span>
                        </button>
                        <div className="h-6 w-px bg-gray-300 mx-1"></div>
                        <h1 className="text-2xl font-bold text-gray-800">Edit {formData.name || 'Practitioner'}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-600">
                            <HelpCircle className="w-4 h-4" /> Need Help?
                        </button>
                    </div>
                </div>

                {/* Score Card */}
                <div className="bg-white rounded border border-gray-200 p-6 mb-6 flex flex-col md:flex-row gap-8 shadow-sm">
                    <div className="flex-shrink-0 flex items-center justify-center pl-2">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="40" stroke="#f87171" strokeWidth="8" fill="none"
                                    strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
                                <span className="text-2xl font-bold">{score} <span className="text-sm">%</span></span>
                                <span className="text-xs font-semibold text-red-500">Poor</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-r border-gray-100 pr-6">
                        <h3 className="font-bold text-lg mb-1">{formData.name || 'Practitioner'}'s Profile</h3>
                        <p className="text-gray-500 text-sm">Please fill out the following fields as required.</p>
                    </div>
                    <div className="flex-1 pl-2">
                        <p className="text-gray-600 text-sm mb-3">Add this information to complete this Practitioner Profile:</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {[
                                { label: 'Profession', check: !!formData.role },
                                { label: 'Professional Statement', check: !!formData.professionalStatement },
                                { label: 'Appointment Types', check: formData.appointmentTypes.some(a => a.enabled) }
                            ].map((item, i) => (
                                <button key={i} className={`text-left flex items-center gap-1 hover:underline ${item.check ? 'text-gray-400 line-through' : 'text-emerald-600 font-medium'}`}>
                                    {item.label} {!item.check && <ChevronRight className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded border border-gray-200 shadow-sm mb-6">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">Practitioner Profile</h2></div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <Label>Display Name</Label>
                                <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm outline-none" />
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-1.5"><Label info>Link to Core Practice</Label><button className="text-xs border px-2 py-1 rounded bg-white"><RefreshCw className="w-3 h-3 inline" /> Refresh</button></div>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm bg-white"><option>Select a Practitioner</option></select>
                            </div>
                            <div><Label>Gender</Label><select className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm bg-white"><option>Select</option></select></div>
                            <div>
                                <Label>Profession</Label>
                                <select value={formData.role} onChange={e => updateField('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm bg-white">
                                    <option value="">Select a profession</option><option value="Dentist">Dentist</option>
                                </select>
                            </div>
                            <div>
                                <Label>AHPRA Registration Number</Label>
                                <input type="text" value={formData.ahpra} onChange={e => updateField('ahpra', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm outline-none" />
                            </div>
                            <div>
                                <Label>Qualifications</Label>
                                <input type="text" value={formData.qualification} onChange={e => updateField('qualification', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm outline-none" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4"><div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border"><Stethoscope className="w-8 h-8 text-gray-400" /></div><button className="px-4 py-2 border bg-white rounded shadow-sm text-sm">Choose Image</button></div>
                            <div><Label>Professional Statement</Label><textarea rows={6} value={formData.professionalStatement} onChange={e => updateField('professionalStatement', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm outline-none text-sm"></textarea></div>
                            <div><Label info>Professional Areas of Interest</Label><p className="text-xs text-gray-500 mb-1">e.g.: Women's health</p><select className="w-full px-3 py-2 border border-gray-300 rounded bg-white"><option>Type or select</option></select></div>
                        </div>
                    </div>
                </div>

                {/* Booking Settings */}
                <div className="bg-white rounded border border-gray-200 shadow-sm mb-6 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/50 flex items-center gap-2">
                        <span className="font-bold text-gray-800">Online Bookings Settings</span>
                        <div className="flex items-center gap-1.5 text-blue-600 text-sm"><Info className="w-4 h-4" /> Link practitioner to Core Practice</div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3"><input type="checkbox" checked={formData.isVisibleOnline} onChange={e => updateField('isVisibleOnline', e.target.checked)} className="w-5 h-5 border-gray-300 text-orange-500 rounded" /> <span className="text-gray-700 text-sm">Visible for Online Bookings <Info className="inline w-3 h-3 text-gray-400" /></span></label>
                            <label className="flex items-start gap-3"><input type="checkbox" checked={formData.allowMultipleBookings} onChange={e => updateField('allowMultipleBookings', e.target.checked)} className="w-5 h-5 border-gray-300 text-orange-500 rounded mt-0.5" /> <span className="text-gray-700 text-sm">Allow multiple bookings</span></label>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600"><span>Book until</span><input type="number" className="w-12 border p-1 rounded text-center" defaultValue="0" /><select className="border p-1 rounded bg-white"><option>mins</option></select><span>before</span></div>
                            <div className="flex items-center gap-2 text-sm text-gray-600"><span>Cancel until</span><input type="number" className="w-12 border p-1 rounded text-center" defaultValue="0" /><select className="border p-1 rounded bg-white"><option>mins</option></select><span>before</span></div>
                        </div>
                    </div>
                </div>

                {/* Appointment Table */}
                <div className="bg-white rounded border border-gray-200 shadow-sm mb-10">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-bold text-gray-800">Appointment Types for {formData.name}</h3>
                        <div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-600">Apply Template:</span><select className="text-sm border rounded pl-2 pr-8 py-1 bg-white"><option>Copy from Practitioner</option></select></div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-600 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 w-20">Enabled</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Patient Type</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">T&C</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {formData.appointmentTypes.map((app, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4"><input type="checkbox" checked={app.enabled} readOnly className="w-5 h-5 rounded border-gray-300 text-orange-500" /></td>
                                        <td className="px-6 py-4 text-gray-800">{app.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.patientType}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.duration} mins</td>
                                        <td className="px-6 py-4 text-gray-400">-</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setEditingApptName(app.name)}
                                                className="px-6 py-1 border border-blue-400 text-blue-600 rounded bg-white hover:bg-blue-50 font-semibold text-xs transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Save Button Footer Inside the Appointment Card */}
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/30">
                        <button onClick={handleMainSave} className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded shadow-sm transition">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" mx-auto min-h-screen">
            <SectionHeader
                title="Practice Team"
                desc="Manage your team members and their settings."
                actionLabel="Add Member"
                onActionClick={() => {
                    const newId = `new-${Date.now()}`;
                    const newMember: TeamMember = {
                        id: newId, name: '', role: '', qualification: '', gender: '', ahpra: '', education: '', languages: '', professionalStatement: '', areasOfInterest: '', isVisibleOnline: false, allowMultipleBookings: true, bookingTimeLimit: 0, bookingTimeLimitUnit: 'minutes', cancelTimeLimit: 0, cancelTimeLimitUnit: 'minutes', appointmentTypes: JSON.parse(JSON.stringify(defaultAppointmentTypes))
                    };
                    setTeamMembers(prev => [...prev, newMember]);
                    startEdit(newMember);
                }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map(member => (
                    <div key={member.id} onClick={() => startEdit(member)} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all group relative">
                        <div className="w-20 h-20 rounded-full bg-gray-50 mb-4 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-gray-100"><Users className="w-8 h-8 text-gray-400" /></div>
                        <h3 className="font-bold text-gray-800 text-lg">{member.name || 'Unnamed'}</h3>
                        <p className="text-gray-500 text-sm mb-4">{member.role || 'No Role'}</p>
                        <div className="mt-auto w-full pt-4 border-t border-gray-100 flex justify-center"><span className="text-blue-600 text-sm font-medium flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit Profile</span></div>
                    </div>
                ))}
            </div>
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}