/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, X, User, Trash2, Calendar as CalendarIcon,
    Check, ChevronDown, Activity, Clock, RefreshCw, AlertCircle,
} from 'lucide-react';
import { formatTime, mapAppointmentToEnriched } from '../../features/online_bookings/online_bookings.utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAppointments } from '../../features/online_bookings/online_bookings.hooks';
import { createBreak, editBreak, fetchBreaks, fetchOpeningHours, fetchPracticeServices, fetchPractitioners, removeBreak, updateBookingStatus } from '../../features/online_bookings/online_bookings.slice';
import { RescheduleModal } from './dashboard/components/OnlineBookingsRescheduleModal';


// --- Types ---
interface Practitioner {
    id: string;
    name: string;
    role?: string;
    image?: string | null;
}

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
    dateOfBirth?: string;
    address?: string;
    medicalHistory?: string;
    isNewPatient?: boolean;
    isDependent?: boolean;
}

interface Service {
    id: string;
    name: string;
    duration: number;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}

interface Appointment {
    id: string;
    patientId: string;
    practitionerId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'dismissed' | 'patient_cancelled';
    is_rescheduled: boolean;
    notes?: string;
    type: 'appointment';
    rescheduledFrom?: {
        date: Date;
        practitionerId: string;
    };
    patientDetails: Patient;
}

interface CalendarEvent {
    id: string;
    title: string;
    practitionerId: string;
    type: 'break';
    startTime: Date;
    endTime: Date;
    notes?: string;
    color: string;
}

interface TimeSlot {
    hour: number;
    label: string;
}

// --- Constants ---
const SERVICE_COLORS = [
    { color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
    { color: '#22C55E', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300' },
    { color: '#A855F7', bgColor: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-300' },
    { color: '#F59E0B', bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-300' },
    { color: '#06B6D4', bgColor: 'bg-cyan-100', textColor: 'text-cyan-700', borderColor: 'border-cyan-300' },
    { color: '#EC4899', bgColor: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
    { color: '#8B5CF6', bgColor: 'bg-violet-100', textColor: 'text-violet-700', borderColor: 'border-violet-300' },
];

const BREAK_COLOR = {
    value: '#EF4444',
    bg: 'bg-red-100',
    lightBg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700'
};

const DURATION_OPTIONS = [
    { value: 15, label: '15 mins' }, { value: 30, label: '30 mins' }, { value: 45, label: '45 mins' },
    { value: 60, label: '1 hour' }, { value: 90, label: '1.5 hours' }, { value: 120, label: '2 hours' },
];

const START_HOUR = 8;
const END_HOUR = 18;
const PRACTICE_OPEN_TIME = "08:00";
const PRACTICE_CLOSE_TIME = "19:00";

// --- Helpers ---
const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        const ampm = i >= 12 ? 'PM' : 'AM';
        const hourDisplay = i % 12 || 12;
        slots.push({ hour: i, label: `${hourDisplay} ${ampm}` });
    }
    return slots;
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff); d.setHours(0, 0, 0, 0); return d;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date); result.setDate(result.getDate() + days); return result;
};

const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const toTimeString = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const setTimeOnDate = (dateBase: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(dateBase); newDate.setHours(hours, minutes, 0, 0); return newDate;
};

const addMinutesToTimeString = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);
    return (endHours * 60 + endMins) - (startHours * 60 + startMins);
};

const calculateAge = (dateOfBirth: string): number => {
    const today = new Date(); const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const checkTimeOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => (start1 < end2) && (end1 > start2);

// --- Sub-Components ---
const PatientTags = ({ isNewPatient, isDependent, size = 'default' }: { isNewPatient?: boolean; isDependent?: boolean; size?: 'small' | 'default' }) => {
    if (!isNewPatient && !isDependent) return null;
    const sizeClasses = size === 'small' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
    return (
        <div className="flex items-center gap-1">
            {isNewPatient && <span className={`inline-flex items-center ${sizeClasses} bg-gray-900 text-white font-medium rounded leading-none`}>NEW</span>}
            {isDependent && <span className={`inline-flex items-center gap-0.5 ${sizeClasses} bg-blue-600 text-white font-medium rounded leading-none`}>DEPENDENT</span>}
        </div>
    );
};

const StatusBadge: React.FC<{ status: string; size?: 'sm' | 'md'; is_rescheduled?: boolean }> = ({ status, size = 'md', is_rescheduled = false }) => {
    const statusStyles: Record<string, string> = {
        'confirmed': 'bg-green-100 text-green-700 border-green-200', 'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200', 'cancelled': 'bg-red-100 text-red-700 border-red-200',
        'dismissed': 'bg-gray-100 text-gray-700 border-gray-200', 'patient_cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    const statusLabels: Record<string, string> = {
        'confirmed': 'Confirmed', 'pending': 'Pending', 'completed': 'Completed', 'cancelled': 'Cancelled', 'dismissed': 'Dismissed', 'patient_cancelled': 'Pt. Cancelled',
    };
    const statusIcons: Record<string, React.ReactNode> = {
        'confirmed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />, 'pending': <Activity size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'completed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />, 'cancelled': <X size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'dismissed': <X size={size === 'sm' ? 10 : 12} className="mr-1" />, 'patient_cancelled': <X size={size === 'sm' ? 10 : 12} className="mr-1" />,
    };

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
    const safeStatus = statusStyles[status] ? status : 'pending';
    return (
        <span className={`inline-flex items-center rounded-full font-semibold border ${statusStyles[safeStatus]} ${sizeClasses} ${is_rescheduled ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
            {statusIcons[safeStatus]} {statusLabels[safeStatus]}
        </span>
    );
};

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({ isMobile: false, isTablet: false, isLaptop: false, isDesktop: false });
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({ isMobile: width < 640, isTablet: width >= 640 && width < 1024, isLaptop: width >= 1024 && width < 1280, isDesktop: width >= 1280 });
        };
        handleResize(); window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return screenSize;
};

// --- Time Picker ---
const TimePicker: React.FC<any> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange, hasConflict = false }) => {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const currentDuration = calculateDuration(startTime, endTime);
    const matchingDuration = DURATION_OPTIONS.find(d => d.value === currentDuration);

    const handleDurationClick = (minutes: number) => {
        setSelectedDuration(minutes);
        onEndTimeChange(addMinutesToTimeString(startTime, minutes));
    };

    const handleStartTimeChange = (newStartTime: string) => {
        onStartTimeChange(newStartTime);
        if (selectedDuration) onEndTimeChange(addMinutesToTimeString(newStartTime, selectedDuration));
    };

    const handleEndTimeChange = (newEndTime: string) => {
        onEndTimeChange(newEndTime);
        const matching = DURATION_OPTIONS.find(d => d.value === calculateDuration(startTime, newEndTime));
        setSelectedDuration(matching ? matching.value : null);
    };

    const inputBorderClass = hasConflict ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20';

    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Select Time</label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} className={`w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input type="time" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} className={`w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`} />
                </div>
            </div>
            {currentDuration > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">Duration:</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${hasConflict ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {currentDuration >= 60 ? `${Math.floor(currentDuration / 60)}h ${currentDuration % 60 > 0 ? `${currentDuration % 60}m` : ''}` : `${currentDuration} mins`}
                    </span>
                </div>
            )}
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((duration) => {
                        const isSelected = selectedDuration === duration.value || (matchingDuration?.value === duration.value && !selectedDuration);
                        return (
                            <button key={duration.value} type="button" onClick={() => handleDurationClick(duration.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isSelected ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}>
                                {duration.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Modals ---
const BreakModal: React.FC<any> = ({ isOpen, onClose, onSave, onDelete, initialData, selectedDate, activePractitionerId, appointments, existingBreaks, practitioners }) => {
    const isEditMode = !!initialData?.id;
    const activePractitioner = practitioners.find((p: any) => p.id === activePractitionerId);

    const [title, setTitle] = useState(initialData?.title || 'Break');
    const [startTimeStr, setStartTimeStr] = useState(initialData?.startTime ? toTimeString(initialData.startTime) : "12:00");
    const [endTimeStr, setEndTimeStr] = useState(initialData?.endTime ? toTimeString(initialData.endTime) : "13:00");
    const [notes, setNotes] = useState(initialData?.notes || '');

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || 'Break');
            setStartTimeStr(initialData?.startTime ? toTimeString(initialData.startTime) : "12:00");
            setEndTimeStr(initialData?.endTime ? toTimeString(initialData.endTime) : "13:00");
            setNotes(initialData?.notes || '');
        }
    }, [isOpen, initialData]);

    const dayAppointments = useMemo(() => appointments.filter((a: any) => a.practitionerId === activePractitionerId && isSameDay(a.startTime, selectedDate) && a.status !== 'cancelled').sort((a: any, b: any) => a.startTime.getTime() - b.startTime.getTime()), [appointments, activePractitionerId, selectedDate]);
    const dayBreaks = useMemo(() => existingBreaks.filter((b: any) => b.practitionerId === activePractitionerId && isSameDay(b.startTime, selectedDate) && b.id !== initialData?.id).sort((a: any, b: any) => a.startTime.getTime() - b.startTime.getTime()), [existingBreaks, activePractitionerId, selectedDate, initialData?.id]);

    const conflictingAppointments = useMemo(() => {
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr); const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);
        return dayAppointments.filter((appt: any) => checkTimeOverlap(proposedStart, proposedEnd, appt.startTime, appt.endTime));
    }, [dayAppointments, selectedDate, startTimeStr, endTimeStr]);

    const conflictingBreaks = useMemo(() => {
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr); const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);
        return dayBreaks.filter((b: any) => checkTimeOverlap(proposedStart, proposedEnd, b.startTime, b.endTime));
    }, [dayBreaks, selectedDate, startTimeStr, endTimeStr]);

    const isOutsideOperatingHours = useMemo(() => {
        const openTime = setTimeOnDate(selectedDate, PRACTICE_OPEN_TIME); const closeTime = setTimeOnDate(selectedDate, PRACTICE_CLOSE_TIME);
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr); const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);
        return proposedStart < openTime || proposedEnd > closeTime;
    }, [selectedDate, startTimeStr, endTimeStr]);

    const isPastTime = useMemo(() => {
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr);
        const now = new Date();

        // If editing an existing break and they didn't change the start time, allow it (e.g., just updating notes)
        if (isEditMode && initialData?.startTime && proposedStart.getTime() === initialData.startTime.getTime()) {
            return false;
        }

        return proposedStart < now;
    }, [selectedDate, startTimeStr, isEditMode, initialData]);

    const hasConflict = conflictingAppointments.length > 0 || conflictingBreaks.length > 0 || isOutsideOperatingHours || isPastTime;
    const hasValidDuration = calculateDuration(startTimeStr, endTimeStr) > 0;

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasConflict) return;
        const start = setTimeOnDate(selectedDate, startTimeStr);
        const end = setTimeOnDate(selectedDate, endTimeStr);
        if (end <= start) return alert("End time must be after start time");

        onSave({
            id: initialData?.id || '',
            title: title || 'Break',
            practitionerId: activePractitionerId,
            type: 'break',
            startTime: start,
            endTime: end,
            notes,
            color: BREAK_COLOR.value
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden w-full sm:w-[600px] flex flex-col">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 rounded-t-2xl flex justify-between items-center bg-red-500 sticky top-0 z-10">
                    <h3 className="font-bold text-white text-base sm:text-lg">{isEditMode ? 'Edit Break' : 'New Break'}</h3>
                    <button onClick={onClose} className="p-1 text-white rounded-full bg-white/20 hover:bg-white/30 transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Lunch Break, Meeting..." className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Practitioner</label>
                            <div className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2 cursor-not-allowed select-none">
                                <User size={16} className="text-gray-400" />
                                <span className="font-medium text-gray-700">{activePractitioner?.name || 'Unknown Practitioner'}</span>
                            </div>
                        </div>

                        <TimePicker startTime={startTimeStr} endTime={endTimeStr} onStartTimeChange={setStartTimeStr} onEndTimeChange={setEndTimeStr} hasConflict={hasConflict} />

                        {isOutsideOperatingHours && (
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl animate-in fade-in slide-in-from-top-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-orange-600" />
                                    </div>
                                    <div><p className="text-sm font-semibold text-orange-800 mb-1">Outside Operating Hours</p>
                                        <p className="text-xs text-orange-700">Practice is closed. Select between
                                            <strong>{PRACTICE_OPEN_TIME}</strong> and <strong>{PRACTICE_CLOSE_TIME}</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isPastTime && (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-gray-500" /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 mb-1">Invalid Time</p>
                                        <p className="text-xs text-gray-600">You cannot schedule a break in the past.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(conflictingAppointments.length > 0 || conflictingBreaks.length > 0) && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><AlertCircle size={18} className="text-red-600" /></div>
                                    <div className="flex-1"><p className="text-sm font-semibold text-red-700 mb-2">Time Conflict Detected</p><p className="text-xs text-red-600 mb-3">Overlaps with existing bookings or breaks.</p></div>
                                </div>
                            </div>
                        )}

                        {!hasConflict && dayAppointments.length === 0 && dayBreaks.length === 0 && (
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Check size={18} className="text-green-600" /></div>
                                    <div><p className="text-sm font-medium text-green-700">Valid Time</p><p className="text-xs text-green-600">This time slot is available.</p></div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
                            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any additional notes..." className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" />
                        </div>

                        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                            {isEditMode && <button type="button" onClick={() => { onDelete(initialData!.id!); onClose(); }} className="p-2 sm:p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={18} /></button>}
                            <button type="button" onClick={onClose} className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">Cancel</button>
                            <button type="submit" disabled={hasConflict || !hasValidDuration} className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 font-medium rounded-lg shadow-md transition-all text-sm flex items-center justify-center gap-2 ${hasConflict || !hasValidDuration ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-red-500 hover:bg-red-600 text-white'}`}>{isEditMode ? 'Update' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Appointment Details Modal (Redesigned) ---
interface AppointmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    practitioners: Practitioner[];
    services: Service[];
    onUpdateStatus: (id: string, status: Appointment['status']) => void;
    onOpenReschedule: (appointment: Appointment) => void;
}

type DropdownAction = Appointment['status'] | 'reschedule';

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
    isOpen,
    onClose,
    appointment,
    practitioners,
    services,
    onUpdateStatus,
    onOpenReschedule
}) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => { if (!isOpen) setIsStatusDropdownOpen(false); }, [isOpen]);

    if (!isOpen || !appointment) return null;

    const patient = appointment.patientDetails;
    const practitioner = practitioners.find(p => p.id === appointment.practitionerId);
    const service = services.find(s => s.id === appointment.serviceId);
    const isFinalStatus = ['completed', 'cancelled', 'dismissed', 'patient_cancelled'].includes(appointment.status);

    const handleActionClick = (action: DropdownAction) => {
        if (action === 'reschedule') { onOpenReschedule(appointment); onClose(); }
        else { onUpdateStatus(appointment.id, action as Appointment['status']); }
        setIsStatusDropdownOpen(false);
    };

    let availableActions: DropdownAction[] = [];
    if (appointment.status === 'pending') {
        availableActions = ['confirmed'];
        if (!appointment.is_rescheduled) availableActions.push('reschedule');
        availableActions.push('cancelled');
    } else if (appointment.status === 'confirmed') {
        availableActions = ['completed'];
        if (!appointment.is_rescheduled) availableActions.push('reschedule');
        availableActions.push('cancelled');
    }

    const statusConfig: Record<DropdownAction, { bg: string; icon: React.ElementType }> = {
        'reschedule': { bg: 'bg-blue-500', icon: RefreshCw },
        'confirmed': { bg: 'bg-green-500', icon: Check },
        'pending': { bg: 'bg-amber-500', icon: Clock },
        'completed': { bg: 'bg-emerald-600', icon: Check },
        'cancelled': { bg: 'bg-red-500', icon: X },
        'dismissed': { bg: 'bg-gray-500', icon: X },
        'patient_cancelled': { bg: 'bg-red-500', icon: X },
    };

    const CurrentStatusIcon = statusConfig[appointment.status as DropdownAction]?.icon || Clock;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col w-full sm:w-[500px]">
                <div className="h-24 relative flex-shrink-0" style={{ background: `linear-gradient(135deg, ${service?.color || '#3B82F6'}dd 100%, ${service?.color || '#3B82F6'}99 100%)` }}>
                    <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-white/30 hover:bg-white/50 text-black rounded-full transition-all backdrop-blur-sm">
                        <X size={18} />
                    </button>
                    <div className="absolute mt-5 left-6"><span className="px-3 py-1 bg-black/25 backdrop-blur-sm text-white text-xs font-semibold rounded-full">{service?.name}</span>
                    </div>
                </div>
                <div className="px-4 sm:px-6 -mt-10 relative z-10 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                {patient?.profilePicture ? (
                                    <img
                                        src={patient.profilePicture}
                                        alt={patient?.name}
                                        className="w-16 h-16 rounded-xl object-cover ring-4 ring-white shadow-md bg-gray-100"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl ring-4 ring-white shadow-md bg-gray-100 flex items-center justify-center">
                                        <User size={32} className="text-gray-400" />
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusConfig[appointment.status as DropdownAction]?.bg || 'bg-gray-500'} rounded-full flex items-center justify-center ring-2 ring-white`}>
                                    <CurrentStatusIcon size={10} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">{patient?.name}</h4>
                                            <PatientTags isNewPatient={patient?.isNewPatient} isDependent={patient?.isDependent} size="small" />
                                        </div>
                                        {patient?.dateOfBirth && <p className="text-sm text-gray-500">{calculateAge(patient.dateOfBirth)} years old</p>}
                                        <span className="text-sm text-gray-700">{patient?.phone}</span>
                                    </div>
                                    <div className="relative" ref={dropdownRef}>
                                        <button onClick={() => !isFinalStatus && setIsStatusDropdownOpen(!isStatusDropdownOpen)} disabled={isFinalStatus}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all 
                                            ${isFinalStatus ? 'cursor-default' : 'hover:shadow-md cursor-pointer'}`} style={{ backgroundColor: `${service?.color || '#3B82F6'}15`, color: service?.color || '#3B82F6' }}>
                                            <StatusBadge status={appointment.status} size="sm" is_rescheduled={appointment.is_rescheduled} />
                                            {!isFinalStatus && <ChevronDown size={14} className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />}
                                        </button>
                                        {isStatusDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                                <div className="p-2 bg-gray-100 border-b border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider px-2">Update Status</p>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {availableActions.map((action) => {
                                                        const isCurrentStatus = appointment.status === action;
                                                        const ActionIcon = statusConfig[action]?.icon || Clock;
                                                        return (
                                                            <button key={action} onClick={() => handleActionClick(action)} disabled={isCurrentStatus}
                                                                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all 
                                                            ${isCurrentStatus ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                                                                <div className={`w-7 h-7 ${statusConfig[action]?.bg || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                                                                    <ActionIcon size={14} className="text-white" />
                                                                </div>
                                                                <span className={`text-sm font-medium ${isCurrentStatus ? 'text-gray-400' : 'text-gray-700'}`}>
                                                                    {action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')}</span>
                                                                {isCurrentStatus && <Check size={16} className="ml-auto text-green-500" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 space-y-5">
                    {appointment.is_rescheduled && appointment.rescheduledFrom && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <RefreshCw size={18} className="text-blue-600" /></div>
                            <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Rescheduled From</p>
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {appointment.rescheduledFrom.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {practitioners.find(p => p.id === appointment.rescheduledFrom?.practitionerId)?.name}</p>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-50 via-purple-100 to-purple-50 rounded-xl border border-violet-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <CalendarIcon size={16} className="text-violet-600" />
                                </div>
                                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Date</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                                {appointment.startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Clock size={16} className="text-amber-600" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Time</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Practitioner</p>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="font-semibold text-gray-800">{practitioner?.name}</p>
                                <p className="text-xs text-gray-500">{practitioner?.role}</p>
                            </div>
                        </div>
                    </div>
                    {appointment.notes && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Notes</p>
                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                <p className="text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 sm:px-6 bg-gray-50 border-t border-gray-100 flex-shrink-0 rounded-b-2xl">
                    <button onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-all 
                    shadow-md shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20">Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const ServiceLegend: React.FC<any> = ({ services }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
                <span className="hidden sm:inline">Services</span> <ChevronDown size={16} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border p-3 z-50">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {services.map((service: any) => (
                            <div key={service.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }} />
                                <p className="text-sm font-medium truncate">{service.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Calendar Component ---
const PracticeBookingCalendar = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: any) => state.auth);
    const practiceId = user?.practice_id || user?.id;

    // Fetch from Redux Hooks
    const { bookings, onReschedule } = useAppointments(practiceId);
    const { practitioners: dbPractitioners, services: dbServices, breaks: dbBreaks, openingHours } = useAppSelector((state: any) => state.appointments);

    // Initial Data Fetch
    useEffect(() => {
        if (practiceId) {
            dispatch(fetchPractitioners(practiceId));
            dispatch(fetchPracticeServices(practiceId));
            dispatch(fetchOpeningHours(practiceId));
            dispatch(fetchBreaks(practiceId));
        }
    }, [dispatch, practiceId]);

    // --- Dynamic Mappers ---
    const dynamicPractitioners = useMemo<Practitioner[]>(() => {
        if (!dbPractitioners || dbPractitioners.length === 0) return [];
        return dbPractitioners.map((p: any) => ({
            id: p.id,
            name: p.name,
            role: p.role,
            image: p.image
        }));
    }, [dbPractitioners]);

    const dynamicServices = useMemo<Service[]>(() => {
        if (!dbServices || dbServices.length === 0) return [];
        return dbServices.map((s: any, idx: number) => {
            const colors = SERVICE_COLORS[idx % SERVICE_COLORS.length];
            return { id: s.name, name: s.name, duration: s.duration || 30, ...colors };
        });
    }, [dbServices]);

    const dynamicAppointments = useMemo<Appointment[]>(() => {
        return bookings.map((b: any) => {
            const enriched = mapAppointmentToEnriched(b);
            const startTime = new Date(`${enriched.appointment_date}T${enriched.appointment_time}`);
            const service = dynamicServices.find(s => s.name === b.treatment);
            const duration = service?.duration || 30;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            return {
                id: enriched.id,
                patientId: enriched.id,
                practitionerId: enriched.dentist_id,
                serviceId: service?.id || b.treatment,
                startTime,
                endTime,
                status: enriched.status as any,
                is_rescheduled: enriched.is_rescheduled,
                notes: enriched.patient_notes,
                type: 'appointment',
                patientDetails: {
                    id: enriched.id, name: enriched.patient_name, email: b.email || '', phone: enriched.mobile, dateOfBirth: enriched.dob, isNewPatient: enriched.isNewPatient, isDependent: enriched.isDependent
                }
            };
        });
    }, [bookings, dynamicServices]);

    const dynamicBreaks = useMemo<CalendarEvent[]>(() => {
        if (!dbBreaks) return [];
        return dbBreaks.map((b: any) => ({
            id: b.id,
            title: b.title,
            practitionerId: b.practitioner_id,
            type: 'break',
            startTime: new Date(b.start_time),
            endTime: new Date(b.end_time),
            notes: b.notes || '',
            color: b.color || '#EF4444'
        }));
    }, [dbBreaks]);

    // Local State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [breaks, setBreaks] = useState<CalendarEvent[]>([]);
    const [activePractitionerId, setActivePractitionerId] = useState<string>('');

    // Sync Redux Data to Local State 
    useEffect(() => { setAppointments(dynamicAppointments); }, [dynamicAppointments]);
    useEffect(() => { setBreaks(dynamicBreaks); }, [dynamicBreaks]);

    useEffect(() => {
        if (dynamicPractitioners.length > 0 && !dynamicPractitioners.find(p => p.id === activePractitionerId)) {
            setActivePractitionerId(dynamicPractitioners[0].id);
        }
    }, [dynamicPractitioners, activePractitionerId]);

    const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const [editingBreak, setEditingBreak] = useState<Partial<CalendarEvent> | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
    const [selectedDayForModal, setSelectedDayForModal] = useState<Date>(new Date());
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const { isMobile, isTablet } = useScreenSize();

    const CELL_HEIGHT = isMobile ? 80 : isTablet ? 100 : 120;
    const MINUTE_HEIGHT = CELL_HEIGHT / 60;

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
    const timeSlots = useMemo(() => generateTimeSlots(), []);
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i)), [startOfWeek]);
    const visibleDays = isMobile ? [weekDays[selectedDayIndex]] : weekDays;

    const displayedBreaks = useMemo(() => breaks.filter(e => e.practitionerId === activePractitionerId), [breaks, activePractitionerId]);
    const displayedAppointments = useMemo(() => appointments.filter(a => a.practitionerId === activePractitionerId), [appointments, activePractitionerId]);

    const handlePrevWeek = () => {
        if (isMobile) { if (selectedDayIndex === 0) { setCurrentDate(addDays(currentDate, -7)); setSelectedDayIndex(6); } else setSelectedDayIndex(selectedDayIndex - 1); }
        else setCurrentDate(addDays(currentDate, -7));
    };

    const handleNextWeek = () => {
        if (isMobile) { if (selectedDayIndex === 6) { setCurrentDate(addDays(currentDate, 7)); setSelectedDayIndex(0); } else setSelectedDayIndex(selectedDayIndex + 1); }
        else setCurrentDate(addDays(currentDate, 7));
    };

    const handleSlotClick = (day: Date, hour: number, minutes: number) => {
        const clickedTime = new Date(day); clickedTime.setHours(hour, minutes, 0, 0);
        const endTime = new Date(clickedTime); endTime.setMinutes(endTime.getMinutes() + 30);
        setEditingBreak({ startTime: clickedTime, endTime: endTime, type: 'break', practitionerId: activePractitionerId, color: BREAK_COLOR.value });
        setSelectedDayForModal(clickedTime); setIsBreakModalOpen(true);
    };

    const handleBreakClick = (breakEvent: CalendarEvent) => { setEditingBreak(breakEvent); setSelectedDayForModal(breakEvent.startTime); setIsBreakModalOpen(true); };
    const handleAppointmentClick = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsAppointmentModalOpen(true); };

    // DB ACTIONS
    const handleSaveBreak = async (savedBreak: CalendarEvent) => {
        const isEdit = editingBreak && editingBreak.id;
        const dbPayload = {
            practice_id: practiceId, practitioner_id: savedBreak.practitionerId, title: savedBreak.title,
            start_time: savedBreak.startTime.toISOString(), end_time: savedBreak.endTime.toISOString(), notes: savedBreak.notes, color: savedBreak.color
        };
        setBreaks(prev => {
            if (isEdit) return prev.map(b => b.id === editingBreak.id ? { ...savedBreak, id: editingBreak.id as string } : b);
            return [...prev, { ...savedBreak, id: 'temp-' + Date.now() }];
        });
        try {
            if (isEdit) await dispatch(editBreak({ id: editingBreak.id as string, data: dbPayload })).unwrap();
            else await dispatch(createBreak(dbPayload as any)).unwrap();
            dispatch(fetchBreaks(practiceId));
        } catch (e) {
            console.error(e); dispatch(fetchBreaks(practiceId));
        }
    };

    const handleDeleteBreak = async (id: string) => {
        if (window.confirm("Delete this break?")) {
            setBreaks(prev => prev.filter(e => e.id !== id));
            try {
                await dispatch(removeBreak(id)).unwrap();
            } catch (e) {
                console.error(e); dispatch(fetchBreaks(practiceId));
            }
        }
    };

    const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
        dispatch(updateBookingStatus({ id, status }));
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        if (selectedAppointment?.id === id) setSelectedAppointment(prev => prev ? { ...prev, status } : null);
    };

    const handleOpenReschedule = (appointment: Appointment) => { setRescheduleAppointment(appointment); setIsRescheduleModalOpen(true); };

    // BRIDGE ADAPTER FOR SHARED MODAL
    const originalRescheduleApt = useMemo(() => {
        if (!rescheduleAppointment) return null;
        const rawAppt = bookings.find((b: any) => b.id === rescheduleAppointment.id);
        if (!rawAppt) return null;
        return mapAppointmentToEnriched(rawAppt);
    }, [rescheduleAppointment, bookings]);

    const handleExternalRescheduleConfirm = async (dateStr: string, timeStr: string, practitionerId: string) => {
        if (!originalRescheduleApt) return;
        try {
            await onReschedule(originalRescheduleApt.id, dateStr, timeStr, practitionerId);
            setIsRescheduleModalOpen(false);
            setRescheduleAppointment(null);
        } catch (error) {
            console.error("Failed to reschedule:", error);
        }
    };

    const timeColumnWidth = isMobile ? 'w-14' : 'w-20';

    return (
        <div>
            <div className="flex flex-col flex-1 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-white border-b border-gray-400 gap-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <CalendarIcon className="text-orange-500 hidden sm:block" size={isMobile ? 20 : 28} />
                            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
                                {isMobile ? weekDays[selectedDayIndex].toLocaleDateString('default', { month: 'short', day: 'numeric' }) : `${startOfWeek.toLocaleString('default', { month: 'long' })} ${startOfWeek.getFullYear()}`}
                            </h2>
                        </div>
                        <div className="flex items-center rounded-lg border border-gray-400 p-0.5 bg-white">
                            <button onClick={handlePrevWeek}
                                className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                                <ChevronLeft size={isMobile ? 16 : 20} />
                            </button>
                            <button onClick={handleNextWeek}
                                className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                                <ChevronRight size={isMobile ? 16 : 20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 ml-0 sm:ml-4">
                            <span className="text-sm font-semibold text-gray-500 hidden sm:block">Practitioner:</span>
                            <div className="relative">
                                <select value={activePractitionerId} onChange={(e) => setActivePractitionerId(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-lg pl-9 pr-8 py-2 
                                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer min-w-[160px]">
                                    {dynamicPractitioners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    {dynamicPractitioners.length === 0 && <option value="">No Practitioners</option>}
                                </select>
                                <User size={16} className="absolute left-3 top-1/4 text-gray-400" />
                                <ChevronDown size={16} className="absolute right-3 top-1/4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    {dynamicServices.length > 0 && <ServiceLegend services={dynamicServices} />}
                </div>

                {isMobile && (
                    <div className="flex overflow-x-auto py-2 px-2 bg-gray-50 border-b border-gray-200 gap-1">
                        {weekDays.map((day, index) => {
                            const isToday = isSameDay(day, new Date());
                            const isSelected = index === selectedDayIndex;
                            const dayAppointments = appointments.filter(a => a.practitionerId === activePractitionerId && isSameDay(a.startTime, day) && !['cancelled', 'dismissed', 'patient_cancelled'].includes(a.status));
                            return (
                                <button key={index} onClick={() => setSelectedDayIndex(index)}
                                    className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-lg transition-all relative 
                                ${isSelected ? 'bg-orange-500 text-white shadow-md' : isToday ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                                    <span className="text-[10px] font-medium uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-sm font-bold">{day.getDate()}</span>
                                    {dayAppointments.length > 0 &&
                                        <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center
                                     ${isSelected ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>{dayAppointments.length}
                                        </span>}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="flex-1 overflow-auto relative" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9' }}>
                    <div className={`${isMobile ? 'min-w-full' : 'min-w-[800px] lg:min-w-[1000px]'} pb-6 sm:pb-10`}>
                        {!isMobile && (
                            <div className="flex border-b border-gray-400 sticky top-0 bg-white z-20">
                                <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white`}></div>
                                {visibleDays.map((day, index) => {
                                    const isToday = isSameDay(day, new Date());
                                    const dayAppointments = appointments.filter(a => a.practitionerId === activePractitionerId && isSameDay(a.startTime, day) && !['cancelled', 'dismissed', 'patient_cancelled'].includes(a.status));
                                    return (
                                        <div key={index} className="flex-1 py-2 sm:py-3 lg:py-4 text-center border-r border-gray-400 last:border-r-0 relative">
                                            <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                            <div className="flex justify-center">
                                                <div className={`text-base sm:text-lg lg:text-xl font-bold w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full transition-colors 
                                                    ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-800'}`}>{day.getDate()}</div>
                                            </div>
                                            {dayAppointments.length > 0 && <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">{dayAppointments.length}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex relative">
                            <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white z-10`}>
                                {timeSlots.map((slot) => (
                                    <div key={slot.hour}
                                        className="relative text-[10px] sm:text-[11px] font-medium text-gray-400 text-right pr-2 sm:pr-4 flex items-start justify-end" style={{ height: `${CELL_HEIGHT}px` }}>
                                        <span className="mt-[6px] sm:mt-[8px]">{slot.label}</span>
                                    </div>
                                ))}
                            </div>

                            {visibleDays.map((day, dayIndex) => {
                                const dayBreaks = displayedBreaks.filter(e => isSameDay(e.startTime, day));
                                const dayAppointments = displayedAppointments.filter(a => isSameDay(a.startTime, day));

                                return (
                                    <div key={dayIndex} className="flex-1 relative border-r border-gray-400 last:border-r-0">
                                        {timeSlots.map((slot) => (
                                            <div key={slot.hour} className="relative w-full border-t border-gray-400" style={{ height: `${CELL_HEIGHT}px` }}>
                                                {[0, 15, 30, 45].map((minute) => (
                                                    <div key={minute} onClick={() => handleSlotClick(day, slot.hour, minute)}
                                                        className={`w-full cursor-pointer border border-dashed hover:bg-gray-100 transition-colors ${minute === 30 ? 'border-t border-gray-200 border-dashed' : ''}`} style={{ height: `${CELL_HEIGHT / 4}px` }} />
                                                ))}
                                            </div>
                                        ))}

                                        {dayAppointments.map((appointment) => {
                                            const startMinTotal = (appointment.startTime.getHours() - START_HOUR) * 60 + appointment.startTime.getMinutes();
                                            const durationMinutes = (appointment.endTime.getTime() - appointment.startTime.getTime()) / 60000;
                                            const top = startMinTotal * MINUTE_HEIGHT;
                                            const height = durationMinutes * MINUTE_HEIGHT;

                                            const service = dynamicServices.find(s => s.id === appointment.serviceId) || dynamicServices[0];
                                            const patient = appointment.patientDetails;

                                            const isCompact = durationMinutes <= 20;
                                            const isCancelled = ['cancelled', 'patient_cancelled', 'dismissed'].includes(appointment.status);
                                            const isRescheduled = appointment.is_rescheduled;
                                            const isCompleted = appointment.status === 'completed';

                                            return (
                                                <div key={appointment.id} onClick={(e) => { e.stopPropagation(); handleAppointmentClick(appointment); }}
                                                    className={`absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden 
                                                    ${service?.bgColor} ${service?.textColor} ${isCancelled || isCompleted ? 'opacity-50' : ''} 
                                                    ${isRescheduled ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                                                    style={{ top: `${top}px`, height: `${height}px`, borderWidth: '1px', borderColor: service?.color, borderLeftWidth: isMobile ? '3px' : '4px', borderLeftColor: service?.color }}>
                                                    {isCompact ? (
                                                        <div className="px-1.5 py-0.5 flex items-center gap-1 h-full">
                                                            {isRescheduled &&
                                                                <RefreshCw size={10} className="flex-shrink-0" />}
                                                            <span className="text-[10px] sm:text-sm font-bold truncate">{patient?.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 h-full flex flex-col">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                {isRescheduled && <RefreshCw size={12} className="flex-shrink-0" />}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-[10px] sm:text-sm font-bold truncate">{patient?.name}</p>
                                                                        {height > 60 && <PatientTags isNewPatient={patient?.isNewPatient} isDependent={patient?.isDependent} size="small" />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold opacity-80">
                                                                <span>{appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            {height > 70 && (
                                                                <div className="mt-auto pt-1">
                                                                    <StatusBadge status={appointment.status} size="sm" is_rescheduled={appointment.is_rescheduled} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {dayBreaks.map((breakEvent) => {
                                            const startMinTotal = (breakEvent.startTime.getHours() - START_HOUR) * 60 + breakEvent.startTime.getMinutes();
                                            const durationMinutes = (breakEvent.endTime.getTime() - breakEvent.startTime.getTime()) / 60000;
                                            const top = startMinTotal * MINUTE_HEIGHT;
                                            const height = durationMinutes * MINUTE_HEIGHT;
                                            const isCompact = durationMinutes <= 15;
                                            return (
                                                <div key={breakEvent.id}
                                                    onClick={(e) => { e.stopPropagation(); handleBreakClick(breakEvent); }}
                                                    className={`absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden bg-red-100 text-red-700 border border-red-300 
                                                    ${isCompact ? 'px-1.5 py-0.5 flex items-center gap-1' : 'px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 flex flex-col'}`}
                                                    style={{ top: `${top}px`, height: `${height}px`, borderLeftWidth: isMobile ? '3px' : '4px', borderLeftColor: BREAK_COLOR.value }}>
                                                    {isCompact ? (
                                                        <><span className="text-[10px] sm:text-xs font-bold truncate">
                                                            {breakEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className="text-[9px] sm:text-xs font-bold truncate">{breakEvent.title}</span>
                                                        </>
                                                    ) : (
                                                        <><div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                                            <span className="text-[10px] sm:text-xs font-bold truncate">
                                                                {breakEvent.startTime.toLocaleTimeString([],
                                                                    { hour: '2-digit', minute: '2-digit' })} - {breakEvent.endTime.toLocaleTimeString([],
                                                                        { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                            <div className="text-[10px] sm:text-xs font-bold leading-tight mb-0.5 sm:mb-1 truncate">{breakEvent.title}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS SECTION */}
            <BreakModal
                isOpen={isBreakModalOpen}
                onClose={() => setIsBreakModalOpen(false)}
                onSave={handleSaveBreak}
                onDelete={handleDeleteBreak}
                initialData={editingBreak}
                selectedDate={selectedDayForModal}
                activePractitionerId={activePractitionerId}
                appointments={appointments}
                existingBreaks={breaks}
                practitioners={dynamicPractitioners}
            />

            <AppointmentDetailsModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                appointment={selectedAppointment}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onOpenReschedule={handleOpenReschedule}
                practitioners={dynamicPractitioners}
                services={dynamicServices}
            />

            {/* EXTERNAL SHARED RESCHEDULE MODAL */}
            {isRescheduleModalOpen && originalRescheduleApt && (
                <RescheduleModal
                    isOpen={isRescheduleModalOpen}
                    onClose={() => {
                        setIsRescheduleModalOpen(false);
                        setRescheduleAppointment(null);
                    }}
                    apt={originalRescheduleApt}
                    onConfirm={handleExternalRescheduleConfirm}
                    practitioners={dynamicPractitioners.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        image: p.image || null
                    }))}
                    openingHours={openingHours || []}
                    existingBookings={bookings.map(mapAppointmentToEnriched)}
                />
            )}
        </div>
    );
};

export default PracticeBookingCalendar;