import { useState, useEffect } from "react";
import axios from "axios";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import FilterBar from "./components/FilterBar";

axios.defaults.baseURL = "http://localhost:5000";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  link?: string;
  contact?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  username: string;
  role: "admin" | "user";
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // ========================
  // Saat pertama kali load
  // ========================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      // 🧩 Cegah error JSON.parse("undefined")
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          checkAuth();
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }

    fetchJobs();
  }, []);

  // ========================
  // AUTH
  // ========================
  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/login", loginForm);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setLoginForm({ username: "", password: "" });
      window.location.reload();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Login gagal");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ========================
  // JOB CRUD
  // ========================
  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = () => {
    fetchJobs();
    setEditingJob(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ========================
  // FILTER
  // ========================
  const filteredJobs = jobs.filter((job) => {
    const title = job.title ?? "";
    const company = job.company ?? "";
    const location = job.location ?? "";

    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchLocation = filterLocation === "" || location === filterLocation;
    return matchSearch && matchLocation;
  });

  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location)));

  // ========================
  // RENDER
  // ========================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
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
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full mb-3 border border-gray-300 p-2 rounded"
          />
          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="App max-w-7xl mx-auto px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-amber-600 mb-2 flex items-center gap-2">
            💼 Partnership Cakrawala
          </h1>
          <p className="text-gray-600 text-base">
            Selamat datang,{" "}
            <span className="font-semibold text-amber-700">
              {user.username} ({user.role})
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <FilterBar
        search={search}
        setSearch={setSearch}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        locations={uniqueLocations}
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {user.role === "admin" && (
          <div className="lg:w-1/3">
            <JobForm
              job={editingJob || undefined}
              onFormSubmit={handleFormSubmit}
              onCancel={() => setEditingJob(null)}
            />
          </div>
        )}

        <div className={user.role === "admin" ? "lg:w-2/3" : "w-full"}>
          <JobList
            jobs={filteredJobs}
            userRole={user.role}
            onEdit={user.role === "admin" ? setEditingJob : undefined}
            onDelete={user.role === "admin" ? handleDelete : undefined}
          />
        </div>
      </div>
    </div>
  );
}
