import { useState, useEffect, type ChangeEvent } from 'react';
import {
    MapPin, Globe, Facebook, Instagram, Twitter, Youtube,
    Plus, Trash2, X, Clock, Phone, Mail, Navigation, Save, Calendar, Loader2
} from 'lucide-react';
import toast from "react-hot-toast";

// Redux Imports
import { useAppDispatch } from '../../../../store/hooks';
import { 
    updateDirectoryInfo, 
    updateDirectoryOpeningHours, 
    updateDirectoryExceptions, 
    fetchDirectory 
} from '../../../../features/directory/directory.slice';
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------

interface TimeSlot { id: string; start: string; end: string; }
interface DayHours { isOpen: boolean; slots: TimeSlot[]; }
interface Exception { id: string; date: string; isClosed: boolean; startTime?: string; endTime?: string; label: string; note: string; }

interface ContactFormData {
    address: string; suburb: string; zipcode: string; directions: string;
    phone: string; email: string; website: string;
    monday: DayHours; tuesday: DayHours; wednesday: DayHours; thursday: DayHours; friday: DayHours; saturday: DayHours; sunday: DayHours;
    exceptions: Exception[]; alertMessage: string;
    facebook: string; instagram: string; twitter: string; youtube: string;
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const generateId = (): string => Math.random().toString(36).substr(2, 9);
const defaultDay = (): DayHours => ({ isOpen: false, slots: [{ id: generateId(), start: '09:00', end: '17:00' }] });

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function PracticeContact({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Provide default empty state until DB data loads
    const [formData, setFormData] = useState<ContactFormData>({
        address: '', suburb: '', zipcode: '', directions: '', phone: '', email: '', website: '',
        monday: defaultDay(), tuesday: defaultDay(), wednesday: defaultDay(), thursday: defaultDay(),
        friday: defaultDay(), saturday: defaultDay(), sunday: defaultDay(),
        exceptions: [], alertMessage: '', facebook: '', instagram: '', twitter: '', youtube: ''
    });

    // Populate data from DB
    useEffect(() => {
        if (!clinicData) return;

        // Extract Day helper
        const getDay = (dayName: string): DayHours => {
            const found = clinicData.practice_opening_hours?.find(h => h.day_of_week.toLowerCase() === dayName.toLowerCase());
            if (!found) return defaultDay();
            return {
                isOpen: found.is_open,
                slots: Array.isArray(found.time_slots) && found.time_slots.length > 0 
                    ? found.time_slots 
                    : [{ id: generateId(), start: '09:00', end: '17:00' }]
            };
        };

        setFormData({
            address: clinicData.address || '',
            suburb: clinicData.city || '',
            zipcode: clinicData.postcode || '',
            directions: clinicData.directions || '',
            phone: clinicData.practice_phone || '',
            email: clinicData.email || '',
            website: clinicData.website || '',
            monday: getDay('monday'),
            tuesday: getDay('tuesday'),
            wednesday: getDay('wednesday'),
            thursday: getDay('thursday'),
            friday: getDay('friday'),
            saturday: getDay('saturday'),
            sunday: getDay('sunday'),
            exceptions: clinicData.practice_exceptions?.map(e => ({
                id: e.id,
                date: e.exception_date,
                isClosed: e.is_closed,
                startTime: e.start_time || undefined,
                endTime: e.end_time || undefined,
                label: e.label || '',
                note: e.note || ''
            })) || [],
            alertMessage: clinicData.alert_message || '',
            facebook: clinicData.facebook_url || '',
            instagram: clinicData.instagram_url || '',
            twitter: clinicData.twitter_url || '',
            youtube: clinicData.youtube_url || ''
        });
    }, [clinicData]);

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

    const handleSaveAndNext = async () => {
        setIsSaving(true);
        try {
            // 1. Prepare Base Info Payload
            const baseInfoPromise = dispatch(updateDirectoryInfo({
                id: clinicData.id,
                data: {
                    address: formData.address,
                    postcode: formData.zipcode,
                    practice_phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                    directions: formData.directions,
                    alert_message: formData.alertMessage,
                    facebook_url: formData.facebook,
                    instagram_url: formData.instagram,
                    twitter_url: formData.twitter,
                    youtube_url: formData.youtube
                }
            })).unwrap();

            // 2. Prepare Opening Hours Payload
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
            const hoursPayload = days.map(day => ({
                day_of_week: day.charAt(0).toUpperCase() + day.slice(1),
                is_open: formData[day].isOpen,
                time_slots: formData[day].slots
            }));
            const hoursPromise = dispatch(updateDirectoryOpeningHours({ practiceId: clinicData.id, hours: hoursPayload })).unwrap();

            // 3. Prepare Exceptions Payload
            const exceptionsPayload = formData.exceptions.map(ex => ({
                exception_date: ex.date,
                is_closed: ex.isClosed,
                start_time: ex.isClosed ? null : ex.startTime,
                end_time: ex.isClosed ? null : ex.endTime,
                label: ex.label,
                note: ex.note
            }));
            const exceptionsPromise = dispatch(updateDirectoryExceptions({ practiceId: clinicData.id, exceptions: exceptionsPayload })).unwrap();

            // Fire all mutations concurrently!
            await Promise.all([baseInfoPromise, hoursPromise, exceptionsPromise]);
            
            // Reload the directory to sync Redux with DB completely
            dispatch(fetchDirectory(clinicData.id));

            toast.success("All Details saved successfully!");
            onNext();
        } catch (error: any) {
            console.error("Save failed:", error);
            toast.error(error.message || "Failed to save details.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm text-sm";
    const labelClasses = "text-sm font-bold text-gray-900 block mb-1.5";

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Practice Details</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage location, contact info, and hours.</p>
                </div>
            </div>

            {/* 1. LOCATION & MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider text-gray-400">
                        <Navigation className="w-4 h-4" /> Location
                    </h3>
                    <div>
                        <label className={labelClasses}>Street Address</label>
                        <input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className={inputClasses} placeholder="e.g. 123 Health St" />
                    </div>
                    <div>
                        <label className={labelClasses}>Postcode</label>
                        <input type="text" value={formData.zipcode} onChange={(e) => handleInputChange('zipcode', e.target.value)} className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Directions / Parking Info</label>
                        <textarea rows={4} value={formData.directions} onChange={(e) => handleInputChange('directions', e.target.value)} className={`${inputClasses} resize-none`} placeholder="Help patients find you..." />
                    </div>
                </div>

                {/* Visual Map Placeholder */}
                <div className="flex flex-col h-full pt-8">
                    <div className="flex-1 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden group min-h-[300px]">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full transform group-hover:-translate-y-[110%] transition-transform duration-500">
                            <MapPin className="w-12 h-12 text-orange-500 drop-shadow-xl fill-orange-500" />
                        </div>
                        <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-700 shadow-sm border border-white/50">
                            Map Preview
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. OPENING HOURS */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-6 uppercase tracking-wider text-gray-400">
                    <Clock className="w-4 h-4" /> Opening Hours
                </h3>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-100">
                        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                            <DayRow
                                key={day}
                                day={day.charAt(0).toUpperCase() + day.slice(1)}
                                dayHours={formData[day]}
                                onChange={(newHours) => handleDayChange(day, newHours)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. EXCEPTIONS & ALERTS */}
            <div className="space-y-10 mb-12">
                {/* Exceptions */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Exceptions</h3>
                            <p className="text-sm text-gray-500 mt-1">Public Holiday closures or specific date changes.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-orange-600 bg-white border border-orange-200 font-bold text-xs px-4 py-2 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition shadow-sm">
                            <Plus className="w-4 h-4" /> Add Exception
                        </button>
                    </div>

                    {formData.exceptions.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                                    <tr>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Hours</th>
                                        <th className="px-5 py-3">Label</th>
                                        <th className="px-5 py-3">Note</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.exceptions.map((ex) => (
                                        <tr key={ex.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 font-medium text-gray-900">{ex.date}</td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {ex.isClosed ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Closed</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{ex.startTime} - {ex.endTime}</span>}
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">{ex.label}</td>
                                            <td className="px-5 py-4 text-gray-500 italic">{ex.note}</td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => handleDeleteException(ex.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No exceptions added yet.</p>
                        </div>
                    )}
                </div>

                {/* Alert Message */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Global Alert Message</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <p className="text-sm text-gray-500">This message will appear prominently on your profile to notify patients of important updates.</p>
                        <textarea rows={3} value={formData.alertMessage} onChange={(e) => handleInputChange('alertMessage', e.target.value)} className={`${inputClasses} bg-orange-50/30 border-orange-100 focus:bg-white`} placeholder="e.g. We will be closed for renovations until..."></textarea>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* 4. CONTACT & SOCIALS */}
            <div className="space-y-8 mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider text-gray-400">
                    <Globe className="w-4 h-4" /> Online Presence
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`${inputClasses} pl-12`} placeholder="(02) 0000 0000" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`${inputClasses} pl-12`} placeholder="clinic@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Website</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} className={`${inputClasses} pl-12`} placeholder="www.clinic.com" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SocialInput Icon={Facebook} color="text-blue-600" placeholder="Facebook URL" value={formData.facebook} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('facebook', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Instagram} color="text-pink-600" placeholder="Instagram URL" value={formData.instagram} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('instagram', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Twitter} color="text-sky-500" placeholder="Twitter URL" value={formData.twitter} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('twitter', e.target.value)} inputClasses={inputClasses} />
                    <SocialInput Icon={Youtube} color="text-red-600" placeholder="Youtube URL" value={formData.youtube} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('youtube', e.target.value)} inputClasses={inputClasses} />
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button type="button" onClick={onNext} className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition">Skip</button>
                <button onClick={handleSaveAndNext} disabled={isSaving} className="px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 shadow-lg shadow-green-600/30 transition flex items-center gap-2">
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save</>}
                </button>
            </div>

            {/* MODAL */}
            {isModalOpen && <ExceptionModal onClose={() => setIsModalOpen(false)} onSave={handleAddException} />}
        </div>
    );
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

const SocialInput = ({ Icon, color, placeholder, value, onChange, inputClasses }: any) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 ${color} opacity-70 group-focus-within:opacity-100 transition-opacity`} />
        </div>
        <input type="url" placeholder={placeholder} value={value} onChange={onChange} className={`${inputClasses} pl-12`} />
    </div>
);

const DayRow = ({ day, dayHours, onChange }: { day: string; dayHours: DayHours; onChange: (newHours: DayHours) => void; }) => {
    const handleToggleOpen = (isOpen: boolean) => onChange({ ...dayHours, isOpen });

    const handleSlotChange = (slotId: string, field: 'start' | 'end', value: string) => {
        const updatedSlots = dayHours.slots.map(slot => slot.id === slotId ? { ...slot, [field]: value } : slot);
        onChange({ ...dayHours, slots: updatedSlots });
    };

    return (
        <div className={`flex items-start justify-between py-4 px-6 transition-colors ${dayHours.isOpen ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="flex items-center gap-4 w-40 pt-1.5">
                <input type="checkbox" checked={dayHours.isOpen} onChange={(e) => handleToggleOpen(e.target.checked)} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300 cursor-pointer" />
                <span className={`text-sm font-bold ${dayHours.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>
            </div>

            <div className="flex-1 flex justify-end">
                {dayHours.isOpen ? (
                    <div className="space-y-3">
                        {dayHours.slots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-3">
                                <input type="time" value={slot.start} onChange={(e) => handleSlotChange(slot.id, 'start', e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white shadow-sm font-medium text-gray-700" />
                                <span className="text-gray-400 text-xs font-medium">TO</span>
                                <input type="time" value={slot.end} onChange={(e) => handleSlotChange(slot.id, 'end', e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white shadow-sm font-medium text-gray-700" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs font-bold text-red-500 py-1.5 px-3 bg-red-100 rounded-lg uppercase tracking-wide">Closed</span>
                )}
            </div>
        </div>
    );
};

const ExceptionModal = ({ onClose, onSave }: { onClose: () => void, onSave: (ex: Exception) => void }) => {
    const [date, setDate] = useState('');
    const [isClosed, setIsClosed] = useState(true);
    const [label, setLabel] = useState('');
    const [note, setNote] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const handleSave = () => {
        if (!date) return;
        
        // Ensure Date is saved as standard YYYY-MM-DD for Postgres
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const newException: Exception = {
            id: Math.random().toString(36).substr(2, 9),
            date: formattedDate,
            isClosed,
            startTime: isClosed ? undefined : startTime,
            endTime: isClosed ? undefined : endTime,
            label, note
        };
        onSave(newException);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add Date Exception</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-gray-50/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                        <div className="h-[46px] flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer select-none p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition w-full">
                                <input type="checkbox" checked={isClosed} onChange={(e) => setIsClosed(e.target.checked)} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300" />
                                <span className="text-sm font-medium text-gray-700">Closed All Day</span>
                            </label>
                        </div>
                        {!isClosed && (
                            <div className="flex items-center gap-2 mt-4 animate-in slide-in-from-top-2">
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                                <span className="text-gray-400 text-xs font-bold">TO</span>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none" />
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Label</label>
                            <input type="text" placeholder="(e.g. New Year's Day)" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Note (Optional)</label>
                            <input type="text" placeholder="(e.g. Early close)" value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-white transition">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-900/10 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Exception
                    </button>
                </div>
            </div>
        </div>
    );
};