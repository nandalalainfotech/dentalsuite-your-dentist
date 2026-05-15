import { AlertTriangle, Calendar, CheckCircle, ChevronDown, Eye, Info, Mail, Phone, Search, Stethoscope, UserRound, X, XCircle } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { formatRelativeUpdatedAt, formatShortDate, formatTime, useInvoiceHistory } from "../../../../features/practice_invoice_history/invoiceHistory.hooks";
import type { EnrichedDisputedAppointment } from "../../../../features/practice_invoice_history/invoiceHistory.type";
import { useAppDispatch, useAppSelector } from "../../../../store";
import PracticeDisputeBillingView from "../components/PracticeDisputeBillingView";
import CurrentMonthBillingView from "../components/CurrentMonthBillingView";
import { mapAppointmentToEnriched, shouldAutoComplete } from "../../../../features/online_bookings/online_bookings.utils";
import { fetchAppointments } from "../../../../features/online_bookings/online_bookings.slice";
import { useAppointments } from "../../../../features/online_bookings/online_bookings.hooks";

const getStatusColor = (disputeStatus?: string) => {
  const colors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approve: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200'
  };
  return colors[disputeStatus as keyof typeof colors] || colors.pending;
};

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  appointment: EnrichedDisputedAppointment | null;
  actionType: 'approve' | 'reject';
  isLoading: boolean;
}

const ActionModal = ({ isOpen, onClose, onConfirm, appointment, actionType, isLoading }: ActionModalProps) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNotes(appointment?.dispute_resolution_notes || '');
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const isApprove = actionType === 'approve';
  const title = isApprove ? 'Approve Dispute Resolution' : 'Reject Dispute';
  const confirmButtonText = isApprove ? 'Confirm Approval' : 'Confirm Rejection';
  const confirmButtonClass = isApprove
    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`sticky top-0 px-6 py-4 border-b ${isApprove ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {isApprove ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
              {title}
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/50">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <UserRound className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Full Name</span>
                <span className="font-medium text-slate-800">{appointment.patient_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Date of Birth</span>
                <span className="font-medium text-slate-800">{appointment.dob || '—'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-500 block text-xs">Email Address</span>
                  <span className="font-medium text-slate-800 text-sm break-all">{appointment.email || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-500 block text-xs">Mobile Number</span>
                  <span className="font-medium text-slate-800">{appointment.mobile || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Treatment</span>
                <span className="font-medium text-slate-800">{appointment.treatment}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Appointment Date</span>
                <span className="font-medium text-slate-800">{formatShortDate(appointment.appointment_date)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Appointment Time</span>
                <span className="font-medium text-slate-800">{formatTime(appointment.appointment_date, appointment.appointment_time)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Practitioner</span>
                <span className="font-medium text-slate-800">{appointment.practitioner_name}</span>
              </div>
            </div>
          </div>

          {appointment.dispute_reason && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Dispute Reason</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">{appointment.dispute_reason}</p>
            </div>
          )}

          {appointment.patient_notes && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Patient Notes
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed italic">"{appointment.patient_notes}"</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Resolution Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={isApprove
                ? "Add approval notes..."
                : "Provide rejection reason..."}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none"
            />
          </div>

          {!isApprove && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">⚠️ Warning: Rejection Action</p>
                <p className="text-xs text-red-600 mt-1">Rejecting this dispute will mark the invoice as disputed.</p>
              </div>
            </div>
          )}

          {isApprove && (
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">✅ Confirm Approval</p>
                <p className="text-xs text-green-600 mt-1">Approving this dispute will process the invoice payment.</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-slate-50 border-t rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(notes)}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpandedDisputeDetails = ({ appointment }: { appointment: EnrichedDisputedAppointment }) => (
  <div className="bg-orange-50/30 px-8 py-6 border-t border-orange-100">
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
          <UserRound className="w-3.5 h-3.5" />
          Patient Information
        </h4>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 w-16">Mobile:</span>
            <span className="font-medium text-slate-700">{appointment.mobile || "—"}</span>
          </p>
          <p className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 w-16">Email:</span>
            <span className="font-medium text-slate-700 truncate">{appointment.email || "—"}</span>
          </p>
          <p className="flex justify-between md:justify-start gap-4">
            <span className="text-slate-500 w-16">DOB:</span>
            <span className="font-medium text-slate-700">{appointment.dob || "—"}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
          <Stethoscope className="w-3.5 h-3.5" />
          Patient Notes
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-orange-100">
          "{appointment.patient_notes?.trim() || "No patient notes were attached to this booking."}"
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          Timeline Info
        </h4>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex justify-between">
            <span>Created:</span>
            <span className="font-medium text-slate-700">{appointment.formatted_created_date}</span>
          </p>
          <p className="flex justify-between">
            <span>Last Update:</span>
            <span className="font-medium text-slate-700">{formatRelativeUpdatedAt(appointment.updated_at)}</span>
          </p>
          {appointment.dispute_reason && (
            <div className="mt-2 p-2 bg-orange-100/50 rounded text-xs text-orange-900 border border-orange-200">
              <strong>Dispute Reason:</strong> {appointment.dispute_reason}
            </div>
          )}
          {appointment.dispute_resolution_notes && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-900 border border-blue-200">
              <strong>Resolution Notes:</strong> {appointment.dispute_resolution_notes}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);


const InvoiceHistoryView = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);
  const practiceId = user?.practiceId || user?.practice_id || user?.id;

  // Get the complete bookings (for auto-complete)
  const {
    bookings: rawBookings,
    completeBooking,
    refresh: refreshBookings
  } = useAppointments(practiceId);

  const {
    disputes,
    loading,
    refresh,
    changeStatusFilter,
    filters,
    updateStatus,
    stats
  } = useInvoiceHistory(practiceId, true);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    appointment: EnrichedDisputedAppointment | null;
    actionType: 'approve' | 'reject' | null;
  }>({
    isOpen: false,
    appointment: null,
    actionType: null,
  });

  // Convert raw bookings to enriched appointments for auto-complete
  const appointments = useMemo(() => {
    return rawBookings.map(mapAppointmentToEnriched);
  }, [rawBookings]);

  // --- AUTO-COMPLETE LOGIC (copied from PracticeOnlineBookings) ---
  useEffect(() => {
    const checkAndAutoComplete = async () => {
      for (const apt of appointments) {
        if (shouldAutoComplete(apt)) {
          if (apt.status === 'confirmed') {
            try {
              await completeBooking(apt.id);
              console.log(`Appointment with ${apt.patient_name} auto-completed`);
              setShowToast(true);
              // Refresh both the bookings list and disputes list
              await refreshBookings();
              await refresh();
              setRefreshKey(prev => prev + 1);
            } catch (error) {
              console.error('Auto-complete failed:', error);
            }
          }
        }
      }
    };

    // Check immediately when appointments load
    if (appointments.length > 0) {
      checkAndAutoComplete();
    }

    // Set up interval to check every minute
    const interval = setInterval(checkAndAutoComplete, 60000);

    return () => clearInterval(interval);
  }, [appointments, completeBooking, refreshBookings, refresh]);

  // Also fetch appointments on mount for auto-complete to work
  useEffect(() => {
    if (practiceId) {
      dispatch(fetchAppointments(practiceId));
    }
  }, [dispatch, practiceId]);

  // Force refresh when needed
  const forceRefresh = useCallback(async () => {
    await refresh();
    await refreshBookings(); // Also refresh regular bookings for auto-complete
    setRefreshKey(prev => prev + 1);
  }, [refresh, refreshBookings]);

  // ... (keep all other existing functions: toggleRowExpansion, closeModal, handleConfirmAction, filtering)

  // Filter logic - keep existing
  const filteredAppointments = useMemo(() => {
    let filtered = disputes;
    const search = searchTerm.toLowerCase().trim();
    if (search) {
      filtered = filtered.filter((apt: EnrichedDisputedAppointment) =>
        apt.patient_name?.toLowerCase().includes(search) ||
        apt.treatment?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [disputes, searchTerm, refreshKey]);

  const closeModal = () => {
    setModalState({
      isOpen: false,
      appointment: null,
      actionType: null,
    });
  };

  const handleConfirmAction = async (notes: string) => {
    if (!modalState.appointment || !modalState.actionType) return;

    setActionLoading(true);
    try {
      const newStatus = modalState.actionType === 'approve' ? 'approve' : 'rejected';
      await updateStatus({
        id: modalState.appointment.id,
        status: newStatus,
        resolution_notes: notes.trim() || (modalState.actionType === 'approve'
          ? "Invoice approved and payment processed"
          : "Invoice rejected due to dispute")
      });
      await forceRefresh();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleRowExpansion = useCallback((id: string) => { setOpenMenuId(null); setExpandedRowId(prev => prev === id ? null : id); }, []);

  const ToastNotification = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) => {
    useEffect(() => {
      if (show) {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
      }
    }, [show, onClose]);

    if (!show) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-2">
        {message}
      </div>
    );
  };

  return (
    <>
      <ToastNotification
        message="Appointment auto-completed!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        appointment={modalState.appointment}
        actionType={modalState.actionType as 'approve' | 'reject'}
        isLoading={actionLoading}
      />

      {/* Rest of your existing JSX remains exactly the same */}
      <div className="px-6 pt-8 pb-2 shadow-sm mt-5">
        <h1 className="text-2xl font-bold text-slate-800">Dispute Billing</h1>
      </div>

      {/* Status Tabs */}
      <div className="sticky top-[120px] z-40 bg-white px-6 pt-4 border-b border-slate-100 shadow-sm">
        <div className="flex gap-6">
          <button
            onClick={() => {
              changeStatusFilter('pending');
              setExpandedRowId(null);
            }}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${filters.status === 'pending' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'
              }`}
          >
            Pending
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100">
              {stats.pending}
            </span>
          </button>

          <button
            onClick={() => {
              changeStatusFilter('approve');
              setExpandedRowId(null);
            }}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${filters.status === 'approve' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'
              }`}
          >
            Approved
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100">
              {stats.approved}
            </span>
          </button>

          <button
            onClick={() => {
              changeStatusFilter('rejected');
              setExpandedRowId(null);
            }}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${filters.status === 'rejected' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'
              }`}
          >
            Rejected
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100">
              {stats.rejected}
            </span>
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="p-6">
        <div className="relative group max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by patient name or treatment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden lg:flex items-center px-6 py-4 bg-slate-50 border-b text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex-1">Patient Details</div>
            <div className="flex-1">Appointment Info</div>
            <div className="flex-1">Practitioner</div>
            <div className="w-32 text-center">Status</div>
            <div className="w-20 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Refreshing data...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <Info className="w-12 h-12 text-slate-100 mb-4" />
              <p className="text-slate-500 font-bold">No records found in this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAppointments.map((appointment: EnrichedDisputedAppointment) => {
                const isExpanded = expandedRowId === appointment.id;

                return (
                  <div key={`${appointment.id}-${refreshKey}`} className="bg-white group">
                    <div
                      className={`flex items-center px-6 py-5 hover:bg-orange-50/30 transition-colors ${isExpanded ? 'bg-orange-50/50' : ''}`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleRowExpansion(appointment.id)}
                      >
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {appointment.patient_name}
                          <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-orange-600' : ''}`} />
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5 italic">{appointment.dob || 'DOB not provided'}</div>
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleRowExpansion(appointment.id)}
                      >
                        <div className="text-sm font-bold text-slate-700">{appointment.treatment}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3" /> {formatShortDate(appointment.appointment_date)}
                        </div>
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleRowExpansion(appointment.id)}
                      >
                        <div className="text-sm font-bold text-slate-800">{appointment.practitioner_name}</div>
                        <div className="text-[10px] text-orange-600/60 uppercase font-black tracking-tighter">{appointment.practitioner_role}</div>
                      </div>

                      <div className="w-32 flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusColor(appointment.dispute_status)}`}>
                          {appointment.dispute_status === 'approve' ? <CheckCircle className="w-3 h-3" /> :
                            appointment.dispute_status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                              <AlertTriangle className="w-3 h-3" />}
                          {appointment.dispute_status === 'approve' ? 'APPROVED' :
                            appointment.dispute_status === 'rejected' ? 'REJECTED' : 'PENDING'}
                        </span>
                      </div>

                      <div className="w-20 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(appointment.id);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && <ExpandedDisputeDetails appointment={appointment} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};


const PracticeInvoiceHistoryView = () => {
  const { user } = useAppSelector((state: any) => state.auth);
  const practiceName = user?.practiceName || 'My Practice';

  const [activeTab, setActiveTab] = useState<
    'dispute_billing' | 'invoice_history' | 'current_billing'
  >(() => {
    return (
      (localStorage.getItem('activeTab') as
        | 'dispute_billing'
        | 'invoice_history'
        | 'current_billing') || 'dispute_billing'
    );
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-[60px] z-50 bg-white px-6 border-b border-slate-200 shadow-sm">
          <div className="flex gap-8">

            <button
              onClick={() => setActiveTab('dispute_billing')}
              className={`relative pb-3 text-base font-semibold transition-all ${activeTab === 'dispute_billing'
                ? 'text-orange-500'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Dispute Billing

              {activeTab === 'dispute_billing' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('invoice_history')}
              className={`relative pb-3 text-base font-semibold transition-all ${activeTab === 'invoice_history'
                ? 'text-orange-500'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Invoice History

              {activeTab === 'invoice_history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('current_billing')}
              className={`relative pb-3 text-base font-semibold transition-all ${activeTab === 'current_billing'
                ? 'text-orange-500'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Current Month Billing

              {activeTab === 'current_billing' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>

          </div>
        </div>

        {activeTab === 'current_billing' ? (
          <CurrentMonthBillingView practiceName={practiceName} />
        ) : activeTab === 'dispute_billing' ? (
          <InvoiceHistoryView />
        ) : (
          <PracticeDisputeBillingView />
        )}

      </div>
    </div>
  );
};

export default PracticeInvoiceHistoryView;