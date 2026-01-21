import { SAMPLE_REVIEWS } from '../constants/reviews';
import type { Clinic } from '../types';

export const clinics: Clinic[] = [
  {
    id: "1",
    name: "Sydney Harbour Dental",
    tagline: "Comprehensive family dentistry",
    address: "Adelaide, SA 5000",
    specialities: ["General Dentistry", "Root Canal", "Cosmetic Dentistry"],
    services: ["General Dentistry", "Root Canal", "Cosmetic Dentistry"],
    phone: "(02) 9234 5678",
    email: "Sydney@dentalcare.com.au",
    password: "vv123",
    website: "https://vishwadentalcare.com.au",
    rating: 4.8,
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
    establishedYear: 2024,
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
    ],
    team: [
      { name: "Dr. James Mitchell", role: "Oral Surgery", qual: "BDSc, MDSc" },
      { name: "Dr. Sarah Chen", role: "Conservative Dentistry", qual: "BDSc, MDSc" }
    ],
    achievements: [],
    insurances: ["Bupa", "Medibank", "HCF", "NIB"]
  },
  {
    id: "2",
    name: "Melbourne Family Dental",
    tagline: "Specialist dental care",
    address: "456 Collins Street, Melbourne VIC 3000",
    specialities: ["Specialist Dentistry", "Orthodontics", "Oral Surgery"],
    services: ["Specialist Dentistry", "Orthodontics", "Oral Surgery"],
    phone: "(03) 9876 5432",
    email: "Melbourne@dentalclinic.com.au",
    password: "practice456",
    website: "https://citydentalclinic.com.au",
    rating: 4.9,
    available: true,
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
    description: "Specialized dental center offering advanced treatments with state-of-the-art technology and experienced specialists.",
    establishedYear: 2024,
    facilities: ["3D CBCT Scanner", "Laser Dentistry", "Surgical Suite", "In-house Lab", "WiFi"],
    insurance: ["Bupa", "Medibank Private", "AHM", "Australian Unity"],
    parking: true,
    emergency: true,
    dentists: [
      {
        id: "d3",
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
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Mandarin", "Kannada"],
        overview: "Dr. Michael Chen is a highly skilled implantologist with 18 years of expertise in complex dental implant procedures and full mouth rehabilitation. His advanced training in bone grafting and surgical techniques allows him to handle even the most challenging cases.",
        reviews: SAMPLE_REVIEWS
      },
      {
        id: "d4",
        name: "Dr. Emily Wilson",
        qualification: "BDSc, MDSc - Orthodontics",
        experience: 10,
        specialities: ["Braces", "Invisalign", "Dental Alignment"],
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
        overview: "Dr. Emily Wilson is an expert orthodontist creating beautiful, straight smiles using the latest technology. From traditional braces to modern Invisalign aligners, she offers personalized treatment plans to achieve optimal results.",
        reviews: SAMPLE_REVIEWS
      }
    ],
    team: [
      { name: "Dr. Michael Chen", role: "Implantology", qual: "BDS, MDS" },
      { name: "Dr. Emily Wilson", role: "Orthodontics", qual: "BDSc, MDSc" }
    ],
    achievements: [],
    insurances: ["Bupa", "Medibank Private", "AHM", "Australian Unity"]
  },
  {
    id: "3",
    name: "City Dental Studio",
    tagline: "Cosmetic and restorative specialists",
    address: " Adelaide SA 5000",
    specialities: ["Cosmetic Dentistry", "Teeth Whitening", "Smile Makeover"],
    services: ["Cosmetic Dentistry", "Teeth Whitening", "Smile Makeover"],
    phone: "(07) 3456 7890",
    email: "City@smile.com.au",
    password: "practice789",
    website: "https://brightsmile.com.au",
    rating: 4.7,
    available: true,
    time: {
      monday: "09:30 AM - 06:30 PM",
      tuesday: "09:30 AM - 06:30 PM",
      wednesday: "09:30 AM - 06:30 PM",
      thursday: "09:30 AM - 06:30 PM",
      friday: "09:30 AM - 06:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    logo: "/head3.jpg",
    description: "Cosmetic dental care center specializing in smile transformations and aesthetic procedures with modern technology.",
    establishedYear: 2024,
    facilities: ["Digital Smile Design", "CAD/CAM System", "Teeth Whitening Studio", "Coffee Bar"],
    insurance: ["Bajaj Allianz", "United India", "Oriental Insurance"],
    parking: true,
    emergency: false,
    dentists: [
      {
        id: "d5",
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
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Hindi", "Punjabi"],
        overview: "Dr. Amit Verma is a renowned cosmetic dentist creating stunning smile makeovers using veneers, crowns, and aesthetic restorations. His artistic eye and technical precision allow him to design smiles that complement each patient's unique features.",
        reviews: SAMPLE_REVIEWS
      },
      {
        id: "d6",
        name: "Dr. Neha Patel",
        qualification: "BDS, MDS - Orthodontics",
        experience: 9,
        specialities: ["Braces", "Clear Aligners", "Dental Correction"],
        rating: 4.5,
        availabledays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
        slots: [
          { time: "09:00 AM", available: false },
          { time: "12:30 PM", available: false },
          { time: "02:00 PM", available: true },
          { time: "03:30 PM", available: false },
          { time: "05:00 PM", available: true },
          { time: "06:30 PM", available: false },
          { time: "08:00 PM", available: false }
        ],
        image: "/dentist/female-dentist.jpg",
        gender: "female",
        languages: ["English", "Hindi", "Gujarati"],
        overview: "Dr. Neha Patel is an innovative orthodontist offering both traditional braces and modern clear aligner solutions. Her personalized treatment plans and supportive guidance help patients achieve their ideal smile while maintaining comfort throughout the process.",
        reviews: SAMPLE_REVIEWS
      }
    ],
    team: [
      { name: "Dr. Amit Verma", role: "Prosthodontics", qual: "BDS, MDS" },
      { name: "Dr. Neha Patel", role: "Orthodontics", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["Bajaj Allianz", "United India", "Oriental Insurance"]
  },
  {
    id: "4",
    name: "Family Dental Center",
    tagline: "Caring for families and children",
    address: "Adelaide SA 5000",
    specialities: ["Pediatric Dentistry", "Family Dentistry", "Preventive Care"],
    services: ["Pediatric Dentistry", "Family Dentistry", "Preventive Care"],
    phone: "(08) 8765 4321",
    email: "dental@familydental.com.au",
    password: "practice111",
    website: "https://familydental.com.au",
    rating: 4.6,
    available: true,
    time: {
      monday: "10:00 AM - 08:30 PM",
      tuesday: "10:00 AM - 08:30 PM",
      wednesday: "Closed",
      thursday: "10:00 AM - 08:30 PM",
      friday: "Closed",
      saturday: "10:00 AM - 05:00 PM",
      sunday: "Closed"
    },
    logo: "/head2.avif",
    description: "Family-focused dental care center specializing in pediatric dentistry and preventive treatments for all ages.",
    establishedYear: 2024,
    facilities: ["Pediatric Play Area", "Digital Scanner", "Sterilization Room", "Parking"],
    insurance: ["IFFCO Tokio", "HDFC Ergo", "Royal Sundaram"],
    parking: false,
    emergency: false,
    dentists: [
      {
        id: "d7",
        name: "Dr. David Taylor",
        qualification: "BDSc, MDSc - Pediatric Dentistry",
        experience: 15,
        specialities: ["Pediatric Dentistry", "Dental Sealants", "Fluoride Treatment"],
        rating: 4.8,
        availabledays: ["Monday", "Wednesday", "Friday", "Saturday"],
        slots: [
          { time: "09:00 AM", available: true },
          { time: "11:15 AM", available: true },
          { time: "12:00 PM", available: false },
          { time: "02:30 PM", available: true },
          { time: "03:15 PM", available: true },
          { time: "05:00 PM", available: true },
          { time: "06:30 PM", available: false }
        ],
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Vietnamese", "Arabic"],
        overview: "Dr. David Taylor is a compassionate pediatric dentist with extensive experience making dental visits fun and stress-free for children. His warm demeanor and child-friendly approach have earned him the trust of thousands of young patients and parents.",
        reviews: SAMPLE_REVIEWS
      },
      {
        id: "d8",
        name: "Dr. Sarah Johnson",
        qualification: "BDS, MDS - Family Dentistry",
        experience: 12,
        specialities: ["Family Dentistry", "Preventive Care", "Dental Education"],
        rating: 4.7,
        availabledays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
        slots: [
          { time: "10:00 AM", available: false },
          { time: "11:15 AM", available: false },
          { time: "12:00 PM", available: true },
          { time: "02:30 PM", available: false },
          { time: "03:15 PM", available: false },
          { time: "05:00 PM", available: false },
          { time: "06:30 PM", available: true }
        ],
        image: "/dentist/female-dentist.jpg",
        gender: "female",
        languages: ["English", "French", "Hindi"],
        overview: "Dr. Sarah Johnson is dedicated to providing comprehensive family dental care with a focus on preventive treatments and patient education. Her gentle approach makes her a favorite among patients of all ages.",
        reviews: SAMPLE_REVIEWS
      }
    ],
    team: [
      { name: "Dr. David Taylor", role: "Pediatric Dentistry", qual: "BDSc, MDSc" },
      { name: "Dr. Sarah Johnson", role: "Family Dentistry", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["IFFCO Tokio", "HDFC Ergo", "Royal Sundaram"]
  },
  {
    id: "5",
    name: "Orthodontic Specialists Clinic",
    tagline: "Advanced orthodontic care",
    address: "555 Northbourne Avenue, Canberra ACT 2600",
    specialities: ["Orthodontics", "Braces", "Clear Aligners"],
    services: ["Orthodontics", "Braces", "Clear Aligners"],
    phone: "(02) 6789 0123",
    email: "info@ortho-specialists.com.au",
    password: "practice222",
    website: "https://ortho-specialists.com.au",
    rating: 4.9,
    available: true,
    time: {
      monday: "09:00 AM - 07:00 PM",
      tuesday: "09:00 AM - 07:00 PM",
      wednesday: "09:00 AM - 07:00 PM",
      thursday: "09:00 AM - 07:00 PM",
      friday: "09:00 AM - 07:00 PM",
      saturday: "09:00 AM - 01:00 PM",
      sunday: "Closed"
    },
    logo: "/head2.avif",
    description: "Specialized orthodontic practice offering advanced teeth straightening solutions using the latest technology and techniques.",
    establishedYear: 2024,
    facilities: ["Orthodontic Lab", "Digital Scanner", "3D Imaging", "Patient Consultation Rooms"],
    insurance: ["Major Health Funds", "Private Health Insurance"],
    parking: true,
    emergency: false,
    dentists: [
      {
        id: "d9",
        name: "Dr. James Martinez",
        qualification: "BDS, MDS - Orthodontics",
        experience: 16,
        specialities: ["Braces", "Clear Aligners", "Dental Correction"],
        rating: 4.9,
        availabledays: ["Monday", "Tuesday", "Thursday", "Friday"],
        slots: [
          { time: "08:30 AM", available: true },
          { time: "10:00 AM", available: false },
          { time: "11:30 AM", available: true },
          { time: "01:30 PM", available: false },
          { time: "03:00 PM", available: true },
          { time: "04:30 PM", available: true },
          { time: "06:00 PM", available: false }
        ],
        image: "/dentist/male-dentist.jpg",
        gender: "male",
        languages: ["English", "Spanish", "Mandarin"],
        overview: "Dr. James Martinez is a renowned orthodontist with extensive experience in creating beautiful, straight smiles using cutting-edge technology and personalized treatment approaches.",
        reviews: SAMPLE_REVIEWS
      }
    ],
    team: [
      { name: "Dr. James Martinez", role: "Orthodontics", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["Major Health Funds", "Private Health Insurance"]
  }
];