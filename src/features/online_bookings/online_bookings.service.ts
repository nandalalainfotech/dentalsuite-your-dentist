import { localClient } from "../../api/apollo/localClient";
import {
  GET_APPOINTMENTS_QUERY,
  GET_PRACTITIONERS_QUERY,
  GET_SERVICES,
  GET_HOURS,
  RESCHEDULE_MUTATION,
  UPDATE_STATUS_MUTATION,
  DELETE_BREAK_MUTATION,
  GET_BREAKS_QUERY,
  INSERT_BREAK_MUTATION,
  UPDATE_BREAK_MUTATION
} from "../../pages/practice/dashboard/graphql/onlinebookings.query";
import type { 
  OnlineBooking, 
  Practitioner, 
  PracticeService, 
  PracticeOpeningHours, 
  PractitionerBreak
} from "./online_bookings.type";

// --- 1. FETCH APPOINTMENTS ---
const getAppointments = async (practiceId: string): Promise<OnlineBooking[]> => {
  const response = await localClient.query({
    query: GET_APPOINTMENTS_QUERY,
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;
  return data.online_bookings || [];
};

// --- 2. UPDATE STATUS ---
const updateStatus = async (id: string, status: string): Promise<OnlineBooking> => {
  const response = await localClient.mutate({
    mutation: UPDATE_STATUS_MUTATION,
    variables: { id, status },
  });

  const data = response.data as any;
  return data.update_online_bookings_by_pk;
};

// --- 3. RESCHEDULE ---
const reschedule = async (id: string, date: string, time: string, practitionerId: string): Promise<OnlineBooking> => {
  const response = await localClient.mutate({
    mutation: RESCHEDULE_MUTATION,
    variables: {
      id,
      date,
      time,
      practitioner_id: practitionerId
    },
  });

  const data = response.data as any;
  return data.update_online_bookings_by_pk;
};

// --- 4. FETCH PRACTITIONERS ---
const getPractitioners = async (practiceId: string): Promise<Practitioner[]> => {
  const response = await localClient.query({
    query: GET_PRACTITIONERS_QUERY,
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;
  const rawMembers = data.practice_team_members || [];

  // Map to clean structure, keeping your specific image object check
  return rawMembers.map((m: any) => ({
    id: m.id,
    name: m.name,
    image: m.image && typeof m.image === 'object' ? m.image.url : m.image,
    role: m.role
  }));
};

// --- 5. FETCH SERVICES ---
const getPracticeServices = async (practiceId: string): Promise<PracticeService[]> => {
  const response = await localClient.query({
    query: GET_SERVICES,
    variables: { practiceId },
    fetchPolicy: "cache-first", 
  });

  return (response.data as any).practice_services || [];
};

// --- 6. FETCH OPENING HOURS ---
const getOpeningHours = async (practiceId: string): Promise<PracticeOpeningHours[]> => {
  const response = await localClient.query({
    query: GET_HOURS,
    variables: { practiceId },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;
  return data.practice_opening_hours || [];
};

const getBreaks = async (practiceId: string): Promise<PractitionerBreak[]> => {
  const response = await localClient.query({
    query: GET_BREAKS_QUERY,
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });
  return (response.data as any).practice_practitioner_breaks || [];
};

// --- 8. INSERT BREAK ---
const insertBreak = async (breakData: Omit<PractitionerBreak, "id">): Promise<PractitionerBreak> => {
  const response = await localClient.mutate({
    mutation: INSERT_BREAK_MUTATION,
    variables: { object: breakData },
  });
  return (response.data as any).insert_practice_practitioner_breaks_one;
};

// --- 9. UPDATE BREAK ---
const updateBreak = async (id: string, breakData: Partial<PractitionerBreak>): Promise<PractitionerBreak> => {
  const response = await localClient.mutate({
    mutation: UPDATE_BREAK_MUTATION,
    variables: { id, object: breakData },
  });
  return (response.data as any).update_practice_practitioner_breaks_by_pk;
};

// --- 10. DELETE BREAK ---
const deleteBreak = async (id: string): Promise<string> => {
  await localClient.mutate({
    mutation: DELETE_BREAK_MUTATION,
    variables: { id },
  });
  return id; 
};

const appointmentsService = {
  getAppointments,
  getPractitioners,
  updateStatus,
  reschedule,
  getPracticeServices,
  getOpeningHours,
  getBreaks,
  insertBreak,
  updateBreak,
  deleteBreak
};

export default appointmentsService;