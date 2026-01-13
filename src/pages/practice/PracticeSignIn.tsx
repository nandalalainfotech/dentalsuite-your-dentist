import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePracticeAuth } from "../../hooks/usePracticeAuth";

export default function PracticeSignIn() {
  const navigate = useNavigate();
  const { login, isLoading } = usePracticeAuth();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.emailOrMobile || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate("/practice/dashboard");
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mt-20 from-orange-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl p-8">

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Practice Sign In</h1>
          <p className="text-gray-600 text-sm mt-2">Welcome back to your practice portal</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="practice@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
              Remember me
            </label>
            <Link to="/practice/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have a practice account?{' '}
            <Link to="/practice/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2026 Your Dentist All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}