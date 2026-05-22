/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import {
    CreditCard,
    CalendarDays,
    Clock3,
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
import { ASSIGN_COUPON_TO_PRACTICE, GET_ALL_COUPONS, REMOVE_COUPON_FROM_PRACTICE, VALIDATE_COUPON_BY_CODE } from '../graphql/subscription.query';

// =========================
// TYPES
// =========================

type PaymentType = 'PAY_PER_PATIENT' | 'PAY_PER_MONTH';

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
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    /* =========================================
        STATES
    ========================================= */

    const [selectedPaymentType, setSelectedPaymentType] =
        useState<PaymentType>('PAY_PER_PATIENT');

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

    useEffect(() => {
        if (!subscription) return;
        setSelectedPaymentType(subscription.current_payment_type);
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
            return new Date(subscription.subscription_end_date);
        }
        const now = new Date();
        const expiry = new Date();
        expiry.setDate(now.getDate() + 30);
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

    /* =========================================
        REMAINING DAYS
    ========================================= */

    const remainingDays = useMemo(() => {
        const now = new Date().getTime();
        const expiry = new Date(expiryDate).getTime();
        const diff = expiry - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }, [expiryDate]);

    /* =========================================
        SAVE SUBSCRIPTION
    ========================================= */

    const handleSaveSubscription = async () => {
        try {
            if (!practiceId) {
                alert('Practice ID not found');
                return;
            }
            await dispatch(
                savePracticeSubscription({
                    practiceId,
                    paymentType: selectedPaymentType
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
            const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Calculate expiry date
            let expiresAt: string | null = null;
            if (validatedCoupon.duration_months) {
                const expiryDate = new Date(now);
                expiryDate.setMonth(expiryDate.getMonth() + validatedCoupon.duration_months);
                expiresAt = expiryDate.toISOString();
            }

            // Update practice_usage_json
            // Remove any corrupted "0" and "1" keys from existing data
            const practiceUsage = { ...(validatedCoupon.practice_usage_json || {}) };

            // Clean corrupted keys (from previous bad saves)
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
                    used_count: validatedCoupon.used_count + 1,
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${validatedCoupon.code}" assigned to practice!`);

            // Reset state
            setCouponCodeInput('');
            setValidatedCoupon(null);
            setCouponValidationError('');

            // Refetch coupons to update active coupon display
            // refetchCoupons();

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

    const isSelected = (type: PaymentType) => selectedPaymentType === type;

    const isActivated = (type: PaymentType) => subscription?.current_payment_type === type;

    const hasPendingChange = (type: PaymentType) => subscription?.pending_payment_type === type;

    const showActivatedTag = (type: PaymentType) => isActivated(type);

    const showScheduledTag = (type: PaymentType) => hasPendingChange(type);


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
                                onClick={() => setSelectedPaymentType('PAY_PER_PATIENT')}
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_PATIENT')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {showActivatedTag('PAY_PER_PATIENT') && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}
                                        {showScheduledTag('PAY_PER_PATIENT') && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                SCHEDULED
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">Pay Per Patient</h3>
                                <p className="text-sm text-gray-500">Billing based on patients</p>
                                {isSelected('PAY_PER_PATIENT') && (

                                    <div className="mt-4 space-y-2">

                                        {isActivated('PAY_PER_PATIENT') && (

                                            <>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-orange-500" />

                                                    <span>

                                                        {formatDate(
                                                            startDate.toISOString()
                                                        )} to{' '}

                                                        {formatDate(
                                                            expiryDate.toISOString()
                                                        )}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-green-600">

                                                    <Clock3 className="w-4 h-4" />

                                                    <span>
                                                        {remainingDays} days remaining
                                                    </span>

                                                </div>

                                            </>
                                        )}

                                        {hasPendingChange('PAY_PER_PATIENT') && (

                                            <>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-yellow-500" />

                                                    <span>

                                                        Starts:{' '}

                                                        {pendingStartDate
                                                            ? formatDate(
                                                                pendingStartDate.toISOString()
                                                            )
                                                            : 'N/A'}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-yellow-500" />

                                                    <span>

                                                        Expires:{' '}

                                                        {pendingExpiryDate
                                                            ? formatDate(
                                                                pendingExpiryDate.toISOString()
                                                            )
                                                            : 'N/A'}

                                                    </span>

                                                </div>

                                            </>
                                        )}

                                    </div>
                                )}
                            </button>

                            {/* ================= MONTH ================= */}
                            <button
                                onClick={() => setSelectedPaymentType('PAY_PER_MONTH')}
                                className={`border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_MONTH')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {showActivatedTag('PAY_PER_MONTH') && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                ACTIVATED
                                            </span>
                                        )}
                                        {showScheduledTag('PAY_PER_MONTH') && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                SCHEDULED
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold">Pay Per Month</h3>
                                <p className="text-sm text-gray-500">30 days subscription</p>
                                {isSelected('PAY_PER_MONTH') && (

                                    <div className="mt-4 space-y-2">

                                        {isActivated('PAY_PER_MONTH') && (

                                            <>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-blue-500" />

                                                    <span>

                                                        {formatDate(
                                                            startDate.toISOString()
                                                        )} to{' '}

                                                        {formatDate(
                                                            expiryDate.toISOString()
                                                        )}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-orange-600">

                                                    <Clock3 className="w-4 h-4" />

                                                    <span>
                                                        {remainingDays} days remaining
                                                    </span>

                                                </div>

                                            </>
                                        )}

                                        {hasPendingChange('PAY_PER_MONTH') && (

                                            <>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-yellow-500" />

                                                    <span>

                                                        Starts:{' '}

                                                        {pendingStartDate
                                                            ? formatDate(
                                                                pendingStartDate.toISOString()
                                                            )
                                                            : 'N/A'}

                                                    </span>

                                                </div>

                                                <div className="flex items-center gap-2 text-sm">

                                                    <CalendarDays className="w-4 h-4 text-yellow-500" />

                                                    <span>

                                                        Expires:{' '}

                                                        {pendingExpiryDate
                                                            ? formatDate(
                                                                pendingExpiryDate.toISOString()
                                                            )
                                                            : 'N/A'}

                                                    </span>

                                                </div>

                                            </>
                                        )}

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