/* eslint-disable @typescript-eslint/no-explicit-any */

import { localClient } from "../../api/apollo/localClient";
import { GET_PRACTICE_SUBSCRIPTION, UPSERT_PRACTICE_SUBSCRIPTION } from "../../pages/practice/dashboard/graphql/subscription.query";
import { GET_PAYMENT_SETTINGS } from "../../pages/superadmin/graphql/payment.query";

export const subscriptionService = {

    async getSubscription(
        practiceId: string
    ) {

        const response =
            await localClient.query<any>({
                query:
                    GET_PRACTICE_SUBSCRIPTION,

                variables: {
                    practiceId
                },

                fetchPolicy: 'no-cache'
            });

        return (
            response.data
                ?.practice_subscription?.[0] ||
            null
        );
    },

    async saveSubscription({
        practiceId,
        paymentType
    }: {
        practiceId: string;
        paymentType: 'PAY_PER_PATIENT' | 'PAY_PER_MONTH';
    }) {

        /* =========================
            GET PAYMENT SETTINGS
        ========================= */

        const settingsResponse =
            await localClient.query<any>({
                query: GET_PAYMENT_SETTINGS,
                fetchPolicy: 'no-cache'
            });

        const settings =
            settingsResponse.data?.payment_settings?.[0];

        if (!settings) {
            throw new Error('Payment setting not found');
        }

        /* =========================
            GET CURRENT SUBSCRIPTION
        ========================= */

        const currentResponse =
            await localClient.query<any>({
                query: GET_PRACTICE_SUBSCRIPTION,
                variables: { practiceId },
                fetchPolicy: 'no-cache'
            });

        const current =
            currentResponse.data?.practice_subscription?.[0];

        const now = new Date();
        const end = current?.subscription_end_date
            ? new Date(current.subscription_end_date)
            : null;

        const isActive = end && end.getTime() > now.getTime();

        /* =========================
            LATEST PRICE FROM SETTINGS
        ========================= */

        const latestPrice =
            paymentType === 'PAY_PER_MONTH'
                ? settings.pay_per_month_amount
                : settings.pay_per_patient_amount;

        /* =========================
            CASE 1: MID CYCLE
        ========================= */

        if (isActive) {

            return await localClient.mutate<any>({

                mutation: UPSERT_PRACTICE_SUBSCRIPTION,

                variables: {
                    object: {

                        practice_id: practiceId,

                        current_payment_type:
                            current.current_payment_type,

                        current_price:
                            current.current_price,

                        subscription_start_date:
                            current.subscription_start_date,

                        subscription_end_date:
                            current.subscription_end_date,

                        pending_payment_type:
                            paymentType,

                        pending_price:
                            latestPrice,

                        pending_start_date:
                            current.subscription_end_date,

                        is_active: true
                    }
                },

                refetchQueries: [
                    {
                        query: GET_PRACTICE_SUBSCRIPTION,
                        variables: {
                            practiceId
                        }
                    }
                ],

                awaitRefetchQueries: true
            });
        }

        /* =========================
            CASE 2: EXPIRED → APPLY NOW
        ========================= */

        const nowTs = now.toISOString();

        const expiry = new Date();
        expiry.setDate(now.getDate() + 30);

        return await localClient.mutate<any>({

            mutation: UPSERT_PRACTICE_SUBSCRIPTION,

            variables: {
                object: {

                    practice_id: practiceId,

                    current_payment_type:
                        paymentType,

                    current_price:
                        latestPrice,

                    subscription_start_date:
                        nowTs,

                    subscription_end_date:
                        expiry.toISOString(),

                    pending_payment_type: null,

                    pending_price: null,

                    pending_start_date: null,

                    is_active: true
                }
            },

            refetchQueries: [
                {
                    query: GET_PRACTICE_SUBSCRIPTION,
                    variables: {
                        practiceId
                    }
                }
            ],

            awaitRefetchQueries: true
        });
    }
};