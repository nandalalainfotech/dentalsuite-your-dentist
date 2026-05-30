/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    Loader2,
    X,
    CalendarDays,
    CreditCard,
    Tag,
    Gift,
    Percent,
    DollarSign,
    Check
} from 'lucide-react';

import {
    GET_PRACTICE_SUBSCRIPTION,
    UPDATE_PRACTICE_SUBSCRIPTION,
    CREATE_PRACTICE_SUBSCRIPTION,
    GET_PAYMENT_SETTINGS
} from '../graphql/clients.query';

import {
    ASSIGN_COUPON_TO_PRACTICE,
    GET_ALL_COUPONS,
    REMOVE_COUPON_FROM_PRACTICE,
    VALIDATE_COUPON_BY_CODE
} from '../../practice/dashboard/graphql/subscription.query';

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

type PaymentType = 'PAY_PER_PATIENT' | 'PAY_PER_MONTH';

interface Props {
    onClose: () => void;
    client: Client | null;
}

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
    applies_to?: 'monthly' | 'per_patient' | 'both';
    coupon_applies_to?: 'pay_per_patient' | 'pay_per_month' | 'both';
}

interface AppliedCoupon extends Coupon {
    appliedAt: string;
    expiresAt: string | null;
    appliedTo: 'monthly' | 'per_patient' | 'both';
    appliedToPlan?: 'pay_per_patient' | 'pay_per_month';
    discountAmount?: number;
}

const createStartOfDayUTC = (date: Date) => {
    const cloned = new Date(date);
    cloned.setUTCHours(0, 0, 0, 0);
    return cloned;
};

const createExpiryDate = (start: Date) => {
    const expiry = createStartOfDayUTC(start);
    expiry.setUTCDate(expiry.getUTCDate() + 29);
    expiry.setUTCHours(23, 59, 59, 999);
    return expiry;
};

const createNextStartDate = (endDate: string | Date) => {
    const next = createStartOfDayUTC(new Date(endDate));
    next.setUTCDate(next.getUTCDate() + 1);
    return next;
};

const calculateRemainingDays = (expiryDate: Date) => {
    const today = createStartOfDayUTC(new Date());
    const expiry = new Date(expiryDate);
    expiry.setUTCHours(23, 59, 59, 999);
    const diff = expiry.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function PracticeDetailsDialog({ onClose, client }: Props) {

    // =========================
    // QUERIES & MUTATIONS
    // =========================
    const {
        data: subscriptionData,
        refetch: refetchSubscription
    } = useQuery(GET_PRACTICE_SUBSCRIPTION, {
        client: localClient,
        variables: { practiceId: client?.id },
        skip: !client?.id
    });

    const { data: paymentSettingsData } = useQuery(GET_PAYMENT_SETTINGS, {
        client: localClient
    });

    const { data: couponsData, refetch: refetchCoupons } = useQuery<{ coupons: Coupon[] }>(
        GET_ALL_COUPONS,
        {
            client: localClient,
            fetchPolicy: 'network-only',
        }
    );

    const [updatePracticeSubscription] = useMutation(UPDATE_PRACTICE_SUBSCRIPTION, {
        client: localClient
    });

    const [createPracticeSubscription] = useMutation(CREATE_PRACTICE_SUBSCRIPTION, {
        client: localClient
    });

    const [assignCoupon] = useMutation(ASSIGN_COUPON_TO_PRACTICE, {
        client: localClient
    });

    const [removeCoupon] = useMutation(REMOVE_COUPON_FROM_PRACTICE, {
        client: localClient
    });

    // =========================
    // STATE
    // =========================
    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>('PAY_PER_PATIENT');
    const [savingSubscription, setSavingSubscription] = useState(false);

    // Coupon state
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
    const [couponValidationError, setCouponValidationError] = useState('');
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);

    // =========================
    // DATA EXTRACTION
    // =========================
    const subscriptionDataAny = subscriptionData as any;
    const subscription = subscriptionDataAny?.practice_subscription?.[0] || null;

    const paymentSettingsDataAny = paymentSettingsData as any;
    const paymentSettings = paymentSettingsDataAny?.payment_settings?.[0];

    const coupons = couponsData?.coupons || [];

    // =========================
    // ACTIVE COUPONS SEPARATED BY PLAN
    // =========================
    const practiceActiveCoupons = useMemo(() => {
        if (!coupons.length || !client?.id) {
            return {
                payPerPatient: [] as AppliedCoupon[],
                payPerMonth: [] as AppliedCoupon[]
            };
        }

        const result = {
            payPerPatient: [] as AppliedCoupon[],
            payPerMonth: [] as AppliedCoupon[]
        };

        for (const coupon of coupons) {
            const practiceData = coupon.practice_usage_json?.[client.id];
            if (practiceData && practiceData.periods && Array.isArray(practiceData.periods)) {
                const now = new Date();
                let isStillValid = false;

                if (practiceData.expiresAt) {
                    const expiresAt = new Date(practiceData.expiresAt);
                    if (expiresAt > now) {
                        isStillValid = true;
                    }
                } else {
                    const currentYear = now.getFullYear();
                    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
                    const currentMonthKey = `${currentYear}-${currentMonth}`;
                    isStillValid = practiceData.periods.includes(currentMonthKey);
                }

                if (isStillValid) {
                    const appliedCoupon: AppliedCoupon = {
                        ...coupon,
                        appliedAt: practiceData.appliedAt,
                        expiresAt: practiceData.expiresAt,
                        appliedTo: coupon.applies_to || 'both',
                        appliedToPlan: practiceData.appliedToPlan || 'pay_per_patient',
                        discountAmount: practiceData.discountAmount
                    };

                    if (appliedCoupon.appliedToPlan === 'pay_per_patient') {
                        result.payPerPatient.push(appliedCoupon);
                    } else if (appliedCoupon.appliedToPlan === 'pay_per_month') {
                        result.payPerMonth.push(appliedCoupon);
                    } else {
                        if (coupon.applies_to === 'monthly') {
                            result.payPerMonth.push(appliedCoupon);
                        } else {
                            result.payPerPatient.push(appliedCoupon);
                        }
                    }
                }
            }
        }

        return result;
    }, [coupons, client?.id]);

    // =========================
    // EFFECTS
    // =========================
    useEffect(() => {
        if (!subscription) {
            setSelectedPaymentType('PAY_PER_PATIENT');
            return;
        }

        const now = new Date();
        const subscriptionEndDate = createExpiryDate(
            new Date(subscription.subscription_end_date)
        );
        const isExpired = subscriptionEndDate && subscriptionEndDate < now;

        if (isExpired && !subscription.pending_payment_type) {
            setSelectedPaymentType('PAY_PER_PATIENT');
            return;
        }

        setSelectedPaymentType(
            subscription.pending_payment_type ||
            subscription.current_payment_type
        );
    }, [subscription]);

    // =========================
    // COMPUTED VALUES
    // =========================
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-AU', {
            timeZone: 'UTC',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const startDate = useMemo(() => {
        if (subscription?.subscription_start_date) {
            return new Date(subscription.subscription_start_date);
        }
        const start = new Date();
        start.setUTCDate(start.getUTCDate() + 30);
        return start;
    }, [subscription]);

    const expiryDate = useMemo(() => {
        if (subscription?.subscription_end_date) {
            const expiry = new Date(subscription.subscription_end_date);
            expiry.setUTCHours(23, 59, 59, 999);
            return expiry;
        }
        const expiry = new Date();
        expiry.setUTCDate(expiry.getUTCDate() + 29);
        expiry.setUTCHours(23, 59, 59, 999);
        return expiry;
    }, [subscription]);

    const pendingStartDate = useMemo(() => {
        if (subscription?.pending_start_date) {
            const pending = new Date(subscription.pending_start_date);
            pending.setUTCHours(0, 0, 0, 0);
            return createStartOfDayUTC(pending);
        }
        return null;
    }, [subscription]);

    const pendingExpiryDate = useMemo(() => {
        if (!pendingStartDate) return null;
        return createExpiryDate(pendingStartDate);
    }, [pendingStartDate]);

    const remainingDays = useMemo(() => {
        return calculateRemainingDays(expiryDate);
    }, [expiryDate]);

    const futureStartDate = useMemo(() => {
        if (!subscription?.subscription_end_date) {
            return createStartOfDayUTC(new Date());
        }
        const next = new Date(subscription.subscription_end_date);
        next.setUTCDate(next.getUTCDate() + 1);
        return createStartOfDayUTC(next);
    }, [subscription]);

    const futureEndDate = useMemo(() => {
        return createExpiryDate(futureStartDate);
    }, [futureStartDate]);

    const nextStartDate = subscription?.subscription_end_date
        ? createNextStartDate(subscription.subscription_end_date)
        : new Date();

    const isSelected = (type: PaymentType) => selectedPaymentType === type;
    const isActivated = (type: PaymentType) => subscription?.current_payment_type === type;
    const hasPendingChange = (type: PaymentType) => subscription?.pending_payment_type === type;

    const hasActiveSubscription = useMemo(() => {
        return subscription?.subscription_start_date &&
            subscription.subscription_start_date <= new Date().toISOString() &&
            subscription?.subscription_end_date &&
            new Date(subscription.subscription_end_date) > new Date();
    }, [subscription]);

    const selectedPlanName = selectedPaymentType === 'PAY_PER_MONTH'
        ? 'Monthly Add-on'
        : 'Pay Per Patient';

    const selectedPlanCoupons = selectedPaymentType === 'PAY_PER_MONTH'
        ? practiceActiveCoupons.payPerMonth
        : practiceActiveCoupons.payPerPatient;

    // =========================
    // COUPON FUNCTIONS
    // =========================
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
            const today = new Date().toISOString().split('T')[0];

            if (coupon.valid_until && coupon.valid_until < today) {
                setCouponValidationError('This coupon has expired.');
                setIsValidatingCoupon(false);
                return;
            }

            if (coupon.valid_from && coupon.valid_from > today) {
                setCouponValidationError(`This coupon is valid from ${new Date(coupon.valid_from).toLocaleDateString('en-ZA')}.`);
                setIsValidatingCoupon(false);
                return;
            }

            if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
                setCouponValidationError('This coupon has reached its maximum usage limit.');
                setIsValidatingCoupon(false);
                return;
            }

            // Check if coupon is already applied to the practice
            const alreadyApplied = [...practiceActiveCoupons.payPerPatient, ...practiceActiveCoupons.payPerMonth]
                .some((c) => c.code === coupon.code);
            if (alreadyApplied) {
                setCouponValidationError('This coupon is already applied to your practice.');
                setIsValidatingCoupon(false);
                return;
            }

            // Only enforce plan matching for Pay Per Patient plan
            if (selectedPaymentType === 'PAY_PER_PATIENT') {
                const appliesTo = coupon.coupon_applies_to || 'both';
                if (appliesTo !== 'both' && appliesTo !== 'pay_per_patient') {
                    setCouponValidationError('This coupon is not valid for the Pay Per Patient plan.');
                    setIsValidatingCoupon(false);
                    return;
                }
            }

            setValidatedCoupon(coupon);
            setIsValidatingCoupon(false);
            toast.success(`Coupon "${coupon.code}" is valid!`);
        } catch (error: any) {
            console.error('VALIDATE COUPON ERROR:', error);
            setCouponValidationError(error?.message || 'Failed to validate coupon');
            setIsValidatingCoupon(false);
        }
    };

    const applyCouponToPlan = async (coupon: Coupon, planType: 'pay_per_patient' | 'pay_per_month') => {
        if (!client?.id) return;

        try {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const durationMonths = coupon.duration_months || 1;

            // 1. Determine the Start Offset
            // If the selected plan matches what is currently active -> Start this month (0)
            // If the selected plan matches what is scheduled -> Start next month (1)
            let startOffset = 0;

            if (subscription) {
                const isCurrentPlanActive = selectedPaymentType === subscription.current_payment_type;
                const isPendingPlanActive = selectedPaymentType === subscription.pending_payment_type;

                if (isCurrentPlanActive) {
                    startOffset = 0;
                } else if (isPendingPlanActive) {
                    startOffset = 1;
                }
            }

            let monthsToAdd: string[] = [];

            // 2. Generate the periods based on the offset
            for (let i = startOffset; i < startOffset + durationMonths; i++) {
                const date = new Date(currentYear, currentMonth + i, 1);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthsToAdd.push(monthKey);
            }

            // 3. Calculate Expiry Date correctly
            // (Last day of the final month in the sequence)
            const expiryMonthIndex = currentMonth + startOffset + durationMonths;
            const lastMonthDate = new Date(currentYear, expiryMonthIndex, 0);
            lastMonthDate.setUTCHours(23, 59, 59, 999);
            const expiresAt = lastMonthDate.toISOString();

            const practiceUsage = { ...(coupon.practice_usage_json || {}) };

            // Clean up legacy keys
            delete practiceUsage["0"];
            delete practiceUsage["1"];

            const existingPeriods = practiceUsage[client.id]?.periods || [];
            const allPeriods = [...new Set([...existingPeriods, ...monthsToAdd])];

            practiceUsage[client.id] = {
                count: (practiceUsage[client.id]?.count || 0) + 1,
                periods: allPeriods,
                appliedAt: now.toISOString(),
                expiresAt: expiresAt,
                appliedToPlan: planType
            };

            await assignCoupon({
                variables: {
                    id: coupon.id,
                    used_count: coupon.used_count + 1,
                    practice_usage_json: practiceUsage,
                },
            });

            const timeMsg = startOffset === 0 ? "current month" : "next month (scheduled period)";
            toast.success(`Coupon "${coupon.code}" applied to ${selectedPlanName} starting from ${timeMsg}!`);

        } catch (error: any) {
            console.error('APPLY COUPON ERROR:', error);
            throw new Error(error?.message || 'Failed to apply coupon');
        }
    };

    const handleRemoveCoupon = async (couponToRemove: AppliedCoupon, planType: 'pay_per_patient' | 'pay_per_month') => {
        if (!client?.id) return;

        setIsRemovingCoupon(true);

        try {
            const practiceUsage = { ...(couponToRemove.practice_usage_json || {}) };

            if (practiceUsage[client.id]) {
                delete practiceUsage[client.id];
            }

            await removeCoupon({
                variables: {
                    id: couponToRemove.id,
                    used_count: Math.max(0, couponToRemove.used_count - 1),
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${couponToRemove.code}" removed from ${planType === 'pay_per_patient' ? 'Pay Per Patient' : 'Monthly Add-on'} plan!`);
            await refetchCoupons();
        } catch (error: any) {
            console.error('REMOVE COUPON ERROR:', error);
            toast.error(error?.message || 'Failed to remove coupon');
        } finally {
            setIsRemovingCoupon(false);
        }
    };

    // =========================
    // SAVE SUBSCRIPTION
    // =========================
    const handleSaveSubscription = async () => {
        try {
            setSavingSubscription(true);

            const today = new Date();
            const planType = selectedPaymentType === 'PAY_PER_MONTH' ? 'pay_per_month' : 'pay_per_patient';

            // CREATE NEW SUBSCRIPTION
            if (!subscription) {
                // Apply coupon first if exists
                if (validatedCoupon && client?.id) {
                    await applyCouponToPlan(validatedCoupon, planType);
                    setValidatedCoupon(null);
                    setCouponCodeInput('');
                }

                await createPracticeSubscription({
                    variables: {
                        object: {
                            practice_id: client?.id,
                            current_payment_type: selectedPaymentType,
                            pending_payment_type: null,
                            current_price: {
                                pay_per_patient_amount: paymentSettings?.pay_per_patient_amount || 0,
                                pay_per_month_amount: paymentSettings?.pay_per_month_amount || 0
                            },
                            subscription_start_date: today.toISOString(),
                            subscription_end_date: expiryDate.toISOString(),
                            pending_start_date: null,
                            is_active: true
                        }
                    }
                });

                await refetchSubscription();
                await refetchCoupons();
                toast.success('Subscription created successfully');
                return;
            }

            // EXISTING SUBSCRIPTION
            const subscriptionEndDate = subscription?.subscription_end_date
                ? new Date(subscription?.subscription_end_date)
                : null;

            const isSubscriptionActive =
                subscriptionEndDate &&
                subscriptionEndDate.getTime() > Date.now();

            // Check if plan actually changed
            const currentPlan = subscription?.current_payment_type;
            const pendingPlan = subscription?.pending_payment_type;
            const planChanged = selectedPaymentType !== currentPlan && selectedPaymentType !== pendingPlan;

            // ACTIVE SUBSCRIPTION
            if (isSubscriptionActive) {
                // Only update if plan changed or coupon exists
                if (planChanged || validatedCoupon) {
                    await updatePracticeSubscription({
                        variables: {
                            id: subscription.id,
                            current_payment_type: subscription.current_payment_type,
                            current_price: subscription.current_price,
                            pending_payment_type: selectedPaymentType,
                            pending_price: {
                                pay_per_patient_amount: paymentSettings?.pay_per_patient_amount || 0,
                                pay_per_month_amount: paymentSettings?.pay_per_month_amount || 0
                            },
                            pending_start_date: nextStartDate.toISOString()
                        }
                    });
                }

                // Apply coupon if exists
                if (validatedCoupon && client?.id) {
                    await applyCouponToPlan(validatedCoupon, planType);
                    setValidatedCoupon(null);
                    setCouponCodeInput('');
                }
            }
            // EXPIRED SUBSCRIPTION
            else {
                // Apply coupon first if exists
                if (validatedCoupon && client?.id) {
                    await applyCouponToPlan(validatedCoupon, planType);
                    setValidatedCoupon(null);
                    setCouponCodeInput('');
                }

                // Only update if plan changed or coupon was applied
                if (planChanged || validatedCoupon) {
                    await updatePracticeSubscription({
                        variables: {
                            id: subscription.id,
                            current_payment_type: selectedPaymentType,
                            current_price: {
                                pay_per_patient_amount: paymentSettings?.pay_per_patient_amount || 0,
                                pay_per_month_amount: paymentSettings?.pay_per_month_amount || 0
                            },
                            pending_payment_type: null,
                            pending_price: null,
                            pending_start_date: null
                        }
                    });
                }
            }

            await refetchSubscription();
            await refetchCoupons();

            if (planChanged || validatedCoupon) {
                toast.success('Subscription updated successfully');
            }

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
                        <X size={20} className="text-gray-500" />
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

                    {/* Subscription Plans */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4">
                            Subscription Plans
                        </h3>

                        {subscription?.pending_payment_type && (
                            <div className="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                                <p className="text-sm text-yellow-700 font-medium">
                                    This plan will be activated when current subscription expires
                                </p>
                                <p className="text-sm text-yellow-600 mt-1">
                                    Scheduled change at{' '}
                                    <span className="font-semibold">
                                        {pendingStartDate ? formatDate(pendingStartDate.toISOString()) : '-'}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* PAY PER PATIENT CARD */}
                            <div
                                onClick={() => {
                                    setSelectedPaymentType('PAY_PER_PATIENT');
                                    setCouponCodeInput('');
                                    setValidatedCoupon(null);
                                    setCouponValidationError('');
                                }}
                                className={`cursor-pointer border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_PATIENT')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
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

                                <h3 className="text-lg font-semibold">Pay Per Patient</h3>
                                <p className="text-sm text-gray-500">Billing based on patients</p>

                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Current Price</span>
                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_patient_amount || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Active Coupons for Pay Per Patient */}
                                {practiceActiveCoupons.payPerPatient.length > 0 && (
                                    <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200">
                                        <p className="text-xs font-bold text-purple-700 uppercase mb-2">Active Coupons for this plan</p>
                                        <div className="space-y-2">
                                            {practiceActiveCoupons.payPerPatient.map((coupon, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        {getCouponIcon(coupon.discount_type)}
                                                        <div>
                                                            <p className="text-sm font-semibold text-purple-800">{coupon.code}</p>
                                                            <p className="text-xs text-purple-600">{getCouponLabel(coupon)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveCoupon(coupon, 'pay_per_patient');
                                                        }}
                                                        disabled={isRemovingCoupon}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                                                    >
                                                        <X size={12} />
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isActivated('PAY_PER_PATIENT') && !hasPendingChange('PAY_PER_PATIENT') && (
                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Start Date</span>
                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {formatDate(futureStartDate.toISOString())}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">End Date</span>
                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {formatDate(futureEndDate.toISOString())}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Remaining Days</span>
                                            <span className="text-sm font-semibold text-green-600">30 Days</span>
                                        </div>
                                    </div>
                                )}

                                {subscription?.current_payment_type === 'PAY_PER_PATIENT' && (
                                    <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">
                                        <p className="text-xs font-bold text-green-700 uppercase mb-2">Active Subscription</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Start Date</span>
                                                <span className="font-semibold">{formatDate(startDate.toISOString())}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">End Date</span>
                                                <span className="font-semibold">{formatDate(expiryDate.toISOString())}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Base Price</span>
                                                <span className="font-semibold">
                                                    ${subscription?.current_price?.pay_per_patient_amount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Remaining</span>
                                                <span className="font-semibold text-green-600">{remainingDays} days</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {subscription?.pending_payment_type === 'PAY_PER_PATIENT' && (
                                    <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                                        <p className="text-xs font-bold text-yellow-700 uppercase mb-2">Scheduled Subscription</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Starts</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    {pendingStartDate ? formatDate(pendingStartDate.toISOString()) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Ends</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    {pendingExpiryDate ? formatDate(pendingExpiryDate.toISOString()) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Upcoming Price</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price?.pay_per_patient_amount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Plan will active in</span>
                                                <span className="font-semibold text-green-600">{remainingDays} days</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PAY PER MONTH CARD */}
                            <div
                                onClick={() => {
                                    setSelectedPaymentType('PAY_PER_MONTH');
                                    setCouponCodeInput('');
                                    setValidatedCoupon(null);
                                    setCouponValidationError('');
                                }}
                                className={`cursor-pointer border rounded-2xl p-5 text-left transition-all ${isSelected('PAY_PER_MONTH')
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100'
                                    : 'border-gray-200 bg-white hover:border-orange-300'
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

                                <h3 className="text-lg font-semibold">Pay Per Patient + Monthly Add on</h3>
                                <p className="text-sm text-gray-500">Patient billing with additional monthly subscription fee</p>

                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Per Patient Fee</span>
                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_patient_amount || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Monthly Add on</span>
                                        <span className="text-lg font-semibold text-[#1a2b3c]">
                                            ${paymentSettings?.pay_per_month_amount || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Active Coupons for Monthly Add-on */}
                                {practiceActiveCoupons.payPerMonth.length > 0 && (
                                    <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200">
                                        <p className="text-xs font-bold text-purple-700 uppercase mb-2">Active Coupons for this plan</p>
                                        <div className="space-y-2">
                                            {practiceActiveCoupons.payPerMonth.map((coupon, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        {getCouponIcon(coupon.discount_type)}
                                                        <div>
                                                            <p className="text-sm font-semibold text-purple-800">{coupon.code}</p>
                                                            <p className="text-xs text-purple-600">{getCouponLabel(coupon)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveCoupon(coupon, 'pay_per_month');
                                                        }}
                                                        disabled={isRemovingCoupon}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                                                    >
                                                        <X size={12} />
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isActivated('PAY_PER_MONTH') && !hasPendingChange('PAY_PER_MONTH') && (
                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Start Date</span>
                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {formatDate(futureStartDate.toISOString())}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">End Date</span>
                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {formatDate(futureEndDate.toISOString())}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Remaining Days</span>
                                            <span className="text-sm font-semibold text-green-600">30 Days</span>
                                        </div>
                                    </div>
                                )}

                                {subscription?.current_payment_type === 'PAY_PER_MONTH' && (
                                    <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">
                                        <p className="text-xs font-bold text-green-700 uppercase mb-2">Active Subscription</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Start Date</span>
                                                <span className="font-semibold">{formatDate(startDate.toISOString())}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">End Date</span>
                                                <span className="font-semibold">{formatDate(expiryDate.toISOString())}</span>
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
                                                <span className="font-semibold text-green-600">{remainingDays} days</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {subscription?.pending_payment_type === 'PAY_PER_MONTH' && (
                                    <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                                        <p className="text-xs font-bold text-yellow-700 uppercase mb-2">Scheduled Subscription</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Starts</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    {pendingStartDate ? formatDate(pendingStartDate.toISOString()) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Ends</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    {pendingExpiryDate ? formatDate(pendingExpiryDate.toISOString()) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Patient Amount</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price?.pay_per_patient_amount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Monthly Add on</span>
                                                <span className="font-semibold text-[#1a2b3c]">
                                                    ${subscription?.pending_price?.pay_per_month_amount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Plan will active in</span>
                                                <span className="font-semibold text-green-600">{remainingDays} days</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Coupon Application Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <Gift className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Apply New Coupon
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Coupon will be applied to <span className="font-semibold text-orange-600">{selectedPlanName}</span> plan
                                </p>
                            </div>
                        </div>

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
                                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                disabled={isValidatingCoupon || !!validatedCoupon}
                            />
                            <button
                                onClick={handleValidateCoupon}
                                disabled={!couponCodeInput.trim() || isValidatingCoupon || !!validatedCoupon}
                                className="px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
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
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getCouponIcon(validatedCoupon.discount_type)}
                                        <span className="font-bold text-green-800 text-lg">
                                            {validatedCoupon.code}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-700 text-xs font-semibold">
                                            VALID
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-green-700 font-medium">
                                    {getCouponLabel(validatedCoupon)}
                                </p>
                                {validatedCoupon.duration_months && (
                                    <p className="text-xs text-green-600 mt-1">
                                        Duration: {validatedCoupon.duration_months} months from start
                                    </p>
                                )}
                                {validatedCoupon.description && (
                                    <p className="text-xs text-green-500 mt-1">
                                        {validatedCoupon.description}
                                    </p>
                                )}
                                <p className="text-xs text-green-600 mt-2">
                                    This coupon will be applied when you click Save
                                </p>
                            </div>
                        )}
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
                        disabled={savingSubscription}
                        className={`px-6 py-3 rounded-full font-bold text-white transition-all flex items-center gap-2 ${savingSubscription
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#1a2b3c] hover:bg-[#2d4258]'
                            }`}
                    >
                        {savingSubscription && <Loader2 className="w-4 h-4 animate-spin" />}
                        {savingSubscription ? 'Saving...' : 'Save Subscription'}
                    </button>
                </div>

            </div>
        </div>
    );
}