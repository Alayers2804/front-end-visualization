import { useState } from "react";
import { useProfilePlot, useProfileSummary } from "../hooks/useProfileFeature";

const allAvailableFeatures = [
  "USIA",
  "PEKERJAAN",
  "PENDIDIKAN TERAKHIR",
  "PENGHASILAN",
  "STATUS PERNIKAHAN",
  "JUMLAH ANAK",
  "LOKASI",
  "PENGALAMAN KERJA",
  "GENDER"
];

export default function ProfileImportance() {
  const [selected, setSelected] = useState<string[]>([]);

  const {
    images,
    error: plotError,
    retry: fetchPlot
  } = useProfilePlot(selected);

  const {
    summary,
    error: summaryError,
    retry: fetchSummary
  } = useProfileSummary();

  const toggleFeature = (feature: string) => {
    setSelected(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const removeFeature = (feature: string) => {
    setSelected(prev => prev.filter(f => f !== feature));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlot();
    fetchSummary();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Profil Feature Importance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="block font-medium mb-2">
            Klik fitur untuk memilih (klik lagi untuk batal):
          </p>
          <div className="flex flex-wrap gap-2">
            {allAvailableFeatures.map(feature => {
              const isSelected = selected.includes(feature);
              return (
                <button
                  type="button"
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.map(f => (
              <span
                key={f}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2"
              >
                {f}
                <button
                  type="button"
                  onClick={() => removeFeature(f)}
                  className="text-blue-800 hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={selected.length === 0}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Tampilkan
        </button>
      </form>

      {(plotError || summaryError) && (
        <div className="space-y-2">
          {plotError && (
            <div className="text-red-500">
              <p>Error loading plot: {plotError}</p>
              <button
                onClick={fetchPlot}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Coba lagi
              </button>
            </div>
          )}
          {summaryError && (
            <div className="text-red-500">
              <p>Error loading summary: {summaryError}</p>
              <button
                onClick={fetchSummary}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Coba lagi
              </button>
            </div>
          )}
        </div>
      )}

      {images?.images_base64 && (
        <div>
          <h3 className="text-xl font-medium mb-2">Profil Plot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(images.images_base64).map(([feature, base64]) => (
              <div key={feature} className="border rounded p-2">
                <h4 className="text-sm font-semibold mb-2">{feature}</h4>
                <img
                  src={`data:image/png;base64,${base64}`}
                  alt={`Plot for ${feature}`}
                  className="w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div>
          <h3 className="text-xl font-medium mb-2">Profil Summary</h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Feature</th>
                <th className="border px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-1">{key}</td>
                  <td className="border px-4 py-1 whitespace-pre-wrap">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value?.toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
