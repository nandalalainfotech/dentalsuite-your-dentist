import { interfaceClient } from "../api/apollo/dental_interface";
import type { EnrichedAppointment } from "../pages/practice/PracticeOnlineBookings";
import { GET_APPOINTMENTS_QUERY } from "../queries/onlinebooking_query";

export const getAppointmentsService = async (
  practice_id: string
): Promise<EnrichedAppointment[]> => {

  const { data } = await interfaceClient.query<any>({
    query: GET_APPOINTMENTS_QUERY,
    variables: { practice_id },
    fetchPolicy: "network-only",
  });

  if (!data) throw new Error("Failed to fetch appointments");

  return data.online_booking_your_dentist;
};