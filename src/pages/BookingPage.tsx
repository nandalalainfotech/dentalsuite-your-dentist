import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ClinicService, { type Dentist } from "../services/ClinicService";
// import { ChevronLeft, AlertTriangle } from "lucide-react";   

// Define Booking State Interface
interface BookingState {
    date: string;
    time: string;
    service: string;
}

// Define Clinic Interface locally if not exported from Service
// Adjust properties based on your actual API response structure
interface Clinic {
    name: string;
    address: string;
    dentists: Dentist[];
}

const BookingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: dentistId } = useParams<{ id: string }>();

    // State for Dynamic Data
    const [dentist, setDentist] = useState<Dentist | null>(null);
    const [clinic, setClinic] = useState<Clinic | null>(null); // Store clinic info
    const [loading, setLoading] = useState(true);

    // UI State
    const [appointmentFor, setAppointmentFor] = useState<"myself" | "someone-else" | null>(null);
    const [step, setStep] = useState<"appointment-type" | "personal-details">("appointment-type");

    // Get booking details from navigation state
    const bookingState = location.state as BookingState | null;

    useEffect(() => {
        const fetchData = async () => {
            if (dentistId) {
                try {
                    const allClinics = await ClinicService.getAllClinics();

                    // Iterate to find the clinic that contains this dentist
                    for (const c of allClinics) {
                        // Cast 'c' to Clinic type if needed, assuming the service returns objects matching the interface
                        const foundDentist = c.dentists?.find((d) => d.id === dentistId);

                        if (foundDentist) {
                            setDentist(foundDentist);
                            setClinic(c as Clinic); // Save the clinic details dynamically
                            break;
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch booking data", error);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [dentistId]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#00A69C] mx-auto"></div>
                    <p className="text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (!dentist || !clinic) {
        return (
            <div className="min-h-screen bg-[#F7F8F9] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-500 mb-6">Unable to load appointment information.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#D84E18] hover:bg-[#c14413] text-white font-semibold px-6 py-3 rounded-full transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        // <div className="flex flex-col lg:flex-row bg-gray-50">
        //     {/* --- Left Sidebar (Dynamic Data) --- */}
        //     <div className="w-full lg:w-1/3 bg-white p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
        //         {/* Dentist Profile */}
        //         <div className="text-center mb-8">
        //             <img
        //                 src={dentist.image}
        //                 alt={dentist.name}
        //                 className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
        //             />
        //             <h2 className="text-2xl font-bold text-gray-900 mb-1">{dentist.name}</h2>
        //             <p className="text-sm text-gray-600 mb-4">{dentist.qualification || "Dental Practitioner"}</p>

        //             {/* Clinic Info */}
        //             <div className="bg-gray-50 p-4 rounded-lg mb-6">
        //                 <p className="text-sm font-semibold text-gray-900 mb-1">{clinic?.name}</p>
        //                 <p className="text-xs text-gray-600">{clinic?.address}</p>
        //             </div>
        //         </div>

        //         {/* Appointment Details */}
        //         {bookingState && (
        //             <div className="bg-teal-50 p-4 rounded-lg mb-8 border border-teal-100">
        //                 <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        //                     Appointment Details
        //                 </p>
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
        //                             <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.4-.48-1.03-.75-1.69-.75-.83 0-1.54.5-1.84 1.22-.5 1.06.14 2.28 1.45 2.28.74 0 1.45-.35 1.9-.93l3.15-4.08c.35-.46.35-1.12 0-1.58-.9-1.1-2.54-1.1-3.44 0l-3.15 4.08" />
        //                         </svg>
        //                         <span className="text-sm font-semibold text-gray-900">
        //                             {new Date(bookingState.date).toLocaleDateString("en-US", {
        //                                 weekday: "short",
        //                                 month: "long",
        //                                 day: "numeric",
        //                             })}
        //                         </span>
        //                     </div>
        //                     <div className="flex items-center gap-2">
        //                         <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
        //                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        //                         </svg>
        //                         <span className="text-sm font-semibold text-gray-900">{bookingState.time}</span>
        //                     </div>
        //                 </div>
        //                 <button className="w-full mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm py-2 border-t border-teal-100">
        //                     Change appointment
        //                 </button>
        //             </div>
        //         )}

        //         {/* Visual Progress Indicator */}
        //         <div className="mt-auto pt-8 border-t border-gray-200">
        //             <div className="space-y-4">
        //                 <div className="flex items-start gap-4">
        //                     <div className="flex flex-col items-center">
        //                         <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
        //                             1
        //                         </div>
        //                         {step === "personal-details" && (
        //                             <div className="w-0.5 h-8 bg-teal-600 mt-2"></div>
        //                         )}
        //                     </div>
        //                     <div>
        //                         <p className="text-sm font-semibold text-gray-900">Appointment type</p>
        //                         {step === "appointment-type" && (
        //                             <p className="text-xs text-teal-600 mt-1">You're here</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div className="flex items-start gap-4">
        //                     <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">
        //                         2
        //                     </div>
        //                     <div>
        //                         <p className="text-sm font-semibold text-gray-600">Personal details</p>
        //                         <p className="text-xs text-gray-400 mt-1">Next step</p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     {/* --- Main Content Area --- */}
        //     <div className="flex-1 bg-white flex flex-col justify-center p-6 md:p-8 lg:p-12">
        //         <div className="max-w-3xl">
        //             {/* Top Navigation */}
        //             <div className="flex justify-between items-center mb-12">
        //                 <button
        //                     onClick={() => navigate(-1)}
        //                     className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
        //                 >
        //                     ← Back
        //                 </button>
        //                 <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
        //                     ⚠️ Is this an emergency?
        //                 </button>
        //             </div>

        //             {/* Main Content */}
        //             <div>
        //                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        //                     Who is this appointment for?
        //                 </h1>
        //                 <p className="text-gray-600 text-lg mb-8">
        //                     Please select who will be attending the appointment
        //                 </p>

        //                 {/* Options Grid */}
        //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        //                     <button
        //                         onClick={() => setAppointmentFor("myself")}
        //                         className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all flex flex-col items-center gap-3 ${appointmentFor === "myself"
        //                             ? "border-teal-600 bg-teal-50 text-teal-700 shadow-md"
        //                             : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
        //                             }`}
        //                     >
        //                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        //                         </svg>
        //                         <span>Myself</span>
        //                         <span className="text-sm font-normal text-gray-500">I'm the patient</span>
        //                     </button>

        //                     <button
        //                         onClick={() => setAppointmentFor("someone-else")}
        //                         className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all flex flex-col items-center gap-3 ${appointmentFor === "someone-else"
        //                             ? "border-teal-600 bg-teal-50 text-teal-700 shadow-md"
        //                             : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
        //                             }`}
        //                     >
        //                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197a4 4 0 00-5.197-5.197" />
        //                         </svg>
        //                         <span>Someone else</span>
        //                         <span className="text-sm font-normal text-gray-500">Booking for another person</span>
        //                     </button>
        //                 </div>

        //                 {/* Continue Button */}
        //                 <button
        //                     onClick={() => {
        //                         if (appointmentFor) setStep("personal-details");
        //                     }}
        //                     disabled={!appointmentFor}
        //                     className={`w-full md:w-auto px-8 py-3 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 ${appointmentFor
        //                         ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl"
        //                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
        //                         }`}
        //                 >
        //                     Continue
        //                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        //                     </svg>
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="flex flex-col lg:flex-row bg-gray-50">
            {/* --- Left Sidebar (Dynamic Data) --- */}
            <div className="w-full lg:w-1/5 bg-white p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                {/* Dentist Profile */}
                <div className="text-center mb-6">
                    <img
                        src={dentist.image}
                        alt={dentist.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-gray-100"
                    />
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{dentist.name}</h2>
                    <p className="text-xs text-gray-600 mb-3">{dentist.qualification || "Dental Practitioner"}</p>

                    {/* Clinic Info */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-xs font-semibold text-gray-900 mb-1">{clinic?.name}</p>
                        <p className="text-xs text-gray-600">{clinic?.address}</p>
                    </div>
                </div>

                {/* Appointment Details */}
                {bookingState && (
                    <div className="bg-teal-50 p-3 rounded-lg mb-6 border border-teal-100">
                        <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Appointment Details
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.4-.48-1.03-.75-1.69-.75-.83 0-1.54.5-1.84 1.22-.5 1.06.14 2.28 1.45 2.28.74 0 1.45-.35 1.9-.93l3.15-4.08c.35-.46.35-1.12 0-1.58-.9-1.1-2.54-1.1-3.44 0l-3.15 4.08" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-900">
                                    {new Date(bookingState.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-900">{bookingState.time}</span>
                            </div>
                        </div>
                        <button className="w-full mt-3 text-teal-600 hover:text-teal-700 font-medium text-xs py-1.5 border-t border-teal-100">
                            Change appointment
                        </button>
                    </div>
                )}

                {/* Visual Progress Indicator */}
                <div className="mt-auto pt-6 border-gray-200 md:mt-10">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    1
                                </div>
                                {step === "personal-details" && (
                                    <div className="w-0.5 h-6 bg-teal-600 mt-1.5"></div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-900">Appointment type</p>
                                {step === "appointment-type" && (
                                    <p className="text-xs text-teal-600 mt-0.5">You're here</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                                2
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600">Personal details</p>
                                <p className="text-xs text-gray-400 mt-0.5">Next step</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="flex-1 bg-white flex flex-col justify-center p-4 md:p-6 lg:p-8">
                <div className="max-w-2xl mx-auto w-full">
                    {/* Top Navigation */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                        >
                            ← Back
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                            ⚠️ Emergency?
                        </button>
                    </div>

                    {/* Main Content */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Who is this appointment for?
                        </h1>
                        <p className="text-gray-600 text-base mb-6">
                            Please select who will be attending
                        </p>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => setAppointmentFor("myself")}
                                className={`p-4 rounded-lg border-2 font-semibold text-base transition-all flex flex-col items-center gap-2 ${appointmentFor === "myself"
                                    ? "border-teal-600 bg-teal-50 text-teal-700 shadow-md"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Myself</span>
                                <span className="text-xs font-normal text-gray-500">I'm the patient</span>
                            </button>

                            <button
                                onClick={() => setAppointmentFor("someone-else")}
                                className={`p-4 rounded-lg border-2 font-semibold text-base transition-all flex flex-col items-center gap-2 ${appointmentFor === "someone-else"
                                    ? "border-teal-600 bg-teal-50 text-teal-700 shadow-md"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197a4 4 0 00-5.197-5.197" />
                                </svg>
                                <span>Someone else</span>
                                <span className="text-xs font-normal text-gray-500">Booking for another</span>
                            </button>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={() => {
                                if (appointmentFor) setStep("personal-details");
                            }}
                            disabled={!appointmentFor}
                            className={`w-full md:w-auto px-6 py-2.5 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2 ${appointmentFor
                                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Continue
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default BookingPage;