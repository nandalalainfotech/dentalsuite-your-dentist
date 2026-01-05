import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
      setSuccess(result.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-5 sm:pt-10">
      <div className="bg-white w-full max-w-[420px] shadow-xl rounded-2xl p-6 sm:p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Patient Sign Up</h1>
          <Link to="/login" className="text-gray-500 text-xl">✕</Link>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Sign up to book your appointments easily
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Enter password"
            />
          </div>

          {/* Re-enter Password */}
          <div>
            <label className="text-sm font-medium">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Confirm password"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Enter last name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
              placeholder="Enter mobile number"
            />
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="h-4 w-4 accent-orange-600"
            />
            I agree to the Terms & Conditions and Privacy Policy
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 font-bold text-white py-2 rounded-lg 
            hover:bg-orange-600 hover:border border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>

        </form>
      </div>
    </div>
  );
}
