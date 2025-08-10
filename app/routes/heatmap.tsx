import React, { useState } from "react";
import { useAvailableAreas, useHeatmap, usePredictByArea } from "../hooks/usePredictions";
import { downloadImagesAsZip } from "~/lib/imageDownload";

export default function areaPredictions() {
    const { areas, loading: areasLoading, error: areasError, retry: retryAreas } = useAvailableAreas();

    const [selectedArea, setSelectedArea] = React.useState<string | null>(null);
    const [nMonths, setNMonths] = useState(2);

    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [retryKey, setRetryKey] = useState(0);
    const { mapHtml, loading, error } = useHeatmap(selectedMonth, retryKey);

    const reload = () => setRetryKey(prev => prev + 1);

    const {
        forecast,
        loading: areaLoading,
        error: areaError,
        fetch: fetchPredictionByArea,
        retry: retryPrediction,
    } = usePredictByArea(selectedArea, nMonths);

    const [hasFetched, setHasFetched] = useState(false);

    return (
        <>
            {/* <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Prediksi Berdasarkan Area</h2>

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
            </section> */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">🗺️ Heatmap Kasus</h2>

                <div className="flex gap-2 items-center">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="border px-3 py-2 rounded"
                        placeholder="Pilih Bulan (YYYY-MM) akan automatis menampilkan heatmap seluruh bulan bila ini kosong"
                    />
                    <button
                        onClick={reload}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        🔄 Tampilkan Heatmap
                    </button>
                </div>

                {loading && <p>⌛ Memuat heatmap...</p>}
                {error && <p className="text-red-600">❌ {error}</p>}

                {!loading && !error && !mapHtml && (
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
                )}

                {mapHtml && !loading && !error && (
                    <div
                        className="w-full h-[calc(100vh-200px)] rounded shadow overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: mapHtml }}
                    />
                )}

            </div>
        </>
    )
}

