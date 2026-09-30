/** Minimal className joiner so we don't need a dependency for this. */
export function clsx(...parts) {
  return parts.filter(Boolean).join(" ");
}
