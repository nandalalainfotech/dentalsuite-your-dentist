import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { localClient } from "../../api/apollo/localClient";
import { useAppSelector } from "../../store";

// =========================
// QUERY
// =========================
const GET_BILLING_SETTINGS = gql`
  query GetBillingSettings($practiceId: uuid!) {
    payment_settings(limit: 1) {
      id
      pay_per_patient_amount
      pay_per_month_amount
    }

    accounts_by_pk(id: $practiceId) {
      id
      payment_type
    }
  }
`;

// =========================
// TYPES
// =========================
interface PaymentSetting {
    id: string;
    pay_per_patient_amount: number;
    pay_per_month_amount: number;
}

interface Account {
    id: string;
    payment_type: "PAY_PER_PATIENT" | "PAY_PER_MONTH";
}

interface GetBillingSettingsResponse {
    payment_settings: PaymentSetting[];
    accounts_by_pk: Account | null;
}

interface GetBillingSettingsVariables {
    practiceId: string;
}

// =========================
// HOOK
// =========================
export const useBillingSettings = () => {

    const { user } = useAppSelector(
        (state: any) => state.auth
    );

    const practiceId =
        user?.practiceId ||
        user?.practice_id ||
        user?.id;

    const {
        data,
        loading,
        error
    } = useQuery<
        GetBillingSettingsResponse,
        GetBillingSettingsVariables
    >(
        GET_BILLING_SETTINGS,
        {
            client: localClient,

            skip: !practiceId,

            variables: {
                practiceId
            },

            fetchPolicy: "cache-and-network"
        }
    );

    const settings =
        data?.payment_settings?.[0];

    return {
        loading,
        error,

        paymentType:
            data?.accounts_by_pk?.payment_type ||
            "PAY_PER_PATIENT",

        patientRate:
            settings?.pay_per_patient_amount || 0,

        monthlyRate:
            settings?.pay_per_month_amount || 0
    };
};