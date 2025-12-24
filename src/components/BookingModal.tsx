import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Clinic, Dentist } from "../services/ClinicService";

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

    // --- State ---
    const [selectedService, setSelectedService] = useState("dentistry");
    const [selectedPractitioner, setSelectedPractitioner] = useState(
        selectedDentistId || ""
    );

    const [selectedDateStr, setSelectedDateStr] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [viewDate, setViewDate] = useState(new Date());

    const [upcomingDates, setUpcomingDates] = useState<
        { date: Date; dateStr: string; slots: string[] }[]
    >([]);


    useEffect(() => {
        if (isOpen && clinic?.dentists && clinic.dentists.length > 0) {
            if (selectedDentistId) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedPractitioner(selectedDentistId);
            } else if (!selectedPractitioner) {
                setSelectedPractitioner(clinic.dentists[0].id);
            }
            setViewDate(new Date());
            setSelectedDateStr("");
            setSelectedTime("");
        }
    }, [isOpen, clinic, selectedDentistId, selectedPractitioner]);

    useEffect(() => {
        if (selectedPractitioner) {
            const dentist = clinic?.dentists?.find(
                (d: Dentist) => d.id === selectedPractitioner
            );
            if (!dentist) return;

            const dates: { date: Date; dateStr: string; slots: string[] }[] = [];

            const startCalculationDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
            const today = new Date();
            if (startCalculationDate.getMonth() === today.getMonth() && startCalculationDate.getFullYear() === today.getFullYear()) {
                startCalculationDate.setDate(today.getDate());
            }

            let daysChecked = 0;
            let validDaysFound = 0;

            while (validDaysFound < 5 && daysChecked < 45) {
                const currentDate = new Date(startCalculationDate);
                currentDate.setDate(startCalculationDate.getDate() + daysChecked);
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUpcomingDates(dates);
        }
    }, [selectedPractitioner, clinic?.dentists, viewDate]);

    // --- Handlers ---
    const handleBookAppointment = () => {
        if (!selectedDateStr || !selectedTime) return;

        // Convert selectedDateStr to ISO format for navigation
        const dateObj = new Date(selectedDateStr);
        const isoDate = dateObj.toISOString().split('T')[0];

        // Navigate to booking flow with date, time, and service
        navigate(`/booking/${selectedPractitioner}`, {
            state: {
                date: isoDate,
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

        const currentDentist = clinic?.dentists?.find(d => d.id === selectedPractitioner);

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
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

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
                    onClick={() => {
                        setSelectedDateStr(dateString);
                        setSelectedTime("");
                    }}
                    className={buttonClass}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity" onClick={onClose}></div>

            {/* Modal Container - Full screen on Mobile, Centered on Desktop */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center sm:p-4 md:p-6">

                {/* Main Box */}
                <div className="bg-white w-half h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="w-full md:w-[350px] lg:w-[400px] bg-gray-50 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 shrink-0">

                        {/* Mobile Header (Close Button logic shifted here for mobile) */}
                        <div className="flex md:hidden justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                                {clinic?.name}
                            </h2>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Scrollable Sidebar Content */}
                        <div className="p-6 overflow-y-auto max-h-[40vh] md:max-h-full md:h-full">

                            {/* Desktop Title */}
                            <h2 className="hidden md:block text-xl font-bold text-gray-900 mb-6 leading-tight">
                                {clinic?.name || "Dental Clinic"}
                            </h2>

                            {/* Calendar Widget */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-700 font-semibold text-lg">
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
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 appearance-none cursor-pointer"
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
                                            onChange={(e) => setSelectedPractitioner(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 appearance-none cursor-pointer"
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

                    {/* --- RIGHT CONTENT (Slots) --- */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden relative min-h-0">

                        {/* Desktop Close Button */}
                        <button
                            onClick={onClose}
                            className="hidden md:block absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Content Header */}
                        <div className="p-4 md:p-8 border-b border-gray-100 flex-shrink-0 bg-white">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Select a time
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Available slots for next 5 days
                            </p>
                        </div>

                        {/* Scrollable Slots Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
                            {upcomingDates.length > 0 ? (
                                upcomingDates.map((item, index) => {
                                    const isSelectedDate = selectedDateStr === item.dateStr;
                                    return (
                                        <div key={index} className={`rounded-xl border ${isSelectedDate ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'} p-3 md:p-4 transition-colors`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="font-semibold text-gray-800 text-sm md:text-lg">
                                                    {item.dateStr}
                                                </h3>
                                                {isSelectedDate && <span className="bg-orange-100 text-orange-700 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold">Selected</span>}
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap gap-2 md:gap-3">
                                                {item.slots.map((time, tIndex) => {
                                                    const isSelectedTime = selectedDateStr === item.dateStr && selectedTime === time;
                                                    return (
                                                        <button
                                                            key={tIndex}
                                                            onClick={() => {
                                                                setSelectedDateStr(item.dateStr);
                                                                setSelectedTime(time);
                                                            }}
                                                            className={`px-2 md:px-4 py-2 rounded-lg md:rounded-full text-xs md:text-sm font-medium transition-all duration-200 
                                                  ${isSelectedTime
                                                                    ? "bg-orange-600 text-white shadow-md scale-105"
                                                                    : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
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
                        <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex justify-between items-center gap-3 md:gap-4 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none z-20">
                            <div className="hidden sm:block text-sm text-gray-500 mr-auto">
                                {selectedDateStr && selectedTime ? (
                                    <span>Selected: <strong className="text-gray-800">{selectedDateStr}</strong> at <strong className="text-gray-800">{selectedTime}</strong></span>
                                ) : (
                                    <span>No time selected</span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition text-sm md:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                disabled={!selectedDateStr || !selectedTime}
                                className="flex-1 sm:flex-none px-4 md:px-8 py-3 md:py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20 transition-all text-sm md:text-base whitespace-nowrap"
                            >
                                Confirm Booking
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingModal;