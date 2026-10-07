import { SITE } from "@/lib/site";

/**
 * Summit Line Academy brand marks (PLACEHOLDER artwork until the official logo files are supplied).
 * Everything uses `currentColor`, so the same component renders the white, black or any-tone logo on a
 * transparent background: just set a text color class (e.g. `text-white` / `text-black`).
 */

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={`${SITE.name} mark`} fill="currentColor">
      {/* summit above the line */}
      <path d="M32 5 45 29H19z" />
      {/* base below the line */}
      <path d="M12 37h40l9 22H3z" />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-9 w-9",
  stacked = false,
}: {
  className?: string;
  markClassName?: string;
  stacked?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${stacked ? "flex-col" : ""} ${className}`}>
      <LogoMark className={markClassName} />
      <span className={`flex flex-col leading-none ${stacked ? "items-center" : ""}`}>
        <span className="font-display text-[1.65rem] font-extrabold uppercase tracking-[0.04em]">Summit</span>
        <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.42em] opacity-80">Line Academy</span>
      </span>
    </span>
  );
}
