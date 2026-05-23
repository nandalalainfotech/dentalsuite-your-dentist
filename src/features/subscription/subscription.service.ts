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

        let subscription =
            response.data
                ?.practice_subscription?.[0] ||
            null;

        /* =========================
            NO SUBSCRIPTION
        ========================= */

        if (!subscription) {
            return null;
        }

        /* =========================
            CHECK EXPIRY
        ========================= */

        const now = new Date();

        const endDate =
            subscription.subscription_end_date
                ? new Date(
                    subscription.subscription_end_date
                )
                : null;

        const isExpired =
            endDate
                ? endDate.getTime() <= now.getTime()
                : false;

        /* =========================
            EXPIRED + NO PENDING
            AUTO FALLBACK
        ========================= */

        if (
            isExpired &&
            !subscription.pending_payment_type
        ) {

            /* =========================
                GET PAYMENT SETTINGS
            ========================= */

            const settingsResponse =
                await localClient.query<any>({
                    query: GET_PAYMENT_SETTINGS,
                    fetchPolicy: 'no-cache'
                });

            const settings =
                settingsResponse.data
                    ?.payment_settings?.[0];

            if (!settings) {
                throw new Error(
                    'Payment setting not found'
                );
            }

            /* =========================
                AUTO ACTIVATE
                PAY_PER_PATIENT
            ========================= */

            const startDate = new Date();

            const expiryDate = new Date();

            expiryDate.setDate(
                expiryDate.getDate() + 29
            );

            expiryDate.setHours(
                23,
                59,
                59,
                999
            );

            await localClient.mutate<any>({

                mutation:
                    UPSERT_PRACTICE_SUBSCRIPTION,

                variables: {

                    object: {

                        practice_id: practiceId,

                        current_payment_type:
                            'PAY_PER_PATIENT',

                        current_price:
                            settings.pay_per_patient_amount,

                        subscription_start_date:
                            startDate.toISOString(),

                        subscription_end_date:
                            expiryDate.toISOString(),

                        pending_payment_type: null,

                        pending_price: null,

                        pending_start_date: null,

                        is_active: true
                    }
                }
            });

            /* =========================
                REFETCH UPDATED DATA
            ========================= */

            const refreshed =
                await localClient.query<any>({
                    query:
                        GET_PRACTICE_SUBSCRIPTION,

                    variables: {
                        practiceId
                    },

                    fetchPolicy: 'no-cache'
                });

            subscription =
                refreshed.data
                    ?.practice_subscription?.[0];
        }

        return subscription;
    },

    async saveSubscription({
        practiceId,
        paymentType,
        subscription_start_date,
        subscription_end_date,
        pending_start_date
    }: {
        practiceId: string;

        paymentType:
        'PAY_PER_PATIENT' |
        'PAY_PER_MONTH';

        subscription_start_date: string;

        subscription_end_date: string;

        pending_start_date: string;
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

        const isActive =
            !!end &&
            end.getTime() > now.getTime();

        let currentEndDate: Date | null = null;

        if (current?.subscription_end_date) {

            currentEndDate = new Date(
                current.subscription_end_date
            );

            currentEndDate.setHours(
                23,
                59,
                59,
                999
            );

        }

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
                            currentEndDate!.toISOString(),

                        pending_payment_type:
                            paymentType,

                        pending_price:
                            latestPrice,

                        pending_start_date:
                            pending_start_date,

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

        const nowTs =
            subscription_start_date;

        const expiry =
            subscription_end_date;

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
                        expiry,

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