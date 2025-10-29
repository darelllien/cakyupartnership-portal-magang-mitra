import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm({
  onLogin,
}: {
  onLogin: (user: any, token: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // ✅ Ambil token dan role dari response
      const { token, role } = res.data;

      // ✅ Simpan ke localStorage agar bisa diakses oleh halaman lain
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ✅ Panggil callback untuk update state global (jika ada)
      onLogin({ username, role }, token);

      // ✅ Arahkan ke dashboard sesuai role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }

      // ✅ Paksa reload agar layout dan komponen lain langsung update
      // (tanpa perlu refresh manual)
      window.location.reload();
    } catch (e: any) {
      console.error("Login error:", e);
      setErr(e?.response?.data?.message || "Login gagal, periksa data Anda.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 max-w-sm mx-auto p-4 bg-white rounded-lg shadow"
    >
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      {err && <p className="text-red-500 text-sm text-center">{err}</p>}
    </form>
  );
}
