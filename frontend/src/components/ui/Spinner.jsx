import { Loader2 } from "lucide-react";
import { clsx } from "../../lib/clsx";

export default function Spinner({ className = "", label = "Loading…" }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className={clsx("h-4 w-4 animate-spin", className)} aria-hidden="true" />
      {label}
    </span>
  );
}
