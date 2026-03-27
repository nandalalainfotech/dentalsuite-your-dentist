/* eslint-disable @typescript-eslint/no-explicit-any */
import { localClient } from "../../api/apollo/localClient";
import { 
  GET_APPOINTMENTS_QUERY, 
  GET_PRACTITIONERS_QUERY, 
  RESCHEDULE_MUTATION, 
  UPDATE_STATUS_MUTATION 
} from "../../pages/practice/dashboard/graphql/appointments.query";
import type { OnlineBooking, Practitioner } from "./appointments.type";

// --- 1. FETCH APPOINTMENTS ---
const getAppointments = async (practiceId: string): Promise<OnlineBooking[]> => {
  const response = await localClient.query({
    query: GET_APPOINTMENTS_QUERY,
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });

  // FIX: Cast 'response.data' to 'any' to access 'online_bookings' safely
  const data = response.data as any;

  return data.online_bookings || [];
};

// --- 2. UPDATE STATUS ---
const updateStatus = async (id: string, status: string) => {
  const response = await localClient.mutate({
    mutation: UPDATE_STATUS_MUTATION,
    variables: { id, status },
  });
  
  // FIX: Cast 'response.data' to 'any'
  const data = response.data as any;
  return data.update_online_bookings_by_pk;
};

// --- 3. RESCHEDULE ---
const reschedule = async (id: string, date: string, time: string) => {
  const response = await localClient.mutate({
    mutation: RESCHEDULE_MUTATION,
    variables: { id, date, time },
  });
  
  // FIX: Cast 'response.data' to 'any'
  const data = response.data as any;
  return data.update_online_bookings_by_pk;
};

const getPractitioners = async (practiceId: string): Promise<Practitioner[]> => {
  const response = await localClient.query({
    query: GET_PRACTITIONERS_QUERY,
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;
  const rawMembers = data.practice_team_members || [];

  // Map to clean structure
  return rawMembers.map((m: any) => ({
    id: m.id,
    name: m.name,
    // Handle image object vs string issue
    image: m.image && typeof m.image === 'object' ? m.image.url : m.image,
    role: m.role,
    areas_of_interest: m.areas_of_interest
  }));
};

const appointmentsService = {
  getAppointments,
  getPractitioners,
  updateStatus,
  reschedule
};

export default appointmentsService;