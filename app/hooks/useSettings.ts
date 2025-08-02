import { useEffect, useState } from "react";
import api from "../lib/api"; 

export function useListDatasets() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchDatasets = async () => {
        setLoading(true);
        try {
          const res = await api.get("/list-datasets");
          setDatasets(res.data || []);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Gagal memuat daftar dataset");
        } finally {
          setLoading(false);
        }
      };
  
      fetchDatasets();
    }, []);
  
    return { datasets, loading, error };
  }