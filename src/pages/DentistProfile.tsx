import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ClinicService, { type Dentist } from "../services/ClinicService";

interface DentistData extends Dentist {
  clinicId?: string;
}

const DentistProfile = () => {
  const { id: dentistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dentist, setDentist] = useState<DentistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [activeSection, setActiveSection] = useState("about");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: "bi-info-circle" },
    {
      id: "practitioner-information",
      label: "Practitioner-information",
      icon: "bi-person-circle",
    },
    {
      id: "practice-information",
      label: "Practice-information",
      icon: "bi-building",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const fetchDentist = async () => {
      if (dentistId) {
        // Get all clinics and find the dentist
        const allClinics = ClinicService.getAllClinics();
        let foundDentist: DentistData | null = null;

        for (const clinic of await allClinics) {
          const dentistData = clinic.dentists?.find((d) => d.id === dentistId);
          if (dentistData) {
            foundDentist = { ...dentistData, clinicId: clinic.id };
            break;
          }
        }

        setDentist(foundDentist);
      }
      setLoading(false);
    };

    fetchDentist();
  }, [dentistId]);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying] = useState<boolean>(true);
  const galleryImages: string[] = [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format&fit=crop",
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length, isAutoPlaying]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading dentist details...
          </p>
        </div>
      </div>
    );
  }

  if (!dentist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-exclamation-lg text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dentist Not Found
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            The dentist you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        id="overview"
        ref={(el) => {
          sectionRefs.current["overview"] = el;
        }}
        className="scroll-mt-24"
      ></section>
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-64 md:h-70 w-full overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop"
          alt="Clinic Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* FULL HERO BLUR LAYER */}
        <div className="absolute inset-0 backdrop-blur-md"></div>

        {/* Dark Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          <span className="font-medium">Back</span>
        </button>

        {/* Banner Overlay Content */}
        <div className="absolute inset-x-0 bottom-5 z-10">
          <div className="bg-gradient-to-t from-black/70 via-black/60 to-black/30">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-6 sm:py-8">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <img
                  src={dentist.image}
                  alt={dentist.name}
                  className="w-16 h-16 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white/80 shadow-lg"
                />

                {/* Text Info */}
                <div className="min-w-0">
                  <h1 className="flex items-center gap-2 sm:gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 mb-0.5 sm:mb-1 md:mb-2 line-clamp-2 break-words">
                    {dentist.name}
                  </h1>

                  {/* Qualification */}
                  <p className="flex items-center gap-1 sm:gap-1 text-sm sm:text-xl font-semibold text-gray-100 mb-0.5 sm:mb-0 md:mb-1 line-clamp-1 break-words">
                    {dentist.qualification}
                  </p>

                  {/* Verified Badge */}
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                 bg-green-600 text-white text-xs sm:text-sm font-semibold 
                 shadow-sm"
                  >
                    <i className="bi bi-check-circle-fill text-white text-sm"></i>
                    Verified
                  </span>

                  {/* Experience */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 sm:gap-1 text-sm sm:text-lg font-semibold text-gray-100 mb-0.5 sm:mb-0 md:mb-1 line-clamp-1 break-words">
                      {dentist.experience}+ years experience
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links - Top Horizontal Navigation */}
      <div className="bg-white justify-center items-center sticky top-14 md:top-16 z-40 shadow-md border-b-1 border-gray-100">
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-7 py-7">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content Area */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
            <main className="flex-1 min-w-0 space-y-10">
              {/* Overview Section */}
              <section>
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-info-circle text-orange-600"></i>
                    Overview
                  </h2>
                </div>

                <div className="p-4 md:p-4">
                  <p className="text-gray-600 leading-relaxed">
                    {dentist.overview}
                  </p>
                </div>
              </section>

              {/*  Practitioner information */}
              <section
                id="practitioner-information"
                ref={(el) => {
                  sectionRefs.current["practitioner-information"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-person-circle text-orange-600"></i>
                    Practitioner information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Languages spoken */}
                  <div className="pl-3">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="bi bi-translate text-orange-600"></i>
                      Languages spoken
                    </h4>

                    {/* Language List */}
                    <ul className="space-y-2 pl-6">
                      {dentist.languages?.map((lang: string, index: number) => (
                        <li key={index} className="text-gray-700 text-base">
                          {lang}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specialities */}
                  <div className="pl-3">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="bi bi-person-heart text-orange-600"></i>
                      Specialities
                    </h4>

                    <ul className="space-y-2 pl-6">
                      {dentist.specialities?.map(
                        (item: string, index: number) => (
                          <li key={index} className="text-gray-700 text-base">
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="mt-8 pl-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="bi bi-clock text-orange-600"></i>
                    Available Slots
                  </h4>

                  {/* Slots Grid */}
                  <div className="flex flex-wrap gap-3 pl-6">
                    {dentist.slots?.map(
                      (
                        slot: { time: string; available: boolean },
                        index: number
                      ) => (
                        <span
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${
              slot.available
                ? "bg-green-50 text-green-700 border-green-300 cursor-pointer hover:bg-green-100"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
                        >
                          {slot.time}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </section>

              {/* Practice-Information */}
              <section
                id="practice-information"
                ref={(el: HTMLElement | null) => {
                  sectionRefs.current["practice-information"] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6 border-b-4 border-orange-400">
                  <h2 className="text-md font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="bi bi-building-fill text-orange-600"></i>
                    Practice-Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clinic Address */}
                  <div className="pl-3 space-y-4">
                    {/* Address */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-orange-600"></i>
                        Address
                      </h4>

                      <p className="pl-6 text-gray-700 leading-relaxed">
                        Level 3, 123 George Street,
                        <br />
                        Sydney NSW 2000,
                        <br />
                        Australia
                      </p>
                    </div>

                    {/* Website */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <i className="bi bi-globe text-orange-500"></i>
                        Website
                      </h4>

                      <a
                        href="https://melbournefamilydental.com.au"
                        target="_blank"
                        rel="noreferrer"
                        className="pl-6 text-blue-600 hover:underline break-all"
                      >
                        https://melbournefamilydental.com.au
                      </a>
                    </div>

                    {/* Phone */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <i className="bi bi-telephone-fill text-orange-500"></i>
                        Phone
                      </h4>

                      <a
                        href="tel:+61291234567"
                        className="pl-6 text-gray-700 hover:text-orange-600 transition-colors"
                      >
                        +61 2 9123 4567
                      </a>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <section className="pl-3">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="bi bi-clock-fill text-orange-600"></i>
                      Opening Hours
                    </h4>

                    <div className="space-y-2 pl-5">
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
                  </section>
                </div>
                {/* Practice-Gallery */}
                <div className="mt-8 pl-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <i className="bi bi-images text-orange-600"></i>
                    Practice-Gallery
                  </h4>
                  <div className="relative overflow-hidden rounded-xl">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {galleryImages.map((url, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                          <div className="aspect-video">
                            <img
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (prev) =>
                            (prev - 1 + galleryImages.length) %
                            galleryImages.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (prev) => (prev + 1) % galleryImages.length
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <i className="bi bi-chevron-right text-xl"></i>
                    </button>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentSlide === index
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </div>

          {/* Right Sidebar - Book Appointment Widget */}
          <aside className="w-full lg:w-96 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24 h-fit">
              {/* Header */}
              <div className="p-4 md:p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="bi bi-calendar-check text-orange-600"></i>
                  Book appointment
                </h3>
              </div>

              {/* Dropdowns */}
              <div className="p-4 md:p-5 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 hover:scrollbar-thumb-orange-400">
                {/* Select Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Date
                  </label>
                  <div className="space-y-2">
                    {[1, 2, 3].map((day) => {
                      const date = new Date();
                      date.setDate(date.getDate() + day);
                      const dateStr = date.toISOString().split("T")[0];
                      const dateLabel = date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`w-full p-3 rounded-lg border-2 font-medium text-left transition-all ${
                            selectedDate === dateStr
                              ? "border-orange-600 bg-orange-50 text-orange-700"
                              : "border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                          }`}
                        >
                          {dateLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select Time Slot */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {dentist.slots
                        ?.filter((slot) => slot.available)
                        .map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`p-2 rounded-lg border-2 font-medium text-sm transition-all ${
                              selectedSlot === slot.time
                                ? "border-orange-600 bg-orange-50 text-orange-700"
                                : "border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors text-sm md:text-base"
                  />
                </div>

                {/* Patient Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors text-sm md:text-base"
                  />
                </div>

                {/* Patient Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors text-sm md:text-base"
                  />
                </div>

                {/* Book Button */}
                <button
                  onClick={() =>
                    alert(
                      `Appointment booked with ${dentist?.name} on ${selectedDate} at ${selectedSlot}`
                    )
                  }
                  disabled={!selectedDate || !selectedSlot}
                  className="w-full border border-orange-600 hover:bg-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-orange-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-200 disabled:shadow-none transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
                >
                  <i className="bi bi-check-circle mr-2"></i>
                  Book Appointment
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DentistProfile;
