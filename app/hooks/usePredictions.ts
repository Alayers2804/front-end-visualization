import { useState, useEffect } from "react";
import api from "../lib/api";

interface ForecastItem {
  month: string;
  predicted_cases: number;
}

interface PredictResponse {
  forecast: ForecastItem[];
  target_column: string;
}

export function usePredict(nMonths = 2, targetColumn = "JUMLAH_KASUS", retryKey = 0) {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await api.get<PredictResponse>("/predict", {
          params: { n_months: nMonths, target_column: targetColumn }
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch prediction");
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [nMonths, targetColumn, retryKey]);

  return { data, loading, error };
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

export function usePredictionTest(testSize = 3, targetColumn = "JUMLAH_KASUS", retryKey = 0) {
  const [result, setResult] = useState<PredictionTestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get("/predict/test", {
          params: { test_size: testSize, target_column: targetColumn }
        });
        setResult(res.data);
      } catch (err: any) {
        setError(err.message || "Error testing prediction");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testSize, targetColumn, retryKey]);

  return { result, loading, error };
}


interface PredictionPlotResponse {
  image_base64?: string;
  forecast_values: number[];
  target_column: string;
}

export function usePredictionPlot(
  nMonths = 2,
  targetColumn = "JUMLAH_KASUS",
  base64 = true,
  retryKey = 0
) {
  const [plotData, setPlotData] = useState<PredictionPlotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const res = await api.get("/predict/plot", {
          params: {
            n_months: nMonths,
            target_column: targetColumn,
            return_base64: base64
          }
        });
        setPlotData(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching plot");
      } finally {
        setLoading(false);
      }
    };
    fetchPlot();
  }, [nMonths, targetColumn, base64, retryKey]);

  return { plotData, loading, error };
}
