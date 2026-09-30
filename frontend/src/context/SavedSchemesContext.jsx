import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, writeJSON, userKey } from "../lib/storage";
import { useAuth } from "./AuthContext";

/**
 * Saved Schemes, stored per-user in localStorage (there is no backend route
 * for this yet). Each saved entry stores the scheme id plus a timestamp.
 */
const SavedSchemesContext = createContext(null);

export function SavedSchemesProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    const stored = readJSON(userKey("saved", user.email), []);
    setSavedIds(stored);
  }, [user]);

  const persist = (next) => {
    setSavedIds(next);
    if (user) writeJSON(userKey("saved", user.email), next);
  };

  const isSaved = (schemeId) => savedIds.includes(schemeId);

  const toggleSaved = (schemeId) => {
    if (!user) return;
    persist(
      savedIds.includes(schemeId)
        ? savedIds.filter((id) => id !== schemeId)
        : [...savedIds, schemeId]
    );
  };

  const removeSaved = (schemeId) => persist(savedIds.filter((id) => id !== schemeId));

  const value = useMemo(
    () => ({ savedIds, isSaved, toggleSaved, removeSaved }),
    [savedIds]
  );

  return <SavedSchemesContext.Provider value={value}>{children}</SavedSchemesContext.Provider>;
}

export function useSavedSchemes() {
  const ctx = useContext(SavedSchemesContext);
  if (!ctx) throw new Error("useSavedSchemes must be used inside SavedSchemesProvider");
  return ctx;
}
