import { localClient } from "../api/apollo/localClient";
import type { EnrichedAppointment } from "../pages/practice/PracticeOnlineBookings";
import { GET_APPOINTMENTS_QUERY } from "../queries/onlinebooking_query";

// ✅ Response type
interface GetAppointmentsResponse {
  online_booking: EnrichedAppointment[];
}

// ✅ Variables type
interface GetAppointmentsVariables {
  practice_id: string;
}

export const getAppointmentsService = async (
  practice_id: string
): Promise<EnrichedAppointment[]> => {
  try {
    const { data } = await localClient.query<
      GetAppointmentsResponse,
      GetAppointmentsVariables
    >({
      query: GET_APPOINTMENTS_QUERY,
      variables: { practice_id },
      fetchPolicy: "network-only",
    });

    if (!data?.online_booking) {
      return [];
    }

    return data.online_booking;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};