import { localClient } from "../../api/apollo/localClient";
import { GET_PRACTICE_PROFILE_QUERY, UPDATE_PRACTICE_PROFILE_MUTATION } from "../../pages/practice/dashboard/graphql/dashboard.query";
import type { PracticeProfile, UpdateProfilePayload } from "./dashboard.types";

interface DashboardQueryResponse {
  practice_info: {
    id: string;
    practice_name: string;
    abn_number: string;
    practice_type: string;
    email: string;
    practice_phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    first_name: string;
    last_name: string;
    mobile: string;
    logo: string | null;
  }[];
}

interface UpdateProfileMutationResponse {
  update_practice_info_by_pk: {
    id: string;
    practice_name: string;
    abn_number: string;
    practice_type: string;
    email: string;
    practice_phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    first_name: string;
    last_name: string;
    mobile: string;
    logo: string | null;
  } | null;
}

const getProfile = async (userId: string): Promise<PracticeProfile> => {
  const { data } = await localClient.query<DashboardQueryResponse>({
    query: GET_PRACTICE_PROFILE_QUERY,
    variables: { id: userId },
    fetchPolicy: "network-only",
  });

  const practice = data?.practice_info?.[0];

  if (!practice) {
    throw new Error("Profile not found");
  }

  return {
    id: practice.id,
    practiceName: practice.practice_name,
    abnNumber: practice.abn_number,
    practiceType: practice.practice_type,
    email: practice.email,
    phone: practice.practice_phone,
    address: practice.address,
    city: practice.city,
    state: practice.state,
    postcode: practice.postcode,
    firstName: practice.first_name,
    lastName: practice.last_name,
    mobile: practice.mobile,
    logo: practice.logo || null,
  };
};

const updateProfile = async (id: string, payload: UpdateProfilePayload): Promise<PracticeProfile> => {
  const dbChanges = {
    practice_name: payload.practiceName,
    abn_number: payload.abnNumber,
    practice_type: payload.practiceType,
    email: payload.email,
    practice_phone: payload.phone,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    postcode: payload.postcode,
    first_name: payload.firstName,
    last_name: payload.lastName,
    mobile: payload.mobile,
    ...(payload.logo ? { logo: payload.logo } : {}), 
  };

  const { data } = await localClient.mutate<UpdateProfileMutationResponse>({
    mutation: UPDATE_PRACTICE_PROFILE_MUTATION,
    variables: { id: id, changes: dbChanges },
  });

  const updated = data?.update_practice_info_by_pk;

  if (!updated) {
    throw new Error("Failed to update profile");
  }

  return {
    id: updated.id,
    practiceName: updated.practice_name,
    abnNumber: updated.abn_number,
    practiceType: updated.practice_type,
    email: updated.email,
    phone: updated.practice_phone,
    address: updated.address,
    city: updated.city,
    state: updated.state,
    postcode: updated.postcode,
    firstName: updated.first_name,
    lastName: updated.last_name,
    mobile: updated.mobile,
    logo: updated.logo || null,
  };
};

const dashboardService = { getProfile, updateProfile };
export default dashboardService;