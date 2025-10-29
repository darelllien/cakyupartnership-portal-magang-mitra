import { useState, useEffect } from "react";
import axios from "axios";

import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import FilterBar from "./components/FilterBar";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
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
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="App">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-500 mb-2">
          💼 Job Portal
        </h1>
        <p className="text-gray-600 text-base">
          Temukan atau kelola lowongan pekerjaan profesional Anda
        </p>
      </header>

      <FilterBar
        search={search}
        setSearch={setSearch}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        locations={uniqueLocations}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <JobForm
            job={editingJob || undefined}
            onFormSubmit={handleFormSubmit}
            onCancel={() => setEditingJob(null)}
          />
        </div>

        <div className="lg:w-2/3">
          <JobList
            jobs={filteredJobs}
            onEdit={setEditingJob}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
