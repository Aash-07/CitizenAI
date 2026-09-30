import { Link } from "react-router-dom";
import { Bookmark, Search } from "lucide-react";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import SchemeCard from "../components/schemes/SchemeCard";
import { useSavedSchemes } from "../context/SavedSchemesContext";
import { useSchemes } from "../hooks/useSchemes";

export default function SavedSchemes() {
  const { savedIds } = useSavedSchemes();
  const { schemes, loading, error } = useSchemes();
  const saved = schemes.filter((s) => savedIds.includes(s.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Saved Schemes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Schemes you've bookmarked, saved on this device for your account.
      </p>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} offline />
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading your saved schemes…</p>
      ) : saved.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Bookmark className="h-6 w-6" />
          </span>
          <p className="font-medium text-slate-700">You haven't saved any schemes yet</p>
          <p className="max-w-sm text-sm text-slate-500">
            Tap the bookmark icon on any scheme in Scheme Search or your Dashboard to keep it here.
          </p>
          <Button as={Link} to="/schemes" className="mt-2">
            <Search className="h-4 w-4" /> Browse schemes
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}
