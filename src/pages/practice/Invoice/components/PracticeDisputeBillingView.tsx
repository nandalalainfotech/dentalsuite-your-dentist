import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Download,
    Loader2,
    Receipt
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { NewPatientBooking } from '../../../../features/practice_invoice_history/invoiceHistory.type';
import { useNewPatientBookings } from '../../../../features/practice_invoice_history/useNewPatientBookings';
import { useAppSelector } from '../../../../store';

// ─── Interfaces ──────────────────────────────────────────
interface BreakdownItem {
    label: string;
    count: number;
    amount: number;
    type: 'success' | 'info' | 'error' | 'neutral';
}

interface ProductEntry {
    id: string;
    date: string;
    patientName: string;
    outcome: 'Charged' | 'Not charged' | 'Refund';
    type: 'New patient' | 'Cancelled' | 'Dispute' | 'Credit (Dispute Approved)';
    disputeStatus?: string;
    amount?: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    paymentDate: string;
    patientName: string;
    services: string[];
    total: number;
    subTotal: number;
    gst: number;
    status: 'completed' | 'cancelled' | 'pending' | 'in_progress';
    breakdown: BreakdownItem[];
    productDetails: ProductEntry[];
    disputeTotal?: number;
}

type SortField = 'invoiceDate' | 'total' | 'invoiceNumber' | 'patientName';
type SortDirection = 'asc' | 'desc';

// ─── Helper Functions ─────────────────────────────────────
const formatCurrency = (amount: number) =>
    amount < 0
        ? `-$${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
        : `$${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const formatDate = (dateStr: string) => {
    if (dateStr === 'Pending' || dateStr === 'Voided') return dateStr;
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: '2-digit' });
};

const getOrdinalSuffix = (i: number) => {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
};

const exportAllInvoicesToCSV = (invoices: Invoice[]) => {
    const headers = ['Invoice Number', 'Invoice Date', 'Subtotal', 'Total Amount'];
    const rows = invoices.map(inv => [
        inv.invoiceNumber,
        inv.invoiceDate,
        `$${inv.subTotal.toFixed(2)}`,
        `$${inv.total.toFixed(2)}`,
        // inv.status
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "billing_history_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const convertBookingsToInvoices = (
    completedBookings: NewPatientBooking[],
    cancelledBookings: NewPatientBooking[],
    dispute: NewPatientBooking[],
    approvedDisputeBookings: NewPatientBooking[],
    billingDay: number,
    practiceName: string
): Invoice[] => {

    const NEW_PATIENT_RATE = 10.00;
    const GST_RATE = 0.10;

    // All bookings that will appear in current month's productDetails
    const allBookings = [
        ...completedBookings.map(b => ({
            ...b,
            outcome: 'Charged' as const,
            displayType: 'New patient' as const
        })),

        ...dispute.map(b => ({
            ...b,
            outcome: 'Charged' as const,
            displayType: 'Dispute' as const
        })),

        ...cancelledBookings.map(b => ({
            ...b,
            outcome: 'Not charged' as const,
            displayType: 'Cancelled' as const
        })),
    ];

    // Group bookings by month (based on appointment date)
    const bookingsByMonth = new Map<string, any[]>();

    allBookings.forEach(booking => {
        const date = new Date(booking.appointment_date);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!bookingsByMonth.has(monthKey)) {
            bookingsByMonth.set(monthKey, []);
        }
        bookingsByMonth.get(monthKey)!.push(booking);
    });

    // NEW LOGIC: Group approved disputes by UPDATED_AT date (when superadmin approved)
    const approvedDisputesByApprovalMonth = new Map<string, NewPatientBooking[]>();

    approvedDisputeBookings.forEach(booking => {
        // Use updated_at date when superadmin approved the dispute
        const approvalDate = booking.updated_at || booking.appointment_date;
        const date = new Date(approvalDate);

        if (isNaN(date.getTime())) return;

        // Group by the month when approval happened
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!approvedDisputesByApprovalMonth.has(monthKey)) {
            approvedDisputesByApprovalMonth.set(monthKey, []);
        }
        approvedDisputesByApprovalMonth.get(monthKey)!.push(booking);
    });

    const invoices: Invoice[] = [];
    const sortedMonths = Array.from(bookingsByMonth.keys()).sort();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    sortedMonths.forEach((monthKey, index) => {
        const [year, month] = monthKey.split('-').map(Number);
        const monthBookings = bookingsByMonth.get(monthKey) || [];

        // Get approved disputes that were approved in THIS current month (based on updated_at)
        const currentMonthKey = `${year}-${month}`;
        const creditsForCurrentMonth = approvedDisputesByApprovalMonth.get(currentMonthKey) || [];

        // Credit entries based on when approval happened (using updated_at)
        const creditEntries = creditsForCurrentMonth.map(dispute => ({
            id: `credit-${dispute.id}`,
            date: dispute.updated_at || dispute.appointment_date, // Show approval date
            patientName: dispute.patient_name,
            outcome: 'Refund' as const,
            type: 'Credit (Dispute Approved)' as const,
            disputeStatus: dispute.dispute_status,
            amount: -NEW_PATIENT_RATE,
            originalAppointmentDate: dispute.appointment_date, // Keep for reference
            approvedOn: dispute.updated_at // Track when it was approved
        }));

        // Product entries
        const allProductEntries = [
            ...monthBookings.map(b => ({
                id: b.id.toString(),
                date: b.appointment_date,
                patientName: b.patient_name,
                outcome: b.outcome,
                type: b.displayType,
                disputeStatus: b.dispute_status,
                amount: b.outcome === 'Charged' ? NEW_PATIENT_RATE : 0
            })),
            ...creditEntries
        ];

        // Counts
        const chargedCount = monthBookings.filter(b => b.outcome === 'Charged').length;
        const disputeCount = monthBookings.filter(b => b.displayType === 'Dispute').length;
        const cancelledCount = monthBookings.filter(b => b.outcome === 'Not charged' && b.displayType !== 'Dispute').length;

        // Totals
        const creditsAmount = creditEntries.length * NEW_PATIENT_RATE;
        const grossTotal = chargedCount * NEW_PATIENT_RATE;
        const netTotal = Math.max(0, grossTotal - creditsAmount);
        const gstAmount = Number((netTotal * GST_RATE).toFixed(2));
        const finalTotal = Number((netTotal + gstAmount).toFixed(2));

        // Invoice date
        let invYear = year;
        let invMonth = month + 1;
        if (invMonth > 11) {
            invMonth = 0;
            invYear = year + 1;
        }

        const invoiceDate = new Date(invYear, invMonth, billingDay);

        invoices.push({
            id: `inv-${monthKey}`,
            invoiceNumber: `INV-${year}${monthNames[month].toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
            invoiceDate: invoiceDate.toISOString().split('T')[0],
            paymentDate: 'Pending',
            patientName: practiceName,
            services: ['Patient Connect', 'Bookings'],
            subTotal: netTotal,
            gst: gstAmount,
            total: finalTotal,
            disputeTotal: disputeCount * NEW_PATIENT_RATE,
            status: invoiceDate > new Date() ? 'pending' : 'completed',
            breakdown: [
                {
                    label: 'Total appointments',
                    count: monthBookings.length,
                    amount: monthBookings.length * NEW_PATIENT_RATE,
                    type: 'neutral'
                },
                {
                    label: 'Cancellations',
                    count: cancelledCount,
                    amount: -(cancelledCount * NEW_PATIENT_RATE),
                    type: 'error'
                },
                {
                    label: 'Credits for Patient Connect (approved disputes)',
                    count: -creditEntries.length,
                    amount: -creditsAmount,
                    type: 'success'
                },
                {
                    label: 'Total',
                    count: 0,
                    amount: netTotal,
                    type: 'neutral'
                },
                {
                    label: 'GST (10%)',
                    count: 0,
                    amount: gstAmount,
                    type: 'neutral'
                },
            ],
            productDetails: allProductEntries
        });
    });

    return invoices.sort((a, b) =>
        new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    );
};

// ─── Component: Billing Date Dropdown ─────────────────────
const BillingDateDropdown: React.FC<{
    value: number;
    onChange: (day: number) => void;
}> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-56 px-3 py-2.5 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg shadow-sm hover:border-gray-300 transition-colors"
            >
                <span className="font-medium">{getOrdinalSuffix(value)} of each month</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <button
                            key={day}
                            onClick={() => { onChange(day); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 ${value === day ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'}`}
                        >
                            {getOrdinalSuffix(day)} of each month
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};



const ProductBreakdownSection: React.FC<{
    details: ProductEntry[];
    total: number;
}> = ({ details, total }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchField, setSearchField] = useState<'patientName' | 'outcome' | 'type' | 'disputeStatus'>('patientName');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredDetails = details.filter(item => {
        if (searchField === 'disputeStatus') {
            return (item.disputeStatus || '').toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (searchField === 'patientName') {
            return item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (searchField === 'outcome') {
            return item.outcome.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (searchField === 'type') {
            return item.type.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
    const paginatedDetails = filteredDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getDisputeStatusBadge = (status?: string) => {
        if (!status) return null;
        switch (status) {
            case 'approve':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approved</span>;
            case 'pending':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>;
            case 'rejected':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejected</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-lg text-gray-900 mb-4 font-medium">Product breakdown</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsOpen(!isOpen)}>
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
                                <select
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value as any)}
                                    className="bg-gray-50 px-3 py-2 text-sm border-r border-gray-200 outline-none"
                                >
                                    <option value="patientName">Name</option>
                                    <option value="outcome">Outcome</option>
                                    <option value="type">Type</option>
                                    <option value="disputeStatus">Dispute Status</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search..."
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
                                        {/* <th className="text-left px-6 py-4 font-semibold text-gray-600">Type</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Dispute Status</th> */}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {paginatedDetails.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{item.patientName}</td>
                                            <td className="px-6 py-4">
                                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.outcome === 'Charged' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.outcome}
                                                </span> */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.outcome === 'Charged' ? 'bg-green-100 text-green-700' :
                                                    item.outcome === 'Refund' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {item.outcome}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-1.5 rounded-full ${item.type === 'Cancelled' ? 'bg-red-500' :
                                                        item.type === 'Dispute' ? 'bg-orange-500' :
                                                            item.type === 'Credit (Dispute Approved)' ? 'bg-blue-500' : 'bg-emerald-500'
                                                        }`} />
                                                    <span className="font-medium">{item.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getDisputeStatusBadge(item.disputeStatus)}
                                            </td> */}
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

// ─── Component: Invoice Detail View ───────────────────────
const InvoiceDetailView: React.FC<{ invoice: Invoice; onBack: () => void; practiceName: string }> = ({ invoice, onBack, practiceName }) => {
    const allProductEntries = invoice.productDetails;

    return (
        <div className="pb-20 mt-10">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-8 font-medium">
                <ArrowLeft size={20} /> Back to billing history
            </button>
            <h2 className="text-2xl text-gray-900 mb-10">
                Invoice number <span className="font-semibold text-orange-500">{invoice.invoiceNumber}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                <div className="space-y-8">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 text-xs text-gray-500 leading-relaxed">
                        Billing information displayed here is only for {practiceName}.
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-y-6 text-sm">
                        <div className="text-gray-500 font-medium">Invoice date</div>
                        <div className="text-gray-900 font-semibold">{formatDate(invoice.invoiceDate)}</div>
                        <div className="text-gray-500 font-medium">Practice name</div>
                        <div className="text-gray-900 font-semibold">{practiceName}</div>
                        {/* <div className="text-gray-500 font-medium pt-2">Sub-Total</div>
                        <div className="text-gray-900 font-bold text-lg pt-2">{formatCurrency(invoice.subTotal)}</div> */}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg text-gray-900 mb-2 font-medium">Patient Connect bookings summary
                        {/* <span className="text-xs">(new Patients)</span> */}
                    </h3>
                    <div className="bg-white">
                        {invoice.breakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 text-sm">
                                <span className="text-gray-600 font-medium">{item.label}</span>
                                <div className="flex gap-12">
                                    {/* <span className="w-8 text-right">{item.count}</span> */}
                                    <span>
                                        {item.label === 'GST (10%)' || item.label === 'Total'
                                            ? ''
                                            : item.count}
                                    </span>
                                    <span className={`w-24 text-right font-medium ${item.amount < 0 ? 'text-blue-500' : item.amount > 0 ? 'text-emerald-600' : ''}`}>
                                        {formatCurrency(item.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between py-5 border-t border-gray-200 mt-2">
                            <span className="text-sm font-bold text-gray-600">Total new patients charged</span>
                            <div className="flex gap-12">
                                {/* <span className="text-sm font-bold w-8 text-right">{invoice.breakdown[0].count}</span> */}
                                <span className="text-lg font-bold text-emerald-600 w-24 text-right">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Show ALL product entries including disputes */}
            <ProductBreakdownSection details={allProductEntries} total={invoice.subTotal} />
        </div>
    );
};
// ─── MAIN COMPONENT ───────────────────────────────────────
export default function PracticeDisputeBillingView() {
    const { user } = useAppSelector((state: any) => state.auth);
    const practiceId = user?.practiceId || user?.practice_id || user?.id;
    const { completedBookings, approvedDisputeBookings, cancelledBookings, dispute, loading, error } = useNewPatientBookings(practiceId, true);

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [billingDay, setBillingDay] = useState<number>(1);
    const [sortField, setSortField] = useState<SortField>('invoiceDate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');


    useEffect(() => {
        if (!loading) {
            const allInvoices = convertBookingsToInvoices(
                completedBookings,
                cancelledBookings,
                dispute,
                approvedDisputeBookings,
                billingDay,
                user?.practiceName || 'My Practice'
            );

            // Filter out current month's invoice
            const filteredInvoices = allInvoices.filter(inv => !isCurrentMonth(inv.invoiceDate));

            setInvoices(filteredInvoices);
        }
    }, [completedBookings, cancelledBookings, dispute, approvedDisputeBookings, loading, billingDay, user]);


    useEffect(() => {
        if (!loading) {
            setInvoices(convertBookingsToInvoices(
                completedBookings,
                cancelledBookings,
                dispute,
                approvedDisputeBookings,
                billingDay,
                user?.practiceName || 'My Practice'
            ));
        }
    }, [completedBookings, cancelledBookings, dispute, approvedDisputeBookings, loading, billingDay, user]);

    const isCurrentMonth = (invoiceDate: string): boolean => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const invoiceDateObj = new Date(invoiceDate);
        const invoiceYear = invoiceDateObj.getFullYear();
        const invoiceMonth = invoiceDateObj.getMonth();

        return invoiceYear === currentYear && invoiceMonth === currentMonth;
    };

    const sortedInvoices = useMemo(() => {
        // First filter out current month invoices
        const filteredInvoices = invoices.filter(inv => !isCurrentMonth(inv.invoiceDate));

        return [...filteredInvoices].sort((a, b) => {
            let comp = 0;
            if (sortField === 'invoiceDate') comp = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
            else if (sortField === 'total') comp = a.total - b.total;
            else comp = a[sortField].toString().localeCompare(b[sortField].toString());
            return sortDirection === 'asc' ? comp : -comp;
        });
    }, [invoices, sortField, sortDirection]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={32} /></div>;

    if (selectedInvoice) return <InvoiceDetailView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} practiceName={user?.practiceName || 'My Practice'} />;

    return (
        <div className="space-y-6 mt-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600"><Receipt size={18} /></div>
                        Invoice History
                    </h2>
                    <p className="text-sm text-gray-400 mt-1 ml-[46px]">View and manage all your invoices</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <button
                        onClick={() => exportAllInvoicesToCSV(invoices)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 shadow-sm"
                    >
                        <Download size={16} /> Export All (CSV)
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sortedInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-orange-50 transition-colors">
                                <td className="px-5 py-4 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                                <td className="px-5 py-4 text-gray-600">{formatDate(inv.invoiceDate)}</td>
                                <td className="px-5 py-4 text-right">
                                    <button onClick={() => setSelectedInvoice(inv)} className="px-4 py-2 border border-gray-200 text-orange-600 font-medium rounded-lg text-sm hover:bg-orange-500 hover:text-white transition-all">View charges <ChevronRight size={16} className="inline" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}