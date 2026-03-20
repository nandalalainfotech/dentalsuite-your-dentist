import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Check, Phone, User, Mail, Calendar, RefreshCw } from 'lucide-react';
import { type ValidStatus, STATUS_CONFIG, STATUS_LABELS, formatExactCreatedAt, formatRelativeUpdatedAt, formatExactUpdatedAt, type EnrichedAppointment } from '../../../../features/appointments/appointments.utils';


export const StatusBadge = ({ status, size = "default", is_rescheduled = false }: { status: ValidStatus; size?: "small" | "default"; is_rescheduled?: boolean }) => {
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

export const PatientTags = ({ isNewPatient, isDependent, size = 'default' }: { isNewPatient: boolean; isDependent: boolean; size?: 'small' | 'default' }) => {
  if (!isNewPatient && !isDependent) return null;
  const sizeClasses = size === 'small' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
  return (
    <div className="flex items-center gap-1">
      {isNewPatient && <span className={`inline-flex items-center ${sizeClasses} bg-gray-900 text-white font-medium rounded`}>NEW</span>}
      {isDependent && <span className={`inline-flex items-center gap-0.5 ${sizeClasses} bg-blue-600 text-white font-medium rounded`}>DEPENDENT</span>}
    </div>
  );
};

export const TableHeader = () => (
  <div className="hidden lg:flex items-center gap-4 px-4 md:px-6 py-3 bg-gray-50/80 text-gray-500 font-semibold text-sm sticky top-0 z-10 backdrop-blur-sm">
    <div className="flex-[1.5]">Patient Details</div>
    <div className="flex-1">Practitioner</div>
    <div className="flex-[1.2]">Appointment Details</div>
    <div className="flex-1">Status</div>
    <div className="flex-1">Booked At</div>
    <div className="w-16"></div>
  </div>
);

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
      <div className="bg-white rounded-xl p-4 border border-gray-100 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${apt.mobile}`} className="hover:text-blue-600 transition-colors">{apt.mobile}</a>
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
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Booking Info</h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-gray-400" />
                <span>Booked: {formatExactCreatedAt(apt.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-gray-600 mb-1">Updated {formatRelativeUpdatedAt(apt.updated_at)}
                  </span>
                  <span className="text-gray-400">{formatExactUpdatedAt(apt.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Patient Notes</h5>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600 min-h-[60px]">{apt.patient_notes || "No notes provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};