/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import {
    DollarSign,
    Save,
    CreditCard,
    Users,
    Loader2,
    TicketPercent,
    Plus,
    Edit3,
    X,
    Check,
    Trash2,
} from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { localClient } from "../../../api/apollo/localClient";
import toast from "react-hot-toast";
import {
    GET_PAYMENT_SETTINGS,
    CREATE_PAYMENT_SETTINGS,
    UPDATE_PAYMENT_SETTINGS,
    GET_COUPONS,
    CREATE_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON,
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

interface Coupon {
    id: string;
    code: string;
    description: string;
    duration_months: number | null; // ADD THIS
    discount_type: "percentage" | "fixed" | "free_months";
    discount_value: number | null;
    free_months: number | null;
    is_active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    max_uses: number | null;
    used_count: number;
    practice_usage_json: Record<string, any>;
    created_at: string;
}

// =========================
// COMPONENT
// =========================

const PaymentSettings = () => {
    // =========================
    // TAB STATE
    // =========================
    const [activeTab, setActiveTab] = useState<"payment" | "coupons">("payment");

    // =========================
    // PAYMENT SETTINGS STATE
    // =========================
    const [formData, setFormData] = useState({
        id: "",
        pay_per_patient_amount: "",
        pay_per_month_amount: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    // =========================
    // COUPON STATE
    // =========================
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [couponForm, setCouponForm] = useState({
        code: "",
        description: "",
        discount_type: "percentage" as "percentage" | "fixed" | "free_months",
        discount_value: "",
        duration_months: "",
        free_months: "",
        valid_from: "",
        valid_until: "",
        max_uses: "",
        is_active: true,
    });
    const [isSavingCoupon, setIsSavingCoupon] = useState(false);

    // =========================
    // FETCH PAYMENT SETTINGS
    // =========================
    const { data, loading, refetch } = useQuery<PaymentSettingsResponse>(
        GET_PAYMENT_SETTINGS,
        {
            client: localClient,
            fetchPolicy: "network-only",
        }
    );

    const [createPaymentSettings] = useMutation(CREATE_PAYMENT_SETTINGS, {
        client: localClient,
    });

    const [updatePaymentSettings] = useMutation(UPDATE_PAYMENT_SETTINGS, {
        client: localClient,
    });

    const handleDeleteCoupon = async (coupon: Coupon) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete coupon "${coupon.code}"?`
        );

        if (!confirmed) return;

        try {
            await deleteCouponMutation({
                variables: {
                    id: coupon.id,
                },
            });

            toast.success("Coupon deleted successfully");

            if (editingCoupon?.id === coupon.id) {
                resetCouponForm();
            }

            await refetchCoupons();
        } catch (error: any) {
            console.error("DELETE COUPON ERROR:", error);

            toast.error(error?.message || "Failed to delete coupon");
        }
    };

    // =========================
    // FETCH COUPONS
    // =========================
    const {
        data: couponsData,
        loading: couponsLoading,
        refetch: refetchCoupons,
    } = useQuery<{ coupons: Coupon[] }>(GET_COUPONS, {
        client: localClient,
        fetchPolicy: "network-only",
    });

    const [createCoupon] = useMutation(CREATE_COUPON, { client: localClient });
    const [updateCoupon] = useMutation(UPDATE_COUPON, { client: localClient });
    const [deleteCouponMutation] = useMutation(DELETE_COUPON, { client: localClient });

    // =========================
    // LOAD EXISTING SETTINGS
    // =========================
    useEffect(() => {
        if (!data?.payment_settings?.length) return;

        const settings = data.payment_settings[0];
        if (!settings) return;

        setFormData({
            id: settings.id || "",
            pay_per_patient_amount:
                settings.pay_per_patient_amount?.toString() || "",
            pay_per_month_amount:
                settings.pay_per_month_amount?.toString() || "",
        });
    }, [data]);

    // =========================
    // HANDLE PAYMENT INPUT CHANGE
    // =========================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (!/^\d*\.?\d*$/.test(value)) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // HANDLE SAVE PAYMENT SETTINGS
    // =========================
    const handleSave = async () => {
        if (!formData.pay_per_patient_amount || !formData.pay_per_month_amount) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setIsSaving(true);

            const payload = {
                pay_per_patient_amount: parseFloat(formData.pay_per_patient_amount),
                pay_per_month_amount: parseFloat(formData.pay_per_month_amount),
            };

            if (formData.id) {
                await updatePaymentSettings({
                    variables: { id: formData.id, ...payload },
                });
            } else {
                await createPaymentSettings({ variables: payload });
            }

            toast.success("Payment settings saved successfully");
            await refetch();
        } catch (error: any) {
            console.error("SAVE PAYMENT SETTINGS ERROR:", error);
            toast.error(error?.message || "Failed to save payment settings");
        } finally {
            setIsSaving(false);
        }
    };

    // =========================
    // COUPON FORM HANDLERS
    // =========================
    const handleCouponFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setCouponForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetCouponForm = () => {
        setCouponForm({
            code: "",
            description: "",
            discount_type: "percentage",
            duration_months: "",
            discount_value: "",
            free_months: "",
            valid_from: "",
            valid_until: "",
            max_uses: "",
            is_active: true,
        });
        setEditingCoupon(null);
        setShowCouponForm(false);
    };

    const handleEditCoupon = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setCouponForm({
            code: coupon.code,
            description: coupon.description || "",
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value?.toString() || "",
            free_months: coupon.free_months?.toString() || "",
            duration_months: coupon.duration_months?.toString() || "", // ADD THIS
            valid_from: coupon.valid_from || "",
            valid_until: coupon.valid_until || "",
            max_uses: coupon.max_uses?.toString() || "",
            is_active: coupon.is_active,
        });
        setShowCouponForm(true);
    };

    const handleSaveCoupon = async () => {
        if (!couponForm.code.trim()) {
            toast.error("Coupon code is required");
            return;
        }

        if (
            couponForm.discount_type !== "free_months" &&
            !couponForm.discount_value
        ) {
            toast.error("Discount value is required");
            return;
        }

        if (
            couponForm.discount_type === "free_months" &&
            !couponForm.free_months
        ) {
            toast.error("Free months count is required");
            return;
        }

        try {
            setIsSavingCoupon(true);

            const variables: any = {
                code: couponForm.code.trim().toUpperCase(),
                description: couponForm.description || null,
                discount_type: couponForm.discount_type,
                discount_value:
                    couponForm.discount_type === "free_months"
                        ? null
                        : parseFloat(couponForm.discount_value),
                free_months:
                    couponForm.discount_type === "free_months"
                        ? parseInt(couponForm.free_months)
                        : null,
                duration_months: couponForm.duration_months
                    ? parseInt(couponForm.duration_months)
                    : null, // ADD THIS
                is_active: couponForm.is_active,
                valid_from: couponForm.valid_from || null,
                valid_until: couponForm.valid_until || null,
                max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
            };

            if (editingCoupon) {
                await updateCoupon({
                    variables: {
                        id: editingCoupon.id,
                        input: variables,
                    },
                });
                toast.success("Coupon updated successfully");
            } else {
                await createCoupon({ variables });
                toast.success("Coupon created successfully");
            }

            resetCouponForm();
            await refetchCoupons();
        } catch (error: any) {
            console.error("SAVE COUPON ERROR:", error);
            toast.error(error?.message || "Failed to save coupon");
        } finally {
            setIsSavingCoupon(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading payment settings...
            </div>
        );
    }

    const coupons = couponsData?.coupons || [];

    // =========================
    // UI
    // =========================
    return (
        <div className="max-w-6xl mx-auto p-4">

            {/* =========================
                TABS
            ========================= */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                    onClick={() => {
                        setActiveTab("payment");
                        resetCouponForm();
                    }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "payment"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <DollarSign size={16} className="inline mr-1.5" />
                    Payment Settings
                </button>
                <button
                    onClick={() => setActiveTab("coupons")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "coupons"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <TicketPercent size={16} className="inline mr-1.5" />
                    Coupons
                </button>
            </div>

            {/* =========================
                TAB: PAYMENT SETTINGS
            ========================= */}
            {activeTab === "payment" && (
                <>
                    {/* Cards */}


                    {/* ========================= HEADER ========================= */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Payment Settings
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Configure pricing plans and discount coupons for all practices.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pay Per Patient */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Users className="text-orange-600" size={24} />
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
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* Monthly Subscription */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <CreditCard className="text-blue-600" size={24} />
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
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                            Payment Information
                        </h3>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                            Practices selecting{" "}
                            <strong>Pay Per Patient</strong> will be charged for
                            every completed appointment.
                            <br />
                            <br />
                            Practices selecting{" "}
                            <strong>Monthly Subscription</strong> will be billed a
                            fixed monthly amount.
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {isSaving ? "Saving..." : "Save Payment Settings"}
                        </button>
                    </div>
                </>
            )}

            {/* =========================
                TAB: COUPONS
            ========================= */}
            {activeTab === "coupons" && (
                <>
                    {/* Coupon Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Discount Coupons
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Create and manage coupon codes for practices.
                            </p>
                        </div>
                        {!showCouponForm && (
                            <button
                                onClick={() => setShowCouponForm(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Plus size={16} />
                                Add Coupon
                            </button>
                        )}
                    </div>

                    {/* Coupon Form */}
                    {showCouponForm && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                                </h3>
                                <button
                                    onClick={resetCouponForm}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Coupon Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={couponForm.code}
                                        onChange={handleCouponFormChange}
                                        placeholder="SUMMER2025"
                                        disabled={!!editingCoupon}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Discount Type *
                                    </label>
                                    <select
                                        name="discount_type"
                                        value={couponForm.discount_type}
                                        onChange={handleCouponFormChange}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="percentage">
                                            Percentage (%)
                                        </option>
                                        <option value="fixed">
                                            Fixed Amount ($)
                                        </option>
                                        <option value="free_months">
                                            Free Months
                                        </option>
                                    </select>
                                </div>

                                {/* Discount Value (for percentage/fixed) */}
                                {couponForm.discount_type !== "free_months" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            {couponForm.discount_type === "percentage"
                                                ? "Percentage (%)"
                                                : "Amount ($)"}{" "}
                                            *
                                        </label>
                                        <input
                                            type="text"
                                            name="discount_value"
                                            value={couponForm.discount_value}
                                            onChange={handleCouponFormChange}
                                            placeholder={
                                                couponForm.discount_type === "percentage"
                                                    ? "20"
                                                    : "50"
                                            }
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                )}

                                {/* Free Months */}
                                {couponForm.discount_type === "free_months" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Number of Free Months *
                                        </label>
                                        <input
                                            type="text"
                                            name="free_months"
                                            value={couponForm.free_months}
                                            onChange={handleCouponFormChange}
                                            placeholder="2"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                )}

                                {/* Max Uses */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Max Uses
                                    </label>
                                    <input
                                        type="text"
                                        name="max_uses"
                                        value={couponForm.max_uses}
                                        onChange={handleCouponFormChange}
                                        placeholder="Leave blank for unlimited"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* Valid From */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Valid From
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        value={couponForm.valid_from}
                                        onChange={handleCouponFormChange}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* Valid Until */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Valid Until
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_until"
                                        value={couponForm.valid_until}
                                        onChange={handleCouponFormChange}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={couponForm.description}
                                        onChange={handleCouponFormChange}
                                        placeholder="20% off for new practices"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Duration (Months)
                                    </label>
                                    <input
                                        type="text"
                                        name="duration_months"
                                        value={couponForm.duration_months}
                                        onChange={handleCouponFormChange}
                                        placeholder="6"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        How many months this discount lasts. Leave blank for one-time use.
                                    </p>
                                </div> */}

                                {/* Duration Months - Only show for percentage and fixed */}
                                {couponForm.discount_type !== "free_months" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Duration (Months)
                                        </label>
                                        <input
                                            type="text"
                                            name="duration_months"
                                            value={couponForm.duration_months}
                                            onChange={handleCouponFormChange}
                                            placeholder="6"
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            How many months this discount lasts. Leave blank for one-time use.
                                        </p>
                                    </div>
                                )}

                                {/* Active Toggle */}
                                <div className="flex items-center gap-3 pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={couponForm.is_active}
                                            onChange={handleCouponFormChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                                    </label>
                                    <span className="text-sm text-gray-700 font-medium">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Form Buttons */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={resetCouponForm}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCoupon}
                                    disabled={isSavingCoupon}
                                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSavingCoupon ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Check size={16} />
                                    )}
                                    {isSavingCoupon
                                        ? "Saving..."
                                        : editingCoupon
                                            ? "Update Coupon"
                                            : "Create Coupon"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Coupons Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {couponsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-gray-400" size={28} />
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <TicketPercent
                                    size={48}
                                    className="mx-auto mb-4 opacity-40"
                                />
                                <p className="text-base font-medium">
                                    No coupons created yet.
                                </p>
                                <p className="text-sm mt-1">
                                    Click "Add Coupon" to create your first discount
                                    code.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Code</th>
                                            {/* <th className="text-left px-6 py-4 font-semibold text-gray-600">Description</th> */}
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Type</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Value</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Duration</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Used</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Valid Until</th>
                                            <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {coupons.map((coupon) => (
                                            <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                                                {/* <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px] truncate">
                                                    {coupon.description || '—'}
                                                </td> */}
                                                <td className="px-6 py-4 text-gray-600 capitalize">
                                                    {coupon.discount_type === "percentage"
                                                        ? "Percentage"
                                                        : coupon.discount_type === "fixed"
                                                            ? "Fixed Amount"
                                                            : "Free Months"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {coupon.discount_type === "free_months"
                                                        ? `${coupon.free_months} months`
                                                        : coupon.discount_type === "percentage"
                                                            ? `${coupon.discount_value}%`
                                                            : `$${coupon.discount_value}`}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {coupon.duration_months ? `${coupon.duration_months} months` : '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${coupon.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {coupon.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {coupon.valid_until
                                                        ? new Date(coupon.valid_until).toLocaleDateString("en-ZA", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "2-digit",
                                                        })
                                                        : "No expiry"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEditCoupon(coupon)} className="text-gray-400 hover:text-orange-600 transition-colors p-1.5 rounded-lg hover:bg-orange-50" title="Edit Coupon">
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDeleteCoupon(coupon)} className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50" title="Delete Coupon">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSettings;