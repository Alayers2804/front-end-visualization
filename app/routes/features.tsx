import { useState } from "react";
import { useFeaturePlot, useImportantFeatures } from "../hooks/useFeatureImportance";

const defaultFeatures = ["USIA", "PEKERJAAN", "PENDIDIKAN TERAKHIR"];

export default function Features() {
  const [features, setFeatures] = useState<string[]>(defaultFeatures);
  const [refreshKey, setRefreshKey] = useState(0); // <--- added

  const {
    plot,
    loading: loadingPlot,
    error: errorPlot
  } = useFeaturePlot(features, true, refreshKey); // pass refreshKey

  const {
    data: importanceData,
    loading: loadingImportance,
    error: errorImportance
  } = useImportantFeatures(features, refreshKey); // pass refreshKey

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    const parsedFeatures = input
      .split(",")
      .map(f => f.trim().toUpperCase())
      .filter(f => f.length > 0);
    setFeatures(parsedFeatures);
  };

  const retry = () => setRefreshKey(prev => prev + 1); // <--- retry button handler

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Feature Analysis</h2>

      <div>
        <label htmlFor="features" className="block font-medium mb-2">
          Features (comma-separated):
        </label>
        <textarea
          id="features"
          rows={2}
          className="w-full border rounded-md p-2"
          defaultValue={defaultFeatures.join(", ")}
          onChange={handleChange}
        />
      </div>

      {(loadingPlot || loadingImportance) && <p>Loading data...</p>}

      {(errorPlot || errorImportance) && (
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

      {!loadingPlot && plot?.image_base64 && (
        <div>
          <h3 className="text-xl font-medium mb-2">Feature Plot</h3>
          <img
            src={`data:image/png;base64,${plot.image_base64}`}
            alt="Feature Plot"
            className="border rounded"
          />
        </div>
      )}

      {!loadingImportance && importanceData && (
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
