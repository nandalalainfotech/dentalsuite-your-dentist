import React, { useState } from 'react';
import type { Appointment } from '../../types/dashboard';

interface AppointmentsProps {
    appointments: Appointment[];
    appointmentHistory?: Appointment[];
    onBookAppointment: () => void;
    onReschedule: (appointmentId: string) => void;
    onCancel: (appointmentId: string) => void;
    onViewDetails: (appointmentId: string) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({
    appointments,
    appointmentHistory = [],
    onBookAppointment,
    onReschedule,
    onCancel,
    onViewDetails
}) => {
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    const displayAppointments = activeTab === 'current' ? appointments : appointmentHistory;

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

return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Appointments</h2>

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
                                        <button
                                            onClick={() => onViewDetails(appointment.id)}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                        >
                                            View Details
                                        </button>

                                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                            <>
                                                <button
                                                    onClick={() => onReschedule(appointment.id)}
                                                    className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => onCancel(appointment.id)}
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
                <button className="text-orange-600 hover:text-orange-700 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
