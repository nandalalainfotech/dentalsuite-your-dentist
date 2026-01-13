import React, { useState, useRef, useEffect } from 'react'; // Added useRef, useEffect
import type { Appointment } from '../../types/dashboard';
import { Icons } from './Icons';

interface AppointmentsProps {
    appointments: Appointment[];
    appointmentHistory?: Appointment[];
    onBookAppointment: () => void;
    onReschedule: (appointmentId: string, newDateTime: Date) => void;
    onCancel: (appointmentId: string) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({
    appointments,
    appointmentHistory = [],
    onBookAppointment,
    onReschedule,
    onCancel,
}) => {
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

    // --- NEW STATE FOR CUSTOM DROPDOWN ---
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const timeDropdownRef = useRef<HTMLDivElement>(null);

    const displayAppointments = activeTab === 'current' ? appointments : appointmentHistory;

    // --- NEW EFFECT TO CLOSE DROPDOWN ON OUTSIDE CLICK ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
                setIsTimeDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Generate available time slots for rescheduling
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) { // 9 AM to 5 PM
            for (let minute of ['00', '30']) { // 30-minute intervals
                const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
                const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                slots.push({ value: timeString, label: displayTime });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Helper to find label for custom dropdown
    const selectedTimeLabel = timeSlots.find(slot => slot.value === rescheduleTime)?.label || "Select a time";

    const handleRescheduleClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setRescheduleDate(new Date(appointment.dateTime).toISOString().split('T')[0]);
        setRescheduleTime(new Date(appointment.dateTime).toTimeString().slice(0, 5));
        setShowRescheduleModal(true);
    };

    // const handleRescheduleSubmit = () => {
    //     if (selectedAppointment && rescheduleDate && rescheduleTime) {
    //         const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
    //         onReschedule(selectedAppointment.id, newDateTime);
    //         setShowRescheduleModal(false);
    //         resetRescheduleForm();
    //     }
    // };

    const handleRescheduleSubmit = () => {
        // if (selectedAppointment && rescheduleDate && rescheduleTime) {
        //     const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
        //     onReschedule(selectedAppointment.id, newDateTime);
        setShowRescheduleModal(false);
        // resetRescheduleForm();
    }
    // };


    // const handleCancelClick = (appointmentId: string) => {
    //     setShowCancelConfirm(appointmentId);
    // };

    // const handleConfirmCancel = (appointmentId: string) => {
    //     onCancel(appointmentId);
    //     setShowCancelConfirm(null);
    // };

    // const resetRescheduleForm = () => {
    //     setSelectedAppointment(null);
    //     setRescheduleDate('');
    //     setRescheduleTime('');
    //     setIsTimeDropdownOpen(false); // Reset dropdown state
    // };

    // Calculate min date for rescheduling (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    // Calculate max date for rescheduling (3 months from now)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl text-white">
                    <Icons.Calendar />
                </div>Appointments</h2>

            {/* Tabs */}
            <div className="flex space-x-4 sm:space-x-8 mb-6 sm:mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`py-2 sm:py-3 px-1 font-medium text-base sm:text-lg transition-colors ${activeTab === 'current'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Current
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-2 sm:py-3 px-1 font-medium text-base sm:text-lg transition-colors ${activeTab === 'history'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    History
                </button>
            </div>

            {/* Empty State */}
            {displayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                        <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 text-center px-4">
                        You have no {activeTab === 'current' ? 'current' : 'past'} appointments
                    </p>

                    {activeTab === 'current' && (
                        <button
                            onClick={onBookAppointment}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                        >
                            Book a new consult
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {displayAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{appointment.dentistName}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${getStatusColor(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-1 text-sm sm:text-base">{appointment.clinicName}</p>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 mb-2 gap-1">
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span>{formatDate(appointment.dateTime)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{formatTime(appointment.dateTime)}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-medium">Treatment:</span> {appointment.treatment}
                                    </p>

                                    {appointment.price && (
                                        <p className="text-sm font-medium text-gray-900 mb-3">
                                            ${appointment.price}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2">
                                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                            <>
                                                <button
                                                    onClick={() => handleRescheduleClick(appointment)}
                                                    className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => handleCancelClick(appointment.id)}
                                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                    />
                </svg>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-orange-900 font-medium">Can't see an appointment? Here's why</p>
                    <p className="text-sm text-orange-700 mt-1">
                        Appointments may take up to 24 hours to appear in your dashboard after confirmation.
                    </p>
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900 bg-opacity-50"
                        onClick={() => {
                            setShowRescheduleModal(false);
                            resetRescheduleForm();
                        }}
                    ></div>

                    {/* Modal */}
                    <div className="relative w-full max-w-md">
                        {/* Note: Removed 'overflow-hidden' from main wrapper so dropdown can float over if needed, 
                            though max-h logic keeps it inside usually. */}
                        <div className="bg-white rounded-xl shadow-2xl">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Reschedule Appointment</h3>
                                    <p className="text-sm text-gray-500 mt-1">Select new date and time</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowRescheduleModal(false);
                                        resetRescheduleForm();
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Current Appointment</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Dentist:</span> {selectedAppointment.dentistName}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Current Date:</span> {formatDate(selectedAppointment.dateTime)}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Current Time:</span> {formatTime(selectedAppointment.dateTime)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={rescheduleDate}
                                            onChange={(e) => setRescheduleDate(e.target.value)}
                                            min={minDate}
                                            max={maxDateString}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select a date between {new Date(minDate).toLocaleDateString()} and {new Date(maxDateString).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* --- REPLACED NATIVE SELECT WITH CUSTOM DROPDOWN --- */}
                                    <div className="relative" ref={timeDropdownRef}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Time <span className="text-red-500">*</span>
                                        </label>

                                        {/* Trigger Button */}
                                        <button
                                            type="button"
                                            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                            className={`w-full px-4 py-2 border rounded-lg text-left bg-white flex justify-between items-center transition-all ${isTimeDropdownOpen
                                                ? 'ring-2 ring-orange-500 border-orange-500'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <span className={rescheduleTime ? "text-gray-900" : "text-gray-500"}>
                                                {selectedTimeLabel}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isTimeDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                                <ul className="max-h-60 overflow-y-auto py-1 text-base text-gray-700">
                                                    <li
                                                        onClick={() => {
                                                            setRescheduleTime("");
                                                            setIsTimeDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-2 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors text-gray-500"
                                                    >
                                                        Select a time
                                                    </li>
                                                    {timeSlots.map((slot) => (
                                                        <li
                                                            key={slot.value}
                                                            onClick={() => {
                                                                setRescheduleTime(slot.value);
                                                                setIsTimeDropdownOpen(false);
                                                            }}
                                                            className={`px-4 py-2 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors ${rescheduleTime === slot.value
                                                                ? 'bg-orange-100 text-orange-700 font-medium'
                                                                : ''
                                                                }`}
                                                        >
                                                            {slot.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">Clinic hours: 9:00 AM - 5:30 PM</p>
                                    </div>
                                    {/* --- END CUSTOM DROPDOWN --- */}

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    setShowRescheduleModal(false);
                                                    resetRescheduleForm();
                                                }}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleRescheduleSubmit}
                                                disabled={!rescheduleDate || !rescheduleTime}
                                                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${!rescheduleDate || !rescheduleTime
                                                    ? 'bg-orange-400 cursor-not-allowed'
                                                    : 'bg-orange-600 hover:bg-orange-700'
                                                    }`}
                                            >
                                                Confirm Reschedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Appointment</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to cancel this appointment? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowCancelConfirm(null)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={() => handleConfirmCancel(showCancelConfirm)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Yes, Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};