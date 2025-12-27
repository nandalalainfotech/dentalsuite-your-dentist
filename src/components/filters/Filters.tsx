import React from 'react';
import FilterSection from './FilterSection';

interface FilterProps {
  selectedLanguages: string[];
  selectedGenders: string[];
  selectedSpecialties: string[];
  selectedInsurances?: string[];
  selectedAvailableDays?: string[];
  onLanguageChange: (languages: string[]) => void;
  onGenderChange: (genders: string[]) => void;
  onSpecialtyChange: (specialties: string[]) => void;
  onInsuranceChange?: (insurances: string[]) => void;
  onAvailableDaysChange?: (availableDays: string[]) => void;
  onClearAll: () => void;
  languages: string[];
  specialties: string[];
  genderOptions: string[];
  insuranceOptions?: string[];
  availableDaysOptions?: string[];
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  selectedLanguages,
  selectedGenders,
  selectedSpecialties,
  selectedInsurances,
  selectedAvailableDays,
  onLanguageChange,
  onGenderChange,
  onSpecialtyChange,
  onInsuranceChange,
  onAvailableDaysChange,
  onClearAll,
  languages,
  specialties,
  genderOptions,
  insuranceOptions,
  availableDaysOptions,
  className = ""
}) => {
  const hasActiveFilters = selectedLanguages.length > 0 ||
    selectedGenders.length > 0 || selectedSpecialties.length > 0 || selectedInsurances && selectedInsurances.length > 0 || selectedAvailableDays && selectedAvailableDays.length > 0;

  return (
    <div className={`bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-gray-300 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Filter By</h2>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
        {/* Specialty Filter */}
        <FilterSection
          title="Specialty"
          options={specialties}
          selectedValues={selectedSpecialties}
          onChange={onSpecialtyChange}
        />

        {/* Language Filter */}
        <FilterSection
          title="Language"
          options={languages}
          selectedValues={selectedLanguages}
          onChange={onLanguageChange}
        />

        {/* Gender Filter */}
        <FilterSection
          title="Gender"
          options={genderOptions}
          selectedValues={selectedGenders}
          onChange={onGenderChange}
        />

        {/* Insurance Filter */}
        {insuranceOptions && onInsuranceChange && (
          <FilterSection
            title="Insurance"
            options={insuranceOptions}
            selectedValues={selectedInsurances || []}
            onChange={onInsuranceChange}
          />

        )}

        {/* Available Days Filter */}
        {availableDaysOptions && onAvailableDaysChange && (
          <FilterSection
            title="Available Days"
            options={availableDaysOptions}
            selectedValues={selectedAvailableDays || []}
            onChange={onAvailableDaysChange}
          />
        )}

      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-gray-50 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-t border-gray-200 rounded-b-lg">
          <div className="text-xs text-gray-600 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedLanguages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {lang}
                <button
                  onClick={() => onLanguageChange(selectedLanguages.filter(l => l !== lang))}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedGenders.map((gender) => (
              <span
                key={gender}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {gender}
                <button
                  onClick={() => onGenderChange(selectedGenders.filter(g => g !== gender))}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedSpecialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {specialty}
                <button
                  onClick={() => onSpecialtyChange(selectedSpecialties.filter(s => s !== specialty))}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedInsurances && selectedInsurances.map((insurance) => (
              <span
                key={insurance}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {insurance}
                <button
                  onClick={() => onInsuranceChange && onInsuranceChange(selectedInsurances.filter(i => i !== insurance))}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedAvailableDays && selectedAvailableDays.map((day) => (
              <span
                key={day}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {day}
                <button
                  onClick={() => onAvailableDaysChange && onAvailableDaysChange(selectedAvailableDays.filter(d => d !== day))}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;