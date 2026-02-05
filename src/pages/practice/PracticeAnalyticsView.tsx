import { useState, useMemo } from 'react';
import {
  Printer,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  UserPlus
} from 'lucide-react';

// --- MOCK DATABASE ---
const MOCK_DB = [
  {
    id: 1, date: '2026-01-15', doctor: 'Dr. Emma Watson', type: 'New', source: 'Mobile',
    patient: 'John Doe', time: '09:00', status: 'Completed'
  },
  {
    id: 2, date: '2026-01-16', doctor: 'Dr. Emma Watson', type: 'Existing', source: 'Web',
    patient: 'Jane Smith', time: '10:30', status: 'Completed'
  },
  {
    id: 3, date: '2026-01-20', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Mobile',
    patient: 'Bob Wilson', time: '11:00', status: 'Completed'
  },
  {
    id: 4, date: '2026-01-24', doctor: 'Dr. Emma Watson', type: 'New', source: 'Web',
    patient: 'Alice Brown', time: '14:00', status: 'Scheduled'
  },
  {
    id: 5, date: '2026-01-25', doctor: 'Dr. Sarah Smith', type: 'Existing', source: 'Mobile',
    patient: 'Charlie Davis', time: '15:30', status: 'Scheduled'
  },
  {
    id: 6, date: '2026-01-28', doctor: 'Dr. Emma Watson', type: 'Existing', source: 'Web',
    patient: 'Eva Martinez', time: '09:30', status: 'Scheduled'
  },
  {
    id: 7, date: '2026-02-01', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Mobile',
    patient: 'Frank Lee', time: '10:00', status: 'Scheduled'
  },
  {
    id: 8, date: '2026-02-02', doctor: 'Dr. Emma Watson', type: 'New', source: 'Mobile',
    patient: 'Grace Kim', time: '11:30', status: 'Scheduled'
  },
  {
    id: 9, date: '2026-01-17', doctor: 'Dr. Mike Johnson', type: 'New', source: 'Web',
    patient: 'Henry Chen', time: '13:00', status: 'Completed'
  },
  {
    id: 10, date: '2026-01-22', doctor: 'Dr. Mike Johnson', type: 'Existing', source: 'Mobile',
    patient: 'Ivy Patel', time: '16:00', status: 'Cancelled'
  },
  {
    id: 11, date: '2026-01-18', doctor: 'Dr. Mike Johnson', type: 'New', source: 'Mobile',
    patient: 'Jack Brown', time: '10:00', status: 'Completed'
  },
  {
    id: 12, date: '2026-01-19', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Web',
    patient: 'Kate Wilson', time: '14:30', status: 'Completed'
  },
];

// Doctor colors for consistent visualization
const DOCTOR_COLORS: Record<string, string> = {
  'Dr. Emma Watson': '#f97316',
  'Dr. Sarah Smith': '#3b82f6',
  'Dr. Mike Johnson': '#10b981',
  'Default': '#8b5cf6'
};

// --- HELPER FUNCTIONS ---
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const formatDisplayDate = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDaysArray = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// --- COMPONENTS ---

// Quick Date Presets
const DatePresets = ({ onSelect, active }: { onSelect: (preset: string) => void, active: string }) => {
  const presets = ['Today', 'This Week', 'This Month', 'Last 30 Days', 'Custom'];

  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map(preset => (
        <button
          key={preset}
          onClick={() => onSelect(preset)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === preset
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {preset}
        </button>
      ))}
    </div>
  );
};

// Custom Date Range Picker
const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  onClose
}: {
  startDate: Date,
  endDate: Date,
  onChange: (s: Date, e: Date) => void,
  onClose: () => void
}) => {
  const [currentMonth, setCurrentMonth] = useState(startDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startDate.getFullYear());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (selecting === 'start') {
      onChange(clickedDate, clickedDate);
      setSelecting('end');
    } else {
      if (clickedDate >= startDate) {
        onChange(startDate, clickedDate);
      } else {
        onChange(clickedDate, startDate);
      }
      setSelecting('start');
    }
  };

  const selectThisMonth = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    onChange(monthStart, monthEnd);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="absolute top-12 left-0 bg-white shadow-2xl border border-gray-200 rounded-xl p-5 z-50 w-[340px]">
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>

        <div className="flex items-center gap-1">
          <button className="px-2 py-1.5 font-bold text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
      >
        <X size={16} />
      </button>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mt-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <span key={d} className="text-gray-400 text-xs font-medium py-2">{d}</span>
        ))}
        {days.map((day, idx) => {
          if (!day) return <span key={idx} />;

          const current = new Date(currentYear, currentMonth, day);
          const isInRange = current >= startDate && current <= endDate;
          const isStart = current.getTime() === startDate.getTime();
          const isEnd = current.getTime() === endDate.getTime();
          const isToday = current.toDateString() === new Date().toDateString();

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`p-2 rounded-lg text-sm transition-all font-medium relative
                ${isInRange && !isStart && !isEnd ? 'bg-orange-100 text-orange-700' : ''} 
                ${isStart || isEnd ? 'bg-orange-500 text-white shadow-md' : 'hover:bg-gray-100'}
                ${isToday && !isStart && !isEnd ? 'ring-2 ring-orange-300' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
        <button
          onClick={selectThisMonth}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Select Entire Month
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// Stat Card with Trend
const StatCard = ({
  label,
  value,
  color = 'orange'
}: {
  label: string;
  value: number;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}) => {
  const colors = {
    orange: 'bg-orange-50 border-orange-100 text-orange-500',
    blue: 'bg-blue-50 border-blue-100 text-blue-500',
    green: 'bg-green-50 border-green-100 text-green-500',
    purple: 'bg-purple-50 border-purple-100 text-purple-500',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-center items-start mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <h3 className="text-gray-700 font-medium text-base">{label}</h3>
        </div>
      </div>
      <p className="text-5xl text-center font-semibold text-gray-800">{value}</p>
    </div>
  );
};
  
// Enhanced Bar Chart
const EnhancedBarChart = ({
  title,
  subtitle,
  data
}: {
  title: string;
  subtitle: string;
  data: { label: string; value: number }[];
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <BarChart3 size={18} className="text-orange-500" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p className="text-sm">No data available for selected period</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const widthPercentage = (item.value / maxVal) * 100;
            return (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-black via-orange-500 to-black rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Line/Area Chart
const TrendChart = ({ dailyData }: { dailyData: { date: string; count: number }[] }) => {
  const maxVal = Math.max(...dailyData.map(d => d.count), 1);
  const total = dailyData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-800 font-bold text-lg">Appointment Trend</h3>
          <p className="text-gray-500 text-sm mt-1">Daily appointments over selected period</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <Activity size={18} className="text-orange-500" />
          </div>
        </div>
      </div>

      <div className="relative h-40">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border-b border-gray-100" />
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 -ml-8">
          <span>{maxVal}</span>
          <span>{Math.round(maxVal / 2)}</span>
          <span>0</span>
        </div>

        <div className="absolute inset-0 flex items-end gap-1 pl-2">
          {dailyData.map((day, idx) => {
            const height = (day.count / maxVal) * 100;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col justify-end h-full group relative"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap shadow-lg transition-opacity">
                  <p className="font-semibold">{day.date}</p>
                  <p>{day.count} appointments</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>

                <div
                  className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600 cursor-pointer relative"
                  style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                >
                  {day.count > 0 && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-orange-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <span>{dailyData[0]?.date?.slice(5)}</span>
        <span>{dailyData[Math.floor(dailyData.length / 2)]?.date?.slice(5)}</span>
        <span>{dailyData[dailyData.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
};

// Donut Chart
const DonutChart = ({
  data,
  title,
  subtitle
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
  subtitle: string;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const segments = data.map(item => {
    const percent = total === 0 ? 0 : (item.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return { ...item, percent, start, end: cumulativePercent };
  });

  const gradient = segments
    .map(seg => `${seg.color} ${seg.start}% ${seg.end}%`)
    .join(', ');

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <PieChartIcon size={18} className="text-orange-500" />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative">
          <div
            className="w-40 h-40 rounded-full transition-all duration-700"
            style={{
              background: total === 0
                ? '#e5e7eb'
                : `conic-gradient(${gradient})`
            }}
          >
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-800">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// New Patient by Doctor Chart Component
const NewPatientsByDoctorChart = ({
  data,
  selectedDoctor
}: {
  data: { label: string; value: number; color: string }[];
  selectedDoctor: string;
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-800 font-bold text-lg">New Patient Appointments by Doctor</h3>
          <p className="text-gray-500 text-sm mt-1">
            {selectedDoctor === 'All'
              ? 'New patient bookings across all doctors'
              : `New patient bookings for ${selectedDoctor}`}
          </p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <UserPlus size={18} className="text-green-500" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <UserPlus size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No new patient appointments for selected period</p>
          </div>
        </div>
      ) : (
        <>
         {/* Bar Chart */}
          <div className="space-y-4">
            {data.map((item, index) => {
              const widthPercentage = (item.value / maxVal) * 100;
              const isSelected = selectedDoctor !== 'All' && item.label === selectedDoctor;

              return (
                <div key={index} className={`group p-3 rounded-lg transition-all ${isSelected ? 'bg-green-50 ring-2 ring-green-200' : 'hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      {isSelected && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Selected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">{item.value}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${widthPercentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Filter Dropdown
const FilterDropdown = ({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors bg-white"
      >
        <span className="text-gray-700">{label}:</span>
        <span className="font-medium text-gray-700">{value}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
          {options.map(option => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${value === option ? 'text-orange-600 font-medium' : 'text-gray-700'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function PracticeAnalyticsView() {
  const [dateRange, setDateRange] = useState({
    start: new Date(2026, 0, 14),
    end: new Date(2026, 0, 29)
  });
  const [activePreset, setActivePreset] = useState('Custom');
  const [showCalendar, setShowCalendar] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  const doctors = ['All', ...new Set(MOCK_DB.map(d => d.doctor))];
  const sources = ['All', 'Mobile', 'Web'];

  const handlePresetSelect = (preset: string) => {
    setActivePreset(preset);
    const today = new Date(2026, 0, 20);

    switch (preset) {
      case 'Today':
        setDateRange({ start: today, end: today });
        break;
      case 'This Week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setDateRange({ start: weekStart, end: weekEnd });
        break;
      case 'This Month':
        setDateRange({
          start: new Date(2026, 0, 1),
          end: new Date(2026, 0, 31)
        });
        break;
      case 'Last 30 Days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateRange({ start: thirtyDaysAgo, end: today });
        break;
      case 'Custom':
        setShowCalendar(true);
        break;
    }
  };

  const analyticsData = useMemo(() => {
    let filtered = MOCK_DB.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });

    if (doctorFilter !== 'All') {
      filtered = filtered.filter(i => i.doctor === doctorFilter);
    }
    if (sourceFilter !== 'All') {
      filtered = filtered.filter(i => i.source === sourceFilter);
    }

    const stats = {
      total: filtered.length,
      new: filtered.filter(i => i.type === 'New').length,
      existing: filtered.filter(i => i.type === 'Existing').length,
      mobile: filtered.filter(i => i.source === 'Mobile').length,
      web: filtered.filter(i => i.source === 'Web').length,
      completed: filtered.filter(i => i.status === 'Completed').length,
    };

    // Doctor data for bar chart
    const doctorMap: Record<string, number> = {};
    filtered.forEach(appt => {
      doctorMap[appt.doctor] = (doctorMap[appt.doctor] || 0) + 1;
    });
    const docData = Object.entries(doctorMap).map(([label, value]) => ({ label, value }));

    // NEW: New patients by doctor data
    const newPatientsByDoctor: Record<string, number> = {};

    // If a specific doctor is selected, only show that doctor
    // Otherwise, show all doctors
    const newPatientAppts = MOCK_DB.filter(item => {
      const itemDate = new Date(item.date);
      const inDateRange = itemDate >= dateRange.start && itemDate <= dateRange.end;
      const isNewPatient = item.type === 'New';
      const matchesSource = sourceFilter === 'All' || item.source === sourceFilter;
      return inDateRange && isNewPatient && matchesSource;
    });

    newPatientAppts.forEach(appt => {
      newPatientsByDoctor[appt.doctor] = (newPatientsByDoctor[appt.doctor] || 0) + 1;
    });

    const newPatientsDoctorData = Object.entries(newPatientsByDoctor)
      .map(([label, value]) => ({
        label,
        value,
        color: DOCTOR_COLORS[label] || DOCTOR_COLORS['Default']
      }))
      .sort((a, b) => b.value - a.value);

    // Daily trend
    const days = getDaysArray(dateRange.start, dateRange.end);
    const dailyTrend = days.map(day => {
      const dStr = formatDate(day);
      const count = filtered.filter(i => i.date === dStr).length;
      return { date: dStr, count };
    });

    return { filtered, stats, docData, dailyTrend, newPatientsDoctorData };
  }, [dateRange, doctorFilter, sourceFilter]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      // Add your actual data fetch function here if needed
    }, 800); // 800ms delay for smooth effect
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Practice Analytics</h1>
              <p className="text-gray-500 mt-1">Track and analyze your appointment data</p>
            </div>

            <div className="flex items-center gap-3">
              <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm border border-gray-200 
                    ${isRefreshing
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
            >
              <div
                className={isRefreshing ? 'animate-spin' : ''}
                style={isRefreshing ? { animationDuration: '0.5s' } : undefined}
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline">
                        {isRefreshing ? 'Refresh' : 'Refresh'}
                    </span>
            </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm"
              >
                <Printer size={16} />
                <span className="text-sm">Export Report</span>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
           
            <div className="flex items-center gap-3 p-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => { setShowCalendar(!showCalendar); setActivePreset('Custom'); }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors bg-white"
                >
                  <CalendarIcon size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatDisplayDate(dateRange.start)} - {formatDisplayDate(dateRange.end)}
                  </span>
                </button>

                {showCalendar && (
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onChange={(s, e) => setDateRange({ start: s, end: e })}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>

              <FilterDropdown
                label="Doctor"
                options={doctors}
                value={doctorFilter}
                onChange={setDoctorFilter}
              />

              <FilterDropdown
                label="Source"
                options={sources}
                value={sourceFilter}
                onChange={setSourceFilter}
              />
            </div>
             <div className="flex items-center gap-3 p-2 flex-wrap">
            <DatePresets onSelect={handlePresetSelect} active={activePreset} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Appointments"
            value={analyticsData.stats.total}
            color="orange"
          />
          <StatCard
            label="New Patients"
            value={analyticsData.stats.new}
            color="green"
          />
          <StatCard
            label="Existing Patients"
            value={analyticsData.stats.existing}
            color="blue"
          />
          <StatCard
            label="Completed"
            value={analyticsData.stats.completed}
            color="purple"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EnhancedBarChart
            title="Appointments by Doctor"
            subtitle="Total bookings per healthcare provider"
            data={analyticsData.docData}
          />
          <TrendChart dailyData={analyticsData.dailyTrend} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DonutChart
            title="Patient Type Distribution"
            subtitle="New vs Existing patients"
            data={[
              { label: 'New Patients', value: analyticsData.stats.new, color: '#f97316' },
              { label: 'Existing Patients', value: analyticsData.stats.existing, color: '#fcd34d' },
            ]}
          />
          {/* REPLACED: Booking Source with New Patients by Doctor */}
          <NewPatientsByDoctorChart
            data={analyticsData.newPatientsDoctorData}
            selectedDoctor={doctorFilter}
          />
        </div>
      </div>
    </div>
  );
}