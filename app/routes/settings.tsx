import { useState } from "react";
import { useListDatasets } from "../hooks/useSettings";

export default function Settings() {
  const { datasets, loading, error } = useListDatasets();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedDataset = datasets.find((d) => d.filename === selected);

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center">
        ⚙️ Pengaturan Dataset
      </h1>

      <div className="bg-white border border-gray-300 rounded-lg shadow p-6 space-y-5">
        <label className="block text-lg font-semibold text-gray-800">
          📑 Pilih Dataset yang Akan Digunakan:
        </label>

        {loading && <p className="text-blue-600 font-medium">🔄 Memuat daftar dataset...</p>}
        {error && <p className="text-red-600 font-medium">❌ {error}</p>}

        {!loading && datasets.length === 0 && (
          <p className="text-gray-500 italic">Belum ada dataset yang diunggah.</p>
        )}

        {!loading && datasets.length > 0 && (
          <select
            value={selected || ""}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-white border border-gray-400 rounded-md p-3 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Dataset --</option>
            {datasets.map((dataset) => (
              <option key={dataset.id} value={dataset.filename}>
                {dataset.filename}
              </option>
            ))}
          </select>
        )}

        {selectedDataset && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-md shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-3">📋 Detail Dataset Terpilih:</h3>
            <p className="text-gray-700">
              <strong>📂 Nama File:</strong> {selectedDataset.filename}
            </p>
            <p className="text-gray-700">
              <strong>🕒 Diunggah:</strong>{" "}
              {new Date(selectedDataset.uploaded_at).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>📁 Lokasi File:</strong> {selectedDataset.path}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
