import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";
import FilterBar from "../components/FilterBar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);

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
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page: number) => {
    try {
      const res = await axiosInstance.get(
        `/jobs?page=${page}&limit=${jobsPerPage}`
      );

      const data = res.data?.jobs || [];
      setJobs(data);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const handleFormSubmit = () => {
    fetchJobs(currentPage);
    setEditingJob(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      fetchJobs(currentPage);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const location = job.location?.toLowerCase() || "";

    const matchSearch =
      title.includes(search.toLowerCase()) ||
      company.includes(search.toLowerCase()) ||
      location.includes(search.toLowerCase());

    const matchLocation =
      filterLocation === "" || job.location === filterLocation;

    return matchSearch && matchLocation;
  });

  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location))
  ).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} handleLogout={handleLogout} />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          locations={uniqueLocations}
        />

        {user?.role === "admin" && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0074FF] text-white px-4 py-2 rounded-md hover:bg-[#005FCC] shadow"
            >
              + Tambah Lowongan
            </button>
          </div>
        )}

        <div className="w-full">
          <JobList
            jobs={filteredJobs}
            userRole={user?.role || "user"}
            onEdit={user?.role === "admin" ? setEditingJob : undefined}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
            grid={true}
          />
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-[#0074FF] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <Footer />

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2 className="text-xl font-bold mb-4 text-[#0074FF]">
            Tambah Lowongan
          </h2>

          <JobForm
            onFormSubmit={() => {
              handleFormSubmit();
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {editingJob && (
        <Modal onClose={() => setEditingJob(null)}>
          <h2 className="text-xl font-bold mb-4 text-[#0074FF]">
            Edit Lowongan
          </h2>

          <JobForm
            job={editingJob}
            onFormSubmit={handleFormSubmit}
            onCancel={() => setEditingJob(null)}
          />
        </Modal>
      )}
    </div>
  );
}
