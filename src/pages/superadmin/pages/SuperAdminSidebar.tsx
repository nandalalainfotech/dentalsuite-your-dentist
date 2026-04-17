import { NavLink } from 'react-router-dom';
import {
    Users,
    X
} from 'lucide-react';

interface SuperAdminSidebarProps {
    onLogout: () => void;
    onClose?: () => void;
}

export default function SuperAdminSidebar({
    onClose
}: SuperAdminSidebarProps) {

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


            <NavLink to="/superadmin/clients" className={getLinkClass} onClick={onClose}>
                {({ isActive }) => (
                    <>
                        <div className={getIconClass(isActive)}><Users size={18} /></div>
                        <span>Clients</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/superadmin/usersettings" className={getLinkClass} onClick={onClose}>
                {({ isActive }) => (
                    <>
                        <div className={getIconClass(isActive)}><Users size={18} /></div>
                        <span>User Settings</span>
                    </>
                )}
            </NavLink>

        </nav>
    );
}