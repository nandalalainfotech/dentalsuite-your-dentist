import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import BookingModal from "../components/booking/BookingModal";
import Footer from "../components/layout/Footer";
import bannerimage from "../assets/banner.webp"
import { clinicProfileApi } from "../features/patient/clinisprofile/clinicProfile.service";
import type { ClinicProfileData, PracticeTeamMember } from "../features/patient/clinisprofile/clinicProfile.types";

const ClinicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<ClinicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("basic-info");
  const [selectedDentist, setSelectedDentist] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const sidebarLinks = [
    { id: "basic-info", label: "Basic Info", icon: "bi-info-circle" },
    { id: "services", label: "Services", icon: "bi-briefcase" },
    { id: "team", label: "Team", icon: "bi-people" },
    { id: "gallery", label: "Gallery", icon: "bi-images" },
    { id: "achievements", label: "Achievements", icon: "bi-trophy" },
    { id: "certifications", label: "Certifications", icon: "bi-award" }, // New separate item
    { id: "insurances", label: "Insurances", icon: "bi-shield-check" },
    { id: "facilities", label: "Facilities", icon: "bi-building" },
    { id: "contact", label: "Contact Us", icon: "bi-person-lines-fill" },
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying] = useState<boolean>(true);

  // ✅ SINGLE API CALL - Fetch all clinic data
  useEffect(() => {
    const fetchClinic = async () => {
      if (!id) {
        setError('Clinic ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const clinicData = await clinicProfileApi.getClinicById(id);
        console.log('Received clinic data:', clinicData);
        setClinic(clinicData);

        if (clinicData?.practice_team_members && clinicData.practice_team_members.length > 0) {
          setSelectedDentist(clinicData.practice_team_members[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching clinic:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch clinic details');
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [id]);

  // Gallery images from API
  const galleryImages = useMemo(() => {
    if (clinic?.practice_galleries?.length) {
      return clinic.practice_galleries.map(img => img.image_url);
    }
    return [];
  }, [clinic]);

  // Only show sidebar links for sections that have data
  const availableLinks = useMemo(() => {
    return sidebarLinks.filter(link => {
      switch (link.id) {
        case 'basic-info':
        case 'contact':
          return true;
        case 'services':
          return !!clinic?.practice_services?.length;
        case 'team':
          return !!clinic?.practice_team_members?.length;
        case 'gallery':
          return galleryImages.length > 0;
        case 'achievements':
          return !!clinic?.practice_achievements?.length;
        case 'certifications':
          return !!clinic?.practice_certifications?.length;
        case 'insurances':
          return !!clinic?.practice_insurances?.length;
        case 'facilities':
          return !!clinic?.practice_facilities?.length;
        default:
          return true;
      }
    });
  }, [clinic, galleryImages]);

  // Auto-play gallery
  useEffect(() => {
    if (!isAutoPlaying || galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length, isAutoPlaying]);

  // Scroll to section
  const scrollToSection = (sectionId: string): void => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const link of availableLinks) {
        const element = sectionRefs.current[link.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [availableLinks]);

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
    if (!clinic?.practice_opening_hours) return {};
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours: { [key: string]: string } = {};

    daysOrder.forEach(day => {
      const dayHours = clinic.practice_opening_hours.find(
        h => h.day_of_week.toLowerCase() === day.toLowerCase()
      );

      if (dayHours && dayHours.is_open) {
        if (dayHours.time_slots && dayHours.time_slots.length > 0) {
          const slots = dayHours.time_slots.map(slot =>
            `${formatTime(slot.start)} - ${formatTime(slot.end)}`
          ).join(', ');
          hours[day] = slots;
        } else {
          hours[day] = 'Open';
        }
      } else {
        hours[day] = 'Closed';
      }
    });

    return hours;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse text-base sm:text-lg">
            Loading clinic details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-exclamation-lg text-3xl text-red-500"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Clinic Not Found
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm sm:text-base">
            {error || "The clinic you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const openingHours = formatOpeningHours();

  return (
    <>
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        clinic={clinic}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <section
          id="basic-info"
          ref={(el) => { sectionRefs.current["basic-info"] = el; }}
          className="scroll-mt-36"
        >
          <div className="relative h-56 sm:h-64 md:h-80 w-full overflow-visible">
            <img
              src={clinic.banner_image ? clinic.banner_image : bannerimage}
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
                      {/* Logo */}
                      <img
                        src={clinic.logo || "https://via.placeholder.com/100"}
                        alt={clinic.practice_name || "Clinic"}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white flex-shrink-0"
                      />

                      {/* Clinic Details */}
                      <div className="flex flex-col">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                          {clinic.practice_name || "Clinic Name"}
                        </h1>

                        <p className="text-sm md:text-base text-gray-200 mt-1">
                          {[clinic.city, clinic.state, clinic.postcode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-4 bg-gray-100 backdrop-blur-sm hover:bg-white text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm font-medium"
            >
              <i className="bi bi-arrow-left"></i>
              <span className="font-medium">Back</span>
            </button>
          </div>
        </section>

        {/* Quick Links */}
        <div className="bg-white justify-center items-center sticky top-12 md:top-16 z-40 shadow-md border-b-1 border-gray-100">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-5 lg:px-7">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100 hover:scrollbar-thumb-orange-500 scroll-smooth">
              <nav className="flex flex-row gap-1.5 sm:gap-2 py-2 sm:py-3 min-w-max">
                {availableLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 font-medium ${activeSection === link.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md"
                      }`}
                  >
                    <i className={`bi ${link.icon} text-sm sm:text-base`}></i>
                    <span className="hidden sm:inline">{link.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-5 lg:px-7 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-5">
            {/* BOOK APPOINTMENT WIDGET */}
            <aside className="w-full lg:w-80 flex-shrink-0 mx-auto lg:mx-0 order-first lg:order-last mb-6 lg:mb-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit lg:sticky lg:top-35">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Book appointment
                  </h3>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Service Type Dropdown */}
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-600 transition-colors appearance-none cursor-pointer hover:border-gray-300 text-gray-700 text-sm sm:text-base"
                    >
                      <option value="">Select Service</option>
                      {clinic?.practice_services?.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
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
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-orange-600 transition-colors appearance-none cursor-pointer hover:border-gray-300 text-gray-700 text-sm sm:text-base"
                    >
                      <option value="">All practitioners</option>
                      {clinic?.practice_team_members?.map((member) => (
                        <option key={member.id} value={member.id}>
                          {`${member.first_name} ${member.last_name || ''}`}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <i className="bi bi-chevron-down text-gray-400 text-sm"></i>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => {
                      sessionStorage.setItem('bookingReferrer', `/clinicprofile/${id}`);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 order-last lg:order-first">
              <div className="bg-white p-4 sm:p-6 md:p-10 rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <main className="flex-1 min-w-0 space-y-6 sm:space-y-8 md:space-y-10">

                  {/* BASIC INFO */}
                  <section>
                    <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <i className="bi bi-info-circle text-orange-600 text-sm sm:text-base"></i>
                        Basic Info
                      </h2>
                    </div>
                    <div className="bg-white p-2 sm:p-3 md:p-4">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {clinic.description || "No description available."}
                      </p>
                    </div>
                  </section>

                  {!!clinic?.practice_services?.length && (
                    <section
                      id="services"
                      ref={(el) => { sectionRefs.current["services"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-briefcase text-orange-600 text-sm sm:text-base"></i>
                          Our Services
                        </h2>
                      </div>
                      <div className="flex flex-wrap p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4">
                        {clinic.practice_services?.map((service) => (
                          <div
                            key={service.id}
                            className="px-3 py-2 font-medium text-sm text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all cursor-pointer"
                          >
                            <span>{service.name}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {!!clinic?.practice_team_members?.length && (
                    <section
                      id="team"
                      ref={(el) => { sectionRefs.current["team"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-people text-orange-600 text-sm sm:text-base"></i>
                          Our Team
                        </h2>
                        <span className="bg-orange-100 text-orange-600 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-1">
                          {clinic.practice_team_members?.length || 0} Member
                          {clinic.practice_team_members?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="p-2 sm:p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {clinic.practice_team_members?.map((member) => (
                          <TeamMemberCard
                            key={member.id}
                            dentist={member}
                            clinic={clinic}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {galleryImages.length > 0 && (
                    <section
                      id="gallery"
                      ref={(el: HTMLElement | null) => { sectionRefs.current["gallery"] = el; }}
                      className="scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-images text-orange-600 text-sm sm:text-base"></i>
                          Gallery
                        </h2>
                      </div>

                      <div className="bg-gray-700 p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl">
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg">
                          <div className="relative">
                            <div
                              className="flex transition-transform duration-300 ease-out"
                              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                              {galleryImages.map((imageSrc, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-1 sm:px-2">
                                  <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
                                    <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/9]">
                                      <img
                                        src={imageSrc}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                        loading={index < 3 ? "eager" : "lazy"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Navigation */}
                            <button
                              onClick={() => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all shadow-lg"
                            >
                              <i className="bi bi-chevron-left text-base sm:text-lg md:text-xl"></i>
                            </button>
                            <button
                              onClick={() => setCurrentSlide((prev) => (prev + 1) % galleryImages.length)}
                              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all shadow-lg"
                            >
                              <i className="bi bi-chevron-right text-base sm:text-lg md:text-xl"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {!!clinic?.practice_achievements?.length && (
                    <section
                      id="achievements"
                      ref={(el) => { sectionRefs.current["achievements"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-trophy text-orange-600 text-sm sm:text-base"></i>
                          Achievements
                        </h2>
                        <span className="bg-orange-100 text-orange-600 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-1">
                          {clinic.practice_achievements?.length || 0}
                        </span>
                      </div>

                      <div className="p-2 sm:p-3 md:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {clinic.practice_achievements.map((achievement) => (
                            <div
                              key={achievement.id}
                              className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100 hover:shadow-lg transition-all group"
                            >
                              {achievement.image_url && (
                                <div className="relative mb-4">
                                  <img
                                    src={achievement.image_url}
                                    alt={achievement.title}
                                    className="w-20 h-20 mx-auto object-contain group-hover:scale-110 transition-transform"
                                  />
                                </div>
                              )}
                              <h4 className="font-bold text-gray-900 text-center mb-2">{achievement.title}</h4>
                              {achievement.description && (
                                <p className="text-sm text-gray-600 text-center">{achievement.description}</p>
                              )}
                              {(achievement.award_year || achievement.awarded_by) && (
                                <div className="mt-3 pt-3 border-t border-yellow-200">
                                  {achievement.award_year && (
                                    <p className="text-xs text-gray-500 text-center">
                                      <i className="bi bi-calendar mr-1"></i> {achievement.award_year}
                                    </p>
                                  )}
                                  {achievement.awarded_by && (
                                    <p className="text-xs text-gray-500 text-center mt-1">
                                      <i className="bi bi-building mr-1"></i> {achievement.awarded_by}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {!!clinic?.practice_certifications?.length && (
                    <section
                      id="certifications"
                      ref={(el) => { sectionRefs.current["certifications"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-award text-orange-600 text-sm sm:text-base"></i>
                          Certifications
                        </h2>
                        <span className="bg-orange-100 text-orange-600 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-1">
                          {clinic.practice_certifications?.length || 0}
                        </span>
                      </div>

                      <div className="p-2 sm:p-3 md:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {clinic.practice_certifications.map((cert) => (
                            <div
                              key={cert.id}
                              className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100 hover:shadow-lg transition-all group"
                            >
                              {cert.image_url && (
                                <div className="relative mb-4">
                                  <img
                                    src={cert.image_url}
                                    alt={cert.title}
                                    className="w-20 h-20 mx-auto object-contain group-hover:scale-110 transition-transform"
                                  />
                                </div>
                              )}
                              <h4 className="font-bold text-gray-900 text-center mb-2">{cert.title}</h4>
                              {cert.issuing_authority && (
                                <p className="text-sm text-blue-600 text-center mb-2">
                                  <i className="bi bi-building mr-1"></i> {cert.issuing_authority}
                                </p>
                              )}
                              {cert.certification_number && (
                                <p className="text-xs text-gray-500 text-center mb-2">
                                  <i className="bi bi-hash mr-1"></i> {cert.certification_number}
                                </p>
                              )}
                              <div className="mt-3 pt-3 border-t border-yellow-200">
                                {(cert.issued_date || cert.expiry_date) && (
                                  <div className="space-y-1">
                                    {cert.issued_date && (
                                      <p className="text-xs text-gray-500 text-center">
                                        <i className="bi bi-calendar-check mr-1"></i> Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                      </p>
                                    )}
                                    {cert.expiry_date && (
                                      <p className="text-xs text-gray-500 text-center">
                                        <i className="bi bi-calendar-x mr-1"></i> Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {!!clinic?.practice_insurances?.length && (
                    <section
                      id="insurances"
                      ref={(el) => { sectionRefs.current["insurances"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-shield-check text-orange-600 text-sm sm:text-base"></i>
                          Accepted Insurances
                        </h2>
                      </div>

                      <div className="flex flex-wrap p-4 gap-3 sm:gap-4">
                        {clinic.practice_insurances.map((insurance) => (
                          <div
                            key={insurance.id}
                            className="px-3 py-2 font-medium text-sm text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all"
                          >
                            <span>{insurance.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {!!clinic?.practice_facilities?.length && (
                    <section
                      id="facilities"
                      ref={(el) => { sectionRefs.current["facilities"] = el; }}
                      className="scroll-mt-36"
                    >
                      <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <i className="bi bi-building text-orange-600 text-sm sm:text-base"></i>
                          Our Facilities
                        </h2>
                      </div>

                      <div className="flex flex-wrap p-4 gap-3 sm:gap-4">
                        {clinic.practice_facilities.map((facility) => (
                          <div
                            key={facility.id}
                            className="px-3 py-2 font-medium text-sm text-gray-800 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 rounded-full border-2 transition-all"
                          >
                            <span>{facility.facility_name}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CONTACT US */}
                  <section
                    id="contact"
                    ref={(el) => { sectionRefs.current["contact"] = el; }}
                    className="scroll-mt-36"
                  >
                    <div className="mb-6 border-b-4 border-orange-400">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <i className="bi bi-person-lines-fill text-orange-500 text-sm sm:text-base"></i>
                        Contact Us
                      </h2>
                    </div>

                    {/* Address */}
                    <div className="mb-10">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="bi bi-building-fill text-orange-500"></i>
                        Address
                      </h4>
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <i className="bi bi-geo-alt-fill text-orange-500 mt-1"></i>
                        <span>
                          {clinic.address || "Address not available"}
                          <br />
                          {clinic.city && `${clinic.city}, `}
                          {clinic.state && `${clinic.state} `}
                          {clinic.postcode}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                        {clinic.practice_phone && (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <i className="bi bi-telephone text-orange-500"></i>
                            <span>{clinic.practice_phone}</span>
                          </div>
                        )}
                        {clinic.email && (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <i className="bi bi-envelope text-orange-500"></i>
                            <span>{clinic.email}</span>
                          </div>
                        )}
                        {clinic.practice_base_info?.website && (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg sm:col-span-2">
                            <i className="bi bi-globe text-orange-500"></i>
                            <a href={clinic.practice_base_info.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {clinic.practice_base_info.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="mb-10">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-clock text-orange-500"></i>
                        Opening Hours
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(openingHours).map(([day, time]) => {
                          const isClosed = time === "Closed";
                          return (
                            <div
                              key={day}
                              className={`flex justify-between items-center px-4 py-3 rounded-lg ${isClosed ? "bg-red-50 text-red-600" : "bg-green-50 text-gray-700"
                                }`}
                            >
                              <span className="font-semibold capitalize">{day}</span>
                              <span className={isClosed ? "font-bold" : "font-medium text-green-700"}>
                                {time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Social Media */}
                    {(clinic.practice_base_info?.facebook_url ||
                      clinic.practice_base_info?.instagram_url ||
                      clinic.practice_base_info?.twitter_url ||
                      clinic.practice_base_info?.youtube_url) && (
                        <div className="pt-6 border-t border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="bi bi-share text-orange-500"></i>
                            Follow Us
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {clinic.practice_base_info?.facebook_url && (
                              <a href={clinic.practice_base_info.facebook_url} target="_blank" rel="noreferrer" className="p-4 bg-blue-50 rounded-xl flex justify-center hover:bg-blue-100 transition-colors">
                                <i className="bi bi-facebook text-blue-600 text-2xl" />
                              </a>
                            )}
                            {clinic.practice_base_info?.instagram_url && (
                              <a href={clinic.practice_base_info.instagram_url} target="_blank" rel="noreferrer" className="p-4 bg-pink-50 rounded-xl flex justify-center hover:bg-pink-100 transition-colors">
                                <i className="bi bi-instagram text-pink-600 text-2xl" />
                              </a>
                            )}
                            {clinic.practice_base_info?.twitter_url && (
                              <a href={clinic.practice_base_info.twitter_url} target="_blank" rel="noreferrer" className="p-4 bg-sky-50 rounded-xl flex justify-center hover:bg-sky-100 transition-colors">
                                <i className="bi bi-twitter text-sky-500 text-2xl" />
                              </a>
                            )}
                            {clinic.practice_base_info?.youtube_url && (
                              <a href={clinic.practice_base_info.youtube_url} target="_blank" rel="noreferrer" className="p-4 bg-red-50 rounded-xl flex justify-center hover:bg-red-100 transition-colors">
                                <i className="bi bi-youtube text-red-600 text-2xl" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                  </section>

                </main>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

// Team Member Card Component
const TeamMemberCard = ({
  dentist,
  clinic,
}: {
  dentist: PracticeTeamMember;
  clinic: ClinicProfileData;
}) => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border shadow-sm h-full flex flex-col">
      <div className="pt-8 flex justify-center">
        <img
          src={dentist.image || "https://via.placeholder.com/150"}
          alt={`${dentist.first_name} ${dentist.last_name || ''}`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow"
        />
      </div>
      <div className="flex-1 px-4 sm:px-6 pt-6 text-center">
        <h4 className="font-bold text-base sm:text-lg text-gray-900">
          {`${dentist.first_name} ${dentist.last_name || ''}`}
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
          {dentist.qualification || "Dental Practitioner"}
        </p>
      </div>
      <div className="pb-6 pt-4 flex justify-center gap-4">
        <button
          onClick={() => {
            sessionStorage.setItem("dentistFromClinic", `/clinicprofile/${clinic?.id}`);
            navigate(`/dentist/${dentist.id}`, { state: { clinicId: clinic.id } });
            window.scrollTo(0, 0);
          }}
          className="px-4 sm:px-6 py-2 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold hover:border-orange-500 hover:text-orange-600"
        >
          Profile
        </button>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-4 sm:px-6 py-2 rounded-full bg-orange-600 text-white text-xs sm:text-sm font-semibold hover:bg-orange-700"
        >
          Book
        </button>
      </div>
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        clinic={clinic}
        selectedDentistId={dentist.id}
      />
    </div>
  );
};

export default ClinicProfile;