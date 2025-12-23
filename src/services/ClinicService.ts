// src/services/ClinicService.ts

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Review {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
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
  overview?: string;
  reviews?: Review[];
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
    address: " Bagot House, Level 2 / 198 North Terrace, Adelaide, SA 5000",
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
        languages: ["English", "Mandarin", "Cantonese"],
        overview: "Dr. James Mitchell is an accomplished oral surgeon with 12 years of experience in complex dental procedures. Specializing in dental implants and wisdom tooth extractions, he combines technical expertise with patient comfort. Known for his meticulous approach and innovative surgical techniques, Dr. Mitchell has transformed smiles and restored confidence in hundreds of patients.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]


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
        languages: ["English", "Mandarin", "Malay"],
        overview: "Dr. Sarah Chen is a dedicated conservative dentist with 8 years of experience in cosmetic and restorative dentistry. Her gentle approach and attention to detail have made her a patient favorite. Dr. Chen specializes in creating beautiful, natural-looking smiles while preserving tooth structure and maintaining optimal oral health for her patients.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        image: "/dentist/female-dentist.jpg",
        gender: "female",
        languages: ["English", "Italian", "Greek"],
        overview: "Dr. Emily Watson is a compassionate pediatric dentist with 10 years of experience making dental visits fun and stress-free for children. Her warm demeanor and child-friendly approach have earned her the trust of thousands of young patients and parents. Dr. Watson believes in preventive care and education to ensure children develop healthy dental habits for life.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Vietnamese", "Arabic"],
        overview: "Dr. Michael Roberts is an expert orthodontist with 15 years of experience creating beautiful, straight smiles using the latest technology. From traditional braces to modern Invisalign aligners, he offers personalized treatment plans to achieve optimal results. His patients appreciate his professionalism and commitment to achieving their dream smile.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        languages: ["English", "Mandarin", "Kannada"],
        overview: "Dr. Michael Chen is a highly skilled implantologist with 18 years of expertise in complex dental implant procedures and full mouth rehabilitation. His advanced training in bone grafting and surgical techniques allows him to handle even the most challenging cases. Patients trust Dr. Chen for his meticulous attention to detail and commitment to restoring their smile permanently.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        languages: ["English", "French", "Hindi"],
        overview: "Dr. Sarah Johnson is an accomplished oral surgeon with 14 years of experience performing complex extractions, gum treatments, and cosmetic whitening procedures. Her comprehensive surgical skills combined with her gentle approach make her an excellent choice for patients needing specialized oral care. Dr. Johnson's patients appreciate her professionalism and her ability to explain procedures clearly.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        languages: ["English", "Hindi", "Punjabi"],
        overview: "Dr. Amit Verma is a renowned cosmetic dentist with 11 years of experience creating stunning smile makeovers using veneers, crowns, and aesthetic restorations. His artistic eye and technical precision allow him to design smiles that complement each patient's unique features. Dr. Verma's passion for cosmetic dentistry has transformed countless smiles and boosted patient confidence.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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
        languages: ["English", "Hindi", "Gujarati"],
        overview: "Dr. Neha Patel is an innovative orthodontist with 9 years of experience offering both traditional braces and modern clear aligner solutions. Her personalized treatment plans and supportive guidance help patients achieve their ideal smile while maintaining comfort throughout the process. Dr. Patel's young patients particularly appreciate her friendly demeanor and flexible appointment scheduling.",
        reviews: [
          {
            patientName: "Aarav Sharma",
            rating: 5,
            comment:
              "Very professional and friendly. Explained the procedure clearly and made me feel comfortable.",
            date: "12 Dec 2024"
          },
          {
            patientName: "Meera Patel",
            rating: 4,
            comment:
              "Good experience overall. Clinic is clean and well maintained.",
            date: "28 Nov 2024"
          },
          {
            patientName: "Rahul Verma",
            rating: 5,
            comment:
              "Highly recommended! Painless treatment and great care.",
            date: "10 Nov 2024"
          }
        ]

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