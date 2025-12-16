import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ClinicService, {
  type Clinic,
  type Dentist,
} from "../services/ClinicService";

const ClinicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("basic-info");
  const [selectedDentist, setSelectedDentist] = useState<string>("");
  const [upcomingDates, setUpcomingDates] = useState<
    { date: Date; slots: string[] }[]
  >([]);

  // Section refs for scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Generate upcoming available dates with slots
  const generateUpcomingDates = (dentist: Dentist) => {
    const dates: { date: Date; slots: string[] }[] = [];
    const today = new Date();
    let daysChecked = 0;
    let dateCount = 0;

    while (dateCount < 2 && daysChecked < 30) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + daysChecked);
      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Check if dentist is available on this day
      if (dentist.availabledays?.includes(dayName)) {
        const availableSlots =
          dentist.slots
            ?.filter((slot) => slot.available)
            .map((slot) => slot.time) || [];

        if (availableSlots.length > 0) {
          dates.push({
            date: currentDate,
            slots: availableSlots,
          });
          dateCount++;
        }
      }
      daysChecked++;
    }

    setUpcomingDates(dates);
  };

  const sidebarLinks = [
    { id: "basic-info", label: "Basic Info", icon: "bi-info-circle" },
    { id: "services", label: "Services", icon: "bi-briefcase" },
    { id: "team", label: "Team", icon: "bi-people" },
    { id: "gallery", label: "Gallery", icon: "bi-images" },
    { id: "achievements", label: "Achievements", icon: "bi-trophy" },
    { id: "reviews", label: "Reviews", icon: "bi-chat-quote" },
    { id: "insurances", label: "Insurances", icon: "bi-shield-check" },
    { id: "facilities", label: "Facilities", icon: "bi-building" },
    { id: "contact", label: "Contact Us", icon: "bi-person-lines-fill" },
  ];

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const link of sidebarLinks) {
        const element = sectionRefs.current[link.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    const fetchClinic = () => {
      if (id) {
        const clinicData = ClinicService.getClinicById(id);
        setClinic(clinicData || null);

        // Set default dentist to first available
        if (clinicData?.dentists && clinicData.dentists.length > 0) {
          setSelectedDentist(clinicData.dentists[0].id);
        }
      }
      setLoading(false);
    };

    fetchClinic();
  }, [id]);

  // Update upcoming dates and slots when clinic or dentist changes
  useEffect(() => {
    if (clinic && selectedDentist) {
      const dentist = clinic.dentists?.find((d) => d.id === selectedDentist);
      if (dentist) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        generateUpcomingDates(dentist);
      }
    }
  }, [clinic, selectedDentist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading clinic details...
          </p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-exclamation-lg text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Clinic Not Found
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            The clinic you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section id="basic-info"
                ref={(el) => {
                  sectionRefs.current["basic-info"] = el;
                }}
                className="scroll-mt-20"></section>
      <div className="relative h-56 sm:h-64 md:h-80 w-full overflow-visible">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop"
          alt="Clinic Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Banner Overlay Content - Left Side */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 px-5 sm:px-7 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-end max-w-7xl mx-auto">
            {/* Clinic Info */}
            <div className="bg-black/60 backdrop-blur-sm px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg shadow-2xl flex-1">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 md:gap-4">
                {/* Clinic Information */}
                <div className="flex-1 w-full min-w-0">
                  {/* Clinic Name */}
                  <h1 className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 mb-0.5 sm:mb-1 md:mb-2 line-clamp-2 break-words">
                    <img
                      src={clinic.logo}
                      alt={clinic.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-orange-100 flex-shrink-0"
                    />
                    <span>{clinic.name.toUpperCase()}</span>
                  </h1>

                  {/* Address */}
                  <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                    <p className="font-medium line-clamp-1">{clinic.address}</p>
                  </div>

                  {/* Emergency Badge */}
                  {clinic.emergency !== undefined && (
                    <div className="flex items-center mb-1 sm:mb-2 gap-1 sm:gap-2">
                      {clinic.emergency ? (
                        <>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                          <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                            Emergency available
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                          <span className="text-red-600 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                            No emergency service
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-white/90 font-bold text-xs sm:text-sm md:text-base">
                      {clinic.rating || 0}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(clinic.rating || 0)
                              ? "text-yellow-500"
                              : "text-white-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-100 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Quick Links - Top Horizontal Navigation with Modern Scroll */}
      <div className="bg-white justify-center items-center sticky top-14 md:top-16 z-40 shadow-md border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-7">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100 hover:scrollbar-thumb-orange-500 scroll-smooth">
            <nav className="flex flex-row gap-2 py-3 min-w-max">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                    activeSection === link.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md"
                  }`}
                >
                  <i className={`bi ${link.icon} text-lg`}></i>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-5 py-7 ">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content Area - All Sections */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <main className="flex-1 min-w-0 space-y-10">
              {/* ==================== BASIC INFO SECTION ==================== */}
              <section
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-info-circle text-orange-600"></i>
                    Basic Info
                  </h2>
                </div>

                <div className="bg-white p-4 md:p-4">
                  {/* Description Card */}
                  <p className="text-gray-600 leading-relaxed">
                    {clinic.description}
                  </p>
                </div>
              </section>

              {/* ==================== SERVICES SECTION ==================== */}
              <section
                id="services"
                ref={(el) => {
                  sectionRefs.current["services"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-briefcase text-orange-600"></i>
                    Our Services
                  </h2>
                </div>

                <div className="flex flex-wrap p-4 md:p-4 gap-4">
                  {clinic.specialities.map((service, index) => (
                    <div
                      key={index}
                      className="px-3 py-3 font-medium text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all"
                    >
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ==================== TEAM SECTION ==================== */}
              <section
                id="team"
                ref={(el) => {
                  sectionRefs.current["team"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-people text-orange-600"></i>
                    Our Team
                  </h2>
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-1">
                    {clinic.dentists?.length || 0} Dentist
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinic.dentists?.map((dentist) => (
                    <TeamMemberCard key={dentist.id} dentist={dentist} />
                  ))}
                </div>
              </section>

              {/* ==================== GALLERY SECTION ==================== */}
              <section
                id="gallery"
                ref={(el) => {
                  sectionRefs.current["gallery"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-images text-orange-600"></i>
                    Gallery
                  </h2>
                </div>

                <div className="bg-white grid grid-cols-2 md:grid-cols-3 p-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="aspect-square bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-162990961365${item}-28e377c37b09?w=400&auto=format&fit=crop`}
                        alt={`Gallery ${item}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ==================== ACHIEVEMENTS SECTION ==================== */}
              <section
                id="achievements"
                ref={(el) => {
                  sectionRefs.current["achievements"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-trophy text-orange-600"></i>
                    Achievements
                  </h2>
                </div>

                <div className="bg-white grid grid-cols-1 p-4 md:p-4  md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-award text-yellow-600 text-2xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Best Dental Clinic 2023
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Healthcare Excellence Award
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-star text-blue-600 text-2xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      5-Star Rating
                    </h4>
                    <p className="text-gray-500 text-sm">
                      10,000+ Patient Reviews
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="bi bi-patch-check text-green-600 text-2xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      ISO Certified
                    </h4>
                    <p className="text-gray-500 text-sm">
                      International Standards
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================== REVIEWS SECTION ====================*/}
              <section
                id="reviews"
                ref={(el) => {
                  sectionRefs.current["reviews"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-chat-quote text-orange-600"></i>
                    Reviews
                  </h2>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="bi bi-person text-orange-600 text-xl"></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              Patient {item}
                            </h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className="bi bi-star-fill text-sm"
                                ></i>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">
                            Excellent service and very professional staff. The
                            clinic is modern and clean. Highly recommended for
                            anyone looking for quality dental care.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ==================== INSURANCES SECTION ==================== */}
              <section
                id="insurances"
                ref={(el) => {
                  sectionRefs.current["insurances"] = el;
                }}
                className="scroll-mt-28 md:scroll-mt-24 lg:scroll-mt-28"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-shield-check text-orange-600"></i>
                    Insurances
                  </h2>
                </div>

                {/* Insurance content goes here */}
                {clinic.insurance && clinic.insurance.length > 0 ? (
                  <div className="flex flex-wrap p-4 md:p-4 gap-4">
                    {clinic.insurance.map((insurance, index) => (
                      <div
                        key={index}
                        className="px-3 py-3 font-medium text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all"
                      >
                        <span>{insurance}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="bi bi-info-circle text-xl mb-2 block"></i>
                    <p>No insurance information available</p>
                  </div>
                )}
              </section>

              {/* ==================== FACILITIES SECTION ==================== */}
              <section
                id="facilities"
                ref={(el) => {
                  sectionRefs.current["facilities"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-building text-orange-600"></i>
                    Our Facilities
                  </h2>
                </div>

                {/* Facilities content goes here */}
                {clinic.facilities && clinic.facilities.length > 0 && (
                  <div className="flex flex-wrap p-4 md:p-4 gap-4">
                    {clinic.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="px-3 py-3 font-medium text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all"
                      >
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ==================== CONTACT US ==================== */}
              <section
                id="contact"
                ref={(el) => {
                  sectionRefs.current["contact"] = el;
                }}
                className="scroll-mt-24"
              >
                {/* Header */}
                <div className="mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-person-lines-fill text-orange-600"></i>
                    Contact Us
                  </h2>
                </div>

                {/* ==================== LOCATION ==================== */}
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="bi bi-geo-alt text-orange-500"></i>
                    Location
                  </h4>

                  <div className="h-72 bg-gray-100 rounded-xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps?q=Melbourne%20Family%20Dental&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* ==================== OPENING HOURS ==================== */}
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="bi bi-clock text-orange-500"></i>
                    Opening Hours
                  </h4>

                  <div className="space-y-2">
                    {[
                      { day: "Monday", time: "08:00 AM - 06:00 PM" },
                      { day: "Tuesday", time: "08:00 AM - 06:00 PM" },
                      { day: "Wednesday", time: "08:00 AM - 06:00 PM" },
                      { day: "Thursday", time: "08:00 AM - 06:00 PM" },
                      { day: "Friday", time: "08:00 AM - 06:00 PM" },
                      { day: "Saturday", time: "08:00 AM - 03:00 PM" },
                      { day: "Sunday", time: "Closed" },
                    ].map(({ day, time }) => (
                      <div
                        key={day}
                        className={`flex justify-between items-center px-4 py-3 rounded-md
            ${
              time === "Closed"
                ? "bg-red-50 text-red-500"
                : "bg-gray-100 text-gray-700"
            }`}
                      >
                        <span className="font-medium">{day}</span>
                        <span
                          className={time === "Closed" ? "font-semibold" : ""}
                        >
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ==================== GET IN TOUCH ==================== */}
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="bi bi-chat-dots text-orange-500"></i>
                    Get in Touch
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <i className="bi bi-telephone text-orange-500"></i>
                      <span>+61 3 9003 2211</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <i className="bi bi-envelope text-orange-500"></i>
                      <span>info@melbournefamilydental.com.au</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg sm:col-span-2">
                      <i className="bi bi-globe text-orange-500"></i>
                      <a
                        href="https://melbournefamilydental.com.au"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://melbournefamilydental.com.au
                      </a>
                    </div>
                  </div>
                </div>

                {/* ==================== FOLLOW US ==================== */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="bi bi-share text-orange-500"></i>
                    Follow Us
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl flex justify-center">
                      <i className="bi bi-facebook text-blue-600 text-2xl" />
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl flex justify-center">
                      <i className="bi bi-instagram text-pink-600 text-2xl" />
                    </div>
                    <div className="p-4 bg-sky-50 rounded-xl flex justify-center">
                      <i className="bi bi-twitter text-sky-500 text-2xl" />
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl flex justify-center">
                      <i className="bi bi-youtube text-red-600 text-2xl" />
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>

          {/* Right Sidebar - Book Appointment Widget */}
          <aside className="w-full lg:w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-35 h-fit">
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  Book appointment
                </h3>
              </div>

              {/* Dropdowns */}
              <div className="p-5 space-y-4">
                {/* Service Type Dropdown */}
                <div className="relative">
                  <select
                    defaultValue="dentistry"
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-600 transition-colors appearance-none cursor-pointer hover:border-gray-300 text-gray-700"
                  >
                    <option value="dentistry">Dentistry</option>
                    {clinic?.specialities.map((service, index) => (
                      <option key={index} value={service.toLowerCase()}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <i className="bi bi-chevron-down text-gray-400 text-sm"></i>
                  </div>
                </div>

                {/* Practitioner Dropdown */}
                <div className="relative">
                  <select
                    value={selectedDentist}
                    onChange={(e) => setSelectedDentist(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-600 transition-colors appearance-none cursor-pointer hover:border-gray-300 text-gray-700"
                  >
                    <option value="">All practitioners</option>
                    {clinic?.dentists?.map((dentist) => (
                      <option key={dentist.id} value={dentist.id}>
                        {dentist.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <i className="bi bi-chevron-down text-gray-400 text-sm"></i>
                  </div>
                </div>

                {/* Date Sections */}
                {upcomingDates.map((dateData, index) => (
                  <div key={index} className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {dateData.date.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dateData.slots.slice(0, 3).map((time, slotIndex) => (
                        <button
                          key={slotIndex}
                          className="px-3 py-1.5 text-sm rounded-full border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                      {dateData.slots.length > 3 && (
                        <button className="px-3 py-1.5 text-sm text-orange-600 hover:underline transition-colors">
                          Show all
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* See all appointments button */}
                <button
                  onClick={() => scrollToSection("appointment")}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  See all appointments
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Team Member Card Component
const TeamMemberCard = ({ dentist }: { dentist: Dentist }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm h-full flex flex-col">
      {/* Image */}
      <div className="pt-8 flex justify-center">
        <img
          src={dentist.image}
          alt={dentist.name}
          className="w-28 h-28 rounded-full object-cover shadow"
        />
      </div>

      {/* Info */}
      <div className="flex-1 px-6 pt-6 text-center">
        <h4 className="font-bold text-lg text-gray-900">{dentist.name}</h4>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {dentist.qualification}
        </p>
      </div>

      {/* Actions (always bottom aligned) */}
      <div className="pb-6 pt-4 flex justify-center gap-4">
        <button
          className="px-6 py-2 rounded-full border border-gray-300 text-sm 
          font-semibold hover:border-orange-500 hover:text-orange-600"
        >
          Profile
        </button>

        <button
          className="px-6 py-2 rounded-full bg-orange-600 text-white
          text-sm font-semibold hover:text-gray-900"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default ClinicProfile;
