import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Footer from "../components/layout/Footer";
import bannerimage from "../assets/banner.webp"
import defaultLogo from "../assets/logo.svg"
import BookingModal from "../components/booking/BookingModal";
import { usePractitionerProfile } from "../features/patient/dentistprofile/practitionerProfile.hooks";

const DentistProfile = () => {
  const { id: dentistId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the hook to fetch practitioner data
  const { practitioner, loading, error } = usePractitionerProfile(dentistId);

  const [selectedService, setSelectedService] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: "bi-info-circle" },
    { id: "practitioner-information", label: "Practitioner Information", icon: "bi-person-circle" },
    { id: "practice-information", label: "Practice Information", icon: "bi-building" },
  ];

  // Set default service
  useEffect(() => {
    if (practitioner?.practitioner_practice_services && practitioner.practitioner_practice_services.length > 0) {
      setSelectedService(practitioner.practitioner_practice_services[0].practice_service.name);
    }
  }, [practitioner]);

  // Function to update active section based on scroll position
  const updateActiveSection = useCallback(() => {
    const scrollPosition = window.scrollY + 150; // Offset for header/sticky elements

    // Find which section is currently in view
    for (const section of sidebarLinks) {
      const element = sectionRefs.current[section.id];
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
          }
          break;
        }
      }
    }
  }, [activeSection, sidebarLinks]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection);
    // Call once to set initial active section
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [updateActiveSection]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Format time helper
  const formatTime = (time: string): string => {
    if (!time) return '';
    const timeParts = time.split(':');
    if (timeParts.length >= 2) {
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return time;
  };

  // Format opening hours
  const formatOpeningHours = () => {
    if (!practitioner?.practice_info?.practice_opening_hours) return [];

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return daysOrder.map(day => {
      const dayHours = practitioner.practice_info.practice_opening_hours.find(
        h => h.day_of_week.toLowerCase() === day.toLowerCase()
      );

      if (dayHours && dayHours.is_open) {
        if (dayHours.time_slots && dayHours.time_slots.length > 0) {
          const slots = dayHours.time_slots.map(slot =>
            `${formatTime(slot.start)} - ${formatTime(slot.end)}`
          ).join(', ');
          return { day, time: slots, isClosed: false };
        }
        return { day, time: 'Open', isClosed: false };
      }
      return { day, time: 'Closed', isClosed: true };
    });
  };

  // Format languages
  const getLanguages = (): string[] => {
    if (!practitioner?.languages) return ['English'];

    // If languages is an array of objects like [{ name: "English" }]
    if (Array.isArray(practitioner.languages)) {
      return practitioner.languages.map((lang: any) => {
        if (typeof lang === 'string') return lang;
        if (lang.name) return lang.name;
        return 'Unknown';
      });
    }

    return ['English'];
  };

  // Get full name
  const getFullName = (): string => {
    if (!practitioner) return '';
    return `${practitioner.first_name} ${practitioner.last_name || ''}`.trim();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm sm:text-base">
            Loading practitioner details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !practitioner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-exclamation-lg text-3xl text-red-500"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Practitioner Not Found
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm sm:text-base">
            {error || "The practitioner you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => {
              const referrer = sessionStorage.getItem('dentistFromClinic');
              if (referrer) {
                navigate(referrer);
                sessionStorage.removeItem('dentistFromClinic');
              } else {
                navigate(-1);
              }
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const openingHours = formatOpeningHours();
  const languages = getLanguages();
  const fullName = getFullName();

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        id="overview"
        ref={(el) => { sectionRefs.current["overview"] = el; }}
        className="scroll-mt-24"
      ></section>

      {/* Hero Banner */}
      <section
        id="overview"
        ref={(el) => { sectionRefs.current["overview"] = el; }}
        className="scroll-mt-36"
      >
        <div className="relative h-56 sm:h-64 md:h-80 w-full overflow-visible">
          <img
            src={practitioner.practice_info?.banner_image ? practitioner.practice_info?.banner_image : bannerimage}
            alt="Clinic Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Banner Overlay Content */}
          <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto flex justify-start">
              <div className="bg-black/60 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-2xl">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-start gap-2">
                    {/* Profile Image */}
                    <img
                      src={practitioner.image || defaultLogo}
                      alt={fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white flex-shrink-0"
                    />

                    {/* Practitioner Details */}
                    <div className="flex flex-col">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                        {fullName}
                      </h1>

                      <p className="text-sm md:text-base text-gray-200 mt-1 flex items-center flex-wrap gap-1">
                        {/* <i className="bi bi-star-fill text-yellow-400 text-xs mr-1"></i> */}
                        {practitioner.practitioner_practice_services?.slice(0, 3).map((service, index) => (
                          <span key={index} className="inline-flex items-center">
                            <span className="text-gray-200">{service.practice_service.name}</span>
                            {index < Math.min(2, (practitioner.practitioner_practice_services?.slice(0, 3).length || 0) - 1) && (
                              <span className="mx-1 text-gray-400">•</span>
                            )}
                          </span>
                        ))}
                        {practitioner.practitioner_practice_services?.length > 3 && (
                          <span className="inline-flex items-center gap-1 text-yellow-300 text-xs font-medium ml-1">
                            <i className="bi bi-plus-circle-fill text-[10px]"></i>
                            +{practitioner.practitioner_practice_services.length - 3} more
                          </span>
                        )}
                        {(!practitioner.practitioner_practice_services || practitioner.practitioner_practice_services.length === 0) && (
                          <span className="text-gray-300 italic">Dental Services</span>
                        )}
                      </p>

                      {practitioner.is_visible_online && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-green-600 text-white text-xs font-semibold shadow-sm w-fit">
                          <i className="bi bi-check-circle-fill"></i>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => {
              const referrer = sessionStorage.getItem('dentistFromClinic');
              if (referrer) {
                navigate(referrer);
                sessionStorage.removeItem('dentistFromClinic');
              } else {
                navigate(-1);
              }
            }}
            className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-4 bg-gray-100 backdrop-blur-sm hover:bg-white text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm font-medium"
          >
            <i className="bi bi-arrow-left"></i>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </section>

      {/* Quick Links */}
      <div className="bg-white sticky top-12 md:top-16 z-40 shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-5 lg:px-7">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
            <nav className="flex gap-1.5 sm:gap-2 py-2 sm:py-3 min-w-max">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-medium ${activeSection === link.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                >
                  <i className={`bi ${link.icon}`}></i>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-5 lg:px-7 py-4 sm:py-6 md:py-7">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-5">

          {/* Booking Widget */}
          <aside className="w-full lg:w-80 flex-shrink-0 order-first lg:order-last mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit lg:sticky lg:top-36">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  Book appointment
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Show times for
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  >
                    {practitioner.practitioner_practice_services?.map((service) => (
                      <option key={service.practice_service_id} value={service.practice_service.name}>
                        {service.practice_service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => {
                    sessionStorage.setItem('bookingReferrer', `/dentist/${dentistId}`);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-md text-sm sm:text-base"
                >
                  See all appointments
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 order-last lg:order-first">
            <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100">
              <main className="space-y-6 sm:space-y-8 md:space-y-10">

                {/* Overview */}
                <section
                  id="overview"
                  ref={(el) => { sectionRefs.current["overview"] = el; }}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 sm:mb-6 border-b-4 border-orange-400">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <i className="bi bi-info-circle text-orange-600"></i>
                      Overview
                    </h2>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {practitioner.professional_statement || `${fullName} is a dedicated dental professional committed to providing quality care.`}
                    </p>
                  </div>
                </section>

                {/* Practitioner Information */}
                <section
                  id="practitioner-information"
                  ref={(el) => { sectionRefs.current["practitioner-information"] = el; }}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 sm:mb-6 border-b-4 border-orange-400">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <i className="bi bi-person-circle text-orange-600"></i>
                      Practitioner Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Languages */}
                    <div className="pl-2 sm:pl-3">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="bi bi-translate text-orange-600"></i>
                        Languages Spoken
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2 pl-4 sm:pl-6">
                        {languages.map((lang, index) => (
                          <li key={index} className="text-sm sm:text-base text-gray-700">
                            {lang}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Services */}
                    <div className="pl-2 sm:pl-3">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="bi bi-person-heart text-orange-600"></i>
                        Services
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2 pl-4 sm:pl-6">
                        {practitioner.practitioner_practice_services?.map((service) => (
                          <li key={service.practice_service_id} className="text-sm sm:text-base text-gray-700">
                            {service.practice_service.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Education & Qualifications */}
                  {(practitioner.education || practitioner.ahpra_number) && (
                    <div className="mt-6 sm:mt-8 pl-2 sm:pl-3">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="bi bi-mortarboard text-orange-600"></i>
                        Education & Credentials
                      </h4>
                      <div className="space-y-2 pl-4 sm:pl-6">
                        {practitioner.education && (
                          <p className="text-sm sm:text-base text-gray-700">{practitioner.education}</p>
                        )}
                        {practitioner.ahpra_number && (
                          <p className="text-sm sm:text-base text-gray-600">
                            AHPRA Number: <span className="font-mono font-semibold">{practitioner.ahpra_number}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                {/* Practice Information */}
                <section
                  id="practice-information"
                  ref={(el) => { sectionRefs.current["practice-information"] = el; }}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 sm:mb-6 border-b-4 border-orange-400">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <i className="bi bi-building-fill text-orange-600"></i>
                      Practice Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Contact Info */}
                    <div className="pl-2 sm:pl-3 space-y-3 sm:space-y-4">
                      <div>
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <i className="bi bi-geo-alt-fill text-orange-600"></i>
                          Address
                        </h4>
                        <p className="pl-4 sm:pl-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                          {practitioner.practice_info.address}
                          <br />
                          {practitioner.practice_info.city}, {practitioner.practice_info.state} {practitioner.practice_info.postcode}
                        </p>
                      </div>

                      {practitioner.practice_info.practice_base_info?.website && (
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <i className="bi bi-globe text-orange-500"></i>
                            Website
                          </h4>
                          <a
                            href={practitioner.practice_info.practice_base_info.website}
                            target="_blank"
                            rel="noreferrer"
                            className="pl-4 sm:pl-6 text-blue-600 hover:underline break-all text-sm sm:text-base"
                          >
                            {practitioner.practice_info.practice_base_info.website}
                          </a>
                        </div>
                      )}

                      {practitioner.practice_info.practice_phone && (
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <i className="bi bi-telephone-fill text-orange-500"></i>
                            Phone
                          </h4>
                          <a
                            href={`tel:${practitioner.practice_info.practice_phone}`}
                            className="pl-4 sm:pl-6 text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base"
                          >
                            {practitioner.practice_info.practice_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Opening Hours */}
                    <div className="pl-2 sm:pl-3">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="bi bi-clock-fill text-orange-600"></i>
                        Opening Hours
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 pl-4 sm:pl-5">
                        {openingHours.map(({ day, time, isClosed }) => (
                          <div
                            key={day}
                            className={`flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm ${isClosed ? "text-red-500" : "text-gray-700"
                              }`}
                          >
                            <span className="font-medium">{day}</span>
                            <span className={isClosed ? "font-semibold" : ""}>{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

              </main>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        clinic={practitioner.practice_info}
        selectedDentistId={dentistId}
      />
    </div>
  );
};

export default DentistProfile;