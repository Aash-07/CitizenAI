import { useEffect, useState } from "react";
import { getAllSchemes, getErrorMessage } from "../lib/api";
import { enrichScheme } from "../data/schemes";

/** Fetches GET /schemes once and enriches each entry with presentation metadata. */
export function useSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllSchemes()
      .then((data) => {
        if (cancelled) return;
        setSchemes((data.schemes || []).map(enrichScheme));
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { schemes, loading, error };
}
