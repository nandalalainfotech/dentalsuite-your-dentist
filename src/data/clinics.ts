import { SAMPLE_REVIEWS } from '../constants/reviews';
import type { Clinic } from '../types';

export const clinics: Clinic[] = [
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
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
        reviews: SAMPLE_REVIEWS
      }
    ]
  }
];