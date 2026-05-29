/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import {
    CreditCard,
    CalendarDays,
    Loader2,
    Tag,
    X,
    Percent,
    DollarSign,
    Gift
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../store';

import {
    fetchPracticeSubscription,
    savePracticeSubscription
} from '../../../../features/subscription/subscription.slice';

import { useQuery, useMutation } from '@apollo/client/react';
import { localClient } from '../../../../api/apollo/localClient';
import toast from 'react-hot-toast';
import { ASSIGN_COUPON_TO_PRACTICE, GET_ALL_COUPONS, GET_PAYMENT_SETTINGS, REMOVE_COUPON_FROM_PRACTICE, VALIDATE_COUPON_BY_CODE } from '../graphql/subscription.query';


interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed' | 'free_months';
    discount_value: number | null;
    free_months: number | null;
    duration_months: number | null;
    is_active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    max_uses: number | null;
    used_count: number;
    practice_usage_json: Record<string, any>;
}

// =========================
// COMPONENT
// =========================

export default function PracticeSubscription() {

    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state: any) => state.auth);

    const {
        subscription,
        loading,
        saving
    } = useAppSelector((state: any) => state.subscription);

    const isSuperAdminView =
        user?.type === 'SUPER_ADMIN_VIEW' ||
        user?.user?.type === 'SUPER_ADMIN_VIEW';

    const practiceId = user?.id;

    // =========================
    // COUPON STATE
    // =========================
    // const [selectedCouponId, setSelectedCouponId] = useState('');
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [isAssigningCoupon, setIsAssigningCoupon] = useState(false);
    const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);
    const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
    const [couponValidationError, setCouponValidationError] = useState('');

    // =========================
    // FETCH COUPONS
    // =========================
    const { data: couponsData } = useQuery<{ coupons: Coupon[] }>(GET_ALL_COUPONS, {
        client: localClient,
        fetchPolicy: 'network-only',
    });

    const [assignCoupon] = useMutation(ASSIGN_COUPON_TO_PRACTICE, { client: localClient });
    const [removeCoupon] = useMutation(REMOVE_COUPON_FROM_PRACTICE, { client: localClient });

    if (!isSuperAdminView) {
        return (
            <Navigate
                to="/practice/dashboard/view-profile"
                replace
            />
        );
    }

    const coupons = couponsData?.coupons || [];

    // =========================
    // GET ACTIVE COUPON FOR THIS PRACTICE
    // =========================
    const practiceActiveCoupon = useMemo(() => {
        if (!coupons.length || !practiceId) return null;

        for (const coupon of coupons) {
            const practiceData = coupon.practice_usage_json?.[practiceId];
            if (practiceData) {
                // Check if still valid (not expired)
                if (practiceData.expiresAt) {
                    const expiresAt = new Date(practiceData.expiresAt);
                    if (expiresAt > new Date()) {
                        return {
                            ...coupon,
                            appliedAt: practiceData.appliedAt,
                            expiresAt: practiceData.expiresAt,
                        };
                    }
                } else {
                    // No expiry - one-time coupon still active for current month
                    const now = new Date();
                    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                    if (practiceData.periods?.includes(currentMonthKey)) {
                        return {
                            ...coupon,
                            appliedAt: practiceData.appliedAt,
                            expiresAt: null,
                        };
                    }
                }
            }
        }

        return null;
    }, [coupons, practiceId]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';

        return new Date(dateStr).toLocaleDateString(
            'en-AU',
            {
                timeZone: 'UTC',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    /* =========================================
        STATES
    ========================================= */

    const [monthlyAddonEnabled, setMonthlyAddonEnabled] =
        useState(false);

    /* =========================================
        FETCH
    ========================================= */

    useEffect(() => {
        if (!practiceId) return;
        dispatch(fetchPracticeSubscription(practiceId));
    }, [dispatch, practiceId]);

    /* =========================================
        SYNC FROM DB
    ========================================= */

    const {
        data: paymentSettingsData
    } = useQuery(
        GET_PAYMENT_SETTINGS,
        {
            client: localClient
        }
    );

    const paymentSettingsDataAny =
        paymentSettingsData as any;

    const paymentSettings =
        paymentSettingsDataAny?.payment_settings?.[0];

    useEffect(() => {
        if (!subscription) return;

        setMonthlyAddonEnabled(
            subscription.current_payment_type === 'PAY_PER_MONTH'
        );
    }, [subscription]);

    /* =========================================
        START & EXPIRY & PENDING START ADN END
    ========================================= */

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

            const expiry = new Date(
                subscription.subscription_end_date
            );

            expiry.setUTCHours(
                23,
                59,
                59,
                999
            );

            return expiry;
        }

        const expiry = new Date();

        expiry.setUTCHours(
            0,
            0,
            0,
            0
        );

        expiry.setUTCDate(
            expiry.getUTCDate() + 29
        );

        expiry.setUTCHours(
            23,
            59,
            59,
            999
        );

        return expiry;

    }, [subscription]);

    const pendingStartDate = useMemo(() => {

        if (subscription?.pending_start_date) {

            const pending = new Date(
                subscription.pending_start_date
            );

            pending.setUTCHours(
                0,
                0,
                0,
                0
            );

            return pending;
        }

        return null;

    }, [subscription]);

    const pendingExpiryDate = useMemo(() => {

        if (!pendingStartDate) return null;

        const expiry = new Date(
            pendingStartDate
        );

        expiry.setUTCHours(
            0,
            0,
            0,
            0
        );

        expiry.setUTCDate(
            expiry.getUTCDate() + 29
        );

        expiry.setUTCHours(
            23,
            59,
            59,
            999
        );

        return expiry;

    }, [pendingStartDate]);

    /* =========================================
        CHECK EXPIRED WITHOUT PENDING PLAN
    ========================================= */

    const isExpiredWithoutPending = useMemo(() => {

        if (!subscription) return false;

        const now = new Date();

        const expiry =
            subscription.subscription_end_date
                ? new Date(subscription.subscription_end_date)
                : null;

        const isExpired =
            expiry ? expiry.getTime() < now.getTime() : false;

        return (
            isExpired &&
            !subscription.pending_payment_type
        );

    }, [subscription]);

    /* =========================================
        SYNC FROM DB
    ========================================= */

    useEffect(() => {
        if (!subscription) return;

        if (isExpiredWithoutPending) {
            setMonthlyAddonEnabled(false);
            return;
        }

        setMonthlyAddonEnabled(
            subscription.current_payment_type === 'PAY_PER_MONTH'
        );
    }, [
        subscription,
        isExpiredWithoutPending
    ]);


    /* =========================================
        REMAINING DAYS
    ========================================= */

    const remainingDays = useMemo(() => {

        const today = new Date();

        today.setUTCHours(
            0,
            0,
            0,
            0
        );

        const expiry = new Date(expiryDate);

        expiry.setUTCHours(
            23,
            59,
            59,
            999
        );

        const diff =
            expiry.getTime() -
            today.getTime();

        return Math.max(
            0,
            Math.ceil(
                diff / (1000 * 60 * 60 * 24)
            )
        );

    }, [expiryDate]);

    /* =========================================
        SAVE SUBSCRIPTION
    ========================================= */

    const subscriptionStartDate = new Date();

    const subscriptionEndDate = new Date(
        subscriptionStartDate
    );

    subscriptionEndDate.setUTCHours(
        0,
        0,
        0,
        0
    );

    subscriptionEndDate.setUTCDate(
        subscriptionEndDate.getUTCDate() + 29
    );

    subscriptionEndDate.setUTCHours(
        23,
        59,
        59,
        999
    );

    const nextPendingStartDate = new Date(
        subscriptionEndDate
    );

    nextPendingStartDate.setUTCDate(
        nextPendingStartDate.getUTCDate() + 1
    );

    nextPendingStartDate.setUTCHours(
        0,
        0,
        0,
        0
    );

    const handleSaveSubscription = async () => {
        try {

            if (!practiceId) {
                alert('Practice ID not found');
                return;
            }

            await dispatch(
                savePracticeSubscription({

                    practiceId,

                    paymentType: monthlyAddonEnabled
                        ? 'PAY_PER_MONTH'
                        : 'PAY_PER_PATIENT',

                    monthly_addon_enabled:
                        monthlyAddonEnabled,


                    subscription_start_date:
                        subscriptionStartDate.toISOString(),

                    subscription_end_date:
                        subscriptionEndDate.toISOString(),

                    pending_start_date:
                        nextPendingStartDate.toISOString()

                })
            ).unwrap();

            toast.success('Subscription updated');

        } catch (error) {

            console.error(error);
            toast.error('Failed to save subscription');

        }
    };

    /* =========================================
    VALIDATE COUPON CODE
========================================= */

    const handleValidateCoupon = async () => {
        if (!couponCodeInput.trim()) {
            setCouponValidationError('Please enter a coupon code');
            return;
        }

        setIsValidatingCoupon(true);
        setCouponValidationError('');
        setValidatedCoupon(null);

        try {
            const { data } = await localClient.query({
                query: VALIDATE_COUPON_BY_CODE,
                variables: { code: couponCodeInput.trim().toUpperCase() },
                fetchPolicy: 'network-only',
            });

            const coupons = (data as any)?.coupons || [];

            if (coupons.length === 0) {
                setCouponValidationError('Invalid coupon code. Please check and try again.');
                setIsValidatingCoupon(false);
                return;
            }

            const coupon: Coupon = coupons[0];

            // --- VALIDATION CHECKS ---

            // Check expiry
            const today = new Date().toISOString().split('T')[0];
            if (coupon.valid_until && coupon.valid_until < today) {
                setCouponValidationError('This coupon has expired.');
                setIsValidatingCoupon(false);
                return;
            }

            // Check not yet valid
            if (coupon.valid_from && coupon.valid_from > today) {
                setCouponValidationError(`This coupon is valid from ${new Date(coupon.valid_from).toLocaleDateString('en-ZA')}.`);
                setIsValidatingCoupon(false);
                return;
            }

            // Check max uses
            if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
                setCouponValidationError('This coupon has reached its maximum usage limit.');
                setIsValidatingCoupon(false);
                return;
            }

            // Check if already assigned to THIS practice and still active
            const practiceData = coupon.practice_usage_json?.[practiceId];
            if (practiceData?.expiresAt) {
                const expiresAt = new Date(practiceData.expiresAt);
                if (expiresAt > new Date()) {
                    setCouponValidationError('This coupon is already active for this practice.');
                    setIsValidatingCoupon(false);
                    return;
                }
            }

            // All checks passed
            setValidatedCoupon(coupon);
            setIsValidatingCoupon(false);

        } catch (error: any) {
            console.error('VALIDATE COUPON ERROR:', error);
            setCouponValidationError(error?.message || 'Failed to validate coupon');
            setIsValidatingCoupon(false);
        }
    };

    /* =========================================
        ASSIGN COUPON (AFTER VALIDATION)
    ========================================= */

    const handleAssignCoupon = async () => {
        if (!validatedCoupon || !practiceId) return;

        setIsAssigningCoupon(true);

        try {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0-indexed (0 = Jan)

            // Duration in months (default to 1 if not specified)
            const durationMonths = validatedCoupon.duration_months || 1;

            // Calculate months for coupon application (STARTING FROM NEXT MONTH)
            const monthsToAdd: string[] = [];
            for (let i = 1; i <= durationMonths; i++) {  // i = 1 means next month
                const date = new Date(currentYear, currentMonth + i, 1);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthsToAdd.push(monthKey);
            }

            // Calculate expiresAt as the LAST DAY of the LAST month at 23:59:59.999
            const lastMonthDate = new Date(currentYear, currentMonth + durationMonths, 0);
            lastMonthDate.setUTCHours(23, 59, 59, 999);
            const expiresAt = lastMonthDate.toISOString();

            // Update practice_usage_json
            const practiceUsage = { ...(validatedCoupon.practice_usage_json || {}) };

            // Clean corrupted keys
            delete practiceUsage["0"];
            delete practiceUsage["1"];

            // Get existing periods or create new array
            const existingPeriods = practiceUsage[practiceId]?.periods || [];

            // Merge existing periods with new ones (avoid duplicates)
            const allPeriods = [...new Set([...existingPeriods, ...monthsToAdd])];

            practiceUsage[practiceId] = {
                count: (practiceUsage[practiceId]?.count || 0) + 1,
                periods: allPeriods,
                appliedAt: now.toISOString(),
                expiresAt: expiresAt,
            };

            await assignCoupon({
                variables: {
                    id: validatedCoupon.id,
                    used_count: validatedCoupon.used_count + 1,
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${validatedCoupon.code}" assigned! Active for ${durationMonths} month(s) starting next month`);

            // Reset state
            setCouponCodeInput('');
            setValidatedCoupon(null);
            setCouponValidationError('');

        } catch (error: any) {
            console.error('ASSIGN COUPON ERROR:', error);
            toast.error(error?.message || 'Failed to assign coupon');
        } finally {
            setIsAssigningCoupon(false);
        }
    };

    /* =========================================
        REMOVE COUPON
    ========================================= */

    const handleRemoveCoupon = async () => {
        if (!practiceActiveCoupon || !practiceId) return;

        setIsRemovingCoupon(true);

        try {
            const practiceUsage = { ...(practiceActiveCoupon.practice_usage_json || {}) };

            if (practiceUsage[practiceId]) {
                delete practiceUsage[practiceId];
            }

            await removeCoupon({
                variables: {
                    id: practiceActiveCoupon.id,
                    used_count: Math.max(0, practiceActiveCoupon.used_count - 1),
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${practiceActiveCoupon.code}" removed from practice!`);

        } catch (error: any) {
            console.error('REMOVE COUPON ERROR:', error);
            toast.error(error?.message || 'Failed to remove coupon');
        } finally {
            setIsRemovingCoupon(false);
        }
    };

    /* =========================================
        HELPERS
    ========================================= */

    const isSelected = (monthlyPlan: boolean) =>
        monthlyAddonEnabled === monthlyPlan;

    const isActivated = (monthlyPlan: boolean) =>
        monthlyPlan
            ? subscription?.current_payment_type === 'PAY_PER_MONTH'
            : subscription?.current_payment_type === 'PAY_PER_PATIENT';

    const hasPendingChange = (monthlyPlan: boolean) =>
        monthlyPlan
            ? subscription?.pending_payment_type === 'PAY_PER_MONTH'
            : subscription?.pending_payment_type === 'PAY_PER_PATIENT';

    const futureStartDate = subscription?.subscription_end_date
        ? (() => {

            const date = new Date(
                subscription.subscription_end_date
            );

            date.setUTCDate(
                date.getUTCDate() + 1
            );

            date.setUTCHours(
                0,
                0,
                0,
                0
            );

            return date;

        })()
        : new Date();

    const futureEndDate = new Date(
        futureStartDate
    );

    futureEndDate.setUTCHours(
        0,
        0,
        0,
        0
    );

    futureEndDate.setUTCDate(
        futureEndDate.getUTCDate() + 29
    );

    futureEndDate.setUTCHours(
        23,
        59,
        59,
        999
    );


    const getCouponIcon = (type: string) => {
        switch (type) {
            case 'percentage': return <Percent size={16} />;
            case 'fixed': return <DollarSign size={16} />;
            case 'free_months': return <Gift size={16} />;
            default: return <Tag size={16} />;
        }
    };

    const getCouponLabel = (coupon: Coupon) => {
        switch (coupon.discount_type) {
            case 'percentage':
                return `${coupon.discount_value}% off`;
            case 'fixed':
                return `$${coupon.discount_value} off`;
            case 'free_months':
                return `${coupon.free_months} months free`;
            default:
                return coupon.code;
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-4">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Subscription
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage practice subscription plan
                            </p>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
                        <p className="text-sm text-gray-500">Loading subscription...</p>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-4">

                        {subscription?.pending_payment_type && (
                            <div className="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                                <p className="text-sm text-yellow-700 font-medium">
                                    This plan will be activated when current subscription expires
                                </p>
                                <p className="text-sm text-yellow-600 mt-1">
                                    Scheduled change at{" "}
                                    <span className="font-semibold">
                                        {subscription.pending_start_date
                                            ? new Date(subscription.pending_start_date).toLocaleDateString()
                                            : '-'}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* ACTIVE COUPON BANNER */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* ================= PATIENT ================= */}


                            <button
                                onClick={() =>
                                    setMonthlyAddonEnabled(false)
                                }
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected(false)
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    }`}
                            >

                                <div className="flex items-center justify-between mb-4">

                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-orange-500" />
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {isActivated(false) && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}

                                        {hasPendingChange(false) && (
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

                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 ">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Current Price
                                        </span>

                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_patient_amount || 0}
                                        </span>
                                    </div>
                                </div>

                                {!isActivated(false) &&
                                    !hasPendingChange(false) && (

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
                                                <span className="text-gray-500">Active Price</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price?.pay_per_patient_amount || 0}
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
                                                    ${subscription?.pending_price?.pay_per_patient_amount || 0}
                                                </span>

                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Plan will active in</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </button>

                            {/* ================= MONTH ================= */}
                            <button
                                onClick={() =>
                                    setMonthlyAddonEnabled(true)
                                }
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected(true)
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    }`}
                            >

                                <div className="flex items-center justify-between mb-4">

                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-blue-500" />
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {isActivated(true) && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}

                                        {hasPendingChange(true) && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                SCHEDULED
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <h3 className="text-lg font-semibold">
                                    Pay Per Patient + Monthly Add on
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Patient billing with additional monthly subscription fee
                                </p>

                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Per Patient Fee
                                        </span>

                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_patient_amount || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Monthly Add on
                                        </span>

                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_month_amount || 0}
                                        </span>
                                    </div>
                                </div>

                                {!isActivated(true) &&
                                    !hasPendingChange(true) && (

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
                                                <span className="text-gray-500">Patient Amount</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price?.pay_per_patient_amount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Monthly Add on</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price?.pay_per_month_amount || 0}
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
                                                    Patient Amount
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price?.pay_per_patient_amount || 0}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Monthly Add on
                                                </span>

                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price?.pay_per_month_amount || 0}
                                                </span>

                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Plan will active in</span>
                                                <span className="font-semibold text-green-600">
                                                    {remainingDays} days
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </button>

                        </div>

                        {/* SAVE SUBSCRIPTION */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveSubscription}
                                disabled={saving}
                                className={`px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 ${saving
                                    ? 'bg-orange-300 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600'
                                    }`}
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? 'Saving...' : 'Save Subscription'}
                            </button>
                        </div>

                    </div>
                )}
                {/* ==================================================== */}
                {/* ASSIGN COUPON SECTION - WITH CODE VALIDATION */}
                {/* ==================================================== */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Assign Discount Coupon
                            </h2>
                            <p className="text-sm text-gray-500">
                                Enter a coupon code to apply a discount to this practice's subscription
                            </p>
                        </div>
                    </div>

                    {/* Already has active coupon */}
                    {practiceActiveCoupon ? (
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                                        {getCouponIcon(practiceActiveCoupon.discount_type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-purple-800">
                                            {practiceActiveCoupon.code}
                                        </p>
                                        <p className="text-xs text-purple-600">
                                            {getCouponLabel(practiceActiveCoupon)}
                                        </p>
                                        {practiceActiveCoupon.expiresAt && (
                                            <p className="text-xs text-purple-500 mt-0.5">
                                                Expires: {new Date(practiceActiveCoupon.expiresAt).toLocaleDateString('en-ZA', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: '2-digit'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveCoupon}
                                    disabled={isRemovingCoupon}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isRemovingCoupon ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <X size={14} />
                                    )}
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Coupon Code Input */}
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={couponCodeInput}
                                    onChange={(e) => {
                                        setCouponCodeInput(e.target.value.toUpperCase());
                                        setCouponValidationError('');
                                        setValidatedCoupon(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleValidateCoupon();
                                    }}
                                    placeholder="Enter coupon code (e.g. SUMMER50)"
                                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                                    disabled={isValidatingCoupon}
                                />
                                <button
                                    onClick={handleValidateCoupon}
                                    disabled={!couponCodeInput.trim() || isValidatingCoupon}
                                    className="px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                >
                                    {isValidatingCoupon ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Tag size={16} />
                                    )}
                                    {isValidatingCoupon ? 'Checking...' : 'Validate'}
                                </button>
                            </div>

                            {/* Validation Error */}
                            {couponValidationError && (
                                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <X size={16} />
                                        {couponValidationError}
                                    </p>
                                </div>
                            )}

                            {/* Validated Coupon Preview */}
                            {validatedCoupon && !couponValidationError && (
                                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getCouponIcon(validatedCoupon.discount_type)}
                                            <span className="font-bold text-green-800">
                                                {validatedCoupon.code}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-700 text-xs font-semibold">
                                                VALID
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        {getCouponLabel(validatedCoupon)}
                                    </p>
                                    {validatedCoupon.duration_months && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Duration: {validatedCoupon.duration_months} months from today
                                        </p>
                                    )}
                                    {validatedCoupon.description && (
                                        <p className="text-xs text-green-500 mt-1">
                                            {validatedCoupon.description}
                                        </p>
                                    )}

                                    {/* Assign Button */}
                                    <button
                                        onClick={handleAssignCoupon}
                                        disabled={isAssigningCoupon}
                                        className="mt-3 w-full px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {isAssigningCoupon ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Tag size={16} />
                                        )}
                                        {isAssigningCoupon ? 'Assigning...' : `Apply "${validatedCoupon.code}" to this Practice`}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>

        </div>
    );
}