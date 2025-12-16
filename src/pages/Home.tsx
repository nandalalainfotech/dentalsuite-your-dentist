import ClinicService, { type Clinic } from "../services/ClinicService";
import { useEffect, useRef, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import Filters from "../components/Filters";
import ServicesSection from "../components/ServiceSection";
import ReviewCard from "../components/ReviewCard";
import BrowseByState from "../components/BrowseByState";
import BlogSection from "../components/BlogSection";
import Footer from "../components/layout/Footer";



const Home = () => {
  const [serviceInput, setServiceInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [serviceResults, setServiceResults] = useState<Clinic[]>([]);
  const [locationResults, setLocationResults] = useState<Clinic[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<"service" | "location" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [selectedAvailableDays, setSelectedAvailableDays] = useState<string[]>([]);

    
  // Filter options
  const [languages] = useState(ClinicService.getAllLanguages());
  const [specialties] = useState(ClinicService.getAllSpecialties());
  const genderOptions = ["male", "female", "other"];
  const insuranceOptions = useState(ClinicService.getAllInsurances())[0];
  const availableDaysOptions = useState(ClinicService.getAllAvailableDays())[0];
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showAllSlots, setShowAllSlots] = useState(false);

    // 🔹 Close dropdown on outside click
    useEffect(() => {
      const closeDropdown = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setActiveDropdown(null);
        }
      };
      document.addEventListener("mousedown", closeDropdown);
      return () => document.removeEventListener("mousedown", closeDropdown);
    }, []);
  
  
  useEffect(() => {
  const address = "";

  const stateCode = ClinicService.extractStateCode(address);
  console.log("State Code:", stateCode); // <-- will show CA

}, []);


  
    // 🔹 Filter clinics by service
    const handleServiceChange = (value: string) => {
      setServiceInput(value);
      setActiveDropdown("service");
  
      const results = ClinicService.searchClinics(value);
      setServiceResults(results);
    };
  
    // 🔹 Filter clinics by location
    const handleLocationChange = (value: string) => {
      setLocationInput(value);
      setActiveDropdown("location");
  
      const results = ClinicService.searchClinics(value);
      setLocationResults(results);
    };
  
  // 🔹 Clear service input
  const handleClearService = () => {
    setServiceInput("");
    setActiveDropdown(null);
  };

// 🔹 Clear location input
const handleClearLocation = () => {
  setLocationInput("");
  setActiveDropdown(null);
};
  

     // Update clearAllFilters to remove selectedServices reference:
  const clearAllFilters = () => {
    setServiceInput("");
    setLocationInput("");
    setSelectedLanguage([]);
    setSelectedGender([]);
    setSelectedSpecialty([]);
    setSelectedInsurance([]);
    setSelectedAvailableDays([]);
    setActiveDropdown(null);
  };

     // 🔹 Filter change functions for filters
     const handleLanguageChange = (languages: string[]) => {
       setSelectedLanguage(languages);
     };

     const handleGenderChange = (genders: string[]) => {
       setSelectedGender(genders);
     };

     const handleSpecialtyChange = (specialties: string[]) => {
       setSelectedSpecialty(specialties);
  };
  const handleInsuranceChange = (insurances: string[]) => {
    setSelectedInsurance(insurances);
  };
  const handleAvailableDaysChange = (days: string[]) => {
    setSelectedAvailableDays(days);
  };

     // 🔹 Calculate search results and show state based on filters
     const { searchResults, showResults } = useMemo(() => {
       const hasAnyFilter = serviceInput || locationInput ||
         selectedLanguage.length > 0 || selectedGender.length > 0 || 
         selectedSpecialty.length > 0 || selectedInsurance.length > 0 || selectedAvailableDays.length > 0;
       
        if (hasAnyFilter) {
          // Convert arrays to comma-separated strings for the service
          const filters = {
            service: serviceInput,
            location: locationInput,
            language: selectedLanguage.length > 0 ? selectedLanguage.join(',') : undefined,
            gender: selectedGender.length > 0 ? selectedGender.join(',') : undefined,
            specialty: selectedSpecialty.length > 0 ? selectedSpecialty.join(',') : undefined,
            insurance: selectedInsurance.length > 0 ? selectedInsurance.join(',') : undefined,
            availableDays: selectedAvailableDays.length > 0 ? selectedAvailableDays.join(',') : undefined,
          };
          
          return {
            searchResults: ClinicService.searchClinicsWithFilters(filters)??[],
            showResults: true
          };
        }
       
       return {
         searchResults: [],
         showResults: false
       };
     }, [serviceInput, locationInput, selectedLanguage, selectedGender, selectedSpecialty, selectedInsurance, selectedAvailableDays]);


return (
  <div className="w-full bg-gray-100 py-0 px-0">
     <div className="max-w mx-auto text-center">
  {/* Heading */}
  <div
    className="w-full bg-cover bg-center bg-no-repeat py-12 sm:py-16 md:py-20 lg:py-24 px-4"
    style={{
      backgroundImage: `url('/hero2.webp')`,
    }}
  >
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 leading-snug">
      Find <span className="text-black">Your Dentist</span> Nearby You.
    </h1>
    {/* Sub text */}
    <p className="text-white mt-3 text-sm sm:text-base md:text-lg">
      Find, book and add your favourite practitioners to your care team.
    </p>
    {/* Search Container */}
    <div className="w-full flex justify-center mt-10 px-4">
      <div
        ref={dropdownRef}
        className="
          flex flex-col sm:flex-row 
          items-center 
          bg-white 
          rounded-2xl sm:rounded-full
          shadow-md 
          px-4 sm:px-6 
          py-4 
          w-full max-w-2xl lg:max-w-4xl 
          border border-gray-200
          gap-3 sm:gap-0
        "
      >
        {/* Service Input */}
        <div className="relative w-full sm:w-1/2 flex items-center">
          <div className="flex items-center w-full">
            <svg
              className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Service, practice or practitioner"
              value={serviceInput}
              onChange={(e) => handleServiceChange(e.target.value)}
              onFocus={() => setActiveDropdown("service")}
              className="w-full outline-none text-gray-700 placeholder-gray-500 bg-transparent text-sm sm:text-base pr-8"
            />
            {/* Clear Service button */}
            {serviceInput && (
              <button
                onClick={handleClearService}
                className="absolute right-0 text-gray-800 hover:text-orange-500 p-1"
                title="Clear service"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {/* Service Dropdown - Single selection */}
          {activeDropdown === "service" && serviceInput && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 max-h-56 overflow-y-auto z-50">
              {serviceInput.trim() && serviceResults.length > 0 ? (
                serviceResults
                  .flatMap((clinic) =>
                    clinic.specialities.filter((spec) =>
                      spec.toLowerCase().includes(serviceInput.toLowerCase())
                    )
                  )
                  // Remove duplicates
                  .filter((spec, index, array) => array.indexOf(spec) === index)
                  .map((matchedSpec, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-orange-600 hover:text-white cursor-pointer text-left"
                      onClick={() => {
                        setServiceInput(matchedSpec);
                        setActiveDropdown(null);
                      }}
                    >
                      <p className="font-medium text-black hover:text-white">{matchedSpec}</p>
                    </div>
                  ))
              ) : serviceInput.trim() ? (
                <p className="font-medium text-gray-600 px-4 py-2">No results found</p>
              ) : null}
            </div>
          )}
        </div>
        {/* Divider (Desktop only) */}
        <div className="hidden sm:block h-6 w-[1px] bg-gray-600"></div>
        {/* Location Input */}
        <div className="relative w-full sm:w-1/2 flex items-center">
          <div className="flex items-center w-full">
            <svg
              className="w-9 h-5 text-gray-800 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Location, Suburb or postcode"
              value={locationInput}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => setActiveDropdown("location")}
              className="w-full outline-none text-gray-700 placeholder-gray-500 bg-transparent text-sm sm:text-base pr-8"
            />
            {/* Clear Location button */}
            {locationInput && (
              <button
                onClick={handleClearLocation}
                className="absolute right-0 text-gray-800 hover:text-orange-500 p-1"
                title="Clear location"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {/* Location Dropdown */}
          {activeDropdown === "location" && locationInput && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 max-h-56 overflow-y-auto z-50">
              {locationResults.length > 0 ? (
                locationResults.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="px-4 py-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-left"
                    onClick={() => {
                      setLocationInput(clinic.address);
                      setActiveDropdown(null);
                    }}
                  >
                    <p>{clinic.address}</p>
                  </div>
                ))
              ) : (
                <p className="font-medium text-gray-600 px-4 py-2">No results found</p>
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
            <svg 
              className="ml-2 w-5 h-5 md:w-5 md:h-4 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
      </div>  
    </div>
    
    {/* =================== LEFT FILTER + RIGHT RESULTS WRAPPER =================== */}
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
             {selectedLanguage.length > 0 || selectedGender.length > 0 || selectedSpecialty.length > 0 && (
               <span className="ml-2 bg-white text-orange-600 text-xs px-2 py-1 rounded-full">
                 {selectedLanguage.length + selectedGender.length + selectedSpecialty.length}
               </span>
             )}
           </span>
           <svg className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
         </button>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
         {/* ---------------- LEFT FILTERS ---------------- */}
          <div className={`${showFilters ? 'block' : 'hidden'} rounded-lg lg:block w-full lg:w-80 lg:sticky lg:top-20 lg:h-fit lg:self-start mb-6 lg:mb-0`}>
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
            selectedLanguages={selectedLanguage}
            selectedGenders={selectedGender}
            selectedSpecialties={selectedSpecialty}
            selectedInsurances={selectedInsurance}
            selectedAvailableDays={selectedAvailableDays}
            onLanguageChange={handleLanguageChange}
            onGenderChange={handleGenderChange}
            onSpecialtyChange={handleSpecialtyChange}
            onInsuranceChange={handleInsuranceChange}
            onAvailableDaysChange={handleAvailableDaysChange}
            onClearAll={clearAllFilters}
            languages={languages}
            specialties={specialties}
            insuranceOptions={insuranceOptions}
            availableDaysOptions={availableDaysOptions}
            genderOptions={genderOptions.map(gender => gender.charAt(0).toUpperCase() + gender.slice(1))}
            />
         </div>

         {/* ---------------- RIGHT SIDE SEARCH RESULTS ---------------- */}
         <div className="flex-1 w-full min-w-0">
           
           {/* Auto-show results when typing */}
           {showResults && (
             <>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                 <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                   Search Results ({searchResults.length} clinics found)
                 </h3>
                 {/* Mobile filter indicator */}
                 <div className="lg:hidden">
                   {(selectedLanguage.length > 0 || selectedGender.length > 0 || selectedSpecialty.length > 0 || selectedInsurance.length > 0 || selectedAvailableDays.length > 0) && (
                     <button
                       onClick={() => setShowFilters(true)}
                       className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                     >
                       Edit Filters
                     </button>
                   )}
                 </div>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {searchResults.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="bg-white border border-gray-200 hover:border-orange-300 hover:ring-orange-500 ring-2 ring-transparent hover:translate-x-1 transition-transform duration-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                           
                          {/* Profile Image */}
                          <img
                            src={clinic.logo || "https://via.placeholder.com/100"}
                            alt={clinic.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover mx-auto sm:mx-0 flex-shrink-0"
                          />
                            
                          {/* Clinic Name */}
                          <div className="flex-1 text-center sm:text-left min-w-0">
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                              {clinic.name}
                            </h4>
                            
                            {/* Address */}
                             <div className="space-y-3 mb-2">
                              <p className="flex items-center font-medium text-gray-900">
                                <svg className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="break-words">{clinic.address}</span>
                              </p>

                              { /* Rating */}
                              <div className="flex items-center gap-2 text-sm text-gray-900">
                                <div className="flex items-center font-bold gap-2">
                                  {(clinic.rating || 0)}
                                  <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(clinic.rating || 0) ?
                                          'text-yellow-500' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              
                              {/* Available Timing */}
                              <div className="flex-1">
                                  {clinic.dentists && clinic.dentists.length > 0 && clinic.dentists[0].slots ? (
                                    <>
                                      <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                                        Next Available:
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {(showAllSlots
                                          ? clinic.dentists[0].slots.filter(slot => slot.available)
                                          : clinic.dentists[0].slots.filter(slot => slot.available).slice(0, 4)
                                        ).map((slot, index) => (
                                          <span
                                            key={index}
                                            className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md border bg-green-50 text-green-700 border-green-200"
                                          >
                                            {slot.time}
                                          </span>
                                        ))}
                                      {!showAllSlots &&
                                        clinic.dentists[0].slots.filter(slot => slot.available).length > 4 && (
                                        <button
                                          className="px-2 py-1 text-xs text-blue-600 underline self-center"
                                          onClick={() => setShowAllSlots(true)}
                                        >
                                          +{clinic.dentists[0].slots.filter(slot => slot.available).length - 4} more
                                        </button>
                                        )}
                                    </div>
                                    
                                    {/* Optional: Show "Show Less" button */}
                                    {showAllSlots && (
                                      <button
                                        className="text-xs text-blue-600 underline mt-2"
                                        onClick={() => setShowAllSlots(false)}
                                      >
                                        Show Less
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500 italic">Call for availability</span>
                                )}
                              </div>
                            </div>
                             
                             {/* Buttons */}
                             <div className="flex justify-left mt-4">
                               <NavLink
                                 to={`/clinicprofile/${clinic.id}`}
                                 onClick={()=> window.scrollTo(0,0) }
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
                    <h4 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">No clinics found</h4>
                    <p className="text-sm sm:text-base text-gray-500">
                      Try adjusting your filters or search criteria.
                    </p>
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
  )
}
export default Home