// --- Types ---
export type ValidStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'cancelled';

export type TabType = 'all' | 'pending' | 'upcoming' | 'completed' | 'cancelled';

export interface EnrichedAppointment {
  id: string;
  patient_name: string;
  treatment: string;

  // Flattened Practitioner Info
  dentist_id: string;
  dentist_name: string;
  dentist_image: string;
  dentist_role: string;

  appointment_date: string;
  appointment_time: string;
  bookedAt: Date;

  isNewPatient: boolean;
  isDependent: boolean;
  is_rescheduled: boolean;

  status: ValidStatus;

  mobile: string;
  dob: string;
  patient_notes: string;
  booked_by: string;

  created_at: string;
  updated_at: string;
  lastUpdated?: Date;
}

export const ITEMS_PER_PAGE = 5;

// --- Constants ---
export const STATUS_LABELS: Record<ValidStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  dismissed: 'Dismissed',
  patient_cancelled: 'Pt.Cancelled',
  cancelled: 'Cancelled',
};

export const STATUS_CONFIG: Record<ValidStatus, { bg: string; text: string; dot: string }> = {
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  dismissed: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  patient_cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

export const TAB_CONFIG: Record<TabType, { label: string; activeColor: string; dotColor: string }> = {
  all: { label: 'All', activeColor: 'bg-gray-900 text-white', dotColor: 'bg-gray-500' },
  pending: { label: 'Pending', activeColor: 'bg-amber-500 text-white', dotColor: 'bg-amber-500' },
  upcoming: { label: 'Upcoming', activeColor: 'bg-blue-500 text-white', dotColor: 'bg-blue-500' },
  completed: { label: 'Completed', activeColor: 'bg-emerald-500 text-white', dotColor: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', activeColor: 'bg-red-500 text-white', dotColor: 'bg-red-500' },
};

// --- Helpers ---
export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

export const formatShortDate = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short' });
};

export const formatTime = (dateStr: string | Date, timeStr?: string): string => {
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const formatRelativeUpdatedAt = (dateString?: string) => {
  if (!dateString) return "";
  const updated = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - updated.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return updated.toLocaleDateString();
};

export const formatExactUpdatedAt = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date);
};

export const formatExactCreatedAt = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date);
};

export const formatRelativeTime = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return created.toLocaleDateString();
};

export const getWeekday = (dateStr: string | Date): string => {
  return new Date(dateStr).toLocaleString('en-US', { weekday: 'short' });
}
export const getDay = (dateStr: string | Date): number => new Date(dateStr).getDate();
export const getMonth = (dateStr: string | Date): string => new Date(dateStr).toLocaleString('en-US', { month: 'short' });

export const isTerminalState = (status: ValidStatus): boolean => {
  return ['completed', 'patient_cancelled', 'cancelled', 'dismissed'].includes(status);
}
export const isCancelledStatus = (status: ValidStatus): boolean => {
  return ['patient_cancelled', 'cancelled', 'dismissed'].includes(status);
}

// --- Mapper ---
export const mapAppointmentToEnriched = (apt: any): EnrichedAppointment => {
  const mapStatus = (apiStatus: string): ValidStatus => {

    const normalized = apiStatus?.toLowerCase() || 'pending';

    // Direct mapping or fallback
    const statusMap: Record<string, ValidStatus> = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'dismissed': 'dismissed',
      'patient_cancelled': 'patient_cancelled',
      'cancelled': 'cancelled'
    };

    return statusMap[normalized] || 'pending';
  };



  const time = apt.appointment_time?.substring(0, 5) || '00:00';
  const bookedAt = new Date(`${apt.appointment_date}T${time}`);

  return {
    id: apt.id,
    patient_name: apt.patient_name,
    treatment: apt.treatment,

    // Relational Data Flattening
    dentist_id: apt.practitioner?.id || apt.dentist_id || '',
    dentist_name: apt.practitioner?.name || apt.dentist_name || 'Unknown',
    dentist_image: apt.practitioner?.image || null,
    dentist_role: apt.practitioner?.role || 'General Practitioner',

    appointment_date: apt.appointment_date,
    appointment_time: time,
    bookedAt,

    isNewPatient: apt.isNewPatient || false,
    isDependent: apt.isDependent || false,
    is_rescheduled: apt.is_rescheduled || false,

    status: mapStatus(apt.status),

    mobile: apt.mobile,
    dob: apt.dob,
    patient_notes: apt.patient_notes || '',
    booked_by: apt.booked_by || apt.patient_name,
    created_at: apt.created_at,
    updated_at: apt.updated_at,
  };
};