import { useState } from "react";
import { useUploadDataset, useCreateSuspect } from "../hooks/useProcessData";
import FormInput from "../components/formInput";

export default function AddData() {
  const [file, setFile] = useState<File | null>(null);
  const { upload, uploading, error: uploadError, result } = useUploadDataset();

  const handleUpload = () => {
    if (file) upload(file);
  };

  const [formData, setFormData] = useState({
    tanggal: "",
    no_register: "",
    nama_tersangka: "",
    no_lkn: "",
    domisili: "",
    pasal_disangkakan: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    agama: "",
    usia: 0,
    pendidikan_terakhir: "",
    pekerjaan: "",
    rekomendasi_tat: "",
  });

  const { create, loading, error: createError, success } = useCreateSuspect();

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
  
      // If tanggal_lahir is changed, recalculate usia
      if (name === "tanggal_lahir" && value) {
        const birthDate = new Date(value);
        const today = new Date();
  
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
  
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
  
        updated.usia = age >= 0 ? age : 0;
      }
  
      return updated;
    });
  };
  

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.tanggal) errors.tanggal = "Tanggal Penangkapan wajib diisi.";
    if (!formData.nama_tersangka.trim()) errors.nama_tersangka = "Nama Tersangka wajib diisi.";
    if (!formData.usia || isNaN(Number(formData.usia))) errors.usia = "Usia harus berupa angka.";
    if (!formData.jenis_kelamin) errors.jenis_kelamin = "Jenis kelamin wajib dipilih.";
    if (!formData.tanggal_lahir) errors.tanggal_lahir = "Tanggal lahir wajib diisi.";

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }

    create({
      ...formData,
      usia: formData.usia ? Number(formData.usia) : 0,
      tanggal: new Date(formData.tanggal).toISOString().split("T")[0],
      tanggal_lahir: new Date(formData.tanggal_lahir).toISOString().split("T")[0],
    });
  };

  return (
    <section className="space-y-10">
      <h1 className="text-3xl font-bold text-center">➕ Halaman Tambah Data</h1>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📝 1. Form Input Data Manual</h2>

        <form onSubmit={handleSubmit} className="bg-white border p-6 space-y-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Tanggal Penangkapan"
              name="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={handleChange}
              required
              error={localErrors.tanggal || createError?.tanggal}
            />
            <FormInput
              label="No Register"
              name="no_register"
              value={formData.no_register}
              onChange={handleChange}
              required
              error={createError?.no_register}
            />
            <FormInput
              label="Nama Tersangka"
              name="nama_tersangka"
              value={formData.nama_tersangka}
              onChange={handleChange}
              required
              error={localErrors.nama_tersangka || createError?.nama_tersangka}
            />
            <FormInput label="No LKN" name="no_lkn" value={formData.no_lkn} onChange={handleChange} required />
            <FormInput label="Domisili" name="domisili" value={formData.domisili} onChange={handleChange} required />
            <FormInput label="Pasal Disangkakan" name="pasal_disangkakan" value={formData.pasal_disangkakan} onChange={handleChange} required />
            <FormInput
              label="Jenis Kelamin"
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
              selectOptions={[
                { label: "Laki-laki", value: "L" },
                { label: "Perempuan", value: "P" },
              ]}
              error={localErrors.jenis_kelamin || createError?.jenis_kelamin}
            />
            <FormInput label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required />
            <FormInput
              label="Tanggal Lahir"
              name="tanggal_lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              error={localErrors.tanggal_lahir || createError?.tanggal_lahir}
            />
            <FormInput
              label="Agama"
              name="agama"
              value={formData.agama}
              onChange={handleChange}
              required
              selectOptions={[
                { label: "Islam", value: "Islam" },
                { label: "Kristen", value: "Kristen" },
                { label: "Katolik", value: "Katolik" },
                { label: "Hindu", value: "Hindu" },
                { label: "Budha", value: "Budha" },
                { label: "Konghucu", value: "Konghucu" },
              ]}
            />
            <FormInput label="Usia" name="usia" type="number" value={formData.usia} onChange={handleChange} required error={localErrors.usia} readOnly/>
            <FormInput label="Pendidikan Terakhir" name="pendidikan_terakhir" value={formData.pendidikan_terakhir} onChange={handleChange} required />
            <FormInput label="Pekerjaan" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required />
            <FormInput label="Rekomendasi TAT" name="rekomendasi_tat" value={formData.rekomendasi_tat} onChange={handleChange} required />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold text-white shadow ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>

            {success && <p className="text-green-600 font-medium">✅ {success}</p>}
          </div>
        </form>
      </div>

      {/* XLSX Upload Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Unggah File Data (.xlsx)</h2>
        <div className="bg-white border border-gray-300 rounded-md p-6 shadow-sm space-y-4">
          <label
            htmlFor="xlsx-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-md py-6 px-4 cursor-pointer hover:border-blue-600 transition"
          >
            <span className="text-blue-700 font-medium">Klik di sini untuk memilih file .xlsx</span>
            <span className="text-sm text-gray-500 mt-1">File harus berformat Excel (.xlsx) dan sesuai dengan template</span>
            <input id="xlsx-upload" type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
          </label>

          {file && <p className="text-sm text-gray-800">📎 File terpilih: <strong>{file.name}</strong></p>}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded text-white font-medium ${
              uploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {uploading ? "Mengunggah..." : "Unggah File"}
          </button>

          {uploadError && <p className="text-sm text-red-600 mt-2 bg-red-50 border border-red-300 p-2 rounded">❌ {uploadError}</p>}

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
