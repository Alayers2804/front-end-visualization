import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useDataset } from "../context/DatasetContext";

export function useProfilePlot(features: string[], returnBase64 = true) {
  const [images, setImages] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedDataset } = useDataset();

  const fetchPlot = useCallback(() => {
    if (!selectedDataset?.id) {
      setError("Dataset not selected");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    return api
      .get("/profile-summary/plot", {
        params: {
          features,
          return_base64: returnBase64,
          dataset_id: selectedDataset.id
        }
      })
      .then((res) => {
        setImages(res.data);
        setError(null);
      })
      .catch((err) => setError(err.message || "Failed to fetch plot"))
      .finally(() => setLoading(false));
  }, [features, returnBase64, selectedDataset?.id]);

  return { images, error, retry: fetchPlot, loading };
}

export function useProfileSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedDataset } = useDataset();

  const fetchSummary = useCallback(() => {
    if (!selectedDataset?.id) {
      setError("Dataset not selected");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    return api
      .get("/profile-summary", {
        params: {
          dataset_id: selectedDataset.id
        }
      })
      .then((res) => {
        setSummary(res.data);
        setError(null);
      })
      .catch((err) => setError(err.message || "Failed to fetch summary"))
      .finally(() => setLoading(false));
  }, [selectedDataset?.id]);

  return { summary, error, retry: fetchSummary, loading };
}
