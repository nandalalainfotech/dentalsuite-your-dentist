// src/features/directory/directory.service.ts
import { localClient } from "../../api/apollo/localClient";
import {
  GET_PRACTICE_DIRECTORY_QUERY,
  GET_ALL_SERVICES_QUERY,
  UPDATE_PRACTICE_DIRECTORY_MUTATION,
  UPDATE_PRACTICE_SERVICES_MUTATION,
  UPDATE_PRACTICE_CERTIFICATIONS_MUTATION,
  UPDATE_PRACTICE_ACHIEVEMENTS_MUTATION,
  UPDATE_PRACTICE_TEAM_MUTATION,
  DELETE_PRACTICE_TEAM_MEMBER_MUTATION, 
  UPDATE_PRACTICE_GALLERY_MUTATION,
  UPDATE_PRACTICE_INSURANCES_MUTATION,
  UPDATE_PRACTICE_FACILITIES_MUTATION,
  UPDATE_PRACTICE_OPENING_HOURS_MUTATION,
  UPDATE_PRACTICE_EXCEPTIONS_MUTATION
} from "../../pages/practice/directory/graphql/directory.query";
import type { DirectoryProfile, UpdateDirectoryPayload, AllService } from "./directory.types";

const cleanObject = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => newObj[key] === undefined && delete newObj[key]);
  return newObj;
};

// --- FETCH ALL SERVICES ---
const getAllServices = async (): Promise<AllService[]> => {
  const response = await localClient.query({
    query: GET_ALL_SERVICES_QUERY,
    fetchPolicy: "cache-first",
  });

  const data = response.data as any;
  
  return data.all_services || [];
};

// --- 1. FETCH DIRECTORY ---
const getDirectory = async (id: string): Promise<DirectoryProfile> => {
  const response = await localClient.query({
    query: GET_PRACTICE_DIRECTORY_QUERY,
    variables: { id },
    fetchPolicy: "network-only",
  });
  
  const data = response.data as any;
  const raw = data.practice_info_by_pk;
  
  if (!raw) throw new Error("Directory information not found");

  const baseInfo = raw.practice_base_info || {};

  return {
    ...raw,
    ...baseInfo, 
    id: raw.id,   
    base_info_id: baseInfo.id, 
    practice_opening_hours: raw.practice_opening_hours || [],
    practice_facilities: raw.practice_facilities || [],
    practice_team_members: raw.practice_team_members || [],
    practice_services: raw.practice_services || [],
    practice_insurances: raw.practice_insurances || [],
    practice_galleries: raw.practice_galleries || [],
    practice_achievements: raw.practice_achievements || [],
    practice_certifications: raw.practice_certifications || [],
    practice_exceptions: raw.practice_exceptions || [],
  } as DirectoryProfile;
};

// --- 2. UPDATE BASE INFO ---
const updateDirectory = async (payload: UpdateDirectoryPayload): Promise<string> => {
  const infoChanges = {
    practice_name: payload.data.practice_name,
    logo: payload.data.logo,
    abn_number: payload.data.abn_number,
    practice_type: payload.data.practice_type,
    practice_phone: payload.data.practice_phone,
    address: payload.data.address,
    city: payload.data.city,
    state: payload.data.state,
    postcode: payload.data.postcode,
    first_name: payload.data.first_name,
    last_name: payload.data.last_name,
    mobile: payload.data.mobile,
  };

  const baseInfoChanges = {
    practice_id: payload.id,
    website: payload.data.website,
    directions: payload.data.directions,
    alert_message: payload.data.alert_message,
    facebook_url: payload.data.facebook_url,
    instagram_url: payload.data.instagram_url,
    twitter_url: payload.data.twitter_url,
    youtube_url: payload.data.youtube_url,
    formatted_address: payload.data.formatted_address,
    banner_image: payload.data.banner_image,
    description: payload.data.description,
  };

  await localClient.mutate({
    mutation: UPDATE_PRACTICE_DIRECTORY_MUTATION,
    variables: { 
      id: payload.id, 
      infoChanges: cleanObject(infoChanges), 
      baseInfoChanges: cleanObject(baseInfoChanges) 
    },
  });

  return "Profile settings updated successfully!";
};

// --- 3. TEAM MEMBERS (UPDATED FOR NEW JUNCTION TABLE) ---
const updateTeamMembers = async (practiceId: string, team: any[]): Promise<string> => {
  
  const junctionObjects: any[] = []; 

  const payload = team.map(t => {
    const finalImage = t.image && typeof t.image === 'object' ? t.image.url : t.image;

    const memberObj = {
      id: t.id, 
      practice_id: practiceId,
      first_name: t.first_name,
      last_name: t. last_name,
      role: t.role,
      qualification: t.qualification,
      gender: t.gender,
      ahpra_number: t.ahpra || t.ahpra_number, 
      education: t.education,
      languages: t.languages,
      professional_statement: t.professionalStatement || t.professional_statement,
      image: finalImage,
      is_visible_online: t.isVisibleOnline ?? t.is_visible_online ?? false,
      allow_multiple_bookings: t.allowMultipleBookings ?? t.allow_multiple_bookings ?? true,
      booking_time_limit: Number(t.bookingTimeLimit || t.booking_time_limit || 0),
      booking_time_limit_unit: t.bookingTimeLimitUnit || t.booking_time_limit_unit || 'minutes',
      cancel_time_limit: Number(t.cancelTimeLimit || t.cancel_time_limit || 0),
      cancel_time_limit_unit: t.cancelTimeLimitUnit || t.cancel_time_limit_unit || 'minutes',
      appointment_types: t.appointmentTypes || t.appointment_types || []
    };

    if (!memberObj.id || memberObj.id.startsWith('new-')) {
      delete (memberObj as any).id; 
    }

    // Capture selected services to insert into the NEW junction table
    if (t.selectedServiceIds && t.selectedServiceIds.length > 0) {
      t.selectedServiceIds.forEach((serviceId: string) => {
        // Must check that the ID doesn't start with new- before adding to relational table
        if (!t.id.startsWith('new-')) {
          junctionObjects.push({
            practitioner_id: t.id, 
            practice_service_id: serviceId, 
            practice_id: practiceId 
          });
        }
      });
    }
    
    return memberObj;
  });

  await localClient.mutate({ 
    mutation: UPDATE_PRACTICE_TEAM_MUTATION, 
    variables: { 
      practiceId,
      objects: payload,
      junctionObjects: junctionObjects
    } 
  });
  
  return "Team updated successfully!";
};

const deleteTeamMember = async (id: string): Promise<string> => {
  if (!id) return "No ID provided";
  await localClient.mutate({
    mutation: DELETE_PRACTICE_TEAM_MEMBER_MUTATION,
    variables: { id }
  });
  return "Team member deleted";
};

// --- 4. OTHER ARRAYS (UPDATED FOR UPSERTS) ---
const updateServices = async (practiceId: string, services: any[]): Promise<string> => {
  // 1. Map payload
  const payload = services.map(s => ({ 
    practice_id: practiceId, 
    ...s 
  }));
  
  // 2. Extract active names so the DB knows which ones to protect from deletion
  const activeNames = services.map(s => s.name);

  // 3. Send to new Upsert Mutation
  await localClient.mutate({ 
    mutation: UPDATE_PRACTICE_SERVICES_MUTATION, 
    variables: { 
      practiceId, 
      services: payload,
      activeNames: activeNames 
    } 
  });
  
  return "Services updated!";
};

const updateCertifications = async (practiceId: string, certifications: any[]): Promise<string> => {
  const payload = certifications.map(c => ({ practice_id: practiceId, ...c }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_CERTIFICATIONS_MUTATION, variables: { practiceId, certifications: payload } });
  return "Certifications updated!";
};

const updateAchievements = async (practiceId: string, achievements: any[]): Promise<string> => {
  const payload = achievements.map(a => ({ practice_id: practiceId, ...a }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_ACHIEVEMENTS_MUTATION, variables: { practiceId, achievements: payload } });
  return "Achievements updated!";
};

const updateGalleries = async (practiceId: string, galleries: any[]): Promise<string> => {
  const payload = galleries.map(g => ({ practice_id: practiceId, ...g }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_GALLERY_MUTATION, variables: { practiceId, galleries: payload } });
  return "Gallery updated!";
};

const updateInsurances = async (practiceId: string, insurances: string[]): Promise<string> => {
  const payload = insurances.map(name => ({ practice_id: practiceId, provider_name: name }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_INSURANCES_MUTATION, variables: { practiceId, insurances: payload } });
  return "Insurances updated!";
};

const updateFacilities = async (practiceId: string, facilities: string[]): Promise<string> => {
  const payload = facilities.map(name => ({ practice_id: practiceId, facility_name: name }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_FACILITIES_MUTATION, variables: { practiceId, facilities: payload } });
  return "Facilities updated!";
};

const updateOpeningHours = async (practiceId: string, hours: any[]): Promise<string> => {
  const payload = hours.map(h => ({ practice_id: practiceId, ...h }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_OPENING_HOURS_MUTATION, variables: { practiceId, hours: payload } });
  return "Opening hours updated!";
};

const updateExceptions = async (practiceId: string, exceptions: any[]): Promise<string> => {
  const payload = exceptions.map(e => ({ practice_id: practiceId, ...e }));
  await localClient.mutate({ mutation: UPDATE_PRACTICE_EXCEPTIONS_MUTATION, variables: { practiceId, exceptions: payload } });
  return "Exceptions updated!";
};

const directoryService = {
  getAllServices, 
  getDirectory,
  updateDirectory,
  updateServices,
  updateCertifications,
  updateAchievements,
  updateTeamMembers,
  deleteTeamMember, 
  updateGalleries,
  updateInsurances,
  updateFacilities,
  updateOpeningHours,
  updateExceptions
};

export default directoryService;