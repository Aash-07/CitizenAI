import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/** Shared shell: navbar + page content. Rendered by the router's root route. */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        CitizenAI — plain-language guidance on Indian government schemes. Not an official
        government website.
      </footer>
    </div>
  );
}
