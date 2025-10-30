import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";
import FilterBar from "../components/FilterBar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

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

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal parsing user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    fetchJobs();
  }, []);

  console.log("User dari localStorage:", localStorage.getItem("user"));

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.jobs)
        ? res.data.jobs
        : [];
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const handleFormSubmit = () => {
    fetchJobs();
    setEditingJob(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        const title = job.title ?? "";
        const company = job.company ?? "";
        const location = job.location ?? "";

        const matchSearch =
          title.toLowerCase().includes(search.toLowerCase()) ||
          company.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase());

        const matchLocation =
          filterLocation === "" || location === filterLocation;

        return matchSearch && matchLocation;
      })
    : [];

  const uniqueLocations = Array.isArray(jobs)
    ? Array.from(new Set(jobs.map((job) => job.location)))
    : [];

  return (
    <div className="App max-w-7xl mx-auto px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-amber-600 mb-2 flex items-center gap-2">
            💼 Partnership Cakrawala
          </h1>
          {user && (
            <p className="text-gray-600 text-base">
              Selamat datang,{" "}
              <span className="font-semibold text-amber-700">
                {user.username} ({user.role})
              </span>
            </p>
          )}
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
        {user?.role === "admin" && (
          <div className="lg:w-1/3">
            <JobForm
              job={editingJob || undefined}
              onFormSubmit={handleFormSubmit}
              onCancel={() => setEditingJob(null)}
            />
          </div>
        )}

        <div className={user?.role === "admin" ? "lg:w-2/3" : "w-full"}>
          <JobList
            jobs={filteredJobs}
            userRole={user?.role || "user"}
            onEdit={user?.role === "admin" ? setEditingJob : undefined}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
          />
        </div>
      </div>
    </div>
  );
}
