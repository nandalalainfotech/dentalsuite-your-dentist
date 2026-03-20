import { useState } from "react";

interface Props {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: string;
}

export default function SignInForm({ onSubmit, loading, error }: Props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData.email, formData.password);
      }}
      className="flex flex-col gap-4"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="border px-4 py-3 rounded-xl"
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="border px-4 py-3 rounded-xl"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white py-3 rounded-xl"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}