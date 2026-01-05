import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
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
        navigate("/dashboard");
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-[420px] shadow-xl rounded-2xl p-6 sm:p-8 mt-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Patient log in</h1>

          <Link to="/" className="text-gray-500 text-xl">✕</Link>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Log in to book your appointments easily
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
          <div>
            <label className="text-sm font-medium">Email or Mobile</label>
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none"
              placeholder="Enter email or mobile number"
            />
          </div>

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

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-orange-600" />
            Keep me logged into this trusted device
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 font-bold text-white py-2 rounded-lg hover:bg-orange-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot your password?
          </Link>
        </form>

        <hr className="my-6" />

        <p className="text-sm mb-2">Don't have an account?</p>
        <Link to="/signup">
          <button className="w-full bg-black font-bold  text-white py-2 rounded-lg 
            hover:bg-orange-600  hover:text-white transition-all">
            Create patient account
          </button></Link>

        <div className="text-center mt-5">
          <a href="#" className="text-blue-600 text-sm">Need help?</a>
        </div>
      </div>
    </div>
  );
}
