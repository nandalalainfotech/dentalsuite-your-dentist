/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, User, Trash2, Save, Calendar as CalendarIcon } from 'lucide-react';

// --- Types ---
type EventType = 'appointment' | 'break';

interface Practitioner {
    id: string;
    name: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    practitionerId: string;
    type: EventType;
    startTime: Date;
    endTime: Date;
    notes?: string;
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

const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'John Doe',
        practitionerId: 'p1',
        type: 'appointment',
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(10, 0, 0, 0)),
        notes: 'Routine checkup'
    },
    {
        id: '2',
        title: 'Lunch',
        practitionerId: 'p1',
        type: 'break',
        startTime: new Date(new Date().setHours(13, 0, 0, 0)),
        endTime: new Date(new Date().setHours(14, 0, 0, 0)),
        notes: 'Office closed'
    }
];

// --- Helpers ---

const START_HOUR = 8;
const END_HOUR = 18; // 6 PM
const CELL_HEIGHT = 120; // Taller cells to match image density
const MINUTE_HEIGHT = CELL_HEIGHT / 60;

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
    if (!isOpen) return null;

    const isEditMode = !!initialData?.id;
    const [title, setTitle] = useState(initialData?.title || '');
    const [practitionerId, setPractitionerId] = useState(initialData?.practitionerId || PRACTITIONERS[0].id);
    const [type, setType] = useState<EventType>(initialData?.type || 'appointment');

    const defaultStart = initialData?.startTime ? toTimeString(initialData.startTime) : "09:00";
    const defaultEnd = initialData?.endTime ? toTimeString(initialData.endTime) : "09:30";

    const [startTimeStr, setStartTimeStr] = useState(defaultStart);
    const [endTimeStr, setEndTimeStr] = useState(defaultEnd);
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = setTimeOnDate(selectedDate, startTimeStr);
        const end = setTimeOnDate(selectedDate, endTimeStr);

        if (end <= start) return alert("End time must be after start time");

        onSave({
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            title: type === 'break' ? (title || 'Break') : title,
            practitionerId,
            type,
            startTime: start,
            endTime: end,
            notes
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">{isEditMode ? 'Edit Booking' : 'New Booking'}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button type="button" onClick={() => setType('appointment')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'appointment' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>Appointment</button>
                        <button type="button" onClick={() => setType('break')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'break' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Break</button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Practitioner</label>
                        <select value={practitionerId} onChange={(e) => setPractitionerId(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
                            {PRACTITIONERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    {type === 'appointment' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Patient Name</label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Start</label>
                            <input type="time" value={startTimeStr} onChange={(e) => setStartTimeStr(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">End</label>
                            <input type="time" value={endTimeStr} onChange={(e) => setEndTimeStr(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
                        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:border-orange-500 focus:outline-none" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        {isEditMode && (
                            <button type="button" onClick={() => { onDelete(initialData!.id!); onClose(); }} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={20} /></button>
                        )}
                        <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition-all">
                            <Save size={18} /> {isEditMode ? 'Update' : 'Save'}
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

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
    const timeSlots = useMemo(() => generateTimeSlots(), []);
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i)), [startOfWeek]);

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const handleToday = () => setCurrentDate(new Date());

    const handleSlotClick = (day: Date, hour: number, minutes: number) => {
        const clickedTime = new Date(day);
        clickedTime.setHours(hour, minutes, 0, 0);
        setEditingEvent({ startTime: clickedTime, type: 'appointment', practitionerId: PRACTITIONERS[0].id });
        setSelectedDayForModal(day);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (savedEvent: CalendarEvent) => {
        setEvents(prev => {
            const exists = prev.find(e => e.id === savedEvent.id);
            return exists ? prev.map(e => e.id === savedEvent.id ? savedEvent : e) : [...prev, savedEvent];
        });
    };

    const handleDeleteEvent = (id: string) => {
        if (window.confirm("Delete booking?")) setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden font-sans">

            {/* --- Header (Matching Image) --- */}
            <div className="flex items-center justify-between px-8 py-6 bg-white">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="text-orange-500" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {startOfWeek.toLocaleString('default', { month: 'long' })} {startOfWeek.getFullYear()}
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center rounded-lg border border-gray-200 p-0.5 ml-2">
                        <button onClick={handlePrevWeek} className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="w-px h-5 bg-gray-200"></div>
                        <button onClick={handleNextWeek} className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-md transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <button onClick={handleToday} className="px-6 py-2 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                    Today
                </button>
            </div>

            {/* --- Calendar Grid --- */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar">
                <div className="min-w-[1000px] pb-10">

                    {/* Day Headers (Matching Image) */}
                    <div className="flex border-b border-gray-100 sticky top-0 bg-white z-20">
                        <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-white"></div> {/* Time Col Header */}
                        {weekDays.map((day, index) => {
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div key={index} className="flex-1 py-4 text-center border-r border-gray-100 last:border-r-0">
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className="flex justify-center">
                                        <div className={`text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-800'
                                            }`}>
                                            {day.getDate()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Body */}
                    <div className="flex relative">

                        {/* Time Column (Minimalist) */}
                        <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-white z-10 pt-4">
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot.hour}
                                    className="relative text-[11px] font-medium text-gray-400 text-right pr-4"
                                    style={{ height: `${CELL_HEIGHT}px` }}
                                >
                                    <span className="-translate-y-1/2 block tracking-tight">{slot.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {weekDays.map((day, dayIndex) => {
                            const dayEvents = events.filter(e => isSameDay(e.startTime, day));

                            return (
                                <div key={dayIndex} className="flex-1 relative border-r border-gray-100 last:border-r-0 pt-4">

                                    {/* Grid Lines (Subtle) */}
                                    {timeSlots.map((slot) => (
                                        <div key={slot.hour} className="relative w-full" style={{ height: `${CELL_HEIGHT}px` }}>
                                            {/* Top line aligned with time label */}
                                            <div className="absolute top-0 left-0 right-0 border-t border-gray-50 w-full" />

                                            {/* Interaction Zones (15 mins) */}
                                            {[0, 15, 30, 45].map((minute) => (
                                                <div
                                                    key={minute}
                                                    onClick={() => handleSlotClick(day, slot.hour, minute)}
                                                    className="h-1/4 w-full cursor-pointer hover:bg-gray-50/50 transition-colors"
                                                />
                                            ))}
                                        </div>
                                    ))}

                                    {/* Events */}
                                    {dayEvents.map((event) => {
                                        // Calculate position
                                        const startMinTotal = (event.startTime.getHours() - START_HOUR) * 60 + event.startTime.getMinutes();
                                        const durationMinutes = (event.endTime.getTime() - event.startTime.getTime()) / 60000;

                                        const top = startMinTotal * MINUTE_HEIGHT;
                                        const height = Math.max(durationMinutes * MINUTE_HEIGHT, 40); // Min height
                                        const isBreak = event.type === 'break';
                                        const practitioner = PRACTITIONERS.find(p => p.id === event.practitionerId);

                                        function handleEventClick(event: CalendarEvent) {
                                            throw new Error('Function not implemented.');
                                        }

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                                className={`
                          absolute left-1 right-1 rounded-lg px-3 py-2 border cursor-pointer
                          transition-all hover:brightness-95 hover:z-30 z-10 overflow-hidden flex flex-col
                          ${isBreak
                                                        ? 'bg-gray-100 border-gray-200 text-gray-600'
                                                        : 'bg-orange-50 border-orange-200 text-gray-900' // Matches Image "Light Orange"
                                                    }
                        `}
                                                style={{ top: `${top}px`, height: `${height}px`, marginTop: '16px' /* Offset for grid padding */ }}
                                            >
                                                {/* Event Content matching image style */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isBreak ? 'bg-gray-400' : 'bg-orange-500'}`}></div>
                                                    <span className={`text-xs font-bold ${isBreak ? 'text-gray-500' : 'text-orange-900'}`}>
                                                        {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isBreak ? '' : ' AM'} {/* Image shows AM */}
                                                    </span>
                                                </div>

                                                <div className="text-sm font-bold leading-tight mb-1 truncate">
                                                    {event.title}
                                                </div>

                                                {!isBreak && practitioner && (
                                                    <div className="flex items-center gap-1.5 mt-auto">
                                                        <User size={10} className="text-orange-400" />
                                                        <span className="text-[10px] text-orange-600/80 font-medium truncate">
                                                            {practitioner.name}
                                                        </span>
                                                    </div>
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