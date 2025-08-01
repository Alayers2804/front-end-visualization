// useProfileFeature.ts

import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";

export function useProfilePlot(features: string[], returnBase64 = true) {
  const [images, setImages] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPlot = useCallback(() => {
    setError(null); // reset error
    api
      .get("/profile-summary/plot", {
        params: { features, return_base64: returnBase64 }
      })
      .then(res => setImages(res.data))
      .catch(err => setError(err.message));
  }, [features, returnBase64]);

  useEffect(() => {
    fetchPlot();
  }, [fetchPlot]);

  return { images, error, retry: fetchPlot };
}

export function useProfileSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(() => {
    setError(null);
    api
      .get("/profile-summary")
      .then(res => setSummary(res.data))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, error, retry: fetchSummary };
}
