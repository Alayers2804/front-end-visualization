
import { useEffect, useState } from "react";
import axios from "axios";
import apiBaseUrl from "../lib/api";

export function useProfilePlot(features: string[], returnBase64 = true) {
  const [images, setImages] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/profile-summary/plot`, {
        params: { features, return_base64: returnBase64 }
      })
      .then(res => setImages(res.data))
      .catch(err => setError(err.message));
  }, [features, returnBase64]);

  return { images, error };
}
export function useProfileSummary() {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      axios
        .get(`${apiBaseUrl}/profile-summary`)
        .then(res => setSummary(res.data))
        .catch(err => setError(err.message));
    }, []);
  
    return { summary, error };
  }
  