import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useSavedSchemes } from "../../context/SavedSchemesContext";

/**
 * Reusable scheme summary card, used on Dashboard, Scheme Search and Saved
 * Schemes. Expects an "enriched" scheme (see src/data/schemes.js#enrichScheme):
 * { id, name, category, ministry, sourcePdf, summary, benefit, audience, sampleQuestion }
 */
export default function SchemeCard({ scheme, matchedEligibility = false }) {
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleSaved } = useSavedSchemes();
  const saved = isAuthenticated && isSaved(scheme.id);

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{scheme.name}</h3>
            <Badge color="slate">{scheme.category}</Badge>
            {matchedEligibility && <Badge color="green">You may be eligible</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{scheme.ministry}</p>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => toggleSaved(scheme.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved schemes" : "Save this scheme"}
            className="shrink-0 rounded-full p-1.5 text-brand-600 hover:bg-brand-50"
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        )}
      </div>

      <p className="text-sm text-slate-600">{scheme.summary}</p>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
        <dt className="font-medium text-slate-400">Benefit</dt>
        <dd className="text-slate-700">{scheme.benefit}</dd>
        <dt className="font-medium text-slate-400">Who it's for</dt>
        <dd className="text-slate-700">{scheme.audience}</dd>
      </dl>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-slate-400">Source: {scheme.sourcePdf}</span>
        <Button as={Link} to={`/chat?scheme=${scheme.id}`} size="sm" variant="secondary">
          Ask AI about this <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
