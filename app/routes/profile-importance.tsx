import { useState } from "react";
import { useProfilePlot, useProfileSummary } from "../hooks/useProfileFeature"; // Adjust path as needed

const defaultFeatures = ["USIA", "PEKERJAAN", "PENDIDIKAN TERAKHIR"];

export default function ProfileImportance() {
  const [features, setFeatures] = useState<string[]>(defaultFeatures);

  const { images, error: plotError } = useProfilePlot(features);
  const { summary, error: summaryError } = useProfileSummary();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    const parsed = input
      .split(",")
      .map(f => f.trim().toUpperCase())
      .filter(f => f.length > 0);
    setFeatures(parsed);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Profil Feature Importance</h2>

      <div>
        <label htmlFor="features" className="block font-medium mb-2">
          Features to Analyze (comma-separated):
        </label>
        <textarea
          id="features"
          rows={2}
          className="w-full border rounded-md p-2"
          defaultValue={defaultFeatures.join(", ")}
          onChange={handleChange}
        />
      </div>

      {(plotError || summaryError) && (
        <p className="text-red-500">
          {plotError || summaryError}
        </p>
      )}

      {images?.image_base64 && (
        <div>
          <h3 className="text-xl font-medium mb-2">Profil Plot</h3>
          <img
            src={`data:image/png;base64,${images.image_base64}`}
            alt="Profil Feature Plot"
            className="border rounded"
          />
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
