import { useState } from 'react';
import {
    MapPin, Globe, Facebook, Instagram, Twitter, Youtube, Save,
    Info, Plus, Trash2, Minus, X
} from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

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
    practiceType: 'in-person' | 'telehealth';
    address: string;
    suburb: string;
    postalCode: string;
    directions: string;

    // Contact
    phone: string;
    email: string;
    website: string;

    // Hours - Now using DayHours structure
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

// Helper to parse old format "09:00-17:00" or "Closed" to new format
const parseTimeString = (timeStr: string): DayHours => {
    if (!timeStr || timeStr === 'Closed') {
        return { isOpen: false, slots: [{ id: generateId(), start: '09:00', end: '17:00' }] };
    }

    // Handle multiple time ranges separated by comma
    const ranges = timeStr.split(',').map(r => r.trim());
    const slots = ranges.map(range => {
        const [start, end] = range.split('-');
        return { id: generateId(), start: start || '09:00', end: end || '17:00' };
    });

    return { isOpen: true, slots };
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Convert DayHours back to string format for display/storage
const formatDayHours = (dayHours: DayHours): string => {
    if (!dayHours.isOpen) return 'Closed';
    return dayHours.slots.map(slot => `${slot.start}-${slot.end}`).join(', ');
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function PracticeContact({ clinicData }: { clinicData: Clinic }) {
    // --- State ---
    const [formData, setFormData] = useState<ContactFormData>({
        practiceType: 'in-person',
        address: clinicData.address || '105/4 Henshall way',
        suburb: 'Macquarie',
        postalCode: '2000',
        directions: 'Parking is available in the Jamison Shopping Centre.',
        phone: clinicData.phone || '',
        email: clinicData.email || '',
        website: clinicData.website || '',

        // Hours - Using new structure
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

    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Handlers ---

    const handleInputChange = (field: keyof ContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    // Updated handler for day hours
    const handleDayChange = (day: keyof ContactFormData, newDayHours: DayHours) => {
        handleInputChange(day, newDayHours);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Log the formatted data for debugging
        console.log('Saving hours:', {
            monday: formatDayHours(formData.monday),
            tuesday: formatDayHours(formData.tuesday),
            wednesday: formatDayHours(formData.wednesday),
            thursday: formatDayHours(formData.thursday),
            friday: formatDayHours(formData.friday),
            saturday: formatDayHours(formData.saturday),
            sunday: formatDayHours(formData.sunday),
        });

        setHasChanges(false);
        setIsSaving(false);
    };

    // --- Exception Logic ---

    const handleAddException = (newException: Exception) => {
        setFormData(prev => ({
            ...prev,
            exceptions: [...prev.exceptions, newException]
        }));
        setHasChanges(true);
        setIsModalOpen(false);
    };

    const handleDeleteException = (id: string) => {
        setFormData(prev => ({
            ...prev,
            exceptions: prev.exceptions.filter(ex => ex.id !== id)
        }));
        setHasChanges(true);
    };

    // --- JSX ---

    return (
        <div className="max-w-6xl mx-auto pb-20 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Practice Location</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your location, hours, and contact details.</p>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* Part 1: Location Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Left Col: Inputs */}
                <div className="space-y-6">
                    {/* Address Fields */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Suburb</label>
                        <div className="relative">
                            <select
                                value={formData.suburb}
                                onChange={(e) => handleInputChange('suburb', e.target.value)}
                                className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none appearance-none bg-white"
                            >
                                <option value="Macquarie">Macquarie</option>
                                <option value="Sydney">Sydney</option>
                                <option value="Melbourne">Melbourne</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Directions and Parking</label>
                        <textarea
                            rows={4}
                            value={formData.directions}
                            onChange={(e) => handleInputChange('directions', e.target.value)}
                            className="w-full px-3 py-2.5 rounded border border-gray-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none"
                        />
                    </div>
                </div>

                {/* Right Col: Map */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-700">Map Location</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                            This map will display on your bookings page. Search for your location and then select an address from the dropdown.
                        </p>

                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Enter a location"
                                className="w-full px-3 py-2.5 pl-4 rounded border border-gray-300 text-sm focus:border-orange-500 outline-none"
                            />
                        </div>

                        <button className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 mb-3">
                            Use my Street Address <Info className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Fake Map Embed */}
                    <div className="w-full h-64 bg-blue-50 rounded-lg border border-gray-200 relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gray-200/50 rounded-full blur-xl"></div>
                        <div className="absolute top-10 left-0 w-full h-3 bg-white border-y border-gray-200 rotate-12"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                            <MapPin className="w-10 h-10 text-red-500 drop-shadow-md fill-red-500" />
                        </div>
                        <div className="absolute bottom-1 left-1 bg-white/80 px-1 text-[10px] text-gray-500">Google</div>
                    </div>
                </div>
            </div>

            {/* Part 2: Opening Hours */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-bold text-gray-700">Opening Hours</h3>
                </div>
            </div>
            <div className="space-y-3">
                <DayRow
                    day="Monday"
                    dayHours={formData.monday}
                    onChange={(newHours) => handleDayChange('monday', newHours)}
                />
                <DayRow
                    day="Tuesday"
                    dayHours={formData.tuesday}
                    onChange={(newHours) => handleDayChange('tuesday', newHours)}
                />
                <DayRow
                    day="Wednesday"
                    dayHours={formData.wednesday}
                    onChange={(newHours) => handleDayChange('wednesday', newHours)}
                />
                <DayRow
                    day="Thursday"
                    dayHours={formData.thursday}
                    onChange={(newHours) => handleDayChange('thursday', newHours)}
                />
                <DayRow
                    day="Friday"
                    dayHours={formData.friday}
                    onChange={(newHours) => handleDayChange('friday', newHours)}
                />
                <DayRow
                    day="Saturday"
                    dayHours={formData.saturday}
                    onChange={(newHours) => handleDayChange('saturday', newHours)}
                />
                <DayRow
                    day="Sunday"
                    dayHours={formData.sunday}
                    onChange={(newHours) => handleDayChange('sunday', newHours)}
                />
            </div>


            {/* Part 2.5: Exceptions & Alert */}
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

            {/* Part 3: Social Media Links */}
            <div className="border-t border-gray-100 pt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 mb-6">
                    <Globe className="w-4 h-4 text-orange-500" /> Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SocialInput
                        Icon={Facebook}
                        color="text-blue-600"
                        placeholder="Facebook URL"
                        value={formData.facebook}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                    />
                    <SocialInput
                        Icon={Instagram}
                        color="text-pink-600"
                        placeholder="Instagram URL"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                    />
                    <SocialInput
                        Icon={Twitter}
                        color="text-sky-500"
                        placeholder="Twitter URL"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                    />
                    <SocialInput
                        Icon={Youtube}
                        color="text-red-600"
                        placeholder="Youtube URL"
                        value={formData.youtube}
                        onChange={(e) => handleInputChange('youtube', e.target.value)}
                    />
                </div>
            </div>

            {/* Add Exception Modal */}
            {isModalOpen && (
                <ExceptionModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddException}
                />
            )}
        </div>
    );
}

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

// ----------------------------------------------------------------------
// Updated DayRow Component with Multiple Time Slots
// ----------------------------------------------------------------------

const DayRow = ({ day, dayHours, onChange }: {
    day: string;
    dayHours: DayHours;
    onChange: (newHours: DayHours) => void;
}) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Toggle day open/closed
    const handleToggleOpen = (isOpen: boolean) => {
        onChange({
            ...dayHours,
            isOpen,
        });
    };

    // Update a specific time slot
    const handleSlotChange = (slotId: string, field: 'start' | 'end', value: string) => {
        const updatedSlots = dayHours.slots.map(slot =>
            slot.id === slotId ? { ...slot, [field]: value } : slot
        );
        onChange({ ...dayHours, slots: updatedSlots });
    };

    // Add a new time slot
    const handleAddSlot = () => {
        const lastSlot = dayHours.slots[dayHours.slots.length - 1];
        const newSlot: TimeSlot = {
            id: generateId(),
            start: lastSlot ? lastSlot.end : '13:00',
            end: '17:00'
        };
        onChange({
            ...dayHours,
            slots: [...dayHours.slots, newSlot]
        });
    };

    // Remove a time slot
    const handleRemoveSlot = (slotId: string) => {
        if (dayHours.slots.length <= 1) return; // Keep at least one slot
        const updatedSlots = dayHours.slots.filter(slot => slot.id !== slotId);
        onChange({ ...dayHours, slots: updatedSlots });
    };

    return (
        <div className="py-2 last:border-0">
            <div className="flex items-start gap-4">
                {/* Day name and toggle */}
                <div className="w-32 flex items-center gap-3 pt-1.5">
                    <input
                        type="checkbox"
                        checked={dayHours.isOpen}
                        onChange={(e) => handleToggleOpen(e.target.checked)}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">{day}</span>
                </div>

                {/* Time slots or Closed */}
                {dayHours.isOpen ? (
                    <div className="flex-1 space-y-2">
                        {dayHours.slots.map((slot, index) => (
                            <div key={slot.id} className="flex items-center gap-2 group">
                                {/* Time inputs */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={slot.start}
                                        onChange={(e) => handleSlotChange(slot.id, 'start', e.target.value)}
                                        className="px-2 py-1.5 rounded border border-gray-300 text-sm w-28 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                    <span className="text-sm text-gray-400">to</span>
                                    <input
                                        type="time"
                                        value={slot.end}
                                        onChange={(e) => handleSlotChange(slot.id, 'end', e.target.value)}
                                        className="px-2 py-1.5 rounded border border-gray-300 text-sm w-28 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1">

                                    {/* Add button – show ONLY when there is 1 slot */}
                                    {dayHours.slots.length === 1 && (
                                        <button
                                            onClick={handleAddSlot}
                                            className="p-1 text-blue-500 hover:bg-blue-50 rounded-full border border-blue-200 transition"
                                            title="Add another time slot"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )}

                                    {/* Remove button – show ONLY when extra slot exists */}
                                    {dayHours.slots.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveSlot(slot.id)}
                                            className="p-1 text-white bg-red-500 rounded-full border border-red-600 transition"
                                            title="Remove this time slot"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    )}

                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 py-2">Closed</div>
                )}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Social Input Component
// ----------------------------------------------------------------------

const SocialInput = ({ Icon, color, placeholder, value, onChange }: {
    Icon: any;
    color: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <input
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
        />
    </div>
);