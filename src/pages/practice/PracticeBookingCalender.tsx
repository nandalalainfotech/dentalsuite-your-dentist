import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, User, Trash2, Calendar as CalendarIcon, Check } from 'lucide-react';

// --- Types ---
interface Practitioner {
    id: string;
    name: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    practitionerId: string;
    type: 'break';
    startTime: Date;
    endTime: Date;
    notes?: string;
    color: string;
}

interface TimeSlot {
    hour: number;
    label: string;
}

// --- Mock Data ---
const PRACTITIONERS: Practitioner[] = [
    { id: 'p1', name: 'Dr. Surea' },
    { id: 'p2', name: 'Dr. Vishwa' },
];

const BREAK_COLORS = [
    { id: 'gray', value: '#6B7280', name: 'Gray', bg: 'bg-gray-100', lightBg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
    { id: 'blue', value: '#3B82F6', name: 'Blue', bg: 'bg-blue-100', lightBg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    { id: 'green', value: '#22C55E', name: 'Green', bg: 'bg-green-100', lightBg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    { id: 'purple', value: '#A855F7', name: 'Purple', bg: 'bg-purple-100', lightBg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    { id: 'red', value: '#EF4444', name: 'Red', bg: 'bg-red-100', lightBg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
    { id: 'orange', value: '#F97316', name: 'Orange', bg: 'bg-orange-100', lightBg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
    { id: 'teal', value: '#14B8A6', name: 'Teal', bg: 'bg-teal-100', lightBg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
    { id: 'pink', value: '#EC4899', name: 'Pink', bg: 'bg-pink-100', lightBg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
];

// Duration options in minutes
const DURATION_OPTIONS = [
    { value: 15, label: '15 mins' },
    { value: 30, label: '30 mins' },
    { value: 45, label: '45 mins' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
];

const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'Lunch Break',
        practitionerId: 'p1',
        type: 'break',
        startTime: new Date(new Date().setHours(12, 0, 0, 0)),
        endTime: new Date(new Date().setHours(13, 0, 0, 0)),
        notes: 'Office closed for lunch',
        color: '#6B7280'
    },
    {
        id: '2',
        title: 'Meeting',
        practitionerId: 'p2',
        type: 'break',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(15, 0, 0, 0)),
        notes: 'Staff meeting',
        color: '#3B82F6'
    }
];

// --- Helpers ---

const START_HOUR = 8;
const END_HOUR = 18;

const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
        const ampm = i >= 12 ? 'PM' : 'AM';
        const hourDisplay = i % 12 || 12;
        slots.push({ hour: i, label: `${hourDisplay} ${ampm}` });
    }
    return slots;
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

const toTimeString = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const setTimeOnDate = (dateBase: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(dateBase);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

const addMinutesToTimeString = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);
    const startTotal = startHours * 60 + startMins;
    const endTotal = endHours * 60 + endMins;
    return endTotal - startTotal;
};

const getColorConfig = (colorValue: string) => {
    return BREAK_COLORS.find(c => c.value === colorValue) || BREAK_COLORS[0];
};

// --- Custom Hook for Screen Size ---
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: false,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isLaptop: width >= 1024 && width < 1280,
                isDesktop: width >= 1280,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};

// --- Time Picker Component with Duration Options ---
interface TimePickerProps {
    startTime: string;
    endTime: string;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ 
    startTime, 
    endTime, 
    onStartTimeChange, 
    onEndTimeChange 
}) => {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

    // Calculate current duration and check if it matches any option
    const currentDuration = calculateDuration(startTime, endTime);
    const matchingDuration = DURATION_OPTIONS.find(d => d.value === currentDuration);

    // Handle duration button click
    const handleDurationClick = (minutes: number) => {
        setSelectedDuration(minutes);
        const newEndTime = addMinutesToTimeString(startTime, minutes);
        onEndTimeChange(newEndTime);
    };

    // Update end time when start time changes (if a duration is selected)
    const handleStartTimeChange = (newStartTime: string) => {
        onStartTimeChange(newStartTime);
        if (selectedDuration) {
            const newEndTime = addMinutesToTimeString(newStartTime, selectedDuration);
            onEndTimeChange(newEndTime);
        }
    };

    // Clear selected duration when end time is manually changed
    const handleEndTimeChange = (newEndTime: string) => {
        onEndTimeChange(newEndTime);
        const newDuration = calculateDuration(startTime, newEndTime);
        const matching = DURATION_OPTIONS.find(d => d.value === newDuration);
        setSelectedDuration(matching ? matching.value : null);
    };

    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Select Time
            </label>
            
            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => handleStartTimeChange(e.target.value)}
                            className="w-auto pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <div className="relative">
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => handleEndTimeChange(e.target.value)}
                            className="w-auto pl-4 pr-3 py-2 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Duration Display */}
            {currentDuration > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">Duration:</span>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-semibold">
                        {currentDuration >= 60 
                            ? `${Math.floor(currentDuration / 60)}h ${currentDuration % 60 > 0 ? `${currentDuration % 60}m` : ''}`
                            : `${currentDuration} mins`
                        }
                    </span>
                </div>
            )}

            {/* Quick Duration Options */}
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((duration) => {
                        const isSelected = selectedDuration === duration.value || 
                            (matchingDuration?.value === duration.value && !selectedDuration);
                        
                        return (
                            <button
                                key={duration.value}
                                type="button"
                                onClick={() => handleDurationClick(duration.value)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                    }
                                `}
                            >
                                {duration.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Color Picker Component ---
interface ColorPickerProps {
    selectedColor: string;
    onColorSelect: (color: string) => void;
    title: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Select Color
            </label>

            {/* Color Grid */}
           <div className="flex flex-wrap gap-2">
                {BREAK_COLORS.map((color) => {
                    const isSelected = selectedColor === color.value;
                    return (
                        <button
                            key={color.id}
                            type="button"
                            onClick={() => onColorSelect(color.value)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
                                ${isSelected 
                                    ? 'border-gray-800 bg-gray-50 shadow-sm' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div 
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: color.value }}
                            />
                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                                {color.name}
                            </span>
                            {isSelected && <Check size={12} className="text-gray-800" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Modal Component ---

interface EventFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (id: string) => void;
    initialData: Partial<CalendarEvent> | null;
    selectedDate: Date;
}

const EventModal: React.FC<EventFormProps> = ({ isOpen, onClose, onSave, onDelete, initialData, selectedDate }) => {
    const isEditMode = !!initialData?.id;
    
    const [title, setTitle] = useState(initialData?.title || 'Break');
    const [practitionerId, setPractitionerId] = useState(initialData?.practitionerId || PRACTITIONERS[0].id);
    const [selectedColor, setSelectedColor] = useState(initialData?.color || BREAK_COLORS[0].value);

    const defaultStart = initialData?.startTime ? toTimeString(initialData.startTime) : "09:00";
    const defaultEnd = initialData?.endTime ? toTimeString(initialData.endTime) : "09:30";

    const [startTimeStr, setStartTimeStr] = useState(defaultStart);
    const [endTimeStr, setEndTimeStr] = useState(defaultEnd);
    const [notes, setNotes] = useState(initialData?.notes || '');

    React.useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || 'Break');
            setPractitionerId(initialData?.practitionerId || PRACTITIONERS[0].id);
            setSelectedColor(initialData?.color || BREAK_COLORS[0].value);
            setStartTimeStr(initialData?.startTime ? toTimeString(initialData.startTime) : "09:00");
            setEndTimeStr(initialData?.endTime ? toTimeString(initialData.endTime) : "09:30");
            setNotes(initialData?.notes || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = setTimeOnDate(selectedDate, startTimeStr);
        const end = setTimeOnDate(selectedDate, endTimeStr);

        if (end <= start) return alert("End time must be after start time");

        onSave({
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            title: title || 'Break',
            practitionerId,
            type: 'break',
            startTime: start,
            endTime: end,
            notes,
            color: selectedColor
        });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-100 sticky top-0 z-10">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{isEditMode ? 'Edit Break' : 'New Break'}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* Break Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Break Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Lunch Break, Meeting..."
                            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>

                    {/* Select Practitioner */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Select Practitioner
                        </label>
                        <select
                            value={practitionerId}
                            onChange={(e) => setPractitionerId(e.target.value)}
                            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                            {PRACTITIONERS.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Picker with Duration Options */}
                    <TimePicker
                        startTime={startTimeStr}
                        endTime={endTimeStr}
                        onStartTimeChange={setStartTimeStr}
                        onEndTimeChange={setEndTimeStr}
                    />

                    {/* Comment Section */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Comment
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes..."
                            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                    </div>

                    {/* Color Picker Component */}
                    <ColorPicker
                        selectedColor={selectedColor}
                        onColorSelect={setSelectedColor}
                        title={title}
                    />

                    {/* Action Buttons - Removed icons from Save/Update */}
                    <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => { onDelete(initialData!.id!); onClose(); }}
                                className="p-2 sm:p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition-all text-sm"
                        >
                            {isEditMode ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Calendar Component ---

const PracticeBookingCalender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
    const [selectedDayForModal, setSelectedDayForModal] = useState<Date>(new Date());
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    
    const { isMobile, isTablet } = useScreenSize();

    // Responsive cell height
    const CELL_HEIGHT = isMobile ? 80 : isTablet ? 100 : 120;
    const MINUTE_HEIGHT = CELL_HEIGHT / 60;

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
    const timeSlots = useMemo(() => generateTimeSlots(), []);
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i)), [startOfWeek]);

    // For mobile: show only selected day, for others: show week
    const visibleDays = isMobile ? [weekDays[selectedDayIndex]] : weekDays;

    const handlePrevWeek = () => {
        if (isMobile) {
            if (selectedDayIndex === 0) {
                setCurrentDate(addDays(currentDate, -7));
                setSelectedDayIndex(6);
            } else {
                setSelectedDayIndex(selectedDayIndex - 1);
            }
        } else {
            setCurrentDate(addDays(currentDate, -7));
        }
    };

    const handleNextWeek = () => {
        if (isMobile) {
            if (selectedDayIndex === 6) {
                setCurrentDate(addDays(currentDate, 7));
                setSelectedDayIndex(0);
            } else {
                setSelectedDayIndex(selectedDayIndex + 1);
            }
        } else {
            setCurrentDate(addDays(currentDate, 7));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        const today = new Date();
        const startWeek = getStartOfWeek(today);
        const dayIndex = Math.floor((today.getTime() - startWeek.getTime()) / (1000 * 60 * 60 * 24));
        setSelectedDayIndex(Math.max(0, Math.min(6, dayIndex)));
    };

    const handleSlotClick = (day: Date, hour: number, minutes: number) => {
        const clickedTime = new Date(day);
        clickedTime.setHours(hour, minutes, 0, 0);
        const endTime = new Date(clickedTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        setEditingEvent({ 
            startTime: clickedTime, 
            endTime: endTime,
            type: 'break', 
            practitionerId: PRACTITIONERS[0].id,
            color: BREAK_COLORS[0].value
        });
        setSelectedDayForModal(day);
        setIsModalOpen(true);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setEditingEvent(event);
        setSelectedDayForModal(event.startTime);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (savedEvent: CalendarEvent) => {
        setEvents(prev => {
            const exists = prev.find(e => e.id === savedEvent.id);
            return exists ? prev.map(e => e.id === savedEvent.id ? savedEvent : e) : [...prev, savedEvent];
        });
    };

    const handleDeleteEvent = (id: string) => {
        if (window.confirm("Delete this break?")) {
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };

    // Time column width responsive
    const timeColumnWidth = isMobile ? 'w-14' : 'w-20';

    return (
        <div className="flex flex-col h-screen bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200 shadow-sm overflow-hidden font-sans">

            {/* --- Header --- */}
            <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-white border-b border-gray-400">
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <CalendarIcon className="text-orange-500 hidden sm:block" size={isMobile ? 20 : 28} />
                        <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight">
                            {isMobile 
                                ? weekDays[selectedDayIndex].toLocaleDateString('default', { month: 'short', day: 'numeric' })
                                : `${startOfWeek.toLocaleString('default', { month: 'long' })} ${startOfWeek.getFullYear()}`
                            }
                        </h2>
                    </div>

                    <div className="flex items-center rounded-lg border border-gray-400 p-0.5">
                        <button onClick={handlePrevWeek} className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                            <ChevronLeft size={isMobile ? 16 : 20} />
                        </button>
                        <button onClick={handleNextWeek} className="p-1 sm:p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                            <ChevronRight size={isMobile ? 16 : 20} />
                        </button>
                    </div>
                </div>

                <button onClick={handleToday} className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg sm:rounded-xl transition-colors border border-orange-200">
                    Today
                </button>
            </div>

            {/* Mobile Day Selector */}
            {isMobile && (
                <div className="flex overflow-x-auto py-2 px-2 bg-gray-50 border-b border-gray-200 gap-1">
                    {weekDays.map((day, index) => {
                        const isToday = isSameDay(day, new Date());
                        const isSelected = index === selectedDayIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDayIndex(index)}
                                className={`flex-shrink-0 flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                                    isSelected 
                                        ? 'bg-orange-500 text-white shadow-md' 
                                        : isToday 
                                            ? 'bg-orange-100 text-orange-600' 
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-[10px] font-medium uppercase">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-sm font-bold">{day.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* --- Calendar Grid with Scroll --- */}
            <div className="flex-1 overflow-auto relative" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9' }}>
                <style>{`
                    .calendar-container::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    .calendar-container::-webkit-scrollbar-track {
                        background: #F1F5F9;
                        border-radius: 4px;
                    }
                    .calendar-container::-webkit-scrollbar-thumb {
                        background: #94A3B8;
                        border-radius: 4px;
                    }
                    .calendar-container::-webkit-scrollbar-thumb:hover {
                        background: #64748B;
                    }
                    .calendar-container::-webkit-scrollbar-corner {
                        background: #F1F5F9;
                    }
                `}</style>
                <div className={`${isMobile ? 'min-w-full' : 'min-w-[800px] lg:min-w-[1000px]'} pb-6 sm:pb-10 calendar-container`}>

                    {/* Day Headers - Hidden on mobile since we have the day selector */}
                    {!isMobile && (
                        <div className="flex border-b border-gray-400 sticky top-0 bg-white z-20">
                            <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white`}></div>
                            {visibleDays.map((day, index) => {
                                const isToday = isSameDay(day, new Date());
                                return (
                                    <div key={index} className="flex-1 py-2 sm:py-3 lg:py-4 text-center border-r border-gray-400 last:border-r-0">
                                        <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">
                                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className="flex justify-center">
                                            <div className={`text-base sm:text-lg lg:text-xl font-bold w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full transition-colors ${
                                                isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-800'
                                            }`}>
                                                {day.getDate()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Grid Body */}
                    <div className="flex relative">

                        {/* Time Column */}
                        <div className={`${timeColumnWidth} flex-shrink-0 border-r border-gray-400 bg-white z-10`}>
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot.hour}
                                    className="relative text-[10px] sm:text-[11px] font-medium text-gray-400 text-right pr-2 sm:pr-4 flex items-start justify-end"
                                    style={{ height: `${CELL_HEIGHT}px` }}
                                >
                                    <span className="mt-[6px] sm:mt-[8px]">{slot.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {visibleDays.map((day, dayIndex) => {
                            const dayEvents = events.filter(e => isSameDay(e.startTime, day));

                            return (
                                <div key={dayIndex} className="flex-1 relative border-r border-gray-400 last:border-r-0">

                                    {/* Grid Lines */}
                                    {timeSlots.map((slot) => (
                                        <div key={slot.hour} className="relative w-full border-t border-gray-400" style={{ height: `${CELL_HEIGHT}px` }}>
                                            {/* 15-minute intervals */}
                                            {[0, 15, 30, 45].map((minute) => (
                                                <div
                                                    key={minute}
                                                    onClick={() => handleSlotClick(day, slot.hour, minute)}
                                                    className={`w-full cursor-pointer border border-dashed hover:bg-gray-100 transition-colors ${
                                                        minute === 30 ? 'border-t border-gray-200 border-dashed' : ''
                                                    }`}
                                                    style={{ height: `${CELL_HEIGHT / 4}px` }}
                                                />
                                            ))}
                                        </div>
                                    ))}

                                    {/* Events - FIXED: Height now matches exact duration without minimum overflow */}
                                    {dayEvents.map((event) => {
                                        const startMinTotal = (event.startTime.getHours() - START_HOUR) * 60 + event.startTime.getMinutes();
                                        const durationMinutes = (event.endTime.getTime() - event.startTime.getTime()) / 60000;

                                        const top = startMinTotal * MINUTE_HEIGHT;
                                        // FIXED: Use exact duration height, only set minimum to prevent too small events
                                        const height = durationMinutes * MINUTE_HEIGHT;
                                        const colorConfig = getColorConfig(event.color);
                                        const practitioner = PRACTITIONERS.find(p => p.id === event.practitionerId);
                                        
                                        // Determine if this is a compact view (15 min or less)
                                        const isCompact = durationMinutes <= 15;
                                        // Determine if we can show practitioner info
                                        const showPractitioner = durationMinutes >= 45;

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                                className={`
                                                    absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-md sm:rounded-lg cursor-pointer
                                                    transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden
                                                    ${colorConfig.bg} ${colorConfig.text}
                                                    ${isCompact ? 'px-1.5 py-0.5 flex items-center gap-1' : 'px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 flex flex-col'}
                                                `}
                                                style={{ 
                                                    top: `${top}px`, 
                                                    height: `${height}px`,
                                                    border: '1px solid #374151',
                                                    borderLeftWidth: isMobile ? '3px' : '4px',
                                                    borderLeftColor: event.color
                                                }}
                                            >
                                                {isCompact ? (
                                                    // Compact layout for 15-min events - single line
                                                    <>
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate">
                                                            {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-[9px] sm:text-[10px] font-bold truncate flex-1">
                                                            {event.title}
                                                        </span>
                                                    </>
                                                ) : (
                                                    // Regular layout for longer events
                                                    <>
                                                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                                            <div 
                                                                className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: event.color }}
                                                            ></div>
                                                            <span className="text-[10px] sm:text-xs font-bold truncate">
                                                                {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>

                                                        <div className="text-xs sm:text-sm font-bold leading-tight mb-0.5 sm:mb-1 truncate">
                                                            {event.title}
                                                        </div>

                                                        {practitioner && showPractitioner && (
                                                            <div className="flex items-center gap-1 sm:gap-1.5 mt-auto">
                                                                <User size={isMobile ? 8 : 10} style={{ color: event.color }} />
                                                                <span className="text-[9px] sm:text-[10px] font-medium truncate opacity-80">
                                                                    {practitioner.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                initialData={editingEvent}
                selectedDate={selectedDayForModal}
            />
        </div>
    );
};

export default PracticeBookingCalender;