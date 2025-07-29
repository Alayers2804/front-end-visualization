import React from "react";
import { usePredict, usePredictionPlot, usePredictionTest } from "../hooks/usePredictions";

export default function Predictions() {
  const [retryKey, setRetryKey] = React.useState(0); // for forcing re-fetch

  // Hooks: they re-run on `retryKey` change
  const {
    data: predictData,
    loading: predictLoading,
    error: predictError,
  } = usePredict(2, "JUMLAH_KASUS");

  const {
    plotData,
    loading: plotLoading,
    error: plotError,
  } = usePredictionPlot(2, "JUMLAH_KASUS", true);

  const {
    result: testResult,
    loading: testLoading,
    error: testError,
  } = usePredictionTest(3, "JUMLAH_KASUS");

  const retry = () => setRetryKey(prev => prev + 1);

  return (
    <section className="space-y-12">
      <h1 className="text-3xl font-bold mb-6 text-center">📈 Prediksi</h1>

      {/* 1. Hasil Prediksi Per Bulan */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Hasil Prediksi Per Bulan</h2>

        {plotLoading ? (
          <p>Loading grafik...</p>
        ) : plotError ? (
          <p className="text-red-600">Error: {plotError}</p>
        ) : plotData?.image_base64 ? (
          <img
            src={`data:image/png;base64,${plotData.image_base64}`}
            alt="Grafik Prediksi"
            className="w-full max-w-3xl mx-auto rounded shadow"
          />
        ) : (
          <p>Grafik tidak tersedia.</p>
        )}

        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Ulangi Prediksi Bulanan
        </button>
      </div>

      {/* 2. Hasil Angka Prediksi */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Angka Prediksi</h2>

        {predictLoading ? (
          <p>Loading data prediksi...</p>
        ) : predictError ? (
          <p className="text-red-600">Error: {predictError}</p>
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

        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Ulangi Angka Prediksi
        </button>
      </div>

      {/* 3. Evaluasi Akurasi Model */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Evaluasi Model</h2>

        {testLoading ? (
          <p>Loading evaluasi...</p>
        ) : testError ? (
          <p className="text-red-600">Error: {testError}</p>
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

        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Ulangi Evaluasi
        </button>
      </div>

      {/* 4. Unduh Semua */}
      <div className="pt-6">
        <h2 className="text-2xl font-semibold mb-2">4. Unduh Seluruh Hasil Prediksi</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          📁 Unduh Semua Gambar Prediksi (.zip)
        </button>
      </div>
    </section>
  );
}
