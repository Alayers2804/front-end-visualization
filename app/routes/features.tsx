import { useState } from "react";
import {
  useFeaturePlot,
  useImportantFeatures
} from "../hooks/useFeatureImportance";

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

export default function Features() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { plot, loading: loadingPlot, error: errorPlot } = useFeaturePlot(selected, true, refreshKey);
  const { data: importanceData, loading: loadingImportance, error: errorImportance } = useImportantFeatures(selected, refreshKey);

  const toggleFeature = (feature: string) => {
    setSelected(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const removeFeature = (feature: string) => {
    setSelected(prev => prev.filter(f => f !== feature));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setRefreshKey(prev => prev + 1);
  };

  const retry = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Feature Analysis</h2>

      <div className="space-y-4">
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
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    isSelected
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
          <div className="flex flex-wrap gap-2">
            {selected.map(feature => (
              <span
                key={feature}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1 text-blue-500 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <button
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            Tampilkan
          </button>
        </div>
      </div>

      {submitted && (loadingPlot || loadingImportance) && <p>Loading data...</p>}

      {submitted && (errorPlot || errorImportance) && (
        <div className="text-red-500">
          <p>{errorPlot || errorImportance}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={retry}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {submitted && !loadingPlot && plot?.image_base64 && (
        <div>
          <h3 className="text-xl font-medium mb-2">Feature Plot</h3>
          <img
            src={`data:image/png;base64,${plot.image_base64}`}
            alt="Feature Plot"
            className="border rounded"
          />
        </div>
      )}

      {submitted && !loadingImportance && importanceData && (
        <div>
          <h3 className="text-xl font-medium mb-2">Feature Relevance</h3>
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Feature</th>
                <th className="border px-4 py-2 text-left">Variance Score</th>
                <th className="border px-4 py-2 text-left">Entropy Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(importanceData.feature_relevance).map(
                ([feature, score]) => (
                  <tr key={feature}>
                    <td className="border px-4 py-1">{feature}</td>
                    <td className="border px-4 py-1">
                      {score.variance_score.toFixed(3)}
                    </td>
                    <td className="border px-4 py-1">
                      {score.entropy_score.toFixed(3)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
