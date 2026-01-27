import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { ChevronLeft, ChevronRight, X, ChevronDown, Check, Calendar, Clock, User, AlertCircle } from 'lucide-react';

// --- Types ---
interface Appointment {
    id: string;
    dentistName: string;
    clinicName: string;
    dateTime: Date;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'rescheduled';
    treatment: string;
    price?: number;
    notes?: string;
    originalDateTime?: Date; // To track original time if rescheduled
}

interface AppointmentsProps {
    appointments: Appointment[];
    appointmentHistory?: Appointment[];
    onBookAppointment: () => void;
    onReschedule?: (appointmentId: string, newDateTime: Date) => void;
    onCancel?: (appointmentId: string) => void;
}

// --- Mock Data ---
const MOCK_PRACTITIONERS = [
    { id: 'd1', name: 'Dr. James Mitchell', specialty: 'Dentistry' },
    { id: 'd2', name: 'Dr. Sarah Connor', specialty: 'Orthodontics' },
    { id: 'd3', name: 'Dr. Emily Brown', specialty: 'Endodontics' },
];

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
        <div className={`fixed bottom-6 right-6 ${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Appointment Rescheduled!</h2>
                    <p className="text-green-100 mt-1">Your appointment has been successfully updated</p>
                </div>

                {/* Details */}
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
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>

                {/* Footer */}
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        onConfirm();
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Warning Header */}
                <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-8 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Cancel Appointment?</h2>
                    <p className="text-red-100 mt-1">This action cannot be undone</p>
                </div>

                {/* Details */}
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

                {/* Footer */}
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

// --- Main Appointments Component ---
export const Appointments: React.FC<AppointmentsProps> = ({
    appointments: initialAppointments,
    appointmentHistory: initialHistory = [],
    onBookAppointment,
    onReschedule,
    onCancel,
}) => {
    // Local state for appointments (for demo purposes)
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>(initialHistory);

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
    const handleConfirmReschedule = (newDateTime: Date) => {
        if (!selectedAppointment) return;

        // Update the appointment in local state
        setAppointments(prev => prev.map(apt => {
            if (apt.id === selectedAppointment.id) {
                return {
                    ...apt,
                    dateTime: newDateTime,
                    status: 'rescheduled' as const,
                    originalDateTime: apt.dateTime, // Store original time
                };
            }
            return apt;
        }));

        // Call parent handler if provided
        if (onReschedule) {
            onReschedule(selectedAppointment.id, newDateTime);
        }

        // Store the new date/time for success modal
        setRescheduledDateTime(newDateTime);

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

        // Call parent handler if provided
        if (onCancel) {
            onCancel(showCancelConfirm.id);
        }

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
                    className={`py-3 px-1 font-medium text-lg transition-colors relative ${
                        activeTab === 'current' 
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
                    className={`py-3 px-1 font-medium text-lg transition-colors relative ${
                        activeTab === 'history' 
                            ? 'text-orange-600' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    History
                    {activeTab === 'history' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
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
                            className={`border rounded-xl p-5 transition-all hover:shadow-md ${
                                appointment.status === 'cancelled' 
                                    ? 'border-red-200 bg-red-50/50' 
                                    : appointment.status === 'rescheduled'
                                    ? 'border-purple-200 bg-purple-50/50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{appointment.treatment}</h3>
                                        <StatusBadge status={appointment.status} />
                                    </div>
                                    <p className="text-gray-700 font-medium">{appointment.dentistName}</p>
                                    <p className="text-sm text-gray-500">{appointment.clinicName}</p>

                                    <div className="flex items-center gap-4 mt-3">
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
                                    </div>

                                    {/* Show original time if rescheduled */}
                                    {appointment.status === 'rescheduled' && appointment.originalDateTime && (
                                        <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                                            <span>Originally scheduled:</span>
                                            <span className="line-through">
                                                {appointment.originalDateTime.toLocaleDateString()} at {appointment.originalDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {appointment.price && (
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">${appointment.price}</p>
                                        <p className="text-xs text-gray-500">Estimated</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                <div className="flex mt-4 pt-4 border-t border-gray-100 gap-3">
                                    <button 
                                        onClick={() => handleRescheduleClick(appointment)} 
                                        className="px-4 py-2 text-sm font-semibold bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Reschedule
                                    </button>
                                    <button 
                                        onClick={() => setShowCancelConfirm(appointment)} 
                                        className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
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

// --- Reschedule Modal Content ---
const RescheduleModalContent = ({
    appointment,
    onClose,
    onConfirm
}: {
    appointment: Appointment;
    onClose: () => void;
    onConfirm: (date: Date) => void;
}) => {
    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarViewDate, setCalendarViewDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedPractitionerId, setSelectedPractitionerId] = useState(MOCK_PRACTITIONERS[0].id);
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
        return date < today;
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

    // Generate Availability List
    const availabilityList = useMemo(() => {
        const list = [];
        const baseDate = new Date(selectedDate);

        for (let i = 0; i < 3; i++) {
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + i);

            // Skip past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (currentDay < today) continue;

            // Mock times - in real app, fetch from API based on practitioner
            const times = ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM', '05:30 PM'];

            list.push({
                date: currentDay,
                slots: times
            });
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

        // Call parent handler
        onConfirm(selectedSlot);

        setIsSubmitting(false);
    };

    const selectedPractitioner = MOCK_PRACTITIONERS.find(p => p.id === selectedPractitionerId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[650px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* --- LEFT SIDEBAR --- */}
                <div className="w-[340px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col p-6 flex-shrink-0">

                    {/* Current Appointment Info */}
                    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-2">Rescheduling</p>
                        <p className="font-bold text-gray-900">{appointment.treatment}</p>
                        <p className="text-sm text-gray-600 mt-1">{appointment.dentistName}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Currently: {appointment.dateTime.toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="mb-6">
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
                                <span key={i} className="text-xs text-gray-400 font-semibold h-8 flex items-center justify-center">{d}</span>
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
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                        {selectedPractitioner && (
                            <p className="text-xs text-gray-500 mt-2">{selectedPractitioner.specialty}</p>
                        )}
                    </div>
                </div>

                {/* --- RIGHT CONTENT --- */}
                <div className="flex-1 flex flex-col bg-white min-w-0">

                    {/* Header */}
                    <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Select a new time</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing availability starting from{' '}
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
                    <div className="flex-1 overflow-y-auto p-6">
                        {availabilityList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Calendar className="w-16 h-16 mb-4 opacity-50" />
                                <p className="font-medium">No available slots</p>
                                <p className="text-sm mt-1">Please select a different date</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {availabilityList.map((dayData, idx) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                            {dayData.date.toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
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
                                                            px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
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
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
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
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedSlot || isSubmitting}
                                className={`px-6 py-2.5 rounded-xl text-white font-bold shadow-sm transition-all flex items-center gap-2
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

export default Appointments;