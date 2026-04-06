/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, X, User, Trash2, Calendar as CalendarIcon,
    Check, ChevronDown, Activity, Clock, RefreshCw, AlertCircle,
} from 'lucide-react';

// --- Types ---
interface Practitioner {
    id: string;
    name: string;
    role?: string;
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

// ✅ CHANGED: Removed 'rescheduled' from status union, added 'is_rescheduled' boolean flag
interface Appointment {
    id: string;
    patientId: string;
    practitionerId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    is_rescheduled: boolean;
    notes?: string;
    type: 'appointment';
    rescheduledFrom?: {
        date: Date;
        practitionerId: string;
    };
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

// --- Mock Data ---
const PRACTITIONERS: Practitioner[] = [
    { id: 'p1', name: 'Dr. Surea', role: 'Dentist' },
    { id: 'p2', name: 'Dr. Vishwa', role: 'Hygienist' },
    { id: 'p3', name: 'Dr. Emily', role: 'Orthodontist' },
];

const PATIENTS: Patient[] = [
    {
        id: 'pt1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1985-03-15',
        address: '123 Main St, New York, NY 10001',
        isNewPatient: true,
        isDependent: false
    },
    {
        id: 'pt2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1992-07-22',
        address: '456 Oak Ave, Brooklyn, NY 11201',
        isNewPatient: false,
        isDependent: false
    },
    {
        id: 'pt3',
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        phone: '+1 (555) 345-6789',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1978-11-08',
        address: '789 Pine Rd, Queens, NY 11375',
        isNewPatient: false,
        isDependent: true
    },
    {
        id: 'pt4',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1 (555) 456-7890',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1990-05-30',
        address: '321 Elm St, Manhattan, NY 10016',
        isNewPatient: true,
        isDependent: false
    },
    {
        id: 'pt5',
        name: 'Robert Wilson',
        email: 'robert.w@email.com',
        phone: '+1 (555) 567-8901',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1965-09-12',
        address: '654 Maple Dr, Bronx, NY 10451',
        isNewPatient: false,
        isDependent: true
    },
];

const SERVICES: Service[] = [
    {
        id: 's1',
        name: 'General Checkup',
        duration: 30,
        color: '#3B82F6',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
    },
    {
        id: 's2',
        name: 'Teeth Cleaning',
        duration: 45,
        color: '#22C55E',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
    },
    {
        id: 's3',
        name: 'Root Canal',
        duration: 90,
        color: '#A855F7',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
    },
    {
        id: 's4',
        name: 'Teeth Whitening',
        duration: 60,
        color: '#F59E0B',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
    },
    {
        id: 's5',
        name: 'Orthodontic Consultation',
        duration: 45,
        color: '#06B6D4',
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-700',
        borderColor: 'border-cyan-300',
    },
    {
        id: 's6',
        name: 'Dental Filling',
        duration: 30,
        color: '#EC4899',
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-700',
        borderColor: 'border-pink-300',
    },
    {
        id: 's7',
        name: 'Crown Fitting',
        duration: 60,
        color: '#8B5CF6',
        bgColor: 'bg-violet-100',
        textColor: 'text-violet-700',
        borderColor: 'border-violet-300',
    },
    {
        id: 's8',
        name: 'Emergency Visit',
        duration: 30,
        color: '#EF4444',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
    },
];

const BREAK_COLOR = {
    value: '#EF4444',
    bg: 'bg-red-100',
    lightBg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700'
};

const DURATION_OPTIONS = [
    { value: 15, label: '15 mins' },
    { value: 30, label: '30 mins' },
    { value: 45, label: '45 mins' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
];

const INITIAL_BREAKS: CalendarEvent[] = [
    {
        id: 'b1',
        title: 'Lunch Break',
        practitionerId: 'p1',
        type: 'break',
        startTime: new Date(new Date().setHours(12, 0, 0, 0)),
        endTime: new Date(new Date().setHours(13, 0, 0, 0)),
        notes: 'Office closed for lunch',
        color: '#EF4444'
    },
    {
        id: 'b2',
        title: 'Meeting',
        practitionerId: 'p2',
        type: 'break',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(15, 0, 0, 0)),
        notes: 'Staff meeting',
        color: '#EF4444'
    },
    {
        id: 'b3',
        title: 'Personal Break',
        practitionerId: 'p3',
        type: 'break',
        startTime: new Date(new Date().setHours(11, 0, 0, 0)),
        endTime: new Date(new Date().setHours(11, 30, 0, 0)),
        notes: '',
        color: '#EF4444'
    }
];

// ✅ CHANGED: Added is_rescheduled: false to all appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: 'a1',
        patientId: 'pt1',
        practitionerId: 'p1',
        serviceId: 's1',
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9, 30, 0, 0)),
        status: 'confirmed',
        is_rescheduled: false,
        notes: 'Regular checkup',
        type: 'appointment'
    },
    {
        id: 'a2',
        patientId: 'pt2',
        practitionerId: 'p1',
        serviceId: 's2',
        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
        endTime: new Date(new Date().setHours(10, 45, 0, 0)),
        status: 'pending',
        is_rescheduled: false,
        notes: 'First cleaning in 6 months',
        type: 'appointment'
    },
    {
        id: 'a3',
        patientId: 'pt3',
        practitionerId: 'p2',
        serviceId: 's3',
        startTime: new Date(new Date().setHours(9, 30, 0, 0)),
        endTime: new Date(new Date().setHours(11, 0, 0, 0)),
        status: 'pending',
        is_rescheduled: false,
        notes: 'Teeth pain',
        type: 'appointment'
    },
    {
        id: 'a4',
        patientId: 'pt4',
        practitionerId: 'p2',
        serviceId: 's4',
        startTime: new Date(new Date().setHours(11, 30, 0, 0)),
        endTime: new Date(new Date().setHours(12, 30, 0, 0)),
        status: 'confirmed',
        is_rescheduled: false,
        notes: 'Whitening treatment',
        type: 'appointment'
    },
    {
        id: 'a5',
        patientId: 'pt5',
        practitionerId: 'p3',
        serviceId: 's5',
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9, 45, 0, 0)),
        status: 'completed',
        is_rescheduled: false,
        notes: 'Initial consultation for braces',
        type: 'appointment'
    },
    {
        id: 'a6',
        patientId: 'pt1',
        practitionerId: 'p3',
        serviceId: 's6',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(14, 30, 0, 0)),
        status: 'pending',
        is_rescheduled: false,
        notes: 'Small cavity filling',
        type: 'appointment'
    },
    {
        id: 'a7',
        patientId: 'pt2',
        practitionerId: 'p1',
        serviceId: 's7',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(15, 0, 0, 0)),
        status: 'confirmed',
        is_rescheduled: false,
        notes: 'Crown fitting for molar',
        type: 'appointment'
    },
    {
        id: 'a8',
        patientId: 'pt3',
        practitionerId: 'p3',
        serviceId: 's8',
        startTime: new Date(new Date().setHours(15, 30, 0, 0)),
        endTime: new Date(new Date().setHours(16, 0, 0, 0)),
        status: 'cancelled',
        is_rescheduled: false,
        notes: 'Emergency - patient cancelled',
        type: 'appointment'
    },
];

// --- Helpers ---

const START_HOUR = 8;
const END_HOUR = 18;

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
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

const toTimeString = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const setTimeOnDate = (dateBase: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(dateBase);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
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
    const startTotal = startHours * 60 + startMins;
    const endTotal = endHours * 60 + endMins;
    return endTotal - startTotal;
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// --- Check for time overlap ---
const checkTimeOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): boolean => {
    return (start1 < end2) && (end1 > start2);
};

// --- Patient Tags Component ---
const PatientTags = ({
    isNewPatient,
    isDependent,
    size = 'default'
}: {
    isNewPatient?: boolean;
    isDependent?: boolean;
    size?: 'small' | 'default'
}) => {
    if (!isNewPatient && !isDependent) return null;

    const sizeClasses = size === 'small'
        ? "px-1.5 py-0.5 text-[9px]"
        : "px-2 py-0.5 text-[10px]";

    return (
        <div className="flex items-center gap-1">
            {isNewPatient && (
                <span className={`inline-flex items-center ${sizeClasses} bg-gray-900 text-white font-medium rounded leading-none`}>
                    NEW
                </span>
            )}
            {isDependent && (
                <span className={`inline-flex items-center gap-0.5 ${sizeClasses} bg-blue-600 text-white font-medium rounded leading-none`}>
                    DEPENDENT
                </span>
            )}
        </div>
    );
};

// --- Status Badge Component ---
// ✅ CHANGED: Removed 'rescheduled' status, added is_rescheduled prop with ring indicator
interface StatusBadgeProps {
    status: Appointment['status'];
    size?: 'sm' | 'md';
    is_rescheduled?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', is_rescheduled = false }) => {
    const statusStyles = {
        'confirmed': 'bg-green-100 text-green-700 border-green-200',
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };

    const statusLabels = {
        'confirmed': 'Confirmed',
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
    };

    const statusIcons = {
        'confirmed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'pending': <Activity size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'completed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'cancelled': <X size={size === 'sm' ? 10 : 12} className="mr-1" />,
    };

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-[10px]'
        : 'px-2.5 py-1 text-xs';

    // ✅ CHANGED: Added ring indicator for rescheduled appointments (matching Online Bookings)
    const rescheduledClasses = is_rescheduled ? 'ring-2 ring-blue-400 ring-offset-1' : '';

    return (
        <span className={`inline-flex items-center rounded-full font-semibold border ${statusStyles[status]} ${sizeClasses} ${rescheduledClasses}`}>
            {statusIcons[status]}
            {statusLabels[status]}
        </span>
    );
};

// --- Custom Hook for Screen Size ---
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: false,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isLaptop: width >= 1024 && width < 1280,
                isDesktop: width >= 1280,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};

// --- Time Picker Component ---
interface TimePickerProps {
    startTime: string;
    endTime: string;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
    hasConflict?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    hasConflict = false
}) => {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

    const currentDuration = calculateDuration(startTime, endTime);
    const matchingDuration = DURATION_OPTIONS.find(d => d.value === currentDuration);

    const handleDurationClick = (minutes: number) => {
        setSelectedDuration(minutes);
        const newEndTime = addMinutesToTimeString(startTime, minutes);
        onEndTimeChange(newEndTime);
    };

    const handleStartTimeChange = (newStartTime: string) => {
        onStartTimeChange(newStartTime);
        if (selectedDuration) {
            const newEndTime = addMinutesToTimeString(newStartTime, selectedDuration);
            onEndTimeChange(newEndTime);
        }
    };

    const handleEndTimeChange = (newEndTime: string) => {
        onEndTimeChange(newEndTime);
        const newDuration = calculateDuration(startTime, newEndTime);
        const matching = DURATION_OPTIONS.find(d => d.value === newDuration);
        setSelectedDuration(matching ? matching.value : null);
    };

    const inputBorderClass = hasConflict
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20';

    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Select Time
            </label>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => handleStartTimeChange(e.target.value)}
                            className={`w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => handleEndTimeChange(e.target.value)}
                            className={`w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${inputBorderClass}`}
                        />
                    </div>
                </div>
            </div>

            {currentDuration > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">Duration:</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${hasConflict ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {currentDuration >= 60
                            ? `${Math.floor(currentDuration / 60)}h ${currentDuration % 60 > 0 ? `${currentDuration % 60}m` : ''}`
                            : `${currentDuration} mins`
                        }
                    </span>
                </div>
            )}

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((duration) => {
                        const isSelected = selectedDuration === duration.value ||
                            (matchingDuration?.value === duration.value && !selectedDuration);

                        return (
                            <button
                                key={duration.value}
                                type="button"
                                onClick={() => handleDurationClick(duration.value)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                                    ${isSelected
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                    }
                                `}
                            >
                                {duration.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PRACTICE_OPEN_TIME = "08:00";
const PRACTICE_CLOSE_TIME = "19:00"; 

interface BreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (id: string) => void;
    initialData: Partial<CalendarEvent> | null;
    selectedDate: Date;
    activePractitionerId: string;
    appointments: Appointment[];
    existingBreaks: CalendarEvent[];
}

const BreakModal: React.FC<BreakModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialData,
    selectedDate,
    activePractitionerId,
    appointments,
    existingBreaks
}) => {
    const isEditMode = !!initialData?.id;
    const activePractitioner = PRACTITIONERS.find(p => p.id === activePractitionerId);

    const [title, setTitle] = useState(initialData?.title || 'Break');

    const defaultStart = initialData?.startTime ? toTimeString(initialData.startTime) : "12:00";
    const defaultEnd = initialData?.endTime ? toTimeString(initialData.endTime) : "13:00";

    const [startTimeStr, setStartTimeStr] = useState(defaultStart);
    const [endTimeStr, setEndTimeStr] = useState(defaultEnd);
    const [notes, setNotes] = useState(initialData?.notes || '');

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || 'Break');
            setStartTimeStr(initialData?.startTime ? toTimeString(initialData.startTime) : "12:00");
            setEndTimeStr(initialData?.endTime ? toTimeString(initialData.endTime) : "13:00");
            setNotes(initialData?.notes || '');
        }
    }, [isOpen, initialData]);

    // Get appointments for the selected day and practitioner
    const dayAppointments = useMemo(() => {
        return appointments.filter(a =>
            a.practitionerId === activePractitionerId &&
            isSameDay(a.startTime, selectedDate) &&
            a.status !== 'cancelled'
        ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [appointments, activePractitionerId, selectedDate]);

    // Get existing breaks
    const dayBreaks = useMemo(() => {
        return existingBreaks.filter(b =>
            b.practitionerId === activePractitionerId &&
            isSameDay(b.startTime, selectedDate) &&
            b.id !== initialData?.id
        ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [existingBreaks, activePractitionerId, selectedDate, initialData?.id]);

    // 1. Check for Appointment/Break Overlaps
    const conflictingAppointments = useMemo(() => {
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr);
        const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);

        return dayAppointments.filter(appt =>
            checkTimeOverlap(proposedStart, proposedEnd, appt.startTime, appt.endTime)
        );
    }, [dayAppointments, selectedDate, startTimeStr, endTimeStr]);

    const conflictingBreaks = useMemo(() => {
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr);
        const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);

        return dayBreaks.filter(breakEvent =>
            checkTimeOverlap(proposedStart, proposedEnd, breakEvent.startTime, breakEvent.endTime)
        );
    }, [dayBreaks, selectedDate, startTimeStr, endTimeStr]);

    // 2. NEW LOGIC: Check if time is within Operating Hours
    const isOutsideOperatingHours = useMemo(() => {
        
        const openTime = setTimeOnDate(selectedDate, PRACTICE_OPEN_TIME);
        const closeTime = setTimeOnDate(selectedDate, PRACTICE_CLOSE_TIME);
        
        const proposedStart = setTimeOnDate(selectedDate, startTimeStr);
        const proposedEnd = setTimeOnDate(selectedDate, endTimeStr);

        // Check if start is before opening OR end is after closing
        return proposedStart < openTime || proposedEnd > closeTime;
    }, [selectedDate, startTimeStr, endTimeStr]);

    // Update 'hasConflict' to include the hours check
    const hasConflict = conflictingAppointments.length > 0 || conflictingBreaks.length > 0 || isOutsideOperatingHours;
    const hasValidDuration = calculateDuration(startTimeStr, endTimeStr) > 0;

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (hasConflict) return;

        const start = setTimeOnDate(selectedDate, startTimeStr);
        const end = setTimeOnDate(selectedDate, endTimeStr);

        if (end <= start) return alert("End time must be after start time");

        onSave({
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
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
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base sm:text-lg">{isEditMode ? 'Edit Break' : 'New Break'}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-white rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                        {/* Title & Practitioner Inputs (Same as before) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Lunch Break, Meeting..."
                                className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                Practitioner
                            </label>
                            <div className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center gap-2 cursor-not-allowed select-none">
                                <User size={16} className="text-gray-400" />
                                <span className="font-medium text-gray-700">{activePractitioner?.name || 'Unknown Practitioner'}</span>
                            </div>
                        </div>

                        <TimePicker
                            startTime={startTimeStr}
                            endTime={endTimeStr}
                            onStartTimeChange={setStartTimeStr}
                            onEndTimeChange={setEndTimeStr}
                            hasConflict={hasConflict}
                        />

                        {/* --- ERROR: OUTSIDE OPERATING HOURS --- */}
                        {isOutsideOperatingHours && (
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl animate-in fade-in slide-in-from-top-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-orange-800 mb-1">Outside Operating Hours</p>
                                        <p className="text-xs text-orange-700">
                                            The practice is closed during this time. Please select a time between <strong>{PRACTICE_OPEN_TIME}</strong> and <strong>{PRACTICE_CLOSE_TIME}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- ERROR: OVERLAP CONFLICTS --- */}
                        {(conflictingAppointments.length > 0 || conflictingBreaks.length > 0) && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle size={18} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-700 mb-2">Time Conflict Detected</p>
                                        <p className="text-xs text-red-600 mb-3">
                                            The selected time overlaps with existing appointments or breaks.
                                        </p>
                                        
                                        {/* (List of conflicts - Same as your previous code) */}
                                        {conflictingAppointments.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-red-700">Conflicting Appointments:</p>
                                                {conflictingAppointments.map(appt => {
                                                    const patient = PATIENTS.find(p => p.id === appt.patientId);
                                                    return (
                                                        <div key={appt.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-red-100">
                                                            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-gray-800 truncate">{patient?.name}</p>
                                                                <p className="text-[10px] text-gray-500">
                                                                    {formatTime(appt.startTime)} - {formatTime(appt.endTime)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success State (No conflicts) */}
                        {!hasConflict && dayAppointments.length === 0 && dayBreaks.length === 0 && (
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Check size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Valid Time</p>
                                        <p className="text-xs text-green-600">This time slot is available.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                Notes
                            </label>
                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes..."
                                className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={() => { onDelete(initialData!.id!); onClose(); }}
                                    className="p-2 sm:p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={hasConflict || !hasValidDuration}
                                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 font-medium rounded-lg shadow-md transition-all text-sm flex items-center justify-center gap-2 ${hasConflict || !hasValidDuration
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {isEditMode ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Updated Reschedule Modal Component ---
interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    appointments: Appointment[];
    breaks: CalendarEvent[];
    onReschedule: (appointmentId: string, newDate: Date, newStartTime: Date, newEndTime: Date, newPractitionerId: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    appointment,
    appointments,
    breaks,
    onReschedule
}) => {
    // 1. Hooks always call first
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [isPractitionerDropdownOpen, setIsPractitionerDropdownOpen] = useState(false);
    const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());

    // 2. Effects
    useEffect(() => {
        if (isOpen && appointment) {
            setSelectedDate(toDateString(appointment.startTime));
            setSelectedTimeSlot('');
            setSelectedPractitionerId(appointment.practitionerId);
            setReason('');
            setCalendarViewDate(new Date(appointment.startTime));
        }
    }, [isOpen, appointment]);

    // 3. Derived values (Safe for hooks)
    const durationMinutes = useMemo(() => {
        if (!appointment) return 0;
        return calculateDuration(toTimeString(appointment.startTime), toTimeString(appointment.endTime));
    }, [appointment]);

    // Calendar helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(calendarViewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCalendarViewDate(newDate);
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Disable past dates
        if (date < today) return true;
        // Optionally disable Sundays
        // if (date.getDay() === 0) return true;
        return false;
    };

    // Generate available slots for a specific date
    const getAvailableSlotsForDate = useMemo(() => {
        return (dateStr: string): string[] => {
            if (!appointment || !dateStr || !selectedPractitionerId) return [];

            const slots: string[] = [];
            const dateObj = new Date(dateStr);
            const today = new Date();

            // Generate slots every 30 minutes from start to end hour
            for (let hour = START_HOUR; hour < END_HOUR; hour++) {
                for (let min = 0; min < 60; min += 30) {
                    const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

                    // Check for collisions
                    const slotStart = setTimeOnDate(dateObj, timeStr);
                    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

                    // Skip past time slots for today
                    if (isSameDay(dateObj, today) && slotStart <= today) {
                        continue;
                    }

                    const isCollidingAppt = appointments.some(appt => {
                        if (appt.id === appointment.id) return false;
                        if (appt.practitionerId !== selectedPractitionerId) return false;
                        if (!isSameDay(appt.startTime, dateObj)) return false;

                        return checkTimeOverlap(slotStart, slotEnd, appt.startTime, appt.endTime);
                    });

                    // Check against Breaks
                    const isCollidingBreak = breaks.some(breakEvent => {
                        if (breakEvent.practitionerId !== selectedPractitionerId) return false;
                        if (!isSameDay(breakEvent.startTime, dateObj)) return false;
                        return checkTimeOverlap(slotStart, slotEnd, breakEvent.startTime, breakEvent.endTime);
                    });

                    if (!isCollidingAppt && !isCollidingBreak) {
                        slots.push(timeStr);
                    }
                }
            }
            return slots;
        };
    }, [appointments, breaks, appointment, durationMinutes, selectedPractitionerId]);

    // Generate 7 days of availability starting from selected date
    const weekAvailability = useMemo(() => {
        if (!selectedDate) return [];

        const startDate = new Date(selectedDate);
        const days: { date: Date; dateStr: string; slots: string[] }[] = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(startDate, i);
            const dateStr = toDateString(currentDate);

            // Skip past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (currentDate < today) continue;

            const slots = getAvailableSlotsForDate(dateStr);
            days.push({
                date: currentDate,
                dateStr,
                slots
            });
        }

        return days;
    }, [selectedDate, getAvailableSlotsForDate]);

    // 5. Conditional Return (Must be AFTER hooks)
    if (!isOpen || !appointment) return null;

    // 6. Rest of variables
    const patient = PATIENTS.find(p => p.id === appointment.patientId);
    const service = SERVICES.find(s => s.id === appointment.serviceId);
    const selectedPractitioner = PRACTITIONERS.find(p => p.id === selectedPractitionerId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTimeSlot || !selectedDate) return alert("Please select a time slot");

        const newDate = new Date(selectedDate);
        const newStartTime = setTimeOnDate(newDate, selectedTimeSlot);
        const newEndTime = new Date(newStartTime.getTime() + durationMinutes * 60000);

        onReschedule(appointment.id, newDate, newStartTime, newEndTime, selectedPractitionerId);
        onClose();
    };

    const handleSlotSelect = (dateStr: string, time: string) => {
        setSelectedDate(dateStr);
        setSelectedTimeSlot(time);
    };

    // Generate Calendar Grid
    const renderCalendar = () => {
        const year = calendarViewDate.getFullYear();
        const month = calendarViewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = toDateString(dateObj);
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const disabled = isDateDisabled(dateObj);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => {
                        if (!disabled) {
                            setSelectedDate(dateStr);
                            setSelectedTimeSlot('');
                        }
                    }}
                    disabled={disabled}
                    className={`
                        h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                        ${isSelected && !disabled
                            ? 'bg-blue-600 text-white font-bold shadow-md'
                            : !disabled ? 'hover:bg-gray-100 text-gray-700' : ''
                        }
                        ${isToday && !isSelected && !disabled ? 'text-blue-600 font-bold ring-2 ring-blue-200' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Format time for display
    const formatTimeDisplay = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden w-full max-w-5xl flex flex-col">

                {/* Header */}
                <div className="px-4 sm:px-6 py-4 bg-white border-b flex justify-between items-center z-10 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-800 text-lg">Reschedule Appointment</h3>
                            <PatientTags isNewPatient={patient?.isNewPatient} isDependent={patient?.isDependent} size="small" />
                        </div>
                        <p className="text-sm text-gray-500">
                            {patient?.name} • {service?.name} ({durationMinutes} mins)
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-1 overflow-hidden">

                        {/* LEFT COLUMN: Calendar & Practitioner */}
                        <div className="w-full md:w-[320px] lg:w-[360px] bg-gradient-to-b from-gray-50 to-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col p-4 sm:p-6 flex-shrink-0 overflow-y-auto">

                            {/* Full Calendar */}
                            <div className="mb-6">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-800 text-base">
                                        {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h4>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(-1)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(1)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                        <span
                                            key={i}
                                            className={`text-xs font-semibold h-8 flex items-center justify-center ${i === 0 ? 'text-red-400' : 'text-gray-400'
                                                }`}
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {renderCalendar()}
                                </div>

                            </div>

                            {/* Practitioner Section */}
                            <div className="mt-auto">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    <User size={14} />
                                    Practitioner
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsPractitionerDropdownOpen(!isPractitionerDropdownOpen)}
                                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-blue-100">
                                            <User size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{selectedPractitioner?.name}</p>
                                        </div>
                                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isPractitionerDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isPractitionerDropdownOpen && (
                                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 max-h-48 overflow-y-auto">
                                            {PRACTITIONERS.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPractitionerId(p.id);
                                                        setIsPractitionerDropdownOpen(false);
                                                        setSelectedTimeSlot('');
                                                    }}
                                                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 ${selectedPractitionerId === p.id ? 'bg-blue-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User size={16} className="text-gray-500" />
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${selectedPractitionerId === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</p>
                                                        <p className="text-xs text-gray-500">{p.role}</p>
                                                    </div>
                                                    {selectedPractitionerId === p.id && <Check size={16} className="text-blue-600 flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: 7-Day Time Slots */}
                        <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
                            {/* Header */}
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Available Time Slots</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Showing 7 days from {selectedDate ? formatDate(new Date(selectedDate)) : 'selected date'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Slots Grid - 7 Days View */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                {weekAvailability.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                                        <CalendarIcon size={48} className="mb-4 opacity-50" />
                                        <p className="font-medium">Select a date to view availability</p>
                                        <p className="text-sm mt-1">Choose a date from the calendar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {weekAvailability.map((dayData) => {
                                            const isSelectedDay = selectedDate === dayData.dateStr;
                                            const isToday = isSameDay(dayData.date, new Date());

                                            return (
                                                <div
                                                    key={dayData.dateStr}
                                                    className={`rounded-xl border transition-all ${isSelectedDay
                                                        ? 'border-blue-200 bg-blue-50/30'
                                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    {/* Day Header */}
                                                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isSelectedDay ? 'border-blue-100' : 'border-gray-100'
                                                        }`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${isToday
                                                                ? 'bg-blue-600 text-white'
                                                                : isSelectedDay
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                <span className="text-[10px] font-bold uppercase leading-none">
                                                                    {dayData.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                                </span>
                                                                <span className="text-sm font-bold leading-none mt-0.5">
                                                                    {dayData.date.getDate()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 text-sm">
                                                                    {dayData.date.toLocaleDateString('en-US', { weekday: 'long' })}
                                                                    {isToday && (
                                                                        <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                                            Today
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {dayData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${dayData.slots.length > 0
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {dayData.slots.length} {dayData.slots.length === 1 ? 'slot' : 'slots'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Time Slots */}
                                                    <div className="p-4">
                                                        {dayData.slots.length === 0 ? (
                                                            <div className="flex items-center justify-center py-4 text-gray-400">
                                                                <Clock size={16} className="mr-2 opacity-50" />
                                                                <span className="text-sm">No available slots</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {dayData.slots.map((time) => {
                                                                    const isSelected = selectedDate === dayData.dateStr && selectedTimeSlot === time;

                                                                    return (
                                                                        <button
                                                                            key={`${dayData.dateStr}-${time}`}
                                                                            type="button"
                                                                            onClick={() => handleSlotSelect(dayData.dateStr, time)}
                                                                            className={`
                                                                                px-3 py-2 rounded-lg text-sm font-medium transition-all border
                                                                                ${isSelected
                                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                                                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                                                                                }
                                                                            `}
                                                                        >
                                                                            {formatTimeDisplay(time)}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                {/* Reason Input */}
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Reason for Reschedule (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="e.g., Schedule conflict, personal reasons..."
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                                    {/* Selected Time Summary */}
                                    <div className="text-sm">
                                        {selectedTimeSlot && selectedDate ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <Check size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">New Time</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(new Date(selectedDate))} at {formatTimeDisplay(selectedTimeSlot)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Select a time slot to continue</span>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!selectedTimeSlot || !selectedDate}
                                            className={`flex-1 sm:flex-none px-6 py-2.5 font-medium rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${selectedTimeSlot && selectedDate
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            Confirm Reschedule
                                        </button>
                                    </div>
                                </div>
                            </div>
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
    onUpdateStatus: (id: string, status: Appointment['status']) => void;
    onOpenReschedule: (appointment: Appointment) => void;
}

// ✅ CHANGED: Added 'reschedule' as a dropdown action (not a status)
type DropdownAction = Appointment['status'] | 'reschedule';

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
    isOpen,
    onClose,
    appointment,
    onUpdateStatus,
    onOpenReschedule
}) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset dropdown state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setIsStatusDropdownOpen(false);
        }
    }, [isOpen]);

    if (!isOpen || !appointment) return null;

    const patient = PATIENTS.find(p => p.id === appointment.patientId);
    const practitioner = PRACTITIONERS.find(p => p.id === appointment.practitionerId);
    const service = SERVICES.find(s => s.id === appointment.serviceId);

    // ✅ CHANGED: Removed 'rescheduled' from isFinalStatus — only truly terminal states
    const isFinalStatus = ['completed', 'cancelled'].includes(appointment.status);

    // ✅ CHANGED: handleActionClick replaces handleStatusClick
    const handleActionClick = (action: DropdownAction) => {
        if (action === 'reschedule') {
            onOpenReschedule(appointment);
            onClose();
        } else {
            onUpdateStatus(appointment.id, action);
        }
        setIsStatusDropdownOpen(false);
    };

    // ✅ CHANGED: Dynamic actions based on status, reschedule only if not already rescheduled
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

    // ✅ CHANGED: Config now uses DropdownAction (includes 'reschedule' action, removed 'rescheduled' status)
    const statusConfig: Record<DropdownAction, { bg: string; icon: React.ElementType }> = {
        'reschedule': { bg: 'bg-blue-500', icon: RefreshCw },
        'confirmed': { bg: 'bg-green-500', icon: Check },
        'pending': { bg: 'bg-amber-500', icon: Clock },
        'completed': { bg: 'bg-emerald-600', icon: Check },
        'cancelled': { bg: 'bg-red-500', icon: X },
    };

    const CurrentStatusIcon = statusConfig[appointment.status]?.icon || Clock;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-h-auto overflow-hidden w-full sm:w-[500px]">

                {/* Colored Header Banner */}
                <div
                    className="h-24 relative"
                    style={{
                        background: `linear-gradient(135deg, ${service?.color}dd 100%, ${service?.color}99 100%)`
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 bg-white/30 hover:bg-white/50 text-black rounded-full transition-all backdrop-blur-sm"
                    >
                        <X size={18} />
                    </button>

                    {/* Service Badge */}
                    <div className="absolute mt-5 left-6">
                        <span className="px-3 py-1 bg-black/25 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {service?.name}
                        </span>
                    </div>
                </div>

                {/* Profile Card - Overlapping Header */}
                <div className="px-4 sm:px-6 -mt-10 relative z-10">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                        <div className="flex items-start gap-4">
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={patient?.profilePicture || 'https://via.placeholder.com/80'}
                                    alt={patient?.name}
                                    className="w-16 h-16 rounded-xl object-cover ring-4 ring-white shadow-md"
                                />
                                <div
                                    className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusConfig[appointment.status]?.bg} rounded-full flex items-center justify-center ring-2 ring-white`}
                                >
                                    <CurrentStatusIcon size={10} className="text-white" />
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                                {patient?.name}
                                            </h4>
                                            <PatientTags isNewPatient={patient?.isNewPatient} isDependent={patient?.isDependent} size="small" />
                                        </div>
                                        {patient?.dateOfBirth && (
                                            <p className="text-sm text-gray-500">
                                                {calculateAge(patient.dateOfBirth)} years old
                                            </p>
                                        )}
                                        <span className="text-sm text-gray-700">{patient?.phone}</span>
                                    </div>

                                    {/* Status with Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => !isFinalStatus && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            disabled={isFinalStatus}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isFinalStatus
                                                ? 'cursor-default'
                                                : 'hover:shadow-md cursor-pointer'
                                                }`}
                                            style={{
                                                backgroundColor: `${service?.color}15`,
                                                color: service?.color
                                            }}
                                        >
                                            {/* ✅ CHANGED: Pass is_rescheduled to StatusBadge */}
                                            <StatusBadge status={appointment.status} size="sm" is_rescheduled={appointment.is_rescheduled} />
                                            {!isFinalStatus && (
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                                                />
                                            )}
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isStatusDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                                <div className="p-2 bg-gray-100 border-b border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider px-2">
                                                        Update Status
                                                    </p>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {/* ✅ CHANGED: Uses availableActions (includes 'reschedule' action) */}
                                                    {availableActions.map((action) => {
                                                        const isCurrentStatus = appointment.status === action;
                                                        const ActionIcon = statusConfig[action]?.icon || Clock;

                                                        return (
                                                            <button
                                                                key={action}
                                                                onClick={() => handleActionClick(action)}
                                                                disabled={isCurrentStatus}
                                                                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${isCurrentStatus
                                                                    ? 'bg-gray-100 cursor-not-allowed'
                                                                    : 'hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                <div className={`w-7 h-7 ${statusConfig[action]?.bg} rounded-lg flex items-center justify-center`}>
                                                                    <ActionIcon size={14} className="text-white" />
                                                                </div>
                                                                <span className={`text-sm font-medium ${isCurrentStatus ? 'text-gray-400' : 'text-gray-700'}`}>
                                                                    {action.charAt(0).toUpperCase() + action.slice(1).replace('-', ' ')}
                                                                </span>
                                                                {isCurrentStatus && (
                                                                    <Check size={16} className="ml-auto text-green-500" />
                                                                )}
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

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-220px)] px-4 sm:px-6 py-5 space-y-5">

                    {/* ✅ CHANGED: Rescheduled Info — now checks is_rescheduled flag instead of status */}
                    {appointment.is_rescheduled && appointment.rescheduledFrom && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <RefreshCw size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Rescheduled From</p>
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {formatDate(appointment.rescheduledFrom.date)} • {PRACTITIONERS.find(p => p.id === appointment.rescheduledFrom?.practitionerId)?.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Card */}
                        <div className="p-3 bg-gradient-to-br from-violet-50 via-purple-100 to-purple-50 rounded-xl border border-violet-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <CalendarIcon size={16} className="text-violet-600" />
                                </div>
                                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Date</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                                {appointment.startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Time Card */}
                        <div className="p-3 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Clock size={16} className="text-amber-600" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Time</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </p>
                        </div>
                    </div>

                    {/* Practitioner Card */}
                    <div className="p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Practitioner</p>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="font-semibold text-gray-800">{practitioner?.name}</p>
                                <p className="text-xs text-gray-500">{practitioner?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    {/* <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Contact Details</p>
                        <div className="space-y-2">
                            <a href={`mailto:${patient?.email}`} className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group">
                                <div className="w-9 h-9 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                                    <Mail size={16} className="text-blue-500" />
                                </div>
                                <span className="text-sm text-gray-700">{patient?.email}</span>
                            </a>
                            <a href={`tel:${patient?.phone}`} className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group">
                                <div className="w-9 h-9 bg-green-50 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors">
                                    <Phone size={16} className="text-green-500" />
                                </div>
                                <span className="text-sm text-gray-700">{patient?.phone}</span>
                            </a>
                            {patient?.address && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
                                        <MapPin size={16} className="text-rose-500" />
                                    </div>
                                    <span className="text-sm text-gray-700">{patient.address}</span>
                                </div>
                            )}
                        </div>
                    </div> */}

                    {/* Notes Section */}
                    {appointment.notes && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Notes</p>
                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                <p className="text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:px-6 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-all shadow-md shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Service Legend Component ---
const ServiceLegend: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <div className="flex -space-x-1">
                    {SERVICES.slice(0, 4).map((service) => (
                        <div
                            key={service.id}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: service.color }}
                        />
                    ))}
                </div>
                <span className="hidden sm:inline">Services</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-3">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Colors</div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {SERVICES.map((service) => (
                                <div key={service.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: service.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{service.name}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                <div className="flex items-center gap-3 p-2">
                                    <div className="w-4 h-4 rounded-full flex-shrink-0 bg-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Break</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// --- Main Calendar Component ---

const PracticeBookingCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [breaks, setBreaks] = useState<CalendarEvent[]>(INITIAL_BREAKS);
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [activePractitionerId, setActivePractitionerId] = useState<string>(PRACTITIONERS[0].id);

    const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const [editingBreak, setEditingBreak] = useState<Partial<CalendarEvent> | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
    const [selectedDayForModal, setSelectedDayForModal] = useState<Date>(new Date());
    // const [selectedSlotTime, setSelectedSlotTime] = useState({ hour: 9, minutes: 0 });
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const { isMobile, isTablet } = useScreenSize();

    const CELL_HEIGHT = isMobile ? 80 : isTablet ? 100 : 120;
    const MINUTE_HEIGHT = CELL_HEIGHT / 60;

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
    const timeSlots = useMemo(() => generateTimeSlots(), []);
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i)), [startOfWeek]);

    const visibleDays = isMobile ? [weekDays[selectedDayIndex]] : weekDays;

    const displayedBreaks = useMemo(() => {
        return breaks.filter(e => e.practitionerId === activePractitionerId);
    }, [breaks, activePractitionerId]);

    const displayedAppointments = useMemo(() => {
        return appointments.filter(a => a.practitionerId === activePractitionerId);
    }, [appointments, activePractitionerId]);

    const handlePrevWeek = () => {
        if (isMobile) {
            if (selectedDayIndex === 0) {
                setCurrentDate(addDays(currentDate, -7));
                setSelectedDayIndex(6);
            } else {
                setSelectedDayIndex(selectedDayIndex - 1);
            }
        } else {
            setCurrentDate(addDays(currentDate, -7));
        }
    };

    const handleNextWeek = () => {
        if (isMobile) {
            if (selectedDayIndex === 6) {
                setCurrentDate(addDays(currentDate, 7));
                setSelectedDayIndex(0);
            } else {
                setSelectedDayIndex(selectedDayIndex + 1);
            }
        } else {
            setCurrentDate(addDays(currentDate, 7));
        }
    };

    // const handleToday = () => {
    //     setCurrentDate(new Date());
    //     const today = new Date();
    //     const startWeek = getStartOfWeek(today);
    //     const dayIndex = Math.floor((today.getTime() - startWeek.getTime()) / (1000 * 60 * 60 * 24));
    //     setSelectedDayIndex(Math.max(0, Math.min(6, dayIndex)));
    // };

    // --- REPLACED SLOT MODAL WITH DIRECT BREAK MODAL ---
    const handleSlotClick = (day: Date, hour: number, minutes: number) => {
        const clickedTime = new Date(day);
        clickedTime.setHours(hour, minutes, 0, 0);

        const endTime = new Date(clickedTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        setEditingBreak({
            startTime: clickedTime,
            endTime: endTime,
            type: 'break',
            practitionerId: activePractitionerId,
            color: BREAK_COLOR.value
        });

        setSelectedDayForModal(clickedTime);
        setIsBreakModalOpen(true);
    };

    const handleBreakClick = (breakEvent: CalendarEvent) => {
        setEditingBreak(breakEvent);
        setSelectedDayForModal(breakEvent.startTime);
        setIsBreakModalOpen(true);
    };

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsAppointmentModalOpen(true);
    };

    const handleSaveBreak = (savedBreak: CalendarEvent) => {
        setBreaks(prev => {
            const exists = prev.find(e => e.id === savedBreak.id);
            return exists ? prev.map(e => e.id === savedBreak.id ? savedBreak : e) : [...prev, savedBreak];
        });
    };

    const handleDeleteBreak = (id: string) => {
        if (window.confirm("Delete this break?")) {
            setBreaks(prev => prev.filter(e => e.id !== id));
        }
    };

    const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
        setAppointments(prev => prev.map(a =>
            a.id === id ? { ...a, status } : a
        ));
        if (selectedAppointment?.id === id) {
            setSelectedAppointment(prev => prev ? { ...prev, status } : null);
        }
    };

    const handleOpenReschedule = (appointment: Appointment) => {
        setRescheduleAppointment(appointment);
        setIsRescheduleModalOpen(true);
    };

    // ✅ CHANGED: Reschedule now sets status to 'confirmed' + is_rescheduled: true (matching Online Bookings flow)
    const handleReschedule = (
        appointmentId: string,
        _newDate: Date,
        newStartTime: Date,
        newEndTime: Date,
        newPractitionerId: string
    ) => {
        setAppointments(prev => prev.map(a => {
            if (a.id === appointmentId) {
                return {
                    ...a,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    practitionerId: newPractitionerId,
                    status: 'confirmed' as const,
                    is_rescheduled: true,
                    rescheduledFrom: {
                        date: a.startTime,
                        practitionerId: a.practitionerId
                    }
                };
            }
            return a;
        }));

        if (selectedAppointment?.id === appointmentId) {
            setSelectedAppointment(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    practitionerId: newPractitionerId,
                    status: 'confirmed' as const,
                    is_rescheduled: true,
                    rescheduledFrom: {
                        date: prev.startTime,
                        practitionerId: prev.practitionerId
                    }
                };
            });
        }
    };

    const timeColumnWidth = isMobile ? 'w-14' : 'w-20';

    return (
        <div>
            <div className="flex flex-col flex-1 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-white border-b border-gray-400 gap-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <CalendarIcon className="text-orange-500 hidden sm:block" size={isMobile ? 20 : 28} />
                            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
                                {isMobile
                                    ? weekDays[selectedDayIndex].toLocaleDateString('default', { month: 'short', day: 'numeric' })
                                    : `${startOfWeek.toLocaleString('default', { month: 'long' })} ${startOfWeek.getFullYear()}`
                                }
                            </h2>
                        </div>

                        <div className="flex items-center rounded-lg border border-gray-400 p-0.5 bg-white">
                            <button onClick={handlePrevWeek} className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                                <ChevronLeft size={isMobile ? 16 : 20} />
                            </button>
                            <button onClick={handleNextWeek} className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                                <ChevronRight size={isMobile ? 16 : 20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 ml-0 sm:ml-4">
                            <span className="text-sm font-semibold text-gray-500 hidden sm:block">
                                Practitioner:
                            </span>
                            <div className="relative">
                                <select
                                    value={activePractitionerId}
                                    onChange={(e) => setActivePractitionerId(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer min-w-[160px]"
                                >
                                    {PRACTITIONERS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <User size={16} className="absolute left-3 top-1/4 text-gray-400" />
                                <ChevronDown size={16} className="absolute right-3 top-1/4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <ServiceLegend />
                </div>

                {/* Mobile Day Selector */}
                {isMobile && (
                    <div className="flex overflow-x-auto py-2 px-2 bg-gray-50 border-b border-gray-200 gap-1">
                        {weekDays.map((day, index) => {
                            const isToday = isSameDay(day, new Date());
                            const isSelected = index === selectedDayIndex;
                            const dayAppointments = appointments.filter(a =>
                                a.practitionerId === activePractitionerId && isSameDay(a.startTime, day)
                            );
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDayIndex(index)}
                                    className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-lg transition-all relative ${isSelected
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : isToday
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-[10px] font-medium uppercase">
                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-sm font-bold">{day.getDate()}</span>
                                    {dayAppointments.length > 0 && (
                                        <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center ${isSelected ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'
                                            }`}>
                                            {dayAppointments.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto relative" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9' }}>
                    <div className={`${isMobile ? 'min-w-full' : 'min-w-[800px] lg:min-w-[1000px]'} pb-6 sm:pb-10 calendar-container`}>
                        {/* Day Headers */}
                        {!isMobile && (
                            <div className="flex border-b border-gray-400 sticky top-0 bg-white z-20">
                                <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white`}></div>
                                {visibleDays.map((day, index) => {
                                    const isToday = isSameDay(day, new Date());
                                    const dayAppointments = appointments.filter(a =>
                                        a.practitionerId === activePractitionerId && isSameDay(a.startTime, day)
                                    );
                                    return (
                                        <div key={index} className="flex-1 py-2 sm:py-3 lg:py-4 text-center border-r border-gray-400 last:border-r-0 relative">
                                            <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">
                                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className="flex justify-center">
                                                <div className={`text-base sm:text-lg lg:text-xl font-bold w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-800'
                                                    }`}>
                                                    {day.getDate()}
                                                </div>
                                            </div>
                                            {dayAppointments.length > 0 && (
                                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
                                                    {dayAppointments.length}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Grid Body */}
                        <div className="flex relative">
                            {/* Time Column */}
                            <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white z-10`}>
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot.hour}
                                        className="relative text-[10px] sm:text-[11px] font-medium text-gray-400 text-right pr-2 sm:pr-4 flex items-start justify-end"
                                        style={{ height: `${CELL_HEIGHT}px` }}
                                    >
                                        <span className="mt-[6px] sm:mt-[8px]">{slot.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Days Columns */}
                            {visibleDays.map((day, dayIndex) => {
                                const dayBreaks = displayedBreaks.filter(e => isSameDay(e.startTime, day));
                                const dayAppointments = displayedAppointments.filter(a => isSameDay(a.startTime, day));

                                return (
                                    <div key={dayIndex} className="flex-1 relative border-r border-gray-400 last:border-r-0">
                                        {/* Grid Lines */}
                                        {timeSlots.map((slot) => (
                                            <div key={slot.hour} className="relative w-full border-t border-gray-400" style={{ height: `${CELL_HEIGHT}px` }}>
                                                {[0, 15, 30, 45].map((minute) => (
                                                    <div
                                                        key={minute}
                                                        onClick={() => handleSlotClick(day, slot.hour, minute)}
                                                        className={`w-full cursor-pointer border border-dashed hover:bg-gray-100 transition-colors ${minute === 30 ? 'border-t border-gray-200 border-dashed' : ''
                                                            }`}
                                                        style={{ height: `${CELL_HEIGHT / 4}px` }}
                                                    />
                                                ))}
                                            </div>
                                        ))}

                                        {/* Appointments */}
                                        {dayAppointments.map((appointment) => {
                                            const startMinTotal = (appointment.startTime.getHours() - START_HOUR) * 60 + appointment.startTime.getMinutes();
                                            const durationMinutes = (appointment.endTime.getTime() - appointment.startTime.getTime()) / 60000;

                                            const top = startMinTotal * MINUTE_HEIGHT;
                                            const height = durationMinutes * MINUTE_HEIGHT;
                                            const service = SERVICES.find(s => s.id === appointment.serviceId);
                                            const patient = PATIENTS.find(p => p.id === appointment.patientId);
                                            const isCompact = durationMinutes <= 20;
                                            const isCancelled = appointment.status === 'cancelled';
                                            // ✅ CHANGED: Now uses is_rescheduled flag instead of status check
                                            const isRescheduled = appointment.is_rescheduled;
                                            const isCompleted = appointment.status === 'completed';

                                            return (
                                                <div
                                                    key={appointment.id}
                                                    onClick={(e) => { e.stopPropagation(); handleAppointmentClick(appointment); }}
                                                    className={`
                                                        absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer
                                                        transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden
                                                        ${service?.bgColor} ${service?.textColor}
                                                        ${isCancelled ? 'opacity-50' : ''}
                                                        ${isCompleted ? 'opacity-50' : ''}
                                                        ${isRescheduled ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                                                    `}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        borderWidth: '1px',
                                                        borderColor: service?.color,
                                                        borderLeftWidth: isMobile ? '3px' : '4px',
                                                        borderLeftColor: service?.color
                                                    }}
                                                >
                                                    {isCompact ? (
                                                        <div className="px-1.5 py-0.5 flex items-center gap-1 h-full">
                                                            {isRescheduled && <RefreshCw size={10} className="flex-shrink-0" />}
                                                            <span className="text-[10px] sm:text-sm font-bold truncate">
                                                                {patient?.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 h-full flex flex-col">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                {isRescheduled && <RefreshCw size={12} className="flex-shrink-0" />}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-[10px] sm:text-sm font-bold truncate">
                                                                            {patient?.name}
                                                                        </p>
                                                                        {/* Only show tags if height allows */}
                                                                        {height > 60 && (
                                                                            <PatientTags
                                                                                isNewPatient={patient?.isNewPatient}
                                                                                isDependent={patient?.isDependent}
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold opacity-80">
                                                                <span>
                                                                    {appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    -
                                                                    {appointment.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            {height > 70 && (
                                                                <div className="mt-auto pt-1">
                                                                    {/* ✅ CHANGED: Pass is_rescheduled to StatusBadge */}
                                                                    <StatusBadge status={appointment.status} size="sm" is_rescheduled={appointment.is_rescheduled} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Breaks */}
                                        {dayBreaks.map((breakEvent) => {
                                            const startMinTotal = (breakEvent.startTime.getHours() - START_HOUR) * 60 + breakEvent.startTime.getMinutes();
                                            const durationMinutes = (breakEvent.endTime.getTime() - breakEvent.startTime.getTime()) / 60000;

                                            const top = startMinTotal * MINUTE_HEIGHT;
                                            const height = durationMinutes * MINUTE_HEIGHT;
                                            const isCompact = durationMinutes <= 15;

                                            return (
                                                <div
                                                    key={breakEvent.id}
                                                    onClick={(e) => { e.stopPropagation(); handleBreakClick(breakEvent); }}
                                                    className={`
                                                        absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer
                                                        transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden
                                                        bg-red-100 text-red-700 border border-red-300
                                                        ${isCompact ? 'px-1.5 py-0.5 flex items-center gap-1' : 'px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 flex flex-col'}
                                                    `}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        borderLeftWidth: isMobile ? '3px' : '4px',
                                                        borderLeftColor: BREAK_COLOR.value
                                                    }}
                                                >
                                                    {isCompact ? (
                                                        <>
                                                            <span className="text-[10px] sm:text-xs font-bold truncate">
                                                                {breakEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <span className="text-[9px] sm:text-xs font-bold truncate">
                                                                {breakEvent.title}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                                                <span className="text-[10px] sm:text-xs font-bold truncate">
                                                                    {breakEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    -
                                                                    {breakEvent.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>

                                                            <div className="text-[10px] sm:text-xs font-bold leading-tight mb-0.5 sm:mb-1 truncate">
                                                                {breakEvent.title}
                                                            </div>
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

            {/* Modals */}
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
            />

            <AppointmentDetailsModal
                isOpen={isAppointmentModalOpen}
                onClose={() => setIsAppointmentModalOpen(false)}
                appointment={selectedAppointment}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onOpenReschedule={handleOpenReschedule}
            />

            <RescheduleModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                appointment={rescheduleAppointment}
                appointments={appointments}
                breaks={breaks}
                onReschedule={handleReschedule}
            />
        </div>
    );
};

export default PracticeBookingCalendar;