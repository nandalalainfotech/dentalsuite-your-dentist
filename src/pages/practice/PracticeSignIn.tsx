import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePracticeAuth } from "../../hooks/usePracticeAuth";
import loginimg from "../../assets/login.png";

export default function PracticeSignIn() {
  const navigate = useNavigate();
  const { login, isLoading } = usePracticeAuth();

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: ""
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
      setTimeout(() => navigate("/practice/dashboard"), 1500);
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">

      {/* TOASTS */}
      <div className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">

        {error && (
          <div className="pointer-events-auto w-full max-w-sm bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-bounce-in">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full">
                ⚠️
              </div>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => setError("")} className="ml-4 text-white">✕</button>
          </div>
        )}

        {success && (
          <div className="pointer-events-auto w-full max-w-sm bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
            ✅ <span className="text-sm font-medium">{success}</span>
          </div>
        )}
      </div>

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full">

          {/* Header */}
          <div className="relative mb-6">

            {/* Close / Back Button – TOP RIGHT */}
            <button
              onClick={() => navigate(-1)}
              className="absolute right-0 -top-12 h-10 w-10 flex items-center justify-center
               rounded-full bg-gray-100 hover:bg-gray-200
               text-gray-600 text-xl transition"
              aria-label="Go back"
            >
              ✕
            </button>

            {/* Header Content */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold mt-4">Your Dentist</h1>
              <p className="text-gray-500 text-sm mt-1">
                Practice portal login
              </p>
            </div>

          </div>


          {/* <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold mt-4">Your Dentist</h1>
            <p className="text-gray-500 text-sm mt-1">
              Practice portal login
            </p>
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Practice Email Address"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 ${error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-orange-500"
                }`}
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 ${error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-orange-500"
                }`}
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
              {isLoading ? "Signing in..." : "Login"}
            </button>

            <Link
              to="/practice/forgot-password"
              className="text-sm text-gray-400 hover:text-gray-600 text-center"
            >
              Forgot password?
            </Link>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don&apos;t have a practice account?{" "}
            <Link
              to="/practice/signup"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex flex-1 bg-orange-500 justify-center items-center">
        <img
          src={loginimg}
          alt="Practice Login"
          className="max-w-md object-contain"
        />
      </div>
    </div>
  );
}
