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
  userRole?: "admin" | "user";
  grid?: boolean;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  onDelete,
  onEdit,
  userRole,
  grid = true,
}) => {
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

      <div
        className={
          grid
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch"
            : "flex flex-col gap-4"
        }
      >
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between h-full"
          >
            <div>
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                <p className="text-gray-600 text-sm">
                  {job.company} •{" "}
                  <span className="text-gray-500">{job.location}</span>
                </p>
              </div>

              <p className="text-gray-700 mb-4 text-sm line-clamp-4">
                {job.description}
              </p>
            </div>

            {role === "user" && (
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleApply(job.title)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  Lamar
                </button>
                <button
                  onClick={() => handleContact(job.company)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  Kontak
                </button>
              </div>
            )}

            {role === "admin" && (
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => onEdit?.(job)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(job.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
