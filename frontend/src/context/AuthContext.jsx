import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, writeJSON, removeKey } from "../lib/storage";

/**
 * Local, client-side "auth".
 *
 * The FastAPI backend (backend/main.py) exposes no auth/user routes today —
 * only /health, /chat and /eligibility. So Login/Register and the profile
 * screen work against a small localStorage-backed user store. This keeps the
 * app fully usable and gives every other page (Saved Schemes, Profile,
 * eligibility on the Dashboard) a signed-in user to key data off of, without
 * touching or renaming anything in the backend.
 *
 * Swapping this for real backend auth later only means editing this file.
 */
const AuthContext = createContext(null);

const USERS_KEY = "users"; // { [email]: { name, email, password, phone, state } }
const SESSION_KEY = "session"; // email of the signed-in user

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sessionEmail = readJSON(SESSION_KEY, null);
    if (sessionEmail) {
      const users = readJSON(USERS_KEY, {});
      if (users[sessionEmail]) setUser(users[sessionEmail]);
    }
    setReady(true);
  }, []);

  const register = ({ name, email, password, phone, state }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_KEY, {});
    if (users[normalizedEmail]) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || "",
      state: state || "",
    };
    users[normalizedEmail] = newUser;
    writeJSON(USERS_KEY, users);
    writeJSON(SESSION_KEY, normalizedEmail);
    setUser(newUser);
    return newUser;
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_KEY, {});
    const existing = users[normalizedEmail];
    if (!existing || existing.password !== password) {
      throw new Error("Invalid email or password.");
    }
    writeJSON(SESSION_KEY, normalizedEmail);
    setUser(existing);
    return existing;
  };

  const logout = () => {
    removeKey(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const users = readJSON(USERS_KEY, {});
    const updated = { ...users[user.email], ...updates, email: user.email };
    users[user.email] = updated;
    writeJSON(USERS_KEY, users);
    setUser(updated);
    return updated;
  };

  const value = useMemo(
    () => ({ user, ready, isAuthenticated: !!user, register, login, logout, updateProfile }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
