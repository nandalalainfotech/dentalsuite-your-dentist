/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { practiceApi } from "../../data/practiceApi";
import type { Appointment } from "../../types/dashboard";

// --- Types & Interfaces ---
type ValidStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'reception_cancelled';

interface EnrichedAppointment extends Omit<Appointment, 'status'> {
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

const STATUS_LABELS: Record<ValidStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  dismissed: 'Dismissed',
  patient_cancelled: 'Cancelled',
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

// --- Icons ---
const Icons = {
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Sliders: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  MoreVertical: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Archive: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  ChevronDown: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  User: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Phone: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  FileText: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Refresh: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Mail: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  Inbox: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  ),
  Stethoscope: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
};

// --- Date Formatters ---
const formatDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatShortDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short' });
};

const formatTime = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatRelativeTime = (date: Date) => {
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

const getWeekday = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { weekday: 'short' });
};

const getDay = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.getDate();
};

const getMonth = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short' });
};

const isTerminalState = (status: ValidStatus) => {
  return ['completed', 'patient_cancelled', 'reception_cancelled', 'dismissed'].includes(status);
};

export default function PracticeAppointmentsView() {
  // --- State ---
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    practitioner: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // --- Data Initialization ---
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const practices = practiceApi.getAllPractices();
      const rawAppts = practices.flatMap(practice => practice.appointments || []);
      const now = new Date();

      const enriched = rawAppts.map((apt, index) => {
        let apptDate = new Date(now);
        const bookedDate = new Date(now);
        let updatedDate = new Date(now);
        let assignedStatus: ValidStatus;

        if (index === 0) {
          apptDate.setDate(now.getDate() + 1);
          apptDate.setHours(10, 0, 0, 0);
          bookedDate.setHours(now.getHours() - 2);
          updatedDate = bookedDate;
          assignedStatus = 'pending';
        } else if (index === 1) {
          apptDate.setDate(now.getDate() + 3);
          apptDate.setHours(14, 30, 0, 0);
          bookedDate.setDate(now.getDate() - 7);
          updatedDate.setHours(now.getHours() - 1);
          assignedStatus = 'patient_cancelled';
        } else if (index === 2) {
          apptDate.setDate(now.getDate() - 1);
          apptDate.setHours(11, 15, 0, 0);
          bookedDate.setDate(now.getDate() - 14);
          updatedDate.setDate(now.getDate() - 1);
          assignedStatus = 'completed';
        } else if (index === 3) {
          apptDate.setDate(now.getDate() + 4);
          apptDate.setHours(9, 0, 0, 0);
          bookedDate.setDate(now.getDate() - 2);
          updatedDate.setHours(now.getHours() - 4);
          assignedStatus = 'reception_cancelled';
        } else if (index === 4) {
          apptDate = new Date(now);
          apptDate.setHours(16, 0, 0, 0);
          bookedDate.setDate(now.getDate() - 1);
          updatedDate.setDate(now.getDate());
          assignedStatus = 'dismissed';
        } else {
          const daysAhead = index + 2;
          apptDate.setDate(now.getDate() + daysAhead);
          apptDate.setHours(9 + (index % 8), 0, 0, 0);
          bookedDate.setDate(now.getDate() - (index % 5) - 1);
          updatedDate = bookedDate;
          assignedStatus = 'confirmed';
        }

        const bookerName = index % 3 === 1 ? "John Smith" : apt.patientName;
        const isDependent = bookerName !== apt.patientName;

        return {
          ...apt,
          dateTime: apptDate.toISOString(),
          bookedAt: bookedDate,
          lastUpdated: updatedDate,
          status: assignedStatus,
          isNewPatient: index % 4 === 0,
          isDependent: isDependent,
          bookedBy: bookerName,
          mobile: "+61 450 003 518",
          dob: "20 Dec 1978",
          patientNotes: index % 2 === 0 ? "Regular check up. Patient mentioned some sensitivity on upper right molar." : "Experiencing tooth pain on lower left side for about 2 weeks."
        } as unknown as EnrichedAppointment;
      })
        .sort((a, b) => {
          const aIsPending = a.status === 'pending';
          const bIsPending = b.status === 'pending';
          if (aIsPending && !bIsPending) return -1;
          if (!aIsPending && bIsPending) return 1;
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
        });

      setAppointments(enriched);
      setIsLoading(false);
    }, 500);
  }, []);

  // --- Handlers ---
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = (id: string, newStatus: ValidStatus) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, status: newStatus, lastUpdated: new Date() } : apt
    ));
    setOpenMenuId(null);
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', practitioner: '', status: '', startDate: '', endDate: '' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Derived Data ---
  const practitioners = useMemo(() =>
    [...new Set(appointments.map(a => a.dentistName))].filter(Boolean),
    [appointments]
  );

  const appointmentTypes = useMemo(() =>
    [...new Set(appointments.map(a => a.treatment))].filter(Boolean),
    [appointments]
  );

  const stats = useMemo(() => {
    const now = new Date();
    return {
      pending: appointments.filter(a => a.status === 'pending').length,
      upcoming: appointments.filter(a => new Date(a.dateTime) > now && a.status === 'confirmed').length,
      completed: appointments.filter(a => new Date(a.dateTime) < now || isTerminalState(a.status)).length,
      total: appointments.length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();

    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);

      if (activeTab === 'pending' && apt.status !== 'pending') return false;
      if (activeTab === 'upcoming' && (aptDate <= now || apt.status !== 'confirmed')) return false;
      if (activeTab === 'completed' && aptDate > now && !isTerminalState(apt.status)) return false;

      if (filters.search && apt.patientName && !apt.patientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
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

  // --- Status Badge ---
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
  const PatientTags = ({ isNewPatient, isDependent, size = 'default' }: { isNewPatient: boolean; isDependent: boolean; size?: 'small' | 'default' }) => {
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
            <Icons.Users className="w-2.5 h-2.5" />
            DEPENDENT
          </span>
        )}
      </div>
    );
  };

  const activeFilterCount = Object.values(filters).filter(x => x !== '').length;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="px-4 sm:px-6 py-3 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Cards Skeleton */}
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
    <div className="max-h-screen border rounded bg-white">
      <div className="w-full max-w-7xl mx-auto">

        {/* --- Header --- */}
        <div className="bg-white ">
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

        {/* --- Main Content --- */}
        <div className="bg-white">

          {/* --- Tabs --- */}
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-full sm:w-fit overflow-x-auto">
              {[
                { key: 'pending', label: 'Pending', count: stats.pending },
                { key: 'upcoming', label: 'Upcoming', count: stats.upcoming },
                { key: 'completed', label: 'Completed', count: stats.completed },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'pending' | 'upcoming' | 'completed')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded ${activeTab === tab.key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* --- Search & Filters --- */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
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
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || activeFilterCount > 0
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700'
                  }`}
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
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Practitioner</label>
                  <select
                    value={filters.practitioner}
                    onChange={(e) => handleFilterChange('practitioner', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">All Practitioners</option>
                    {practitioners.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Treatment</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">All Services</option>
                    {appointmentTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">From</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">To</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* --- Content --- */}
          <div className="min-h-[400px]">
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icons.Inbox className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No appointments</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  {activeTab === 'pending'
                    ? "No pending requests at the moment"
                    : "No appointments found for the selected filters"
                  }
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredAppointments.map((apt) => {
                  const isExpanded = expandedRowId === apt.id;
                  const isPending = apt.status === 'pending';

                  return (
                    <div key={apt.id} className={isPending ? 'bg-amber-50/40' : ''}>

                      {/* ============ MOBILE VIEW (< 640px) ============ */}
                      <div className="sm:hidden">
                        <div
                          onClick={() => toggleRowExpansion(apt.id)}
                          className={`px-4 py-3 cursor-pointer active:bg-gray-50 ${isExpanded ? 'bg-gray-50' : ''}`}
                        >
                          {/* Top Row: Status + Actions */}
                          <div className="flex items-center justify-between mb-2">
                            <StatusBadge status={apt.status} size="small" />
                            <div className="flex items-center gap-1">
                              <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} size="small" />

                              {!isTerminalState(apt.status) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === apt.id ? null : apt.id);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                  <Icons.MoreVertical className="w-4 h-4" />
                                </button>
                              )}

                              <button className={`p-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* Main Content Row */}
                          <div className="flex gap-3">
                            {/* Date Block */}
                            <div className="flex-shrink-0 w-12 h-14 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getWeekday(apt.dateTime)}</span>
                              <span className="text-lg font-bold text-gray-900 leading-none">{getDay(apt.dateTime)}</span>
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getMonth(apt.dateTime)}</span>
                            </div>

                            {/* Patient Info */}
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
                        </div>

                        {/* Mobile Expanded Details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-gray-50 animate-in slide-in-from-top-1 duration-200">
                            <div className="space-y-4">
                              {/* Contact Section */}
                              <div className="bg-white rounded-xl p-3 shadow-sm">
                                <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</h5>
                                <div className="space-y-2">
                                  <a href={`tel:${apt.mobile}`} className="flex items-center gap-2 text-xs text-blue-600">
                                    <Icons.Phone className="w-4 h-4" />
                                    <span>{apt.mobile}</span>
                                  </a>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Icons.User className="w-4 h-4 text-gray-400" />
                                    <span>DOB: {apt.dob}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Icons.Mail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">Booked by: {apt.bookedBy}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Appointment Details */}
                              <div className="bg-white rounded-xl p-3 shadow-sm">
                                <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Appointment</h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Date & Time</div>
                                    <div className="text-xs font-medium text-gray-800">{formatShortDate(apt.dateTime)}</div>
                                    <div className="text-xs text-gray-500">{formatTime(apt.dateTime)}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Treatment</div>
                                    <div className="text-xs font-medium text-gray-800">{apt.treatment}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Practitioner</div>
                                    <div className="text-xs font-medium text-gray-800">{apt.dentistName}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Booked</div>
                                    <div className="text-xs text-gray-600">{formatRelativeTime(apt.bookedAt)}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {apt.patientNotes && (
                                <div className="bg-white rounded-xl p-3 shadow-sm">
                                  <h5 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Patient Notes</h5>
                                  <p className="text-xs text-gray-600 leading-relaxed">{apt.patientNotes}</p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              {!isTerminalState(apt.status) && (
                                <div className="flex gap-2 pt-2">
                                  {apt.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-xs font-medium rounded-xl"
                                      >
                                        <Icons.Check className="w-4 h-4" />
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => handleStatusUpdate(apt.id, 'dismissed')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 border text-gray-700 text-xs font-medium rounded-xl"
                                      >
                                        <Icons.Archive className="w-4 h-4" />
                                        Dismiss
                                      </button>
                                    </>
                                  )}
                                  {apt.status === 'confirmed' && (
                                    <>
                                      <button
                                        onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl"
                                      >
                                        <Icons.Check className="w-4 h-4" />
                                        Complete
                                      </button>
                                      <button
                                        onClick={() => handleStatusUpdate(apt.id, 'reception_cancelled')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl"
                                      >
                                        <Icons.X className="w-4 h-4" />
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Mobile Action Dropdown */}
                        {openMenuId === apt.id && (
                          <ActionDropdown
                            isOpen={true}
                            apt={apt}
                            onUpdate={handleStatusUpdate}
                            onClose={() => setOpenMenuId(null)}
                          />
                        )}
                      </div>

                      {/* ============ TABLET & DESKTOP VIEW (>= 640px) ============ */}
                      <div className="hidden sm:block">
                        <div
                          onClick={() => toggleRowExpansion(apt.id)}
                          className={`group px-4 md:px-6 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Date Block */}
                            <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getWeekday(apt.dateTime)}</span>
                              <span className="text-xl font-bold text-gray-900 leading-none">{getDay(apt.dateTime)}</span>
                              <span className="text-[10px] font-medium text-gray-500 uppercase">{getMonth(apt.dateTime)}</span>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 truncate">{apt.patientName}</h4>
                                <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} />
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{formatTime(apt.dateTime)}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="truncate">{apt.treatment}</span>
                              </div>
                            </div>

                            {/* Practitioner - Desktop */}
                            <div className="hidden lg:block min-w-[140px]">
                              <div className="text-sm font-medium text-gray-700">{apt.dentistName}</div>
                              <div className="text-xs text-gray-400">Practitioner</div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-3">
                              <StatusBadge status={apt.status} />

                              {!isTerminalState(apt.status) && (
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === apt.id ? null : apt.id);
                                    }}
                                    className={`p-2 rounded-lg transition-all ${openMenuId === apt.id
                                        ? 'bg-gray-200 text-gray-700'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                      }`}
                                  >
                                    <Icons.MoreVertical className="w-5 h-5" />
                                  </button>

                                  {openMenuId === apt.id && (
                                    <ActionDropdown
                                      isOpen={true}
                                      apt={apt}
                                      onUpdate={handleStatusUpdate}
                                      onClose={() => setOpenMenuId(null)}
                                      isDesktop={true}
                                    />
                                  )}
                                </div>
                              )}

                              <button className={`p-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDown className="w-5 h-5 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          {/* Desktop Expanded Details */}
                          {isExpanded && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                              <div className="bg-gray-50 rounded-2xl p-5">
                                {/* Practitioner for Tablet */}
                                <div className="lg:hidden mb-4 pb-4 border-b border-gray-200">
                                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Practitioner</div>
                                  <div className="text-sm font-medium text-gray-800">{apt.dentistName}</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Contact */}
                                  <div>
                                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">Contact</h5>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                          <Icons.Phone className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <span className="text-gray-700">{apt.mobile}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                          <Icons.User className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <span className="text-gray-700">DOB: {apt.dob}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                          <Icons.Mail className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <span className="text-gray-700 truncate">Booked by: {apt.bookedBy}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Booking Info */}
                                  <div>
                                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">Booking</h5>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                          <Icons.Calendar className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                          <div className="text-gray-700">{formatDate(apt.dateTime)}</div>
                                          <div className="text-gray-400 text-xs">{formatTime(apt.dateTime)}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                          <Icons.Clock className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                          <div className="text-gray-700">Booked {formatRelativeTime(apt.bookedAt)}</div>
                                          <div className="text-gray-400 text-xs">Updated {formatRelativeTime(apt.lastUpdated)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  <div>
                                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">Notes</h5>
                                    <div className="bg-white rounded-xl p-3 shadow-sm">
                                      <div className="flex items-start gap-2">
                                        <Icons.FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          {apt.patientNotes || 'No notes provided.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {!isTerminalState(apt.status) && (
                                  <div className="mt-5 pt-5 border-t border-gray-200 flex flex-wrap gap-3">
                                    {apt.status === 'pending' && (
                                      <>
                                        <button
                                          onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                                        >
                                          <Icons.Check className="w-4 h-4" />
                                          Confirm Appointment
                                        </button>
                                        <button
                                          onClick={() => handleStatusUpdate(apt.id, 'dismissed')}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all"
                                        >
                                          <Icons.Archive className="w-4 h-4" />
                                          Dismiss
                                        </button>
                                      </>
                                    )}
                                    {apt.status === 'confirmed' && (
                                      <>
                                        <button
                                          onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                                        >
                                          <Icons.Check className="w-4 h-4" />
                                          Mark Complete
                                        </button>
                                        <button
                                          onClick={() => handleStatusUpdate(apt.id, 'reception_cancelled')}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-all"
                                        >
                                          <Icons.X className="w-4 h-4" />
                                          Cancel
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* --- Footer --- */}
          {filteredAppointments.length > 0 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-gray-700">{filteredAppointments.length}</span> appointment
              </div>
              <div className="flex items-center gap-1">
                <button disabled className="px-2.5 py-1.5 text-xs text-gray-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="w-7 h-7 flex items-center justify-center text-xs font-medium text-white bg-gray-900 rounded-md">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-100 rounded-md">
                  2
                </button>
                <button className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Action Dropdown ---
const ActionDropdown = ({
  isOpen,
  apt,
  onUpdate,
  onClose,
  isDesktop = false,
}: {
  isOpen: boolean;
  apt: EnrichedAppointment;
  onUpdate: (id: string, status: ValidStatus) => void;
  onClose: () => void;
  isDesktop?: boolean;
}) => {
  if (!isOpen) return null;

  const handleAction = (e: React.MouseEvent, status: ValidStatus) => {
    e.stopPropagation();
    onUpdate(apt.id, status);
    onClose();
  };

  // Desktop dropdown
  if (isDesktop) {
    return (
      <div
        className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {apt.status === 'pending' && (
          <>
            <button
              onClick={(e) => handleAction(e, 'confirmed')}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icons.Check className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Confirm</div>
                <div className="text-xs text-gray-400">Accept booking</div>
              </div>
            </button>
            <button
              onClick={(e) => handleAction(e, 'dismissed')}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icons.Archive className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Dismiss</div>
                <div className="text-xs text-gray-400">Remove request</div>
              </div>
            </button>
          </>
        )}

        {apt.status === 'confirmed' && (
          <>
            <button
              onClick={(e) => handleAction(e, 'completed')}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icons.Check className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Complete</div>
                <div className="text-xs text-gray-400">Mark as done</div>
              </div>
            </button>
            <button
              onClick={(e) => handleAction(e, 'reception_cancelled')}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
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
  }

  // Mobile bottom sheet
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-in fade-in duration-200"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Patient Info Header */}
        <div className="px-4 pb-3 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{apt.patientName}</div>
          <div className="text-xs text-gray-500 mt-0.5">{formatShortDate(apt.dateTime)} at {formatTime(apt.dateTime)}</div>
        </div>

        {/* Actions */}
        <div className="p-2">
          {apt.status === 'pending' && (
            <>
              <button
                onClick={(e) => handleAction(e, 'confirmed')}
                className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">Confirm Appointment</div>
                  <div className="text-xs text-gray-400">Accept this booking request</div>
                </div>
              </button>
              <button
                onClick={(e) => handleAction(e, 'dismissed')}
                className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"
              >
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
              <button
                onClick={(e) => handleAction(e, 'completed')}
                className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icons.Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Mark as Completed</div>
                  <div className="text-xs text-gray-400">Appointment has been done</div>
                </div>
              </button>
              <button
                onClick={(e) => handleAction(e, 'reception_cancelled')}
                className="w-full text-left px-4 py-4 text-sm text-red-600 active:bg-red-50 flex items-center gap-4 rounded-xl"
              >
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

        {/* Cancel Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-full py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200"
          >
            Cancel
          </button>
        </div>

        {/* Safe area padding */}
        <div className="h-6" />
      </div>
    </>
  );
};