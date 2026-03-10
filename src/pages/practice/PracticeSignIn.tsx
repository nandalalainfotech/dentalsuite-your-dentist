import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import loginimg from "../../assets/login.png";
import { loginService } from "../../services/practiceAuth.service";
import { loginSuccess } from "../../store/slices/userSlice";

export default function PracticeSignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear alerts after 3s
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

    if (!formData.emailOrMobile || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const result = await loginService(formData);
      const loginData = result?.login_api;
      

      if (!loginData) throw new Error("Login data missing");

      // Map API → Redux user model
      const mappedUser = {
        id: loginData?.id,
        name: loginData?.name,
        email: loginData?.email,
        phone:loginData?.phone,
        business_name: loginData?.business_name,
        role: loginData?.type === "SUPERADMIN" ? "superadmin" : "practice",
        password: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
        dateOfBirth: "",
        address: loginData.address,
        logo: loginData.logo,
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        token: loginData.accessToken,
      };
      
      // Update Redux
      dispatch(loginSuccess({
        user: mappedUser,
        token: loginData.accessToken,
      }));

      // Save to sessionStorage for persistence on refresh
      sessionStorage.setItem("user", JSON.stringify(mappedUser));
      sessionStorage.setItem("token", loginData.accessToken);

      setSuccess("Login successful!");

      // 🔹 Role-based navigation
      if (loginData.type === "PRACTICE") {
        navigate("/practice/dashboard", { replace: true });
      } else if (loginData.type === "SUPERADMIN") {
        navigate("/superadmin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">

      {/* TOASTS */}
      <div className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        {error && (
          <div className="pointer-events-auto w-full max-w-sm bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {success && (
          <div className="pointer-events-auto w-full max-w-sm bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl">
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}
      </div>

      {/* LEFT */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-2">Practice Login</h1>
          <p className="text-gray-500 text-sm mb-6">Access your dashboard</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Email or Mobile"
              className="w-full border rounded-xl px-4 py-3 bg-gray-50"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3 bg-gray-50"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have a practice account?{" "}
            <Link to="/practice/signup" className="font-bold text-orange-500">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex flex-1 bg-orange-500 justify-center items-center">
        <img src={loginimg} alt="Practice Login" className="max-w-md object-contain" />
      </div>
    </div>
  );
}