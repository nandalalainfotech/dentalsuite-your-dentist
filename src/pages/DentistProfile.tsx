import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClinicService, { type Dentist } from "../services/ClinicService";

interface DentistData extends Dentist {
    clinicId?: string;
}

const DentistProfile = () => {
    const { id: dentistId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [dentist, setDentist] = useState<DentistData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string>("");

    useEffect(() => {
        const fetchDentist = async () => {
            if (dentistId) {
                // Get all clinics and find the dentist
                const allClinics = ClinicService.getAllClinics();
                let foundDentist: DentistData | null = null;

                for (const clinic of await allClinics) {
                    const dentistData = clinic.dentists?.find(
                        (d) => d.id === dentistId
                    );
                    if (dentistData) {
                        foundDentist = { ...dentistData, clinicId: clinic.id };
                        break;
                    }
                }

                setDentist(foundDentist);
            }
            setLoading(false);
        };

        fetchDentist();
    }, [dentistId]);

    const handleBookAppointment = () => {
        if (selectedDate && selectedSlot) {
            alert(
                `Appointment booked with ${dentist?.name} on ${selectedDate} at ${selectedSlot}`
            );
            // You can replace this with actual booking logic
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
                    <p className="text-gray-500 font-medium animate-pulse">
                        Loading dentist details...
                    </p>
                </div>
            </div>
        );
    }

    if (!dentist) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="bi bi-exclamation-lg text-3xl text-red-500"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Dentist Not Found
                    </h2>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        The dentist you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-12 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 font-medium"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Dentist Info */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            {/* Profile Section */}
                            <div className="flex flex-col sm:flex-row gap-8 mb-8">
                                <div className="flex-shrink-0">
                                    <img
                                        src={dentist.image}
                                        alt={dentist.name}
                                        className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                        {dentist.name}
                                    </h1>
                                    <p className="text-lg text-orange-600 font-semibold mb-4">
                                        {dentist.qualification}
                                    </p>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <i className="bi bi-star-fill text-yellow-400 mr-2"></i>
                                            <span className="font-medium">Experience:</span> 10+ years
                                        </p>
                                        <p>
                                            <i className="bi bi-check-circle-fill text-green-500 mr-2"></i>
                                            <span className="font-medium">Verified Professional</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="border-t pt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="bi bi-info-circle text-orange-600"></i>
                                    About
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Highly skilled dental professional with extensive experience in
                                    general dentistry and specialized treatments. Known for
                                    patient-centric approach and latest dental techniques.
                                </p>
                            </div>

                            {/* Specialties Section */}
                            <div className="border-t pt-8 mt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="bi bi-briefcase text-orange-600"></i>
                                    Specialties
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-medium border border-orange-200">
                                        General Dentistry
                                    </span>
                                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200">
                                        Cosmetic Dentistry
                                    </span>
                                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium border border-green-200">
                                        Root Canal Treatment
                                    </span>
                                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium border border-purple-200">
                                        Teeth Whitening
                                    </span>
                                </div>
                            </div>

                            {/* Availability Section */}
                            <div className="border-t pt-8 mt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="bi bi-calendar-check text-orange-600"></i>
                                    Available Days
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {dentist.availabledays?.map((day) => (
                                        <span
                                            key={day}
                                            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200"
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Book Appointment
                            </h3>

                            <div className="space-y-6">
                                {/* Select Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Select Date
                                    </label>
                                    <div className="space-y-2">
                                        {[1, 2, 3].map((day) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() + day);
                                            const dateStr = date.toISOString().split("T")[0];
                                            const dateLabel = date.toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            });

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => setSelectedDate(dateStr)}
                                                    className={`w-full p-3 rounded-lg border-2 font-medium text-left transition-all ${selectedDate === dateStr
                                                        ? "border-orange-600 bg-orange-50 text-orange-700"
                                                        : "border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                                                        }`}
                                                >
                                                    {dateLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Select Time Slot */}
                                {selectedDate && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Select Time
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {dentist.slots
                                                ?.filter((slot) => slot.available)
                                                .map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedSlot(slot.time)}
                                                        className={`p-2 rounded-lg border-2 font-medium text-sm transition-all ${selectedSlot === slot.time
                                                            ? "border-orange-600 bg-orange-50 text-orange-700"
                                                            : "border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                                                            }`}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Patient Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors"
                                    />
                                </div>

                                {/* Patient Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors"
                                    />
                                </div>

                                {/* Patient Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-600 transition-colors"
                                    />
                                </div>

                                {/* Book Button */}
                                <button
                                    onClick={handleBookAppointment}
                                    disabled={!selectedDate || !selectedSlot}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-orange-200 disabled:shadow-none transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
                                >
                                    <i className="bi bi-check-circle mr-2"></i>
                                    Book Appointment
                                </button>

                                {/* Info Text */}
                                <p className="text-xs text-gray-500 text-center">
                                    You will receive a confirmation email shortly
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DentistProfile;
