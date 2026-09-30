import { forwardRef } from "react";
import { clsx } from "../../lib/clsx";

const Select = forwardRef(function Select(
  { label, id, error, hint, className = "", containerClassName = "", children, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
          error ? "border-red-400" : "border-slate-300",
          className
        )}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
