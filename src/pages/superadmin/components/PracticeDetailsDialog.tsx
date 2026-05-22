/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    Loader2,
    X,
    CalendarDays,
    Clock3,
    CreditCard
} from 'lucide-react';

import {
    GET_PRACTICE_SUBSCRIPTION,
    UPDATE_PRACTICE_SUBSCRIPTION,
    CREATE_PRACTICE_SUBSCRIPTION,
    GET_PAYMENT_SETTINGS
} from '../graphql/clients.query';

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

    useEffect(() => {

        if (!subscription) {

            setSelectedPaymentType(
                'PAY_PER_PATIENT'
            );

            return;
        }

        setSelectedPaymentType(
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

        expiry.setDate(expiry.getDate() + 30);

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

        const now = new Date().getTime();

        const expiry = new Date(expiryDate).getTime();

        const diff = expiry - now;

        return Math.max(
            0,
            Math.ceil(diff / (1000 * 60 * 60 * 24))
        );

    }, [expiryDate]);

    const isSelected = (type: PaymentType) =>
        selectedPaymentType === type;

    const isActivated = (type: PaymentType) =>
        subscription?.current_payment_type === type;

    const hasPendingChange = (type: PaymentType) =>
        subscription?.pending_payment_type === type;

    const latestPrice =
        selectedPaymentType === 'PAY_PER_MONTH'
            ? paymentSettings?.pay_per_month_amount || 0
            : paymentSettings?.pay_per_patient_amount || 0;

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

                await createPracticeSubscription({

                    variables: {

                        object: {

                            practice_id: client?.id,

                            current_payment_type:
                                selectedPaymentType,

                            pending_payment_type: null,

                            current_price: latestPrice,

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
                            latestPrice,

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
                            latestPrice,

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* PAY PER PATIENT */}

                            <button
                                onClick={() =>
                                    setSelectedPaymentType(
                                        'PAY_PER_PATIENT'
                                    )
                                }
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

                            {/* PAY PER MONTH */}

                            <button
                                onClick={() =>
                                    setSelectedPaymentType(
                                        'PAY_PER_MONTH'
                                    )
                                }
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

                    </div>

                </div>

                {/* Footer */}

                <div className="p-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white rounded-b-[24px]">

                    <button
                        onClick={handleSaveSubscription}
                        disabled={savingSubscription}
                        className={`px-6 py-3 rounded-full font-bold text-white transition-all flex items-center gap-2 ${savingSubscription
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#1a2b3c] hover:bg-[#2d4258]'
                            }`}
                    >

                        {savingSubscription && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}

                        {savingSubscription
                            ? 'Updating...'
                            : 'Save Subscription'}

                    </button>

                </div>

            </div>

        </div>
    );
}