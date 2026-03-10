/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PracticeWithDashboard } from '../types/auth';
import type { Clinic } from '../types';
import { clinics } from './clinics';

// --- HELPER: Map Clinic to Practice Object ---
const mapClinicToPractice = (clinic: Clinic, role: 'practice' | 'superadmin'): PracticeWithDashboard => {
  // Extract address parts (City/State/Postcode)
  const address = clinic.address || '';
  // Simple regex to extract postcode (4 digits)
  const postcodeMatch = address.match(/\b\d{4}\b/);
  const postcode = postcodeMatch ? postcodeMatch[0] : '2000';
  
  // Very basic state extraction (you can improve this parser later)
  const stateMatch = address.match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/);
  const state = (stateMatch ? stateMatch[0] : 'NSW') as any;

  // City is whatever is left (simplified)
  const city = address.replace(postcode, '').replace(state, '').replace(/,/g, '').trim() || 'Sydney';

  return {
  id: clinic.id,
  role: role, // <--- SET DYNAMIC ROLE


  // If Super Admin, append label to name
  practiceName: role === 'superadmin' ? `${clinic.name} (Super Admin)` : clinic.name,

  // Use the email that was used to login
  email: role === 'superadmin' && clinic.admin ? clinic.admin.email : (clinic.email ?? ''),
  password: '', // Don't return password

  firstName: role === 'superadmin' ? 'Super' : 'Practice',
  lastName: 'Admin',

  abnNumber: '00-000-000',
  mobileNumber: clinic.phone || '',
  practiceLogo: clinic.logo || '',
  practiceType: 'general_dentistry',
  practicePhone: clinic.phone || '',
  practiceAddress: clinic.address || '',
  practiceCity: city,
  practiceState: state,
  practicePostcode: postcode,
  createdAt: new Date().toISOString(),
  appointments: [],
  notifications: [],
  profileImage: undefined,
  isActive: true,
  rating: clinic.rating || 0,
  totalReviews: 0,
  business_name: ''
};
};

// --- API OBJECT ---
export const practiceApi = {
  getAllPractices: (): PracticeWithDashboard[] => {
    // Map all as standard practices for listing purposes
    return clinics.map(c => mapClinicToPractice(c, 'practice'));
  },
  
  // --- UPDATED VALIDATION LOGIC ---
  validatePracticeCredentials: (v: string, p: string): PracticeWithDashboard | null => {
    const inputEmail = v.toLowerCase().trim();

    for (const clinic of clinics) {
      
      // 1. CHECK CLINIC PROFILE LOGIN
      // Check Email OR Phone (if phone matches input)
      const isProfileEmail = clinic.email && clinic.email.toLowerCase() === inputEmail;
      // Phone check logic (simplified)
      const isProfilePhone = clinic.phone && clinic.phone.replace(/\D/g,'') === v.replace(/\D/g,'');

      if ((isProfileEmail || isProfilePhone) && clinic.password === p) {
        return mapClinicToPractice(clinic, 'practice');
      }

      // 2. CHECK CLINIC SUPER ADMIN LOGIN
      if (clinic.admin) {
        const isAdminEmail = clinic.admin.email.toLowerCase() === inputEmail;
        if (isAdminEmail && clinic.admin.password === p) {
          return mapClinicToPractice(clinic, 'superadmin');
        }
      }
    }
    
    return null;
  },
  // --------------------------------

  getPracticeById: (id: string) => {
    const c = clinics.find(x => x.id === id);
    return c ? mapClinicToPractice(c, 'practice') : null;
  },
  
  // ... (Keep existing stubs for other methods to satisfy TS interface)
  getPracticeByEmail: () => null,
  getPracticeByMobile: () => null,
  getPracticeByEmailOrMobile: () => null,
  updatePractice: () => null,
  updatePracticeProfile: () => null,
  addPractice: (d: any) => ({ ...d, id: 'new', createdAt: new Date().toISOString() } as any),
  searchPractices: () => [],
  getPracticesByType: () => [],
  getPracticesByState: () => [],
  getPracticesByDateRange: () => [],
  getPracticeStats: () => ({}),
  deletePractice: () => false,
  emailExists: () => false,
  mobileExists: () => false,
  abnExists: () => false
};

// Export individual functions for easier importing
export const {
  getAllPractices,
  validatePracticeCredentials,
  getPracticeById
} = practiceApi;