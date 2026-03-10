import { NavLink } from 'react-router-dom';
import { FileText, X } from 'lucide-react';
import { Icons } from '../../components/dashboard/Icons';

interface PracticeSidebarProps {
  onLogout: () => void;
  onClose?: () => void; // Optional: for closing mobile menu
}

export default function PracticeSidebar({
  onClose
}: PracticeSidebarProps) {

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 group hover:bg-gray-50 ${isActive
      ? 'border-orange-500 text-gray-900 bg-orange-50 font-semibold'
      : 'border-transparent text-gray-400 hover:text-gray-600 font-medium'
    }`;

  const getIconClass = (isActive: boolean) =>
    isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600';

  return (
    <nav className="flex flex-col pb-4 h-full">

      {onClose && (
        <div className="p-4 flex justify-end lg:hidden">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
      )}

      <NavLink to="/practice/dashboard/newsfeeds" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.News /></div><span>News Feeds</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/view-profile" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.User /></div><span>View Profile</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/directory" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.Folder /></div><span>My Directory</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/appointments" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.Appointment /></div><span>Online Bookings</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/appointment-type" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.AppointmentType /></div><span>Appointment Type</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/booking-calendar" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.Calendar /></div><span>Booking Calendar</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/analytics" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><Icons.BarChart /></div><span>Analytics</span></>)}
      </NavLink>

      <NavLink to="/practice/dashboard/invoice-history" className={getLinkClass} onClick={onClose}>
        {({ isActive }) => (<><div className={getIconClass(isActive)}><FileText size={18} /></div><span>Invoice History</span></>)}
      </NavLink>

      {/* Push Logout to bottom */}
      {/* <div className="mt-auto lg:mt-4 pt-4 border-t border-gray-50 mx-6">
          <button onClick={onLogout} className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium w-full py-2">
            <LogOut size={18} /><span>Sign Out</span>
          </button>
        </div> */}
    </nav>
  );
}