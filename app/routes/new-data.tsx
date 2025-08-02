import { useState } from "react";
import { useUploadDataset, useCreateSuspect } from "../hooks/useNewData";

export default function AddData() {
  const [file, setFile] = useState<File | null>(null);
  const { upload, uploading, error, result } = useUploadDataset();

  const handleUpload = () => {
    if (file) upload(file);
  };

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    domisili: "",
    gender: "",
  });

  const { create, loading, error: createError, success } = useCreateSuspect();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.domisili || !formData.gender) return;
    create({
      name: formData.name,
      age: parseInt(formData.age),
      domisili: formData.domisili,
      gender: formData.gender,
    });
  };


  return (
    <section className="space-y-10">
      <h1 className="text-3xl font-bold text-center">➕ Halaman Tambah Data</h1>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📝 1. Form Input Data Manual</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-lg shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Umur
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 45"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Tempat Domisili
              </label>
              <input
                type="text"
                name="domisili"
                value={formData.domisili}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Jakarta Selatan"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold text-white shadow ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>

            {createError && <p className="text-red-600 font-medium">❌ {createError}</p>}
            {success && <p className="text-green-600 font-medium">✅ {success}</p>}
          </div>
        </form>
      </div>

      {/* 2. XLSX Upload */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Unggah File Data (.xlsx)</h2>
        <div className="bg-white border border-gray-300 rounded-md p-6 shadow-sm space-y-4">
          <label
            htmlFor="xlsx-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-md py-6 px-4 cursor-pointer hover:border-blue-600 transition"
          >
            <span className="text-blue-700 font-medium">
              Klik di sini untuk memilih file .xlsx
            </span>
            <span className="text-sm text-gray-500 mt-1">
              File harus berformat Excel (.xlsx) dan sesuai dengan template
            </span>
            <input
              id="xlsx-upload"
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {file && (
            <p className="text-sm text-gray-800">
              📎 File terpilih: <strong>{file.name}</strong>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded text-white font-medium ${uploading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              } transition`}
          >
            {uploading ? "Mengunggah..." : "Unggah File"}
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2 bg-red-50 border border-red-300 p-2 rounded">
              ❌ {error}
            </p>
          )}

          {result && (
            <div className="text-sm text-green-700 mt-4 bg-green-50 border border-green-300 p-3 rounded">
              ✅ <strong>{result.message}</strong>
              <ul className="mt-2 list-disc list-inside">
                <li>📂 Nama File: <strong>{result.filename}</strong></li>
                <li>🕒 Waktu Unggah: {new Date(result.uploaded_at).toLocaleString()}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
