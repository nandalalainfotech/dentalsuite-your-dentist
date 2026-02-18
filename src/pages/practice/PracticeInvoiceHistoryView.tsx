import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowUpDown,
  ArrowLeft,
  Loader2,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';

// ─── Types ───────────────────────────────────────────────────
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
  outcome: 'Charged' | 'Not charged';
  type: 'New patient' | 'Cancelled' | 'Returning';
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
  status: 'completed' | 'cancelled' | 'pending' | 'in_progress';
  breakdown: BreakdownItem[];
  productDetails: ProductEntry[];
}

type SortField = 'invoiceDate' | 'total' | 'invoiceNumber' | 'patientName';
type SortDirection = 'asc' | 'desc';

// ─── Mock Data & Helpers ─────────────────────────────────────

const MOCK_NAMES = [
  "Sonam Kiba", "Stephen Cunningham", "Shreyash Guda", "Monika Juric",
  "David Miller", "Thabo Bester", "Sarah Connor", "James Howlett",
  "Wade Wilson", "Peter Parker", "Tony Stark", "Bruce Banner",
  "Natasha Romanoff", "Steve Rogers", "Clint Barton", "Wanda Maximoff"
];

const getRandomDate = (baseDate: string, daysBack: number) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split('T')[0];
};

const calculateInvoiceDate = (billingDay: number, monthOffset: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthOffset);
  const maxDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const actualDay = Math.min(billingDay, maxDays);
  date.setDate(actualDay);
  return date.toISOString().split('T')[0];
};

const calculatePaymentDate = (invoiceDateStr: string, daysAfter: number): string => {
  const date = new Date(invoiceDateStr);
  date.setDate(date.getDate() + daysAfter);
  return date.toISOString().split('T')[0];
};

const generateProductDetails = (
  invoiceId: string,
  baseDate: string,
  newPatientCount: number,
  cancellationCount: number
): ProductEntry[] => {
  const details: ProductEntry[] = [];
  let nameIndex = 0;

  for (let i = 0; i < newPatientCount; i++) {
    details.push({
      id: `${invoiceId}-np-${i}`,
      date: getRandomDate(baseDate, 14),
      patientName: MOCK_NAMES[nameIndex++ % MOCK_NAMES.length],
      outcome: 'Charged',
      type: 'New patient'
    });
  }

  for (let i = 0; i < cancellationCount; i++) {
    details.push({
      id: `${invoiceId}-cn-${i}`,
      date: getRandomDate(baseDate, 14),
      patientName: MOCK_NAMES[nameIndex++ % MOCK_NAMES.length],
      outcome: 'Not charged',
      type: 'Cancelled'
    });
  }

  return details.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ─── Main Mock Data Generator (Dynamic) ──────────────────────
const generateMockInvoices = (billingDay: number): Invoice[] => {
  const NEW_PATIENT_RATE = 79.00;

  const createInvoice = (
    id: string,
    invNum: string,
    monthOffset: number,
    recipient: string,
    npCount: number,
    cancelCount: number,
    isVoided: boolean = false
  ): Invoice => {

    // 1. Calculate Invoice Date
    const date = calculateInvoiceDate(billingDay, monthOffset);

    // 2. Determine Status & Payment Date based on Logic
    let derivedStatus: Invoice['status'] = 'completed';
    let derivedPaymentDate = calculatePaymentDate(date, 7); // Default: Paid 7 days later

    if (isVoided) {
      derivedStatus = 'cancelled';
      derivedPaymentDate = 'Voided';
    } else if (monthOffset === 0) {
      // If it is the current month (Offset 0), it is ongoing/pending
      derivedStatus = 'pending';
      derivedPaymentDate = 'Pending';
    } else {
      // If it is a past month (Offset > 0), it is completed
      derivedStatus = 'completed';
    }

    // 3. Calculate Financials
    const newPatientRevenue = npCount * NEW_PATIENT_RATE;
    const cancellationValue = cancelCount * NEW_PATIENT_RATE;
    const totalActivityCount = npCount + cancelCount;
    const totalActivityAmount = totalActivityCount * NEW_PATIENT_RATE;
    const creditCount = -1 * cancelCount;
    const creditAmount = -1 * cancellationValue;
    const total = totalActivityAmount + creditAmount;

    return {
      id,
      invoiceNumber: invNum,
      invoiceDate: date,
      paymentDate: derivedPaymentDate,
      patientName: recipient,
      services: ['Patient Connect', 'Bookings'],
      subTotal: total,
      total: total,
      status: derivedStatus,
      breakdown: [
        { label: 'New Patients', count: npCount, amount: newPatientRevenue, type: 'success' },
        { label: 'Google Ads (SEM)', count: 0, amount: 0.0, type: 'info' },
        { label: 'Cancellations', count: cancelCount, amount: cancellationValue, type: 'error' },
        { label: 'Patient Connect fee this invoice', count: totalActivityCount, amount: totalActivityAmount, type: 'neutral' },
        { label: 'Credits for Patient Connect this invoice', count: creditCount, amount: creditAmount, type: 'neutral' },
        { label: 'Credits for Patient Connect previous invoice', count: 0, amount: 0.0, type: 'neutral' },
      ],
      productDetails: generateProductDetails(id, date, npCount, cancelCount)
    };
  };

  return [
    createInvoice('1', 'I-0000666391', 0, 'Sarah Mitchell', 8, 2),  // Current Month -> Pending
    createInvoice('2', 'I-0000666392', 1, 'James Nkosi', 12, 8),    // Past Month -> Completed
    createInvoice('3', 'I-0000666393', 2, 'Emily van der Merwe', 3, 0), // Past -> Completed
    createInvoice('4', 'I-0000666394', 3, 'David Pillay', 8, 4),    // Past -> Completed
    createInvoice('5', 'I-0000666395', 4, 'Nomsa Dlamini', 0, 15, true), // Voided -> Cancelled
    createInvoice('6', 'I-0000666396', 5, 'Lisa Botha', 6, 1),      // Past -> Completed
  ];
};

const formatCurrency = (amount: number) =>
  amount < 0
    ? `-$ ${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : `$ ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const formatDate = (dateStr: string) => {
  if (dateStr === 'Pending' || dateStr === 'Voided') return dateStr;
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: '2-digit' });
};

const getOrdinalSuffix = (i: number) => {
  const j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
};



// ─── Component: Custom Billing Date Dropdown ─────────────────
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
        className="flex items-center justify-between w-56 px-3 py-2.5 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm hover:border-gray-300 transition-colors"
      >
        <span className="font-medium">{getOrdinalSuffix(value)} of each month</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => {
                  onChange(day);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-700
                  ${value === day ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'}
                `}
              >
                {getOrdinalSuffix(day)} of each month
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Component: Product Breakdown Section ────────────────────
const ProductBreakdownSection: React.FC<{
  details: ProductEntry[];
  total: number;
}> = ({ details, total }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchField, setSearchField] = useState<'patientName' | 'outcome' | 'type'>('patientName');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDetails = details.filter(item => {
    const valueToCheck = item[searchField];
    return valueToCheck.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, searchField]);

  const getSearchLabel = () => {
    switch (searchField) {
      case 'outcome': return 'outcome';
      case 'type': return 'type';
      default: return 'name';
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-lg text-gray-900 mb-4">Product breakdown</h3>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div
          className="flex items-center justify-between px-6 py-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Patient Connect - Bookings</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{isOpen ? 'Close' : 'Open'}</span>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <span className="font-bold text-gray-900 text-lg">{formatCurrency(total)}</span>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-200">
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Search by</span>

                {/* Search Group Container */}
                <div className="flex w-full md:w-96 shadow-sm">

                  {/* Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value as any)}
                      className="h-full bg-gray-50 pl-4 pr-9 py-2.5 border border-gray-200 rounded-l-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="patientName">Name</option>
                      <option value="outcome">Outcome</option>
                      <option value="type">Type</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/3 text-gray-500 pointer-events-none"
                    />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder={`Type a ${getSearchLabel()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-4 py-2.5 border border-gray-200 border-l-1 rounded-r-lg text-sm text-gray-900 placeholder-gray-400 focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download size={16} /> Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 w-1/4">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 w-1/4">Name of patient</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 w-1/4">Outcome</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 w-1/4">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedDetails.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-600">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.patientName}</td>
                      <td className="px-6 py-4 text-gray-600">{item.outcome}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-1.5 rounded-full ${item.type === 'Cancelled' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span className={`font-medium ${item.type === 'Cancelled' ? 'text-gray-900' : 'text-gray-900'}`}>
                            {item.type}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDetails.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        No results found for "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDetails.length)} - {Math.min(currentPage * itemsPerPage, filteredDetails.length)} of {filteredDetails.length} entries
              </span>
              {totalPages > 1 && (
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={14} /></button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={14} /></button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Component: Detail View ────────────────────────────
const InvoiceDetailView: React.FC<{
  invoice: Invoice;
  onBack: () => void;
  practiceName: string;
}> = ({ invoice, onBack, practiceName }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to your billing history</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl text-gray-900">
          Invoice number <span className="font-semibold text-orange-500">{invoice.invoiceNumber}</span>
        </h2>
      </div>

      {/* 3. Top Grid: Metadata & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">

        {/* Left Column: Metadata */}
        <div className="space-y-8">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <p className="text-xs text-gray-500 leading-relaxed">
              Billing information displayed here is only for {practiceName}.
              To view billing information for another practice, please login to the
              Practice Admin account for that location.
            </p>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-y-6 text-sm">
            <div className="text-gray-500 font-medium">Invoice date</div>
            <div className="text-gray-900 font-semibold">{formatDate(invoice.invoiceDate)}</div>

            <div className="text-gray-500 font-medium">Payment date</div>
            <div className="text-gray-900 font-semibold">{formatDate(invoice.paymentDate)}</div>

            <div className="text-gray-500 font-medium">Practice name</div>
            <div className="text-gray-900 font-semibold max-w-[200px] leading-relaxed">{practiceName}</div>

            <div className="text-gray-500 font-medium pt-2">Sub-Total</div>
            <div className="text-gray-900 font-bold text-lg pt-2">{formatCurrency(invoice.subTotal)}</div>
          </div>
        </div>

        {/* Right Column: Summary Table */}
        <div>
          <h3 className="text-lg text-gray-900 mb-2 font-medium">Patient Connect bookings summary</h3>
          <div className="bg-white">
            {invoice.breakdown.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-4 border-b border-gray-100 ${index === 3 ? 'mt-2 border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {item.type !== 'neutral' && (
                    <div className={`w-2 h-2 rounded-full flex-shrink-0
                      ${item.type === 'success' ? 'bg-emerald-500' : ''}
                      ${item.type === 'info' ? 'bg-blue-500' : ''}
                      ${item.type === 'error' ? 'bg-orange-500' : ''}
                    `} />
                  )}
                  <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-12">
                  <span className="text-sm text-gray-900 w-8 text-right">{item.count}</span>
                  <span className={`text-sm font-medium w-24 text-right ${item.amount < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between py-5 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-600 pl-8">Total new patients charged</span>
              <div className="flex items-center gap-12">
                <span className="text-sm font-bold text-gray-900 w-8 text-right">
                  {invoice.breakdown.find(i => i.label === 'New Patients')?.count || 0}
                </span>
                <span className="text-lg font-bold text-emerald-600 w-24 text-right">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductBreakdownSection details={invoice.productDetails} total={invoice.subTotal} />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────
export default function PracticeInvoiceHistoryView() {
  const { practice } = usePracticeAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [billingDay, setBillingDay] = useState<number>(17);

  const [sortField, setSortField] = useState<SortField>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setInvoices(generateMockInvoices(billingDay));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [practice, billingDay]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let results = [...invoices];

    results.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'invoiceDate':
          comparison = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'invoiceNumber':
          comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
          break;
        case 'patientName':
          comparison = a.patientName.localeCompare(b.patientName);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [invoices, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginated = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetailView
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
        practiceName={practice?.practiceName || 'My Practice'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <Receipt size={18} className="text-orange-600" />
            </div>
            Invoice History
          </h2>
          <p className="text-sm text-gray-400 mt-1 ml-[46px]">
            View and manage all your invoices
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 bg-white p-1 rounded-md">
            <span className="text-sm font-medium text-gray-700">Your billing anniversary date</span>
            <BillingDateDropdown value={billingDay} onChange={setBillingDay} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors bg-white shadow-sm">
              Download an invoice PDF <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
          <Receipt size={28} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 font-semibold mb-1">No invoices found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-5 py-3.5">
                  <button onClick={() => handleSort('invoiceNumber')} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
                    Invoice <ArrowUpDown size={12} className={sortField === 'invoiceNumber' ? 'text-orange-500' : 'text-gray-300'} />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5">
                  <button onClick={() => handleSort('invoiceDate')} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
                    Date <ArrowUpDown size={12} className={sortField === 'invoiceDate' ? 'text-orange-500' : 'text-gray-300'} />
                  </button>
                </th>
                <th className="text-right px-5 py-3.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-orange-50 transition-colors group">
                  <td className="px-5 py-4 font-semibold text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(invoice.invoiceDate)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-orange-600 font-medium rounded-lg text-sm hover:bg-orange-500 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                    >
                      View charges
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-400">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={14} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}