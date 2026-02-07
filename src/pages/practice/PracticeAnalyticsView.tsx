import { useState, useMemo, useEffect } from 'react';
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
  UserPlus,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

// --- MOCK DATABASE ---
const MOCK_DB = [
  { id: 1, date: '2026-01-15', doctor: 'Dr. Emma Watson', type: 'New', source: 'Mobile', patient: 'John Doe', time: '09:00', status: 'Completed' },
  { id: 2, date: '2026-01-16', doctor: 'Dr. Emma Watson', type: 'Existing', source: 'Web', patient: 'Jane Smith', time: '10:30', status: 'Completed' },
  { id: 3, date: '2026-01-20', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Mobile', patient: 'Bob Wilson', time: '11:00', status: 'Completed' },
  { id: 4, date: '2026-01-24', doctor: 'Dr. Emma Watson', type: 'New', source: 'Web', patient: 'Alice Brown', time: '14:00', status: 'Scheduled' },
  { id: 5, date: '2026-01-25', doctor: 'Dr. Sarah Smith', type: 'Existing', source: 'Mobile', patient: 'Charlie Davis', time: '15:30', status: 'Scheduled' },
  { id: 6, date: '2026-01-28', doctor: 'Dr. Emma Watson', type: 'Existing', source: 'Web', patient: 'Eva Martinez', time: '09:30', status: 'Scheduled' },
  { id: 7, date: '2026-02-01', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Mobile', patient: 'Frank Lee', time: '10:00', status: 'Scheduled' },
  { id: 8, date: '2026-02-02', doctor: 'Dr. Emma Watson', type: 'New', source: 'Mobile', patient: 'Grace Kim', time: '11:30', status: 'Scheduled' },
  { id: 9, date: '2026-01-17', doctor: 'Dr. Mike Johnson', type: 'New', source: 'Web', patient: 'Henry Chen', time: '13:00', status: 'Completed' },
  { id: 10, date: '2026-01-22', doctor: 'Dr. Mike Johnson', type: 'Existing', source: 'Mobile', patient: 'Ivy Patel', time: '16:00', status: 'Cancelled' },
  { id: 11, date: '2026-01-18', doctor: 'Dr. Mike Johnson', type: 'New', source: 'Mobile', patient: 'Jack Brown', time: '10:00', status: 'Completed' },
  { id: 12, date: '2026-01-19', doctor: 'Dr. Sarah Smith', type: 'New', source: 'Web', patient: 'Kate Wilson', time: '14:30', status: 'Completed' },
];

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

// --- ANIMATED NUMBER COMPONENT ---
const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
};

// --- SPARKLINE COMPONENT ---
const Sparkline = ({ data, color = '#f97316' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 80;
  const height = 30;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width - padding}
        cy={height - padding - ((data[data.length - 1] - min) / range) * (height - 2 * padding)}
        r="3"
        fill={color}
      />
    </svg>
  );
};

// --- ENHANCED STAT CARD ---
const ModernStatCard = ({
  label,
  value,
  icon: Icon,
  gradient
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
}) => {

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Background Gradient Orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${gradient} opacity-90 blur-3xl group-hover:opacity-100 transition-opacity`} />

      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-10`}>
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-gray-900">
              <AnimatedNumber value={value} />
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODERN BAR CHART WITH SVG ---
const ModernBarChart = ({
  title,
  subtitle,
  data
}: {
  title: string;
  subtitle: string;
  data: { label: string; value: number }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 20;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl">
          <BarChart3 size={20} className="text-orange-600" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p className="text-sm">No data available</p>
        </div>
      ) : (
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 -ml-2">
            <span>{maxVal}</span>
            <span>{Math.round(maxVal / 2)}</span>
            <span>0</span>
          </div>

          <svg
            width="100%"
            height={chartHeight + 40}
            className="ml-6"
            viewBox={`0 0 ${data.length * (barWidth + gap) + gap} ${chartHeight + 40}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {data.map((_, idx) => (
                <linearGradient key={idx} id={`barGradient${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              ))}
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * (chartHeight / 4)}
                x2={data.length * (barWidth + gap)}
                y2={i * (chartHeight / 4)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Bars */}
            {data.map((item, idx) => {
              const barHeight = (item.value / maxVal) * chartHeight;
              const x = gap + idx * (barWidth + gap);
              const y = chartHeight - barHeight;
              const isHovered = hoveredIndex === idx;

              return (
                <g key={idx}>
                  {/* Bar shadow */}
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill="rgba(0,0,0,0.1)"
                    className="transition-all duration-300"
                  />

                  {/* Main bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={`url(#barGradient${idx})`}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                    }}
                  />

                  {/* Value label */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className={`text-xs font-bold transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    fill="#f97316"
                  >
                    {item.value}
                  </text>

                  {/* X-axis label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {item.label.split(' ')[1]?.slice(0, 6) || item.label.slice(0, 6)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${hoveredIndex === idx ? 'bg-orange-50' : 'bg-gray-50'}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
              <span className="text-xs font-medium text-gray-600">{item.label}</span>
              <span className="text-xs font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MODERN AREA CHART ---
const ModernAreaChart = ({ dailyData }: { dailyData: { date: string; count: number }[] }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxVal = Math.max(...dailyData.map(d => d.count), 1);
  const total = dailyData.reduce((sum, d) => sum + d.count, 0);
  const avg = dailyData.length > 0 ? (total / dailyData.length).toFixed(1) : '0';

  const chartWidth = 600;
  const chartHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const getX = (index: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / Math.max(dailyData.length - 1, 1)) * usableWidth;
  };

  const getY = (value: number) => {
    const usableHeight = chartHeight - padding.top - padding.bottom;
    return padding.top + usableHeight - (value / maxVal) * usableHeight;
  };

  // Create smooth curve path
  const createPath = () => {
    if (dailyData.length === 0) return '';

    const points = dailyData.map((d, i) => ({ x: getX(i), y: getY(d.count) }));

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const areaPath = () => {
    const linePath = createPath();
    if (!linePath) return '';
    const lastPoint = dailyData.length - 1;
    return `${linePath} L ${getX(lastPoint)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Appointment Trend</h3>
          <p className="text-sm text-gray-500 mt-1">Daily appointments over time</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">{avg}</p>
            <p className="text-xs text-gray-500">Daily Avg</p>
          </div>
          <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl">
            <Activity size={20} className="text-orange-600" />
          </div>
        </div>
      </div>

      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
          const value = Math.round(maxVal - (i / 4) * maxVal);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#f3f4f6"
                strokeDasharray={i > 0 ? "4,4" : "0"}
              />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-xs fill-gray-400">
                {value}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={areaPath()}
          fill="url(#areaGradient)"
          className="transition-all duration-500"
        />

        {/* Line */}
        <path
          d={createPath()}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="transition-all duration-500"
        />

        {/* Data points */}
        {dailyData.map((day, idx) => (
          <g key={idx}>
            <circle
              cx={getX(idx)}
              cy={getY(day.count)}
              r={hoveredPoint === idx ? 8 : 5}
              fill="white"
              stroke="#f97316"
              strokeWidth="3"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint(idx)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* Tooltip */}
            {hoveredPoint === idx && (
              <g>
                <rect
                  x={getX(idx) - 75}  // Half of width (150/2 = 75)
                  y={getY(day.count) - 50}
                  width="150"
                  height="50"
                  rx="8"
                  fill="#1f2937"
                  className="drop-shadow-lg"
                />
                <text
                  x={getX(idx)}
                  y={getY(day.count) - 30}  // Adjusted for vertical centering (-50 + 50/2 - 5 = -30)
                  textAnchor="middle"
                  className="text-sm fill-white font-medium"
                >
                  {day.date.slice(5)}
                </text>
                <text
                  x={getX(idx)}
                  y={getY(day.count) - 12}  // Adjusted for vertical centering (-50 + 50/2 + 13 = -12)
                  textAnchor="middle"
                  className="text-sm fill-orange-400 font-bold"
                >
                  {day.count} appointments
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-10 text-xs text-gray-400">
        <span>{dailyData[0]?.date?.slice(5)}</span>
        {dailyData.length > 2 && <span>{dailyData[Math.floor(dailyData.length / 2)]?.date?.slice(5)}</span>}
        <span>{dailyData[dailyData.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
};

// --- MODERN DONUT CHART ---
const ModernDonutChart = ({
  data,
  title,
  subtitle
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
  subtitle: string;
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const size = 160;
  const strokeWidth = 30;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl">
          <PieChartIcon size={20} className="text-orange-600" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">

        {/* Row 1 - Centered Donut */}
        <div className="flex justify-center w-full">
          <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {(() => {
                let cumulative = 0;
                return data.map((item, idx) => {
                  const percent = total === 0 ? 0 : item.value / total;
                  const strokeDasharray = `${percent * circumference} ${circumference}`;
                  const rotation = cumulative * 360;
                  cumulative += percent;
                  const isHovered = hoveredSegment === idx;

                  return (
                    <circle
                      key={idx}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={isHovered ? strokeWidth + 8 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'center',
                        transition: 'all 0.3s ease',
                        filter: isHovered
                          ? 'brightness(1.1) '
                          : 'none'
                      }}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  );
                });
              })()}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  <AnimatedNumber value={total} />
                </p>
                <p className="text-xs text-gray-500 font-medium">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 - Legends */}
        <div className="grid grid-cols-2 gap-6 w-auto">

          {/* Left - New Patient */}
          <div className="space-y-3">
            {data
              .filter(item => item.label.toLowerCase().includes('new'))
              .map((item, idx) => {
                const realIndex = data.findIndex(d => d.label === item.label);
                const isHovered = hoveredSegment === realIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer
                ${isHovered ? 'bg-gray-50 scale-105' : 'hover:bg-gray-50'}`}
                    onMouseEnter={() => setHoveredSegment(realIndex)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>

                  </div>
                );
              })}
          </div>

          {/* Right - Existing Patient */}
          <div className="space-y-3">
            {data
              .filter(item => item.label.toLowerCase().includes('existing'))
              .map((item, idx) => {
                const realIndex = data.findIndex(d => d.label === item.label);
                const isHovered = hoveredSegment === realIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer
                ${isHovered ? 'bg-gray-50 scale-105' : 'hover:bg-gray-50'}`}
                    onMouseEnter={() => setHoveredSegment(realIndex)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODERN DOCTOR CHART ---
const ModernDoctorChart = ({
  data,
  selectedDoctor
}: {
  data: { label: string; value: number; color: string }[];
  selectedDoctor: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const getInitials = (name: string) => {
    return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">New Patients by Doctor</h3>
          <p className="text-sm text-gray-500 mt-1">
            {selectedDoctor === 'All' ? 'All doctors' : selectedDoctor}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-500">{total}</p>
            <p className="text-xs text-gray-500">Total New</p>
          </div>
          <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl">
            <UserPlus size={20} className="text-emerald-600" />
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <UserPlus size={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No new patients for this period</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const widthPercentage = (item.value / maxVal) * 100;
            const isHovered = hoveredIndex === index;
            const isSelected = selectedDoctor !== 'All' && item.label === selectedDoctor;

            return (
              <div
                key={index}
                className={`relative p-4 rounded-xl transition-all cursor-pointer ${isHovered || isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-4">

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                        {isSelected && (
                          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${widthPercentage}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                        }}
                      />
                      {/* Animated shine effect */}
                      <div
                        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                        style={{
                          width: `${widthPercentage}%`,
                          animationDuration: '2s'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- DATE PRESETS ---
const DatePresets = ({ onSelect, active }: { onSelect: (preset: string) => void; active: string }) => {
  const presets = ['Today', 'This Week', 'This Month', 'Last 30 Days', 'Custom'];

  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map(preset => (
        <button
          key={preset}
          onClick={() => onSelect(preset)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === preset
            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {preset}
        </button>
      ))}
    </div>
  );
};

// --- DATE RANGE PICKER ---
const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  onClose
}: {
  startDate: Date;
  endDate: Date;
  onChange: (s: Date, e: Date) => void;
  onClose: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(startDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startDate.getFullYear());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

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

  return (
    <div className="absolute top-14 left-0 bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 z-50 w-[360px]">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
        <X size={18} />
      </button>

      <div className="flex justify-between items-center mt-3">
        <button onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-gray-800">{MONTH_NAMES[currentMonth]} {currentYear}</span>
        <button onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <span key={d} className="text-gray-400 text-xs font-medium py-2">{d}</span>
        ))}
        {days.map((day, idx) => {
          if (!day) return <span key={idx} />;

          const current = new Date(currentYear, currentMonth, day);
          const isInRange = current >= startDate && current <= endDate;
          const isStart = current.getTime() === startDate.getTime();
          const isEnd = current.getTime() === endDate.getTime();

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`p-2.5 rounded-xl text-sm font-medium transition-all
                ${isInRange && !isStart && !isEnd ? 'bg-orange-100 text-orange-700' : ''} 
                ${isStart || isEnd ? 'bg-orange-500  text-white shadow-md' : 'hover:bg-gray-100'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <button onClick={onClose} className="px-4 py-1.5 w-full bg-orange-500 text-white font-base rounded-xl hover:shadow-lg transition-all">
          Apply
        </button>
      </div>
    </div>
  );
};

// --- FILTER DROPDOWN ---
const FilterDropdown = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:border-gray-300 transition-all bg-white"
      >
        <span className="text-gray-500">{label}:</span>
        <span className="font-medium text-gray-800">{value}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden">
          {options.map(option => (
            <button
              key={option}
              onClick={() => { onChange(option); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === option ? 'text-orange-600 bg-orange-50 font-medium' : 'text-gray-700'}`}
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
  const [dateRange, setDateRange] = useState({ start: new Date(2026, 0, 14), end: new Date(2026, 0, 29) });
  const [activePreset, setActivePreset] = useState('Custom');
  const [showCalendar, setShowCalendar] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        setDateRange({ start: new Date(2026, 0, 1), end: new Date(2026, 0, 31) });
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

    if (doctorFilter !== 'All') filtered = filtered.filter(i => i.doctor === doctorFilter);
    if (sourceFilter !== 'All') filtered = filtered.filter(i => i.source === sourceFilter);

    const stats = {
      total: filtered.length,
      new: filtered.filter(i => i.type === 'New').length,
      existing: filtered.filter(i => i.type === 'Existing').length,
      mobile: filtered.filter(i => i.source === 'Mobile').length,
      web: filtered.filter(i => i.source === 'Web').length,
      completed: filtered.filter(i => i.status === 'Completed').length,
    };

    const doctorMap: Record<string, number> = {};
    filtered.forEach(appt => {
      doctorMap[appt.doctor] = (doctorMap[appt.doctor] || 0) + 1;
    });
    const docData = Object.entries(doctorMap).map(([label, value]) => ({ label, value }));

    const newPatientsByDoctor: Record<string, number> = {};
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

    const days = getDaysArray(dateRange.start, dateRange.end);
    const dailyTrend = days.map(day => {
      const dStr = formatDate(day);
      const count = filtered.filter(i => i.date === dStr).length;
      return { date: dStr, count };
    });

    // Sparkline data for stat cards
    const sparklineData = dailyTrend.slice(-7).map(d => d.count);

    return { filtered, stats, docData, dailyTrend, newPatientsDoctorData, sparklineData };
  }, [dateRange, doctorFilter, sourceFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">

                <h1 className="text-3xl font-bold bg-gray-800 bg-clip-text text-transparent">
                  Practice Analytics
                </h1>
              </div>
              <p className="text-gray-500">Track and analyze your appointment data</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm border ${isRefreshing
                  ? 'bg-gray-50 text-gray-400 border-gray-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'
                  }`}
              ><div
                className={isRefreshing ? 'animate-spin' : ''}
                style={isRefreshing ? { animationDuration: '0.5s' } : undefined}
              >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </div>
                <span>Refresh</span>

              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500  text-white rounded-xl font-medium hover:shadow-md hover:shadow-orange-200 transition-all"
              >
                <Printer size={18} />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative">
                <button
                  onClick={() => { setShowCalendar(!showCalendar); setActivePreset('Custom'); }}
                  className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl hover:border-orange-300 transition-all bg-white"
                >
                  <CalendarIcon size={18} className="text-orange-500" />
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
              <FilterDropdown label="Doctor" options={doctors} value={doctorFilter} onChange={setDoctorFilter} />
              <FilterDropdown label="Source" options={sources} value={sourceFilter} onChange={setSourceFilter} />
            </div>
            <DatePresets onSelect={handlePresetSelect} active={activePreset} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <ModernStatCard
            label="Total Appointments"
            value={analyticsData.stats.total}
            icon={Zap}
            gradient="bg-gradient-to-br from-orange-400 via-amber-200 to-amber-400"
          />
          <ModernStatCard
            label="New Patients"
            value={analyticsData.stats.new}
            icon={UserPlus}
            gradient="bg-gradient-to-br from-emerald-400 via-emerald-200 to-green-400"
          />
          <ModernStatCard
            label="Existing Patients"
            value={analyticsData.stats.existing}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-400 via-cyan-200 to-cyan-400"
          />
          <ModernStatCard
            label="Completed"
            value={analyticsData.stats.completed}
            icon={CheckCircle2}
            gradient="bg-gradient-to-br from-purple-400 via-violet-200 to-violet-400"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ModernBarChart
            title="Appointments by Doctor"
            subtitle="Total bookings per healthcare provider"
            data={analyticsData.docData}
          />
          <ModernAreaChart dailyData={analyticsData.dailyTrend} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernDonutChart
            title="Patient Type Distribution"
            subtitle="New vs Existing patients"
            data={[
              { label: 'New Patients', value: analyticsData.stats.new, color: '#f97316' },
              { label: 'Existing Patients', value: analyticsData.stats.existing, color: '#fbbf24' },
            ]}
          />
          <ModernDoctorChart
            data={analyticsData.newPatientsDoctorData}
            selectedDoctor={doctorFilter}
          />
        </div>
      </div>
    </div>
  );
}