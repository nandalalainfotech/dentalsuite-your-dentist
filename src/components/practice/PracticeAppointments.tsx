import React, { useState } from 'react';
import type { Appointment } from '../../types/dashboard';
import { Icons } from '../dashboard/Icons';

interface PracticeAppointmentsProps {
    appointments: Appointment[];
    onAddAppointment: () => void;
}

export const PracticeAppointments: React.FC<PracticeAppointmentsProps> = ({
    appointments,
    onAddAppointment,
}) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'today' | 'past'>('upcoming');

    const upcomingAppointments = appointments.filter(apt => 
        apt.dateTime > new Date() && apt.status !== 'cancelled'
    );
    
    const todayAppointments = appointments.filter(apt => {
        const today = new Date();
        const aptDate = new Date(apt.dateTime);
        return aptDate.toDateString() === today.toDateString() && apt.status !== 'cancelled';
    });
    
    const pastAppointments = appointments.filter(apt => 
        apt.dateTime < new Date() || apt.status === 'completed'
    );

    const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments :
                               activeTab === 'today' ? todayAppointments : pastAppointments;

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                    <p className="text-gray-600">Manage patient appointments and schedules</p>
                </div>
                <button
                    onClick={onAddAppointment}
                    className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                    <Icons.Plus />
                    New Appointment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Today's Appointments</p>
                            <p className="text-2xl font-bold text-blue-900">{todayAppointments.length}</p>
                        </div>
                        <Icons.Calendar className="text-blue-500" />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Upcoming</p>
                            <p className="text-2xl font-bold text-green-900">{upcomingAppointments.length}</p>
                        </div>
                        <Icons.Clock className="text-green-500" />
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Completed</p>
                            <p className="text-2xl font-bold text-purple-900">{pastAppointments.length}</p>
                        </div>
                        <Icons.CheckCircle className="text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {(['upcoming', 'today', 'past'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                            activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'upcoming' ? upcomingAppointments.length :
                                                                      tab === 'today' ? todayAppointments.length :
                                                                      pastAppointments.length})
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg border border-gray-200">
                {displayAppointments.length === 0 ? (
                    <div className="p-8 text-center">
                        <Icons.Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">No {activeTab} appointments</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {displayAppointments.map((appointment) => (
                            <div key={appointment.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {appointment.patientName || 'Unknown Patient'}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Treatment: {appointment.treatment}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Icons.Calendar size={14} />
                                                    {formatDate(appointment.dateTime)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Icons.Clock size={14} />
                                                    {formatTime(appointment.dateTime)}
                                                </span>
                                            </div>
                                            {appointment.patientEmail && (
                                                <p>Email: {appointment.patientEmail}</p>
                                            )}
                                            {appointment.patientPhone && (
                                                <p>Phone: {appointment.patientPhone}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => setSelectedAppointment(appointment)}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Icons.Edit size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};