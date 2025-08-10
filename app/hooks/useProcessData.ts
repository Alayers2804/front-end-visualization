import { useCallback, useState } from "react";
import api from "../lib/api";
import { useDataset } from "../context/DatasetContext";

export function useUploadDataset() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload-dataset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal mengunggah dataset.");
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error, result };
}

interface UseCreateSuspectResult {
  create: (data: any) => Promise<void>;
  loading: boolean;
  error: Record<string, string> | null;
  success: string | null;
}

export function useCreateSuspect(): UseCreateSuspectResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post("/suspects/", data);
      setSuccess(res.data.message || "Berhasil menambahkan data");
    } catch (err: any) {
      // Handle field-specific validation errors from FastAPI
      if (err.response?.data?.detail && typeof err.response.data.detail === "object") {
        setError(err.response.data.detail);
      } else {
        setError({ general: err.response?.data?.detail || err.message || "Gagal menambahkan data" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, success };
}

interface SuspectRecord {
  id?: number;
  tanggal?: string | null;
  no_register?: string;
  nama_tersangka?: string;
  no_lkn?: string;
  domisili?: string;
  pasal_disangkakan?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string | null;
  agama?: string;
  usia?: number;
  pendidikan_terakhir?: string;
  pekerjaan?: string;
  rekomendasi_tat?: string;
  [key: string]: any;
}

export function useMergedSuspects() {
  const [data, setData] = useState<SuspectRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedDataset } = useDataset();

  const fetch = useCallback(async () => {
    if (!selectedDataset?.id) {
      setError("No dataset selected");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<SuspectRecord[]>(`/suspects/list`, {
        params: { dataset_upload_id: selectedDataset.id },
      });
      const normalizedData = res.data.map(normalizeSuspectRecord);
      setData(normalizedData);
    } catch (err: any) {
      setError(err.message || "Error fetching merged suspects");
    } finally {
      setLoading(false);
    }
  }, [selectedDataset?.id]);

  return { data, loading, error, fetch };
}

function normalizeSuspectRecord(row: any): SuspectRecord {
  return {
    id: row.id ?? null,
    tanggal: row.tanggal ?? row.TANGGAL ?? "-",
    no_register: row.no_register ?? row["NO REGISTER"] ?? "-",
    nama_tersangka: row.nama_tersangka ?? row["NAMA TERSANGKA"] ?? "-",
    no_lkn: row.no_lkn ?? row["NO. LKN"] ?? "-",
    domisili: row.domisili ?? row.DOMISILI ?? "-",
    pasal_disangkakan: row.pasal_disangkakan ?? row["PASAL YANG DISANGKAKAN"] ?? "-",
    jenis_kelamin: row.jenis_kelamin ?? row["JENIS KELAMIN"] ?? "-",
    tempat_lahir: row.tempat_lahir ?? row["TEMPAT LAHIR"] ?? "-",
    tanggal_lahir: row.tanggal_lahir ?? row["TANGGAL LAHIR"] ?? "-",
    agama: row.agama ?? row.AGAMA ?? "-",
    usia: row.usia ?? row.USIA ?? "-",
    pendidikan_terakhir: row.pendidikan_terakhir ?? row["PENDIDIKAN TERAKHIR"] ?? "-",
    pekerjaan: row.pekerjaan ?? row.PEKERJAAN ?? "-",
    rekomendasi_tat: row.rekomendasi_tat ?? row["REKOMENDASI TAT"] ?? "-",
  };
}