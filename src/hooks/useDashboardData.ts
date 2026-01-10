import { useState, useEffect } from 'react';
import { getUserById } from '../data/userApi';
import type { UserWithDashboard } from '../types/auth';
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
        const userData: UserWithDashboard | null = getUserById(user.id);

        if (userData) {
          setFullUserData(userData);
          setDashboardUser({
            id: userData.id,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            avatar: userData.profileImage || '',
          });

          setAppointments(userData.appointments);
          setNotifications(userData.notifications);
          setFamilyMembers(userData.familyMembers);
        } else {
          setDashboardUser({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: '',
          });

          setAppointments([]);
          setNotifications([]);
          setFamilyMembers([
            { id: '1', name: user.firstName, relationship: 'self', isActive: true }
          ]);
        }
      } else {
        setAppointments([]);
        setNotifications([]);
        setFamilyMembers([]);
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