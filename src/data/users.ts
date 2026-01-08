import type { User } from '../types/auth';
import type { Appointment, Notification, FamilyMember } from '../types/dashboard';

const sampleAppointments: Appointment[] = [
  { id: '1', dentistName: 'Dr. Sarah Johnson', clinicName: 'Smile Dental Care', dateTime: new Date('2024-01-15T10:00:00'), status: 'confirmed', treatment: 'Regular Checkup', price: 150 },
  { id: '2', dentistName: 'Dr. Michael Chen', clinicName: 'City Dental Clinic', dateTime: new Date('2024-01-20T14:30:00'), status: 'pending', treatment: 'Teeth Cleaning', price: 120 },
  { id: '3', dentistName: 'Dr. Emily Wilson', clinicName: 'Family Dental', dateTime: new Date('2024-01-25T11:00:00'), status: 'confirmed', treatment: 'Dental Filling', price: 200 }
];



const sampleNotifications: Notification[] = [
  { id: '1', type: 'appointment_reminder', title: 'Appointment Reminder', message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), isRead: false },
  { id: '2', type: 'payment_update', title: 'Payment Confirmation', message: 'Your payment of $150 has been confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isRead: true },
  { id: '3', type: 'cancellation', title: 'Appointment Cancellation', message: 'Your appointment on Jan 25 has been cancelled by the clinic', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true },
  { id: '4', type: 'feedback_request', title: 'Feedback Request', message: 'How was your recent visit? Please share your experience', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false }
];

const sampleFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'John Doe', relationship: 'self', isActive: true },
  { id: '2', name: 'Jane Doe', relationship: 'spouse', isActive: false },
  { id: '3', name: 'Jimmy Doe', relationship: 'child', isActive: false },
  { id: '4', name: 'Robert Doe', relationship: 'father', isActive: false }
];

// Extended user data with dashboard information
export interface UserWithDashboard extends User {
  appointments: Appointment[];
  notifications: Notification[];
  familyMembers: FamilyMember[];
  profileImage?: string;
}

// Dummy user images for testing
export const dummyUserImages = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
];

export const staticUsers: UserWithDashboard[] = [
  {
    id: '1',
    email: 'vishwa@nandalalainfotech.com',
    password: 'vv123',
    firstName: 'Vishwa',
    lastName: 'C',
    dateOfBirth: '2002-01-01',
    gender: 'male',
    mobileNumber: '+61412345678',
    createdAt: '2024-01-15T10:00:00Z',
    appointments: sampleAppointments,
    notifications: sampleNotifications,
    familyMembers: sampleFamilyMembers,
    profileImage: "'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'"
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: 'password456',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    mobileNumber: '+61423456789',
    createdAt: '2024-02-20T14:30:00Z',
    appointments: [sampleAppointments[0], sampleAppointments[1]],
    profileImage: "",

    notifications: [sampleNotifications[0], sampleNotifications[2]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[2]]
  },
  {
    id: '3',
    email: 'mike.wilson@example.com',
    password: 'password789',
    firstName: 'Mike',
    lastName: 'Wilson',
    dateOfBirth: '1992-12-03',
    gender: 'male',
    mobileNumber: '+61434567890',
    createdAt: '2024-03-10T09:15:00Z',
    appointments: [sampleAppointments[1], sampleAppointments[2]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",

    notifications: [sampleNotifications[1], sampleNotifications[3]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[1]]
  },
  {
    id: '4',
    email: 'sarah.brown@example.com',
    password: 'password321',
    firstName: 'Sarah',
    lastName: 'Brown',
    dateOfBirth: '1988-04-18',
    gender: 'female',
    mobileNumber: '+61445678901',
    createdAt: '2024-01-25T16:45:00Z',
    appointments: [sampleAppointments[2]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[3]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[1], sampleFamilyMembers[3]]
  },
  {
    id: '5',
    email: 'david.lee@example.com',
    password: 'password654',
    firstName: 'David',
    lastName: 'Lee',
    dateOfBirth: '1995-09-30',
    gender: 'male',
    mobileNumber: '+61456789012',
    createdAt: '2024-02-14T11:20:00Z',
    appointments: [sampleAppointments[0]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[0], sampleNotifications[1]],
    familyMembers: [sampleFamilyMembers[0]]
  },
  {
    id: '6',
    email: 'surea@gmail.com',
    password: 'password123',
    firstName: 'surea',
    lastName: 'dalmia',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    mobileNumber: '+61412345678',
    createdAt: '2024-01-01T09:00:00Z',
    appointments: sampleAppointments,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: sampleNotifications,
    familyMembers: sampleFamilyMembers
  },
  {
    id: '7',
    email: 'emily.johnson@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Johnson',
    dateOfBirth: '1991-07-22',
    gender: 'female',
    mobileNumber: '+61467890123',
    createdAt: '2024-03-15T11:30:00Z',
    appointments: [sampleAppointments[0], sampleAppointments[2]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[0], sampleNotifications[3]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[2]]
  },
  {
    id: '8',
    email: 'alex.martinez@example.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Martinez',
    dateOfBirth: '1987-11-08',
    gender: 'male',
    mobileNumber: '+61478901234',
    createdAt: '2024-02-28T14:45:00Z',
    appointments: [sampleAppointments[1]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[1], sampleNotifications[2]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[3]]
  },
  {
    id: '9',
    email: 'lisa.anderson@example.com',
    password: 'password123',
    firstName: 'Lisa',
    lastName: 'Anderson',
    dateOfBirth: '1993-02-14',
    gender: 'female',
    mobileNumber: '+61489012345',
    createdAt: '2024-04-10T16:20:00Z',
    appointments: [sampleAppointments[0]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[0]],
    familyMembers: [sampleFamilyMembers[0]]
  },
  {
    id: '10',
    email: 'robert.taylor@example.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Taylor',
    dateOfBirth: '1989-06-30',
    gender: 'male',
    mobileNumber: '+61490123456',
    createdAt: '2024-01-20T10:15:00Z',
    appointments: [sampleAppointments[1], sampleAppointments[2]],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    notifications: [sampleNotifications[1], sampleNotifications[2], sampleNotifications[3]],
    familyMembers: [sampleFamilyMembers[0], sampleFamilyMembers[1], sampleFamilyMembers[2]]
  }
];

export const findUserByEmail = (email: string): User | undefined => {
  return staticUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserByMobile = (mobileNumber: string): User | undefined => {
  return staticUsers.find(user => user.mobileNumber === mobileNumber);
};

export const findUserByEmailOrMobile = (emailOrMobile: string): User | undefined => {
  return findUserByEmail(emailOrMobile) || findUserByMobile(emailOrMobile);
};

export const validateUserCredentials = (emailOrMobile: string, password: string): User | null => {
  const user = findUserByEmailOrMobile(emailOrMobile);
  return user && user.password === password ? user : null;
};

export const addUser = (userData: Omit<User, 'id' | 'createdAt'>): UserWithDashboard => {
  const newUser: UserWithDashboard = {
    ...userData,
    id: (staticUsers.length + 1).toString(),
    createdAt: new Date().toISOString(),
    appointments: [],
    notifications: [],
    familyMembers: []
  };
  staticUsers.push(newUser);
  return newUser;
};

export const updateUser = (userId: string, updateData: Partial<User>): UserWithDashboard | null => {
  const userIndex = staticUsers.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = {
    ...staticUsers[userIndex],
    ...updateData,
  };

  staticUsers[userIndex] = updatedUser;
  return updatedUser;
};

export const updateUserProfile = (userId: string, profileData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  mobileNumber?: string;
}): UserWithDashboard | null => {
  const userIndex = staticUsers.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = {
    ...staticUsers[userIndex],
    ...profileData,
  };

  staticUsers[userIndex] = updatedUser;
  return updatedUser;
};

export const calculateProfileCompletion = (user: User): number => {
  let completion = 0;
  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.dateOfBirth,
    user.gender,
    user.mobileNumber
  ];

  const completedFields = fields.filter(field => field && field.trim() !== '').length;
  completion = (completedFields / fields.length) * 100;

  return Math.round(completion);
};

export const updateUserProfileCompletion = (userId: string): UserWithDashboard | null => {
  const user = staticUsers.find(u => u.id === userId);
  if (!user) {
    return null;
  }

  const profileCompletion = calculateProfileCompletion(user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return updateUser(userId, { profileCompletion } as any);
};