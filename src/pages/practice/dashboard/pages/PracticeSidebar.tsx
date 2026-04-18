import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, X, Loader2 } from 'lucide-react';
import { Icons } from '../../../../components/dashboard/Icons';
import { usePracticePermissions } from '../../../../features/permissions/Permissions.hooks';

interface PracticeSidebarProps {
  onLogout?: () => void;
  onClose?: () => void;
  practiceId: string;
}

const NAVIGATION_ITEMS = {
  '/practice/dashboard/view-profile': {
    icon: Icons.User,
    label: 'View Profile',
    module: 'view_profile',
    requiredAction: 'view',
    alwaysShow: true
  },
  '/practice/dashboard/directory': {
    icon: Icons.Folder,
    label: 'My Directory',
    module: 'directory',
    requiredAction: 'view'
  },
  '/practice/dashboard/appointments': {
    icon: Icons.Appointment,
    label: 'Online Bookings',
    module: 'appointments',
    requiredAction: 'view'
  },
  '/practice/dashboard/appointment-type': {
    icon: Icons.AppointmentType,
    label: 'Appointment Type',
    module: 'appointment_type',
    requiredAction: 'view'
  },
  '/practice/dashboard/booking-calendar': {
    icon: Icons.Calendar,
    label: 'Booking Calendar',
    module: 'booking_calendar',
    requiredAction: 'view'
  },
  '/practice/dashboard/analytics': {
    icon: Icons.BarChart,
    label: 'Analytics',
    module: 'analytics',
    requiredAction: 'view'
  },
  '/practice/dashboard/invoice-history': {
    icon: FileText,
    label: 'Invoice History',
    module: 'invoice',
    requiredAction: 'view'
  },
  '/practice/dashboard/support': {
    icon: Icons.Support,
    label: 'Support',
    module: 'support',
    requiredAction: 'view'
  },
  '/practice/dashboard/user-accounts': {
    icon: Icons.User,
    label: 'User Accounts',
    module: 'user_accounts',
    requiredAction: 'view'
  }
};

export default function PracticeSidebar({ onClose, practiceId }: PracticeSidebarProps) {
  const { isLoading, isReady, hasPermission } = usePracticePermissions(practiceId);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 group hover:bg-gray-50 ${isActive
      ? 'border-orange-500 text-gray-900 bg-orange-50 font-semibold'
      : 'border-transparent text-gray-400 hover:text-gray-600 font-medium'
    }`;

  const getIconClass = (isActive: boolean) =>
    isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600';

  const visibleNavItems = useMemo(() => {
    return Object.entries(NAVIGATION_ITEMS).filter(([path]) => {
      const navItem = NAVIGATION_ITEMS[path as keyof typeof NAVIGATION_ITEMS];
      if (!navItem) return false;

      if ('alwaysShow' in navItem && navItem.alwaysShow) return true;

      if (!isReady) return false;

      return hasPermission(navItem.module, navItem.requiredAction);
    });
  }, [hasPermission, isReady]);

  if (isLoading || !isReady) {
    return (
      <nav className="flex flex-col pb-4 h-full">
        {onClose && (
          <div className="p-4 flex justify-end lg:hidden">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#f47521] mb-3" size={24} />
          <p className="text-gray-400 text-sm font-medium">Loading menu...</p>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col pb-4 h-full">
      {onClose && (
        <div className="p-4 flex justify-end lg:hidden">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
      )}

      {visibleNavItems.map(([path, config]) => {
        const Icon = config.icon;
        return (
          <NavLink
            key={path}
            to={path}
            className={getLinkClass}
            onClick={onClose}
          >
            {({ isActive }) => (
              <>
                <div className={getIconClass(isActive)}>
                  <Icon />
                </div>
                <span>{config.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
