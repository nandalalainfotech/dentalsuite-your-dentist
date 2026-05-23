import { ChevronDown, ChevronUp, Info, Loader2, Receipt, Tag } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useNewPatientBookings } from '../../../../features/practice_invoice_history/useNewPatientBookings';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { fetchPracticeSubscription } from '../../../../features/subscription/subscription.slice';
import { useQuery } from '@apollo/client/react';
import { localClient } from '../../../../api/apollo/localClient';
import { GET_PRACTICE_COUPONS } from '../../dashboard/graphql/subscription.query';

interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed' | 'free_months';
    discount_value: number | null;
    free_months: number | null;
    duration_months: number | null;
    practice_usage_json: Record<string, any>;
}

// Helper functions
const formatCurrency = (amount: number) => {
    const value = Number(amount || 0);

    const formatted = value
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return value < 0
        ? `-$${formatted.replace('-', '')}`
        : `$${formatted}`;
};

const formatDate = (dateStr: string) => {
    if (dateStr === 'Pending' || dateStr === 'Voided') return dateStr;
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
    });
};

const ProductBreakdownSection: React.FC<{
    details: any[];
    total: number;
}> = ({ details, total }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredDetails = details.filter((item: { patientName: string }) =>
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
    const paginatedDetails = filteredDetails.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="mt-12">
            <h3 className="text-lg text-gray-900 mb-4 font-medium">Product breakdown</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div
                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="font-semibold text-gray-800">Patient Connect - Bookings</span>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            {isOpen ? 'Close' : 'Open'} {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                        <span className="font-bold text-gray-900 text-lg">{formatCurrency(total)}</span>
                    </div>
                </div>

                {isOpen && (
                    <div className="border-t border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 w-full md:w-96 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search by patient name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 text-sm outline-none"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Name of patient</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedDetails.map((item: { id: string; date: string; patientName: string; outcome: string }) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{item.patientName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.outcome === 'Charged' ? 'bg-green-100 text-green-700' :
                                                    item.outcome === 'Refund' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.outcome}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CurrentMonthBillingView: React.FC<{ practiceName: string }> = ({ practiceName }) => {
    const { user } = useAppSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();

    const {
        subscription
    } = useAppSelector(
        (state: any) => state.subscription
    );

    const practiceId = user?.practiceId || user?.practice_id || user?.id;

    React.useEffect(() => {

        if (!practiceId) return;

        dispatch(
            fetchPracticeSubscription(practiceId)
        );

    }, [dispatch, practiceId]);

    const { completedBookings, approvedDisputeBookings, cancelledBookings, dispute, loading } = useNewPatientBookings(practiceId, true);

    // =========================
    // FETCH ALL COUPONS
    // =========================
    const { data: couponsData } = useQuery<{ coupons: Coupon[] }>(GET_PRACTICE_COUPONS, {
        client: localClient,
        fetchPolicy: 'network-only',
    });

    const allCoupons = couponsData?.coupons || [];

    // =========================
    // FIND ACTIVE COUPON FOR THIS PRACTICE
    // =========================

    const activeCoupon = useMemo(() => {
        if (!allCoupons.length || !practiceId) return null;

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        for (const coupon of allCoupons) {
            const practiceData = coupon.practice_usage_json?.[practiceId];
            if (!practiceData) continue;

            // IMPORTANT: Check if current month is in the periods array
            // This is the primary check for month-based coupon activation
            const periods = practiceData.periods || [];
            if (!periods.includes(currentMonthKey)) {
                continue; // Coupon not active for this month
            }

            // Optional: Check expiry date (if exists)
            if (practiceData.expiresAt) {
                const expiresAt = new Date(practiceData.expiresAt);
                if (expiresAt < now) {
                    continue; // Coupon expired
                }
            }

            // Valid coupon for current month!
            return {
                ...coupon,
                appliedAt: practiceData.appliedAt,
                expiresAt: practiceData.expiresAt,
                periods: periods,
            };
        }

        return null;
    }, [allCoupons, practiceId]);

    const GST_RATE = 0.10;

    // Get current month's start and end dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Filter bookings for current month only (based on appointment date)
    const currentMonthCompleted = completedBookings.filter((booking: { appointment_date: string | number | Date; }) => {
        const date = new Date(booking.appointment_date);
        return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const currentMonthDispute = dispute.filter((booking: { appointment_date: string | number | Date; }) => {
        const date = new Date(booking.appointment_date);
        return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const currentMonthCancelled = cancelledBookings.filter((booking: { appointment_date: string | number | Date; }) => {
        const date = new Date(booking.appointment_date);
        return date >= currentMonthStart && date <= currentMonthEnd;
    });

    // NEW LOGIC: Get approved disputes that were approved in CURRENT month (based on updated_at)
    // const currentMonthApprovedDisputes = approvedDisputeBookings.filter((booking: { updated_at: string | number | Date; appointment_date: string | number | Date; }) => {
    //     // Use updated_at date when superadmin approved the dispute
    //     const approvalDate = booking.updated_at || booking.appointment_date;
    //     const date = new Date(approvalDate);
    //     return date >= currentMonthStart && date <= currentMonthEnd;
    // });

    // NEW LOGIC: Get approved disputes that were approved in CURRENT month (based on updated_at)
    // EXCEPT: If appointment date is ALSO in current month, defer to next month
    const currentMonthApprovedDisputes = approvedDisputeBookings.filter((booking: {
        updated_at: string | number | Date;
        appointment_date: string | number | Date;
    }) => {
        // Use updated_at date when superadmin approved the dispute
        const approvalDate = booking.updated_at || booking.appointment_date;
        const approvalDateObj = new Date(approvalDate);
        const appointmentDateObj = new Date(booking.appointment_date);

        // Check if approval happened in current month
        const isApprovedInCurrentMonth = approvalDateObj >= currentMonthStart && approvalDateObj <= currentMonthEnd;

        if (!isApprovedInCurrentMonth) return false;

        // Check if appointment date is ALSO in current month
        const isAppointmentInCurrentMonth = appointmentDateObj >= currentMonthStart && appointmentDateObj <= currentMonthEnd;

        // If appointment is in current month AND approved in current month -> defer to next month (exclude from current)
        // If appointment is from previous months (Feb, Mar, Apr) -> include in current month
        return !isAppointmentInCurrentMonth;
    });

    // Track deferred credits (appointment in current month, approved in current month)
    const deferredToNextMonthDisputes = approvedDisputeBookings.filter((booking: {
        updated_at: string | number | Date;
        appointment_date: string | number | Date;
    }) => {
        const approvalDate = booking.updated_at || booking.appointment_date;
        const approvalDateObj = new Date(approvalDate);
        const appointmentDateObj = new Date(booking.appointment_date);

        const isApprovedInCurrentMonth = approvalDateObj >= currentMonthStart && approvalDateObj <= currentMonthEnd;
        const isAppointmentInCurrentMonth = appointmentDateObj >= currentMonthStart && appointmentDateObj <= currentMonthEnd;

        return isApprovedInCurrentMonth && isAppointmentInCurrentMonth;
    });

    const deferredCreditsCount = deferredToNextMonthDisputes.length;
    // const deferredCreditsAmount = deferredCreditsCount * patientRate;

    // ========================================
    // BILLING COUNTS
    // ========================================

    const chargedCount =
        currentMonthCompleted.length +
        currentMonthDispute.length;

    const cancelledCount =
        currentMonthCancelled.length;

    const creditsCount =
        currentMonthApprovedDisputes.length;

    // ========================================
    // SUBSCRIPTION
    // ========================================

    const currentPaymentType =
        subscription?.current_payment_type;

    const currentPrice =
        Number(subscription?.current_price || 0);

    // ========================================
    // PATIENT RATE
    // ========================================
    const patientRate = currentPaymentType === 'PAY_PER_PATIENT' ? currentPrice : 90;

    // ========================================
    // TOTALS (BEFORE COUPON)
    // ========================================

    const patientCharges = chargedCount * patientRate;
    const creditsAmount = creditsCount * patientRate;
    const patientNetTotal = Math.max(0, patientCharges - creditsAmount);
    // const netTotalBeforeCoupon = Math.max(0, grossTotal - creditsAmount);
    const netTotalBeforeCoupon = patientNetTotal;
    // const netTotalBeforeCoupon = currentPaymentType === 'PAY_PER_MONTH'
    //     ? currentPrice  // Fixed monthly fee
    //     : Math.max(0, patientCharges - creditsAmount);  // Per-patient calculation

    // ========================================
    // COUPON DISCOUNT CALCULATION
    // ========================================
    const { discountAmount, discountDescription } = useMemo(() => {
        if (!activeCoupon) {
            return { discountAmount: 0, discountDescription: '' };
        }

        // For PAY_PER_MONTH: discount applies to currentPrice (shown in badge)
        // For PAY_PER_PATIENT: discount applies to patient calculations (shown in breakdown)
        const discountBase = currentPaymentType === 'PAY_PER_MONTH'
            ? currentPrice
            : patientNetTotal;

        let discount = 0;
        let description = '';

        switch (activeCoupon.discount_type) {
            case 'percentage':
                discount = discountBase * ((activeCoupon.discount_value || 0) / 100);
                description = `${activeCoupon.discount_value}% off`;
                break;
            case 'fixed':
                discount = Math.min(discountBase, activeCoupon.discount_value || 0);
                description = `$${activeCoupon.discount_value} off`;
                break;
            case 'free_months':
                discount = discountBase;
                description = `${activeCoupon.free_months} months free`;
                break;
        }

        discount = Math.min(discount, discountBase);

        return {
            discountAmount: Number(discount.toFixed(2)),
            discountDescription: description
        };
    }, [activeCoupon, patientNetTotal, currentPaymentType, currentPrice]);

    // ========================================
    // FINAL TOTALS (AFTER COUPON)
    // ========================================
    const netTotal = currentPaymentType === 'PAY_PER_MONTH'
        ? patientNetTotal  // ← FIX: Always use patientNetTotal for breakdown
        : Number((patientNetTotal - discountAmount).toFixed(2));

    // Monthly subscription discounted price (only for badge)
    const monthlyDiscountedPrice = Number((currentPrice - discountAmount).toFixed(2));

    const gstAmount = Number((netTotal * GST_RATE).toFixed(2));
    const finalTotal = Number((netTotal + gstAmount).toFixed(2));

    // Create product entries for display
    const productEntries = [
        ...currentMonthCompleted.map((b: { id: { toString: () => any; }; appointment_date: any; patient_name: any; }) => ({
            id: b.id.toString(),
            date: b.appointment_date,
            patientName: b.patient_name,
            outcome: 'Charged' as const,
            type: 'New patient' as const,
            amount: patientRate
        })),
        ...currentMonthDispute.map((b: { id: { toString: () => any; }; appointment_date: any; patient_name: any; dispute_status: any; }) => ({
            id: b.id.toString(),
            date: b.appointment_date,
            patientName: b.patient_name,
            outcome: 'Charged' as const,
            type: 'Dispute' as const,
            disputeStatus: b.dispute_status,
            amount: patientRate
        })),
        ...currentMonthCancelled.map((b: { id: { toString: () => any; }; appointment_date: any; patient_name: any; }) => ({
            id: b.id.toString(),
            date: b.appointment_date,
            patientName: b.patient_name,
            outcome: 'Not charged' as const,
            type: 'Cancelled' as const,
            amount: 0
        })),
        // NEW LOGIC: Use updated_at date for credits (when approval happened)
        ...currentMonthApprovedDisputes.map((b: { id: any; updated_at: any; appointment_date: any; patient_name: any; }) => ({
            id: `credit-${b.id}`,
            date: b.updated_at || b.appointment_date, // Show approval date
            patientName: b.patient_name,
            outcome: 'Refund' as const,
            type: 'Credit (Dispute Approved)' as const,
            amount: -patientRate,
            originalAppointmentDate: b.appointment_date // Keep for reference
        }))
    ];

    const breakdownItems = [
        {
            label: 'Total appointments',
            count: currentMonthCompleted.length + currentMonthDispute.length + currentMonthCancelled.length,
            amount: (currentMonthCompleted.length + currentMonthDispute.length + currentMonthCancelled.length) * patientRate,
            type: 'neutral' as const
        },
        {
            label: 'Cancellations',
            count: cancelledCount,
            amount: -(cancelledCount * patientRate),
            type: 'error' as const
        },
        {
            label: 'Credits for Patient Connect previous invoices',
            count: -creditsCount,
            amount: -creditsAmount,
            type: 'success' as const
        },
        // Only show coupon line for PAY_PER_PATIENT
        ...(activeCoupon && currentPaymentType !== 'PAY_PER_MONTH' ? [{
            label: `Discount (${activeCoupon.code})`,
            count: 0,
            amount: -discountAmount,
            type: 'success' as const,
            isCoupon: true,
            originalAmount: patientNetTotal,
            discountedAmount: netTotal,
        }] : []),
        {
            label: 'Total (before GST)',
            count: 0,
            amount: netTotal,
            type: 'neutral' as const
        },
        {
            label: 'GST (10%)',
            count: 0,
            amount: gstAmount,
            type: 'neutral' as const
        }
    ];

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    return (
        <div className="pb-20 mt-10 px-4">
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                <Receipt size={18} />
                            </div>
                            Current Month Billing
                        </h2>
                        <p className="text-sm text-gray-400 mt-1 ml-[46px]">
                            {monthName} - Real-time billing summary (updated until {currentMonthEnd.toLocaleDateString('en-ZA')})
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Active Coupon Badge */}
                        {activeCoupon && (
                            <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-2">
                                <Tag size={14} className="text-purple-600" />
                                <div>
                                    <p className="text-xs text-purple-600 font-semibold">
                                        {activeCoupon.code} Active
                                    </p>
                                    <p className="text-[10px] text-purple-500">
                                        {discountDescription}
                                        {activeCoupon.expiresAt && (
                                            <> — Expires: {new Date(activeCoupon.expiresAt).toLocaleDateString('en-ZA', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: '2-digit'
                                            })}</>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                        {currentPaymentType === 'PAY_PER_MONTH' && (
                            <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-xs text-blue-600 font-semibold">Monthly Subscription</p>
                                {activeCoupon ? (
                                    <div>
                                        <p className="text-xs text-blue-400 line-through">
                                            Base Plan: {formatCurrency(currentPrice)}
                                        </p>
                                        <p className="text-sm text-blue-800 font-bold">
                                            {formatCurrency(monthlyDiscountedPrice)} <span className="text-[10px] text-purple-500">({discountDescription})</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-blue-800 font-bold">
                                        Base Plan: {formatCurrency(currentPrice)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        <span className="text-sm text-green-700 font-semibold">
                            Billing Period: {currentMonthStart.toLocaleDateString('en-ZA')} - {currentMonthEnd.toLocaleDateString('en-ZA')}
                        </span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 text-xs text-gray-500 leading-relaxed">
                        Current month billing information for {practiceName}. This includes all appointments, cancellations, and credits from disputes approved in the current month.
                    </div>

                    {/* Active Coupon Info */}
                    {activeCoupon && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Tag size={16} className="text-purple-600" />
                                <span className="text-sm font-semibold text-purple-800">
                                    Active Discount: {activeCoupon.code}
                                </span>
                            </div>
                            {/* <p className="text-xs text-purple-600">
                                {discountDescription}
                                {activeCoupon.description && ` — ${activeCoupon.description}`}
                            </p> */}
                            {activeCoupon.expiresAt && (
                                <p className="text-xs text-purple-500 mt-1">
                                    Expires: {new Date(activeCoupon.expiresAt).toLocaleDateString('en-ZA', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-[140px_1fr] gap-y-6 text-sm">
                        <div className="text-gray-500 font-medium">Practice name</div>
                        <div className="text-gray-900 font-semibold">{practiceName}</div>
                        <div className="text-gray-500 font-medium pt-2">Sub-Total</div>
                        <div className="text-gray-900 font-bold text-lg pt-2">{formatCurrency(netTotal)}</div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg text-gray-900 mb-2 font-medium">Current Month Summary</h3>
                    <div className="bg-white">
                        {breakdownItems.map((item: any, index) => (
                            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 text-sm">
                                <span className={`font-medium ${item.isCoupon ? 'text-purple-600' : 'text-gray-600'}`}>
                                    {item.label}
                                </span>
                                <div className="flex gap-12">
                                    <span>
                                        {item.label.includes('GST') || item.label.includes('Total (before GST)') || item.isCoupon ? '' : item.count}
                                    </span>
                                    {item.isCoupon ? (
                                        <div className="w-24 text-right">
                                            <span className="line-through text-gray-400 mr-1 text-xs">
                                                {formatCurrency(item.originalAmount)}
                                            </span>
                                            <span className="font-semibold text-purple-600">
                                                {formatCurrency(item.discountedAmount)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className={`w-24 text-right font-medium ${item.amount < 0 ? 'text-red-500' : item.amount > 0 ? 'text-emerald-600' : ''}`}>
                                            {formatCurrency(item.amount)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between py-5 border-t border-gray-400">
                            <span className="text-sm font-bold text-gray-600">Total (including GST)</span>
                            <div className="flex gap-12">
                                <span className="text-sm font-bold w-8 text-right"></span>
                                <span className="text-lg font-bold text-emerald-600 w-24 text-right">{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductBreakdownSection details={productEntries} total={netTotal} />

            {chargedCount === 0 && cancelledCount === 0 && creditsCount === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg mt-8">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No appointments or transactions for the current month.</p>
                    <p className="text-sm text-gray-400 mt-1">Next month's invoice will be generated after {currentMonthEnd.toLocaleDateString('en-ZA')}</p>
                </div>
            )}
        </div>
    );
};

export default CurrentMonthBillingView;