import React from 'react';

interface ProfileCompletionStatusProps {
  completionPercentage: number;
  onCompleteProfile: () => void;
}

export const ProfileCompletionStatus: React.FC<ProfileCompletionStatusProps> = ({
  completionPercentage,
  onCompleteProfile
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-orange-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 75) return 'Almost there!';
    if (percentage >= 50) return 'Good progress!';
    if (percentage >= 25) return 'Getting started';
    return 'Just beginning';
  };

  const missingSections = [
    { label: 'Contact Information', completed: completionPercentage > 25 },
    { label: 'Medical History', completed: completionPercentage > 50 },
    { label: 'Insurance Details', completed: completionPercentage > 75 },
    { label: 'Emergency Contact', completed: completionPercentage > 90 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Completion</h2>
        <div className="text-2xl sm:text-3xl font-bold text-orange-600">{completionPercentage}%</div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{getStatusMessage(completionPercentage)}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${getProgressColor(completionPercentage)}`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Complete your profile to:</p>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Get personalized recommendations</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Faster appointment booking</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Seamless insurance processing</span>
            </li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Missing Information:</p>
          <div className="space-y-2">
            {missingSections.map((section, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm ${section.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {section.label}
                </span>
                {section.completed ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onCompleteProfile}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${completionPercentage >= 90
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
        >
          {completionPercentage >= 90 ? 'Profile Complete!' : 'Complete Profile'}
        </button>

        {completionPercentage < 100 && (
          <div className="text-center">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Remind me later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};