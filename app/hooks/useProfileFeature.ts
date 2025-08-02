// useProfileFeature.ts

import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";

export function useProfilePlot(features: string[], returnBase64 = true) {
  const [images, setImages] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlot = useCallback(() => {
    setError(null);
    setLoading(true);
    return api
      .get("/profile-summary/plot", {
        params: { features, return_base64: returnBase64 }
      })
      .then(res => {
        setImages(res.data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false)); // Ensure loading is turned off
  }, [features, returnBase64]);

  return { images, error, retry: fetchPlot };
}

export function useProfileSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(() => {
    setError(null);
    setLoading(true);
    return api
      .get("/profile-summary")
      .then(res => {
        setSummary(res.data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { summary, error, retry: fetchSummary };
}
