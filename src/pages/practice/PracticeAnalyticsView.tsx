import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  HelpCircle, 
  Calendar as CalendarIcon, 
  MessageCircle, 
  ChevronDown,
  X
} from 'lucide-react';

// --- 1. MOCK DATABASE (Static Data) ---
const MOCK_DB = [
  { id: 1, date: '2026-01-15', doctor: 'Viswa', type: 'New', source: 'Mobile' },
  { id: 2, date: '2026-01-16', doctor: 'Viswa', type: 'Existing', source: 'Web' },
  { id: 3, date: '2026-01-20', doctor: 'Sarah Smith', type: 'New', source: 'Mobile' },
  { id: 4, date: '2026-01-24', doctor: 'Viswa', type: 'New', source: 'Web' },
  { id: 5, date: '2026-01-25', doctor: 'Sarah Smith', type: 'Existing', source: 'Mobile' },
  { id: 6, date: '2026-01-28', doctor: 'Viswa', type: 'Existing', source: 'Web' },
  { id: 7, date: '2026-02-01', doctor: 'Sarah Smith', type: 'New', source: 'Mobile' },
  { id: 8, date: '2026-02-02', doctor: 'Viswa', type: 'New', source: 'Mobile' },
];

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
  for(let dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

// --- COMPONENTS ---

// 1. Custom Date Range Picker Component (Orange Theme)
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
  const [currentMonth] = useState(new Date(2026, 0, 1)); 
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = currentMonth.getDay(); // 0 = Sun
  
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (clickedDate < startDate || (startDate.getTime() === endDate.getTime())) {
       if(clickedDate < startDate) {
         onChange(clickedDate, endDate);
       } else {
         onChange(startDate, clickedDate);
       }
    } else {
      onChange(clickedDate, clickedDate);
    }
  };

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="absolute top-12 left-0 bg-white shadow-xl border border-gray-200 rounded-lg p-4 z-50 w-72 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-700">January 2026</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-gray-400 text-xs">{d}</span>)}
        {days.map((day, idx) => {
          if (!day) return <span key={idx} />;
          const current = new Date(2026, 0, day);
          const isSelected = current >= startDate && current <= endDate;
          const isRangeEnd = current.getTime() === startDate.getTime() || current.getTime() === endDate.getTime();
          
          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`p-1 rounded-full transition-colors
                ${isSelected ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100'} 
                ${isRangeEnd ? 'bg-orange-500 text-white font-bold hover:bg-orange-600 !important' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="text-xs text-orange-500 font-bold uppercase tracking-wide">Apply Filter</button>
      </div>
    </div>
  );
};

// 2. Summary Card (Gray & Orange)
const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-orange-50 rounded-xl p-6 flex flex-col items-center justify-center text-center h-32 shadow-sm border border-orange-100">
    <h3 className="text-gray-500 font-semibold text-sm mb-2">{label}</h3>
    <p className="text-4xl font-bold text-gray-800">{value}</p>
  </div>
);

// 3. Bar Chart (Row 1) - Orange Bars
const SimpleBarChart = ({ title, subtitle, data, yAxisMax }: { title: string, subtitle: string, data: any[], yAxisMax: number }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full shadow-sm">
      <div className="text-center mb-8">
        <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-xs text-gray-400 pr-4 pb-6 h-48 text-right w-8 font-medium">
          <span>{yAxisMax}</span>
          <span>{Math.ceil(yAxisMax / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 border-b border-gray-200 h-48 flex items-end justify-around pb-0 relative">
          {data.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">No data</div>
          ) : (
            data.map((item, index) => {
              const heightPercentage = yAxisMax > 0 ? (item.value / yAxisMax) * 100 : 0;
              return (
                <div key={index} className="flex flex-col items-center w-full max-w-xs group relative">
                   {/* Tooltip */}
                   <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded py-1 px-3 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                    <span className="font-semibold">{item.label}</span>: {item.value}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>

                  {/* The Bar - Orange Gradient */}
                  <div 
                    className="w-16 bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 transition-all duration-300 rounded-t-sm shadow-sm"
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                  
                  {/* X-Axis Label */}
                  <div className="absolute top-full mt-4 text-xs text-gray-600 font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    {item.label}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Area Chart (Row 2 Left) - Orange Theme
const AreaChart = ({ dailyData }: { dailyData: { date: string, count: number }[] }) => {
  const maxVal = Math.max(...dailyData.map(d => d.count), 1); 

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
      <div className="text-center mb-6">
        <h3 className="text-gray-800 font-bold text-lg">Daily Appointment Trend</h3>
        <p className="text-gray-500 text-sm mt-1">Appointments per day selected</p>
      </div>

      <div className="flex w-full px-4 items-end h-40 border-b border-gray-200 relative gap-1">
        <div className="absolute left-0 top-0 bottom-0 border-l border-dashed border-gray-200"></div>
        <div className="absolute left-2 top-0 text-xs text-gray-400 font-medium">{maxVal}</div>
        
        {dailyData.map((day, idx) => {
           const height = (day.count / maxVal) * 100;
           return (
             <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
               <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[10px] rounded px-2 py-1 z-10 whitespace-nowrap">
                  {day.date}: {day.count}
               </div>
               
               <div 
                  className={`w-full bg-orange-100 border-t-2 border-orange-500 transition-all duration-300 relative`} 
                  style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
               >
                 {day.count > 0 && (
                   <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-orange-500 rounded-full shadow-sm"></div>
                 )}
               </div>
             </div>
           )
        })}
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
         <span>{dailyData[0]?.date}</span>
         <span>{dailyData[dailyData.length-1]?.date}</span>
      </div>
    </div>
  );
};

// 5. Pie Chart (Row 2 Right) - Orange Pie
const SplitPieChart = ({ newCount, existingCount }: { newCount: number, existingCount: number }) => {
  const total = newCount + existingCount;
  const newPercent = total === 0 ? 50 : (newCount / total) * 100;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h3 className="text-gray-800 font-bold text-lg">New vs Existing Patients</h3>
        <p className="text-gray-500 text-sm mt-1">Appointments booked by patient type</p>
      </div>

      <div className="flex items-center gap-8">
        {/* The Pie - Orange vs Light Gray/Orange */}
        <div 
          className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg transition-all duration-700"
          style={{ 
            // Orange-500 for New, Orange-200 for Existing
            background: `conic-gradient(#f97316 0% ${newPercent}%, #fed7aa ${newPercent}% 100%)` 
          }}
        >
          <div className="absolute inset-0 border-white opacity-20"></div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <span className="text-gray-700 font-medium">New ({newCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 rounded-sm"></div>
            <span className="text-gray-700 font-medium">Existing ({existingCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function PracticeAnalyticsView() {
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
    start: new Date(2026, 0, 14), 
    end: new Date(2026, 0, 29)    
  });
  
  const [showCalendar, setShowCalendar] = useState(false);

  // --- ANALYTICS ENGINE ---
  const analyticsData = useMemo(() => {
    // 1. Filter Data by Date
    const filtered = MOCK_DB.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });

    // 2. Calculate Summaries
    const stats = {
      total: filtered.length,
      new: filtered.filter(i => i.type === 'New').length,
      existing: filtered.filter(i => i.type === 'Existing').length,
      mobile: filtered.filter(i => i.source === 'Mobile').length,
    };

    // 3. Calculate Doctor Data (Bar Charts)
    const doctorMap: Record<string, number> = {};
    const newPatientDoctorMap: Record<string, number> = {};

    filtered.forEach(appt => {
      // Total Appts per Doctor
      doctorMap[appt.doctor] = (doctorMap[appt.doctor] || 0) + 1;
      
      // New Patient Appts per Doctor
      if (appt.type === 'New') {
        newPatientDoctorMap[appt.doctor] = (newPatientDoctorMap[appt.doctor] || 0) + 1;
      }
    });

    // Transform maps to arrays for the charts
    const docData1 = Object.keys(doctorMap).map(doc => ({ label: doc, value: doctorMap[doc] }));
    const docData2 = Object.keys(newPatientDoctorMap).map(doc => ({ label: doc, value: newPatientDoctorMap[doc] }));

    // 4. Calculate Daily Trend (Area Chart)
    const days = getDaysArray(dateRange.start, dateRange.end);
    const dailyTrend = days.map(day => {
      const dStr = formatDate(day);
      const count = filtered.filter(i => i.date === dStr).length;
      return { date: dStr, count };
    });

    return { filtered, stats, docData1, docData2, dailyTrend };
  }, [dateRange]);

  return (
    <div className="bg-white min-h-screen pb-20 relative font-sans">
      
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Bookings Analytics</h1>
          
          {/* Interactive Date Picker */}
          <div className="mt-4 relative inline-block">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-3 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg bg-white text-sm font-medium hover:border-orange-400 transition-all shadow-sm"
            >
              <span>
                {formatDisplayDate(dateRange.start)} - {formatDisplayDate(dateRange.end)}
              </span>
              <CalendarIcon size={18} className="text-orange-500" />
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
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-white hover:shadow-sm bg-white transition-all">
            <HelpCircle size={18} />
            <span>Support</span>
            <ChevronDown size={14} />
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
            onClick={() => window.print()}
          >
            <Printer size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* --- STATS CARDS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Appointments" value={analyticsData.stats.total} />
        <StatCard label="New Patient Appts" value={analyticsData.stats.new} />
        <StatCard label="Existing Patient Appts" value={analyticsData.stats.existing} />
        <StatCard label="Mobile App Appointments" value={analyticsData.stats.mobile} />
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SimpleBarChart 
          title="Total Appointments"
          subtitle="Total appointments booked by doctors"
          data={analyticsData.docData1}
          yAxisMax={Math.max(...analyticsData.docData1.map(d => d.value), 4)} // Dynamic scaling
        />
        
        <SimpleBarChart 
          title="New Patient Appointments"
          subtitle="New patient appointments booked by doctor"
          data={analyticsData.docData2}
          yAxisMax={Math.max(...analyticsData.docData2.map(d => d.value), 2)} // Dynamic scaling
        />
      </div>

      {/* --- CHARTS ROW 2 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AreaChart dailyData={analyticsData.dailyTrend} />
        <SplitPieChart 
          newCount={analyticsData.stats.new} 
          existingCount={analyticsData.stats.existing} 
        />
      </div>
    </div>
  );
}