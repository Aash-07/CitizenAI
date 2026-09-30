import { clsx } from "../../lib/clsx";

const COLORS = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Badge({ color = "brand", className = "", children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        COLORS[color] || COLORS.brand,
        className
      )}
    >
      {children}
    </span>
  );
}
