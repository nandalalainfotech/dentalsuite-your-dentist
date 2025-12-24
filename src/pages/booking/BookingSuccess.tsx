import React from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccess: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Appointment Confirmed!
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Your appointment has been successfully booked.
                        You will receive a confirmation email shortly with all the details.
                    </p>

                    {/* Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
                        <h3 className="font-semibold text-blue-900 text-sm mb-2">What's Next?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Check your email for confirmation details</li>
                            <li>• Add the appointment to your calendar</li>
                            <li>• Arrive 10 minutes early on the day</li>
                        </ul>
                    </div>

                    {/* Go Home Button */}
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-md"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
