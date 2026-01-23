import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

// --- Types & Interfaces ---
type ValidStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'reception_cancelled';

type TabType = 'all' | 'pending' | 'upcoming' | 'completed' | 'cancelled';

interface EnrichedAppointment {
  id: string;
  patientName: string;
  treatment: string;
  dentistName: string;
  dateTime: string;
  bookedAt: Date;
  isNewPatient: boolean;
  isDependent: boolean;
  status: ValidStatus;
  mobile: string;
  dob: string;
  patientNotes: string;
  bookedBy: string;
  lastUpdated: Date;
}

interface FilterState {
  search: string;
  type: string;
  practitioner: string;
  status: string;
  startDate: string;
  endDate: string;
}

// --- Static Data Generation ---
const getRelativeDate = (daysOffset: number, hour: number, minute: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const getRelativePastDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysOffset);
  return date;
};

// Hardcoded Static Data
const STATIC_APPOINTMENTS: EnrichedAppointment[] = [
  {
    id: 'apt-1',
    patientName: 'Sarah Johnson',
    treatment: 'Dental Cleaning',
    dentistName: 'Dr. Emily Smith',
    dateTime: getRelativeDate(1, 10, 0),
    bookedAt: getRelativePastDate(2),
    isNewPatient: true,
    isDependent: false,
    status: 'pending',
    mobile: '0412 345 678',
    dob: '12 Mar 1990',
    patientNotes: 'Patient requests a gentle cleaning due to sensitivity.',
    bookedBy: 'Sarah Johnson',
    lastUpdated: getRelativePastDate(0),
  },
  {
    id: 'apt-2',
    patientName: 'Michael Brown',
    treatment: 'Root Canal Consultation',
    dentistName: 'Dr. James Wilson',
    dateTime: getRelativeDate(0, 14, 30),
    bookedAt: getRelativePastDate(5),
    isNewPatient: false,
    isDependent: false,
    status: 'confirmed',
    mobile: '0498 765 432',
    dob: '05 Nov 1985',
    patientNotes: 'Experiencing pain in lower left molar.',
    bookedBy: 'Michael Brown',
    lastUpdated: getRelativePastDate(1),
  },
  {
    id: 'apt-3',
    patientName: 'Leo Chen',
    treatment: 'General Checkup',
    dentistName: 'Dr. Emily Smith',
    dateTime: getRelativeDate(2, 9, 15),
    bookedAt: getRelativePastDate(1),
    isNewPatient: false,
    isDependent: true,
    status: 'confirmed',
    mobile: '0412 345 678',
    dob: '22 Jul 2015',
    patientNotes: '',
    bookedBy: 'Sarah Chen',
    lastUpdated: getRelativePastDate(1),
  },
  {
    id: 'apt-4',
    patientName: 'Emma Davis',
    treatment: 'Teeth Whitening',
    dentistName: 'Dr. Sarah Connor',
    dateTime: getRelativeDate(-1, 11, 0),
    bookedAt: getRelativePastDate(10),
    isNewPatient: false,
    isDependent: false,
    status: 'completed',
    mobile: '0455 123 456',
    dob: '18 Sep 1992',
    patientNotes: 'Follow up on previous whitening session.',
    bookedBy: 'Emma Davis',
    lastUpdated: getRelativePastDate(1),
  },
  {
    id: 'apt-5',
    patientName: 'Robert Wilson',
    treatment: 'Emergency',
    dentistName: 'Dr. James Wilson',
    dateTime: getRelativeDate(0, 16, 45),
    bookedAt: getRelativePastDate(0),
    isNewPatient: true,
    isDependent: false,
    status: 'pending',
    mobile: '0488 999 111',
    dob: '30 Jan 1980',
    patientNotes: 'Chipped tooth from sports injury.',
    bookedBy: 'Robert Wilson',
    lastUpdated: getRelativePastDate(0),
  },
  {
    id: 'apt-6',
    patientName: 'Jessica Lo',
    treatment: 'Fillings',
    dentistName: 'Dr. Emily Smith',
    dateTime: getRelativeDate(-2, 13, 0),
    bookedAt: getRelativePastDate(7),
    isNewPatient: false,
    isDependent: false,
    status: 'patient_cancelled',
    mobile: '0433 222 111',
    dob: '14 Feb 1995',
    patientNotes: 'Called to cancel due to illness.',
    bookedBy: 'Jessica Lo',
    lastUpdated: getRelativePastDate(2),
  },
  {
    id: 'apt-7',
    patientName: 'Thomas Anderson',
    treatment: 'Extraction',
    dentistName: 'Dr. James Wilson',
    dateTime: getRelativeDate(3, 10, 30),
    bookedAt: getRelativePastDate(14),
    isNewPatient: false,
    isDependent: false,
    status: 'reception_cancelled',
    mobile: '0411 111 222',
    dob: '11 Nov 1970',
    patientNotes: 'Dentist unavailable, need to reschedule.',
    bookedBy: 'Reception',
    lastUpdated: getRelativePastDate(0),
  },
  {
    id: 'apt-8',
    patientName: 'Sophia Martinez',
    treatment: 'Consultation',
    dentistName: 'Unassigned',
    dateTime: getRelativeDate(1, 15, 0),
    bookedAt: getRelativePastDate(1),
    isNewPatient: true,
    isDependent: false,
    status: 'dismissed',
    mobile: '0477 888 999',
    dob: '03 Jun 1998',
    patientNotes: 'Spam request.',
    bookedBy: 'System',
    lastUpdated: getRelativePastDate(0),
  },
];

const STATUS_LABELS: Record<ValidStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  dismissed: 'Dismissed',
  patient_cancelled: 'Pt.Cancelled',
  reception_cancelled: 'Cancelled',
};

const STATUS_CONFIG: Record<ValidStatus, { bg: string; text: string; dot: string }> = {
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  dismissed: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  patient_cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  reception_cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

const TAB_CONFIG: Record<TabType, { label: string; activeColor: string; dotColor: string }> = {
  all: { label: 'All', activeColor: 'bg-gray-900 text-white', dotColor: 'bg-gray-500' },
  pending: { label: 'Pending', activeColor: 'bg-amber-500 text-white', dotColor: 'bg-amber-500' },
  upcoming: { label: 'Upcoming', activeColor: 'bg-blue-500 text-white', dotColor: 'bg-blue-500' },
  completed: { label: 'Completed', activeColor: 'bg-emerald-500 text-white', dotColor: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', activeColor: 'bg-red-500 text-white', dotColor: 'bg-red-500' },
};

const ITEMS_PER_PAGE = 5;

// --- Icons ---
const Icons = {
  Search: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Sliders: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  MoreVertical: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Archive: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  ChevronDown: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  User: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Phone: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  FileText: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Refresh: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Mail: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  Inbox: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  ),
  List: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  ClockPending: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CalendarCheck: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowPath: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Spinner: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
};

// --- Date Formatters ---
const formatDate = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatShortDate = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short' });
};

const formatTime = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

const getWeekday = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { weekday: 'short' });
};

const getDay = (dateStr: string | Date): number => {
  const d = new Date(dateStr);
  return d.getDate();
};

const getMonth = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short' });
};

const isTerminalState = (status: ValidStatus): boolean => {
  return ['completed', 'patient_cancelled', 'reception_cancelled', 'dismissed'].includes(status);
};

const isCancelledStatus = (status: ValidStatus): boolean => {
  return ['patient_cancelled', 'reception_cancelled', 'dismissed'].includes(status);
};

// --- Status Badge Component ---
const StatusBadge = ({ status, size = 'default' }: { status: ValidStatus; size?: 'small' | 'default' }) => {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'small'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses} rounded font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
};

// --- Patient Tags Component ---
const PatientTags = ({ 
  isNewPatient, 
  isDependent, 
  size = 'default' 
}: { 
  isNewPatient: boolean; 
  isDependent: boolean; 
  size?: 'small' | 'default' 
}) => {
  if (!isNewPatient && !isDependent) return null;

  const sizeClasses = size === 'small'
    ? "px-1.5 py-0.5 text-[9px]"
    : "px-2 py-0.5 text-[10px]";

  return (
    <div className="flex items-center gap-1">
      {isNewPatient && (
        <span className={`inline-flex items-center ${sizeClasses} bg-gray-900 text-white font-medium rounded`}>
          NEW
        </span>
      )}
      {isDependent && (
        <span className={`inline-flex items-center gap-0.5 ${sizeClasses} bg-blue-600 text-white font-medium rounded`}>
          DEPENDENT
        </span>
      )}
    </div>
  );
};

// --- Table Header Component ---
const TableHeader = () => (
  <div className="hidden lg:flex items-center gap-4 px-4 md:px-6 py-3 bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold text-sm sticky top-0 z-10 backdrop-blur-sm">
    <div className="flex-[1.5]">Patient Details</div>
    <div className="flex-1">Practitioner</div>
    <div className="flex-[1.2]">Appointment Details</div>
    <div className="flex-1">Status</div>
    <div className="flex-1">Booked At</div>
    <div className="w-16"></div>
  </div>
);

// --- Simple Success Modal Component ---
const SimpleSuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <Icons.Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">The appointment is Rescheduled</h3>
        <p className="text-sm text-gray-500 mb-6">The user has been notified via email and message.</p>
        <button 
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
};

// --- Mobile Bottom Sheet Component (Portal) ---
const MobileBottomSheet = ({
  apt,
  onUpdate,
  onReschedule,
  onClose,
}: {
  apt: EnrichedAppointment;
  onUpdate: (id: string, status: ValidStatus) => void;
  onReschedule: (apt: EnrichedAppointment) => void;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAction = (status: ValidStatus) => {
    onUpdate(apt.id, status);
    onClose();
  };

  const handleReschedule = () => {
    onClose(); 
    setTimeout(() => onReschedule(apt), 100); 
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-4 pb-3 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{apt.patientName}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {formatShortDate(apt.dateTime)} at {formatTime(apt.dateTime)}
          </div>
        </div>
        <div className="p-2">
          {apt.status === 'pending' && (
            <>
              <button onClick={() => handleAction('confirmed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">Confirm Appointment</div>
                  <div className="text-xs text-gray-400">Accept this booking request</div>
                </div>
              </button>
              <button onClick={handleReschedule} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icons.ArrowPath className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Reschedule</div>
                  <div className="text-xs text-gray-400">Change date or time</div>
                </div>
              </button>
              <button onClick={() => handleAction('dismissed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Icons.Archive className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-semibold">Dismiss Request</div>
                  <div className="text-xs text-gray-400">Archive without action</div>
                </div>
              </button>
            </>
          )}
          {apt.status === 'confirmed' && (
            <>
              <button onClick={() => handleAction('completed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">Mark as Completed</div>
                  <div className="text-xs text-gray-400">Appointment has been done</div>
                </div>
              </button>
              <button onClick={handleReschedule} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icons.ArrowPath className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Reschedule</div>
                  <div className="text-xs text-gray-400">Change date or time</div>
                </div>
              </button>
              <button onClick={() => handleAction('reception_cancelled')} className="w-full text-left px-4 py-4 text-sm text-red-600 active:bg-red-50 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Icons.X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-semibold">Cancel Appointment</div>
                  <div className="text-xs text-red-400">Remove from schedule</div>
                </div>
              </button>
            </>
          )}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200">
            Cancel
          </button>
        </div>
        <div className="h-8" />
      </div>
    </div>,
    document.body
  );
};

// --- Desktop Dropdown Component (Inline Absolute) ---
const DesktopDropdown = ({
  apt,
  onUpdate,
  onReschedule,
  onClose,
}: {
  apt: EnrichedAppointment;
  onUpdate: (id: string, status: ValidStatus) => void;
  onReschedule: (apt: EnrichedAppointment) => void;
  onClose: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (status: ValidStatus) => {
    onUpdate(apt.id, status);
    onClose();
  };

  const handleReschedule = () => {
    onReschedule(apt);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-150 z-50 origin-top-right"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => e.stopPropagation()}
    >
      {apt.status === 'pending' && (
        <>
          <button onClick={() => handleAction('confirmed')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Icons.Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Confirm</div>
              <div className="text-xs text-gray-400">Accept booking</div>
            </div>
          </button>
          <button onClick={handleReschedule} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icons.ArrowPath className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Reschedule</div>
              <div className="text-xs text-gray-400">Change date/time</div>
            </div>
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('dismissed')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icons.Archive className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">Cancel</div>
              <div className="text-xs text-gray-400">Remove request</div>
            </div>
          </button>
        </>
      )}
      {apt.status === 'confirmed' && (
        <>
          <button onClick={() => handleAction('completed')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Icons.Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Complete</div>
              <div className="text-xs text-gray-400">Mark as done</div>
            </div>
          </button>
          <button onClick={handleReschedule} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icons.ArrowPath className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Reschedule</div>
              <div className="text-xs text-gray-400">Change date/time</div>
            </div>
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('reception_cancelled')} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Icons.X className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <div className="font-medium">Cancel</div>
              <div className="text-xs text-red-400">Remove booking</div>
            </div>
          </button>
        </>
      )}
    </div>
  );
};

// --- Expanded Details Component ---
const ExpandedDetailsCard = ({ apt }: { apt: EnrichedAppointment }) => {
  return (
    <div className="px-2 pb-2 md:px-4 md:pb-4 cursor-default" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-xl p-4 border border-gray-100 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Contact Info */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Icons.Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${apt.mobile}`} className="hover:text-blue-600 transition-colors">
                  {apt.mobile}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icons.User className="w-4 h-4 text-gray-400" />
                <span>DOB: {apt.dob}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icons.Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">Booked by: {apt.bookedBy}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Booking Info */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Booking Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Icons.Calendar className="w-4 h-4 text-gray-400" />
                <span>Booked: {formatRelativeTime(apt.bookedAt)}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Patient Notes */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Notes</h5>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600 min-h-[60px]">
              {apt.patientNotes || "No notes provided."}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function PracticeAppointmentsView() {
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>(STATIC_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Reschedule State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    practitioner: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setShowSuccessModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = useCallback((id: string, newStatus: ValidStatus) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, status: newStatus, lastUpdated: new Date() } : apt
    ));
    setOpenMenuId(null);
    setExpandedRowId(null);
  }, []);

  // NEW: Handle Reschedule Click
  const handleRescheduleClick = useCallback((apt: EnrichedAppointment) => {
    // 1. Remove the appointment from the list immediately (simulating it moving to a different status/list)
    setAppointments(prev => prev.filter(a => a.id !== apt.id));
    
    // 2. Show the success popup
    setShowSuccessModal(true);
    
    // 3. Close any open menus
    setOpenMenuId(null);
  }, []);

  const handleOpenMenu = useCallback((aptId: string) => {
    setExpandedRowId(null);
    setOpenMenuId(aptId);
  }, []);

  const handleCloseMenu = useCallback(() => setOpenMenuId(null), []);

  const toggleRowExpansion = useCallback((id: string) => {
    setOpenMenuId(null);
    setExpandedRowId(prev => prev === id ? null : id);
  }, []);

  const clearFilters = () => {
    setFilters({ search: '', type: '', practitioner: '', status: '', startDate: '', endDate: '' });
  };

  const practitioners = useMemo(() =>
    [...new Set(appointments.map(a => a.dentistName).filter(Boolean))],
    [appointments]
  );

  const appointmentTypes = useMemo(() =>
    [...new Set(appointments.map(a => a.treatment).filter(Boolean))],
    [appointments]
  );

  const stats = useMemo(() => {
    const now = new Date();
    return {
      all: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      upcoming: appointments.filter(a => new Date(a.dateTime) > now && a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => isCancelledStatus(a.status)).length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      switch (activeTab) {
        case 'pending': if (apt.status !== 'pending') return false; break;
        case 'upcoming': if (aptDate <= now || apt.status !== 'confirmed') return false; break;
        case 'completed': if (apt.status !== 'completed') return false; break;
        case 'cancelled': if (!isCancelledStatus(apt.status)) return false; break;
      }
      if (filters.search && !apt.patientName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type && apt.treatment !== filters.type) return false;
      if (filters.practitioner && apt.dentistName !== filters.practitioner) return false;
      if (filters.status && apt.status !== filters.status) return false;
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        if (aptDate < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (aptDate > end) return false;
      }
      return true;
    });
  }, [appointments, activeTab, filters]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedRowId(null);
      setOpenMenuId(null);
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, '...', totalPages);
      else if (currentPage >= totalPages - 2) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, '...', currentPage, '...', totalPages);
    }
    return pages;
  };

  const activeFilterCount = Object.values(filters).filter(x => x !== '').length;
  const openMenuApt = useMemo(() => appointments.find(a => a.id === openMenuId), [appointments, openMenuId]);

  const getTabIcon = (key: TabType) => {
    switch (key) {
      case 'all': return <Icons.List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'pending': return <Icons.ClockPending className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'upcoming': return <Icons.CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'completed': return <Icons.CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'cancelled': return <Icons.XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default: return null;
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'all': return "No appointments found";
      case 'pending': return "No pending requests at the moment";
      case 'upcoming': return "No upcoming appointments scheduled";
      case 'completed': return "No completed appointments yet";
      case 'cancelled': return "No cancelled appointments";
      default: return "No appointments found for the selected filters";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse" />
          </div>
          <div className="px-4 sm:px-6 py-3 flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="px-4 sm:px-6 py-2 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-14 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your practice bookings</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all text-xs sm:text-sm border border-gray-200">
              <Icons.Refresh className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="bg-white">
          {/* Tabs */}
          <div className="px-2 sm:px-6 py-2 sm:py-3 border-b border-gray-100">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-hide">
              {(['all', 'pending', 'upcoming', 'completed', 'cancelled'] as TabType[]).map((tabKey) => {
                const tabConfig = TAB_CONFIG[tabKey];
                const count = stats[tabKey];
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => {
                      setActiveTab(tabKey);
                      setOpenMenuId(null);
                      setExpandedRowId(null);
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                  >
                    <span className="hidden xs:inline-flex">{getTabIcon(tabKey)}</span>
                    <span>{tabConfig.label}</span>
                    {count > 0 && (
                      <span className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full font-semibold transition-colors duration-200 ${isActive ? tabConfig.activeColor : 'bg-gray-200 text-gray-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="px-2 sm:px-6 py-2 sm:py-3 border-b border-gray-100">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icons.Search className="absolute left-3 top-1/4 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || activeFilterCount > 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <Icons.Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Practitioner</label>
                  <select value={filters.practitioner} onChange={(e) => handleFilterChange('practitioner', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="">All Practitioners</option>
                    {practitioners.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Treatment</label>
                  <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="">All Services</option>
                    {appointmentTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">From</label>
                  <input type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">To</label>
                  <input type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              </div>
            )}
          </div>

          {/* Table Header - Only visible on lg+ screens */}
          {filteredAppointments.length > 0 && <TableHeader />}

          {/* List Content */}
          <div className="min-h-[400px]">
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icons.Inbox className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No appointments</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">{getEmptyStateMessage()}</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {paginatedAppointments.map((apt) => {
                  const isExpanded = expandedRowId === apt.id;

                  return (
                    <div key={apt.id} className="bg-white">
                      
                      {/* ============ MOBILE/TABLET VIEW (< 1024px) ============ */}
                      <div className="lg:hidden">
                        <div 
                          onClick={() => toggleRowExpansion(apt.id)} 
                          className={`px-3 sm:px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <StatusBadge status={apt.status} size="small" />
                            <div className="flex items-center gap-1">
                              <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} size="small" />
                              {!isTerminalState(apt.status) && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenMenu(apt.id); }} 
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                  <Icons.MoreVertical className="w-4 h-4" />
                                </button>
                              )}
                              <button className={`p-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-12 sm:w-14 h-14 sm:h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getWeekday(apt.dateTime)}</span>
                              <span className="text-lg sm:text-xl font-bold text-gray-900 leading-none">{getDay(apt.dateTime)}</span>
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getMonth(apt.dateTime)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">{apt.patientName}</h4>
                              <div className="mt-1 space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <Icons.Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium">{formatTime(apt.dateTime)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Icons.Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{apt.treatment}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Icons.User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{apt.dentistName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Mobile/Tablet Expanded Details */}
                        {isExpanded && <ExpandedDetailsCard apt={apt} />}
                        </div>

                        
                      </div>

                      {/* ============ DESKTOP VIEW (>= 1024px) ============ */}
                      <div 
                        className={`hidden lg:block transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
                      >
                        <div 
                          className="flex items-center px-4 md:px-6 py-4 cursor-pointer"
                          onClick={() => toggleRowExpansion(apt.id)}
                        >
                          {/* 1. Patient Details */}
                          <div className="flex-[1.5] min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{apt.patientName}</h4>
                              <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="truncate">{apt.mobile}</span>
                            </div>
                          </div>

                          {/* 2. Practitioner */}
                          <div className="flex-1 pr-4">
                            <div className="text-sm font-medium text-gray-700">{apt.dentistName}</div>
                            <div className="text-xs text-gray-400">Dentist</div>
                          </div>

                          {/* 3. Appointment Details */}
                          <div className="flex-[1.2] min-w-0 pr-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                              {formatShortDate(apt.dateTime)} <span className="text-gray-300">|</span> {formatTime(apt.dateTime)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate">{apt.treatment}</div>
                          </div>

                          {/* 4. Status */}
                          <div className="flex-1 pr-4">
                            <StatusBadge status={apt.status} />
                          </div>

                          {/* 5. Booked At */}
                          <div className="flex-1 text-sm text-gray-600">
                            {formatRelativeTime(apt.bookedAt)}
                          </div>

                          {/* Actions */}
                          <div className="w-16 flex justify-end items-center gap-1 relative">
                            {!isTerminalState(apt.status) && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenMenu(apt.id); }} 
                                className={`p-1.5 rounded-lg transition-all ${openMenuId === apt.id ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                              >
                                <Icons.MoreVertical className="w-5 h-5" />
                              </button>
                            )}

                            {/* DROPDOWN RENDERED INLINE FOR DESKTOP */}
                            {openMenuId === apt.id && !isMobile && (
                                <DesktopDropdown 
                                  apt={apt} 
                                  onUpdate={handleStatusUpdate} 
                                  onReschedule={handleRescheduleClick} 
                                  onClose={handleCloseMenu} 
                                />
                            )}

                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleRowExpansion(apt.id); }} 
                              className={`p-1.5 transition-transform duration-200 text-gray-400 hover:text-gray-600 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <Icons.ChevronDown className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Desktop Expanded Details */}
                        {isExpanded && <ExpandedDetailsCard apt={apt} />}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer (Pagination) */}
          {filteredAppointments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-gray-700">{filteredAppointments.length}</span> appointments
                {totalPages > 1 && <span className="hidden sm:inline"> • Page {currentPage} of {totalPages}</span>}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className={`px-2.5 py-1.5 text-xs rounded-md transition-all ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Previous
                  </button>
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button 
                          key={index} 
                          onClick={() => handlePageChange(page)} 
                          className={`w-7 h-7 flex items-center justify-center text-xs rounded-md transition-all ${currentPage === page ? 'font-medium text-white bg-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">{page}</span>
                      )
                    ))}
                  </div>
                  <span className="sm:hidden text-xs text-gray-500">{currentPage} / {totalPages}</span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    className={`px-2.5 py-1.5 text-xs rounded-md transition-all ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      {/* Mobile Bottom Sheet Portal (Only for Mobile) */}
      {openMenuId && openMenuApt && isMobile && (
        <MobileBottomSheet 
          apt={openMenuApt} 
          onUpdate={handleStatusUpdate} 
          onReschedule={handleRescheduleClick} 
          onClose={handleCloseMenu} 
        />
      )}

      {/* Simple Success Modal */}
      <SimpleSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}