import React, { useState } from "react";
import { useHeatmap } from "../hooks/usePredictions";

export default function HeatmapViewer() {
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [retryKey, setRetryKey] = useState(0);
    const { imageUrl, loading, error } = useHeatmap(selectedMonth, retryKey);

    const reload = () => setRetryKey(prev => prev + 1);

    return (
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

            {!loading && !error && !imageUrl && (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}

            {imageUrl && !loading && !error && (
                <div className="space-y-4">
                    <img
                        src={`data:image/png;base64,${imageUrl.full_map_base64}`}
                        alt={`Full Heatmap ${selectedMonth || "Semua Bulan"}`}
                        className="w-full max-w-4xl mx-auto rounded shadow"
                    />
                    <img
                        src={`data:image/png;base64,${imageUrl.focused_map_base64}`}
                        alt={`Focused Heatmap ${selectedMonth || "Semua Bulan"}`}
                        className="w-full max-w-4xl mx-auto rounded shadow"
                    />
                </div>
            )}

        </div>
    );
}