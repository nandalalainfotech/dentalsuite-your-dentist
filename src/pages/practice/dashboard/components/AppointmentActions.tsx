import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Check, Archive, X } from 'lucide-react';
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { type EnrichedAppointment, type ValidStatus, formatShortDate, formatTime, } from '../../../../features/appointments/appointments.utils';


interface ActionProps {
  apt: EnrichedAppointment;
  onUpdate: (id: string, status: ValidStatus) => void;
  onReschedule: (apt: EnrichedAppointment) => void;
  onClose: () => void;
}

export const DesktopDropdown = ({ apt, onUpdate, onReschedule, onClose }: ActionProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose(); };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleEscape); };
  }, [onClose]);

  const handleAction = (status: ValidStatus) => { onUpdate(apt.id, status); onClose(); };

  return (
    <div ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-150 z-50 origin-top-right"
      onClick={(e) => e.stopPropagation()}>
      {apt.status === 'pending' && (
        <>
          <button onClick={() => handleAction('confirmed')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Confirm</div>
              <div className="text-xs text-gray-400">Accept booking</div>
            </div>
          </button>

          {!apt.is_rescheduled &&
            <button onClick={() => { onReschedule(apt); onClose(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ArrowPathIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Reschedule</div>
                <div className="text-xs text-gray-400">Change date/time</div>
              </div>
            </button>
          }

          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('dismissed')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
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
          <button onClick={() => handleAction('completed')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Complete</div>
              <div className="text-xs text-gray-400">Mark as done</div>
            </div>
          </button>
          {!apt.is_rescheduled && <button onClick={() => { onReschedule(apt); onClose(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <ArrowPathIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Reschedule</div>
              <div className="text-xs text-gray-400">Change date/time</div>
            </div>
          </button>
          }
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('reception_cancelled')}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
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

export const MobileBottomSheet = ({ apt, onUpdate, onReschedule, onClose }: ActionProps) => {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  const handleAction = (status: ValidStatus) => { onUpdate(apt.id, status); onClose(); };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center py-3"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="px-4 pb-3 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{apt.patient_name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{formatShortDate(apt.appointment_date)} at {formatTime(apt.appointment_date, apt.appointment_time)}</div>
        </div>
        <div className="p-2">
          {apt.status === 'pending' && (
            <>
              <button onClick={() => handleAction('confirmed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Check className="w-5 h-5 text-emerald-600" /></div><div><div className="font-semibold">Confirm Appointment</div><div className="text-xs text-gray-400">Accept this booking request</div></div></button>
              {!apt.is_rescheduled && <button onClick={() => { onClose(); setTimeout(() => onReschedule(apt), 100); }} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><ArrowPathIcon className="w-5 h-5 text-blue-600" /></div><div><div className="font-semibold">Reschedule</div><div className="text-xs text-gray-400">Change date or time</div></div></button>}
              <button onClick={() => handleAction('dismissed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"><Archive className="w-5 h-5 text-gray-600" /></div><div><div className="font-semibold">Dismiss Request</div><div className="text-xs text-gray-400">Archive without action</div></div></button>
            </>
          )}
          {apt.status === 'confirmed' && (
            <>
              <button onClick={() => handleAction('completed')} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Check className="w-5 h-5 text-emerald-600" /></div><div><div className="font-semibold">Mark as Completed</div><div className="text-xs text-gray-400">Appointment has been done</div></div></button>
              {!apt.is_rescheduled && <button onClick={() => { onClose(); setTimeout(() => onReschedule(apt), 100); }} className="w-full text-left px-4 py-4 text-sm text-gray-700 active:bg-gray-100 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><ArrowPathIcon className="w-5 h-5 text-blue-600" /></div><div><div className="font-semibold">Reschedule</div><div className="text-xs text-gray-400">Change date or time</div></div></button>}
              <button onClick={() => handleAction('reception_cancelled')} className="w-full text-left px-4 py-4 text-sm text-red-600 active:bg-red-50 flex items-center gap-4 rounded-xl"><div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><X className="w-5 h-5 text-red-600" /></div><div><div className="font-semibold">Cancel Appointment</div><div className="text-xs text-red-400">Remove from schedule</div></div></button>
            </>
          )}
        </div>
        <div className="p-4 border-t border-gray-100"><button onClick={onClose} className="w-full py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200">Cancel</button></div>
        <div className="h-8" />
      </div>
    </div>,
    document.body
  );
};