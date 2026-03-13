/* eslint-disable react-hooks/set-state-in-effect */
import {
  Archive, Calendar, CalendarCheck, Check, CheckCircle, ChevronDown,
  ChevronLeft, ChevronRight, Clock, Inbox, List, Loader2, Mail,
  MoreVertical, Phone, RefreshCw, Search, Sliders, User, X, XCircle
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { getAppointmentsService } from '../../services/onlinebookingservice';
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAppSelector } from '../../store/hooks';

// --- Types & Interfaces ---
type ValidStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'reception_cancelled';

type TabType = 'all' | 'pending' | 'upcoming' | 'completed' | 'cancelled';

export interface EnrichedAppointment {
  id: string;
  patient_name: string;
  treatment: string;
  dentist_name: string;
  appointment_date: string;
  appointment_time: string;
  bookedAt: Date;
  isNewPatient: boolean;
  isDependent: boolean;
  status: ValidStatus;
  mobile: string;
  dob: string;
  patient_notes: string;
  booked_by: string;
  created_at: string;
  updated_at: string;
  is_rescheduled?: boolean;
  lastUpdated?: Date; // Added for local state tracking
}

interface FilterState {
  search: string;
  type: string;
  practitioner: string;
  status: string;
  startDate: string;
  endDate: string;
}

// --- Configuration ---
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

// --- Date Formatters ---
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (dateStr: string | Date): string => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short' });
};

const formatTime = (dateStr: string | Date, timeStr?: string): string => {
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatRelativeUpdatedAt = (dateString?: string) => {
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

const formatExactUpdatedAt = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
};
const formatExactCreatedAt = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
};

// --- Mappers ---
export const mapAppointmentToEnriched = (apt: any): EnrichedAppointment => {
  const mapStatus = (apiStatus: string): ValidStatus => {
    const statusMap: Record<string, ValidStatus> = {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      COMPLETED: 'completed',
      DISMISSED: 'dismissed',
      PATIENT_CANCELLED: 'patient_cancelled',
      RECEPTION_CANCELLED: 'reception_cancelled',
      CANCELLED: 'reception_cancelled'
    };
    return statusMap[apiStatus?.toUpperCase()] || 'pending';
  };

  const time = apt.appointment_time?.substring(0, 5) || '00:00';
  const bookedAt = new Date(`${apt.appointment_date}T${time}`);

  return {
    id: apt.id,
    patient_name: apt.patient_name,
    treatment: apt.treatment,
    dentist_name: apt.dentist_name,
    appointment_date: apt.appointment_date,
    appointment_time: time,
    bookedAt,
    isNewPatient: apt.isNewPatient || false,
    isDependent: apt.isDependent || false,
    status: mapStatus(apt.status),
    mobile: apt.mobile,
    dob: apt.dob,
    patient_notes: apt.patient_notes || '',
    booked_by: apt.booked_by || apt.patient_name,
    created_at: apt.created_at,
    updated_at: apt.updated_at,
    is_rescheduled: apt.is_rescheduled || false,
  };
};

function formatRelativeTime(createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  if (diff < 0) return "Just now";
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return created.toLocaleDateString();
}

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

// --- Components ---

const StatusBadge = ({
  status,
  size = "default",
  is_rescheduled = false
}: {
  status: ValidStatus;
  size?: "small" | "default";
  is_rescheduled?: boolean;
}) => {
  const { bg, text, dot } = STATUS_CONFIG[status];
  const sizeClasses = size === "small" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";
  const rescheduledClasses = is_rescheduled ? "ring-2 ring-blue-500 ring-offset-1" : "";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-medium ${sizeClasses} ${bg} ${text} ${rescheduledClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
};

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
  const sizeClasses = size === 'small' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";

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

const TableHeader = () => (
  <div className="hidden lg:flex items-center gap-4 px-4 md:px-6 py-3 bg-gray-50/80 text-gray-500 font-semibold text-sm sticky top-0 z-10 backdrop-blur-sm">
    <div className="flex-[1.5]">Patient Details</div>
    <div className="flex-1">Practitioner</div>
    <div className="flex-[1.2]">Appointment Details</div>
    <div className="flex-1">Status</div>
    <div className="flex-1">Booked At</div>
    <div className="w-16"></div>
  </div>
);

const ToastNotification = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed bottom-4 right-4 z-[10000] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm font-medium">{message}</div>
      </div>
    </div>,
    document.body
  );
};

// --- Reschedule Modal Component ---
const RescheduleModal = ({
  apt,
  isOpen,
  onClose,
  onConfirm,
  practitioners
}: {
  apt: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  practitioners: string[];
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPractitioner, setSelectedPractitioner] = useState('');
  const [reason, setReason] = useState('');
  const [isPractitionerOpen, setIsPractitionerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());

  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(formatLocalDate(tomorrow));
      setSelectedPractitioner(apt.dentist_name);
      setSelectedTime('');
      setReason('');
      setCalendarViewDate(tomorrow);
    }
  }, [isOpen, apt]);

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedPractitioner]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const changeMonth = (offset: number) => {
    const newDate = new Date(calendarViewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCalendarViewDate(newDate);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const generateSlotsForDate = (dateStr: string): string[] => {
    if (!dateStr) return [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return [];
    if (dayOfWeek === 6) return ['09:00', '09:30', '10:00', '10:30', '11:00'];
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    const dateNum = date.getDate();
    return baseSlots.filter((_, index) => {
      const hash = (dateNum + index) % 5;
      return hash !== 0;
    });
  };

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const weekAvailability = useMemo(() => {
    if (!selectedDate) return [];
    const startDate = new Date(selectedDate);
    const days: { date: Date; dateStr: string; slots: string[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const dateStr = formatLocalDate(currentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (currentDate < today) continue;
      const slots = generateSlotsForDate(dateStr);
      const now = new Date();

      const filteredSlots = slots.filter(slot => {
        if (selectedDate !== formatLocalDate(new Date())) return true;
        const [hour, minute] = slot.split(':');
        const slotTime = new Date();
        slotTime.setHours(Number(hour), Number(minute), 0, 0);
        return slotTime > now;
      });
      days.push({
        date: currentDate,
        dateStr,
        slots: filteredSlots
      });
    }
    return days;
  }, [selectedDate, selectedPractitioner]);

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const renderCalendar = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = formatLocalDate(dateObj);
      const isSelected = selectedDate === dateStr;
      const isToday = isSameDay(dateObj, new Date());
      const disabled = isDateDisabled(dateObj);
      const isSunday = dateObj.getDay() === 0;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            if (!disabled) {
              setSelectedDate(dateStr);
              setSelectedTime('');
            }
          }}
          disabled={disabled}
          className={`
            h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
            ${disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
            ${isSunday && !disabled ? 'text-red-500' : ''}
            ${isSelected && !disabled
              ? 'bg-blue-600 text-white font-bold shadow-md'
              : !disabled ? 'hover:bg-white text-gray-800' : ''
            }
            ${isToday && !isSelected && !disabled ? 'text-blue-600 font-bold ring-2 ring-blue-200' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const handleSlotSelect = (dateStr: string, time: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onConfirm(selectedDate, selectedTime);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-br from-white via-blue-100 to-white border-b border-gray-100 flex justify-between items-center z-20 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Reschedule Appointment</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <span className="font-medium text-gray-700">{apt.patient_name}</span>
              <span>•</span>
              <span>{apt.treatment}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-[320px] lg:w-[360px] bg-gradient-to-br from-white to-gray-100 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col p-4 sm:p-6 flex-shrink-0 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-base">
                  {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                  <button type="button" onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => changeMonth(1)} className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                  <span key={i} className={`text-xs font-semibold h-8 flex items-center justify-center ${i === 0 ? 'text-red-500' : 'text-gray-600'}`}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>

            <div className="mt-auto">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <User className="w-4 h-4" /> Practitioner
              </label>
              <div className="relative">
                <button type="button" onClick={() => setIsPractitionerOpen(!isPractitionerOpen)} className="w-full flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition-all text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 text-sm truncate">{selectedPractitioner || 'Select Dentist'}</p></div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isPractitionerOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPractitionerOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 max-h-48 overflow-y-auto">
                    {practitioners.map((name) => (
                      <button key={name} type="button" onClick={() => { setSelectedPractitioner(name); setIsPractitionerOpen(false); setSelectedTime(''); }} className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 ${selectedPractitioner === name ? 'bg-blue-50/50' : ''}`}>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><span className="text-xs font-bold">{name.charAt(0)}</span></div>
                        <div className="text-left flex-1 min-w-0"><p className={`text-sm font-medium truncate ${selectedPractitioner === name ? 'text-blue-700' : 'text-gray-700'}`}>{name}</p></div>
                        {selectedPractitioner === name && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">Available Time Slots</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Showing 7 days from {selectedDate ? formatDate(selectedDate) : 'selected date'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {weekAvailability.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                  <Calendar className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-medium">Select a date to view availability</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {weekAvailability.map((dayData) => {
                    const isSelectedDay = selectedDate === dayData.dateStr;
                    const isToday = isSameDay(dayData.date, new Date());
                    return (
                      <div key={dayData.dateStr} className={`rounded-xl border transition-all ${isSelectedDay ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${isSelectedDay ? 'border-blue-100' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${isToday ? 'bg-blue-600 text-white' : isSelectedDay ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              <span className="text-[10px] font-bold uppercase leading-none">{dayData.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                              <span className="text-sm font-bold leading-none mt-0.5">{dayData.date.getDate()}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">{dayData.date.toLocaleDateString('en-US', { weekday: 'long' })} {isToday && (<span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Today</span>)}</p>
                              <p className="text-xs text-gray-500">{dayData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${dayData.slots.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{dayData.slots.length} slots</span>
                          </div>
                        </div>
                        <div className="p-4">
                          {dayData.slots.length === 0 ? (
                            <div className="flex items-center justify-center py-4 text-gray-400">
                              <Clock className="w-4 h-4 mr-2 opacity-50" />
                              <span className="text-sm">No available slots</span></div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {dayData.slots.map((time) => {
                                const isSelected = selectedDate === dayData.dateStr && selectedTime === time;
                                return (
                                  <button key={`${dayData.dateStr}-${time}`} type="button" onClick={() => handleSlotSelect(dayData.dateStr, time)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                                    {formatTimeDisplay(time)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Reschedule (Optional)</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Patient requested later time..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div className="text-sm">
                  {selectedTime && selectedDate ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Check className="w-4 h-4 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-500">New Time</p><p className="font-semibold text-gray-900">{formatDate(selectedDate)} at {formatTimeDisplay(selectedTime)}</p></div>
                    </div>
                  ) : (<span className="text-gray-400 text-sm">Select a time slot to continue</span>)}
                </div>
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm">Cancel</button>
                  <button onClick={handleConfirm} disabled={!selectedDate || !selectedTime || isLoading} className={`flex-1 sm:flex-none px-6 py-2.5 font-medium rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${selectedDate && selectedTime && !isLoading ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}>
                    {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></>) : (<span>Confirm Reschedule</span>)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="text-sm font-semibold text-gray-900">{apt.patient_name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {formatShortDate(apt.appointment_date)} at {formatTime(apt.appointment_date, apt.appointment_time)}
          </div>
        </div>
        <div className="p-2">
          {apt.status === 'pending' && (
            <>
              <button onClick={() => handleAction('confirmed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">Confirm Appointment</div>
                  <div className="text-xs text-gray-400">Accept this booking request</div>
                </div>
              </button>
              {!apt.is_rescheduled && (
                <button onClick={handleReschedule} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ArrowPathIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Reschedule</div>
                    <div className="text-xs text-gray-400">Change date or time</div>
                  </div>
                </button>
              )}
              <button onClick={() => handleAction('dismissed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Archive className="w-5 h-5 text-gray-600" />
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
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">Mark as Completed</div>
                  <div className="text-xs text-gray-400">Appointment has been done</div>
                </div>
              </button>
              {!apt.is_rescheduled && (
                <button onClick={handleReschedule} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ArrowPathIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Reschedule</div>
                    <div className="text-xs text-gray-400">Change date or time</div>
                  </div>
                </button>
              )}
              <button onClick={() => handleAction('reception_cancelled')} className="w-full text-left px-4 py-4 text-sm text-red-600 active:bg-red-50 flex items-center gap-4 rounded-xl">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
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

// --- Desktop Dropdown Component ---
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
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Confirm</div>
              <div className="text-xs text-gray-400">Accept booking</div>
            </div>
          </button>
          {!apt.is_rescheduled && (
            <button onClick={handleReschedule} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ArrowPathIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Reschedule</div>
                <div className="text-xs text-gray-400">Change date/time</div>
              </div>
            </button>
          )}
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('dismissed')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Archive className="w-4 h-4 text-gray-600" />
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
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Complete</div>
              <div className="text-xs text-gray-400">Mark as done</div>
            </div>
          </button>
          {!apt.is_rescheduled && (
            <button onClick={handleReschedule} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ArrowPathIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Reschedule</div>
                <div className="text-xs text-gray-400">Change date/time</div>
              </div>
            </button>
          )}
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('reception_cancelled')} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 text-red-500" />
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
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${apt.mobile}`} className="hover:text-blue-600 transition-colors">
                  {apt.mobile}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span>DOB: {apt.dob}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">Booked by: {apt.booked_by}</span>
              </div>
            </div>
          </div>
          {/* Column 2: Booking Info */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Booking Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Booked: {formatExactCreatedAt(apt.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-gray-600 mb-1">
                    Updated {formatRelativeUpdatedAt(apt.updated_at)}
                  </span>
                  <span className="text-gray-400">
                    {formatExactUpdatedAt(apt.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Column 3: Patient Notes */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Notes</h5>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600 min-h-[60px]">
              {apt.patient_notes || "No notes provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function PracticeAppointmentsView() {
  const { user } = useAppSelector((state: any) => state.user.auth);

  const practiceId = user?.id;

  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reschedule State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<EnrichedAppointment | null>(null);
  const [showToast, setShowToast] = useState(false);

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

  // --- 2. UPDATED FETCH LOGIC ---
    useEffect(() => {
    if (!practiceId) return;

    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        const data = await getAppointmentsService(practiceId);

        const mappedAppointments = data.map((apt: any) =>
          mapAppointmentToEnriched(apt)
        );

        if (isMounted) {
          setAppointments(mappedAppointments);
        }

      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    fetchAppointments(); 

    const interval = setInterval(() => {
      fetchAppointments(); 
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [practiceId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setShowRescheduleModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ... (Keep existing handler functions: handleFilterChange, handleStatusUpdate, etc.) ...
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = useCallback((id: string, newStatus: ValidStatus) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, status: newStatus, updated_at: new Date().toISOString() } : apt
    ));
    setOpenMenuId(null);
    setExpandedRowId(null);
  }, []);

  const handleRescheduleClick = useCallback((apt: EnrichedAppointment) => {
    setRescheduleApt(apt);
    setShowRescheduleModal(true);
    setOpenMenuId(null);
  }, []);

  const handleRescheduleConfirm = (newDate: string, newTime: string) => {
    if (!rescheduleApt) return;
    setAppointments(prev => prev.map(apt => {
      if (apt.id === rescheduleApt.id) {
        return {
          ...apt,
          appointment_date: newDate,
          appointment_time: newTime,
          status: 'confirmed' as ValidStatus,
          is_rescheduled: true,
          updated_at: new Date().toISOString()
        };
      }
      return apt;
    }));
    setShowRescheduleModal(false);
    setRescheduleApt(null);
    setShowToast(true);
  };

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
    [...new Set(appointments.map(a => a.dentist_name).filter(Boolean))],
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
      upcoming: appointments.filter(a => {
        const aptDate = new Date(a.appointment_date);
        return aptDate > now && a.status === 'confirmed';
      }).length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => isCancelledStatus(a.status)).length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      switch (activeTab) {
        case 'pending': if (apt.status !== 'pending') return false; break;
        case 'upcoming': if (aptDate <= now || apt.status !== 'confirmed') return false; break;
        case 'completed': if (apt.status !== 'completed') return false; break;
        case 'cancelled': if (!isCancelledStatus(apt.status)) return false; break;
      }
      if (filters.search && !apt.patient_name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type && apt.treatment !== filters.type) return false;
      if (filters.practitioner && apt.dentist_name !== filters.practitioner) return false;
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
      case 'all': return <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'pending': return <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'upcoming': return <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'completed': return <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: paginatedAppointments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  useEffect(() => {
    const container = parentRef.current;
    const handleScroll = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [openMenuId]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[400px] bg-white">
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

  // --- 3. UI RENDER (Added explicit "No User" check just in case) ---
  if (!practiceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] bg-white">
      {/* ... Your existing component JSX ... */}
      {/* (I am not repeating the huge JSX block here as it remains identical to your provided code) */}
      {/* If you want the full JSX pasted, please ask, but replacing the return statement above is sufficient */}
      <div className="w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Online Bookings</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your practice bookings</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm border border-gray-200 
                    ${isRefreshing
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
            >
              <div
                className={isRefreshing ? 'animate-spin' : ''}
                style={isRefreshing ? { animationDuration: '0.5s' } : undefined}
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline">
                {isRefreshing ? 'Refresh' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* ... The rest of your JSX (Tabs, Filters, List, etc.) goes here ... */}
        {/* Note: Ensure you include the closing tags for the main divs and the component function */}
        <div className="bg-white">
          {/* Tabs */}
          <div className="px-2 sm:px-6 py-2 sm:py-3">
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
                <Search className="absolute left-3 top-1/3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 outline-none ring-2 ring-gray-200"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || activeFilterCount > 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-3 pt-3 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
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
                  <Inbox className="w-7 h-7 text-gray-400" />
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
              <div
                ref={parentRef}
                className="h-[400px] overflow-auto"
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: "relative"
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {

                    const apt = paginatedAppointments[virtualRow.index];
                    const isExpanded = expandedRowId === apt.id;

                    return (
                      <div
                        key={apt.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                        className="divide-y divide-gray-100"
                      >

                        {/* ============ MOBILE/TABLET VIEW (<1024px) ============ */}

                        <div className="lg:hidden">
                          <div
                            onClick={() => toggleRowExpansion(apt.id)}
                            className={`px-3 sm:px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors ${isExpanded
                              ? "bg-gray-50"
                              : "hover:bg-gray-50/60 transition-colors duration-150"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <StatusBadge
                                status={apt.status}
                                size="small"
                                is_rescheduled={apt.is_rescheduled}
                              />

                              <div className="flex items-center gap-1">
                                <PatientTags
                                  isNewPatient={apt.isNewPatient}
                                  isDependent={apt.isDependent}
                                  size="small"
                                />

                                {!isTerminalState(apt.status) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenMenu(apt.id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  className={`p-1 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                    }`}
                                >
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-12 sm:w-14 h-14 sm:h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-[10px] font-medium text-gray-500 uppercase">
                                  {getWeekday(apt.appointment_date)}
                                </span>
                                <span className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                                  {getDay(apt.appointment_date)}
                                </span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase">
                                  {getMonth(apt.appointment_date)}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                  {apt.patient_name}
                                </h4>

                                <div className="mt-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium">
                                      {formatTime(
                                        apt.appointment_date,
                                        apt.appointment_time
                                      )}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{apt.treatment}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{apt.dentist_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded && <ExpandedDetailsCard apt={apt} />}
                          </div>
                        </div>

                        {/* ============ DESKTOP VIEW (>=1024px) ============ */}

                        <div
                          className={`hidden lg:block transition-colors ${isExpanded
                            ? "bg-gray-50"
                            : "hover:bg-gray-50/60 transition-colors duration-150"
                            }`}
                        >
                          <div
                            className="flex items-center px-4 md:px-6 py-4 cursor-pointer"
                            onClick={() => toggleRowExpansion(apt.id)}
                          >
                            {/* Patient */}
                            <div className="flex-[1.5] min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {apt.patient_name}
                                </h4>

                                <PatientTags
                                  isNewPatient={apt.isNewPatient}
                                  isDependent={apt.isDependent}
                                />
                              </div>

                              <div className="text-xs text-gray-600 truncate">
                                {apt.mobile}
                              </div>
                            </div>

                            {/* Dentist */}
                            <div className="flex-1 pr-4">
                              <div className="text-sm font-medium text-gray-700">
                                {apt.dentist_name}
                              </div>
                              <div className="text-xs text-gray-500">Dentist</div>
                            </div>

                            {/* Appointment */}
                            <div className="flex-[1.2] pr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatShortDate(apt.appointment_date)} |{" "}
                                {formatTime(apt.appointment_date, apt.appointment_time)}
                              </div>

                              <div className="text-sm text-gray-700 truncate">
                                {apt.treatment}
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex-1 pr-4">
                              <StatusBadge
                                status={apt.status}
                                is_rescheduled={apt.is_rescheduled}
                              />

                              <div className="text-xs text-gray-600 mt-1">
                                {formatRelativeUpdatedAt(apt.updated_at)}
                              </div>
                            </div>

                            {/* Booked */}
                            <div className="flex-1 text-sm text-gray-600">
                              {formatRelativeTime(apt.created_at)}
                            </div>

                            {/* Actions */}
                            <div className="w-16 flex justify-end items-center gap-1 relative">
                              {!isTerminalState(apt.status) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();   // prevents row expansion
                                    handleOpenMenu(apt.id);
                                  }}
                                  className={`p-1.5 rounded-lg transition-all ${openMenuId === apt.id
                                    ? "bg-gray-200 text-gray-700"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              )}

                              {/* YOUR DROPDOWN — kept exactly */}
                              {openMenuId === apt.id && !isMobile && (
                                <DesktopDropdown
                                  apt={apt}
                                  onUpdate={handleStatusUpdate}
                                  onReschedule={handleRescheduleClick}
                                  onClose={handleCloseMenu}
                                />
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(apt.id);
                                }}
                                className={`p-1.5 transition-transform duration-200 text-gray-400 hover:text-gray-600 ${isExpanded ? "rotate-180" : ""
                                  }`}
                              >
                                <ChevronDown className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {isExpanded && <ExpandedDetailsCard apt={apt} />}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer (Pagination) */}
          {filteredAppointments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border border-gray-100 bg-gray-50/50">
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-gray-700">{filteredAppointments.length}</span> appointments
                {totalPages > 0 && <span className="hidden sm:inline"> • Page {currentPage} of {totalPages}</span>}
              </div>
              {totalPages > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1.5 text-xs rounded-md transition-all ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
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

      {/* Reschedule Modal */}
      {showRescheduleModal && rescheduleApt && (
        <RescheduleModal
          apt={rescheduleApt}
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleRescheduleConfirm}
          practitioners={practitioners}
        />
      )}

      {/* Success Toast */}
      <ToastNotification
        message="Rescheduled! Patient notified via Email & SMS."
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}