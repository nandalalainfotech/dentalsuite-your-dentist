/* eslint-disable react-hooks/set-state-in-effect */
import {
  Calendar, CalendarCheck, CheckCircle, ChevronDown, Clock, Inbox, List,
  MoreVertical, RefreshCw, Search, Sliders, X, XCircle, Clock as ClockIcon,
  User,
  Loader2
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAppSelector } from '../../../../store';
import { type TabType, mapAppointmentToEnriched, type ValidStatus, isCancelledStatus, ITEMS_PER_PAGE, TAB_CONFIG, isTerminalState, getWeekday, getDay, getMonth, formatTime, formatShortDate, formatRelativeUpdatedAt, formatRelativeTime, type EnrichedAppointment } from '../../../../features/appointments/appointments.utils';
import { getAppointmentsService } from '../../../../services/onlinebookingservice';
import { DesktopDropdown, MobileBottomSheet } from '../components/AppointmentActions';
import { RescheduleModal } from '../components/AppointmentRescheduleModal';
import { TableHeader, StatusBadge, PatientTags } from '../components/AppointmentUI';
import { ExpandedDetailsCard, ToastNotification } from '../components/AppointmentComponent';
// Local Interface for Filters
interface FilterState {
  search: string; type: string; practitioner: string; status: string; startDate: string; endDate: string;
}

export default function PracticeOnlineBookings() {
  // ✅ CORRECT (New Structure)
  const { user } = useAppSelector((state: any) => state.auth);
  const practiceId = user?.id;

  // --- State ---
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

  // Filters State
  const [filters, setFilters] = useState<FilterState>(
    { search: '', type: '', practitioner: '', status: '', startDate: '', endDate: '' }
  );

  // --- Effects ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile(); window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!practiceId) return;
    try {
      setIsLoading(true); setIsRefreshing(true);
      const data = await getAppointmentsService(practiceId);
      setAppointments(data.map((apt: any) => mapAppointmentToEnriched(apt)));
    } catch (error) { console.error("Error fetching appointments:", error); }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, [practiceId]);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60000);
    return () => clearInterval(interval);
  },
    [fetchAppointments]);
  const handleRefresh = () => fetchAppointments();
  useEffect(() => setCurrentPage(1), [activeTab, filters]);

  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  const handleStatusUpdate = useCallback((id: string, newStatus: ValidStatus) => {
    setAppointments(prev => prev.map(
      apt => apt.id === id ? { ...apt, status: newStatus, updated_at: new Date().toISOString() } : apt
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
    setAppointments(prev => prev.map(apt => apt.id === rescheduleApt.id ?
      {
        ...apt, appointment_date: newDate, appointment_time: newTime, status: 'confirmed' as ValidStatus,
        is_rescheduled: true, updated_at: new Date().toISOString()
      } : apt));
    setShowRescheduleModal(false); setRescheduleApt(null); setShowToast(true);
  };

  const handleOpenMenu = useCallback((aptId: string) => { setExpandedRowId(null); setOpenMenuId(aptId); }, []);
  const handleCloseMenu = useCallback(() => setOpenMenuId(null), []);
  const toggleRowExpansion = useCallback((id: string) => { setOpenMenuId(null); setExpandedRowId(prev => prev === id ? null : id); }, []);
  const clearFilters = () => setFilters({ search: '', type: '', practitioner: '', status: '', startDate: '', endDate: '' });

  // --- Computed Data ---
  const practitioners = useMemo(() => [...new Set(appointments.map(a => a.dentist_name).filter(Boolean))], [appointments]);
  const appointmentTypes = useMemo(() => [...new Set(appointments.map(a => a.treatment).filter(Boolean))], [appointments]);
  const stats = useMemo(() => ({
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    upcoming: appointments.filter(a => {
      const aptDate = new Date(a.appointment_date);
      return aptDate > new Date() && a.status === 'confirmed';
    }).length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => isCancelledStatus(a.status)).length,
  }), [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      if (activeTab === 'pending' && apt.status !== 'pending')
        return false;
      if (activeTab === 'upcoming' && (aptDate <= now || apt.status !== 'confirmed'))
        return false;
      if (activeTab === 'completed' && apt.status !== 'completed')
        return false;
      if (activeTab === 'cancelled' && !isCancelledStatus(apt.status))
        return false;
      if (filters.search && !apt.patient_name?.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.type && apt.treatment !== filters.type)
        return false;
      if (filters.practitioner && apt.dentist_name !== filters.practitioner)
        return false;
      if (filters.status && apt.status !== filters.status)
        return false;
      if (filters.startDate && aptDate < new Date(new Date(filters.startDate).setHours(0, 0, 0, 0)))
        return false;
      if (filters.endDate && aptDate > new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)))
        return false;
      return true;
    });
  }, [appointments, activeTab, filters]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() =>
    filteredAppointments.slice((currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE),
    [filteredAppointments, currentPage]);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) { setCurrentPage(page); setExpandedRowId(null); setOpenMenuId(null); }
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
  const getEmptyStateMessage = () => "No appointments found.";

  // Virtualizer
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({ count: paginatedAppointments.length, getScrollElement: () => parentRef.current, estimateSize: () => 120, overscan: 5 });

  if (isLoading)
    return
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
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Online Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your practice bookings
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm border border-gray-200 ${isRefreshing
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm'}
          `}>
            <div className={isRefreshing
              ? 'animate-spin' : ''}>
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="bg-white">
          {/* Tabs */}
          <div className="px-2 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-full sm:w-fit overflow-x-auto scrollbar-hide">
              {Object.keys(TAB_CONFIG).map((key) => {
                const tabKey = key as TabType;
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
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${isActive
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}
                 `}>
                    <span className="hidden xs:inline-flex">
                      {getTabIcon(tabKey)}
                    </span>
                    <span>{tabConfig.label}</span>
                    {count > 0 && (
                      <span
                        className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full font-semibold transition-colors duration-200 ${isActive
                          ? tabConfig.activeColor
                          : 'bg-gray-200 text-gray-600'}
                      `}>{count}</span>
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
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || activeFilterCount > 0
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700'}
              `}>
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Filters
                </span>{activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 &&
                <button
                  onClick={clearFilters}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>}
            </div>
            {showFilters && (
              <div className="mt-3 pt-3 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Practitioner</label>
                  <select
                    value={filters.practitioner}
                    onChange={(e) => handleFilterChange('practitioner', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    <option value="">All
                    </option>
                    {practitioners.map((p, i) => <option key={i} value={p}>{p}
                    </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">Treatment</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    <option value="">All
                    </option>
                    {appointmentTypes.map((t, i) =>
                      <option key={i} value={t}>{t}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">From</label>
                  <input type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase">To</label>
                  <input type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm" />
                </div>
              </div>
            )}
          </div>

          {filteredAppointments.length > 0 && <TableHeader />}

          {/* List */}
          <div className="min-h-[400px]">
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Inbox className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No appointments</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">{getEmptyStateMessage()}
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div ref={parentRef} className="h-[400px] overflow-auto">
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const apt = paginatedAppointments[virtualRow.index];
                    const isExpanded = expandedRowId === apt.id;
                    return (
                      <div key={apt.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                        className="divide-y divide-gray-100"
                      >
                        {/* Mobile Row */}
                        <div className="lg:hidden">
                          <div onClick={() => toggleRowExpansion(apt.id)}
                            className={`px-3 sm:px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors ${isExpanded
                              ? "bg-gray-50"
                              : "hover:bg-gray-50/60"}
                          `}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <StatusBadge status={apt.status} size="small" isRescheduled={apt.is_rescheduled} />
                              <div className="flex items-center gap-1">
                                <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} size="small"
                                />
                                {!isTerminalState(apt.status) &&
                                  <button onClick={(e) => { e.stopPropagation(); handleOpenMenu(apt.id); }}
                                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                }
                                <button className={`p-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
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
                                <h4 className="font-semibold text-gray-900 text-sm truncate">{apt.patient_name}</h4>
                                <div className="mt-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <ClockIcon className="w-3 h-3 text-gray-400" />
                                    <span className="font-medium">
                                      {formatTime(apt.appointment_date, apt.appointment_time)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="truncate">{apt.treatment}
                                    </span>
                                  </div><div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="truncate">{apt.dentist_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded &&
                              <ExpandedDetailsCard apt={apt}
                              />}
                          </div>
                        </div>
                        {/* Desktop Row */}
                        <div className={`hidden lg:block transition-colors ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50/60"}`}>
                          <div className="flex items-center px-4 md:px-6 py-4 cursor-pointer" onClick={() => toggleRowExpansion(apt.id)}>
                            <div className="flex-[1.5] min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">{apt.patient_name}</h4>
                                <PatientTags isNewPatient={apt.isNewPatient} isDependent={apt.isDependent} />
                              </div>
                              <div className="text-xs text-gray-600 truncate">{apt.mobile}</div>
                            </div>
                            <div className="flex-1 pr-4">
                              <div className="text-sm font-medium text-gray-700">{apt.dentist_name}</div>
                              <div className="text-xs text-gray-500">Dentist</div>
                            </div>
                            <div className="flex-[1.2] pr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatShortDate(apt.appointment_date)} | {formatTime(apt.appointment_date, apt.appointment_time)}
                              </div>
                              <div className="text-sm text-gray-700 truncate">{apt.treatment}</div>
                            </div>
                            <div className="flex-1 pr-4"><StatusBadge status={apt.status} isRescheduled={apt.is_rescheduled} />
                              <div className="text-xs text-gray-600 mt-1">{formatRelativeUpdatedAt(apt.updated_at)}
                              </div>
                            </div>
                            <div className="flex-1 text-sm text-gray-600">{formatRelativeTime(apt.created_at)}</div>
                            <div className="w-16 flex justify-end items-center gap-1 relative">
                              {!isTerminalState(apt.status) &&
                                <button onClick={(e) => { e.stopPropagation(); handleOpenMenu(apt.id); }}
                                  className={`p-1.5 rounded-lg ${openMenuId === apt.id
                                    ? "bg-gray-200 text-gray-700"
                                    : "text-gray-400 hover:bg-gray-100"}`}>

                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              }

                              {openMenuId === apt.id && !isMobile &&
                                <DesktopDropdown apt={apt} onUpdate={handleStatusUpdate} onReschedule={handleRescheduleClick} onClose={handleCloseMenu} />
                              }
                              <button onClick={(e) => { e.stopPropagation(); toggleRowExpansion(apt.id); }}
                                className={`p-1.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
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
          {/* Pagination (Simplified) */}

          {filteredAppointments.length > 0 &&

            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="text-sm text-gray-500">{filteredAppointments.length} appointments</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs bg-white border rounded">Prev
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs bg-white border rounded">Next
                </button>
              </div>
            </div>}
        </div>
      </div>

      {openMenuId && openMenuApt && isMobile &&
        <MobileBottomSheet
          apt={openMenuApt}
          onUpdate={handleStatusUpdate}
          onReschedule={handleRescheduleClick}
          onClose={handleCloseMenu} />
      }

      {showRescheduleModal && rescheduleApt &&
        <RescheduleModal
          apt={rescheduleApt}
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleRescheduleConfirm} practitioners={practitioners}
        />
      }
      <ToastNotification message="Success!" show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}