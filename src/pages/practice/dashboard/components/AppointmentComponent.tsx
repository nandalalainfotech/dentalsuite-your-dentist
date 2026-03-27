import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Check, Phone, User, Mail, Calendar, RefreshCw, Stethoscope } from 'lucide-react';
import { 
  formatExactCreatedAt, 
  formatRelativeUpdatedAt, 
  type EnrichedAppointment // Use EnrichedAppointment
} from '../../../../features/appointments/appointments.utils';

export const ToastNotification = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) => {
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

export const ExpandedDetailsCard = ({ apt }: { apt: EnrichedAppointment }) => {
  return (
    <div className="px-2 pb-2 md:px-4 md:pb-4 cursor-default" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gray-50/30 rounded-xl p-4 border border-gray-100 mt-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* 1. Contact Info */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${apt.mobile}`} className="hover:text-blue-600 transition-colors">{apt.mobile || 'No mobile'}</a>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span>DOB: {apt.dob || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">Booked by: {apt.booked_by || 'Patient'}</span>
              </div>
            </div>
          </div>

          {/* 2. Practitioner Info (NEW - RELATIONAL DATA) */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Practitioner</h5>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{apt.dentist_name}</span>
                <span className="text-xs text-gray-500">{apt.dentist_role}</span>
              </div>
            </div>
          </div>

          {/* 3. Booking Info */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Booking Details</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                 <Stethoscope className="w-4 h-4 text-gray-400" />
                 <span>{apt.treatment}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Booked: {formatExactCreatedAt(apt.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-gray-600">Updated {formatRelativeUpdatedAt(apt.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Notes */}
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Notes</h5>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 min-h-[60px]">
              {apt.patient_notes || "No notes provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};