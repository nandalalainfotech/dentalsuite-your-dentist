import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, X, User, Trash2, Calendar as CalendarIcon,
    Check, ChevronDown, Activity, Mail, Phone, MapPin, Clock, RefreshCw, AlertCircle
} from 'lucide-react';

// --- Types ---
interface Practitioner {
    id: string;
    name: string;
    role?: string;
    // Avatar removed as requested
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
    // Removed 'dismissed'
    status: 'rescheduled' | 'confirmed' | 'pending' | 'completed' | 'cancelled';
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
        address: '123 Main St, New York, NY 10001'
    },
    {
        id: 'pt2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1992-07-22',
        address: '456 Oak Ave, Brooklyn, NY 11201'
    },
    {
        id: 'pt3',
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        phone: '+1 (555) 345-6789',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1978-11-08',
        address: '789 Pine Rd, Queens, NY 11375'
    },
    {
        id: 'pt4',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1 (555) 456-7890',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1990-05-30',
        address: '321 Elm St, Manhattan, NY 10016'
    },
    {
        id: 'pt5',
        name: 'Robert Wilson',
        email: 'robert.w@email.com',
        phone: '+1 (555) 567-8901',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        dateOfBirth: '1965-09-12',
        address: '654 Maple Dr, Bronx, NY 10451'
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

const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: 'a1',
        patientId: 'pt1',
        practitionerId: 'p1',
        serviceId: 's1',
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9, 30, 0, 0)),
        status: 'confirmed',
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

// --- Status Badge Component ---
interface StatusBadgeProps {
    status: Appointment['status'];
    size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const statusStyles = {
        'rescheduled': 'bg-blue-100 text-blue-700 border-blue-200',
        'confirmed': 'bg-green-100 text-green-700 border-green-200',
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };

    const statusLabels = {
        'rescheduled': 'Rescheduled',
        'confirmed': 'Confirmed',
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
    };

    const statusIcons = {
        'rescheduled': <RefreshCw size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'confirmed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'pending': <Activity size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'completed': <Check size={size === 'sm' ? 10 : 12} className="mr-1" />,
        'cancelled': <X size={size === 'sm' ? 10 : 12} className="mr-1" />,
    };

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-[10px]'
        : 'px-2.5 py-1 text-xs';

    return (
        <span className={`inline-flex items-center rounded-full font-semibold border ${statusStyles[status]} ${sizeClasses}`}>
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
}

const TimePicker: React.FC<TimePickerProps> = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange
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
                            className="w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
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
                            className="w-full pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {currentDuration > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">Duration:</span>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-semibold">
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

// --- Break Modal Component ---
interface BreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (id: string) => void;
    initialData: Partial<CalendarEvent> | null;
    selectedDate: Date;
    activePractitionerId: string;
}

const BreakModal: React.FC<BreakModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialData,
    selectedDate,
    activePractitionerId
}) => {
    const isEditMode = !!initialData?.id;
    const activePractitioner = PRACTITIONERS.find(p => p.id === activePractitionerId);

    const [title, setTitle] = useState(initialData?.title || 'Break');

    const defaultStart = initialData?.startTime ? toTimeString(initialData.startTime) : "09:00";
    const defaultEnd = initialData?.endTime ? toTimeString(initialData.endTime) : "09:30";

    const [startTimeStr, setStartTimeStr] = useState(defaultStart);
    const [endTimeStr, setEndTimeStr] = useState(defaultEnd);
    const [notes, setNotes] = useState(initialData?.notes || '');

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || 'Break');
            setStartTimeStr(initialData?.startTime ? toTimeString(initialData.startTime) : "09:00");
            setEndTimeStr(initialData?.endTime ? toTimeString(initialData.endTime) : "09:30");
            setNotes(initialData?.notes || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-auto max-h-[90vh] overflow-y-auto w-full sm:w-[400px]">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-red-50 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg">{isEditMode ? 'Edit Break' : 'New Break'}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
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
                    />

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
                            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md transition-all text-sm"
                        >
                            {isEditMode ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Updated Reschedule Modal Component ---
interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    appointments: Appointment[]; // Added to calculate collisions
    onReschedule: (appointmentId: string, newDate: Date, newStartTime: Date, newEndTime: Date, newPractitionerId: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    appointment,
    appointments,
    onReschedule
}) => {
    // 1. Hooks always call first
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [isPractitionerDropdownOpen, setIsPractitionerDropdownOpen] = useState(false);

    // 2. Effects
    useEffect(() => {
        if (isOpen && appointment) {
            setSelectedDate(toDateString(appointment.startTime));
            setSelectedTimeSlot(toTimeString(appointment.startTime));
            setSelectedPractitionerId(appointment.practitionerId);
            setReason('');
        }
    }, [isOpen, appointment]);

    // 3. Derived values (Safe for hooks)
    const durationMinutes = useMemo(() => {
        if (!appointment) return 0;
        return calculateDuration(toTimeString(appointment.startTime), toTimeString(appointment.endTime));
    }, [appointment]);

    // 4. Generate Available Slots Logic (Hooks)
    const availableSlots = useMemo(() => {
        // Safe check inside the hook
        if (!appointment || !selectedDate || !selectedPractitionerId) return [];

        const slots: string[] = [];
        const dateObj = new Date(selectedDate);

        // Generate slots every 30 minutes from start to end hour
        for (let hour = START_HOUR; hour < END_HOUR; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

                // Check for collisions
                const slotStart = setTimeOnDate(dateObj, timeStr);
                const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

                const isColliding = appointments.some(appt => {
                    // Skip the appointment being rescheduled
                    if (appt.id === appointment.id) return false;
                    // Check only for selected practitioner
                    if (appt.practitionerId !== selectedPractitionerId) return false;

                    // Check overlap
                    return (
                        (slotStart >= appt.startTime && slotStart < appt.endTime) ||
                        (slotEnd > appt.startTime && slotEnd <= appt.endTime) ||
                        (slotStart <= appt.startTime && slotEnd >= appt.endTime)
                    );
                });

                if (!isColliding) {
                    slots.push(timeStr);
                }
            }
        }
        return slots;
    }, [selectedDate, selectedPractitionerId, appointments, appointment, durationMinutes]);

    // 5. Conditional Return (Must be AFTER hooks)
    if (!isOpen || !appointment) return null;

    // 6. Rest of variables
    const patient = PATIENTS.find(p => p.id === appointment.patientId);
    const service = SERVICES.find(s => s.id === appointment.serviceId);
    const selectedPractitioner = PRACTITIONERS.find(p => p.id === selectedPractitionerId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTimeSlot) return alert("Please select a time slot");

        const newDate = new Date(selectedDate);
        const newStartTime = setTimeOnDate(newDate, selectedTimeSlot);
        const newEndTime = new Date(newStartTime.getTime() + durationMinutes * 60000);

        onReschedule(appointment.id, newDate, newStartTime, newEndTime, selectedPractitionerId);
        onClose();
    };

    // Split slots into morning and afternoon
    const morningSlots = availableSlots.filter(t => parseInt(t.split(':')[0]) < 12);
    const afternoonSlots = availableSlots.filter(t => parseInt(t.split(':')[0]) >= 12);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden w-full max-w-4xl flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 bg-white border-b flex justify-between items-center z-10">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Reschedule Appointment</h3>
                        <p className="text-sm text-gray-500">
                            {patient?.name} • {service?.name} ({durationMinutes} mins)
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-full">

                        {/* LEFT COLUMN: Date & Practitioner */}
                        <div className="w-full md:w-5/12 p-6 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col gap-6">

                            {/* Calendar Section */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <CalendarIcon size={14} />
                                    Select Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedTimeSlot(''); // Reset time when date changes
                                        }}
                                        min={toDateString(new Date())}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base font-medium shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                {/* Quick Dates Strip */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {[0, 1, 2, 3, 7].map((offset) => {
                                        const d = addDays(new Date(), offset);
                                        const dStr = toDateString(d);
                                        const isSelected = selectedDate === dStr;
                                        return (
                                            <button
                                                key={offset}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDate(dStr);
                                                    setSelectedTimeSlot('');
                                                }}
                                                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {offset === 0 ? 'Today' : offset === 1 ? 'Tmrw' : formatDate(d).split(',')[0]}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1 md:min-h-[40px]"></div>

                            {/* Practitioner Section (Bottom of Left) */}
                            <div className="space-y-3 relative">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <User size={14} />
                                    Select Practitioner
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsPractitionerDropdownOpen(!isPractitionerDropdownOpen)}
                                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition-all text-left group"
                                    >
                                        {/* Avatar replaced with generic icon */}
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-blue-100">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{selectedPractitioner?.name}</p>
                                            <p className="text-xs text-gray-500">{selectedPractitioner?.role}</p>
                                        </div>
                                        <ChevronDown size={18} className="text-gray-400" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isPractitionerDropdownOpen && (
                                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                                                    {/* Avatar replaced with generic icon */}
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User size={16} className="text-gray-500" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`text-sm font-medium ${selectedPractitionerId === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</p>
                                                        <p className="text-xs text-gray-500">{p.role}</p>
                                                    </div>
                                                    {selectedPractitionerId === p.id && <Check size={16} className="ml-auto text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Available Slots */}
                        <div className="w-full md:w-7/12 p-6 flex flex-col h-full bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-800">Available Time Slots</h4>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                    {formatDate(new Date(selectedDate))}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {availableSlots.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                        <Clock size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm">No available slots for this date.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Morning Slots */}
                                        {morningSlots.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                    Morning
                                                </p>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {morningSlots.map(time => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => setSelectedTimeSlot(time)}
                                                            className={`py-2 px-1 rounded-lg text-sm font-medium transition-all border ${selectedTimeSlot === time
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Afternoon Slots */}
                                        {afternoonSlots.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                                    Afternoon
                                                </p>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {afternoonSlots.map(time => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => setSelectedTimeSlot(time)}
                                                            className={`py-2 px-1 rounded-lg text-sm font-medium transition-all border ${selectedTimeSlot === time
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            {time} {parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Reason Textarea (Bottom of Right) */}
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Reason (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Reason for change..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedTimeSlot}
                        className={`px-6 py-2.5 font-medium rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 ${selectedTimeSlot
                                ? 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <RefreshCw size={16} />
                        Confirm Reschedule
                    </button>
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

    // Check if status is final (no more changes allowed)
    // Removed 'dismissed' from check
    const isFinalStatus = ['completed', 'cancelled'].includes(appointment.status);

    const handleStatusClick = (status: Appointment['status']) => {
        if (status === 'rescheduled') {
            onOpenReschedule(appointment);
            onClose();
        } else {
            onUpdateStatus(appointment.id, status);
        }
        setIsStatusDropdownOpen(false);
    };

    // --- DYNAMIC STATUS LOGIC ---
    // If Confirmed, remove Pending from options.
    // Logic: 
    // - Pending -> Confirmed, Cancelled, Rescheduled
    // - Confirmed -> Completed, Cancelled, Rescheduled
    // - Completed -> Final
    // - Cancelled -> Final
    let availableStatuses: Appointment['status'][] = [];

    if (appointment.status === 'pending') {
        availableStatuses = ['confirmed', 'rescheduled', 'cancelled'];
    } else if (appointment.status === 'confirmed') {
        availableStatuses = ['completed', 'rescheduled', 'cancelled'];
    } else if (appointment.status === 'rescheduled') {
        availableStatuses = ['confirmed', 'cancelled'];
    }
    // Final states (completed/cancelled) will have empty available statuses based on isFinalStatus check above

    const statusConfig: Record<Appointment['status'], { bg: string; icon: React.ElementType }> = {
        'rescheduled': { bg: 'bg-blue-500', icon: RefreshCw },
        'confirmed': { bg: 'bg-green-500', icon: Check },
        'pending': { bg: 'bg-amber-500', icon: Clock },
        'completed': { bg: 'bg-emerald-600', icon: Check },
        'cancelled': { bg: 'bg-red-500', icon: X },
    };

    const CurrentStatusIcon = statusConfig[appointment.status]?.icon || Clock;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden w-full sm:w-[480px]">

                {/* Colored Header Banner */}
                <div
                    className="h-24 relative"
                    style={{
                        background: `linear-gradient(135deg, ${service?.color}dd 0%, ${service?.color}99 100%)`
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-sm"
                    >
                        <X size={18} />
                    </button>

                    {/* Service Badge */}
                    <div className="absolute mt-5 left-6">
                        <span className="px-3 py-1 bg-white/25 backdrop-blur-sm text-black text-xs font-semibold rounded-full">
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
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                            {patient?.name}
                                        </h4>
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
                                            <StatusBadge status={appointment.status} size="sm" />
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
                                                <div className="p-2 bg-gray-50 border-b border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                                                        Change Status
                                                    </p>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {availableStatuses.map((status) => {
                                                        const isCurrentStatus = appointment.status === status;
                                                        const StatusIcon = statusConfig[status]?.icon || Clock;

                                                        return (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusClick(status)}
                                                                disabled={isCurrentStatus}
                                                                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${isCurrentStatus
                                                                    ? 'bg-gray-100 cursor-not-allowed'
                                                                    : 'hover:bg-gray-50 '
                                                                    }`}
                                                            >
                                                                <div className={`w-7 h-7 ${statusConfig[status]?.bg} rounded-lg flex items-center justify-center`}>
                                                                    <StatusIcon size={14} className="text-white" />
                                                                </div>
                                                                <span className={`text-sm font-medium ${isCurrentStatus ? 'text-gray-400' : 'text-gray-700'}`}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
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

                    {/* Rescheduled Info */}
                    {appointment.status === 'rescheduled' && appointment.rescheduledFrom && (
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
                        <div className="p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
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
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
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
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Practitioner</p>
                        <div className="flex items-center gap-3">

                            <div>
                                <p className="font-semibold text-gray-800">{practitioner?.name}</p>
                                <p className="text-xs text-gray-500">{practitioner?.role}</p>
                            </div>
                        </div>
                    </div>

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
                        className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Slot Selection Modal ---
interface SlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectBreak: () => void;
    selectedDate: Date;
    selectedTime: { hour: number; minutes: number };
}

const SlotModal: React.FC<SlotModalProps> = ({
    isOpen,
    onClose,
    onSelectBreak,
    selectedDate,
    selectedTime
}) => {
    if (!isOpen) return null;

    const timeDisplay = new Date(selectedDate);
    timeDisplay.setHours(selectedTime.hour, selectedTime.minutes);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[280px] p-4">
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-500">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                        {timeDisplay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => { onSelectBreak(); onClose(); }}
                        className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        Add Break
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
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
                                        <p className="text-xs text-gray-500">Blocked time</p>
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

const PracticeBookingCalender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [breaks, setBreaks] = useState<CalendarEvent[]>(INITIAL_BREAKS);
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [activePractitionerId, setActivePractitionerId] = useState<string>(PRACTITIONERS[0].id);

    const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const [editingBreak, setEditingBreak] = useState<Partial<CalendarEvent> | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
    const [selectedDayForModal, setSelectedDayForModal] = useState<Date>(new Date());
    const [selectedSlotTime, setSelectedSlotTime] = useState({ hour: 9, minutes: 0 });
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

    const handleToday = () => {
        setCurrentDate(new Date());
        const today = new Date();
        const startWeek = getStartOfWeek(today);
        const dayIndex = Math.floor((today.getTime() - startWeek.getTime()) / (1000 * 60 * 60 * 24));
        setSelectedDayIndex(Math.max(0, Math.min(6, dayIndex)));
    };

    const handleSlotClick = (day: Date, hour: number, minutes: number) => {
        setSelectedDayForModal(day);
        setSelectedSlotTime({ hour, minutes });
        setIsSlotModalOpen(true);
    };

    const handleAddBreak = () => {
        const clickedTime = new Date(selectedDayForModal);
        clickedTime.setHours(selectedSlotTime.hour, selectedSlotTime.minutes, 0, 0);
        const endTime = new Date(clickedTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        setEditingBreak({
            startTime: clickedTime,
            endTime: endTime,
            type: 'break',
            practitionerId: activePractitionerId,
            color: BREAK_COLOR.value
        });
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

    const handleReschedule = (
        appointmentId: string,
        newDate: Date,
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
                    status: 'rescheduled' as const,
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
                    status: 'rescheduled' as const,
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

                        <button
                            onClick={handleToday}
                            className="px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                            Today
                        </button>

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
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                                                        className={`w-full cursor-pointer hover:bg-gray-100 transition-colors ${minute === 30 ? 'border-t border-gray-200 border-dashed' : ''
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
                                            const isRescheduled = appointment.status === 'rescheduled';

                                            return (
                                                <div
                                                    key={appointment.id}
                                                    onClick={(e) => { e.stopPropagation(); handleAppointmentClick(appointment); }}
                                                    className={`
                                                        absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer
                                                        transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden
                                                        ${service?.bgColor} ${service?.textColor}
                                                        ${isCancelled ? 'opacity-50' : ''}
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
                                                                    <p className="text-[10px] sm:text-xs font-bold truncate">
                                                                        {patient?.name}
                                                                    </p>
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
                                                                    <StatusBadge status={appointment.status} size="sm" />
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
            <SlotModal
                isOpen={isSlotModalOpen}
                onClose={() => setIsSlotModalOpen(false)}
                onSelectBreak={handleAddBreak}
                selectedDate={selectedDayForModal}
                selectedTime={selectedSlotTime}
            />

            <BreakModal
                isOpen={isBreakModalOpen}
                onClose={() => setIsBreakModalOpen(false)}
                onSave={handleSaveBreak}
                onDelete={handleDeleteBreak}
                initialData={editingBreak}
                selectedDate={selectedDayForModal}
                activePractitionerId={activePractitionerId}
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
                onReschedule={handleReschedule}
            />
        </div>
    );
};

export default PracticeBookingCalender;