import { useState } from "react";
import { formatShortDate, formatTime } from "../../../../features/practice_invoice_history/invoiceHistory.hooks";
import { X } from "lucide-react";
import type { EnrichedAppointment } from "../../../../features/online_bookings/online_bookings.utils";

const DisputeModal = ({
    appointment,
    onClose,
    onSubmit,
}: {
    appointment: EnrichedAppointment;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}) => {
    const [reason, setReason] = useState("");
    const [otherText, setOtherText] = useState("");


    const handleSubmit = () => {
        const finalReason = reason === "Other" ? otherText.trim() : reason;
        if (!finalReason) return;
        onSubmit(finalReason);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border-t-4 border-orange-500">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Dispute New Patient</h2>
                    <button onClick={onClose} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-6 font-medium">
                        Please provide the reason you believe the following new patient is not billable.
                    </p>
                    <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-100 space-y-2 text-sm">
                        <div className="grid grid-cols-3">
                            <span className="text-orange-600/70 font-semibold">Patient Name</span>
                            <span className="col-span-2 font-bold text-slate-800">{appointment.patient_name}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-orange-600/70 font-semibold">Appointment Type</span>
                            <span className="col-span-2 font-semibold text-slate-700">{appointment.treatment}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-orange-600/70 font-semibold">Practitioner</span>
                            <span className="col-span-2 font-semibold text-slate-700">{appointment.dentist_name}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-orange-600/70 font-semibold">Date of Appointment</span>
                            <span className="col-span-2 font-bold text-orange-700">
                                {formatShortDate(appointment.appointment_date)} {formatTime(appointment.appointment_date, appointment.appointment_time)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Reason</h4>
                        {["Patient did not attend appointment", "Patient had attended this practice previously", "Other"].map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="reason"
                                    className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
                                    onChange={() => setReason(item)}
                                    checked={reason === item}
                                />
                                <span className="text-sm text-slate-700 group-hover:text-orange-600 transition-colors font-medium">{item}</span>
                            </label>
                        ))}
                        {reason === "Other" && (
                            <textarea
                                className="w-full mt-2 p-3 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Specifically why is this not billable?"
                                rows={3}
                                value={otherText}
                                onChange={(e) => setOtherText(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t">
                    <button onClick={onClose} className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-all">
                        Cancel
                    </button>
                    <button
                        disabled={!reason || (reason === "Other" && !otherText.trim())}
                        onClick={handleSubmit}
                        className="px-10 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-200 transition-all active:scale-95"
                    >
                        Dispute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisputeModal;