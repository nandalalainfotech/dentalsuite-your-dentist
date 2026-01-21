import React, { useState, useMemo, useEffect, useRef } from 'react';
import { practiceApi } from "../../data/practiceApi";
import type { Appointment } from "../../types/dashboard";

// --- Types & Interfaces ---
type ValidStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'reception_cancelled';

interface EnrichedAppointment extends Omit<Appointment, 'status'> {
  bookedAt: Date;
  isNewPatient: boolean;
  isDependent: boolean;
  status: ValidStatus;
  mobile: string;
  dob: string;
  patientNotes: string;
  bookedBy: string;
  lastUpdated: Date;
}

const STATUS_LABELS: Record<ValidStatus, string> = {
  confirmed: 'Booked',
  pending: 'Pending Request',
  completed: 'Completed',
  dismissed: 'Dismissed',
  patient_cancelled: 'Pt. Cancelled',
  reception_cancelled: 'Booking Cancelled',
};

// --- Icons ---
const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Filter: () => <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Dots: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Archive: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  ChevronDown: () => <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  User: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Phone: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Clock: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Notes: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
};

// --- Date Formatters ---
const formatFullDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const formatDateTimeFull = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}

const formatTime = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}

// --- Logic Helpers ---
const isTerminalState = (status: ValidStatus) => {
  return ['completed', 'patient_cancelled', 'reception_cancelled', 'dismissed'].includes(status);
};

export default function PracticeAppointmentsView() {
  // --- State ---
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'online' | 'all'>('online');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [filters, setFilters] = useState({ 
    search: '', 
    type: '', 
    practitioner: '', 
    status: '', 
    startDate: '', 
    endDate: '' 
  });
  
  const menuRef = useRef<HTMLDivElement>(null);

  // --- 1. Data Initialization & SORTING ---
  useEffect(() => {
    const practices = practiceApi.getAllPractices();
    const rawAppts = practices.flatMap(practice => practice.appointments || []);
    const now = new Date();

    const enriched = rawAppts.map((apt, index) => {
      let apptDate = new Date(now);
      let bookedDate = new Date(now);
      let updatedDate = new Date(now);
      let assignedStatus: ValidStatus;

      // --- LOGICAL DATE & STATUS ASSIGNMENT ---
      if (index === 0) {
        // PENDING
        apptDate.setDate(now.getDate() + 1);
        apptDate.setHours(10, 0, 0, 0); 
        bookedDate.setHours(now.getHours() - 2); 
        updatedDate = bookedDate;
        assignedStatus = 'pending';
      } 
      else if (index === 1) {
        // PATIENT CANCELLED
        apptDate.setDate(now.getDate() + 3);
        apptDate.setHours(14, 30, 0, 0);
        bookedDate.setDate(now.getDate() - 7);
        updatedDate.setHours(now.getHours() - 1); 
        assignedStatus = 'patient_cancelled';
      } 
      else if (index === 2) {
        // COMPLETED
        apptDate.setDate(now.getDate() - 1);
        apptDate.setHours(11, 15, 0, 0);
        bookedDate.setDate(now.getDate() - 14);
        updatedDate.setDate(now.getDate() - 1); 
        updatedDate.setHours(12, 0, 0); 
        assignedStatus = 'completed';
      } 
      else if (index === 3) {
        // RECEPTION CANCELLED
        apptDate.setDate(now.getDate() + 4);
        apptDate.setHours(9, 0, 0, 0);
        bookedDate.setDate(now.getDate() - 2);
        updatedDate.setHours(now.getHours() - 4);
        assignedStatus = 'reception_cancelled';
      } 
      else if (index === 4) {
        // DISMISSED
        apptDate = new Date(now); 
        apptDate.setHours(16, 0, 0, 0);
        bookedDate.setDate(now.getDate() - 1);
        updatedDate.setDate(now.getDate());
        assignedStatus = 'dismissed';
      } 
      else {
        // CONFIRMED (Default)
        const daysAhead = index + 2; 
        apptDate.setDate(now.getDate() + daysAhead);
        apptDate.setHours(9 + (index % 8), 0, 0, 0); 
        bookedDate.setDate(now.getDate() - (index % 5) - 1);
        updatedDate = bookedDate;
        assignedStatus = (apt.status === 'completed') ? 'completed' : 'confirmed';
      }

      // Dependent Logic
      const bookerName = index % 2 === 0 ? apt.patientName : "John Cena"; 
      const isDependent = bookerName !== apt.patientName;

      return {
        ...apt,
        dateTime: apptDate.toISOString(),
        bookedAt: bookedDate,
        lastUpdated: updatedDate,
        status: assignedStatus,
        isNewPatient: index % 3 === 0,
        isDependent: isDependent,
        bookedBy: bookerName,
        mobile: "0450003518",
        dob: "20/12/1978",
        patientNotes: index % 2 === 0 ? "Check up required" : "Tooth pain on lower left side"
      } as unknown as EnrichedAppointment;
    })
    .sort((a, b) => {
      // Priority 1: Pending requests at the top
      const aIsPending = a.status === 'pending';
      const bIsPending = b.status === 'pending';
      if (aIsPending && !bIsPending) return -1; 
      if (!aIsPending && bIsPending) return 1;  

      // Priority 2: Sort by Appointment Date
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });

    setAppointments(enriched);
  }, []);

  // --- 2. Handlers ---
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = (id: string, newStatus: ValidStatus) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus, lastUpdated: new Date() } : apt
    ));
    setOpenMenuId(null); 
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', practitioner: '', status: '', startDate: '', endDate: '' });
  };

  // Click Outside for menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. Derived Data ---
  const practitioners = useMemo(() => 
    [...new Set(appointments.map(a => a.dentistName))].filter(Boolean), 
    [appointments]
  );
  
  const appointmentTypes = useMemo(() => 
    [...new Set(appointments.map(a => a.treatment))].filter(Boolean), 
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      
      if (activeTab === 'online' && apt.treatment === 'Root Canal') return false; 
      if (filters.search && apt.patientName && !apt.patientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type && apt.treatment !== filters.type) return false;
      if (filters.practitioner && apt.dentistName !== filters.practitioner) return false;
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

  // --- 4. Style Helper ---
  const getStatusBadge = (status: ValidStatus) => {
    const styles = {
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      dismissed: 'bg-gray-100 text-gray-600 border-gray-200', 
      patient_cancelled: 'bg-red-50 text-red-700 border-red-200',
      reception_cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} whitespace-nowrap`}>
        {STATUS_LABELS[status]}
      </span>
    );
  };

  const activeFilterCount = Object.values(filters).filter(x => x !== '').length;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      
      {/* --- Header --- */}
      <div className="border-b border-gray-200">
        <div className="px-4 md:px-6 p-4 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Appointments</h2>
            <p className="text-sm text-gray-500 mt-1">Manage practice schedule and requests</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0 overflow-x-auto pb-1 md:pb-0">
            {['online', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab === 'online' ? 'Online Requests' : 'All Appointments'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="p-4 md:p-6 bg-gray-50/50 border-b border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Search by patient name..." 
              value={filters.search} 
              onChange={(e) => handleFilterChange('search', e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-3">
            <button 
              onClick={() => setShowFiltersMobile(!showFiltersMobile)} 
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Icons.Filter /> 
              {showFiltersMobile ? 'Hide Filters' : 'Filter Results'}
              {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {activeFilterCount > 0 && (
              <button 
                onClick={clearFilters} 
                className="text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${showFiltersMobile ? 'block animate-in fade-in slide-in-from-top-2' : 'hidden md:grid'}`}>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">Start Date</label>
            <input 
              type="date" 
              value={filters.startDate} 
              onChange={(e) => handleFilterChange('startDate', e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">End Date</label>
            <input 
              type="date" 
              value={filters.endDate} 
              onChange={(e) => handleFilterChange('endDate', e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">Treatment</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm appearance-none"
            >
              <option value="">All Types</option>
              {appointmentTypes.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">Practitioner</label>
            <select 
              value={filters.practitioner} 
              onChange={(e) => handleFilterChange('practitioner', e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm appearance-none"
            >
              <option value="">All Practitioners</option>
              {practitioners.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm appearance-none"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- Data List --- */}
      <div className="bg-white min-h-[400px]">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Icons.Calendar />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">No appointments found</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
            <button 
              onClick={clearFilters} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="py-4 pl-4 w-10"></th>
                    <th className="py-4 pr-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Patient</th>
                    <th className="py-4 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Practitioner</th>
                    <th className="py-4 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Appointment Details</th>
                    <th className="py-4 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                    <th className="py-4 px-3 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Booked At</th>
                    <th className="py-4 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.map((apt) => {
                    const isExpanded = expandedRowId === apt.id;
                    return (
                      <React.Fragment key={apt.id}>
                        <tr 
                          onClick={() => toggleRowExpansion(apt.id)} 
                          className={`group cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="py-4 pl-4 align-top">
                            {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                          </td>
                          
                          <td className="py-4 pr-3 align-top">
                            <div className="font-bold text-gray-900 text-[15px]">
                              {apt.patientName || 'Unknown'}
                            </div>
                            <div className="flex gap-2 mt-1.5">
                              {apt.isNewPatient && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200">
                                  New Patient
                                </span>
                              )}
                              {apt.isDependent && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold border border-gray-200">
                                  Dependent
                                </span>
                              )}
                            </div>
                          </td>
                          
                          <td className="py-4 px-3 align-top text-gray-700 text-sm">
                            {apt.dentistName}
                          </td>
                          
                          <td className="py-4 px-3 align-top">
                            <div className="text-gray-800 font-medium text-sm">
                              {formatFullDate(apt.dateTime)}
                            </div>
                            <div className="text-gray-500 text-xs mt-0.5">
                              {formatTime(apt.dateTime)}
                            </div>
                          </td>
                          
                          <td className="py-4 px-3 align-top">
                            {getStatusBadge(apt.status)}
                          </td>
                          
                          <td className="py-4 px-3 align-top text-sm text-gray-500 text-right">
                            {formatFullDate(apt.bookedAt)}
                            <div className="text-gray-400 text-xs mt-0.5">
                              {formatTime(apt.bookedAt)}
                            </div>
                          </td>
                          
                          <td 
                            className="py-4 px-3 align-top text-right relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!isTerminalState(apt.status) && (
                              <div className="relative inline-block text-left">
                                <button 
                                  type="button"
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setOpenMenuId(openMenuId === apt.id ? null : apt.id); 
                                  }} 
                                  className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${openMenuId === apt.id ? 'bg-gray-100 text-gray-800' : 'text-gray-500'}`}
                                >
                                  <Icons.Dots />
                                </button>
                                
                                <ActionDropdown 
                                  isOpen={openMenuId === apt.id} 
                                  apt={apt} 
                                  onUpdate={handleStatusUpdate} 
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                        
                        {/* Expanded Row Details */}
                        {isExpanded && (
                          <tr className="bg-blue-50/30 animate-in fade-in duration-200">
                            <td colSpan={7} className="px-4 pb-4 pt-0">
                              <div className="ml-8 mt-2 p-0">
                                <div className="grid grid-cols-4 gap-8 text-sm">
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5 flex items-center gap-1.5">
                                        <Icons.Phone /> Mobile
                                      </div>
                                      <div className="text-gray-800 font-medium">{apt.mobile}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5">DOB</div>
                                      <div className="text-gray-800">{apt.dob}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5">Treatment</div>
                                      <div className="text-gray-800 font-medium">{apt.treatment}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5 flex items-center gap-1.5">
                                        <Icons.Notes /> Patient Notes
                                      </div>
                                      <div className="text-gray-800">{apt.patientNotes || '-'}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5 flex items-center gap-1.5">
                                        <Icons.Clock /> Last Updated
                                      </div>
                                      <div className="text-gray-800">{formatDateTimeFull(apt.lastUpdated)}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-gray-500 font-semibold text-xs mb-1.5 flex items-center gap-1.5">
                                        <Icons.User /> Booked By
                                      </div>
                                      <div className="text-gray-800 font-medium">
                                        {apt.bookedBy}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden">
              {filteredAppointments.map((apt) => {
                const isExpanded = expandedRowId === apt.id;
                return (
                  <div 
                    key={apt.id} 
                    className={`p-4 border-b border-gray-100 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}
                  >
                    <div 
                      className="flex justify-between items-start mb-3 cursor-pointer"
                      onClick={() => toggleRowExpansion(apt.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">
                          {apt.patientName || 'Unknown Patient'}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {apt.isNewPatient && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-200">
                              New Patient
                            </span>
                          )}
                          {apt.isDependent && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold border border-gray-200">
                              Dependent
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(apt.status)}
                        {!isTerminalState(apt.status) && (
                          <div 
                            className="relative" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setOpenMenuId(openMenuId === apt.id ? null : apt.id); 
                              }} 
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                              <Icons.Dots />
                            </button>
                            <ActionDropdown 
                              isOpen={openMenuId === apt.id} 
                              apt={apt} 
                              onUpdate={handleStatusUpdate} 
                              isMobile={true} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Collapsed View */}
                    {!isExpanded && (
                      <div 
                        className="text-sm text-gray-600 flex justify-between items-center pt-2 border-t border-gray-100"
                        onClick={() => toggleRowExpansion(apt.id)}
                      >
                        <div>
                          <div className="font-medium">{formatFullDate(apt.dateTime)}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{formatTime(apt.dateTime)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{apt.dentistName}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{apt.treatment}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded View */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 text-sm animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                              <Icons.Phone /> Mobile
                            </div>
                            <div className="font-medium">{apt.mobile}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">DOB</div>
                            <div>{apt.dob}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">Treatment</div>
                            <div className="font-medium">{apt.treatment}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">Practitioner</div>
                            <div className="font-medium">{apt.dentistName}</div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                              <Icons.Notes /> Patient Notes
                            </div>
                            <div>{apt.patientNotes}</div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                              <Icons.User /> Booked By
                            </div>
                            <div className="font-medium">{apt.bookedBy}</div>
                          </div>
                          
                          <div className="col-span-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                            Booked on {formatDateTimeFull(apt.bookedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 gap-4">
        <div className="text-gray-700">
          Showing <span className="font-semibold text-gray-900">{filteredAppointments.length}</span> appointments
        </div>
        <div className="flex gap-2">
          <button 
            disabled 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-400 cursor-not-allowed text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            Previous
          </button>
          <button 
            disabled={filteredAppointments.length < 10} 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ACTION DROPDOWN ---
const ActionDropdown = ({ 
  isOpen, 
  apt, 
  onUpdate, 
  isMobile = false 
}: { 
  isOpen: boolean; 
  apt: EnrichedAppointment; 
  onUpdate: (id: string, status: ValidStatus) => void; 
  isMobile?: boolean;
}) => {
  if (!isOpen) return null;

  const styles = isMobile
    ? "fixed md:absolute right-4 top-16 md:top-10 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 origin-top-right"
    : "absolute right-0 top-8 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 origin-top-right";

  const handleAction = (e: React.MouseEvent, status: ValidStatus) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onUpdate(apt.id, status);
  };

  return (
    <div 
      className={`${styles} animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black ring-opacity-5`} 
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="py-2">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Update Status
        </div>
        
        {apt.status === 'pending' && (
          <button 
            onClick={(e) => handleAction(e, 'confirmed')} 
            className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 text-gray-700 hover:text-green-700 flex items-center gap-3 transition-colors"
          >
            <span className="text-green-500">
              <Icons.Check />
            </span>
            Confirm Appointment
          </button>
        )}
        
        {apt.status === 'confirmed' && (
          <button 
            onClick={(e) => handleAction(e, 'completed')} 
            className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-700 flex items-center gap-3 transition-colors"
          >
            <span className="text-blue-500">
              <Icons.Check />
            </span>
            Mark as Completed
          </button>
        )}

        <div className="h-px bg-gray-100 my-1"></div>

        {apt.status === 'pending' ? (
          <button 
            onClick={(e) => handleAction(e, 'dismissed')} 
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 text-gray-700 flex items-center gap-3 transition-colors"
          >
            <span className="text-gray-500">
              <Icons.Archive />
            </span>
            Dismiss Request
          </button>
        ) : (
          <button 
            onClick={(e) => handleAction(e, 'reception_cancelled')} 
            className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-700 flex items-center gap-3 transition-colors"
          >
            <span className="text-red-500">
              <Icons.Close />
            </span>
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
};