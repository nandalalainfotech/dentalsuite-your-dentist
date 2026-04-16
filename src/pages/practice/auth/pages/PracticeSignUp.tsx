import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../../features/auth/auth.hooks";

export default function PracticeSignUp() {
  const navigate = useNavigate();

  const { handleSignup, loading: isLoading } = useAuth();

  const [formData, setFormData] = useState({
    practice_name: "",
    abn_number: "",
    practice_type: "",
    practice_phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",

    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    type: "PRACTICE_ADMIN",

    logo: "",
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
    if (!formData.practice_name || !formData.abn_number || !formData.email || !formData.password ||
      !formData.confirmPassword || !formData.first_name || !formData.last_name || !formData.mobile ||
      !formData.address || !formData.city || !formData.state ||
      !formData.postcode || !formData.practice_phone || !formData.practice_type) {
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

    const abnRegex = /^\d{6,11}$/;
    if (!abnRegex.test(formData.abn_number)) {
      setError("Please enter a valid ABN number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const signupPayload = {
      practiceName: formData.practice_name,
      abnNumber: formData.abn_number,
      practiceType: formData.practice_type,
      practicePhone: formData.practice_phone,
      practiceAddress: formData.address,
      practiceCity: formData.city,
      practiceState: formData.state,
      practicePostcode: formData.postcode,
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      mobileNumber: formData.mobile,
      password: formData.password,
      practiceLogo: formData.logo,
      type: formData.type || "PRACTICE_ADMIN"
    };

    const result = await handleSignup(signupPayload);

    if (result.success) {
      setSuccess("Account created successfully! Your account is pending Superadmin approval. Redirecting to login...");
      setTimeout(() => {
        navigate("/practice/signin");
      }, 3500);
    } else {
      setError(result.message as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-400 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mt-10">

        {/* Header */}
        <div className="relative mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute right-0 -top-12 h-10 w-10 flex items-center justify-center
             rounded-full bg-gray-100 hover:bg-gray-200
             text-gray-600 text-xl transition"
            aria-label="Go back"
          >
            ✕
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Your Dentist Practice Portal
          </h1>
          <p className="text-gray-600">
            Connect with thousands of patients across Australia
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm max-w-2xl mx-auto">
            {success}
          </div>
        )}

        {/* FORM (UNCHANGED UI) */}
        <div className="bg-white border rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Practice Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Practice Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name *</label>
                  <input type="text" name="practice_name" value={formData.practice_name} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ABN Number *</label>
                  <input type="text" name="abn_number" value={formData.abn_number} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type *</label>
                  <input name="practice_type" value={formData.practice_type} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Practice Phone *</label>
                  <input type="tel" name="practice_phone" value={formData.practice_phone} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City/Suburb *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input name="state" value={formData.state} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                  <input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Primary Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
                <span className="text-gray-600">
                  I agree to the <a href="#" className="text-orange-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
                  I confirm that I have the authority to register this practice and that all provided information is accurate.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-4 rounded-lg"
            >
              {isLoading ? "Creating..." : "Create Practice Account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}