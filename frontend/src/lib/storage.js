// Tiny, failure-tolerant wrapper around localStorage (private mode, quota, etc.).
const PREFIX = "citizenai.";

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** Per-user storage key, e.g. userKey("saved", "a@b.com") */
export const userKey = (kind, email) => `${kind}.${email}`;
