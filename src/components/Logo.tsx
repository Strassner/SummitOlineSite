import Image from "next/image";
import { asset, SITE } from "@/lib/site";

/**
 * The official Summit Line Academy badge (from the design brief) is the site logo.
 * The art is a black disc with a white ring, so it reads on both black and white backgrounds.
 * Replace /public/brand/badge.png with a vector export when one is available.
 */
export function Logo({
  className = "h-12 w-12",
  priority = false,
  decorative = false,
}: {
  /** Tailwind sizing for the badge, e.g. "h-12 w-12" */
  className?: string;
  priority?: boolean;
  /** Use for watermarks so screen readers skip them */
  decorative?: boolean;
}) {
  return (
    <Image
      src={asset("/brand/badge.png")}
      alt={decorative ? "" : `${SITE.name} logo`}
      aria-hidden={decorative || undefined}
      width={475}
      height={465}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}

/** Large faint badge used as a background watermark in dark sections */
export function Watermark({ className = "" }: { className?: string }) {
  return <Logo decorative className={`pointer-events-none select-none ${className}`} />;
}
