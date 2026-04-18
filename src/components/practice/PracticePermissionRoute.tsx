import type { ReactNode } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { usePracticePermissions } from '../../features/permissions/Permissions.hooks';

interface PracticePermissionRouteProps {
  module: string;
  action?: string;
  children: ReactNode;
}

export default function PracticePermissionRoute({
  module,
  action = 'view',
  children,
}: PracticePermissionRouteProps) {
  const { practiceId, isLoading, isReady, hasPermission } = usePracticePermissions();

  if (!practiceId || isLoading || !isReady) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-gray-500">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission(module, action)) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-orange-100 bg-orange-50 p-8 text-center">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-orange-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Access denied</h2>
          <p className="text-sm text-gray-600">
            You do not have permission to {action} this module.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
