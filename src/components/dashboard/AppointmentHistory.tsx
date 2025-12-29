import React, { useState } from 'react';
import type { Appointment } from '../../types/dashboard';

interface AppointmentHistoryProps {
  onRebook: (appointmentId: string) => void;
  onDownloadInvoice: (appointmentId: string) => void;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  onRebook,
  onDownloadInvoice
}) => {
  const [showMore, setShowMore] = useState(false);

  const mockHistory: Appointment[] = [
    {
      id: 'hist1',
      dentistName: 'Dr. Emily Brown',
      clinicName: 'Dental Care Center',
      dateTime: new Date('2023-12-10T11:00:00'),
      status: 'completed',
      treatment: 'Root Canal Treatment',
      price: 1200,
      notes: 'Patient comfortable, procedure successful'
    },
    {
      id: 'hist2',
      dentistName: 'Dr. James Wilson',
      clinicName: 'Smile Dental Clinic',
      dateTime: new Date('2023-11-25T15:30:00'),
      status: 'completed',
      treatment: 'Regular Checkup',
      price: 150,
      notes: 'Good oral hygiene maintained'
    },
    {
      id: 'hist3',
      dentistName: 'Dr. Sarah Johnson',
      clinicName: 'City Dental',
      dateTime: new Date('2023-10-15T09:00:00'),
      status: 'completed',
      treatment: 'Teeth Cleaning',
      price: 120,
      notes: 'Deep cleaning performed'
    },
    {
      id: 'hist4',
      dentistName: 'Dr. Michael Chen',
      clinicName: 'Family Dental',
      dateTime: new Date('2023-09-20T14:00:00'),
      status: 'completed',
      treatment: 'Dental Filling',
      price: 200,
      notes: 'Composite filling on molar'
    },
    {
      id: 'hist5',
      dentistName: 'Dr. Lisa Anderson',
      clinicName: 'Dental Care Plus',
      dateTime: new Date('2023-08-10T10:30:00'),
      status: 'completed',
      treatment: 'Emergency Consultation',
      price: 100,
      notes: 'Tooth pain resolved with medication'
    }
  ];

  const displayHistory = showMore ? mockHistory : mockHistory.slice(0, 3);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
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

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Appointment History</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All History
        </button>
      </div>

      {displayHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">No past appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayHistory.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{appointment.dentistName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-1">{appointment.clinicName}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(appointment.dateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(appointment.dateTime)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Treatment:</span> {appointment.treatment}
                  </p>

                  {appointment.notes && (
                    <p className="text-sm text-gray-500 italic mb-2">
                      {appointment.notes}
                    </p>
                  )}

                  {appointment.price && (
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      ${appointment.price}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onRebook(appointment.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Re-book</span>
                    </button>

                    <button
                      onClick={() => onDownloadInvoice(appointment.id)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {mockHistory.length > 3 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 mx-auto"
              >
                <span>{showMore ? 'Show Less' : `Show More (${mockHistory.length - 3} more)`}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${showMore ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};