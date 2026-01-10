import type { Practice, PracticeWithDashboard } from '../types/auth';
import type { Appointment, Notification } from '../types/dashboard';

// Practice-specific appointments (patients booking with the practice)
const smileDentalCareAppointments: Appointment[] = [
  {
    id: 'p1',
    dentistName: 'Dr. Sarah Johnson',
    clinicName: 'Smile Dental Care',
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    patientPhone: '+61412345678',
    dateTime: new Date('2024-01-15T10:00:00'),
    status: 'confirmed',
    treatment: 'Regular Checkup',
    price: 150
  },
  {
    id: 'p2',
    dentistName: 'Dr. Sarah Johnson',
    clinicName: 'Smile Dental Care',
    patientName: 'Emma Wilson',
    patientEmail: 'emma.wilson@email.com',
    patientPhone: '+61423456789',
    dateTime: new Date('2024-01-15T14:30:00'),
    status: 'pending',
    treatment: 'Teeth Cleaning',
    price: 120
  },
  {
    id: 'p3',
    dentistName: 'Dr. Michael Chen',
    clinicName: 'Smile Dental Care',
    patientName: 'Robert Brown',
    patientEmail: 'robert.brown@email.com',
    patientPhone: '+61434567890',
    dateTime: new Date('2024-01-16T09:00:00'),
    status: 'confirmed',
    treatment: 'Dental Filling',
    price: 200
  }
];

const cityDentalClinicAppointments: Appointment[] = [
  {
    id: 'p4',
    dentistName: 'Dr. Michael Chen',
    clinicName: 'City Dental Clinic',
    patientName: 'Lisa Davis',
    patientEmail: 'lisa.davis@email.com',
    patientPhone: '+61445678901',
    dateTime: new Date('2024-01-15T11:00:00'),
    status: 'confirmed',
    treatment: 'Root Canal',
    price: 800
  },
  {
    id: 'p5',
    dentistName: 'Dr. Emily Wilson',
    clinicName: 'City Dental Clinic',
    patientName: 'James Martin',
    patientEmail: 'james.martin@email.com',
    patientPhone: '+61456789012',
    dateTime: new Date('2024-01-16T15:30:00'),
    status: 'pending',
    treatment: 'Braces Consultation',
    price: 150
  }
];

// Practice-specific notifications
const smileDentalCareNotifications: Notification[] = [
  {
    id: 'pn1',
    type: 'new_booking',
    title: 'New Appointment Booking',
    message: 'Emma Wilson has booked a teeth cleaning appointment for tomorrow',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false
  },
  {
    id: 'pn2',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'Payment of $150 received from John Smith for regular checkup',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true
  },
  {
    id: 'pn3',
    type: 'cancellation',
    title: 'Appointment Cancellation',
    message: 'Patient cancelled appointment on Jan 18, slot is now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true
  },
  {
    id: 'pn4',
    type: 'review_received',
    title: 'New Patient Review',
    message: 'Robert Brown left a 5-star review for your practice',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: false
  }
];

const cityDentalClinicNotifications: Notification[] = [
  {
    id: 'pn5',
    type: 'new_booking',
    title: 'New Booking',
    message: 'Lisa Davis booked a root canal treatment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false
  },
  {
    id: 'pn6',
    type: 'inventory_alert',
    title: 'Inventory Alert',
    message: 'Dental filling material running low - 20% remaining',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
    isRead: true
  }
];

export type { PracticeWithDashboard } from '../types/auth';

// Dummy practice images for testing
export const dummyPracticeImages = [
  'https://images.unsplash.com/photo-1600988331234-46285d424d71?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1588776814546-1ffcfb5b0e2e?w=300&h=200&fit=crop',
];

export const staticPractices: PracticeWithDashboard[] = [
  {
    id: 'practice1',
    practiceName: 'Vishwa Dental Care',
    abnNumber: '12345678901',
    email: 'vishwa@dentalcare.com.au',
    password: 'vv123',
    firstName: 'Vishwa',
    lastName: 'vv',
    mobileNumber: '+61412345678',
    practiceType: 'general_dentistry',
    practicePhone: '(02) 9234 5678',
    practiceAddress: '123 George Street',
    practiceCity: 'Sydney',
    practiceState: 'NSW',
    practicePostcode: '2000',
    createdAt: '2024-01-01T09:00:00Z',
    appointments: smileDentalCareAppointments,
    notifications: smileDentalCareNotifications,
    profileImage: "https://images.unsplash.com/photo-1600988331234-46285d424d71?w=300&h=200&fit=crop",
    isActive: true,
    rating: 4.8,
    totalReviews: 156
  },
  {
    id: 'practice2',
    practiceName: 'City Dental Clinic',
    abnNumber: '98765432109',
    email: 'info@citydentalclinic.com.au',
    password: 'practice456',
    firstName: 'Michael',
    lastName: 'Chen',
    mobileNumber: '+61423456789',
    practiceType: 'specialist',
    practicePhone: '(03) 9876 5432',
    practiceAddress: '456 Collins Street',
    practiceCity: 'Melbourne',
    practiceState: 'VIC',
    practicePostcode: '3000',
    createdAt: '2024-02-15T10:30:00Z',
    appointments: cityDentalClinicAppointments,
    notifications: cityDentalClinicNotifications,
    profileImage: "https://images.unsplash.com/photo-1588776814546-1ffcfb5b0e2e?w=300&h=200&fit=crop",
    isActive: true,
    rating: 4.9,
    totalReviews: 203
  },
  {
    id: 'practice3',
    practiceName: 'Bright Smile Dental',
    abnNumber: '55566677788',
    email: 'hello@brightsmile.com.au',
    password: 'practice789',
    firstName: 'Emily',
    lastName: 'Wilson',
    mobileNumber: '+61434567890',
    practiceType: 'cosmetic',
    practicePhone: '(07) 3456 7890',
    practiceAddress: '789 Queen Street',
    practiceCity: 'Brisbane',
    practiceState: 'QLD',
    practicePostcode: '4000',
    createdAt: '2024-03-01T14:00:00Z',
    appointments: [],
    notifications: [],
    profileImage: "https://images.unsplash.com/photo-1600988331234-46285d424d71?w=300&h=200&fit=crop",
    isActive: true,
    rating: 4.7,
    totalReviews: 89
  },
  {
    id: 'practice4',
    practiceName: 'Family Dental Center',
    abnNumber: '11122233344',
    email: 'contact@familydental.com.au',
    password: 'practice111',
    firstName: 'David',
    lastName: 'Taylor',
    mobileNumber: '+61445678901',
    practiceType: 'pediatric',
    practicePhone: '(08) 8765 4321',
    practiceAddress: '321 King William Street',
    practiceCity: 'Adelaide',
    practiceState: 'SA',
    practicePostcode: '5000',
    createdAt: '2024-01-20T11:15:00Z',
    appointments: [],
    notifications: [],
    profileImage: "https://images.unsplash.com/photo-1588776814546-1ffcfb5b0e2e?w=300&h=200&fit=crop",
    isActive: true,
    rating: 4.6,
    totalReviews: 124
  },
  {
    id: 'practice5',
    practiceName: 'Orthodontic Specialists',
    abnNumber: '99988877766',
    email: 'info@ortho-specialists.com.au',
    password: 'practice222',
    firstName: 'James',
    lastName: 'Martinez',
    mobileNumber: '+61456789012',
    practiceType: 'orthodontic',
    practicePhone: '(02) 6789 0123',
    practiceAddress: '555 Northbourne Avenue',
    practiceCity: 'Canberra',
    practiceState: 'ACT',
    practicePostcode: '2600',
    createdAt: '2024-02-28T16:45:00Z',
    appointments: [],
    notifications: [],
    profileImage: "https://images.unsplash.com/photo-1600988331234-46285d424d71?w=300&h=200&fit=crop",
    isActive: true,
    rating: 4.9,
    totalReviews: 67
  }
];

export const findPracticeByEmail = (email: string): Practice | undefined => {
  return staticPractices.find(practice => practice.email.toLowerCase() === email.toLowerCase());
};

export const findPracticeByMobile = (mobileNumber: string): Practice | undefined => {
  return staticPractices.find(practice => practice.mobileNumber === mobileNumber);
};

export const findPracticeByEmailOrMobile = (emailOrMobile: string): Practice | undefined => {
  return findPracticeByEmail(emailOrMobile) || findPracticeByMobile(emailOrMobile);
};

export const findPracticeByABN = (abnNumber: string): Practice | undefined => {
  return staticPractices.find(practice => practice.abnNumber === abnNumber);
};

export const validatePracticeCredentials = (emailOrMobile: string, password: string): Practice | null => {
  const practice = findPracticeByEmailOrMobile(emailOrMobile);
  return practice && practice.password === password ? practice : null;
};

export const addPractice = (practiceData: Omit<Practice, 'id' | 'createdAt'>): PracticeWithDashboard => {
  const newPractice: PracticeWithDashboard = {
    ...practiceData,
    id: (staticPractices.length + 1).toString(),
    createdAt: new Date().toISOString(),
    appointments: [],
    notifications: [],
    isActive: true,
    rating: 0,
    totalReviews: 0
  };
  staticPractices.push(newPractice);
  return newPractice;
};

export const updatePractice = (practiceId: string, updateData: Partial<Practice>): PracticeWithDashboard | null => {
  const practiceIndex = staticPractices.findIndex(practice => practice.id === practiceId);

  if (practiceIndex === -1) {
    return null;
  }

  const updatedPractice = {
    ...staticPractices[practiceIndex],
    ...updateData,
  };

  staticPractices[practiceIndex] = updatedPractice;
  return updatedPractice;
};

export const getPracticeStats = () => {
  const totalPractices = staticPractices.length;
  const activePractices = staticPractices.filter(practice => practice.isActive).length;

  const practiceTypes = {
    general_dentistry: staticPractices.filter(p => p.practiceType === 'general_dentistry').length,
    specialist: staticPractices.filter(p => p.practiceType === 'specialist').length,
    cosmetic: staticPractices.filter(p => p.practiceType === 'cosmetic').length,
    orthodontic: staticPractices.filter(p => p.practiceType === 'orthodontic').length,
    pediatric: staticPractices.filter(p => p.practiceType === 'pediatric').length
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentPractices = staticPractices.filter(practice =>
    new Date(practice.createdAt) >= thirtyDaysAgo
  ).length;

  return {
    totalPractices,
    activePractices,
    practiceTypes,
    recentPractices,
    averageRating: staticPractices.reduce((sum, p) => sum + p.rating, 0) / totalPractices
  };
};

export const practiceEmailExists = (email: string): boolean => {
  return staticPractices.some(practice => practice.email.toLowerCase() === email.toLowerCase());
};

export const practiceMobileExists = (mobileNumber: string): boolean => {
  return staticPractices.some(practice => practice.mobileNumber === mobileNumber);
};

export const practiceABNExists = (abnNumber: string): boolean => {
  return staticPractices.some(practice => practice.abnNumber === abnNumber);
};