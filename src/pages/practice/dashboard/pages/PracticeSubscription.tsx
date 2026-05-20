/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import {
    CreditCard,
    CalendarDays,
    Clock3,
    Loader2
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../store';

import {
    fetchPracticeSubscription,
    savePracticeSubscription
} from '../../../../features/subscription/subscription.slice';

import toast from 'react-hot-toast';

type PaymentType =
    | 'PAY_PER_PATIENT'
    | 'PAY_PER_MONTH';

export default function PracticeSubscription() {

    const dispatch = useAppDispatch();

    const { user } = useAppSelector(
        (state: any) => state.auth
    );

    const {
        subscription,
        loading,
        saving
    } = useAppSelector(
        (state: any) => state.subscription
    );

    const isSuperAdminView =
        user?.type === 'SUPER_ADMIN_VIEW' ||
        user?.user?.type === 'SUPER_ADMIN_VIEW';

    const practiceId = user?.id;

    if (!isSuperAdminView) {
        return (
            <Navigate
                to="/practice/dashboard/view-profile"
                replace
            />
        );
    }

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
        EXPIRY
    ========================================= */

    const expiryDate = useMemo(() => {

        if (subscription?.subscription_end_date) {
            return new Date(subscription.subscription_end_date);
        }

        const now = new Date();
        const expiry = new Date();
        expiry.setDate(now.getDate() + 30);

        return expiry;

    }, [subscription]);

    /* =========================================
        REMAINING DAYS
    ========================================= */

    const remainingDays = useMemo(() => {

        const now = new Date().getTime();
        const expiry = new Date(expiryDate).getTime();

        const diff = expiry - now;

        return Math.max(
            0,
            Math.ceil(diff / (1000 * 60 * 60 * 24))
        );

    }, [expiryDate]);

    /* =========================================
        SAVE
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
        HELPERS
    ========================================= */

    const isSelected = (type: PaymentType) =>
        selectedPaymentType === type;

    const isActivated = (type: PaymentType) =>
        subscription?.current_payment_type === type;

    const hasPendingChange = (
        type: PaymentType
    ) =>
        subscription?.pending_payment_type === type;

    const showActivatedTag = (
        type: PaymentType
    ) => {

        return isActivated(type);
    };

    const showScheduledTag = (
        type: PaymentType
    ) => {

        return hasPendingChange(type);
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
                        <p className="text-sm text-gray-500">
                            Loading subscription...
                        </p>
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

                                <h3 className="text-lg font-semibold">
                                    Pay Per Patient
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Billing based on patients
                                </p>

                                {isSelected('PAY_PER_PATIENT') && (
                                    <div className="mt-4 space-y-2">

                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays className="w-4 h-4 text-orange-500" />
                                            <span>
                                                Expiry: {expiryDate?.toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <Clock3 className="w-4 h-4" />
                                            <span>{remainingDays} days remaining</span>
                                        </div>

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

                                <h3 className="text-lg font-semibold">
                                    Pay Per Month
                                </h3>

                                <p className="text-sm text-gray-500">
                                    30 days subscription
                                </p>

                                {isSelected('PAY_PER_MONTH') && (
                                    <div className="mt-4 space-y-2">

                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays className="w-4 h-4 text-blue-500" />
                                            <span>
                                                Expiry: {expiryDate?.toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-orange-600">
                                            <Clock3 className="w-4 h-4" />
                                            <span>{remainingDays} days remaining</span>
                                        </div>

                                    </div>
                                )}

                            </button>

                        </div>

                        {/* SAVE */}
                        <div className="mt-6 flex justify-end">

                            <button
                                onClick={handleSaveSubscription}
                                disabled={saving}
                                className={`px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 ${saving
                                    ? 'bg-orange-300 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600'
                                    }`}
                            >
                                {saving && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {saving ? 'Saving...' : 'Save Subscription'}
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}