import { ChevronDown, ChevronUp, Info, Loader2, Receipt } from 'lucide-react';
import React, { useState } from 'react';
import { useNewPatientBookings } from '../../../../features/practice_invoice_history/useNewPatientBookings';
import { useAppSelector } from '../../../../store';

// Helper functions
const formatCurrency = (amount: number) =>
    amount < 0
        ? `-$${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
        : `$${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

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

    const filteredDetails = details.filter(item =>
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
                                    {paginatedDetails.map((item) => (
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

    const practiceId = user?.practiceId || user?.practice_id || user?.id;
    const { completedBookings, approvedDisputeBookings, cancelledBookings, dispute, loading, error } = useNewPatientBookings(practiceId, true);

    const NEW_PATIENT_RATE = 10.00;
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
    const currentMonthApprovedDisputes = approvedDisputeBookings.filter((booking: { updated_at: string | number | Date; appointment_date: string | number | Date; }) => {
        // Use updated_at date when superadmin approved the dispute
        const approvalDate = booking.updated_at || booking.appointment_date;
        const date = new Date(approvalDate);
        return date >= currentMonthStart && date <= currentMonthEnd;
    });

    // Calculate current month metrics
    const chargedCount = currentMonthCompleted.length + currentMonthDispute.length;
    const cancelledCount = currentMonthCancelled.length;
    const creditsCount = currentMonthApprovedDisputes.length; // Now using current month approved disputes

    const grossTotal = chargedCount * NEW_PATIENT_RATE;
    const creditsAmount = creditsCount * NEW_PATIENT_RATE;
    const netTotal = Math.max(0, grossTotal - creditsAmount);
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
            amount: NEW_PATIENT_RATE
        })),
        ...currentMonthDispute.map((b: { id: { toString: () => any; }; appointment_date: any; patient_name: any; dispute_status: any; }) => ({
            id: b.id.toString(),
            date: b.appointment_date,
            patientName: b.patient_name,
            outcome: 'Charged' as const,
            type: 'Dispute' as const,
            disputeStatus: b.dispute_status,
            amount: NEW_PATIENT_RATE
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
            amount: -NEW_PATIENT_RATE,
            originalAppointmentDate: b.appointment_date // Keep for reference
        }))
    ];

    const breakdownItems = [
        {
            label: 'Total appointments',
            count: currentMonthCompleted.length + currentMonthDispute.length + currentMonthCancelled.length,
            amount: (currentMonthCompleted.length + currentMonthDispute.length + currentMonthCancelled.length) * NEW_PATIENT_RATE,
            type: 'neutral' as const
        },
        {
            label: 'Cancellations',
            count: cancelledCount,
            amount: -(cancelledCount * NEW_PATIENT_RATE),
            type: 'error' as const
        },
        {
            label: 'Credits for Patient Connect previous invoices',
            count: -creditsCount,
            amount: -creditsAmount,
            type: 'success' as const
        },
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
    const invoiceNumber = `CUR-${now.getFullYear()}${now.toLocaleString('default', { month: 'short' }).toUpperCase()}-001`;

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
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        <span className="text-sm text-green-700 font-semibold">
                            Billing Period: {currentMonthStart.toLocaleDateString('en-ZA')} - {currentMonthEnd.toLocaleDateString('en-ZA')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                <div className="space-y-8">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 text-xs text-gray-500 leading-relaxed">
                        Current month billing information for {practiceName}. This includes all appointments, cancellations, and credits from disputes approved in the current month.
                    </div>
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
                        {breakdownItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 text-sm">
                                <span className="text-gray-600 font-medium">{item.label}</span>
                                <div className="flex gap-12">
                                    <span>{item.label.includes('GST') || item.label.includes('Total (before GST)') ? '' : item.count}</span>
                                    <span className={`w-24 text-right font-medium ${item.amount < 0 ? 'text-red-500' : item.amount > 0 ? 'text-emerald-600' : ''}`}>
                                        {formatCurrency(item.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between py-5 border-t border-gray-200 mt-2">
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