import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Clinic, Dentist } from "../../types";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinic: Clinic | null;
    selectedDentistId?: string;
}

const BookingModal = ({
    isOpen,
    onClose,
    clinic,
    selectedDentistId,
}: BookingModalProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- State ---
    const [selectedService, setSelectedService] = useState("dentistry");
    const [selectedPractitioner, setSelectedPractitioner] = useState(
        selectedDentistId || ""
    );
    const [selectedDateStr, setSelectedDateStr] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    
    // viewDate controls the visible month in the calendar
    const [viewDate, setViewDate] = useState(new Date());
    
    const [showCalendarMobile, setShowCalendarMobile] = useState(false);
    const [showPractitionerDropdown, setShowPractitionerDropdown] = useState(false);

    const [upcomingDates, setUpcomingDates] = useState<
        { date: Date; dateStr: string; slots: string[] }[]
    >([]);

    // --- Helpers ---

    // Memoize current dentist to prevent unnecessary recalcs
    const currentDentist = useMemo(() => {
        return clinic?.dentists?.find((d: Dentist) => d.id === selectedPractitioner);
    }, [clinic, selectedPractitioner]);

    // Logic to calculate available dates/slots
    const getAvailableDates = (startDate: Date, dentist: Dentist | undefined) => {
        if (!dentist) return [];

        const dates: { date: Date; dateStr: string; slots: string[] }[] = [];
        let daysChecked = 0;
        let validDaysFound = 0;

        // Safety break: check max 45 days ahead or until we find 5 valid days
        while (validDaysFound < 5 && daysChecked < 45) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + daysChecked);
            
            // Normalize time to compare dates accurately
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkDate = new Date(currentDate);
            checkDate.setHours(0, 0, 0, 0);

            // Skip past dates
            if (checkDate < today) {
                daysChecked++;
                continue;
            }

            const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

            if (dentist.availabledays?.includes(dayName)) {
                const availableSlots =
                    dentist.slots
                        ?.filter((slot) => slot.available)
                        .map((slot) => slot.time) || [];

                if (availableSlots.length > 0) {
                    dates.push({
                        date: currentDate,
                        dateStr: currentDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }),
                        slots: availableSlots,
                    });
                    validDaysFound++;
                }
            }
            daysChecked++;
        }
        return dates;
    };

    // --- Effects ---

    // 1. Reset state on open
    useEffect(() => {
        if (isOpen && clinic?.dentists && clinic.dentists.length > 0) {
            if (selectedDentistId) {
                setSelectedPractitioner(selectedDentistId);
            } else if (!selectedPractitioner) {
                setSelectedPractitioner(clinic.dentists[0].id);
            }
            setViewDate(new Date());
            setSelectedDateStr("");
            setSelectedTime("");
            setShowCalendarMobile(false);
            setShowPractitionerDropdown(false);
        }
    }, [isOpen, clinic, selectedDentistId]); // removed dependency loop

    // 2. Calculate Slots
    useEffect(() => {
        if (!currentDentist) return;

        let startCalculationDate: Date;

        // If user selected a specific date in calendar, start list from there
        if (selectedDateStr) {
            startCalculationDate = new Date(selectedDateStr);
        } else {
            // Otherwise start from the beginning of the viewed month
            startCalculationDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
            const today = new Date();
            // If viewing current month, start from Today, not the 1st
            if (startCalculationDate.getMonth() === today.getMonth() && startCalculationDate.getFullYear() === today.getFullYear()) {
                startCalculationDate = today;
            }
        }

        const dates = getAvailableDates(startCalculationDate, currentDentist);
        setUpcomingDates(dates);

        // Auto-scroll list to top when data changes
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }

    }, [selectedPractitioner, viewDate, selectedDateStr, currentDentist]);

    // --- Handlers ---
    const handleBookAppointment = () => {
        if (!selectedDateStr || !selectedTime) return;

        // Create date in local time to avoid timezone shifts
        const dateObj = new Date(selectedDateStr);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Referrer Logic
        const existingReferrer = sessionStorage.getItem('bookingReferrer');
        if (!existingReferrer) {
            const currentPath = location.pathname;
            const documentReferrer = document.referrer;
            let referrerPath = '/';

            if (currentPath.includes('/clinicprofile/')) referrerPath = currentPath;
            else if (documentReferrer && documentReferrer.includes('/clinicprofile/')) referrerPath = documentReferrer;
            else if (currentPath.includes('/dentist/')) referrerPath = `/dentist/${selectedDentistId}`;
            
            sessionStorage.setItem('bookingReferrer', referrerPath);
        }

        navigate(`/booking/${selectedPractitioner}`, {
            state: {
                date: formattedDate,
                time: selectedTime,
                service: selectedService,
            }
        });
        onClose();
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewDate(newDate);
        // Clear specific selection when changing month so list defaults to "Available from start of month"
        setSelectedDateStr("");
        setSelectedTime("");
    };

    const handleDateSelect = (dateString: string) => {
        setSelectedDateStr(dateString);
        setSelectedTime("");
        setShowCalendarMobile(false);
    };

    // --- Render Calendar ---
    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            const dateString = date.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
            });

            const isAvailableDay = currentDentist?.availabledays?.includes(dayName);
            const isSelected = selectedDateStr === dateString;
            
            // Strict comparison for Past/Today
            const today = new Date();
            today.setHours(0,0,0,0);
            const checkDate = new Date(date);
            checkDate.setHours(0,0,0,0);
            
            const isToday = checkDate.getTime() === today.getTime();
            const isPast = checkDate < today;

            let buttonClass = "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors ";

            if (isSelected) {
                buttonClass += "bg-orange-600 text-white font-bold shadow-md";
            } else if (isPast) {
                buttonClass += "text-gray-300 cursor-not-allowed";
            } else if (isAvailableDay) {
                buttonClass += "text-gray-900 font-bold hover:bg-orange-100 cursor-pointer";
                if (isToday) buttonClass += " border border-orange-600";
            } else {
                buttonClass += "text-gray-400 cursor-default";
            }

            days.push(
                <button
                    key={day}
                    disabled={!isAvailableDay || isPast}
                    onClick={() => handleDateSelect(dateString)}
                    className={buttonClass}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const getSelectedDateDetails = () => {
        if (!selectedDateStr) return "Select date";
        const date = new Date(selectedDateStr);
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] transition-opacity" onClick={onClose}></div>

            <div className="fixed inset-0 z-[99999] flex items-center justify-center sm:p-4 md:p-6">

                {/* Main Box - Responsive Height & Radius */}
                <div className="bg-white w-5xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
                    
                    {/* DESKTOP/TABLET SIDEBAR */}
                    {/* Tablet Optimization: Width is tighter on md (260px) and wider on lg (380px) */}
                    <div className="hidden md:flex md:w-[260px] lg:w-[380px] bg-gray-50 flex-col border-b md:border-b-0 md:border-r border-gray-200 shrink-0 transition-all duration-300">
                        <div className="p-4 lg:p-6 overflow-y-auto max-h-full h-full">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
                                {clinic?.name || "Dental Clinic"}
                            </h2>

                            {/* Calendar Widget */}
                            <div className="mb-6 lg:mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-700 font-semibold text-base lg:text-lg">
                                        {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-200 rounded text-gray-600">
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 mb-2 text-center">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                        <span key={i} className="text-xs text-gray-400 font-medium">{d}</span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-y-2 place-items-center">
                                    {renderCalendar()}
                                </div>
                            </div>

                            {/* Dropdowns */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Specialty
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                            className="w-full px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 appearance-none cursor-pointer"
                                        >
                                            <option value="dentistry">Dentistry</option>
                                            {clinic?.specialities?.map((service: string, index: number) => (
                                                <option key={index} value={service.toLowerCase()}>
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Practitioner
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedPractitioner}
                                            onChange={(e) => {
                                                setSelectedPractitioner(e.target.value);
                                                // Reset specific selections when changing dentist
                                                setSelectedDateStr("");
                                                setSelectedTime("");
                                            }}
                                            className="w-full px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 appearance-none cursor-pointer"
                                        >
                                            {clinic?.dentists?.map((dentist: Dentist) => (
                                                <option key={dentist.id} value={dentist.id}>
                                                    {dentist.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE HEADER (Visible only on < md) */}
                    <div className="md:hidden bg-white border-b border-gray-200">
                        {/* Top Bar */}
                        <div className="flex justify-between items-center p-4">
                            <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                                {clinic?.name}
                            </h2>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Mobile Filters */}
                        <div className="px-4 pb-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                {/* Calendar Button */}
                                <div className="flex-1">
                                    <button
                                        onClick={() => setShowCalendarMobile(!showCalendarMobile)}
                                        className="w-full group"
                                    >
                                        <div className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm">
                                            <div className="text-left">
                                                <p className="text-xs font-medium text-gray-500 mb-0.5">Date</p>
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {getSelectedDateDetails()}
                                                </p>
                                            </div>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showCalendarMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </button>
                                </div>

                                {/* Practitioner Button */}
                                <div className="flex-1">
                                    <button
                                        onClick={() => setShowPractitionerDropdown(!showPractitionerDropdown)}
                                        className="w-full group"
                                    >
                                        <div className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm">
                                            <div className="text-left">
                                                <p className="text-xs font-medium text-gray-500 mb-0.5">Practitioner</p>
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {currentDentist?.name || "Select"}
                                                </p>
                                            </div>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showPractitionerDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Calendar Dropdown */}
                        {showCalendarMobile && (
                            <div className="px-4 pb-4 animate-in slide-in-from-top duration-200">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-700 font-semibold text-lg">
                                            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                        </span>
                                        <div className="flex gap-1">
                                            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><i className="bi bi-chevron-left"></i></button>
                                            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><i className="bi bi-chevron-right"></i></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 mb-2 text-center">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="text-xs text-gray-400 font-medium">{d}</span>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-2 place-items-center">
                                        {renderCalendar()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Practitioner Dropdown */}
                        {showPractitionerDropdown && (
                            <div className="px-4 pb-4 animate-in slide-in-from-top duration-200">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto">
                                    <div className="space-y-2">
                                        {clinic?.dentists?.map((dentist: Dentist) => (
                                            <button
                                                key={dentist.id}
                                                onClick={() => {
                                                    setSelectedPractitioner(dentist.id);
                                                    setShowPractitionerDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedPractitioner === dentist.id ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'}`}
                                            >
                                                <div className="font-medium">{dentist.name}</div>
                                                <div className="text-sm text-gray-500 mt-1">{dentist.specialities}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT CONTENT (Slots) --- */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden relative min-h-0">

                        {/* Close Button (Desktop/Tablet) */}
                        <button
                            onClick={onClose}
                            className="hidden md:block absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Content Header */}
                        <div className="p-4 md:p-6 lg:p-8 border-b border-gray-100 flex-shrink-0 bg-white">
                            <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-800">
                                Select a time
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">
                                {selectedDateStr 
                                    ? `Available slots for ${selectedDateStr}` 
                                    : "Showing available slots for upcoming days"}
                            </p>
                        </div>

                        {/* Scrollable Slots Area */}
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                            {upcomingDates.length > 0 ? (
                                upcomingDates.map((item, index) => {
                                    const isSelectedDate = selectedDateStr === item.dateStr;
                                    return (
                                        <div key={index} className={`p-3 md:p-4 ${isSelectedDate ? 'bg-orange-50 rounded-xl border border-orange-100' : ''}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="font-semibold text-gray-800 text-sm md:text-base lg:text-lg">
                                                    {item.dateStr}
                                                </h3>
                                                {isSelectedDate && <span className="bg-orange-100 text-orange-700 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold">Selected</span>}
                                            </div>

                                            {/* Tablet Optimization: Grid instead of Flex for cleaner alignment on medium screens */}
                                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap gap-2 md:gap-3">
                                                {item.slots.map((time, tIndex) => {
                                                    const isSelectedTime = selectedDateStr === item.dateStr && selectedTime === time;
                                                    return (
                                                        <button
                                                            key={tIndex}
                                                            onClick={() => {
                                                                if (selectedDateStr !== item.dateStr) setSelectedDateStr(item.dateStr);
                                                                setSelectedTime(time);
                                                            }}
                                                            className={`px-2 py-2 md:px-3 md:py-2 rounded-lg md:rounded-full text-xs md:text-sm font-medium transition-all duration-200 
                                                                ${isSelectedTime
                                                                    ? "bg-orange-600 text-white shadow-md transform scale-105"
                                                                    : "border border-orange-600 text-gray-800 hover:text-white hover:bg-orange-600 hover:shadow-md"
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <i className="bi bi-calendar-x text-2xl"></i>
                                    </div>
                                    <p className="text-sm md:text-base text-center px-4">No available slots found for this month.</p>
                                    <button onClick={() => changeMonth(1)} className="mt-4 text-orange-600 font-semibold hover:underline text-sm">Check next month</button>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none z-20">
                            
                            {/* Selected Info */}
                            <div className="w-full md:w-auto text-sm text-gray-500 mb-2 md:mb-0 md:mr-auto text-center md:text-left">
                                {selectedDateStr && selectedTime ? (
                                    <div className="flex flex-row md:flex-col items-center md:items-start justify-center gap-2 md:gap-0">
                                        <span className="text-gray-500 font-medium hidden md:inline">Selected:</span>
                                        <span className="text-gray-900 font-bold">
                                            {selectedDateStr} <span className="md:hidden text-gray-400 font-normal mx-1">at</span> 
                                            <span className="hidden md:inline font-normal text-gray-400 mx-1">at</span> 
                                            {selectedTime}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="hidden md:inline">No time selected</span>
                                )}
                            </div>

                            <div className="flex w-full md:w-auto gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBookAppointment}
                                    disabled={!selectedDateStr || !selectedTime}
                                    className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20 transition-all text-sm md:text-base whitespace-nowrap"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingModal;