import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Search,
  MoreVertical,
  Calendar,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Archive,
  SlidersHorizontal} from 'lucide-react';

// --- Types ---
type ValidStatus = 'confirmed' | 'pending' | 'completed' | 'dismissed' | 'cancelled';

interface Patient {
  id: string;
  name: string;
  service: string;
  date: string; // YYYY-MM-DD   
  time: string; // HH:mm
  doctor: string;
  status: ValidStatus;
  mobile: string;
  email: string;
  notes: string;
  bookedAt: string; // ISO
}

interface FilterState {
  search: string;
  status: '' | ValidStatus;
  doctor: string;
  service: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// --- Static Data ---
const STATIC_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    service: 'Dental Checkup',
    date: '2026-01-24',
    time: '09:00',
    doctor: 'Dr. Smith',
    status: 'completed',
    mobile: '0412 345 678',
    email: 'sarah.j@example.com',
    notes: 'Patient requests a gentle cleaning.',
    bookedAt: '2026-10-20T10:00:00',
  },
  {
    id: '2',
    name: 'Michael Wong',
    service: 'Root Canal',
    date: '2026-01-24',
    time: '10:30',
    doctor: 'Dr. Smith',
    status: 'confirmed',
    mobile: '0498 765 432',
    email: 'm.wong@example.com',
    notes: 'Experiencing pain in lower left molar.',
    bookedAt: '2026-10-18T14:30:00',
  },
  {
    id: '3',
    name: 'Emma Davis',
    service: 'Teeth Whitening',
    date: '2026-01-25',
    time: '14:00',
    doctor: 'Dr. Doe',
    status: 'pending',
    mobile: '0455 123 456',
    email: 'emma.d@example.com',
    notes: 'Follow up on previous session.',
    bookedAt: '2026-10-24T09:15:00',
  },
  {
    id: '4',
    name: 'James Wilson',
    service: 'Consultation',
    date: '2026-01-23',
    time: '11:00',
    doctor: 'Dr. Brown',
    status: 'cancelled',
    mobile: '0488 999 111',
    email: 'j.wilson@example.com',
    notes: 'Cancelled due to illness.',
    bookedAt: '2026-10-21T11:00:00',
  },
  {
    id: '5',
    name: 'Linda Taylor',
    service: 'X-Ray',
    date: '2026-01-22',
    time: '16:15',
    doctor: 'Dr. Doe',
    status: 'dismissed',
    mobile: '0433 222 111',
    email: 'l.taylor@example.com',
    notes: 'No show.',
    bookedAt: '2026-10-15T16:00:00',
  },
];

// --- Helpers ---
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const getStatusStyle = (status: ValidStatus) => {
  switch (status) {
    case 'completed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' };
    case 'confirmed':
      return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Confirmed' };
    case 'pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' };
    case 'cancelled':
      return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' };
    case 'dismissed':
      return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Dismissed' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', label: status };
  }
};

const StatusBadge = ({ status }: { status: ValidStatus }) => {
  const style = getStatusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

// --- Toast ---
const ToastNotification = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
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

// --- Action Menu ---
const ActionMenu = ({
  isOpen,
  onClose,
  onAction,
  status,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'confirm' | 'complete' | 'cancel' | 'dismiss' | 'archive') => void;
  status: ValidStatus;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const Item = ({
    label,
    action,
    icon,
    danger,
  }: {
    label: string;
    action: 'confirm' | 'complete' | 'cancel' | 'dismiss' | 'archive';
    icon: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      onClick={() => onAction(action)}
      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
      {status === 'pending' && (
        <>
          <Item label="Confirm" action="confirm" icon={<Check className="w-4 h-4 text-emerald-600" />} />
          <div className="my-1 border-t border-gray-100" />
          <Item label="Dismiss" action="dismiss" icon={<X className="w-4 h-4" />} danger />
        </>
      )}

      {status === 'confirmed' && (
        <>
          <Item label="Mark Completed" action="complete" icon={<Check className="w-4 h-4 text-emerald-600" />} />
          <div className="my-1 border-t border-gray-100" />
          <Item label="Cancel" action="cancel" icon={<X className="w-4 h-4" />} danger />
        </>
      )}

      {['completed', 'cancelled', 'dismissed'].includes(status) && (
        <Item label="Archive Record" action="archive" icon={<Archive className="w-4 h-4 text-gray-500" />} />
      )}
    </div>
  );
};

// --- Expanded Details ---
const ExpandedDetails = ({ patient }: { patient: Patient }) => (
  <div className="px-4 pb-4 md:px-6 md:pb-6 cursor-default bg-gray-50/30" onClick={(e) => e.stopPropagation()}>
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h5>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Phone size={14} />
            </div>
            <span className="font-medium">{patient.mobile}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Mail size={14} />
            </div>
            <span className="truncate">{patient.email}</span>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Appointment Info</h5>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Calendar size={14} />
            </div>
            <span>Booked on {new Date(patient.bookedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <User size={14} />
            </div>
            <span>{patient.doctor}</span>
          </div>
          <div className="md:hidden text-sm text-gray-600">
            <div className="mt-2">
              <span className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Service</span>
              <div className="text-sm text-gray-700 mt-1">{patient.service}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Notes</h5>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 min-h-[80px]">
          {patient.notes || 'No notes provided.'}
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const ClientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(STATIC_PATIENTS);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    doctor: '',
    service: '',
    startDate: '',
    endDate: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [] = useState(false);

  const doctors = useMemo(() => [...new Set(patients.map(p => p.doctor))], [patients]);
  const services = useMemo(() => [...new Set(patients.map(p => p.service))], [patients]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([, v]) => v !== '').length;
  }, [filters]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const text = filters.search.trim().toLowerCase();
      if (text) {
        const match =
          p.name.toLowerCase().includes(text) ||
          p.service.toLowerCase().includes(text) ||
          p.doctor.toLowerCase().includes(text);
        if (!match) return false;
      }

      if (filters.status && p.status !== filters.status) return false;
      if (filters.doctor && p.doctor !== filters.doctor) return false;
      if (filters.service && p.service !== filters.service) return false;

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        const aptDate = new Date(p.date);
        if (aptDate < start) return false;
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        const aptDate = new Date(p.date);
        if (aptDate > end) return false;
      }

      return true;
    });
  }, [patients, filters]);


  const clearFilters = () => {
    setFilters({ search: '', status: '', doctor: '', service: '', startDate: '', endDate: '' });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
    setMenuOpenId(null);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMenuOpenId(prev => (prev === id ? null : id));
  };

  const handleAction = (id: string, action: 'confirm' | 'complete' | 'cancel' | 'dismiss' | 'archive') => {
    setMenuOpenId(null);

    let message = '';
    let newStatus: ValidStatus | null = null;

    if (action === 'confirm') { newStatus = 'confirmed'; message = 'Status updated: Confirmed'; }
    if (action === 'complete') { newStatus = 'completed'; message = 'Status updated: Completed'; }
    if (action === 'cancel') { newStatus = 'cancelled'; message = 'Status updated: Cancelled'; }
    if (action === 'dismiss') { newStatus = 'dismissed'; message = 'Status updated: Dismissed'; }
    if (action === 'archive') { message = 'Record archived'; }

    if (newStatus) {
      setPatients(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus! } : p)));
    }

    setToast({ show: true, message });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      {/* Toolbar Row */}
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/4 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 outline-none ring-2 ring-gray-200 focus:ring-gray-300 transition-all"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 1
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-white text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none ring-2 ring-gray-200 focus:ring-gray-300"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Doctor</label>
              <select
                value={filters.doctor}
                onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none ring-2 ring-gray-200 focus:ring-gray-300"
              >
                <option value="">All</option>
                {doctors.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Service</label>
              <select
                value={filters.service}
                onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none ring-2 ring-gray-200 focus:ring-gray-300"
              >
                <option value="">All</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">From</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none ring-2 ring-gray-200 focus:ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">To</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none ring-2 ring-gray-200 focus:ring-gray-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="hidden md:flex items-center px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="flex-[2]">Patient Details</div>
        <div className="flex-1">Service</div>
        <div className="flex-[1.5]">Date & Time</div>
        <div className="flex-1">Status</div>
        <div className="flex-1">Doctor</div>
        <div className="w-10" />
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {filteredPatients.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium">No patients found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isExpanded = expandedId === patient.id;
            const isMenuOpen = menuOpenId === patient.id;

            return (
              <div key={patient.id} className={`group transition-colors ${isExpanded ? 'bg-gray-50/30' : 'hover:bg-gray-50/30'}`}>
                <div
                  onClick={() => toggleExpand(patient.id)}
                  className="flex flex-col md:flex-row md:items-center p-4 md:px-6 md:py-4 cursor-pointer gap-3 md:gap-0"
                >
                  {/* Patient */}
                  <div className="flex-[2] min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-xs text-gray-500">{patient.mobile}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex-1 hidden md:block text-sm text-gray-600">{patient.service}</div>

                  {/* Date & Time */}
                  <div className="flex-[1.5] flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(patient.date)}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium">{formatTime(patient.time)}</span>
                  </div>

                  {/* Status */}
                  <div className="flex-1">
                    <StatusBadge status={patient.status} />
                  </div>

                  {/* Doctor */}
                  <div className="flex-1 hidden md:block text-sm text-gray-600">{patient.doctor}</div>

                  {/* Actions */}
                  <div className="w-10 flex justify-end relative">
                    <button
                      onClick={(e) => toggleMenu(e, patient.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMenuOpen ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <ActionMenu
                      isOpen={isMenuOpen}
                      onClose={() => setMenuOpenId(null)}
                      status={patient.status}
                      onAction={(action) => handleAction(patient.id, action)}
                    />
                  </div>
                </div>

                {isExpanded && <ExpandedDetails patient={patient} />}
              </div>
            );
          })
        )}
      </div>

      {/* Footer (static pager style) */}
      {filteredPatients.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
          <span className="text-xs text-gray-500">Showing {filteredPatients.length} records</span>
          <div className="flex gap-2">
            <button disabled className="p-1 rounded-md text-gray-400 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button disabled className="p-1 rounded-md text-gray-400 cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <ToastNotification show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};

export default ClientList;