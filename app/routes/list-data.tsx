import React, { useState, useEffect } from "react";
import { useMergedSuspects } from "../hooks/useProcessData";

export async function loader() {
  return null;
}

export default function ListDataPage() {
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <MergedSuspectsTable />
    </div>
  );
}

type Props = {
  rowsPerPage?: number;
};

export function MergedSuspectsTable({ rowsPerPage = 10 }: Props) {
    const { data, loading, error, fetch } = useMergedSuspects();
    const [page, setPage] = useState(1);
    const [zoom, setZoom] = useState(1);
  
    useEffect(() => {
      fetch();
    }, [fetch]);
  
    useEffect(() => {
      setPage(1);
    }, [data]);
  
    // Remove "ID" from headers
    const headers = [
      "Tanggal",
      "No Register",
      "Nama Tersangka",
      "No LKN",
      "Domisili",
      "Pasal Disangkakan",
      "Jenis Kelamin",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Usia",
      "Pendidikan Terakhir",
      "Pekerjaan",
      "Rekomendasi TAT",
    ];
  
    const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data ? data.slice(startIndex, endIndex) : [];
  
    const baseFontSize = 16;
    const fontSize = baseFontSize * zoom;
  
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-full overflow-x-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">List Data Peserta TAT dan Rehabilitasi</h2>
  
        {/* Zoom Controls */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-gray-700 font-medium">Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
  
        {loading && <p className="text-gray-600">Loading data...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}
  
        {!loading && !error && (
          <>
            <div
              style={{ maxWidth: "100vw" }}
              className="overflow-x-auto"
            >
              <table
                className="border-collapse border border-gray-300 text-gray-800"
                style={{ fontSize: fontSize, tableLayout: "auto", width: "100%" }}
              >
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-700 select-none"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
  
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="text-center py-10 text-gray-500"
                        style={{ fontSize: fontSize * 1.2 }}
                      >
                        No data available.
                      </td>
                    </tr>
                  ) : (
                    currentData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-100 transition-colors duration-200`}
                      >
                        {headers.map((header, colIdx) => {
                          const key = header
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/\./g, "")
                            .replace(/_/g, "_");
  
                          let value = row[key];
                          // Fix key names that don't match exactly:
                          if (header === "Tanggal") value = row.tanggal;
                          else if (header === "No Register") value = row.no_register;
                          else if (header === "Nama Tersangka") value = row.nama_tersangka;
                          else if (header === "No LKN") value = row.no_lkn;
                          else if (header === "Domisili") value = row.domisili;
                          else if (header === "Pasal Disangkakan") value = row.pasal_disangkakan;
                          else if (header === "Jenis Kelamin") value = row.jenis_kelamin;
                          else if (header === "Tempat Lahir") value = row.tempat_lahir;
                          else if (header === "Tanggal Lahir") value = row.tanggal_lahir;
                          else if (header === "Agama") value = row.agama;
                          else if (header === "Usia") value = row.usia;
                          else if (header === "Pendidikan Terakhir") value = row.pendidikan_terakhir;
                          else if (header === "Pekerjaan") value = row.pekerjaan;
                          else if (header === "Rekomendasi TAT") value = row.rekomendasi_tat;
  
                          return (
                            <td
                              key={colIdx}
                              className="border border-gray-300 px-2 py-3 whitespace-normal break-words"
                              title={value ?? "-"}
                            >
                              {value ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-gray-700 font-semibold text-lg">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
  