export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
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
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  relationship: 'self' | 'spouse' | 'child' | 'father' | 'mother' | 'sibling' | 'other';
  isActive: boolean;
}


export interface MenuItem {
  id: 'directory' | 'profile' | 'appointments' | 'certificate' | 'patients' | 'settings' | 'help' | 'notifications' | 'security' | 'bookingcalender';
  label: string;
  icon: React.FC<unknown>;
  badge?: number;
};


export interface Notification {
  id: string;
  type: 'appointment_reminder' | 'cancellation' | 'payment_update' | 'feedback_request' | 'general' | 'payment_due' | 'new_service' | 'appointment_confirmed' | 'preparation' | 'insurance_update' | 'promotion' | 'follow_up' | 'new_booking' | 'payment_received' | 'review_received' | 'inventory_alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export interface SearchFilters {
  specialty: any;
  language: any;
  gender: any;
  insurance: any;
  availableDays: any;
  service?: string;
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