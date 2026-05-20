/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import {
    DollarSign,
    Save,
    CreditCard,
    Users,
    Loader2,
} from "lucide-react";

import { useMutation, useQuery } from "@apollo/client/react";
import { localClient } from "../../../api/apollo/localClient";

import toast from "react-hot-toast";

import {
    GET_PAYMENT_SETTINGS,
    CREATE_PAYMENT_SETTINGS,
    UPDATE_PAYMENT_SETTINGS,
} from "../graphql/payment.query";

// =========================
// TYPES
// =========================

interface PaymentSetting {
    id: string;
    pay_per_patient_amount: number;
    pay_per_month_amount: number;
    created_at?: string;
    updated_at?: string;
}

interface PaymentSettingsResponse {
    payment_settings: PaymentSetting[];
}

// =========================
// COMPONENT
// =========================

const PaymentSettings = () => {

    // =========================
    // STATE
    // =========================

    const [formData, setFormData] = useState({
        id: "",
        pay_per_patient_amount: "",
        pay_per_month_amount: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    // =========================
    // FETCH SETTINGS
    // =========================

    const {
        data,
        loading,
        refetch,
    } = useQuery<PaymentSettingsResponse>(
        GET_PAYMENT_SETTINGS,
        {
            client: localClient,
            fetchPolicy: "network-only",
        }
    );

    // =========================
    // MUTATIONS
    // =========================

    const [createPaymentSettings] = useMutation(
        CREATE_PAYMENT_SETTINGS,
        {
            client: localClient,
        }
    );

    const [updatePaymentSettings] = useMutation(
        UPDATE_PAYMENT_SETTINGS,
        {
            client: localClient,
        }
    );

    // =========================
    // LOAD EXISTING SETTINGS
    // =========================

    useEffect(() => {

        if (!data?.payment_settings?.length) {
            return;
        }

        const settings = data.payment_settings[0];

        if (!settings) {
            return;
        }

        setFormData({
            id: settings.id || "",

            pay_per_patient_amount:
                settings.pay_per_patient_amount?.toString() || "",

            pay_per_month_amount:
                settings.pay_per_month_amount?.toString() || "",
        });

    }, [data]);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        // allow only numbers + decimal
        if (!/^\d*\.?\d*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // HANDLE SAVE
    // =========================

    const handleSave = async () => {

        if (
            !formData.pay_per_patient_amount ||
            !formData.pay_per_month_amount
        ) {
            toast.error("Please fill all fields");
            return;
        }

        try {

            setIsSaving(true);

            const payload = {
                pay_per_patient_amount: parseFloat(
                    formData.pay_per_patient_amount
                ),

                pay_per_month_amount: parseFloat(
                    formData.pay_per_month_amount
                ),
            };

            // =========================
            // UPDATE EXISTING
            // =========================

            if (formData.id) {

                await updatePaymentSettings({
                    variables: {
                        id: formData.id,
                        ...payload,
                    },
                });

            } else {

                // =========================
                // CREATE NEW
                // =========================

                await createPaymentSettings({
                    variables: payload,
                });
            }

            toast.success(
                "Payment settings saved successfully"
            );

            await refetch();

        } catch (error: any) {

            console.error(
                "SAVE PAYMENT SETTINGS ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save payment settings"
            );

        } finally {

            setIsSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2
                    className="animate-spin mr-2"
                    size={20}
                />
                Loading payment settings...
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="max-w-6xl mx-auto p-4">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Payment Settings
                </h1>

                <p className="mt-2 text-gray-500">
                    Configure pricing plans for all practices.
                </p>

            </div>

            {/* =========================
                CARDS
            ========================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* =========================
                    PAY PER PATIENT
                ========================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                    <div className="flex items-center gap-4 mb-6">

                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Users
                                className="text-orange-600"
                                size={24}
                            />
                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Pay Per Patient
                            </h2>

                            <p className="text-sm text-gray-500">
                                Charge per completed appointment.
                            </p>

                        </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount Per Completed Patient
                    </label>

                    <div className="relative">

                        <DollarSign
                            size={18}
                            className="absolute left-3 top-3.5 text-gray-400"
                        />

                        <input
                            type="text"
                            name="pay_per_patient_amount"
                            value={formData.pay_per_patient_amount}
                            onChange={handleChange}
                            placeholder="10"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                py-3
                                pl-10
                                pr-4
                                text-sm
                                focus:border-orange-500
                                focus:ring-orange-500
                            "
                        />

                    </div>
                </div>

                {/* =========================
                    MONTHLY SUBSCRIPTION
                ========================= */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                    <div className="flex items-center gap-4 mb-6">

                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <CreditCard
                                className="text-blue-600"
                                size={24}
                            />
                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Monthly Subscription
                            </h2>

                            <p className="text-sm text-gray-500">
                                Fixed monthly billing amount.
                            </p>

                        </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Subscription Amount
                    </label>

                    <div className="relative">

                        <DollarSign
                            size={18}
                            className="absolute left-3 top-3.5 text-gray-400"
                        />

                        <input
                            type="text"
                            name="pay_per_month_amount"
                            value={formData.pay_per_month_amount}
                            onChange={handleChange}
                            placeholder="99"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                py-3
                                pl-10
                                pr-4
                                text-sm
                                focus:border-orange-500
                                focus:ring-orange-500
                            "
                        />

                    </div>
                </div>
            </div>

            {/* =========================
                INFO BOX
            ========================= */}

            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                <h3 className="font-semibold text-yellow-800 mb-2">
                    Payment Information
                </h3>

                <p className="text-sm text-yellow-700 leading-relaxed">

                    Practices selecting
                    <strong> Pay Per Patient </strong>
                    will be charged for every completed appointment.

                    <br /><br />

                    Practices selecting
                    <strong> Monthly Subscription </strong>
                    will be billed a fixed monthly amount.

                </p>
            </div>

            {/* =========================
                SAVE BUTTON
            ========================= */}

            <div className="mt-8 flex justify-end">

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-orange-500
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        hover:bg-orange-600
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                    "
                >

                    {isSaving ? (
                        <Loader2
                            className="animate-spin"
                            size={18}
                        />
                    ) : (
                        <Save size={18} />
                    )}

                    {isSaving
                        ? "Saving..."
                        : "Save Payment Settings"}

                </button>
            </div>
        </div>
    );
};

export default PaymentSettings;