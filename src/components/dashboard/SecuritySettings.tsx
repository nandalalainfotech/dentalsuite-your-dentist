import React, { useState } from 'react';

// Import icons (or you can keep them inline)
const Icons = {
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

interface SecuritySettingsProps {
  onChangePassword: () => void;
  onEnable2FA: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  onChangePassword, 
  onEnable2FA 
}) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Icons.Shield />
          </div>
          Security Settings
        </h2>
        <p className="text-gray-500 max-w-2xl">
          Manage your account security and authentication preferences to keep your data safe.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Change Password Card */}
        <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Icons.Key />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Password</h3>
              </div>
              <p className="text-gray-500 mb-2">
                Secure your account with a strong password.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Last changed: 30 days ago
              </div>
            </div>
            <button
              onClick={onChangePassword}
              className="px-6 py-3 bg-white border-2 border-gray-100 hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold rounded-2xl transition-all duration-300 shadow-sm"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${twoFactorEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                  <Icons.Shield />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
                {twoFactorEnabled && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <Icons.CheckCircle />
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Add an extra layer of security. We'll send a code to your mobile device when logging in.
              </p>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                onEnable2FA();
              }}
              className={`
                px-6 py-3 font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/10
                ${twoFactorEnabled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'bg-green-500  hover:bg-green-600 text-white hover:shadow-green-500/25'
                }
              `}
            >
              {twoFactorEnabled ? 'Turn Off' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="relative overflow-hidden bg-gray-900 p-8 rounded-3xl text-white">
          <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Icons.Sparkles />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3">Pro Security Tips</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></span>
                  <span>Use a unique password with at least 12 characters (mix letters & numbers).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></span>
                  <span>Enable notifications for suspicious login attempts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></span>
                  <span>Review your active family member permissions periodically.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;