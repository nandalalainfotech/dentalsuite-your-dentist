export interface GetDirectoryResponse {
  directories: Directory[];
}

export interface Directory {
  id: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  alt_phone: string;
  business_name: string;
  type: string;
  abn_acn: string;
  zipcode: string;
  company_name: string;
  profession_type: string;
  directory_category_id: string;
  logo: string;
  banner: string;

  dental_practice: {
    id: string;
    business_name: string;
  };

  directory_documents: DirectoryDocument[];
  directory_locations: DirectoryLocation[];
  directory_services: DirectoryService[];
  directory_certifications: DirectoryCertification[];
  directory_achievements: DirectoryAchievement[];
  directory_appointments: DirectoryAppointment[];
  directory_team_members: DirectoryTeamMember[];
  directory_gallery_posts: DirectoryGalleryPost[];
  directory_testimonials: DirectoryTestimonial[];
  directory_faqs: DirectoryFaq[];
}

export interface DirectoryDocument {
  name: string;
  attachment: string;
}

export interface DirectoryLocation {
  id: string;
  media_name: string;
  media_link: string;
  status: string;
  week_name: string;
  time: string;
  openingHours: string;
}

export interface DirectoryService {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface DirectoryCertification {
  id: string;
  title: string;
  attachments: string;
}

export interface DirectoryAchievement {
  id: string;
  title: string;
  attachments: string;
}

export interface DirectoryAppointment {
  id: string;
}

export interface DirectoryTeamMember {
  id: string;
  name: string;
  specialization: string;
  image: string;
  phone: string;
  email: string;
  subrub: string;
  state: string;
}

export interface DirectoryGalleryPost {
  id: string;
  image: string;
  before_image: string;
  after_image: string;
  banner_image: string;
  profile_image: string;
  logo: string;
  before_and_after: boolean;
}

export interface DirectoryTestimonial {
  id: string;
  profile_image: string;
  name: string;
  message: string;
  msg_pic: string;
}

export interface DirectoryFaq {
  id: string;
  question: string;
  answer: string;
}