import React, { useState } from "react";
import { usePredict, usePredictionPlot, usePredictionTest, useAvailableAreas, usePredictByArea, useHeatmap } from "../hooks/usePredictions";
import HeatmapViewer from "../components/heatmapViewer";
import { downloadImagesAsZip } from "~/lib/imageDownload";

export default function Predictions() {
  const [nMonths, setNMonths] = useState(2);

  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);

  const { data: predictData, loading: predictLoading, error: predictError, fetch: fetchPredict } = usePredict();
  const { result: testResult, loading: testLoading, error: testError, fetch: fetchTest } = usePredictionTest();
  const { plotData, loading: plotLoading, error: plotError, fetch: fetchPlot } = usePredictionPlot();
  const { imageUrl } = useHeatmap();
  const [hasFetched, setHasFetched] = useState(false);

  const handleFetchAll = () => {
    fetchPredict(nMonths);
    fetchTest(nMonths);
    fetchPlot(nMonths);
  };
  const { areas, loading: areasLoading, error: areasError, retry: retryAreas } = useAvailableAreas();



  const {
    forecast,
    loading: areaLoading,
    error: areaError,
    fetch: fetchPredictionByArea,
    retry: retryPrediction,
  } = usePredictByArea(selectedArea, nMonths);


  return (
    <section className="space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-center">📈 Prediksi</h1>

      <div className="space-y-8">
        {/* 🔁 Centralized Controls */}
        <div className="flex gap-4 items-center">
          <label className="font-medium">
            Bulan yang ingin diprediksi:
            <input
              type="number"
              min={1}
              max={12}
              value={nMonths}
              onChange={(e) => setNMonths(Number(e.target.value))}
              className="ml-2 w-20 border rounded px-2 py-1"
            />
          </label>
          <button
            onClick={handleFetchAll}
            disabled={plotLoading || predictLoading || testLoading}
            className={`px-4 py-2 rounded text-white ${plotLoading || predictLoading || testLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            🔄{" "}
            {plotLoading || predictLoading || testLoading
              ? "Memuat..."
              : "Tampilkan Prediksi"}
          </button>
        </div>

        {/* 1. Grafik Prediksi */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Hasil Prediksi Per Bulan</h2>
          {plotLoading ? (
            <p>⌛ Loading grafik...</p>
          ) : plotError ? (
            <p className="text-red-600">❌ Error: {plotError}</p>
          ) : plotData?.image_base64 ? (
            <img
              src={`data:image/png;base64,${plotData.image_base64}`}
              alt="Grafik Prediksi"
              className="w-full max-w-3xl mx-auto rounded shadow"
            />
          ) : (
            <p>Grafik belum tersedia.</p>
          )}
        </div>

        {/* 2. Angka Prediksi */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Angka Prediksi</h2>
          {predictLoading ? (
            <p>⌛ Loading data prediksi...</p>
          ) : predictError ? (
            <p className="text-red-600">❌ Error: {predictError}</p>
          ) : predictData ? (
            <ul className="list-disc pl-6">
              {predictData.forecast.map((item, index) => (
                <li key={index}>
                  {item.month}: <strong>{item.predicted_cases}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Data prediksi tidak tersedia.</p>
          )}
        </div>

        {/* 3. Evaluasi Model */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Evaluasi Model</h2>
          {testLoading ? (
            <p>⌛ Loading evaluasi...</p>
          ) : testError ? (
            <p className="text-red-600">❌ Error: {testError}</p>
          ) : testResult ? (
            <div className="space-y-2">
              <p>
                📊 MAE: <strong>{testResult.evaluation.mae}</strong>
              </p>
              <p>
                📉 RMSE: <strong>{testResult.evaluation.rmse}</strong>
              </p>
              <p>
                📈 MAPE: <strong>{testResult.evaluation.mape}</strong>
              </p>
            </div>
          ) : (
            <p>Evaluasi belum tersedia.</p>
          )}
        </div>
      </div>
      {/* 4. Prediksi Berdasarkan Area */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Prediksi Berdasarkan Area</h2>

        {areasLoading ? (
          <p className="text-gray-600">⌛ Loading daftar wilayah...</p>
        ) : areasError ? (
          <div>
            <p className="text-red-600">❌ Error: {areasError}</p>
            <button
              onClick={retryAreas}
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded"
            >
              🔁 Coba Lagi
            </button>
          </div>
        ) : (
          <div>
            <label className="block mb-1 font-medium">Pilih Area:</label>
            <select
              value={selectedArea || ""}
              onChange={(e) => setSelectedArea(e.target.value || null)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Pilih Area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setHasFetched(true);
                fetchPredictionByArea();
              }}
              disabled={!selectedArea}
              className={`mt-3 px-4 py-2 rounded text-white ${!selectedArea
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              🔍 Tampilkan Prediksi Area
            </button>
          </div>
        )}

        {hasFetched && selectedArea && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Hasil Prediksi untuk: <span className="underline">{selectedArea}</span>
            </h3>

            {areaLoading ? (
              <p className="text-gray-700">⌛ Loading prediksi area...</p>
            ) : areaError ? (
              <div>
                <p className="text-red-600">❌ Error: {areaError}</p>
                <button
                  onClick={retryPrediction}
                  className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded"
                >
                  🔁 Coba Lagi
                </button>
              </div>
            ) : forecast && forecast.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-800">
                {forecast.map((item, index) => (
                  <li key={index}>
                    {item.month}: <strong>{item.predicted_cases}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Data prediksi tidak tersedia.</p>
            )}
          </div>
        )}
      </div>

      <HeatmapViewer />

      {/* 5. Unduh Semua */}
      <div className="pt-6">
        <h2 className="text-2xl font-semibold mb-2">5. Unduh Seluruh Hasil Prediksi</h2>
        <button
          onClick={() => {
            const images: Record<string, string> = {};

            if (plotData?.image_base64) {
              images["plot_prediksi"] = plotData.image_base64;
            }
            if (imageUrl?.full_map_base64) {
              images["heatmap_semua_area"] = imageUrl.full_map_base64;
            }
            if (imageUrl?.focused_map_base64) {
              images["heatmap_area_terfokus"] = imageUrl.focused_map_base64;
            }

            if (Object.keys(images).length === 0) {
              alert("Belum ada gambar untuk diunduh.");
              return;
            }

            downloadImagesAsZip(images);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📁 Unduh Semua Gambar (.zip)
        </button>
      </div>
    </section>
  );
}
