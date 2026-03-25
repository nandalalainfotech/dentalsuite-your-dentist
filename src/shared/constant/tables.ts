export const Tables = {
  Practice_Achievements: 'practice_achievements',
  Practice_Base_Info: 'practice_base_info',
  practice_certifications: 'practice_certifications',
  practice_exceptions: 'practice_exceptions',
  practice_facilities: 'practice_facilities',
  practice_gallery: 'practice_gallery',
  practice_info: 'practice_info',
  practice_insurances: 'practice_insurances',
  practice_opening_hours: 'practice_opening_hours',
  practice_services: 'practice_services',
  Practice_Team_Members: 'practice_team_members',
} as const;

export type Table = (typeof Tables)[keyof typeof Tables];