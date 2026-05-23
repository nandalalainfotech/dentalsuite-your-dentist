/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client/react';
import {
    Loader2,
    X,
    CalendarDays,
    CreditCard,
    Ticket,
    Check,
    AlertCircle
} from 'lucide-react';

import {
    GET_PRACTICE_SUBSCRIPTION,
    UPDATE_PRACTICE_SUBSCRIPTION,
    CREATE_PRACTICE_SUBSCRIPTION,
    GET_PAYMENT_SETTINGS
} from '../graphql/clients.query';

import { ASSIGN_COUPON_TO_PRACTICE, VALIDATE_COUPON_BY_CODE } from '../../practice/dashboard/graphql/subscription.query';
import { localClient } from '../../../api/apollo/localClient';
import toast from 'react-hot-toast';

export interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    address?: string;
    practice_phone?: string;
    abn_number?: string;
    practice_type?: string;
    city?: string;
    state?: string;
    postcode?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
    type?: string;
}

type PaymentType =
    | 'PAY_PER_PATIENT'
    | 'PAY_PER_MONTH';

interface Props {
    onClose: () => void;
    client: Client | null;
}

export default function PracticeDetailsDialog({
    onClose,
    client
}: Props) {

    const {
        data: subscriptionData,
        refetch
    } = useQuery(
        GET_PRACTICE_SUBSCRIPTION,
        {
            client: localClient,
            variables: {
                practiceId: client?.id
            },
            skip: !client?.id
        }
    );

    const {
        data: paymentSettingsData
    } = useQuery(
        GET_PAYMENT_SETTINGS,
        {
            client: localClient
        }
    );

    const [updatePracticeSubscription] =
        useMutation(
            UPDATE_PRACTICE_SUBSCRIPTION,
            {
                client: localClient
            }
        );

    const [createPracticeSubscription] =
        useMutation(
            CREATE_PRACTICE_SUBSCRIPTION,
            {
                client: localClient
            }
        );

    const [assignCoupon] = useMutation(ASSIGN_COUPON_TO_PRACTICE, {
        client: localClient
    });

    const [validateCoupon] = useLazyQuery(VALIDATE_COUPON_BY_CODE, {
        client: localClient,
        fetchPolicy: "network-only"
    });

    const subscriptionDataAny =
        subscriptionData as any;

    const subscription =
        subscriptionDataAny
            ?.practice_subscription?.[0] || null;

    const paymentSettingsDataAny =
        paymentSettingsData as any;

    const paymentSettings =
        paymentSettingsDataAny?.payment_settings?.[0];

    const [selectedPaymentType, setSelectedPaymentType] =
        useState<PaymentType>('PAY_PER_PATIENT');

    const [savingSubscription, setSavingSubscription] =
        useState(false);

    // Coupon related state
    const [couponCodeInput, setCouponCodeInput] = useState("");
    const [validatedCoupon, setValidatedCoupon] = useState<any>(null);
    const [couponValidationError, setCouponValidationError] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [isAssigningCoupon, setIsAssigningCoupon] = useState(false);

    useEffect(() => {

        /* =========================
            NO SUBSCRIPTION
        ========================= */

        if (!subscription) {

            setSelectedPaymentType(
                'PAY_PER_PATIENT'
            );

            return;
        }

        /* =========================
            CHECK EXPIRY
        ========================= */

        const now = new Date();

        const subscriptionEndDate =
            subscription.subscription_end_date
                ? new Date(
                    subscription.subscription_end_date
                )
                : null;

        const isExpired =
            subscriptionEndDate &&
            subscriptionEndDate < now;

        /* =========================
            EXPIRED + NO SCHEDULE
            → DEFAULT TO PAY_PER_PATIENT
        ========================= */

        if (
            isExpired &&
            !subscription.pending_payment_type
        ) {

            setSelectedPaymentType(
                'PAY_PER_PATIENT'
            );

            return;
        }

        /* =========================
            NORMAL FLOW
        ========================= */

        setSelectedPaymentType(
            subscription.pending_payment_type ||
            subscription.current_payment_type
        );

    }, [subscription]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';

        return new Date(dateStr).toLocaleDateString(
            'en-AU',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    const startDate = useMemo(() => {

        if (subscription?.subscription_start_date) {
            return new Date(
                subscription.subscription_start_date
            );
        }

        const start = new Date();

        start.setDate(start.getDate() + 30);

        return start;

    }, [subscription]);

    const expiryDate = useMemo(() => {

        if (subscription?.subscription_end_date) {
            return new Date(
                subscription.subscription_end_date
            );
        }

        const expiry = new Date();

        expiry.setDate(
            expiry.getDate() + 30
        );

        expiry.setHours(23, 59, 59, 999);

        return expiry;

    }, [subscription]);

    const pendingStartDate = useMemo(() => {

        if (subscription?.pending_start_date) {
            return new Date(
                subscription.pending_start_date
            );
        }

        return null;

    }, [subscription]);

    const pendingExpiryDate = useMemo(() => {

        if (!pendingStartDate) return null;

        const expiry = new Date(pendingStartDate);

        expiry.setDate(expiry.getDate() + 30);

        return expiry;

    }, [pendingStartDate]);

    const remainingDays = useMemo(() => {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);

        expiry.setHours(23, 59, 59, 999);

        const diff =
            expiry.getTime() -
            today.getTime();

        return Math.max(
            0,
            Math.floor(diff / (1000 * 60 * 60 * 24))
        );

    }, [expiryDate]);

    const isSelected = (type: PaymentType) =>
        selectedPaymentType === type;

    const isActivated = (type: PaymentType) =>
        subscription?.current_payment_type === type;

    const hasPendingChange = (type: PaymentType) =>
        subscription?.pending_payment_type === type;

    const futureStartDate = subscription?.subscription_end_date
        ? new Date(subscription.subscription_end_date)
        : new Date();

    const futureEndDate = new Date(futureStartDate);

    futureEndDate.setDate(
        futureEndDate.getDate() + 30
    );

    const originalPrice =
        selectedPaymentType === 'PAY_PER_MONTH'
            ? paymentSettings?.pay_per_month_amount || 0
            : paymentSettings?.pay_per_patient_amount || 0;

    const calculateDiscountedPrice = (price: number): number => {
        if (!validatedCoupon) return price;

        let discountedPrice = price;

        if (validatedCoupon.discount_type === "PERCENTAGE") {
            discountedPrice = price * (1 - validatedCoupon.discount_value / 100);
        } else if (validatedCoupon.discount_type === "FIXED") {
            discountedPrice = Math.max(0, price - validatedCoupon.discount_value);
        }

        return Math.round(discountedPrice * 100) / 100;
    };

    const latestPrice = calculateDiscountedPrice(originalPrice);

    const isCouponApplicable = validatedCoupon && (
        validatedCoupon.applicable_payment_type === "BOTH" ||
        validatedCoupon.applicable_payment_type === selectedPaymentType
    );

    const handleValidateCoupon = async () => {
        if (!couponCodeInput.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsValidatingCoupon(true);
        setCouponValidationError("");

        try {
            const result = await validateCoupon({
                variables: {
                    code: couponCodeInput.toUpperCase().trim()
                }
            });

            const coupons = (result as any).data?.coupons || [];
            const coupon = coupons[0];

            if (!coupon) {
                setCouponValidationError("Invalid coupon code");
                setValidatedCoupon(null);
                return;
            }

            // Check if coupon is valid based on date range
            const now = new Date();
            const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
            const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

            if (validFrom && now < validFrom) {
                setCouponValidationError(`Coupon is not valid until ${validFrom.toLocaleDateString()}`);
                setValidatedCoupon(null);
                return;
            }

            if (validUntil && now > validUntil) {
                setCouponValidationError("This coupon has expired");
                setValidatedCoupon(null);
                return;
            }

            // Check usage limit
            if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
                setCouponValidationError("This coupon has reached its maximum usage limit");
                setValidatedCoupon(null);
                return;
            }

            // Normalize discount type
            let discountType = coupon.discount_type;
            let discountValue = coupon.discount_value;

            if (discountType === "%" || discountType === "percent" || discountType === "percentage") {
                discountType = "PERCENTAGE";
            } else if (discountType === "$" || discountType === "fixed" || discountType === "amount") {
                discountType = "FIXED";
            }

            const applicablePaymentType = coupon.applicable_payment_type || "BOTH";

            const validatedCouponData = {
                id: coupon.id,
                code: coupon.code,
                discount_type: discountType,
                discount_value: discountValue,
                duration_months: coupon.duration_months || 0,
                max_uses: coupon.max_uses,
                used_count: coupon.used_count,
                expiry_date: coupon.valid_until,
                applicable_payment_type: applicablePaymentType,
                is_valid: true,
                message: "Coupon is valid",
                practice_usage_json: coupon.practice_usage_json || {}
            };

            setValidatedCoupon(validatedCouponData);

            const discountText = discountType === "PERCENTAGE"
                ? `${discountValue}% off`
                : `$${discountValue} off`;
            toast.success(`Coupon "${coupon.code}" is valid! (${discountText})`);

            // Auto-select payment type if coupon is specific to one type
            if (applicablePaymentType && applicablePaymentType !== "BOTH") {
                const paymentType = applicablePaymentType === "PAY_PER_MONTH"
                    ? "PAY_PER_MONTH"
                    : "PAY_PER_PATIENT";
                setSelectedPaymentType(paymentType);
            }

        } catch (error: any) {
            console.error("Coupon validation error:", error);
            setCouponValidationError(error?.message || "Failed to validate coupon");
            setValidatedCoupon(null);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const assignCouponToPractice = async (practiceId: string) => {
        if (!validatedCoupon) return null;

        setIsAssigningCoupon(true);

        try {
            const now = new Date();
            const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            let expiresAt: string | null = null;
            if (validatedCoupon.duration_months) {
                const expiryDate = new Date(now);
                expiryDate.setMonth(expiryDate.getMonth() + validatedCoupon.duration_months);
                expiresAt = expiryDate.toISOString();
            }

            const practiceUsage = { ...(validatedCoupon.practice_usage_json || {}) };
            delete practiceUsage["0"];
            delete practiceUsage["1"];

            practiceUsage[practiceId] = {
                count: (practiceUsage[practiceId]?.count || 0) + 1,
                periods: [...(practiceUsage[practiceId]?.periods || []), currentMonthKey],
                appliedAt: now.toISOString(),
                expiresAt: expiresAt,
            };

            await assignCoupon({
                variables: {
                    id: validatedCoupon.id,
                    used_count: (validatedCoupon.used_count || 0) + 1,
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${validatedCoupon.code}" applied successfully!`);

            return {
                couponId: validatedCoupon.id,
                discountType: validatedCoupon.discount_type,
                discountValue: validatedCoupon.discount_value,
                originalPrice: originalPrice,
                discountedPrice: latestPrice
            };

        } catch (error: any) {
            console.error('ASSIGN COUPON ERROR:', error);
            toast.error(error?.message || 'Failed to assign coupon');
            return null;
        } finally {
            setIsAssigningCoupon(false);
        }
    };

    const handleSaveSubscription = async () => {

        try {

            setSavingSubscription(true);

            const today = new Date();

            // CREATE NEW SUBSCRIPTION

            if (!subscription) {

                const expiryDate = new Date();

                expiryDate.setDate(
                    expiryDate.getDate() + 30
                );

                // Apply coupon if exists
                let couponInfo = null;
                if (validatedCoupon && client?.id) {
                    couponInfo = await assignCouponToPractice(client.id);
                }

                const finalPrice = couponInfo ? couponInfo.discountedPrice : latestPrice;

                await createPracticeSubscription({

                    variables: {

                        object: {

                            practice_id: client?.id,

                            current_payment_type:
                                selectedPaymentType,

                            pending_payment_type: null,

                            current_price: finalPrice,

                            subscription_start_date:
                                today.toISOString(),

                            subscription_end_date:
                                expiryDate.toISOString(),

                            pending_start_date: null,

                            is_active: true
                        }

                    }

                });

                await refetch();

                toast.success('Subscription created successfully');
                if (validatedCoupon) {
                    toast.success(`Coupon ${validatedCoupon.code} applied!`);
                }

                return;
            }

            // EXISTING SUBSCRIPTION

            const subscriptionEndDate =
                subscription?.subscription_end_date
                    ? new Date(
                        subscription.subscription_end_date
                    )
                    : null;

            const isSubscriptionActive =
                subscriptionEndDate &&
                subscriptionEndDate > today;

            // Apply coupon if exists and subscription is active (for renewal)
            let couponInfo = null;
            if (validatedCoupon && client?.id && !isSubscriptionActive) {
                couponInfo = await assignCouponToPractice(client.id);
            }

            const finalPrice = couponInfo ? couponInfo.discountedPrice : latestPrice;

            // ACTIVE SUBSCRIPTION

            if (isSubscriptionActive) {

                await updatePracticeSubscription({

                    variables: {

                        id: subscription.id,

                        current_payment_type:
                            subscription.current_payment_type,

                        current_price:
                            subscription.current_price,

                        pending_payment_type:
                            selectedPaymentType,

                        pending_price:
                            finalPrice,

                        pending_start_date:
                            subscription.subscription_end_date
                    }

                });

            }

            // EXPIRED SUBSCRIPTION

            else {

                await updatePracticeSubscription({

                    variables: {

                        id: subscription.id,

                        current_payment_type:
                            selectedPaymentType,

                        current_price:
                            finalPrice,

                        pending_payment_type: null,

                        pending_price: null,

                        pending_start_date: null
                    }

                });

            }

            await refetch();

            toast.success('Subscription updated successfully');

        } catch (error) {

            console.error(error);

            toast.error('Failed to save subscription');

        } finally {

            setSavingSubscription(false);

        }
    };

    if (!client) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-[24px] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">

                {/* Header */}

                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-[24px] z-10">

                    <h2 className="text-2xl font-black text-[#1a2b3c] pr-8">
                        Practice Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-all"
                    >
                        <X
                            size={20}
                            className="text-gray-500"
                        />
                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Practice Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Practice Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.practice_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                                <p className="text-[#1a2b3c] font-medium">{client.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">ABN Number</p>
                                <p className="text-[#1a2b3c] font-medium">{client.abn_number || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Type</p>
                                <p className="text-[#1a2b3c] font-medium">{client.practice_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Phone</p>
                                <p className="text-[#1a2b3c] font-medium">{client.practice_phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Address</p>
                                <p className="text-[#1a2b3c] font-medium">{client.address || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">City</p>
                                <p className="text-[#1a2b3c] font-medium">{client.city || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">State</p>
                                <p className="text-[#1a2b3c] font-medium">{client.state || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Postcode</p>
                                <p className="text-[#1a2b3c] font-medium">{client.postcode || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Contact Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Primary Contact
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">First Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.first_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Last Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.last_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Mobile</p>
                                <p className="text-[#1a2b3c] font-medium">{client.mobile || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Coupon Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            <Ticket size={22} />
                            Apply Coupon
                        </h3>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={couponCodeInput}
                                    onChange={(e) => {
                                        setCouponCodeInput(e.target.value.toUpperCase());
                                        setCouponValidationError("");
                                    }}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                    disabled={!!validatedCoupon}
                                />

                                {!validatedCoupon ? (
                                    <button
                                        type="button"
                                        onClick={handleValidateCoupon}
                                        disabled={isValidatingCoupon || !couponCodeInput.trim()}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        {isValidatingCoupon ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            "Apply Coupon"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValidatedCoupon(null);
                                            setCouponCodeInput("");
                                            setCouponValidationError("");
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            {couponValidationError && (
                                <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {couponValidationError}
                                </div>
                            )}

                            {validatedCoupon && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <Check size={18} />
                                        <span className="font-semibold">Coupon Applied!</span>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <p><strong>Code:</strong> {validatedCoupon.code}</p>
                                        <p><strong>Discount:</strong> {validatedCoupon.discount_type === "PERCENTAGE"
                                            ? `${validatedCoupon.discount_value}% OFF`
                                            : `$${validatedCoupon.discount_value} OFF`}
                                        </p>
                                        {validatedCoupon.duration_months > 0 && (
                                            <p><strong>Valid for:</strong> {validatedCoupon.duration_months} months</p>
                                        )}
                                        {validatedCoupon.applicable_payment_type && validatedCoupon.applicable_payment_type !== "BOTH" && (
                                            <p><strong>Applicable to:</strong> {validatedCoupon.applicable_payment_type === "PAY_PER_MONTH" ? "Pay Per Month" : "Pay Per Patient"}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subscription Information */}

                    <div>

                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4">
                            Subscription Information
                        </h3>

                        {subscription?.pending_payment_type && (

                            <div className="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">

                                <p className="text-sm text-yellow-700 font-medium">
                                    This plan will be activated when current subscription expires
                                </p>

                                <p className="text-sm text-yellow-600 mt-1">

                                    Scheduled change at{' '}

                                    <span className="font-semibold">

                                        {pendingStartDate
                                            ? formatDate(
                                                pendingStartDate.toISOString()
                                            )
                                            : '-'}

                                    </span>

                                </p>

                            </div>
                        )}

                        {validatedCoupon && !isCouponApplicable && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                                <AlertCircle size={16} className="inline mr-2" />
                                This coupon is only applicable to {validatedCoupon.applicable_payment_type === "PAY_PER_MONTH" ? "Pay Per Month" : "Pay Per Patient"} subscription.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* PAY PER PATIENT */}

                            <button
                                onClick={() =>
                                    setSelectedPaymentType(
                                        'PAY_PER_PATIENT'
                                    )
                                }
                                disabled={validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_MONTH"}
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_PATIENT')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    } ${validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_MONTH"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                            >

                                <div className="flex items-center justify-between mb-4">

                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-orange-500" />
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {isActivated('PAY_PER_PATIENT') && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}

                                        {hasPendingChange('PAY_PER_PATIENT') && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                SCHEDULED
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <h3 className="text-lg font-semibold">
                                    Pay Per Patient
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Billing based on patients
                                </p>

                                {/* DEFAULT DETAILS */}
                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 ">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {validatedCoupon && isCouponApplicable ? "Original Price" : "Current Price"}
                                        </span>

                                        <span className={`text-lg font-semibold ${validatedCoupon && isCouponApplicable ? "line-through text-gray-400" : "text-[#1a2b3c]"}`}>
                                            $
                                            {paymentSettings?.pay_per_patient_amount || 0}
                                        </span>
                                    </div>

                                    {validatedCoupon && isCouponApplicable && (
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-green-600 font-medium">
                                                    Month-end Bill Discount
                                                </span>

                                                <span className="text-lg font-semibold text-green-600">
                                                    {validatedCoupon.discount_type === "PERCENTAGE"
                                                        ? `${validatedCoupon.discount_value}% OFF`
                                                        : `$${validatedCoupon.discount_value} OFF`}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Discount will be applied to the month-end patient bill.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isActivated('PAY_PER_PATIENT') &&
                                    !hasPendingChange('PAY_PER_PATIENT') && (

                                        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Start Date
                                                </span>

                                                <span className="text-sm font-semibold text-[#1a2b3c]">

                                                    {formatDate(
                                                        futureStartDate.toISOString()
                                                    )}

                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    End Date
                                                </span>

                                                <span className="text-sm font-semibold text-[#1a2b3c]">

                                                    {formatDate(
                                                        futureEndDate.toISOString()
                                                    )}

                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Remaining Days
                                                </span>

                                                <span className="text-sm font-semibold text-green-600">
                                                    30 Days
                                                </span>
                                            </div>

                                        </div>

                                    )}

                                {/* ACTIVE SUBSCRIPTION */}

                                {subscription?.current_payment_type === 'PAY_PER_PATIENT' && (

                                    <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">

                                        <p className="text-xs font-bold text-green-700 uppercase mb-2">
                                            Active Subscription
                                        </p>

                                        <div className="space-y-2">

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Start Date</span>
                                                <span className="font-semibold">
                                                    {formatDate(startDate.toISOString())}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">End Date</span>
                                                <span className="font-semibold">
                                                    {formatDate(expiryDate.toISOString())}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Remaining</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                            {/* <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Current Price</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price || 0}
                                                </span>
                                            </div> */}

                                        </div>

                                    </div>

                                )}

                                {/* SCHEDULED PLAN */}

                                {subscription?.pending_payment_type === 'PAY_PER_PATIENT' && (

                                    <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">

                                        <p className="text-xs font-bold text-yellow-700 uppercase mb-2">
                                            Scheduled Subscription
                                        </p>

                                        <div className="space-y-2">

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Starts
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">

                                                    {pendingStartDate
                                                        ? formatDate(
                                                            pendingStartDate.toISOString()
                                                        )
                                                        : 'N/A'}

                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Ends
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">

                                                    {pendingExpiryDate
                                                        ? formatDate(
                                                            pendingExpiryDate.toISOString()
                                                        )
                                                        : 'N/A'}

                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Upcoming Price
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price || 0}
                                                </span>

                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Remaining</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </button>

                            {/* PAY PER MONTH */}

                            <button
                                onClick={() =>
                                    setSelectedPaymentType(
                                        'PAY_PER_MONTH'
                                    )
                                }
                                disabled={validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_PATIENT"}
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_MONTH')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    } ${validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_PATIENT"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                            >

                                <div className="flex items-center justify-between mb-4">

                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-blue-500" />
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {isActivated('PAY_PER_MONTH') && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}

                                        {hasPendingChange('PAY_PER_MONTH') && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                SCHEDULED
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <h3 className="text-lg font-semibold">
                                    Pay Per Month
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Monthly Subscription
                                </p>

                                {/* DEFAULT DETAILS */}
                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {validatedCoupon && isCouponApplicable ? "Original Price" : "Current Price"}
                                        </span>

                                        <span className={`text-lg font-semibold ${validatedCoupon && isCouponApplicable ? "line-through text-gray-400" : "text-[#1a2b3c]"}`}>
                                            $
                                            {paymentSettings?.pay_per_month_amount || 0}
                                        </span>
                                    </div>

                                    {validatedCoupon && isCouponApplicable && (
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                                            <span className="text-sm text-green-600 font-medium">
                                                Discounted Price
                                            </span>
                                            <span className="text-lg font-semibold text-green-600">
                                                ${calculateDiscountedPrice(paymentSettings?.pay_per_month_amount || 0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {!isActivated('PAY_PER_MONTH') &&
                                    !hasPendingChange('PAY_PER_MONTH') && (

                                        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Start Date
                                                </span>

                                                <span className="text-sm font-semibold text-[#1a2b3c]">

                                                    {formatDate(
                                                        futureStartDate.toISOString()
                                                    )}

                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    End Date
                                                </span>

                                                <span className="text-sm font-semibold text-[#1a2b3c]">

                                                    {formatDate(
                                                        futureEndDate.toISOString()
                                                    )}

                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Remaining Days
                                                </span>

                                                <span className="text-sm font-semibold text-green-600">
                                                    30 Days
                                                </span>
                                            </div>

                                        </div>

                                    )}

                                {/* ACTIVE SUBSCRIPTION */}

                                {subscription?.current_payment_type === 'PAY_PER_MONTH' && (

                                    <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">

                                        <p className="text-xs font-bold text-green-700 uppercase mb-2">
                                            Active Subscription
                                        </p>

                                        <div className="space-y-2">

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Start Date</span>
                                                <span className="font-semibold">
                                                    {formatDate(startDate.toISOString())}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">End Date</span>
                                                <span className="font-semibold">
                                                    {formatDate(expiryDate.toISOString())}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Remaining</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Current Price</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price || 0}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )}

                                {/* SCHEDULED PLAN */}

                                {subscription?.pending_payment_type === 'PAY_PER_MONTH' && (

                                    <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">

                                        <p className="text-xs font-bold text-yellow-700 uppercase mb-2">
                                            Scheduled Subscription
                                        </p>

                                        <div className="space-y-2">

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Starts
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">

                                                    {pendingStartDate
                                                        ? formatDate(
                                                            pendingStartDate.toISOString()
                                                        )
                                                        : 'N/A'}

                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Ends
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">

                                                    {pendingExpiryDate
                                                        ? formatDate(
                                                            pendingExpiryDate.toISOString()
                                                        )
                                                        : 'N/A'}

                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Upcoming Price
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price || 0}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Remaining</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-[24px]">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSaveSubscription}
                        disabled={savingSubscription || isValidatingCoupon || isAssigningCoupon}
                        className={`px-6 py-3 rounded-full font-bold text-white transition-all flex items-center gap-2 ${savingSubscription || isValidatingCoupon || isAssigningCoupon
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#1a2b3c] hover:bg-[#2d4258]'
                            }`}
                    >

                        {(savingSubscription || isValidatingCoupon || isAssigningCoupon) && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}

                        {savingSubscription
                            ? 'Updating...'
                            : isValidatingCoupon
                                ? 'Validating...'
                                : isAssigningCoupon
                                    ? 'Applying Coupon...'
                                    : 'Save Subscription'}

                    </button>

                </div>

            </div>

        </div>
    );
}