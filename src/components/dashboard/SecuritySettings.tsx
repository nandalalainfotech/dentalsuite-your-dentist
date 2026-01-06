import React, { useState } from 'react';

// Icons
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
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="relative">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <div className="p-2 sm:p-2.5 bg-gray-900 rounded-xl text-white flex-shrink-0">
            <Icons.Shield />
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Security Settings
          </h2>
        </div>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl pl-0 sm:pl-14">
          Manage your account security and authentication preferences to keep your data safe.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid gap-4 sm:gap-6">

        {/* Change Password Card */}
        <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Card Header */}
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Icons.Key />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Password</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                    Secure your account with a strong password
                  </p>
                </div>
              </div>

              {/* Status Badge - Hidden on mobile, shown on larger */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Updated 30 days ago
              </div>
            </div>

            {/* Mobile Description */}
            <p className="text-sm text-gray-500 sm:hidden -mt-2">
              Secure your account with a strong password.
            </p>

            {/* Mobile Status */}
            <div className="flex sm:hidden items-center gap-2 text-xs font-medium text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Last changed: 30 days ago
            </div>

            {/* Action Button */}
            <button
              onClick={onChangePassword}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-white border-2 border-gray-100 hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm text-sm sm:text-base"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Card Header */}
            <div className="flex items-start gap-3">
              <div className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${twoFactorEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                <Icons.Shield />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
                  {twoFactorEnabled && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                      <Icons.CheckCircle />
                      <span className="hidden xs:inline">Active</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  Add an extra layer of security. We'll send a verification code to your device when logging in.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                onEnable2FA();
              }}
              className={`
                w-full sm:w-auto px-5 py-3 sm:py-2.5 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base
                ${twoFactorEnabled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                }
              `}
            >
              {twoFactorEnabled ? 'Turn Off 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        {/* Security Tips Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-white">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-orange-500/10 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="p-2.5 sm:p-3 bg-black/10 rounded-xl sm:rounded-2xl backdrop-blur-md">
                <Icons.Sparkles />
              </div>
              <h4 className="text-base sm:text-lg font-bold">Pro Security Tips</h4>
            </div>

            {/* Tips List */}
            <ul className="space-y-3 sm:space-y-4">
              {[
                "Use a unique password with at least 12 characters (mix letters, numbers & symbols).",
                "Enable notifications for suspicious login attempts from new devices.",
                "Review your active sessions and family member permissions periodically."
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                  <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;