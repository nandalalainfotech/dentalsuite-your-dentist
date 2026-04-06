import { localClient } from "../../api/apollo/localClient";
import type { AppointmentType, TeamMemberApptContext, PractitionerSetting } from "./appointment_types.types";
import { DELETE_APPT_TYPE, GET_DATA, INSERT_APPT_TYPE, UPDATE_APPT_TYPE, UPDATE_TEAM_MEMBER_JSON } from "../../pages/practice/dashboard/graphql/appointmenttypes.query";

// --- HELPER FUNCTIONS ---
const mapToDbObject = (data: AppointmentType, practiceId: string) => ({
  practice_id: practiceId,
  name: data.name,
  existing_enabled: data.existingEnabled,
  existing_duration: data.existingDuration,
  existing_link: data.existingLink,
  existing_future_booking_limit: data.existingFutureBookingLimit,
  new_enabled: data.newEnabled,
  new_duration: data.newDuration,
  new_link: data.newLink,
  new_future_booking_limit: data.newFutureBookingLimit,
  new_terms_enabled: data.newTermsEnabled,
  online_enabled: data.onlineEnabled,
  ask_reason: data.askReason,
  add_message: data.addMessage,
  unavailable_action: data.unavailableAction,
  cancellation_enabled: data.cancellationEnabled,
  sort_order: data.sortOrder || 0,
});

// --- SERVICE METHODS ---
const getAppointmentTypesData = async (practiceId: string) => {
  const response = await localClient.query({
    query: GET_DATA,
    variables: { practiceId },
    fetchPolicy: "network-only",
  });

  const data = response.data as any;

  const appointmentTypes = data.appointment_types.map((item: any) => ({
    id: item.id,
    name: item.name,
    existingEnabled: item.existing_enabled,
    existingDuration: item.existing_duration,
    existingLink: item.existing_link || "",
    existingFutureBookingLimit: item.existing_future_booking_limit,
    newEnabled: item.new_enabled,
    newDuration: item.new_duration,
    newLink: item.new_link || "",
    newFutureBookingLimit: item.new_future_booking_limit,
    newTermsEnabled: item.new_terms_enabled,
    onlineEnabled: item.online_enabled,
    askReason: item.ask_reason,
    addMessage: item.add_message,
    unavailableAction: item.unavailable_action,
    cancellationEnabled: item.cancellation_enabled,
    sortOrder: item.sort_order,
  }));

  const teamMembers = data.practice_team_members.map((tm: any) => ({
    id: tm.id,
    name: tm.name,
    appointmentTypes: tm.appointment_types || []
  }));

  return { appointmentTypes, teamMembers };
};

const saveFullAppointmentType = async (payload: {
  id?: string, 
  data: AppointmentType, 
  practiceId: string,
  practitionerSettings: Record<string, PractitionerSetting>,
  teamMembers: TeamMemberApptContext[]
}) => {
  const { id, data, practiceId, practitionerSettings, teamMembers } = payload;

  const dbObject = mapToDbObject(data, practiceId);
  const isNew = !id || id.startsWith("temp-");
  
  let actualApptTypeId = id;

  // 1. Save Master Appointment Type AND get the real ID if it's new
  if (isNew) {
    const response = await localClient.mutate({ mutation: INSERT_APPT_TYPE, variables: { object: dbObject } });
    const data = response.data as any;
    actualApptTypeId = data.insert_appointment_types_one.id;
  } else {
    await localClient.mutate({ mutation: UPDATE_APPT_TYPE, variables: { id, changes: dbObject } });
  }

  // 2. Update Practitioners' JSON Arrays sequentially to ensure DB stability
  for (const member of teamMembers) {
    const setting = practitionerSettings[member.id] || { ex: false, new: false };

    // Remove old entries for this appointment
    const filteredJson = member.appointmentTypes.filter((t: any) => 
      t.id !== actualApptTypeId && t.name !== data.name
    );

    const newJson = [...filteredJson];

    // ONLY push "New" if the master template has "New" enabled
    if (data.newEnabled) {
      newJson.push({ 
        id: actualApptTypeId, 
        name: data.name, 
        patientType: 'New', 
        duration: data.newDuration, 
        enabled: setting.new 
      });
    }

    // ONLY push "Existing" if the master template has "Existing" enabled
    if (data.existingEnabled) {
      newJson.push({ 
        id: actualApptTypeId, 
        name: data.name, 
        patientType: 'Existing', 
        duration: data.existingDuration, 
        enabled: setting.ex 
      });
    }

    await localClient.mutate({
      mutation: UPDATE_TEAM_MEMBER_JSON,
      variables: { id: member.id, json: newJson }
    });
  }

  return true;
};

const deleteAppointmentType = async (id: string): Promise<string> => {
  await localClient.mutate({ mutation: DELETE_APPT_TYPE, variables: { id } });
  return id;
};

const appointmentTypesService = { getAppointmentTypesData, saveFullAppointmentType, deleteAppointmentType };
export default appointmentTypesService;