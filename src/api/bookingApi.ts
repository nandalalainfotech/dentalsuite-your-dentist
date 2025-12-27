import type { Appointment } from '../types';

export const bookingApi = {
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment => {
    // Simulate API call to backend
    const appointment: Appointment = {
      id: `APT-${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      ...appointmentData
    };

    // Store in localStorage for demo purposes
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return appointment;
  },

  getAppointments: (): Appointment[] => {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  },

  getAppointmentById: (appointmentId: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.find((apt) => apt.id === appointmentId);
  },

  cancelAppointment: (appointmentId: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments: Appointment[] = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return updatedAppointments.find((apt) => apt.id === appointmentId);
  },

  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments: Appointment[] = appointments.map((apt) =>
      apt.id === appointmentId
        ? { ...apt, appointmentDate: newDate, appointmentTime: newTime, updatedAt: new Date().toISOString(), status: 'rescheduled' }
        : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return updatedAppointments.find((apt) => apt.id === appointmentId);
  }
};