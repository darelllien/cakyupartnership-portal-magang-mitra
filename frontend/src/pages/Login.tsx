import { useState } from "react";
import axiosInstance from "../lib/axiosInstance";

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", loginForm);

      console.log("Respon login:", res.data);

      const { token, user } = res.data;

      if (!token || !user) {
        setErrorMsg("Data login tidak valid dari server.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.username || user.name || user.email || "Unknown",
          role: user.role || "user",
        })
      );

      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Login gagal:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Login gagal, periksa username/password!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Login Portal</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-80"
      >
        <input
          type="text"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
          className="w-full mb-3 border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
          className="w-full mb-3 border border-gray-300 p-2 rounded"
          required
        />

        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-amber-400 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
