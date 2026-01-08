import { useState, useEffect } from 'react';
import { staticUsers } from '../data/users';
import type { UserWithDashboard } from '../data/users';
import type { DashboardUser, Appointment, Notification, FamilyMember } from '../types/dashboard';
import { useAuth } from './useAuth';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [dashboardUser, setDashboardUser] = useState<DashboardUser | null>(null);
  const [fullUserData, setFullUserData] = useState<UserWithDashboard | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);

      if (user) {
        // Find the user in static data by email
        const userData: UserWithDashboard | undefined = staticUsers.find(u => u.id === user.id);

        if (userData) {
          setFullUserData(userData);
          setDashboardUser({
            id: userData.id,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            avatar: '',
          });

          setAppointments(userData.appointments);
          setNotifications(userData.notifications);
          setFamilyMembers(userData.familyMembers);
        } else {
          // Fallback data if user not found in static data
          setDashboardUser({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: '',
          });

          setAppointments([
            { id: '1', dentistName: 'Dr. Sarah Johnson', clinicName: 'Smile Dental Care', dateTime: new Date('2024-01-15T10:00:00'), status: 'confirmed', treatment: 'Regular Checkup', price: 150 },
            { id: '2', dentistName: 'Dr. Michael Chen', clinicName: 'City Dental Clinic', dateTime: new Date('2024-01-20T14:30:00'), status: 'pending', treatment: 'Teeth Cleaning', price: 120 }
          ]);

          setNotifications([
            { id: '1', type: 'appointment_reminder', title: 'Appointment Reminder', message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), isRead: false },
            { id: '2', type: 'payment_update', title: 'Payment Confirmation', message: 'Your payment of $150 has been confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isRead: true }
          ]);

          setFamilyMembers([
            { id: '1', name: user.firstName, relationship: 'self', isActive: true },
            { id: '2', name: 'Family Member', relationship: 'other', isActive: false }
          ]);
        }
      } else {
        const firstUser = staticUsers[0];
        setAppointments(firstUser?.appointments || []);
        setNotifications(firstUser?.notifications || []);
        setFamilyMembers(firstUser?.familyMembers || []);
      }

      setLoading(false);
    };

    loadUserData();
  }, [user]);

  const updateAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
  };



  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
  };

  const updateFamilyMembers = (newFamilyMembers: FamilyMember[]) => {
    setFamilyMembers(newFamilyMembers);
  };

  return {
    dashboardUser,
    fullUserData,
    appointments,
    notifications,
    familyMembers,
    loading,
    updateAppointments,
    updateNotifications,
    updateFamilyMembers
  };
};