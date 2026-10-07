import Link from "next/link";
import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowIcon } from "./Icons";
import { LogoMark } from "./Logo";

/* -------------------------------- Button -------------------------------- */

type Variant = "primary" | "outline" | "dark" | "outlineDark" | "gold" | "ghost";
type Size = "md" | "lg" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-white text-black hover:bg-gold",
  outline: "border border-white/50 text-white hover:bg-white hover:text-black",
  dark: "bg-black text-white hover:bg-iron",
  outlineDark: "border border-black text-black hover:bg-black hover:text-white",
  gold: "bg-gold text-black hover:bg-white",
  ghost: "text-white hover:text-gold",
};
const SIZES: Record<Size, string> = {
  sm: "min-h-10 px-4 text-xs",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-base",
};

function btnClass(variant: Variant, size: Size, extra = "") {
  return `cut inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  const inner = (
    <>
      {children}
      {arrow && <ArrowIcon className="h-4 w-4" />}
    </>
  );
  if (href) {
    const external = /^https?:/.test(href);
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass(variant, size, className)}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={btnClass(variant, size, className)}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={btnClass(variant, size, className)} {...rest}>
      {inner}
    </button>
  );
}

/* -------------------------------- Layout -------------------------------- */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

type Tone = "dark" | "light" | "steel";
const TONES: Record<Tone, string> = {
  dark: "bg-ink text-bone",
  steel: "bg-coal text-bone",
  light: "light bg-bone text-ink",
};

export function Section({
  tone = "dark",
  id,
  className = "",
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-28 ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Heading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`mb-12 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className={`mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] ${light ? "text-gold-dim" : "text-gold"} ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
      )}
      <Tag className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">{title}</Tag>
      {intro && <p className={`mt-6 text-lg leading-relaxed ${light ? "text-neutral-600" : "text-mist"}`}>{intro}</p>}
    </div>
  );
}

/** Interior page hero banner */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="photo-slot relative overflow-hidden border-b border-iron pb-16 pt-20 sm:pb-24 sm:pt-28">
      <LogoMark className="pointer-events-none absolute -right-16 -top-10 h-[28rem] w-[28rem] text-white opacity-[0.04]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <Container>
        <p className="mb-5 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

/* --------------------------------- Photo --------------------------------- */

/**
 * Photo slot. Pass `src` (e.g. "/photos/line-drill.jpg" from /public) to show real photography;
 * without it a branded placeholder is shown so the layout is final before photos arrive.
 */
export function Photo({
  src,
  alt,
  label,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={alt} className={`photo-slot relative flex items-end overflow-hidden ${className}`}>
      <LogoMark className="absolute left-1/2 top-1/2 h-1/2 max-h-48 w-auto -translate-x-1/2 -translate-y-1/2 text-white opacity-[0.07]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      {label && <span className="relative z-10 p-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-white/50">{label}</span>}
    </div>
  );
}

export function Pill({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "gold" | "light" }) {
  const t = tone === "gold" ? "bg-gold text-black" : tone === "light" ? "bg-black text-white" : "bg-white/10 text-white";
  return <span className={`inline-block px-2.5 py-1 font-display text-xs font-bold uppercase tracking-[0.15em] ${t}`}>{children}</span>;
}
