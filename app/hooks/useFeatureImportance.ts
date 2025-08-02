import { useEffect, useState } from "react";
import api from "../lib/api"; // Axios instance
import qs from "qs";

interface FeaturePlotResult {
  image_base64?: string;
  feature_importance: Record<string, number>;
  used_features: string[];
}

export function useFeaturePlot() {
  const [plot, setPlot] = useState<FeaturePlotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlot = async (features: string[], returnBase64 = true) => {
    if (!features || features.length === 0) return;

    setLoading(true);
    setError(null);
    setPlot(null);

    try {
      const res = await api.get("/features/plot", {
        params: { features, return_base64: returnBase64 },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      setPlot(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { plot, error, loading, fetchPlot };
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


export function useImportantFeatures() {
  const [data, setData] = useState<FeatureRelevanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImportance = async (features: string[]) => {
    if (!features || features.length === 0) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await api.get("/features", {
        params: { features },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      setData(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchImportance };
}
