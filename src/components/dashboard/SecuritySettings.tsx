import React, { useState, useEffect } from 'react';

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
  Eye: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Fresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [lastPasswordChange, setLastPasswordChange] = useState<Date | null>(null);

  // Initialize with a default date (30 days ago)
  useEffect(() => {
    // In a real app, you would fetch this from your backend/API
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setLastPasswordChange(thirtyDaysAgo);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = () => {
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    // Here you would typically make an API call to change the password
    console.log('Password change requested:', formData);

    // Update the last password change timestamp
    setLastPasswordChange(new Date());

    // Call the parent handler
    onChangePassword();

    // Reset form and close
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  // Calculate how many days ago the password was changed
  const getDaysSinceLastChange = () => {
    if (!lastPasswordChange) return 30; // Default fallback
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastPasswordChange.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge color based on days since last change
  const getStatusBadgeColor = (days: number) => {
    if (days === 0) return 'bg-green-100 text-green-800 border-green-200';
    if (days < 7) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (days < 30) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (days < 90) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  // Get status text based on days since last change
  const getStatusText = (days: number) => {
    if (days === 0) return 'Updated just now';
    if (days === 1) return 'Updated yesterday';
    if (days < 7) return `Updated ${days} days ago`;
    if (days === 7) return 'Updated 1 week ago';
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `Updated ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (days === 30) return 'Updated 1 month ago';
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `Updated ${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(days / 365);
    return `Updated ${years} year${years > 1 ? 's' : ''} ago`;
  };

  // Get status icon based on days since last change
  const getStatusIcon = (days: number) => {
    if (days === 0) return <Icons.Fresh />;
    if (days < 7) return <Icons.CheckCircle />;
    if (days < 30) return <Icons.Clock />;
    if (days < 90) return <Icons.Calendar />;
    return <Icons.Shield />;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strength = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-red-400' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-green-400' },
      { text: 'Strong', color: 'bg-green-600' }
    ][Math.min(score, 4)];

    return { score, ...strength };
  };

  const newPasswordStrength = getPasswordStrength(formData.newPassword);
  const daysSinceLastChange = getDaysSinceLastChange();

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
          {!showPasswordForm ? (
            // Default View
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
                {/* Status Badge */}
                {lastPasswordChange && (
                  <div className={`hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusBadgeColor(daysSinceLastChange)}`}>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(daysSinceLastChange)}
                      <span>{getStatusText(daysSinceLastChange)}</span>
                    </div>
                    {daysSinceLastChange === 0 && (
                      <span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Description */}
              <p className="text-sm text-gray-500 sm:hidden -mt-2">
                Secure your account with a strong password.
              </p>

              {/* Mobile Status */}
              {lastPasswordChange && (
                <div className="flex sm:hidden items-center gap-2 text-xs font-medium">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getStatusBadgeColor(daysSinceLastChange)}`}>
                    {getStatusIcon(daysSinceLastChange)}
                    <span>{getStatusText(daysSinceLastChange)}</span>
                  </div>
                  {lastPasswordChange && (
                    <span>
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-white border-2 border-gray-100 hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm text-sm sm:text-base"
              >
                Update Password
              </button>
            </div>
          ) : (
            // Password Update Form
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Form Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Icons.Key />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Update Password</h3>
                    <p className="text-sm text-gray-500">Enter your current and new password</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close form"
                >
                  <Icons.X />
                </button>
              </div>

              {/* Current Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword.current ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative mb-2">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword.new ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${newPasswordStrength.color.replace('bg-', 'text-')}`}>
                        {newPasswordStrength.text}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${newPasswordStrength.color} transition-all duration-300`}
                        style={{ width: `${(newPasswordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Re-enter New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword.confirm ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.newPassword && formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <div className="text-green-500">
                          <Icons.Check />
                        </div>
                        <span className="text-green-600 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="text-red-600 font-medium">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements</h4>
                <ul className="space-y-1.5 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                    At least one special character
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    !formData.confirmPassword ||
                    formData.newPassword !== formData.confirmPassword ||
                    newPasswordStrength.score < 3
                  }
                  className="flex-1 px-4 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
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
              {twoFactorEnabled ? 'Turn Off' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Security Tips Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-700 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-white">
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
                `Consider changing your password every ${daysSinceLastChange > 90 ? '90' : '30'} days for optimal security.`,
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