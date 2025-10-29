import React, { useState, useEffect } from "react";
import axios from "axios";

interface Job {
  id?: number;
  title: string;
  company: string;
  location: string;
  description?: string; // ✅ sekarang opsional, agar tidak bentrok dengan App.tsx
  link?: string | null;
  contact?: string | null;
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
  const [link, setLink] = useState(job?.link || "");
  const [contact, setContact] = useState(job?.contact || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(job?.title || "");
    setCompany(job?.company || "");
    setLocation(job?.location || "");
    setDescription(job?.description || "");
    setLink(job?.link || "");
    setContact(job?.contact || "");
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newJob = {
      title,
      company,
      location,
      description,
      link,
      contact,
    };

    try {
      if (job?.id) {
        await axios.put(`http://localhost:5000/api/jobs/${job.id}`, newJob);
      } else {
        await axios.post("http://localhost:5000/api/jobs", newJob);
      }
      onFormSubmit();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h3 className="text-xl font-semibold mb-2 text-amber-600">
        {job ? "✏️ Edit Lowongan" : "➕ Tambah Lowongan"}
      </h3>

      <div className="space-y-2">
        <label className="font-medium">Judul Pekerjaan:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded-lg w-full px-3 py-2"
          placeholder="Contoh: Frontend Developer Intern"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Nama Perusahaan:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="border rounded-lg w-full px-3 py-2"
          placeholder="Contoh: PT Cakrawala Tech"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Lokasi:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="border rounded-lg w-full px-3 py-2"
          placeholder="Contoh: Surabaya"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Deskripsi:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="border rounded-lg w-full px-3 py-2"
          placeholder="Tulis deskripsi singkat pekerjaan..."
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Link Pendaftaran (opsional):</label>
        <input
          type="url"
          value={link ?? ""}
          onChange={(e) => setLink(e.target.value)}
          className="border rounded-lg w-full px-3 py-2"
          placeholder="https://contoh.com/apply"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Kontak HR (opsional):</label>
        <input
          type="email"
          value={contact ?? ""}
          onChange={(e) => setContact(e.target.value)}
          className="border rounded-lg w-full px-3 py-2"
          placeholder="hr@perusahaan.com"
        />
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all"
        >
          {loading
            ? "⏳ Memproses..."
            : job
            ? "💾 Simpan Perubahan"
            : "✅ Tambah"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-all"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;
