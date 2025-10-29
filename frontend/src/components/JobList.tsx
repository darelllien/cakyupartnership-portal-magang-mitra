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
  onDelete: (id: number) => void;
  onEdit: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete, onEdit }) => {
  if (jobs.length === 0) {
    return <p>Tidak ada lowongan pekerjaan.</p>;
  }

  return (
    <div className="job-list">
      <h2>Daftar Lowongan Pekerjaan</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>
              {job.company} | {job.location}
            </p>
            <p>{job.description}</p>
            <div className="card-actions">
              <button onClick={() => onEdit(job)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => onDelete(job.id)} className="btn-delete">
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
