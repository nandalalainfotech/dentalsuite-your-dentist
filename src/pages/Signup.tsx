import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "other" | "",
    mobileNumber: "",
    termsAccepted: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword ||
      !formData.firstName || !formData.lastName || !formData.dateOfBirth ||
      !formData.gender || !formData.mobileNumber) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as "male" | "female" | "other",
      mobileNumber: formData.mobileNumber
    });

    if (result.success) {
      setSuccess(result.message || "Account created successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setError(result.message || "Signup failed");
    }
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      
      {/* Toast Notifications */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        {/* Error Toast */}
        {error && (
          <div className="pointer-events-auto w-full max-w-md bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => setError("")} className="ml-4 text-red-100 hover:text-white shrink-0 p-1">✕</button>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="pointer-events-auto w-full max-w-md bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">{success}</span>
            </div>
          </div>
        )}
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-lg">
        {/* Back Button - Above Header */}
        <div className="flex justify-start mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium text-sm group-hover:underline">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-500 mt-2">Join us to book appointments easily</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white border rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
              />
            </div>

            {/* DOB & Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'} text-gray-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'} bg-white`}
                >
                  <option value="" className="text-gray-400">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'}`}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="h-5 w-5 accent-orange-600 rounded mt-0.5"
              />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-orange-600 hover:underline font-medium">Terms & Conditions</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-orange-600 hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70497C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.2749 6.60986C0.464899 8.22986 0 10.0599 0 11.9999C0 13.9399 0.464899 15.7699 1.2749 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                <path d="M12.0003 24C15.2403 24 17.9653 22.935 19.9453 21.095L16.0803 18.095C15.0053 18.82 13.6203 19.25 12.0003 19.25C8.87028 19.25 6.21525 17.14 5.27028 14.295L1.28027 17.39C3.25527 21.31 7.31028 24 12.0003 24Z" fill="#34A853"/>
              </svg>
              Continue with Google
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Continue with Email
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-orange-600 hover:underline">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}