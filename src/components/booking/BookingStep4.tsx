import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/booking/useBookingContext";
import { useBookingDataLoader } from "../../hooks/booking/useBookingDataLoader";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardData } from "../../hooks/useDashboardData";
import type { PersonalDetails } from "../../types";

import BookingSidebar from "./BookingSidebar";
import BookingModal from "./BookingModal";

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="relative w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <div className="text-gray-900 font-medium">{value}</div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </div>
  </div>
);

const BookingStep4: React.FC = () => {
  const navigate = useNavigate();
  const { state, setPersonalDetails } = useBooking();
  const { loading, hasData } = useBookingDataLoader();
  const { isAuthenticated, user } = useAuth();
  const { familyMembers } = useDashboardData();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>("");

  const isBookingForSomeoneElse = state.appointmentFor === "someone-else";

  const [formData, setFormData] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    reason: "",
  });

  const [isFamilyMemberSelected, setIsFamilyMemberSelected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !isBookingForSomeoneElse) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.mobileNumber || "",
        dateOfBirth: 'dateOfBirth' in user ? user.dateOfBirth : "",
        reason: "",
      });
    }
  }, [isAuthenticated, user, isBookingForSomeoneElse]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails(formData);
    navigate(`/booking/${state.dentistId}/step-5`);
  };

  const handleBack = () => {
    navigate(`/booking/${state.dentistId}/step-3`);
  };

  const handleFamilyMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = e.target.value;
    setSelectedFamilyMember(memberId);

    if (memberId) {
      const member = familyMembers.find(
        (m) => m.id === memberId
      );
      if (member) {
        setFormData({
          firstName: member.name.split(" ")[0] || "",
          lastName: member.name.split(" ").slice(1).join(" ") || "",
          email: member.email || "",
          phone: member.phone || "",
          dateOfBirth: member.dateOfBirth
            ? new Date(member.dateOfBirth).toISOString().split("T")[0]
            : "",
          reason: "",
        });
        setIsFamilyMemberSelected(true);
      }
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        reason: "",
      });
      setIsFamilyMemberSelected(false);
    }
  };

  if (loading || !hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <BookingSidebar
        currentStep={4}
        onOpenBookingModal={() => setShowBookingModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Top Navigation */}
            <nav className="flex items-center justify-between border-b border-gray-200 pb-3 mb-10">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
              >
                <i className="bi bi-arrow-left text-base"></i>
                Back
              </button>
            </nav>

            <div className="max-w-4xl mx-auto animate__animated animate__slideInUp animate__faster">
              {isBookingForSomeoneElse && user && (
                <div className="mb-12 border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    About you
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ReadOnlyField
                        label="First name"
                        value={user.firstName || ""}
                      />
                      <ReadOnlyField
                        label="Last name"
                        value={user.lastName || ""}
                      />
                    </div>
                    <ReadOnlyField
                      label="Mobile number"
                      value={user.mobileNumber || ""}
                    />
                    <ReadOnlyField
                      label="Email address"
                      value={user.email || ""}
                    />
                  </div>
                </div>
              )}

              {/* --- SECTION 2: ABOUT THE PATIENT --- */}
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {isBookingForSomeoneElse
                    ? "About the patient"
                    : "Personal Details"}
                </h1>
                <p className="text-gray-500 mb-8">
                  {isBookingForSomeoneElse
                    ? "Please enter details for the patient below."
                    : "Please confirm your details below."}
                </p>

                {/* Family Member Dropdown */}
                {isBookingForSomeoneElse && familyMembers.length > 0 && (
                  <div className="pb-5">
                    <label
                      htmlFor="familyMember"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Patient profile
                    </label>
                    <div className="relative">
                      <select
                        id="familyMember"
                        value={selectedFamilyMember}
                        onChange={handleFamilyMemberSelect}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 appearance-none bg-white pr-10 cursor-pointer"
                      >
                        <option value="">Enter details manually</option>
                        {familyMembers
                          .filter((member) => member.relationship !== "self")
                          .map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.relationship})
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Select a family member profile or enter new details manually
                    </p>
                  </div>
                )}

                {/* Patient Details - Show as read-only when family member is selected */}
                {isBookingForSomeoneElse && isFamilyMemberSelected ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ReadOnlyField
                        label="First Name"
                        value={formData.firstName}
                      />
                      <ReadOnlyField
                        label="Last Name"
                        value={formData.lastName}
                      />
                    </div>

                    <ReadOnlyField
                      label="Date of Birth"
                      value={formData.dateOfBirth}
                    />

                    <ReadOnlyField
                      label="Mobile Number"
                      value={formData.phone}
                    />

                    <ReadOnlyField
                      label="Email Address"
                      value={formData.email}
                    />

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <div className="relative w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[120px]">
                        <div className="text-gray-900 font-medium whitespace-pre-wrap">
                          {formData.reason || "No additional notes provided"}
                        </div>
                        <div className="absolute right-4 top-4 text-orange-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div> */}

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setPersonalDetails(formData);
                          navigate(`/booking/${state.dentistId}/step-5`);
                        }}
                        className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Continue with Selected Patient
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Patient Details Form - For manual entry */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {state.clinic && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          clinic={state.clinic}
          selectedDentistId={state.dentistId || undefined}
          mode="update"
        />
      )}
    </div>
  );
};

export default BookingStep4;