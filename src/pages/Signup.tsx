import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import login from "../assets/login.png"

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

  const inputClass = `w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-orange-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex bg-white">

      {/* --- SNACKBAR UI (Mobile Friendly) --- */}
      <div className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">

        {/* Error Toast */}
        {error && (
          <div className="pointer-events-auto w-full max-w-sm bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-bounce-in">
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
          <div className="pointer-events-auto w-full max-w-sm bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-bounce-in">
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

      {/* LEFT SIDE - Scrollable Form */}
      <div className="flex-1 flex flex-col items-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full my-auto">

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              🦷
            </div>
            <h1 className="text-4xl font-bold mt-4">Your Dentist</h1>
            <p className="text-gray-500 text-sm mt-1">Join us to book appointments easily</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Name Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className={inputClass}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className={inputClass}
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={inputClass}
            />

            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className={inputClass}
            />

            {/* DOB & Gender Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`${inputClass} text-gray-500`}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className={inputClass}
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className={inputClass}
            />

            <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="h-4 w-4 accent-orange-600"
              />
              I agree to the Terms & Conditions
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 shadow-lg shadow-orange-600/30 mt-2"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-600 mt-6 mb-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Illustration */}
      <div className="hidden md:flex flex-1 bg-orange-600 justify-center items-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -top-10 -left-10 animate-blob"></div>
        <img
          src={login}
          alt="Illustration"
          className="max-w-md object-contain relative z-10"
        />
      </div>

    </div>
  );
}
