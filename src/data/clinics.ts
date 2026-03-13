import { SAMPLE_REVIEWS } from '../constants/reviews';
import type { Clinic } from '../types';

export const clinics: Clinic[] = [
  {
    id: "1",
    name: "Sydney Harbour Dental",
    email: "sydney@dentalcare.com.au",
    password: "vv123",
    admin: {
        email: "sydneyadmin@dentalcare.com.au",
        password: "admin123"
    },
    tagline: "Comprehensive family dentistry",
    address: "Adelaide, SA 5000",
    specialities: ["General Dentistry","General Dentistry", "Root Canal", "Cosmetic Dentistry"],
    services: ["General Dentistry", "Root Canal", "Cosmetic Dentistry"],
    phone: "(02) 9234 5678",
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
    banner: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop",
    gallery: [
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
    ],
    description: "A premier dental clinic offering comprehensive oral healthcare services with state-of-the-art technology and experienced professionals.",
    establishedYear: 2024,
    facilities: ["Digital X-Ray", "Sterilization Equipment", "Air Conditioned", "Waiting Area", "Pharmacy"],
    insurance: ["Bupa", "Medibank", "HCF", "NIB"],
    parking: true,
    emergency: true,
    appointmentTypes: [
      { id: "at1", name: "Consultation", duration: 30 },
      { id: "at2", name: "Check Up and Clean", duration: 30 },
      { id: "at3", name: "Emergency", duration: 30 },
      { id: "at4", name: "Recall", duration: 30 }
    ],
    team: [
      { name: "Dr. James Mitchell", role: "Oral Surgery", qual: "BDSc, MDSc" },
      { name: "Dr. Sarah Chen", role: "Conservative Dentistry", qual: "BDSc, MDSc" }
    ],
    achievements: [],
    insurances: ["Bupa", "Medibank", "HCF", "NIB"],
    reviews: '',
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
  },
  {
    id: "2",
    name: "Melbourne Family Dental",
    email: "melbourne@dentalclinic.com.au",
    password: "practice456",
    admin: {
        email: "melbourneadmin@dentalclinic.com.au",
        password: "admin456"
    },
    tagline: "Specialist dental care",
    address: "456 Collins Street, Melbourne VIC 3000",
    specialities: ["General Dentistry","Specialist Dentistry", "Orthodontics", "Oral Surgery"],
    services: ["General Dentistry","Specialist Dentistry", "Orthodontics", "Oral Surgery"],
    phone: "(03) 9876 5432",
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
    banner: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop",
    gallery: [
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
    ],
    description: "Specialized dental center offering advanced treatments with state-of-the-art technology and experienced specialists.",
    establishedYear: 2024,
    facilities: ["3D CBCT Scanner", "Laser Dentistry", "Surgical Suite", "In-house Lab", "WiFi"],
    insurance: ["Bupa", "Medibank Private", "AHM", "Australian Unity"],
    parking: true,
    emergency: true,
    appointmentTypes: [
      { id: "at1", name: "Consultation", duration: 30 },
      { id: "at2", name: "Check Up and Clean", duration: 30 },
      { id: "at3", name: "Emergency", duration: 30 },
      { id: "at4", name: "Recall", duration: 30 }
    ],
    team: [
      { name: "Dr. Michael Chen", role: "Implantology", qual: "BDS, MDS" },
      { name: "Dr. Emily Wilson", role: "Orthodontics", qual: "BDSc, MDSc" }
    ],
    achievements: [],
    insurances: ["Bupa", "Medibank Private", "AHM", "Australian Unity"],
    reviews: '',
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
  },
  {
    id: "3",
    name: "City Dental Studio",
    email: "city@smile.com.au",
    password: "practice789",
    admin: {
        email: "cityadmin@smile.com.au",
        password: "admin789"
    },
    tagline: "Cosmetic and restorative specialists",
    address: " Adelaide SA 5000",
    specialities: ["General Dentistry","Cosmetic Dentistry", "Teeth Whitening", "Smile Makeover"],
    services: ["General Dentistry","Cosmetic Dentistry", "Teeth Whitening", "Smile Makeover"],
    phone: "(07) 3456 7890",
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
    banner: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop",
    gallery: [
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
    ],
    description: "Cosmetic dental care center specializing in smile transformations and aesthetic procedures with modern technology.",
    establishedYear: 2024,
    facilities: ["Digital Smile Design", "CAD/CAM System", "Teeth Whitening Studio", "Coffee Bar"],
    insurance: ["Bajaj Allianz", "United India", "Oriental Insurance"],
    parking: true,
    emergency: false,
    appointmentTypes: [
      { id: "at1", name: "Consultation", duration: 30 },
      { id: "at2", name: "Check Up and Clean", duration: 30 },
      { id: "at3", name: "Emergency", duration: 60 },
      { id: "at4", name: "Recall", duration: 30 }
    ],
    team: [
      { name: "Dr. Amit Verma", role: "Prosthodontics", qual: "BDS, MDS" },
      { name: "Dr. Neha Patel", role: "Orthodontics", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["Bajaj Allianz", "United India", "Oriental Insurance"],
    reviews: '',
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
  },
  {
    id: "4",
    name: "Family Dental Center",
    email: "dental@familydental.com.au",
    password: "practice111",
    admin: {
        email: "familyadmin@familydental.com.au",
        password: "admin111"
    },
    tagline: "Caring for families and children",
    address: "Adelaide SA 5000",
    specialities: ["General Dentistry","Pediatric Dentistry", "Family Dentistry", "Preventive Care"],
    services: ["General Dentistry","Pediatric Dentistry", "Family Dentistry", "Preventive Care"],
    phone: "(08) 8765 4321",
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
    banner: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop",
    gallery: [
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
    ],
    description: "Family-focused dental care center specializing in pediatric dentistry and preventive treatments for all ages.",
    establishedYear: 2024,
    facilities: ["Pediatric Play Area", "Digital Scanner", "Sterilization Room", "Parking"],
    insurance: ["IFFCO Tokio", "HDFC Ergo", "Royal Sundaram"],
    parking: false,
    emergency: false,
    appointmentTypes: [
      { id: "at1", name: "Consultation", duration: 30 },
      { id: "at2", name: "Check Up and Clean", duration: 30 },
      { id: "at3", name: "Emergency", duration: 30 },
      { id: "at4", name: "Recall", duration: 30 }
    ],
    team: [
      { name: "Dr. David Taylor", role: "Pediatric Dentistry", qual: "BDSc, MDSc" },
      { name: "Dr. Sarah Johnson", role: "Family Dentistry", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["IFFCO Tokio", "HDFC Ergo", "Royal Sundaram"],
    reviews: '',
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
  },
  {
    id: "5",
    name: "Orthodontic Specialists Clinic",
    email: "info@ortho-specialists.com.au",
    password: "practice222",
    admin: {
        email: "orthoadmin@ortho-specialists.com.au",
        password: "admin222"
    },
    tagline: "Advanced orthodontic care",
    address: "555 Northbourne Avenue, Canberra ACT 2600",
    specialities: ["General Dentistry","Orthodontics", "Braces", "Clear Aligners"],
    services: ["General Dentistry","Orthodontics", "Braces", "Clear Aligners"],
    phone: "(02) 6789 0123",
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
    banner: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop",
    gallery: [
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
    ],
    description: "Specialized orthodontic practice offering advanced teeth straightening solutions using the latest technology and techniques.",
    establishedYear: 2024,
    facilities: ["Orthodontic Lab", "Digital Scanner", "3D Imaging", "Patient Consultation Rooms"],
    insurance: ["Major Health Funds", "Private Health Insurance"],
    parking: true,
    emergency: false,
    appointmentTypes: [
      { id: "at1", name: "Consultation", duration: 30 },
      { id: "at2", name: "Check Up and Clean", duration: 30 },
      { id: "at3", name: "Emergency", duration: 30 },
      { id: "at4", name: "Recall", duration: 30 }
    ],
    team: [
      { name: "Dr. James Martinez", role: "Orthodontics", qual: "BDS, MDS" }
    ],
    achievements: [],
    insurances: ["Major Health Funds", "Private Health Insurance"],
    reviews: '',
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
  }
];

export const directory = [
  {
    "data": {
        "directories": [
            {
                "id": "e2c7aecf-5529-491e-972e-50b5a70b0d47",
                "description": "<font face=\"Arial\">Testing</font>",
                "name": "Surender",
                "email": "surender@yopmail.com",
                "phone": "8776654322",
                "address": "Madrid, Spain",
                "latitude": 40.41672790000001,
                "longitude": -3.7032905,
                "alt_phone": null,
                "type": "PRACTICE",
                "abn_acn": "1234567895",
                "company_name": "Practice Your dentist",
                "profession_type": "Dental Specialist Practice",
                "directory_category_id": "9dfa1ec4-c136-4939-af84-b2a84747f5f9",
                "logo": {
                    "url": "https://dentalerp-dev.s3-ap-southeast-2.amazonaws.com/uploads360/project/7768fffa-2ef7-4902-8797-b2f2b77c9fe8",
                    "name": "ChatGPT Image Jan 19, 2026, 10_48_29 AM.png",
                    "size": 1290983,
                    "status": "success",
                    "file_id": "7768fffa-2ef7-4902-8797-b2f2b77c9fe8",
                    "isPublic": true,
                    "directory": "project",
                    "extension": "png",
                    "mime_type": "image/png"
                },
                "banner_image": {
                    "url": "https://dentalerp-dev.s3-ap-southeast-2.amazonaws.com/uploads360/project/0fe52d69-876a-4b01-9b2b-376e9240d295",
                    "name": "cropped-image.png",
                    "size": 1150111,
                    "status": "success",
                    "file_id": "0fe52d69-876a-4b01-9b2b-376e9240d295",
                    "isPublic": true,
                    "directory": "project",
                    "extension": "png",
                    "mime_type": "image/png"
                },
                "dental_practice": {
                    "id": "13c34b88-e736-422d-8677-d8c5f8f5ce18",
                    "business_name": "Practice Your dentist",
                    "__typename": "dental_practices"
                },
                "directory_documents": [],
                "directory_locations": [
                    {
                        "id": "37562548-9b2b-41da-a4b4-009ed75785e3",
                        "media_name": null,
                        "media_link": null,
                        "status": "TIME",
                        "week_name": "Tuesday",
                        "clinic_time": "9:30 AM - 6:30 PM",
                        "__typename": "directory_locations"
                    }
                ],
                "directory_services": [
                    {
                        "id": "3f7029c3-4efd-4d8e-a7db-f94bb7160108",
                        "name": "dental",
                        "image": null,
                        "description": null,
                        "__typename": "directory_services"
                    },
                    {
                        "id": "d1cc403e-1834-4986-a2a8-3b7732628f8a",
                        "name": "Teeth Cleaning",
                        "image": null,
                        "description": null,
                        "__typename": "directory_services"
                    },
                    {
                        "id": "a45abcda-6ceb-4669-bc3e-daf35b9c0536",
                        "name": "Teeth Cleaning Testing ",
                        "image": null,
                        "description": null,
                        "__typename": "directory_services"
                    },
                    {
                        "id": "9ebd41fa-c452-4c8a-a1cf-3cdb00b90d0a",
                        "name": "vishwa",
                        "image": null,
                        "description": "vishwa",
                        "__typename": "directory_services"
                    }
                ],
                "directory_certifications": [
                    {
                        "id": "5230aa1b-7454-4541-a9d7-cb2abeb69f5e",
                        "title": "BASIC INFORMATION",
                        "attachments": {
                            "url": "https://dentalerp-dev.s3-ap-southeast-2.amazonaws.com/uploads360/project/8249998b-2b40-41f5-a62a-fd8755536d17",
                            "name": "Blue and Orange Simple Pharmacy Store Instagram Post.png",
                            "size": 673614,
                            "status": "success",
                            "file_id": "8249998b-2b40-41f5-a62a-fd8755536d17",
                            "isPublic": true,
                            "directory": "project",
                            "extension": "png",
                            "mime_type": "image/png"
                        },
                        "__typename": "directory_certifications"
                    }
                ],
                "directory_achievements": [],
                "directory_appointments": [
                    {
                        "id": "b119d21f-aa10-425c-87b2-db598ff5cb55",
                        "__typename": "directory_appointments"
                    },
                    {
                        "id": "61e7b513-5254-43a4-8d62-5d13620c2f79",
                        "__typename": "directory_appointments"
                    }
                ],
                "directory_team_members": [
                    {
                        "id": "6b70f8e7-aa92-4620-b5d9-6a8d3672f229",
                        "name": "Viswa",
                        "specialization": "Dentist",
                        "image": {
                            "url": "https://dentalerp-dev.s3-ap-southeast-2.amazonaws.com/uploads360/project/9fdb331c-d0b9-4074-91db-7a0a2a0821f4",
                            "name": "660d2f5487880c4b5e0899e3_tTk7pTQOTzubYmq0Is9L3rP_Bq0_499U4_dAtj8CTejipyCUvSJK2CiEQ20w12xAJnkddwdpMqkAVl9lE37Fnl2HCnMofI2GMcXn0LMWwh602vnuFfVVoPl7B0_RmsQvEJnYsRCQJ_ffl3K4MrxVjc8.jpeg",
                            "size": 107980,
                            "status": "success",
                            "file_id": "9fdb331c-d0b9-4074-91db-7a0a2a0821f4",
                            "isPublic": true,
                            "directory": "project",
                            "extension": "jpeg",
                            "mime_type": "image/jpeg"
                        },
                        "phone": null,
                        "email": null,
                        "subrub": null,
                        "state": null,
                        "__typename": "directory_team_members"
                    }
                ],
                "directory_gallery_posts": [
                    {
                        "id": "fc2a6112-5a51-4d4a-9408-bf452d955a12",
                        "image": [
                            {
                                "url": "https://dentalerp-dev.s3-ap-southeast-2.amazonaws.com/uploads360/project/e44ae031-0747-49a2-bdc5-b9915295ec7b",
                                "name": "ChatGPT Image Jan 19, 2026, 10_48_29 AM.png",
                                "size": 1290983,
                                "type": "image",
                                "status": "success",
                                "file_id": "e44ae031-0747-49a2-bdc5-b9915295ec7b",
                                "isPublic": true,
                                "directory": "project",
                                "extension": "png",
                                "mime_type": "image/png"
                            }
                        ],
                        "before_image": null,
                        "after_image": null,
                        "banner_image": null,
                        "profile_image": null,
                        "logo": null,
                        "before_and_after": null,
                        "__typename": "directory_gallery_posts"
                    }
                ],
                "directory_testimonials": [],
                "directory_faqs": [],
                "__typename": "directories"
            }
        ]
    }
}
]