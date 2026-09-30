import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import SchemeCard from "../components/schemes/SchemeCard";
import { useSchemes } from "../hooks/useSchemes";

export default function SchemeSearch() {
  const { schemes, loading, error } = useSchemes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const activeCategory = searchParams.get("category") || "All";

  const categories = useMemo(
    () => ["All", ...new Set(schemes.map((s) => s.category))],
    [schemes]
  );

  const setCategory = (category) => {
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((scheme) => {
      const inCategory = activeCategory === "All" || scheme.category === activeCategory;
      const inQuery =
        !q ||
        scheme.name.toLowerCase().includes(q) ||
        scheme.ministry.toLowerCase().includes(q) ||
        scheme.summary.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [schemes, query, activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Scheme Search</h1>
      <p className="mt-1 text-sm text-slate-500">
        Live list from the CitizenAI backend (<code className="text-xs">GET /schemes</code>).
      </p>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} offline />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          icon={Search}
          placeholder="Search by name, e.g. PM-KISAN, scholarship, loan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          containerClassName="flex-1"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Category
        </span>
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "primary" : "secondary"}
            onClick={() => setCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Loading schemes…
          </p>
        ) : results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No schemes match your search. Try a different keyword or category, or ask the{" "}
            <span className="font-medium text-brand-600">AI Chat</span> directly.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
