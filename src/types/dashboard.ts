export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profileCompletion: number;
}

export interface Appointment {
  id: string;
  dentistName: string;
  clinicName: string;
  dateTime: Date;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  treatment: string;
  notes?: string;
  price?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'self' | 'father' | 'mother' | 'child' | 'spouse' | 'other';
  dateOfBirth?: Date;
  avatar?: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  date: Date;
  type: 'deposit' | 'full_payment' | 'refund';
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface Notification {
  id: string;
  type: 'appointment_reminder' | 'cancellation' | 'payment_update' | 'feedback_request' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export interface SearchFilters {
  query: string;
  location?: string;
  treatment?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}