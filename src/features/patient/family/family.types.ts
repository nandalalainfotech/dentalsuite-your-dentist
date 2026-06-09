
export interface FamilyMember {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string;
  relation: 'self' | 'spouse' | 'child' | 'father' | 'mother' | 'sibling' | 'other';
  isActive: boolean;
}