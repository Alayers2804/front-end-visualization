import { useState } from "react";
import api from "../lib/api";

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
    create: (data: any) => void;
    loading: boolean;
    error: string | null;
    success: string | null;
}

export function useCreateSuspect(): UseCreateSuspectResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.post("/suspects/", data);
            setSuccess(res.data.message || "Berhasil menambahkan data");
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || "Gagal menambahkan data");
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error, success };
}
