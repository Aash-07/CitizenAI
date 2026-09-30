import { clsx } from "../../lib/clsx";

export default function Card({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
