import { useState } from "react";

import { useImportantFeatures, useFeaturePlot } from "../hooks/useFeatureImportance";

const allAvailableFeatures = [
  "USIA",
  "PEKERJAAN",
  "PENDIDIKAN TERAKHIR",
  "DOMISILI",
  "JENIS KELAMIN",
  "AGAMA",
  "PASAL YANG DISANGKAKAN"
];

export default function Features() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    plot,
    loading: loadingPlot,
    error: errorPlot,
    fetchPlot,
  } = useFeaturePlot();

  const {
    data: importance,
    loading: loadingImportance,
    error: errorImportance,
    fetchImportance,
  } = useImportantFeatures();

  const toggleFeature = (feature: string) => {
    setSelected((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const removeFeature = (feature: string) => {
    setSelected((prev) => prev.filter((f) => f !== feature));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    await Promise.all([
      fetchPlot(selected),
      fetchImportance(selected)
    ]);
  };

  const loading = loadingPlot || loadingImportance;
  const error = errorPlot || errorImportance;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">🔍 Feature Analysis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="font-medium mb-2">Klik fitur untuk memilih:</p>
          <div className="flex flex-wrap gap-2">
            {allAvailableFeatures.map((feature) => {
              const isSelected = selected.includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
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
            {selected.map((feature) => (
              <span
                key={feature}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
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
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={selected.length === 0 || loading}
        >
          {error ? "🔁 Coba Lagi" : loading ? "Memuat..." : "Tampilkan"}
        </button>
      </form>

      {submitted && loading && <p>🔄 Memuat data fitur...</p>}
      {submitted && error && <p className="text-red-500 mt-2">❌ {error}</p>}

      {submitted && !loading && plot?.image_base64 && (
        <div>
          <h3 className="text-xl font-medium mb-2">📊 Visualisasi Fitur</h3>
          <img
            src={`data:image/png;base64,${plot.image_base64}`}
            alt="Feature Plot"
            className="border rounded"
          />
        </div>
      )}

      {submitted && !loading && importance && (
        <div>
          <h3 className="text-xl font-medium mb-2">📈 Relevansi Fitur</h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-gray-700">Feature</th>
                <th className="border px-4 py-2 text-left text-gray-700">Variance Score</th>
                <th className="border px-4 py-2 text-left text-gray-700">Entropy Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(importance.feature_relevance).map(([feature, score]) => (
                <tr key={feature}>
                  <td className="border px-4 py-1">{feature}</td>
                  <td className="border px-4 py-1">{score.variance_score.toFixed(3)}</td>
                  <td className="border px-4 py-1">{score.entropy_score.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

}
