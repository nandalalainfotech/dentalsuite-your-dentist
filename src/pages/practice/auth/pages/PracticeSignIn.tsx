import { useNavigate } from "react-router-dom";
import SignInForm from "../components/SignInForm";
import loginimg from "../../../../assets/login.png";
import { useAuth } from "../../../../features/auth/auth.hooks";

export default function PracticeSignInPage() {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useAuth();

  const onSubmit = async (email: string, password: string) => {
    try {
      await handleLogin(email, password);
      navigate("/practice/dashboard");
    } catch {
      // error handled in hook
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white">
      {/* LEFT */}
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Practice Login</h1>

          <SignInForm
            onSubmit={onSubmit}
            loading={loading}
            error={error || ""} 
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex flex-1 bg-orange-500 justify-center items-center">
        <img src={loginimg} className="max-w-md" alt="Login Illustration" />
      </div>
    </div>
  );
}