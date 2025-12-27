import React, { useState } from 'react';

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, option]);
    } else {
      onChange(selectedValues.filter(value => value !== option));
    }
  };

  return (
    <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4 last:border-b-0">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-2 sm:mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide">
          {title}
        </h3>
        <svg 
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <>
          {/* Checkboxes */}
          <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
            {options.map((option) => (
              <label 
                key={option} 
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 sm:p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 border-gray-300 rounded  accent-orange-600 "
                />
                <span className="text-xs sm:text-sm text-gray-700 select-none">{option}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSection;