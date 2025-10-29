import React, { useState, useEffect } from "react";
import axios from "axios";

interface Job {
  id?: number;
  title: string;
  company: string;
  location: string;
  description: string;
}

interface JobFormProps {
  job?: Job;
  onFormSubmit: () => void;
  onCancel?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onFormSubmit, onCancel }) => {
  const [title, setTitle] = useState(job?.title || "");
  const [company, setCompany] = useState(job?.company || "");
  const [location, setLocation] = useState(job?.location || "");
  const [description, setDescription] = useState(job?.description || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(job?.title || "");
    setCompany(job?.company || "");
    setLocation(job?.location || "");
    setDescription(job?.description || "");
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newJob = { title, company, location, description };

    try {
      if (job?.id) {
        await axios.put(`http://localhost:5000/api/jobs/${job.id}`, newJob);
      } else {
        await axios.post("http://localhost:5000/api/jobs", newJob);
      }
      onFormSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h3>{job ? "Edit Lowongan" : "Tambah Lowongan"}</h3>

      <label>Judul Pekerjaan:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Nama Perusahaan:</label>
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />

      <label>Lokasi:</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <label>Deskripsi:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Memproses..." : job ? "Simpan Perubahan" : "Tambah"}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;
