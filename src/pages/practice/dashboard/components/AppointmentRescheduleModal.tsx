import { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, User, ChevronDown, Check, ChevronLeft, ChevronRight, Clock, Loader2, Calendar } from 'lucide-react';
import { addDays, formatDate, type EnrichedAppointment } from '../../../../features/appointments/appointments.utils';

interface RescheduleModalProps {
  apt: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  practitioners: string[];
}

export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const RescheduleModal = ({ apt, isOpen, onClose, onConfirm, practitioners }: RescheduleModalProps) => {
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

  useEffect(() => { setSelectedTime(''); }, [selectedDate, selectedPractitioner]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const changeMonth = (offset: number) => { const newDate = new Date(calendarViewDate); newDate.setMonth(newDate.getMonth() + offset); setCalendarViewDate(newDate); };
  const isDateDisabled = (date: Date) => { const today = new Date(); today.setHours(0, 0, 0, 0); return date < today || date.getDay() === 0; };
  const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const generateSlotsForDate = (dateStr: string): string[] => {
    if (!dateStr) return [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return [];
    if (dayOfWeek === 6) return ['09:00', '09:30', '10:00', '10:30', '11:00'];
    const baseSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const dateNum = date.getDate();
    return baseSlots.filter((_, index) => (dateNum + index) % 5 !== 0);
  };

  const weekAvailability = useMemo(() => {
    if (!selectedDate) return [];
    const startDate = new Date(selectedDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const dateStr = formatLocalDate(currentDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (currentDate < today) continue;
      const slots = generateSlotsForDate(dateStr).filter(slot => {
        if (selectedDate !== formatLocalDate(new Date())) return true;
        const [hour, minute] = slot.split(':'); const slotTime = new Date(); slotTime.setHours(Number(hour), Number(minute), 0, 0); return slotTime > new Date();
      });
      days.push({ date: currentDate, dateStr, slots });
    }
    return days;
  }, [selectedDate, selectedPractitioner]);

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const handleConfirm = async () => { setIsLoading(true); await new Promise(resolve => setTimeout(resolve, 800)); onConfirm(selectedDate, selectedTime); setIsLoading(false); };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-br from-white via-blue-100 to-white border-b border-gray-100 flex justify-between items-center z-20 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Reschedule Appointment
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <span className="font-medium text-gray-700">
                {apt.patient_name}
              </span><span>•</span>
              <span>{apt.treatment}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
          >
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
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => changeMonth(1)}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                  <span key={i}
                    className={`text-xs font-semibold h-8 flex items-center justify-center ${i === 0
                      ? 'text-red-500'
                      : 'text-gray-600'
                      }
                   `}>{d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: getFirstDayOfMonth(calendarViewDate.getFullYear(), calendarViewDate.getMonth()) }).map((_, i) => <div key={`empty-${i}`} className="h-9 w-9" />)}
                {Array.from({ length: getDaysInMonth(calendarViewDate.getFullYear(), calendarViewDate.getMonth()) }).map((_, i) => {
                  const day = i + 1; const dateObj = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day);
                  const dateStr = formatLocalDate(dateObj); const isSelected = selectedDate === dateStr;
                  const isToday = isSameDay(dateObj, new Date()); const disabled = isDateDisabled(dateObj);
                  const isSunday = dateObj.getDay() === 0;
                  return (
                    <button key={day}
                      type="button"
                      onClick={() => {
                        if (!disabled) {
                          setSelectedDate(dateStr); setSelectedTime('');
                        }
                      }}
                      disabled={disabled}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'cursor-pointer'} 
                    ${isSunday && !disabled
                          ? 'text-red-500'
                          : ''} 
                      ${isSelected && !disabled
                          ? 'bg-blue-600 text-white font-bold shadow-md'
                          : !disabled ? 'hover:bg-white text-gray-800' : ''} 
                        ${isToday && !isSelected && !disabled
                          ? 'text-blue-600 font-bold ring-2 ring-blue-200' : ''}
                          `}>{day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-auto">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <User className="w-4 h-4" /> Practitioner
              </label>
              <div className="relative">
                <button type="button"
                  onClick={() => setIsPractitionerOpen(!isPractitionerOpen)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{selectedPractitioner || 'Select Dentist'}</p>
                  </div><ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isPractitionerOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPractitionerOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 max-h-48 overflow-y-auto">
                    {practitioners.map((name) => (
                      <button key={name} type="button" onClick={() => {
                        setSelectedPractitioner(name); setIsPractitionerOpen(false); setSelectedTime('');
                      }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 
                        ${selectedPractitioner === name ? 'bg-blue-50/50' : ''}`}>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <span className="text-xs font-bold">{name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${selectedPractitioner === name ? 'text-blue-700' : 'text-gray-700'}`}>
                            {name}
                          </p>
                        </div>{selectedPractitioner === name &&
                          <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        }</button>
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
                  <h4 className="font-bold text-gray-800">Available Time Slots
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Showing 7 days from {selectedDate ? formatDate(selectedDate)
                    : 'selected date'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{weekAvailability.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium">Select a date to view availability
                </p>
              </div>) : (
              <div className="space-y-4">{weekAvailability.map((dayData) => {
                const isSelectedDay = selectedDate === dayData.dateStr;
                const isToday = isSameDay(dayData.date, new Date());
                return (<div
                  key={dayData.dateStr}
                  className={`rounded-xl border transition-all 
                          ${isSelectedDay
                      ? 'border-blue-200 bg-blue-50/30'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`
                  }>
                  <div className={`px-4 py-3 border-b flex items-center justify-between 
                        ${isSelectedDay
                      ? 'border-blue-100'
                      : 'border-gray-100'
                    }`
                  }>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center 
                          ${isToday
                          ? 'bg-blue-600 text-white'
                          : isSelectedDay
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`
                      }>
                        <span className="text-[10px] font-bold uppercase leading-none">
                          {dayData.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-sm font-bold leading-none mt-0.5">
                          {dayData.date.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          {dayData.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          {isToday && (<span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Today</span>)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dayData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p></div></div><div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full 
                                          ${dayData.slots.length > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                        }
                                          `}>
                        {dayData.slots.length} slots</span>
                    </div>
                  </div>
                  <div className="p-4">
                    {dayData.slots.length === 0
                      ? (<div className="flex items-center justify-center py-4 text-gray-400">
                        <Clock className="w-4 h-4 mr-2 opacity-50" />
                        <span className="text-sm">No available slots</span>
                      </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {dayData.slots.map((time) => {
                            const isSelected = selectedDate === dayData.dateStr && selectedTime === time;
                            function handleSlotSelect(_dateStr: any, _time: string): void {
                              throw new Error('Function not implemented.');
                            }

                            return (
                              <button
                                key={`${dayData.dateStr}-${time}`}
                                type="button"
                                onClick={() => handleSlotSelect(dayData.dateStr, time)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border 
            ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                                  }
            `}>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div className="text-sm">
                  {selectedTime && selectedDate
                    ? (<div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">New Time
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(selectedDate)} at {formatTimeDisplay(selectedTime)}
                        </p>
                      </div>
                    </div>
                    ) : (
                      <span
                        className="text-gray-400 text-sm">Select a time slot
                      </span>)}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl text-sm">
                    Cancel
                  </button>
                  <button onClick={handleConfirm} disabled={!selectedDate || !selectedTime || isLoading}
                    className={`flex-1 sm:flex-none px-6 py-2.5 font-medium rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm 
                                  ${selectedDate && selectedTime && !isLoading
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                                  `}>
                    {isLoading ?
                      <Loader2 className="w-4 h-4 animate-spin" />
                      : <span>Confirm</span>}
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