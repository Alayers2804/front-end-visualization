import { useState, useEffect } from "react";
import api from "../lib/api";
import { useDataset } from "../context/DatasetContext";

interface ForecastItem {
  month: string;
  predicted_cases: number;
}

interface PredictResponse {
  forecast: ForecastItem[];
  target_column: string;
}

export function usePredict() {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedDataset } = useDataset();


  const fetch = async (nMonths = 2, targetColumn = "JUMLAH_KASUS") => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PredictResponse>("/predict", {
        params: { n_months: nMonths, target_column: targetColumn, dataset_id: selectedDataset?.id },
      });
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetch };
}



interface ActualVsPredicted {
  actual: number;
  predicted: number;
}

interface EvaluationMetrics {
  mae: number;
  rmse: number;
  mape: string; // already formatted with "%"
}

  interface PredictionTestResponse {
    evaluation: EvaluationMetrics;
    target_column: string;
    actual_vs_predicted: ActualVsPredicted[];
  }

  export function usePredictionTest() {
    const [result, setResult] = useState<PredictionTestResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedDataset } = useDataset();

    const fetch = async (testSize = 3, targetColumn = "JUMLAH_KASUS") => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/predict/test", {
          params: { test_size: testSize, target_column: targetColumn, dataset_id: selectedDataset?.id },
        });
        setResult(res.data);
      } catch (err: any) {
        setError(err.message || "Error testing prediction");
      } finally {
        setLoading(false);
      }
    };

    return { result, loading, error, fetch };
  }


interface PredictionPlotResponse {
  image_base64?: string;
  forecast_values: number[];
  target_column: string;
}

export function usePredictionPlot() {
  const [plotData, setPlotData] = useState<PredictionPlotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedDataset } = useDataset();

  const fetch = async (nMonths = 2, targetColumn = "JUMLAH_KASUS", base64 = true) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/predict/plot", {
        params: { n_months: nMonths, target_column: targetColumn, return_base64: base64, dataset_id: selectedDataset?.id },
      });
      setPlotData(res.data);
    } catch (err: any) {
      setError(err.message || "Error fetching plot");
    } finally {
      setLoading(false);
    }
  };

  return { plotData, loading, error, fetch };
}

export function usePredictByArea(
  area: string | null,
  nMonths = 2,
  targetColumn = "JUMLAH_KASUS"
) {
  const [forecast, setForecast] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedDataset } = useDataset();

  const fetch = async () => {
    if (!area) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/predict/predict-by-area", {
        params: { area, n_months: nMonths, target_column: targetColumn, dataset_id: selectedDataset?.id },
      });
      if (res.data.error) {
        setError(res.data.error);
        setForecast(null);
      } else {
        setForecast(res.data.forecast || []);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching prediction");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => fetch(); // you can still call retry manually

  return { forecast, loading, error, fetch, retry };
}

export function useAvailableAreas() {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const { selectedDataset } = useDataset();

  const retry = () => setRetryKey(prev => prev + 1);

  useEffect(() => {
    const fetchAreas = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await api.get("/predict/available-areas", {
          params: { dataset_id: selectedDataset?.id },
        });
        setAreas(res.data.areas || []);
      } catch (err: any) {
        setError(err.message || "Error fetching areas");
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [retryKey]);

  return { areas, loading, error, retry };
}

interface HeatmapResponse {
  map_html?: string;
  error?: string;
}

export function useHeatmap(month?: string, retryKey = 0) {
  const [mapHtml, setMapHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedDataset } = useDataset();

  useEffect(() => {
    const fetchHeatmap = async () => {
      setError(null);
      setMapHtml(null);
      setLoading(true);

      try {
        if (!selectedDataset?.id) {
          setError("Dataset not selected");
          return;
        }

        const response = await api.get("/predict/heatmap", {
          params: month ? { month, dataset_id: selectedDataset.id } : { dataset_id: selectedDataset.id },
        });

        if (response.data?.error) {
          setError(response.data.error);
          return;
        }

        setMapHtml(response.data.map_html);
      } catch (err: any) {
        setError(err.message || "Gagal memuat heatmap");
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, [month, retryKey]);

  return { mapHtml, loading, error };
}
