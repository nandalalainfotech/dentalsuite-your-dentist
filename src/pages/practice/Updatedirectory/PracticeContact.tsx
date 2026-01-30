import { useState } from 'react';
import {
    MapPin, Globe, Facebook, Instagram, Twitter, Youtube, Plus, Trash2, Minus, X, Phone, Clock, AlertCircle
} from 'lucide-react';
import type { Clinic } from '../../../types';

interface TimeSlot {
    id: string;
    start: string;
    end: string;
}

interface DayHours {
    isOpen: boolean;
    slots: TimeSlot[];
}

interface Exception {
    id: string;
    date: string;
    isClosed: boolean;
    startTime?: string;
    endTime?: string;
    label: string;
    note: string;
}

interface ContactFormData {
    address: string;
    suburb: string;
    directions: string;
    phone: string;
    email: string;
    website: string;
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
    exceptions: Exception[];
    alertMessage: string;
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
}

const parseTimeString = (timeStr: string): DayHours => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    if (!timeStr || timeStr === 'Closed') {
        return { isOpen: false, slots: [{ id: generateId(), start: '09:00', end: '17:00' }] };
    }

    const ranges = timeStr.split(',').map(r => r.trim());
    const slots = ranges.map(range => {
        const [start, end] = range.split('-');
        return { id: generateId(), start: start || '09:00', end: end || '17:00' };
    });

    return { isOpen: true, slots };
};

export default function PracticeContact({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {

    const [formData, setFormData] = useState<ContactFormData>({
        address: clinicData.address || '',
        suburb: 'Sydney',
        directions: '',
        phone: clinicData.phone || '',
        email: clinicData.email || '',
        website: clinicData.website || '',
        monday: parseTimeString(clinicData.time?.monday || '09:00-17:00'),
        tuesday: parseTimeString(clinicData.time?.tuesday || '09:00-17:00'),
        wednesday: parseTimeString(clinicData.time?.wednesday || '09:00-17:00'),
        thursday: parseTimeString(clinicData.time?.thursday || '09:00-17:00'),
        friday: parseTimeString(clinicData.time?.friday || '09:00-17:00'),
        saturday: parseTimeString(clinicData.time?.saturday || '09:00-14:00'),
        sunday: parseTimeString(clinicData.time?.sunday || 'Closed'),

        exceptions: [],
        alertMessage: '',

        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (field: keyof ContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayChange = (day: keyof ContactFormData, newDayHours: DayHours) => {
        handleInputChange(day, newDayHours);
    };

    const handleAddException = (newException: Exception) => {
        setFormData(prev => ({
            ...prev,
            exceptions: [...prev.exceptions, newException]
        }));
        setIsModalOpen(false);
    };

    const handleDeleteException = (id: string) => {
        setFormData(prev => ({
            ...prev,
            exceptions: prev.exceptions.filter(ex => ex.id !== id)
        }));
    };

    const handleSaveAndNext = () => {
        console.log('Saving Contact Data:', formData);
        onNext();
    };

    // --- JSX ---

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Phone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Contact & Hours</h2>
                    <p className="text-sm text-gray-500">Manage location, hours, and contact details.</p>
                </div>
            </div>

            {/* SECTION 1: CONTACT & LOCATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 border-b border-gray-100 pb-10">
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" /> Location Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none"
                            placeholder="123 Dental Street"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                            <input
                                type="text"
                                value={formData.suburb}
                                onChange={(e) => handleInputChange('suburb', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Directions / Parking</label>
                        <textarea
                            rows={3}
                            value={formData.directions}
                            onChange={(e) => handleInputChange('directions', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                            placeholder="e.g. Free parking available at the rear..."
                        />
                    </div>
                </div>

                {/* Interactive Map Placeholder */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-500" /> Map Preview
                    </h3>
                    <div className="w-full h-64 bg-gray-50 rounded-xl border border-gray-200 relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                            <MapPin className="w-10 h-10 text-orange-500 drop-shadow-md fill-orange-500 animate-bounce" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-xs rounded-full shadow-sm text-gray-500">
                            Map Visualization
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: HOURS */}
            <div className="mb-10 border-b border-gray-100 pb-10">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-orange-500" /> Opening Hours
                </h3>

                <div className="space-y-4 max-w-3xl">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <DayRow
                            key={day}
                            day={day.charAt(0).toUpperCase() + day.slice(1)}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            dayHours={(formData as any)[day]}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(newHours) => handleDayChange(day as any, newHours)}
                        />
                    ))}
                </div>
            </div>

            {/* SECTION 3: EXCEPTIONS */}
            <div className="mb-10 border-b border-gray-100 pb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" /> Exceptions & Holidays
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-orange-600 font-medium text-sm hover:bg-orange-50 px-3 py-1.5 rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" /> Add Exception
                    </button>
                </div>

                {formData.exceptions.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Note</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {formData.exceptions.map((ex) => (
                                    <tr key={ex.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{ex.date}</td>
                                        <td className="px-6 py-4">
                                            {ex.isClosed ? (
                                                <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold">Closed</span>
                                            ) : (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">{ex.startTime} - {ex.endTime}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{ex.label}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteException(ex.id)}
                                                className="text-gray-400 hover:text-orange-500 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 text-center">
                        No holiday hours or exceptions configured.
                    </div>
                )}
            </div>

            {/* SECTION 4: SOCIALS */}
            <div className="mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <Globe className="w-4 h-4 text-orange-500" /> Online Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SocialInput Icon={Facebook} color="text-blue-600" placeholder="Facebook URL" value={formData.facebook} onChange={(e) => handleInputChange('facebook', e.target.value)} />
                    <SocialInput Icon={Instagram} color="text-pink-600" placeholder="Instagram URL" value={formData.instagram} onChange={(e) => handleInputChange('instagram', e.target.value)} />
                    <SocialInput Icon={Twitter} color="text-sky-500" placeholder="Twitter URL" value={formData.twitter} onChange={(e) => handleInputChange('twitter', e.target.value)} />
                    <SocialInput Icon={Youtube} color="text-orange-600" placeholder="Youtube URL" value={formData.youtube} onChange={(e) => handleInputChange('youtube', e.target.value)} />
                </div>
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
                    className="px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 shadow-lg shadow-green-600/30 transition flex items-center gap-2"
                >
                    Finish & Publish
                </button>
            </div>

            {/* Add Exception Modal */}
            {isModalOpen && (
                <ExceptionModal onClose={() => setIsModalOpen(false)} onSave={handleAddException} />
            )}
        </div>
    );
}

const DayRow = ({ day, dayHours, onChange }: { day: string; dayHours: DayHours; onChange: (newHours: DayHours) => void; }) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleToggleOpen = (isOpen: boolean) => onChange({ ...dayHours, isOpen });

    const handleSlotChange = (slotId: string, field: 'start' | 'end', value: string) => {
        const updatedSlots = dayHours.slots.map(slot => slot.id === slotId ? { ...slot, [field]: value } : slot);
        onChange({ ...dayHours, slots: updatedSlots });
    };

    const handleAddSlot = () => {
        const lastSlot = dayHours.slots[dayHours.slots.length - 1];
        const newSlot: TimeSlot = { id: generateId(), start: lastSlot ? lastSlot.end : '13:00', end: '17:00' };
        onChange({ ...dayHours, slots: [...dayHours.slots, newSlot] });
    };

    const handleRemoveSlot = (slotId: string) => {
        if (dayHours.slots.length <= 1) return;
        const updatedSlots = dayHours.slots.filter(slot => slot.id !== slotId);
        onChange({ ...dayHours, slots: updatedSlots });
    };

    return (
        <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="w-32 flex items-center gap-3 pt-2">
                <input
                    type="checkbox"
                    checked={dayHours.isOpen}
                    onChange={(e) => handleToggleOpen(e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300 cursor-pointer"
                />
                <span className={`text-sm font-medium ${dayHours.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>
            </div>

            {dayHours.isOpen ? (
                <div className="flex-1 space-y-2">
                    {dayHours.slots.map((slot, index) => (
                        <div key={slot.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                                <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) => handleSlotChange(slot.id, 'start', e.target.value)}
                                    className="bg-transparent text-sm w-24 outline-none text-gray-700"
                                />
                                <span className="text-gray-400 text-xs">TO</span>
                                <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => handleSlotChange(slot.id, 'end', e.target.value)}
                                    className="bg-transparent text-sm w-24 outline-none text-gray-700"
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                {dayHours.slots.length > 1 && (
                                    <button onClick={() => handleRemoveSlot(slot.id)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                )}
                                {index === dayHours.slots.length - 1 && (
                                    <button onClick={handleAddSlot} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-full transition">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="pt-2 text-sm text-gray-400 italic">Closed</div>
            )}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialInput = ({ Icon, color, placeholder, value, onChange }: { Icon: any; color: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <input
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-1 focus:ring-orange-500 outline-none transition"
        />
    </div>
);

const ExceptionModal = ({ onClose, onSave }: { onClose: () => void, onSave: (ex: Exception) => void }) => {
    const [date, setDate] = useState('');
    const [isClosed, setIsClosed] = useState(true);
    const [label, setLabel] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const handleSave = () => {
        if (!date) return;
        const newException: Exception = {
            id: Math.random().toString(36).substr(2, 9),
            date,
            isClosed,
            startTime: isClosed ? undefined : startTime,
            endTime: isClosed ? undefined : endTime,
            label,
            note: ''
        };
        onSave(newException);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Add Exception / Holiday</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 mb-2">
                            <input type="checkbox" checked={isClosed} onChange={(e) => setIsClosed(e.target.checked)} className="rounded text-orange-500" />
                            <span className="text-sm font-medium">Closed All Day</span>
                        </label>
                        {!isClosed && (
                            <div className="flex gap-2">
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="px-2 py-1 border rounded" />
                                <span className="pt-1">-</span>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="px-2 py-1 border rounded" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input type="text" placeholder="e.g. Christmas Day" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Save Exception</button>
                </div>
            </div>
        </div>
    );
};