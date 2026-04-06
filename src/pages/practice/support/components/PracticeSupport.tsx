/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { useAppSelector } from '../../../../store/hooks';
import { useRef, useState } from 'react';
import SupportCentre from '../pages/SupportCentre';

const mockPatients = [
    { id: '1', name: 'Satish Kumar', email: 'satish@example.com', lastAppointment: '2026-03-15', time: '10:00 AM' },
    { id: '2', name: 'Surinder Singh', email: 'surinder@example.com', lastAppointment: '2026-03-20', time: '11:30 AM' },
    { id: '3', name: 'Amit Patel', email: 'amit@example.com', lastAppointment: '2026-03-18', time: '2:00 PM' },
];

const enquiryTypeOptions = [
    { value: '', label: '-' },
    { value: 'patient-issue', label: 'Patient Issue' },
    { value: 'invoice-issue', label: 'Invoice / Billing Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'other', label: 'Other' },
];

const relatesToOptions = [
    { value: 'clinic-support', label: 'I am a Clinic and I have a Support Enquiry' },
    { value: 'clinic-billing', label: 'I am a Clinic and I have a Billing Enquiry' },
    { value: 'patient', label: 'I am a Patient' },
];

const productOptions = [
    { value: '', label: '-' },
    { value: 'online-bookings', label: 'Online Bookings' },
    { value: 'reminders', label: 'Reminders' },
    { value: 'inform', label: 'Inform' },
    { value: 'payments', label: 'Payments' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'other', label: 'Other' },
];

const clinicTypeOptions = [
    { value: '', label: '-' },
    { value: 'general-practice', label: 'General Practice' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'allied-health', label: 'Allied Health' },
    { value: 'dental', label: 'Dental' },
    { value: 'other', label: 'Other' },
];

const reasonOptions = [
    { value: 'no-show', label: 'Patient did not show up (DNS)', requiresCredit: true },
    { value: 'cancelled', label: 'Appointment was cancelled in time', requiresCredit: true },
    { value: 'double-booked', label: 'Double booked / clinic error', requiresCredit: true },
    { value: 'wrong-billed', label: 'Wrong patient billed', requiresCredit: true },
    { value: 'reschedule', label: 'Reschedule not reflected', requiresCredit: false },
    { value: 'other', label: 'Other reason', requiresCredit: false },
];

type Page = 'home' | 'form' | 'patient' | 'confirmation' | 'supportCentre';

export default function PracticeSupport() {
    const { profile, loading } = useAppSelector((state: any) => state.dashboard);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    // Form fields
    const [relatesTo, setRelatesTo] = useState('clinic-support');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [enquiryType, setEnquiryType] = useState('');
    const [enquiryDetails, setEnquiryDetails] = useState('');
    const [product, setProduct] = useState('');
    const [clinicType, setClinicType] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    // Patient page fields
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [issueReason, setIssueReason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (loading && !profile) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
            </div>
        );
    }

    const handleSubmitEnquiry = async () => {
        console.log('Submitting:', {
            relatesTo,
            email,
            subject,
            enquiryType,
            enquiryDetails,
            product,
            clinicType,
            attachments,
            selectedPatient,
            issueReason,
            notes,
        });
        setCurrentPage('confirmation');
    };

    const resetAndGoHome = () => {
        setCurrentPage('home');
        setRelatesTo('clinic-support');
        setEmail('');
        setSubject('');
        setEnquiryType('');
        setEnquiryDetails('');
        setProduct('');
        setClinicType('');
        setAttachments([]);
        setSelectedPatient(null);
        setIssueReason('');
        setSearchTerm('');
        setNotes('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setAttachments((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const filteredPatients = mockPatients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isFormValid =
        email.trim().length > 0 &&
        subject.trim().length > 0 &&
        enquiryType !== '' &&
        enquiryDetails.trim().length > 0 &&
        product !== '' &&
        clinicType !== '';

    // ───────────────────────────────────────────────
    // PAGE: Home – support cards
    // ───────────────────────────────────────────────
    if (currentPage === 'home') {
        return (
            <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-[600px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm gap-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Support
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            How can we help you today?
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded-md mb-6 flex items-start gap-3">
                        <span>ℹ️</span>
                        <p>
                            Please visit our{' '}
                            <span className="underline cursor-pointer font-medium">Support Hub</span>{' '}
                            to see our comprehensive range of support options.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            onClick={() => setCurrentPage('form')}
                            className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-300 hover:bg-blue-50/30"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                                📩
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Submit an enquiry</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Our support team is here to help answer questions you might have
                            </p>
                            <div className="bg-gray-100 text-sm py-2 rounded-md">
                                <span className="font-medium">Response time</span>
                                <br />
                                within 1 business day
                            </div>
                        </div>

                        <div
                            onClick={() => setCurrentPage('supportCentre')}
                            className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition cursor-pointer hover:border-orange-300 hover:bg-orange-50/30"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-orange-100 rounded-full">
                                🖱️
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Support Centre</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Learn to troubleshoot issues with our how-to guides
                            </p>
                            <div className="bg-gray-100 text-sm py-2 rounded-md">
                                <span className="font-medium">Get answers</span>
                                <br />
                                Immediately
                            </div>
                        </div>

                        <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-pink-100 rounded-full">
                                🎓
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">yourdentist Academy</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Your source for mastering yourdentist. Courses and webinars for all skill levels
                            </p>
                            <div className="bg-gray-100 text-sm py-2 rounded-md">
                                <span className="font-medium">On demand</span>
                                <br />
                                Start your journey to becoming a yourdentist pro now!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ───────────────────────────────────────────────
    // PAGE: Enquiry Form (matches reference image)
    // ───────────────────────────────────────────────
    if (currentPage === 'form') {
        return (
            <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-[600px]">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                    <button
                        onClick={resetAndGoHome}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Submit a clinic support request
                    </h1>
                </div>

                <div className="p-6 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
                    {/* ── Left column: form ── */}
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Having trouble? Our support team is here to help. Fill out an enquiry and one of
                            our experts will get back to you within{' '}
                            <span className="font-semibold">1 business day</span>.
                        </p>

                        {/* Patient notice */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 text-[15px] mb-1">
                                Are you a patient?
                            </h3>
                            <p className="text-sm text-gray-600">
                                Please submit your request through our{' '}
                                <a href="#" className="text-blue-600 underline font-medium">
                                    Patient Help Centre
                                </a>
                                .
                            </p>
                        </div>

                        {/* Relates‑to dropdown */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Please tell us what your enquiry relates to:
                            </label>
                            <select
                                value={relatesTo}
                                onChange={(e) => setRelatesTo(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {relatesToOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Email */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Your email address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Subject */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Enquiry type */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Enquiry type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={enquiryType}
                                onChange={(e) => setEnquiryType(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {enquiryTypeOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* What is your enquiry */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                What is your enquiry? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={enquiryDetails}
                                onChange={(e) => setEnquiryDetails(e.target.value)}
                                rows={6}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            />
                            <p className="text-xs text-gray-500 italic mt-1">
                                Please include as much information as you can to help our support team start
                                investigating your issue promptly.
                            </p>
                        </div>

                        {/* Product / feature */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Select a product or feature below <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {productOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clinic type */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Clinic Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={clinicType}
                                onChange={(e) => setClinicType(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {clinicTypeOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 italic mt-1">
                                What type of clinic are you primarily?
                            </p>
                        </div>

                        {/* Attachments */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Attachments
                            </label>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-gray-300 rounded p-6 text-center text-sm text-gray-500 hover:border-blue-400 transition cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                <span>
                                    <span className="text-blue-600 underline font-medium">Add file</span> or
                                    drop files here
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Attached file list */}
                            {attachments.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {attachments.map((file, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                                        >
                                            <span className="truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeAttachment(idx)}
                                                className="text-gray-400 hover:text-red-500 ml-3"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={() => {
                                if (enquiryType === 'patient-issue') {
                                    setCurrentPage('patient');
                                } else {
                                    handleSubmitEnquiry();
                                }
                            }}
                            disabled={!isFormValid}
                            className="bg-green-700 text-white px-8 py-2.5 rounded font-semibold hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            {enquiryType === 'patient-issue' ? 'Next: Select Patient →' : 'Submit'}
                        </button>
                    </div>

                    {/* ── Right sidebar ── */}
                    <aside className="lg:w-80 shrink-0 space-y-6">
                        {/* Support hours */}
                        <div className="border border-gray-200 rounded p-5">
                            <h4 className="font-bold text-gray-800 mb-3">Support Hours:</h4>
                            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                <li>Monday to Thursday 9am – 5:30pm AEST</li>
                                <li>Friday 9am – 5pm AEST</li>
                            </ul>
                            <p className="text-xs text-red-600 mt-3">
                                *Operation hours subject to change on Victorian Public Holidays
                            </p>
                        </div>

                        {/* Academy */}
                        <div className="border border-gray-200 rounded p-5">
                            <p className="text-sm font-bold text-gray-800 mb-2">
                                Have you checked out{' '}
                                <a href="#" className="text-orange-600 underline">
                                    yourdentist Academy
                                </a>
                                ?
                            </p>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                Your source for mastering how to use yourdentist. Courses and webinars for all
                                skill levels. Start your journey to becoming a yourdentist pro now!
                            </p>
                            <a
                                href="https://academy.yourdentist.com.au"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 underline break-all"
                            >
                                https://academy.yourdentist.com.au
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // ───────────────────────────────────────────────
    // PAGE: Patient selection + reason
    // ───────────────────────────────────────────────
    if (currentPage === 'patient') {
        return (
            <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-[600px]">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                    <button
                        onClick={() => {
                            setCurrentPage('form');
                            setSelectedPatient(null);
                            setIssueReason('');
                            setSearchTerm('');
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Select Patient &amp; Issue
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Step 2 of 2 — Choose the patient and reason
                        </p>
                    </div>
                </div>

                <div className="p-6 max-w-3xl mx-auto w-full">
                    {/* Search */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search for a patient:
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Patient list */}
                    <div className="mb-6 max-h-72 overflow-y-auto border rounded-lg">
                        {filteredPatients.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">No patients found.</div>
                        )}
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => setSelectedPatient(patient)}
                                className={`p-4 border-b last:border-b-0 cursor-pointer transition ${selectedPatient?.id === patient.id
                                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">{patient.name}</div>
                                        <div className="text-sm text-gray-600">{patient.email}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Last appointment: {patient.lastAppointment} at {patient.time}
                                        </div>
                                    </div>
                                    {selectedPatient?.id === patient.id && (
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">✓</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected patient badge */}
                    {selectedPatient && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                                    Selected Patient
                                </p>
                                <p className="font-semibold text-gray-900 mt-1">{selectedPatient.name}</p>
                                <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedPatient(null);
                                    setIssueReason('');
                                }}
                                className="text-gray-400 hover:text-red-500 transition text-sm underline"
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Reason dropdown */}
                    {selectedPatient && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Why should this visit not be charged?
                            </label>
                            <select
                                value={issueReason}
                                onChange={(e) => setIssueReason(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a reason...</option>
                                {reasonOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notes textarea */}
                    {selectedPatient && issueReason && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes{' '}
                                <span className="text-gray-400 text-xs font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Please provide any additional details about the issue..."
                                rows={4}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Include any relevant details, screenshots references, or timestamps.
                            </p>
                        </div>
                    )}

                    {/* Credit notice */}
                    {selectedPatient &&
                        issueReason &&
                        reasonOptions.find((r) => r.value === issueReason)?.requiresCredit && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                                <p className="font-semibold text-sm">💰 Credit will be applied:</p>
                                <p className="text-sm text-gray-700 mt-1">
                                    A credit of <strong>₹1.00</strong> will be applied to your{' '}
                                    <strong>next invoice</strong> for patient{' '}
                                    <strong>{selectedPatient.name}</strong>.
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    *No immediate refund. Credit appears on next month's invoice.
                                </p>
                            </div>
                        )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmitEnquiry}
                        disabled={!selectedPatient || !issueReason}
                        className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
                    >
                        Submit Support Request
                    </button>
                </div>
            </div>
        );
    }

    // ───────────────────────────────────────────────
    // PAGE: Confirmation
    // ───────────────────────────────────────────────
    if (currentPage === 'confirmation') {
        return (
            <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-[600px]">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                    <button
                        onClick={resetAndGoHome}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Support Request Submitted
                    </h1>
                </div>

                <div className="p-6 max-w-3xl mx-auto w-full">
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Thank you for your enquiry
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We have received your support request and will aim to respond within 1 business
                            day.
                        </p>

                        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto space-y-1">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Enquiry Details:</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Type:</span>{' '}
                                {enquiryTypeOptions.find((o) => o.value === enquiryType)?.label ??
                                    enquiryType}
                            </p>
                            {subject && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Subject:</span> {subject}
                                </p>
                            )}
                            {selectedPatient && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Patient:</span> {selectedPatient.name}
                                </p>
                            )}
                            {issueReason && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Reason:</span>{' '}
                                    {reasonOptions.find((r) => r.value === issueReason)?.label}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={resetAndGoHome}
                            className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition font-medium"
                        >
                            Back to Support Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ───────────────────────────────────────────────
    // PAGE: Support Centre
    // ───────────────────────────────────────────────
    if (currentPage === 'supportCentre') {
        return <SupportCentre onBack={() => setCurrentPage('home')} />;
    }

    return null;
}