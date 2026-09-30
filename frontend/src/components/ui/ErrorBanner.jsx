import { AlertTriangle, WifiOff } from "lucide-react";

/**
 * Inline error banner used across pages for failed API calls
 * (e.g. backend not reachable, /chat or /eligibility failures).
 */
export default function ErrorBanner({ message, offline = false }) {
  if (!message) return null;
  const Icon = offline ? WifiOff : AlertTriangle;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
