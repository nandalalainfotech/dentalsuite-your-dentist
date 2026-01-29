import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ChevronDown, Check, Calendar, Clock, User, AlertCircle, MapPin, Phone } from 'lucide-react';

// --- Types ---
interface Appointment {
    id: string;
    dentistName: string;
    clinicName: string;
    clinicAddress?: string;
    clinicPhone?: string;
    dateTime: Date;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'rescheduled';
    treatment: string;
    duration?: number; // in minutes
    price?: number;
    notes?: string;
    originalDateTime?: Date;
    practitionerId?: string;
}

interface AppointmentsProps {
    onBookAppointment?: () => void;
}

// --- Mock Data ---
const MOCK_PRACTITIONERS = [
    { id: 'd1', name: 'Dr. James Mitchell', specialty: 'General Dentistry', avatar: '👨‍⚕️' },
    { id: 'd2', name: 'Dr. Sarah Connor', specialty: 'Orthodontics', avatar: '👩‍⚕️' },
    { id: 'd3', name: 'Dr. Emily Brown', specialty: 'Endodontics', avatar: '👩‍⚕️' },
    { id: 'd4', name: 'Dr. Michael Chen', specialty: 'Periodontics', avatar: '👨‍⚕️' },
];

// Helper to create dates relative to today
const createDate = (daysFromNow: number, hours: number, minutes: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Helper to create past dates
const createPastDate = (daysAgo: number, hours: number, minutes: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Initial Current Appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: 'apt-001',
        dentistName: 'Dr. James Mitchell',
        practitionerId: 'd1',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        clinicPhone: '+61 2 9876 5432',
        dateTime: createDate(3, 10, 30), // 3 days from now at 10:30 AM
        status: 'confirmed',
        treatment: 'Regular Checkup & Clean',
        duration: 45
    },
    {
        id: 'apt-002',
        dentistName: 'Dr. Sarah Connor',
        practitionerId: 'd2',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        clinicPhone: '+61 2 9876 5432',
        dateTime: createDate(7, 14, 0), // 7 days from now at 2:00 PM
        status: 'pending',
        treatment: 'Orthodontic Consultation',
        duration: 60
    },
    {
        id: 'apt-003',
        dentistName: 'Dr. Emily Brown',
        practitionerId: 'd3',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        clinicPhone: '+61 2 9876 5432',
        dateTime: createDate(14, 9, 0), // 14 days from now at 9:00 AM
        status: 'confirmed',
        treatment: 'Root Canal Treatment',
        duration: 90
    },
];

// Initial Appointment History
const INITIAL_HISTORY: Appointment[] = [
    {
        id: 'apt-h001',
        dentistName: 'Dr. James Mitchell',
        practitionerId: 'd1',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        dateTime: createPastDate(7, 11, 0),
        status: 'completed',
        treatment: 'Teeth Whitening',
        duration: 60,
    },
    {
        id: 'apt-h002',
        dentistName: 'Dr. Michael Chen',
        practitionerId: 'd4',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        dateTime: createPastDate(14, 15, 30),
        status: 'completed',
        treatment: 'Deep Cleaning',
        duration: 45,
    },
    {
        id: 'apt-h003',
        dentistName: 'Dr. Sarah Connor',
        practitionerId: 'd2',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        dateTime: createPastDate(30, 10, 0),
        status: 'cancelled',
        treatment: 'Wisdom Tooth Extraction',
        duration: 60,
        notes: 'Cancelled by patient - rescheduled for later.'
    },
    {
        id: 'apt-h004',
        dentistName: 'Dr. Emily Brown',
        practitionerId: 'd3',
        clinicName: 'Smile Dental Clinic',
        clinicAddress: '123 Main Street, Sydney NSW 2000',
        dateTime: createPastDate(45, 14, 0),
        status: 'completed',
        treatment: 'Dental Filling',
        duration: 30,
    },
];

// Mock available time slots for each practitioner
const generateAvailableSlots = (practitionerId: string, date: Date): string[] => {
    const baseSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

    const dayOfWeek = date.getDay();
    const dateNum = date.getDate();

    return baseSlots.filter((_, index) => {
        const hash = (practitionerId.charCodeAt(1) + dateNum + index) % 5;
        return hash !== 0; 
    });
};

// --- Toast Component ---
const Toast = ({
    message,
    type = 'success',
    onClose
}: {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}) => {
    const styles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    const icons = {
        success: <Check className="w-5 h-5" />,
        error: <X className="w-5 h-5" />,
        info: <AlertCircle className="w-5 h-5" />,
    };

    return (
        <div className={`fixed bottom-6 right-6 ${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300`}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {icons[type]}
            </div>
            <div>
                <p className="font-semibold">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// --- Success Modal Component ---
const SuccessModal = ({
    appointment,
    newDateTime,
    onClose
}: {
    appointment: Appointment;
    newDateTime: Date;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center pt-10">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                <div className="bg-black/90 bg-gradient-to-br from-green-900 via-green-600 to-green-900 px-6 py-8 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Appointment Rescheduled!</h2>
                    <p className="text-green-100 mt-1">Your appointment has been successfully updated</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Practitioner</p>
                                <p className="font-semibold text-gray-900">{appointment.dentistName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">New Date</p>
                                <p className="font-semibold text-gray-900">
                                    {newDateTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">New Time</p>
                                <p className="font-semibold text-gray-900">
                                    {newDateTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                        A confirmation email will be send to your registered email address.
                    </p>
                </div>

                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Cancel Confirmation Modal ---
const CancelConfirmModal = ({
    appointment,
    onConfirm,
    onClose
}: {
    appointment: Appointment;
    onConfirm: () => void;
    onClose: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onConfirm();
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                <div className="bg-black/90 bg-gradient-to-br from-red-900 via-red-600 to-red-900 px-6 py-8 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Cancel Appointment?</h2>
                    <p className="text-red-100 mt-1">This action cannot be undone</p>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-semibold text-gray-900">{appointment.treatment}</p>
                        <p className="text-sm text-gray-500 mt-1">with {appointment.dentistName}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.dateTime.toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{appointment.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                        Are you sure you want to cancel this appointment? You may need to book a new appointment if needed.
                    </p>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                        Keep Appointment
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Status Badge Component ---
const StatusBadge = ({ status }: { status: Appointment['status'] }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-700 border-green-200',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
        completed: 'bg-blue-100 text-blue-700 border-blue-200',
        rescheduled: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const labels = {
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
        rescheduled: 'Rescheduled',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

// --- Reschedule Modal Content ---
const RescheduleModalContent = ({
    appointment,
    onClose,
    onConfirm
}: {
    appointment: Appointment;
    onClose: () => void;
    onConfirm: (date: Date, practitionerId: string) => void;
}) => {
    // State
    const [selectedDate, setSelectedDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const [calendarViewDate, setCalendarViewDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedPractitionerId, setSelectedPractitionerId] = useState(
        appointment.practitionerId || MOCK_PRACTITIONERS[0].id
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helpers
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

        // Disable Sundays (optional)
        if (date.getDay() === 0) return true;

        return false;
    };

    // Generate Calendar Grid
    const renderCalendar = () => {
        const year = calendarViewDate.getFullYear();
        const month = calendarViewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-9 w-9" />);

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const isSelected = selectedDate.toDateString() === dateObj.toDateString();
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const disabled = isDateDisabled(dateObj);
            const isSunday = dateObj.getDay() === 0;

            days.push(
                <button
                    key={day}
                    onClick={() => {
                        if (!disabled) {
                            setSelectedDate(dateObj);
                            setSelectedSlot(null);
                        }
                    }}
                    disabled={disabled}
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${isSunday && !disabled ? 'text-red-400' : ''}
                        ${isSelected && !disabled
                            ? 'bg-orange-500 text-white font-bold shadow-sm'
                            : !disabled ? 'hover:bg-gray-100 text-gray-700' : ''
                        }
                        ${isToday && !isSelected && !disabled ? 'text-orange-600 font-bold ring-2 ring-orange-200' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    // Generate Availability List based on selected date
    const availabilityList = useMemo(() => {
        const list = [];
        const baseDate = new Date(selectedDate);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + i);

            // Skip past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (currentDay < today) continue;

            // Skip Sundays
            if (currentDay.getDay() === 0) continue;

            // Get available slots for this practitioner and date
            const slots = generateAvailableSlots(selectedPractitionerId, currentDay);

            // Filter out past times if it's today
            const now = new Date();
            const filteredSlots = slots.filter(timeStr => {
                if (currentDay.toDateString() !== now.toDateString()) return true;

                const [time, period] = timeStr.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                let finalHours = hours;
                if (period === 'PM' && hours !== 12) finalHours += 12;
                if (period === 'AM' && hours === 12) finalHours = 0;

                const slotTime = new Date(currentDay);
                slotTime.setHours(finalHours, minutes, 0, 0);

                return slotTime > now;
            });

            if (filteredSlots.length > 0) {
                list.push({
                    date: currentDay,
                    slots: filteredSlots
                });
            }
        }
        return list;
    }, [selectedDate, selectedPractitionerId]);

    const handleSlotClick = (dayDate: Date, timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        const newDate = new Date(dayDate);
        let finalHours = hours;
        if (period === 'PM' && hours !== 12) finalHours += 12;
        if (period === 'AM' && hours === 12) finalHours = 0;

        newDate.setHours(finalHours, minutes, 0, 0);
        setSelectedSlot(newDate);
    };

    const handleConfirm = async () => {
        if (!selectedSlot) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Call parent handler with both date and practitioner
        onConfirm(selectedSlot, selectedPractitionerId);

        setIsSubmitting(false);
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pt-2 sm:pt-10">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col lg:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* --- LEFT SIDEBAR --- */}
                <div className="w-full lg:w-[340px] bg-gradient-to-b from-gray-50 to-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col p-4 lg:p-6 flex-shrink-0">

                    {/* Calendar */}
                    <div className="mb-4 lg:mb-6">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h4 className="font-bold text-gray-800 text-lg">
                                {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h4>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className={`text-xs font-semibold h-8 flex items-center justify-center ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* Practitioner Filter */}
                    <div className="mt-auto">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Practitioner</label>
                        <div className="relative">
                            <select
                                value={selectedPractitionerId}
                                onChange={(e) => {
                                    setSelectedPractitionerId(e.target.value);
                                    setSelectedSlot(null);
                                }}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 appearance-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer transition-all"
                            >
                                {MOCK_PRACTITIONERS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/4 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT CONTENT --- */}
                <div className="flex-1 flex flex-col bg-white min-w-0 max-h-[60vh] lg:max-h-none">

                    {/* Header */}
                    <div className="p-4 lg:p-6 lg:pb-4 flex justify-between items-start border-b border-gray-100">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Select a new time</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing availability for{' '}
                                <span className="font-semibold text-gray-700">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Slots List */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                        {availabilityList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                                <Calendar className="w-16 h-16 mb-4 opacity-50" />
                                <p className="font-medium">No available slots</p>
                                <p className="text-sm mt-1">Please select a different date or practitioner</p>
                            </div>
                        ) : (
                            <div className="space-y-6 lg:space-y-8">
                                {availabilityList.map((dayData, idx) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-gray-800 text-base mb-3 lg:mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                            {dayData.date.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            <span className="text-xs font-normal text-gray-400 ml-2">
                                                ({dayData.slots.length} slots available)
                                            </span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2 lg:gap-3">
                                            {dayData.slots.map((timeStr) => {
                                                const [t, p] = timeStr.split(' ');
                                                const [h, m] = t.split(':').map(Number);
                                                let hh = h;
                                                if (p === 'PM' && h !== 12) hh += 12;
                                                if (p === 'AM' && h === 12) hh = 0;

                                                const slotDate = new Date(dayData.date);
                                                slotDate.setHours(hh, m, 0, 0);

                                                const isSelected = selectedSlot?.getTime() === slotDate.getTime();

                                                return (
                                                    <button
                                                        key={timeStr}
                                                        onClick={() => handleSlotClick(dayData.date, timeStr)}
                                                        className={`
                                                            px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                                                            ${isSelected
                                                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600'
                                                            }
                                                        `}
                                                    >
                                                        {timeStr}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 lg:p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm">
                            {selectedSlot ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Selected</p>
                                        <p className="text-gray-900 font-semibold">
                                            {selectedSlot.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-400">No time selected</span>
                            )}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedSlot || isSubmitting}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2
                                    ${selectedSlot && !isSubmitting
                                        ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Confirm Reschedule
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Appointments Component ---
export const Appointments: React.FC<AppointmentsProps> = ({
    onBookAppointment = () => alert('Booking flow would open here'),
}) => {
    // Local state for appointments
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>(INITIAL_HISTORY);

    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    // Modal States
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState<Appointment | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [rescheduledDateTime, setRescheduledDateTime] = useState<Date | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // --- Helpers ---
    const displayAppointments = activeTab === 'current' ? appointments : appointmentHistory;

    const handleRescheduleClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleModal(true);
    };

    const handleCloseRescheduleModal = () => {
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
    };

    // --- MAIN RESCHEDULE HANDLER ---
    const handleConfirmReschedule = (newDateTime: Date, newPractitionerId: string) => {
        if (!selectedAppointment) return;

        // Find the new practitioner name
        const newPractitioner = MOCK_PRACTITIONERS.find(p => p.id === newPractitionerId);

        // Update the appointment in local state
        setAppointments(prev => prev.map(apt => {
            if (apt.id === selectedAppointment.id) {
                return {
                    ...apt,
                    dateTime: newDateTime,
                    status: 'rescheduled' as const,
                    originalDateTime: apt.dateTime,
                    practitionerId: newPractitionerId,
                    dentistName: newPractitioner?.name || apt.dentistName,
                };
            }
            return apt;
        }));

        // Store the new date/time for success modal
        setRescheduledDateTime(newDateTime);

        // Update the selected appointment with original time for success modal
        setSelectedAppointment(prev => prev ? {
            ...prev,
            originalDateTime: prev.dateTime,
            dentistName: newPractitioner?.name || prev.dentistName,
        } : null);

        // Close reschedule modal
        setShowRescheduleModal(false);

        // Show success modal
        setShowSuccessModal(true);
    };

    // --- CANCEL HANDLER ---
    const handleConfirmCancel = () => {
        if (!showCancelConfirm) return;

        const cancelledAppointment = { ...showCancelConfirm, status: 'cancelled' as const };

        // Remove from current appointments
        setAppointments(prev => prev.filter(apt => apt.id !== showCancelConfirm.id));

        // Add to history
        setAppointmentHistory(prev => [cancelledAppointment, ...prev]);

        // Close modal
        setShowCancelConfirm(null);

        // Show toast
        setToast({ message: 'Appointment cancelled successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setSelectedAppointment(null);
        setRescheduledDateTime(null);

        // Show toast confirmation
        setToast({ message: 'Your appointment has been rescheduled', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl text-white">
                    <Calendar className="w-5 h-5" />
                </div>
                Appointments
            </h2>

            {/* Tabs */}
            <div className="flex space-x-4 sm:space-x-8 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`py-3 px-1 font-medium text-lg transition-colors relative ${activeTab === 'current'
                            ? 'text-orange-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Current
                    {activeTab === 'current' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                    )}
                    {appointments.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                            {appointments.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-3 px-1 font-medium text-lg transition-colors relative ${activeTab === 'history'
                            ? 'text-orange-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    History
                    {activeTab === 'history' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                    )}
                    {appointmentHistory.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                            {appointmentHistory.length}
                        </span>
                    )}
                </button>
            </div>

            {/* List */}
            {displayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                        No {activeTab === 'current' ? 'upcoming' : 'past'} appointments
                    </p>
                    <p className="text-gray-500 mb-6">
                        {activeTab === 'current'
                            ? 'Book your next dental visit today'
                            : 'Your appointment history will appear here'
                        }
                    </p>
                    {activeTab === 'current' && (
                        <button
                            onClick={onBookAppointment}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                        >
                            Book a new consult
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {displayAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`border rounded-xl p-4 sm:p-5 transition-all ${appointment.status === 'cancelled'
                                    ? 'border-red-200 bg-red-50/50'
                                    : appointment.status === 'rescheduled'
                                        ? 'border-purple-200 bg-purple-50/50'
                                        : appointment.status === 'completed'
                                            ? 'border-blue-200 bg-blue-50/50'
                                            : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{appointment.treatment}</h3>
                                        <StatusBadge status={appointment.status} />
                                    </div>
                                    <p className="text-gray-700 font-medium">{appointment.dentistName}</p>
                                    <p className="text-sm text-gray-500">{appointment.clinicName}</p>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{appointment.dateTime.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{appointment.dateTime.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </div>
                                        {appointment.duration && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                <span>{appointment.duration} min</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {appointment.notes && activeTab === 'current' && (
                                        <p className="text-xs text-gray-500 mt-2 italic">📝 {appointment.notes}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {appointment.status !== 'cancelled' &&
                                appointment.status !== 'completed' &&
                                appointment.status !== 'rescheduled' && ( // Added check here
                                    <div className="flex flex-wrap mt-4 pt-4 border-t border-gray-100 gap-2 sm:gap-3">
                                        <button
                                            onClick={() => handleRescheduleClick(appointment)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => setShowCancelConfirm(appointment)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            )}

            {/* Book New Button (when there are appointments) */}
            {activeTab === 'current' && appointments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                        onClick={onBookAppointment}
                        className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Book Another Appointment
                    </button>
                </div>
            )}

            {/* --- RESCHEDULE MODAL --- */}
            {showRescheduleModal && selectedAppointment && (
                <RescheduleModalContent
                    appointment={selectedAppointment}
                    onClose={handleCloseRescheduleModal}
                    onConfirm={handleConfirmReschedule}
                />
            )}

            {/* --- SUCCESS MODAL --- */}
            {showSuccessModal && selectedAppointment && rescheduledDateTime && (
                <SuccessModal
                    appointment={selectedAppointment}
                    newDateTime={rescheduledDateTime}
                    onClose={handleSuccessModalClose}
                />
            )}

            {/* --- CANCEL CONFIRMATION MODAL --- */}
            {showCancelConfirm && (
                <CancelConfirmModal
                    appointment={showCancelConfirm}
                    onConfirm={handleConfirmCancel}
                    onClose={() => setShowCancelConfirm(null)}
                />
            )}

            {/* --- TOAST --- */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Appointments;