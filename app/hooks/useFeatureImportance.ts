import { useEffect, useState } from "react";
import api from "../lib/api"; // Axios instance

interface FeaturePlotResult {
  image_base64?: string;
  feature_importance: Record<string, number>;
  used_features: string[];
}

export function useFeaturePlot(
  features: string[],
  returnBase64 = true,
  refreshKey = 0
) {
  const [plot, setPlot] = useState<FeaturePlotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!features || features.length === 0) return;
    setError(null);
    setPlot(null); 
    setLoading(true);
    api
      .get("/features/plot", {
        params: { features, return_base64: returnBase64 }
      })
      .then(res => setPlot(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [features, returnBase64, refreshKey]); // added refreshKey

  return { plot, error, loading };
}

interface FeatureRelevanceResult {
  feature_relevance: Record<
    string,
    {
      variance_score: number;
      entropy_score: number;
    }
  >;
  used_features: string[];
}

export function useImportantFeatures(
  features: string[] = ["USIA", "PEKERJAAN", "PENDIDIKAN TERAKHIR"],
  refreshKey = 0
) {
  const [data, setData] = useState<FeatureRelevanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!features || features.length === 0) return;
    setError(null);
    setData(null);
    setLoading(true);
    api
      .get("/features", { params: { features } })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [features, refreshKey]); // added refreshKey

  return { data, error, loading };
}
