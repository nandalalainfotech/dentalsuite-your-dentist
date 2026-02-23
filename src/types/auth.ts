export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
  createdAt: string;
}

export interface UserWithDashboard extends User {
  appointments: import('./dashboard').Appointment[];
  notifications: import('./dashboard').Notification[];
  familyMembers: import('./dashboard').FamilyMember[];
  profileImage?: string;
}

export interface Practice {
  id: string;
  role?: 'practice' | 'superadmin'; 
  practiceName: string;
  abnNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  practiceLogo: string;
  practiceType: 'general_dentistry' | 'specialist' | 'cosmetic' | 'orthodontic' | 'pediatric';
  practicePhone: string;
  practiceAddress: string;
  practiceCity: string;
  practiceState: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  practicePostcode: string;
  createdAt: string;
  status?: string;
  profileCompleted?: boolean;
  paymentCompleted?: boolean;
  subscriptionPermissions?: unknown;
  token?: string;
  refreshToken?: string;
}

export interface PracticeWithDashboard extends Practice {
  appointments: import('./dashboard').Appointment[];
  notifications: import('./dashboard').Notification[];
  profileImage?: string;
  isActive: boolean;
  rating: number;
  totalReviews: number;
}

export type AuthUser = User | Practice;

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: 'patient' | 'practice' | null;
}

export interface LoginCredentials {
  emailOrMobile: string;
  password: string;
}

export interface PracticeLoginCredentials {
  emailOrMobile: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
}

export interface PracticeSignupCredentials {
  practiceName: string;
  abnNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  practiceType: 'general_dentistry' | 'specialist' | 'cosmetic' | 'orthodontic' | 'pediatric';
  practicePhone: string;
  practiceAddress: string;
  practiceCity: string;
  practiceState: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  practicePostcode: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  loginPractice: (credentials: PracticeLoginCredentials) => Promise<{ success: boolean; message: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message: string }>;
  signupPractice: (credentials: PracticeSignupCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  updatePracticeProfile: (practiceData: Partial<Practice>) => void;
}