import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Check, Archive, X } from 'lucide-react';
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { formatShortDate, formatTime, getAvailableActions, type EnrichedAppointment, type ValidStatus } from '../../../../features/online_bookings/online_bookings.utils';

interface ActionProps {
  apt: EnrichedAppointment;
  anchorEl?: HTMLElement | null;
  onUpdate: (id: string, status: ValidStatus) => void;
  onReschedule: (apt: EnrichedAppointment) => void;
  onDispute: (apt: EnrichedAppointment) => void;
  onClose: () => void;
}

export const DesktopDropdown = ({ apt, anchorEl, onUpdate, onReschedule, onDispute, onClose }: ActionProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ top: number; left: number; transformOrigin: string }>({
    top: 0,
    left: 0,
    transformOrigin: 'top right'
  });

  // 1. Calculate Position Logic (Robust Fix)
  useLayoutEffect(() => {
    if (anchorEl && dropdownRef.current) {
      const buttonRect = anchorEl.getBoundingClientRect();
      const menuRect = dropdownRef.current.getBoundingClientRect();
      const MENU_WIDTH = 224; // w-56

      // Horizontal Position: Align right edge of menu with right edge of button
      const left = buttonRect.right - MENU_WIDTH;

      // Vertical Position: Check if there is space below
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const menuHeight = menuRect.height || 300; // Approximate if not rendered yet

      let top = 0;
      let origin = 'top right';

      if (spaceBelow < menuHeight && buttonRect.top > menuHeight) {
        // Not enough space below, FLIP UP
        top = buttonRect.top - menuHeight - 4;
        origin = 'bottom right';
      } else {
        // Default: Open DOWN
        top = buttonRect.bottom + 4;
        origin = 'top right';
      }

      setStyle({ top, left, transformOrigin: origin });
    }
  }, [anchorEl]); // Recalculate if anchor changes

  // 2. Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    // Close on any scroll (simplest way to prevent detached menus)
    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose, anchorEl]);

  const handleAction = (status: ValidStatus) => { onUpdate(apt.id, status); onClose(); };

  // 3. Render via Portal
  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{
        top: style.top,
        left: style.left,
        transformOrigin: style.transformOrigin
      }}
      className="fixed w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
      onClick={(e) => e.stopPropagation()}
    >

      {getAvailableActions(apt.status).includes('complete') && (
        <button onClick={() => handleAction('completed')}
          className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50">
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">Complete</div>
            <div className="text-xs text-gray-400">Mark as done</div>
          </div>
        </button>
      )}

      {getAvailableActions(apt.status).includes('reschedule') && !apt.is_rescheduled && (
        <button onClick={() => { onReschedule(apt); onClose(); }}
          className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
            <ArrowPathIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">Reschedule</div>
            <div className="text-xs text-gray-400">Change date/time</div>
          </div>
        </button>
      )}

      {getAvailableActions(apt.status).includes('cancel') && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => handleAction('dismissed')}
            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50">
              <X className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <div className="font-medium">Cancel</div>
              <div className="text-xs text-gray-400">Remove booking</div>
            </div>
          </button>
        </>
      )}

      {getAvailableActions(apt.status).includes('dispute') && apt.isNewPatient === true && (
        <button onClick={() => { onDispute(apt); onClose(); }}
          className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50">
            <Archive className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="font-medium">Dispute</div>
            <div className="text-xs text-gray-400">Review invoice details</div>
          </div>
        </button>
      )}

      {/* {apt.status === 'dispute' && (
        <>
          <button onClick={() => { onDispute(apt); onClose(); }}
            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-50">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50">
              <Archive className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium">Update Dispute</div>
              <div className="text-xs text-gray-400">Review or change dispute reason</div>
            </div>
          </button>
        </>
      )} */}
    </div>,
    document.body
  );
};

export const MobileBottomSheet = ({ apt, onUpdate, onReschedule, onDispute, onClose }: ActionProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAction = (status: ValidStatus) => { onUpdate(apt.id, status); onClose(); };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center py-3"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="px-4 pb-3 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">{apt.patient_name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {formatShortDate(apt.appointment_date)} at {formatTime(apt.appointment_date, apt.appointment_time)}
          </div>
        </div>
        <div className="p-2">
          {getAvailableActions(apt.status).includes('complete') && (
            <button onClick={() => handleAction('completed')}
              className="w-full text-left px-4 py-4 text-sm flex items-center gap-4 rounded-xl text-gray-700 active:bg-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div><div className="font-semibold">Mark as Completed</div><div className="text-xs text-gray-400">Appointment has been done</div></div>
            </button>
          )}

          {getAvailableActions(apt.status).includes('reschedule') && !apt.is_rescheduled && (
            <button onClick={() => { onClose(); setTimeout(() => onReschedule(apt), 100); }}
              className="w-full text-left px-4 py-4 text-sm flex items-center gap-4 rounded-xl text-gray-700 active:bg-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                <ArrowPathIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div><div className="font-semibold">Reschedule</div><div className="text-xs text-gray-400">Change date or time</div></div>
            </button>
          )}

          {getAvailableActions(apt.status).includes('cancel') && (
            <button onClick={() => handleAction('dismissed')}
              className="w-full text-left px-4 py-4 text-sm flex items-center gap-4 rounded-xl text-red-600 active:bg-red-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div><div className="font-semibold">Cancel Appointment</div><div className="text-xs text-gray-400">Remove from schedule</div></div>
            </button>
          )}

          {getAvailableActions(apt.status).includes('dispute') && apt.isNewPatient === true && (
            <button onClick={() => { onClose(); setTimeout(() => onDispute(apt), 100); }}
              className="w-full text-left px-4 py-4 text-sm flex items-center gap-4 rounded-xl text-gray-700 active:bg-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                <Archive className="w-5 h-5 text-amber-600" />
              </div>
              <div><div className="font-semibold">Dispute</div><div className="text-xs text-gray-400">Save this booking as dispute</div></div>
            </button>
          )}
        </div>
        <div className="h-8" />
      </div>
    </div>,
    document.body
  );
};
