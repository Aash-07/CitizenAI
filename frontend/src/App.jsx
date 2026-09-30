import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SavedSchemesProvider } from "./context/SavedSchemesContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SchemeSearch from "./pages/SchemeSearch";
import Chat from "./pages/Chat";
import SavedSchemes from "./pages/SavedSchemes";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedSchemesProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schemes" element={<SchemeSearch />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/saved" element={<SavedSchemes />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SavedSchemesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
