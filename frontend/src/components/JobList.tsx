import React from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JobListProps {
  jobs: Job[];
  onDelete?: (id: number) => void;
  onEdit?: (job: Job) => void;
  userRole?: "admin" | "user"; // ✅ tambahkan prop untuk role
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  onDelete,
  onEdit,
  userRole,
}) => {
  // ✅ fallback kalau prop belum ada
  const role =
    userRole ||
    (() => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.role || null;
      } catch {
        return null;
      }
    })();

  if (jobs.length === 0) {
    return (
      <p className="text-gray-600 italic text-center py-6">
        Tidak ada lowongan pekerjaan.
      </p>
    );
  }

  const handleApply = (jobTitle: string) => {
    alert(`Anda telah melamar untuk posisi ${jobTitle}.`);
  };

  const handleContact = (company: string) => {
    alert(`Hubungi HRD ${company} melalui email resmi perusahaan.`);
  };

  return (
    <div className="job-list mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Daftar Lowongan Pekerjaan
      </h2>

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">
                  {job.company} •{" "}
                  <span className="text-gray-500">{job.location}</span>
                </p>
              </div>

              {/* ✅ Tombol hanya untuk admin */}
              {role === "admin" && (
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => onEdit?.(job)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(job.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            {/* ✅ Tombol Lamar & Kontak hanya untuk user */}
            {role === "user" && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApply(job.title)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Lamar
                </button>
                <button
                  onClick={() => handleContact(job.company)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Kontak
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
