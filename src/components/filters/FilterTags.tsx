import React from 'react';

interface FilterTagsProps {
  selectedLanguages: string[];
  selectedGenders: string[];
  selectedSpecialties: string[];
  selectedInsurances?: string[];
  selectedAvailableDays?: string[];
  onRemoveLanguage: (language: string) => void;
  onRemoveGender: (gender: string) => void;
  onRemoveSpecialty: (specialty: string) => void;
  onRemoveInsurance?: (insurance: string) => void;
  onRemoveAvailableDay?: (day: string) => void;
  onClearAll: () => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  selectedLanguages,
  selectedGenders,
  selectedSpecialties,
  selectedInsurances,
  selectedAvailableDays,
  onRemoveLanguage,
  onRemoveGender,
  onRemoveSpecialty,
  onRemoveInsurance,
  onRemoveAvailableDay,
  onClearAll
}) => {
  const hasActiveFilters = selectedLanguages.length > 0 || selectedGenders.length > 0
    || selectedSpecialties.length > 0 || selectedInsurances && selectedInsurances.length > 0
    || selectedAvailableDays && selectedAvailableDays.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-orange-800">Active Filters</span>
        <button
          onClick={onClearAll}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          Clear all
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map((lang) => (
          <span
            key={lang}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-orange-700 border border-orange-300"
          >
            {lang}
            <button
              onClick={() => onRemoveLanguage(lang)}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
        
        {selectedGenders.map((gender) => (
          <span
            key={gender}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-orange-700 border border-orange-300"
          >
            {gender}
            <button
              onClick={() => onRemoveGender(gender)}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
        
        {selectedSpecialties.map((specialty) => (
          <span
            key={specialty}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-orange-700 border border-orange-300"
          >
            {specialty}
            <button
              onClick={() => onRemoveSpecialty(specialty)}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}

        {selectedInsurances && selectedInsurances.map((insurance) => (
          <span
            key={insurance}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-orange-700 border border-orange-300"
          >
            {insurance}
            <button
              onClick={() => onRemoveInsurance && onRemoveInsurance(insurance)}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414    1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}

        {selectedAvailableDays && selectedAvailableDays.map((day) => (
          <span
            key={day}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-orange-700 border border-orange-300"
          >
            {day}
            <button
              onClick={() => onRemoveAvailableDay && onRemoveAvailableDay(day)}
              className="ml-2 text-orange-500 hover:text-orange-700"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;