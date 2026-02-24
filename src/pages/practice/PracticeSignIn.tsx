import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import loginimg from "../../assets/login.png";
import { loginService } from "../../services/practiceAuth.service";
// import { useAppDispatch } from "../../store/hooks";
// import { loginSuccess } from "../../store/slices/practiceSlice";


export default function PracticeSignIn() {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear alerts
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

    // const result = await practiceLoginService(formData);
    const result = await loginService(formData);
    console.log("result=============>", result);

    setLoading(false);

    // if (!result.success) {
    //   setError(result.message);
    //   return;
    // }

    // // Save user session
    // if (result.user) {
    //   // Update Redux
    //   dispatch(loginSuccess({
    //     practice: result.user,
    //     token: result.user.token || '',
    //     refreshToken: result.user.refreshToken
    //   }));

    //   console.log("result.user===============>", result.user)

    // }

    // // Role-based redirect
    // if (result.user?.role === "superadmin") {
    //   setSuccess("Welcome Super Admin!");
    //   setTimeout(() => navigate("/superadmin/dashboard"), 1200);
    // } else {
    //   setSuccess("Login successful!");
    //   setTimeout(() => navigate("/practice/dashboard"), 1200);
    // }
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