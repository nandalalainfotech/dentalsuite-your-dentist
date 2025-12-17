// src/services/ClinicService.ts

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Dentist {
  id: string;
  name: string;
  qualification: string;
  experience: number;
  specialities: string[];
  rating?: number;
  slots?: TimeSlot[];
  availabledays: string[];
  image?: string;
  gender?: "male" | "female" | "other";
  languages?: string[];
}

export interface Appointment {
  id: string;
  dentistId: string;
  clinicId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  createdAt: string;
  updatedAt?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  specialities: string[];
  phone?: string;
  email?: string;
  available?: boolean;
  website?: string;
  rating?: number;
  logo?: string;
  slots?: TimeSlot[];
  time: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  description?: string;
  establishedYear?: number;
  dentists?: Dentist[];
  facilities?: string[];
  insurance?: string[];
  parking?: boolean;
  emergency?: boolean;
}



const clinics: Clinic[] = [
  {
    id: "1",
    name: "Sydney Harbour Dental",
    address: " Sydney NSW 2000",
    specialities: ["General Dentistry", "Root Canal", "Cosmetic Dentistry"],
    phone: "+61 2 9876 5432",
    email: "contact@sydneyharbourdental.com.au",
    website: "https://sydneyharbourdental.com.au",
    rating: 4.7,
    available: true,
    time: {
      monday: "09:00 AM - 08:00 PM",
      tuesday: "09:00 AM - 08:00 PM",
      wednesday: "09:00 AM - 08:00 PM",
      thursday: "09:00 AM - 08:00 PM",
      friday: "09:00 AM - 08:00 PM",
      saturday: "09:00 AM - 02:00 PM",
      sunday: "Closed"
    },
    logo: "/head.jpeg",
    description: "A premier dental clinic offering comprehensive oral healthcare services with state-of-the-art technology and experienced professionals.",
    establishedYear: 2015,
    facilities: ["Digital X-Ray", "Sterilization Equipment", "Air Conditioned", "Waiting Area", "Pharmacy"],
    insurance: ["Bupa", "Medibank", "HCF", "NIB"],
    parking: true,
    emergency: true,
    dentists: [
      {
        id: "d1",
        name: "Dr. James Mitchell",
        qualification: "BDSc, MDSc - Oral Surgery",
        experience: 12,
        specialities: ["Oral Surgery", "Dental Implants", "Wisdom Tooth Removal"],
        rating: 4.8,
        availabledays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        slots: [
          { time: "09:00 AM", available: false },
          { time: "10:30 AM", available: true },
          { time: "11:00 AM", available: false },
          { time: "02:00 PM", available: true },
          { time: "02:30 PM", available: false },
          { time: "04:00 PM", available: true },
          { time: "05:30 PM", available: true }
        ],
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Mandarin", "Cantonese"]
      },
      {
        id: "d2",
        name: "Dr. Sarah Chen",
        qualification: "BDSc, MDSc - Conservative Dentistry",
        experience: 8,
        specialities: ["Root Canal", "Cosmetic Dentistry", "Dental Fillings"],
        rating: 4.7,
        availabledays: ["Monday", "Wednesday", "Friday", "Saturday"],
        slots: [
          { time: "09:00 AM", available: true },
          { time: "10:30 AM", available: false },
          { time: "11:00 AM", available: true },
          { time: "02:00 PM", available: false },
          { time: "02:30 PM", available: true },
          { time: "04:00 PM", available: false },
          { time: "05:30 PM", available: false }
        ],
        image: "/dentist/female-dentist.jpg",
        gender: "female",
        languages: ["English", "Mandarin", "Malay"]
      }
    ]
  },
  {
    id: "2",
    name: "Melbourne Family Dental",
    address: " Melbourne VIC 3000",
    specialities: ["Pediatric Dentistry", "Orthodontics", "Scaling & Cleaning"],
    phone: "+61 3 9003 2211",
    email: "info@melbournefamilydental.com.au",
    website: "https://melbournefamilydental.com.au",
    available: true,
    rating: 3.9,
    time: {
      monday: "08:00 AM - 06:00 PM",
      tuesday: "08:00 AM - 06:00 PM",
      wednesday: "08:00 AM - 06:00 PM",
      thursday: "08:00 AM - 06:00 PM",
      friday: "08:00 AM - 06:00 PM",
      saturday: "08:00 AM - 03:00 PM",
      sunday: "Closed"
    },
    logo: "/head2.avif",
    description: "Specialized in pediatric dentistry and orthodontic treatments, providing gentle care for children and adults.",
    establishedYear: 2018,
    facilities: ["Orthodontic Lab", "Digital Scanner", "Sterilization Room", "Parking"],
    insurance: ["Bupa", "Medibank Private", "AHM", "Australian Unity"],
    parking: true,
    emergency: false,
    dentists: [
      {
        id: "d3",
        name: "Dr. Emily Watson",
        qualification: "BDSc, MDSc - Pediatric Dentistry",
        experience: 10,
        specialities: ["Pediatric Dentistry", "Dental Sealants", "Fluoride Treatment"],
        rating: 4.9,
        availabledays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
        slots: [
          { time: "10:00 AM", available: true },
          { time: "11:15 AM", available: true },
          { time: "12:00 PM", available: false },
          { time: "02:30 PM", available: true },
          { time: "03:15 PM", available: true },
          { time: "05:00 PM", available: true },
          { time: "06:30 PM", available: false }
        ],
        image: "https://via.placeholder.com/100x100.png?text=DR3",
        gender: "female",
        languages: ["English", "Italian", "Greek"]
      },
      {
        id: "d4",
        name: "Dr. Michael Roberts",
        qualification: "BDSc, MDSc - Orthodontics",
        experience: 15,
        specialities: ["Braces", "Invisalign", "Dental Alignment"],
        rating: 4.6,
        availabledays: ["Monday", "Wednesday", "Friday", "Saturday"],
        slots: [
          { time: "10:00 AM", available: false },
          { time: "11:15 AM", available: false },
          { time: "12:00 PM", available: true },
          { time: "02:30 PM", available: false },
          { time: "03:15 PM", available: false },
          { time: "05:00 PM", available: false },
          { time: "06:30 PM", available: true }
        ],
        image: "data:image/jpeg;base64,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",
        gender: "male",
        languages: ["English", "Vietnamese", "Arabic"]
      }
    ]
  },
  {
    id: "3",
    name: "City Dental Studio",
    address: " Adelaide SA 5000",
    specialities: ["Implants", "Oral Surgery", "Teeth Whitening"],
    phone: "+91 81234 56789",
    email: "hello@citydental.com",
    website: "https://citydental.com",
    rating: 4.8,
    time: {
      monday: "09:30 AM - 06:30 PM",
      tuesday: "09:30 AM - 06:30 PM",
      wednesday: "09:30 AM - 06:30 PM",
      thursday: "09:30 AM - 06:30 PM",
      friday: "09:30 AM - 06:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    available: true,
    logo: "/head3.jpg",
    description: "Advanced dental care center specializing in implants and cosmetic procedures with modern technology.",
    establishedYear: 2012,

    facilities: ["3D CBCT Scanner", "Laser Dentistry", "Surgical Suite", "In-house Lab", "WiFi"],
    insurance: ["Bajaj Allianz", "United India", "Oriental Insurance"],
    parking: true,
    emergency: true,
    dentists: [
      {
        id: "d5",
        name: "Dr. Michael Chen",
        qualification: "BDS, MDS - Implantology",
        experience: 18,
        specialities: ["Dental Implants", "Bone Grafting", "Full Mouth Rehabilitation"],
        rating: 4.9,
        availabledays: ["Monday", "Tuesday", "Thursday", "Friday"],
        slots: [
          { time: "08:30 AM", available: true },
          { time: "09:45 AM", available: false },
          { time: "11:15 AM", available: false },
          { time: "01:00 PM", available: true },
          { time: "03:00 PM", available: true },
          { time: "04:30 PM", available: false },
          { time: "05:30 PM", available: true }
        ],
        image: "https://via.placeholder.com/100x100.png?text=DR5",
        gender: "male",
        languages: ["English", "Mandarin", "Kannada"]
      },
      {
        id: "d6",
        name: "Dr. Sarah Johnson",
        qualification: "BDS, MDS - Oral Surgery",
        experience: 14,
        specialities: ["Oral Surgery", "Teeth Whitening", "Gum Treatment"],
        rating: 4.7,
        availabledays: ["Wednesday", "Thursday", "Friday", "Saturday"],
        slots: [
          { time: "08:30 AM", available: false },
          { time: "09:45 AM", available: true },
          { time: "11:15 AM", available: true },
          { time: "01:00 PM", available: false },
          { time: "03:00 PM", available: false },
          { time: "04:30 PM", available: true },
          { time: "05:30 PM", available: false }
        ],
        image: "https://via.placeholder.com/100x100.png?text=DR6",
        gender: "female",
        languages: ["English", "French", "Hindi"]
      }
    ]
  },
  {
    id: "4",
    name: "SmileCraft Dental Center",
    address: "Canberra ACT 2600",
    specialities: ["Cosmetic Dentistry", "Braces", "Crowns & Bridges"],
    phone: "+91 95432 22881",
    email: "info@smilecraft.com",
    website: "https://smilecraft.com",
    rating: 3.2,
    time: {
      monday: "10:00 AM - 08:30 PM",
      tuesday: "10:00 AM - 08:30 PM",
      wednesday: "Closed",
      thursday: "10:00 AM - 08:30 PM",
      friday: "Closed",
      saturday: "10:00 AM - 05:00 PM",
      sunday: "Closed"
    },
    available: true,
    logo: "/head1.avif",
    description: "Comprehensive dental care center focusing on cosmetic dentistry and restorative procedures.",
    establishedYear: 2016,

    facilities: ["Digital Smile Design", "CAD/CAM System", "Teeth Whitening Studio", "Orthodontic Treatment", "Coffee Bar"],
    insurance: ["IFFCO Tokio", "HDFC Ergo", "Royal Sundaram"],
    parking: false,
    emergency: false,
    dentists: [
      {
        id: "d7",
        name: "Dr. Amit Verma",
        qualification: "BDS, MDS - Prosthodontics",
        experience: 11,
        specialities: ["Crowns & Bridges", "Dental Veneers", "Smile Makeover"],
        rating: 4.8,
        availabledays: ["Monday", "Wednesday", "Friday", "Saturday"],
        slots: [
          { time: "9:00 AM", available: true },
          { time: "12:30 PM", available: true },
          { time: "02:00 PM", available: false },
          { time: "03:30 PM", available: true },
          { time: "05:00 PM", available: false },
          { time: "06:30 PM", available: true },
          { time: "08:00 PM", available: true }
        ],
        image: "https://via.placeholder.com/100x100.png?text=DR7",
        gender: "male",
        languages: ["English", "Hindi", "Punjabi"]
      },
      {
        id: "d8",
        name: "Dr. Neha Patel",
        qualification: "BDS, MDS - Orthodontics",
        experience: 9,
        specialities: ["Braces", "Clear Aligners", "Dental Correction"],
        rating: 4.5,
        availabledays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
        slots: [
          { time: "9:00 AM", available: false },
          { time: "12:30 PM", available: false },
          { time: "02:00 PM", available: true },
          { time: "03:30 PM", available: false },
          { time: "05:00 PM", available: true },
          { time: "06:30 PM", available: false },
          { time: "08:00 PM", available: false }
        ],
        image: "https://via.placeholder.com/100x100.png?text=DR8",
        gender: "female",
        languages: ["English", "Hindi", "Gujarati"]
      }
    ]
  }
];

// export const 


export const ClinicService = {
  getAllClinics: async () => clinics,

  getClinicById: (id: string) => clinics.find(c => c.id === id),

  searchClinics: (keyword: string) => {
    const lower = keyword.toLowerCase();
    return clinics.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.address.toLowerCase().includes(lower) ||
      c.specialities.some(s => s.toLowerCase().includes(lower))
    );
  },

  extractStateCode: (address: string): string => {
    const parts = address.split(" ");
    return parts[parts.length - 2]; // second last value
  },

  searchClinicsByLocation: (location: string) => {
    const lower = location.toLowerCase();
    return clinics.filter(c => c.address.toLowerCase().includes(lower));
  },

  searchClinicsBySpeciality: (speciality: string) => {
    const lower = speciality.toLowerCase();
    return clinics.filter(c =>
      c.specialities.some(s => s.toLowerCase().includes(lower))
    );
  },

  getDentistsByClinic: (clinicId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic?.dentists || [];
  },


  searchDentists: (keyword: string) => {
    const lower = keyword.toLowerCase();
    const allDentists: { dentist: Dentist, clinic: Clinic }[] = [];

    clinics.forEach(clinic => {
      if (clinic.dentists) {
        clinic.dentists.forEach(dentist => {
          if (
            dentist.name.toLowerCase().includes(lower) ||
            dentist.specialities.some(s => s.toLowerCase().includes(lower)) ||
            dentist.qualification.toLowerCase().includes(lower)
          ) {
            allDentists.push({ dentist, clinic });
          }
        });
      }
    });

    return allDentists;
  },

  searchClinicsWithFilters: (filters: {
    service?: string;
    location?: string;
    language?: string;
    gender?: string;
    specialty?: string;
    insurance?: string;
    availabiledays?: string;
  }) => {
    let filteredClinics = clinics;

    if (filters.service) {
      const serviceLower = filters.service.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.name.toLowerCase().includes(serviceLower) ||
        c.specialities.some(s => s.toLowerCase().includes(serviceLower))
      );
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.address.toLowerCase().includes(locationLower)
      );
    }

    if (filters.specialty) {
      const specialtyLower = filters.specialty.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.specialities.some(s => s.toLowerCase().includes(specialtyLower))
      );
    }

    if (filters.language || filters.gender || filters.insurance || filters.availabiledays) {
      filteredClinics = filteredClinics.filter(clinic => {
        // If clinic has no dentists, only include it if we're not filtering by language/gender
        if (!clinic.dentists || clinic.dentists.length === 0) {
          return !filters.language && !filters.gender && !filters.insurance && !filters.availabiledays;
        }

        return clinic.dentists.some(dentist => {
          let matchesLanguage = true;
          let matchesGender = true;
          let matchesInsurance = true;
          let matchesAvailableDays = true;

          if (filters.language) {
            const languages = filters.language.split(',').map(l => l.trim().toLowerCase());
            matchesLanguage = dentist.languages?.some(lang =>
              languages.some(filterLang => lang.toLowerCase().includes(filterLang))
            ) || false;
          }

          if (filters.gender) {
            const genders = filters.gender.split(',').map(g => g.trim().toLowerCase());
            matchesGender = genders.some(filterGender =>
              dentist.gender?.toLowerCase() === filterGender
            ) || false;
          }

          if (filters.insurance) {
            const insurances = filters.insurance.split(',').map(i => i.trim().toLowerCase());
            matchesInsurance = clinic.insurance?.some(ins =>
              insurances.some(filterIns => ins.toLowerCase().includes(filterIns))
            ) || false;
          }

          if (filters.availabiledays) {
            const days = filters.availabiledays.split(',').map(d => d.trim().toLowerCase());
            matchesAvailableDays = dentist.availabledays?.some(day =>
              days.some(filterDay => day.toLowerCase() === filterDay)
            ) || false;
          }

          return matchesLanguage && matchesGender && matchesInsurance && matchesAvailableDays;
        });
      });
    }

    return filteredClinics;
  },

  getAllLanguages: (): string[] => {
    const languages = new Set<string>();
    clinics.forEach(clinic => {
      clinic.dentists?.forEach(dentist => {
        dentist.languages?.forEach(lang => languages.add(lang));
      });
    });
    return Array.from(languages).sort();
  },

  getAllSpecialties: (): string[] => {
    const specialties = new Set<string>();
    clinics.forEach(clinic => {
      clinic.specialities.forEach(spec => specialties.add(spec));
      clinic.dentists?.forEach(dentist => {
        dentist.specialities.forEach(spec => specialties.add(spec));
      });
    });
    return Array.from(specialties).sort();
  },

  getAllGenders: (): string[] => {
    return ["male", "female", "other"];
  },

  getAllInsurances: (): string[] => {
    const insurances = new Set<string>();
    clinics.forEach(clinic => {
      clinic.insurance?.forEach(ins => insurances.add(ins));
    });
    return Array.from(insurances).sort();
  },

  getAllAvailableDays: (): string[] => {
    const days = new Set<string>();
    clinics.forEach(clinic => {
      clinic.dentists?.forEach(dentist => {
        dentist.availabledays?.forEach(day => days.add(day));
      });
    });
    return Array.from(days).sort();
  },

  // Appointment API methods
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment => {
    // Simulate API call to backend
    const appointment: Appointment = {
      id: `APT-${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      ...appointmentData
    };

    // Store in localStorage for demo purposes
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return appointment;
  },

  getAppointments: (): Appointment[] => {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  },

  getAppointmentById: (appointmentId: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.find((apt) => apt.id === appointmentId);
  },

  cancelAppointment: (appointmentId: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments: Appointment[] = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return updatedAppointments.find((apt) => apt.id === appointmentId);
  },

  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string): Appointment | undefined => {
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments: Appointment[] = appointments.map((apt) =>
      apt.id === appointmentId
        ? { ...apt, appointmentDate: newDate, appointmentTime: newTime, updatedAt: new Date().toISOString(), status: 'rescheduled' }
        : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return updatedAppointments.find((apt) => apt.id === appointmentId);
  },

  getDentistById: (dentistId: string) => {
    for (const clinic of clinics) {
      const dentist = clinic.dentists?.find(d => d.id === dentistId);
      if (dentist) {
        return { ...dentist, clinicId: clinic.id, clinicName: clinic.name };
      }
    }
    return null;
  },

  getClinicDentists: (clinicId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic?.dentists || [];
  },

  updateDentistSlots: (clinicId: string, dentistId: string, slots: TimeSlot[]): boolean => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      const dentist = clinic.dentists?.find(d => d.id === dentistId);
      if (dentist) {
        dentist.slots = slots;
        return true;
      }
    }
    return false;
  }

};



export default ClinicService;