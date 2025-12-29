import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/booking/useBookingContext";
import { useBookingDataLoader } from "../../hooks/booking/useBookingDataLoader";
import BookingSidebar from "./BookingSidebar";

interface LoginFormData {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  agreeToTerms: boolean;
}

const BookingAuthStep: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBooking();
  const { loading, hasData } = useBookingDataLoader();
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    keepLoggedIn: false,
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    agreeToTerms: false,
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", loginData);
    navigate(`/booking/${state.dentistId}/step-4`);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup submitted:", signupData);
    navigate(`/booking/${state.dentistId}/step-4`);
  };

  const handleBack = () => {
    navigate(`/booking/${state.dentistId}/step-3`);
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
      <BookingSidebar currentStep={3} />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Top Navigation */}
          <nav className="flex items-center justify-between border-b border-gray-200 pb-3 mb-10">
            {/* Back */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
            >
              <i className="bi bi-arrow-left text-base"></i>
              Back
            </button>
          </nav>

          <div className="max-w-4xl mx-auto animate__animated animate__slideInUp animate__faster">
            <div className="space-y-10 animate-in fade-in duration-500">
              {!authMode ? (
                /* Initial Screen - Show Login/Signup Buttons - NO CARD (Old UI) */
                <section>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    Authentication Required
                  </h1>
                  <p className="text-gray-600 text-sm mb-8">
                    Please log in or create an account to continue with your booking
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <button
                      onClick={() => setAuthMode("login")}
                      className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <i className="bi bi-person-fill text-orange-600 text-xl"></i>
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">
                            Log In
                          </span>
                          <span className="text-xs text-gray-500">
                            Existing patient account
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setAuthMode("signup")}
                      className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <i className="bi bi-person-plus-fill text-gray-700 text-xl"></i>
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">
                            Sign Up
                          </span>
                          <span className="text-xs text-gray-500">
                            Create new patient account
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </section>
              ) : (
                /* Show Form Based on Auth Mode - WITH CARD */
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-[400px] flex items-center justify-center mx-auto">
                  <section>
                    <div className="mb-6">
                      <button
                        onClick={() => setAuthMode(null)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors mb-4"
                      >
                        <i className="bi bi-arrow-left text-base"></i>
                        Back to options
                      </button>

                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {authMode === "login" ? "Patient Log In" : "Patient Sign Up"}
                      </h1>
                      <p className="text-gray-600 text-sm mb-8">
                        {authMode === "login"
                          ? "Log in to book your appointments easily"
                          : "Sign up to book your appointments easily"}
                      </p>
                    </div>

                    <div className="max-w-xl">
                      {authMode === "login" ? (
                        /* Login Form */
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Email or Mobile
                            </label>
                            <input
                              type="text"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                              required
                              placeholder="Enter your email or mobile number"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Password
                            </label>
                            <input
                              type="password"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                              required
                              placeholder="Enter your password"
                            />
                          </div>

                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={loginData.keepLoggedIn}
                              onChange={(e) => setLoginData({ ...loginData, keepLoggedIn: e.target.checked })}
                              className="h-4 w-4 accent-orange-600 rounded"
                            />
                            Keep me logged into this trusted device
                          </label>

                          <div className="space-y-4">
                            <button
                              type="submit"
                              className="w-full bg-orange-600 font-semibold text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              Log in
                            </button>

                            <a href="#" className="text-blue-600 text-sm hover:underline block text-center">
                              Forgot your password?
                            </a>
                          </div>
                        </form>
                      ) : (
                        /* Signup Form */
                        <form onSubmit={handleSignupSubmit} className="space-y-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Email
                            </label>
                            <input
                              type="email"
                              value={signupData.email}
                              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                              required
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Password
                              </label>
                              <input
                                type="password"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                                placeholder="Create password"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                value={signupData.confirmPassword}
                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                                placeholder="Re-enter password"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                First Name
                              </label>
                              <input
                                type="text"
                                value={signupData.firstName}
                                onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                                placeholder="First name"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Last Name
                              </label>
                              <input
                                type="text"
                                value={signupData.lastName}
                                onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                                placeholder="Last name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                value={signupData.dateOfBirth}
                                onChange={(e) => setSignupData({ ...signupData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Gender
                              </label>
                              <select
                                value={signupData.gender}
                                onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
                                required
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={signupData.mobileNumber}
                              onChange={(e) => setSignupData({ ...signupData, mobileNumber: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                              required
                              placeholder="Mobile number"
                            />
                          </div>

                          <label className="flex items-start gap-2 text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={signupData.agreeToTerms}
                              onChange={(e) => setSignupData({ ...signupData, agreeToTerms: e.target.checked })}
                              className="h-4 w-4 accent-orange-600 rounded mt-1"
                              required
                            />
                            <span>I agree to the Terms & Conditions and Privacy Policy</span>
                          </label>

                          <div className="space-y-4">
                            <button
                              type="submit"
                              className="w-full bg-orange-600 font-semibold text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              Sign up
                            </button>
                          </div>
                        </form>
                      )}

                      {/* <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-4">
                            {authMode === "login"
                              ? "Don't have an account?"
                              : "Already have an account?"
                            }
                          </p>
                          <button
                            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                            className="w-full bg-gray-800 font-semibold text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            {authMode === "login"
                              ? "Create patient account"
                              : "Log in to existing account"
                            }
                          </button>
                        </div>

                        <div className="text-center mt-5">
                          <a href="#" className="text-blue-600 text-sm hover:underline">
                            Need help?
                          </a>
                        </div>
                      </div> */}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingAuthStep;