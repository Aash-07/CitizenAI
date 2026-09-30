import { useCallback, useState } from "react";
import { checkEligibility, getErrorMessage } from "../lib/api";

/** Wraps POST /eligibility with loading/error/result state. */
export function useEligibility() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const submit = useCallback(async (profile) => {
    setLoading(true);
    setError("");
    try {
      const data = await checkEligibility(profile);
      setResult(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, result };
}
