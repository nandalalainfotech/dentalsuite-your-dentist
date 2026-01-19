import { practiceApi } from "../../data/practiceApi";
import type { Appointment } from "../../types/dashboard";

export default function PracticeAppointmentsView() {
    // Get practice data with real appointments
    const practices = practiceApi.getAllPractices();
    const allAppointments: Appointment[] = practices.flatMap(practice => practice.appointments);

    // Categorize appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= today && aptDate < tomorrow;
    });

    const upcomingAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate >= tomorrow;
    });

    const pastAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return aptDate < today;
    });

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Appointments Overview</h2>
                <button className="bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Appointment
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer group">
                    <div>
                        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Today</p>
                        <p className="text-3xl font-bold text-blue-900 mt-2">{todayAppointments.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="text-blue-500 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Upcoming */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 flex items-center justify-between hover:border-green-300 transition-colors cursor-pointer group">
                    <div>
                        <p className="text-green-600 text-xs font-bold uppercase tracking-wider">Upcoming</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">{upcomingAppointments.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="text-green-500 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 flex items-center justify-between hover:border-purple-300 transition-colors cursor-pointer group">
                    <div>
                        <p className="text-purple-600 text-xs font-bold uppercase tracking-wider">Completed</p>
                        <p className="text-3xl font-bold text-purple-900 mt-2">{pastAppointments.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="text-purple-500 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
                </div>

                {allAppointments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {allAppointments.slice(0, 10).map((appointment) => (
                            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {appointment.dentistName}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {appointment.clinicName}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(new Date(appointment.dateTime))} at {formatTime(new Date(appointment.dateTime))}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-sm font-medium text-gray-700">Treatment: </span>
                                            <span className="text-sm text-gray-600">{appointment.treatment}</span>
                                            <span className="ml-3 text-sm font-medium text-gray-700">Price: </span>
                                            <span className="text-sm text-gray-600">${appointment.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No appointments scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
}