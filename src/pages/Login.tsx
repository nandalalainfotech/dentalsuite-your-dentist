import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import loginimg from "../assets/login.png"

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({ emailOrMobile: "", password: "" });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setSuccess(result.message || "Login Successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

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
            <button onClick={() => setError("")} className="ml-4 text-red-100 hover:text-white shrink-0 p-1">
              ✕
            </button>
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

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold mt-4">Your Dentist</h1>
            <p className="text-gray-500 text-sm mt-1">login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Enter Your Email Address"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-orange-500'}`}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-orange-500'}`}
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="h-4 w-4 accent-orange-600" />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 shadow-lg shadow-orange-600/30"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-gray-600 text-center block mt-2"
            >
              Forgot password?
            </Link>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
              Sign in with Google
            </button>
            <button className="w-full flex justify-center items-center gap-2 bg-gray-100 text-black py-3 rounded-xl hover:bg-gray-200 transition font-medium">
              Sign up with Email
            </button>
          </div>

          {/* --- NEW SECTION: SIGN UP LINK --- */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE (Illustration) */}
      <div className="hidden md:flex flex-1 bg-orange-500 justify-center items-center relative overflow-hidden">
        <img
          src={loginimg}
          alt="Illustration"
          className="max-w-md object-contain relative z-10"
        />
      </div>
    </div>
  );
}