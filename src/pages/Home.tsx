import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Filters from "../components/filters/Filters";
import ServicesSection from "../components/services/ServiceSection";
import ReviewCard from "../components/reviews/ReviewCard";
import BrowseByState from "../components/BrowseByState";
import BlogSection from "../components/BlogSection";
import Footer from "../components/layout/Footer";
import { usePracticeData } from "../features/patient/Practicefilters/practice.hooks";
import { practiceApi } from "../features/patient/Practicefilters/practice.service";
import { debounce } from 'lodash';

const WEEK_ORDER = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday",
];

interface SearchResult {
  type: 'service' | 'practice' | 'practitioner';
  id: string;
  name: string;
  subtitle: string;
  practiceId?: string;
}

interface LocationResult {
  city: string;
  state: string;
  postcode: string;
  displayText: string;
}

const Home = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"service" | "location" | null>(null);
  const [serviceInput, setServiceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [serviceResults, setServiceResults] = useState<SearchResult[]>([]);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    clinics,
    loading,
    filterLoading,
    error,
    filtersApplied,
    filterOptions,
    selectedFilters,
    setSpecialties,
    setLanguages,
    setGenders,
    setInsurances,
    setDays,
    setService,
    setLocation,
    clearFilters,
  } = usePracticeData();

  // Close dropdown on outside click
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  // Debounced search for services
  const searchServices = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim().length < 2) {
          setServiceResults([]);
          return;
        }
        setSearchLoading(true);
        try {
          const results = await practiceApi.searchServices(query);
          setServiceResults(results);
        } catch (error) {
          console.error('Service search error:', error);
          setServiceResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    []
  );

  // Debounced search for locations
  const searchLocations = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim().length < 2) {
          setLocationResults([]);
          return;
        }
        setSearchLoading(true);
        try {
          const results = await practiceApi.searchLocations(query);
          setLocationResults(results);
        } catch (error) {
          console.error('Location search error:', error);
          setLocationResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    []
  );

  // Trigger service search on input change
  useEffect(() => {
    if (serviceInput && !selectedFilters.service) {
      searchServices(serviceInput);
    } else if (!serviceInput) {
      setServiceResults([]);
    }
  }, [serviceInput, searchServices, selectedFilters.service]);

  // Trigger location search on input change
  useEffect(() => {
    if (locationInput && !selectedFilters.location) {
      searchLocations(locationInput);
    } else if (!locationInput) {
      setLocationResults([]);
    }
  }, [locationInput, searchLocations, selectedFilters.location]);

  // ✅ NEW: Handle service selection - IMMEDIATELY fetch clinics
  const handleServiceSelect = (result: SearchResult) => {
    setServiceInput(result.name);
    setServiceResults([]);
    setActiveDropdown(null);

    // Immediately update Redux state which will trigger fetchClinicsWithFilters
    setService(result);
  };

  // ✅ NEW: Handle location selection - IMMEDIATELY fetch clinics
  const handleLocationSelect = (location: LocationResult) => {
    setLocationInput(location.displayText);
    setLocationResults([]);
    setActiveDropdown(null);

    // Immediately update Redux state which will trigger fetchClinicsWithFilters
    setLocation(location);
  };

  // Clear all filters and search
  const handleClearAllFilters = () => {
    clearFilters();
    setServiceInput("");
    setLocationInput("");
    setServiceResults([]);
    setLocationResults([]);
    setActiveDropdown(null);
  };

  // Show results when any filter is active
  const showResults = useMemo(() => {
    return filtersApplied;
  }, [filtersApplied]);

  // Sort available days
  const sortedAvailableDaysOptions = useMemo(() => {
    if (!filterOptions.availableDays) return WEEK_ORDER;
    return [...filterOptions.availableDays].sort(
      (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b)
    );
  }, [filterOptions.availableDays]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 py-0 px-0">
      {/* Banner */}
      <div
        className="w-full bg-cover bg-center bg-no-repeat py-12 sm:py-16 md:py-20 lg:py-24 px-4"
        style={{ backgroundImage: `url('/hero.webp')` }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 leading-snug">
            Find <span className="text-black">Your Dentist</span> Nearby You.
          </h1>
          <p className="text-white mt-3 text-sm sm:text-base md:text-lg">
            Find, book and add your favourite practitioners to your care team.
          </p>

          {/* Search Bar */}
          <div className="w-full flex justify-center mt-10 px-4">
            <div
              ref={dropdownRef}
              className="flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full shadow-md px-4 sm:px-6 py-4 w-full max-w-2xl lg:max-w-4xl border border-gray-200 gap-3 sm:gap-0"
            >
              {/* Service Input */}
              <div className="relative w-full sm:w-1/2 flex items-center">
                <div className="flex items-center w-full">
                  <svg className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Service, practice or practitioner"
                    value={serviceInput}
                    onChange={(e) => {
                      setServiceInput(e.target.value);
                      // Clear selected service when user types
                      if (selectedFilters.service) {
                        setService(null);
                      }
                      setActiveDropdown("service");
                    }}
                    onFocus={() => setActiveDropdown("service")}
                    className="w-full outline-none text-gray-700 placeholder-gray-500 bg-transparent text-sm sm:text-base pr-8"
                  />
                  {serviceInput && (
                    <button
                      onClick={() => {
                        setServiceInput("");
                        setService(null);
                        setServiceResults([]);
                        setActiveDropdown(null);
                      }}
                      className="absolute right-0 text-gray-800 hover:text-orange-500 p-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Service Dropdown */}
                {activeDropdown === "service" && serviceInput && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-2 max-h-96 overflow-y-auto z-50 border border-gray-200">
                    {searchLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : serviceResults.length > 0 ? (
                      <div>
                        {/* Group by type - Services */}
                        {serviceResults.filter(r => r.type === 'service').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Services</p>
                            </div>
                            {serviceResults
                              .filter(r => r.type === 'service')
                              .map((result) => (
                                <div
                                  key={`service-${result.id}`}
                                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() => handleServiceSelect(result)}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{result.name}</p>
                                      <p className="text-xs text-gray-500">{result.subtitle}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Practices */}
                        {serviceResults.filter(r => r.type === 'practice').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Practices</p>
                            </div>
                            {serviceResults
                              .filter(r => r.type === 'practice')
                              .map((result) => (
                                <div
                                  key={`practice-${result.id}`}
                                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() => handleServiceSelect(result)}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{result.name}</p>
                                      <p className="text-xs text-gray-500">{result.subtitle}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Practitioners */}
                        {serviceResults.filter(r => r.type === 'practitioner').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Practitioners</p>
                            </div>
                            {serviceResults
                              .filter(r => r.type === 'practitioner')
                              .map((result) => (
                                <div
                                  key={`practitioner-${result.id}`}
                                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() => handleServiceSelect(result)}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{result.name}</p>
                                      <p className="text-xs text-gray-500">{result.subtitle}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-sm text-gray-500">No results found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="hidden sm:block h-6 w-[1px] bg-gray-600" />

              {/* Location Input */}
              <div className="relative w-full sm:w-1/2 flex items-center">
                <div className="flex items-center w-full">
                  <svg className="w-5 sm:w-9 h-5 text-gray-800 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Location, Suburb or postcode"
                    value={locationInput}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      // Clear selected location when user types
                      if (selectedFilters.location) {
                        setLocation(null);
                      }
                      setActiveDropdown("location");
                    }}
                    onFocus={() => setActiveDropdown("location")}
                    className="w-full outline-none text-gray-700 placeholder-gray-500 bg-transparent text-sm sm:text-base pr-8"
                  />
                  {locationInput && (
                    <button
                      onClick={() => {
                        setLocationInput("");
                        setLocation(null);
                        setLocationResults([]);
                        setActiveDropdown(null);
                      }}
                      className="absolute right-0 text-gray-800 hover:text-orange-500 p-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Location Dropdown */}
                {activeDropdown === "location" && locationInput && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-2 max-h-96 overflow-y-auto z-50 border border-gray-200">
                    {searchLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : locationResults.length > 0 ? (
                      locationResults.map((location, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{location.displayText}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-gray-500">No locations found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Discover the top dental clinics we've found for you.
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Expert-reviewed options tailored to your needs
            </p>
          </div>
          <a
            href="#explore"
            className="inline-flex items-center text-orange-600 font-semibold text-lg md:text-xl transition-colors duration-200 group"
          >
            Explore more
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="max-w-7xl mx-auto mt-10 px-4 lg:px-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-between shadow-md hover:bg-orange-700 transition-colors"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {filtersApplied && (
                <span className="ml-2 bg-white text-orange-600 text-xs px-2 py-1 rounded-full">
                  {selectedFilters.specialties.length +
                    selectedFilters.languages.length +
                    selectedFilters.genders.length +
                    selectedFilters.insurances.length +
                    selectedFilters.days.length +
                    (selectedFilters.service ? 1 : 0) +
                    (selectedFilters.location ? 1 : 0)}
                </span>
              )}
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* LEFT FILTERS */}
          <div
            className={`${showFilters ? "block" : "hidden"} rounded-lg lg:block w-full lg:w-80 lg:sticky lg:top-20 lg:h-fit lg:self-start mb-6 lg:mb-0`}
          >
            <div className="lg:hidden mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <Filters
              selectedLanguages={selectedFilters.languages}
              selectedGenders={selectedFilters.genders}
              selectedSpecialties={selectedFilters.specialties}
              selectedInsurances={selectedFilters.insurances}
              selectedAvailableDays={selectedFilters.days}
              onLanguageChange={setLanguages}
              onGenderChange={setGenders}
              onSpecialtyChange={setSpecialties}
              onInsuranceChange={setInsurances}
              onAvailableDaysChange={setDays}
              onClearAll={handleClearAllFilters}
              languages={filterOptions.languages}
              specialties={filterOptions.specialties}
              insuranceOptions={filterOptions.insurances}
              availableDaysOptions={sortedAvailableDaysOptions}
              genderOptions={filterOptions.genders}
            />
          </div>

          {/* RIGHT RESULTS */}
          <div className="flex-1 w-full min-w-0">
            {!showResults && (
              <div className="bg-white p-8 sm:p-12 rounded-lg shadow text-center">
                <svg className="w-16 h-16 text-orange-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  Find Your Perfect Clinic
                </h4>
                <p className="text-gray-500">
                  Use the filters on the left or the search bar above to discover dental clinics near you.
                </p>
              </div>
            )}

            {showResults && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                    {filterLoading
                      ? "Searching..."
                      : `Search Results (${clinics.length} clinic${clinics.length !== 1 ? "s" : ""} found)`}
                  </h3>
                </div>

                {filterLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Finding clinics...</p>
                    </div>
                  </div>
                ) : clinics.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6">
                    {clinics.map((clinic: any) => (
                      <div
                        key={clinic.id}
                        className="bg-white border border-gray-200 hover:border-orange-300 hover:ring-orange-500 ring-2 ring-transparent hover:translate-x-1 transition-transform duration-200 rounded-lg shadow-md hover:shadow-lg w-full"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                            <img
                              src={clinic.logo || "https://via.placeholder.com/100"}
                              alt={clinic.practice_name || "Clinic"}
                              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover mx-auto sm:mx-0 flex-shrink-0"
                            />

                            <div className="flex-1 text-center sm:text-left min-w-0">
                              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                {clinic.practice_name || "Unnamed Clinic"}
                              </h4>

                              <div className="space-y-3 mb-2">
                                <p className="flex items-center font-medium text-gray-900">
                                  <svg className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="break-words">
                                    {clinic.address || "Address not available"}
                                    {clinic.city && `, ${clinic.city}`}
                                    {clinic.state && `, ${clinic.state}`}
                                    {clinic.postcode && ` ${clinic.postcode}`}
                                  </span>
                                </p>

                                {clinic.practice_phone && (
                                  <p className="flex items-center text-gray-700">
                                    <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {clinic.practice_phone}
                                  </p>
                                )}

                                {clinic.practice_services &&
                                  clinic.practice_services.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {clinic.practice_services
                                        .slice(0, 3)
                                        .map((service: any) => (
                                          <span
                                            key={service.id}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                          >
                                            {service.name}
                                          </span>
                                        ))}
                                      {clinic.practice_services.length > 3 && (
                                        <span className="text-xs text-gray-500">
                                          +{clinic.practice_services.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                              </div>

                              <div className="flex justify-left mt-4">
                                <NavLink
                                  to={`/clinicprofile/${clinic.id}`}
                                  onClick={() => window.scrollTo(0, 0)}
                                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-xl transition-colors text-center font-medium text-sm sm:text-base"
                                >
                                  View Details
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h4 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                      No clinics found
                    </h4>
                    <p className="text-sm sm:text-base text-gray-500">
                      Try adjusting your filters or search criteria.
                    </p>
                    <button
                      onClick={handleClearAllFilters}
                      className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <ServicesSection />
      </div>
      <div>
        <BrowseByState />
      </div>
      <div>
        <ReviewCard />
      </div>
      <div>
        <BlogSection />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;