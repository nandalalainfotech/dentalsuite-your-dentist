import {
  type ValidStatus,
  STATUS_CONFIG,
  STATUS_LABELS
} from '../../../../features/online_bookings/online_bookings.utils';

// Maps your new Redux types to the UI component
// ValidStatus in utils should match AppointmentStatus in types.ts
export const StatusBadge = ({ status, size = "default", is_rescheduled = false }: { status: ValidStatus; size?: "small" | "default"; is_rescheduled?: boolean }) => {
  const { bg, text, dot } = STATUS_CONFIG[status] || STATUS_CONFIG['pending']; 
  const sizeClasses = size === "small" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";
  const rescheduledClasses = is_rescheduled ? "ring-2 ring-blue-500 ring-offset-1" : "";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-medium ${sizeClasses} ${bg} ${text} ${rescheduledClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[status] || status}
    </span>
  );
};

export const PatientTags = ({ isNewPatient, isDependent, size = 'default' }: { isNewPatient: boolean; isDependent: boolean; size?: 'small' | 'default' }) => {
  if (!isNewPatient && !isDependent) return null;
  const sizeClasses = size === 'small' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
  return (
    <div className="flex items-center gap-1">
      {isNewPatient &&
        <span className={`inline-flex items-center ${sizeClasses} bg-gray-900 text-white font-medium rounded`}>
          NEW
        </span>
      }
      {isDependent &&
        <span className={`inline-flex items-center gap-0.5 ${sizeClasses} bg-blue-600 text-white font-medium rounded`}>
          DEPENDENT
        </span>
      }
    </div>
  );
};

export const TableHeader = () => (
  <div className="hidden lg:flex items-center gap-4 px-4 md:px-6 py-3 bg-gray-100 text-gray-500 font-semibold text-sm backdrop-blur-sm">
    <div className="flex-[1.5]">Patient Details</div>
    <div className="flex-1">Practitioner</div>
    <div className="flex-[1.2]">Appointment Details</div>
    <div className="flex-1">Status</div>
    <div className="flex-1">Booked At</div>
    <div className="w-16"></div>
  </div>
);