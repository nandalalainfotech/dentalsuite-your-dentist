import { useState, type ChangeEvent, type ComponentType, } from 'react';
import {
    MapPin, Globe, Facebook, Instagram, Twitter, Youtube,
    Plus, Trash2, X, Clock, Phone, Mail, Navigation,
} from 'lucide-react';
import type { Clinic } from '../../../types';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------

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
    // Location
    address: string;
    suburb: string;
    postalCode: string;
    directions: string;

    // Contact
    phone: string;
    email: string;
    website: string;

    // Hours
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;

    // Exceptions & Alerts
    exceptions: Exception[];
    alertMessage: string;

    // Socials
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
}

// ----------------------------------------------------------------------
// Helper Functions for Time Parsing
// ----------------------------------------------------------------------

// Generate unique ID
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Convert 12-hour time format (e.g., "9:00 AM") to 24-hour format (e.g., "09:00")
const convertTo24Hour = (time12h: string): string => {
    if (!time12h) return '09:00';

    const timeStr = time12h.trim();

    // If already in 24-hour format (no AM/PM)
    if (!timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
        // Ensure proper formatting (e.g., "9:00" -> "09:00")
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes || '00'}`;
    }

    const isPM = timeStr.toLowerCase().includes('pm');
    const cleanTime = timeStr.replace(/[aApP][mM]/g, '').trim();
    const [hours, minutes] = cleanTime.split(':').map(s => s.trim());

    let hour = parseInt(hours, 10);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
};

// Parse time string from clinic data to DayHours object
const parseTimeString = (timeStr: string | undefined): DayHours => {
    // Handle closed or empty cases
    if (!timeStr || timeStr.toLowerCase() === 'closed' || timeStr.toLowerCase() === 'close') {
        return {
            isOpen: false,
            slots: [{ id: generateId(), start: '09:00', end: '17:00' }]
        };
    }

    // Handle multiple time ranges (e.g., "9:00 AM - 12:00 PM, 2:00 PM - 5:00 PM")
    const ranges = timeStr.split(',').map(r => r.trim());

    const slots: TimeSlot[] = ranges.map(range => {
        // Split by '-' handling various formats with or without spaces
        const parts = range.split(/\s*[-–]\s*/);

        if (parts.length >= 2) {
            const start = convertTo24Hour(parts[0]);
            const end = convertTo24Hour(parts[1]);
            return {
                id: generateId(),
                start,
                end
            };
        }

        // Fallback for malformed data
        return { id: generateId(), start: '09:00', end: '17:00' };
    });

    return { isOpen: true, slots };
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function PracticeContact({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    // --- State ---
    const [formData, setFormData] = useState<ContactFormData>(() => {
        // Parse clinic time data on initialization
        const timeData = clinicData.time || {};

        return {
            address: clinicData.address || '',
            suburb: 'Macquarie', // Mock default
            postalCode: '2000',
            directions: '',
            phone: clinicData.phone || '',
            email: clinicData.email || '',
            website: clinicData.website || '',
            monday: parseTimeString(timeData.monday),
            tuesday: parseTimeString(timeData.tuesday),
            wednesday: parseTimeString(timeData.wednesday),
            thursday: parseTimeString(timeData.thursday),
            friday: parseTimeString(timeData.friday),
            saturday: parseTimeString(timeData.saturday),
            sunday: parseTimeString(timeData.sunday),
            exceptions: [],
            alertMessage: '',
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Handlers ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (field: keyof ContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayChange = (day: keyof ContactFormData, newDayHours: DayHours) => {
        handleInputChange(day, newDayHours);
    };

    const handleAddException = (newException: Exception) => {
        setFormData(prev => ({ ...prev, exceptions: [...prev.exceptions, newException] }));
        setIsModalOpen(false);
    };

    const handleDeleteException = (id: string) => {
        setFormData(prev => ({ ...prev, exceptions: prev.exceptions.filter(ex => ex.id !== id) }));
    };

    const handleSaveAndNext = () => {
        console.log('Saving Data:', formData);
        onNext();
    };

    // --- Common Input Styles ---
    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition text-gray-700 bg-white";
    const labelClasses = "text-sm font-medium text-gray-700 block mb-2";

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Practice Details</h2>
                    <p className="text-sm text-gray-500">Manage location, contact info, and hours.</p>
                </div>
            </div>

            {/* 1. LOCATION & MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="space-y-5">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-orange-500" /> Location
                    </h3>

                    <div>
                        <label className={labelClasses}>Street Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={inputClasses}
                            placeholder="e.g. 123 Health St"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Suburb</label>
                            <input
                                type="text"
                                value={formData.suburb}
                                onChange={(e) => handleInputChange('suburb', e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Postcode</label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Directions / Parking Info</label>
                        <textarea
                            rows={3}
                            value={formData.directions}
                            onChange={(e) => handleInputChange('directions', e.target.value)}
                            className={`${inputClasses} resize-none`}
                            placeholder="Help patients find you..."
                        />
                    </div>
                </div>

                {/* Visual Map Placeholder */}
                <div className="flex flex-col h-full pt-11">
                    <div className="flex-1 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden group min-h-[250px]">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                            <MapPin className="w-12 h-12 text-red-500 drop-shadow-lg fill-red-500 animate-bounce" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                            Map Preview
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* 2. OPENING HOURS */}
            <div className="mb-10">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-orange-500" /> Opening Hours
                </h3>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="space-y-1">
                        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                            <DayRow
                                key={day}
                                day={day.charAt(0).toUpperCase() + day.slice(1)}
                                dayHours={formData[day]}
                                originalTime={clinicData.time?.[day]}
                                onChange={(newHours) => handleDayChange(day, newHours)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. EXCEPTIONS & ALERTS */}
            <div className="space-y-8 mb-12 pt-8">
                {/* Exceptions */}
                <div>
                    <h3 className="text-base font-bold text-gray-700 mb-2">Exceptions</h3>
                    <p className="text-sm text-gray-500 mb-4">Add Public Holiday closures or any other exception to your clinic's opening hours.</p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-4 flex items-center gap-2 text-orange-500 font-bold text-sm border border-orange-500 rounded px-3 py-1.5 hover:bg-orange-50 transition"
                    >
                        <Plus className="w-4 h-4" /> Add exception
                    </button>

                    {formData.exceptions.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white border-b border-gray-200 text-gray-700 font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Opening Hours</th>
                                        <th className="px-4 py-3">Label</th>
                                        <th className="px-4 py-3">Note</th>
                                        <th className="px-4 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {formData.exceptions.map((ex) => (
                                        <tr key={ex.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600">{ex.date}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {ex.isClosed ? 'Closed' : `${ex.startTime} - ${ex.endTime}`}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{ex.label}</td>
                                            <td className="px-4 py-3 text-gray-600">{ex.note}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteException(ex.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Alert Message */}
                <div>
                    <h3 className="text-base font-bold text-gray-700 mb-2">Alert Message</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <p className="text-sm text-gray-500">
                            Display a short message about any important changes at your practice (e.g. a new policy, temporary closure or holidays).
                        </p>
                        <textarea
                            rows={3}
                            value={formData.alertMessage}
                            onChange={(e) => handleInputChange('alertMessage', e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 outline-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* 4. CONTACT & SOCIALS */}
            <div className="space-y-6 mb-10">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-500" /> Online Presence
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`${inputClasses} pl-12`}
                                placeholder="(02) 0000 0000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`${inputClasses} pl-12`}
                                placeholder="clinic@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Website</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className={`${inputClasses} pl-12`}
                                placeholder="www.clinic.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <SocialInput Icon={Facebook} color="text-blue-600" placeholder="Facebook URL" value={formData.facebook} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('facebook', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Instagram} color="text-pink-600" placeholder="Instagram URL" value={formData.instagram} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('instagram', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Twitter} color="text-sky-500" placeholder="Twitter URL" value={formData.twitter} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('twitter', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Youtube} color="text-red-600" placeholder="Youtube URL" value={formData.youtube} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('youtube', e.target.value)} inputClasses={inputClasses} />
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

            {/* MODAL */}
            {isModalOpen && (
                <ExceptionModal onClose={() => setIsModalOpen(false)} onSave={handleAddException} />
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialInput = ({ Icon, color, placeholder, value, onChange, inputClasses }: { Icon: ComponentType<any>, color: string, placeholder: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, inputClasses: string }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <input
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${inputClasses} pl-12`}
        />
    </div>
);

const DayRow = ({
    day,
    dayHours,
    onChange
}: {
    day: string;
    dayHours: DayHours;
    originalTime?: string;
    onChange: (newHours: DayHours) => void;
}) => {
    const handleToggleOpen = (isOpen: boolean) => onChange({ ...dayHours, isOpen });

    const handleSlotChange = (slotId: string, field: 'start' | 'end', value: string) => {
        const updatedSlots = dayHours.slots.map(slot =>
            slot.id === slotId ? { ...slot, [field]: value } : slot
        );
        onChange({ ...dayHours, slots: updatedSlots });
    };

    return (
        <div className="flex items-start justify-between py-3 border-b border-gray-200 last:border-0 rounded-lg px-2 transition">
            <div className="flex items-center gap-3 w-32 pt-1.5">
                <input
                    type="checkbox"
                    checked={dayHours.isOpen}
                    onChange={(e) => handleToggleOpen(e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300 cursor-pointer"
                />
                <span className={`text-sm font-medium ${dayHours.isOpen ? 'text-gray-800' : 'text-gray-400'}`}>
                    {day}
                </span>
            </div>

            <div className="flex-1 flex justify-end">
                {dayHours.isOpen ? (
                    <div className="space-y-2">
                        {dayHours.slots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) => handleSlotChange(slot.id, 'start', e.target.value)}
                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <span className="text-gray-400 text-xs">-</span>
                                <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => handleSlotChange(slot.id, 'end', e.target.value)}
                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-red-600 font-medium py-1.5 px-3 bg-red-100 rounded-lg">
                        Closed
                    </span>
                )}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Exception Modal Component
// ----------------------------------------------------------------------

const ExceptionModal = ({ onClose, onSave }: { onClose: () => void, onSave: (ex: Exception) => void }) => {
    const [date, setDate] = useState('');
    const [isClosed, setIsClosed] = useState(true);
    const [label, setLabel] = useState('');
    const [note, setNote] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const handleSave = () => {
        if (!date) return;

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-GB').replace(/\//g, '-');

        const newException: Exception = {
            id: Math.random().toString(36).substr(2, 9),
            date: formattedDate,
            isClosed,
            startTime: isClosed ? undefined : startTime,
            endTime: isClosed ? undefined : endTime,
            label,
            note
        };
        onSave(newException);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Edit Opening Hours</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-gray-600 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Opening Hours</label>
                        <div className="h-[42px] flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isClosed}
                                    onChange={(e) => setIsClosed(e.target.checked)}
                                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Closed</span>
                            </label>
                        </div>

                        {!isClosed && (
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="px-2 py-1.5 rounded border border-gray-300 text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="px-2 py-1.5 rounded border border-gray-300 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                            Label
                        </label>
                        <input
                            type="text"
                            placeholder="(e.g. New Year's Day)"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                            Note
                        </label>
                        <input
                            type="text"
                            placeholder="(e.g. Early close)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2.5 rounded bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};