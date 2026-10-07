/**
 * Central site configuration. Edit this file to change brand, contact and navigation info.
 * Everything marked PLACEHOLDER should be replaced with real business details.
 */

export const SITE = {
  name: "Summit Line Academy",
  short: "Summit",
  tagline: "Stronger Linemen, Higher Standards.",
  motto: "Serious Training. Serious Development.",
  description:
    "Summit Line Academy is Kansas City's offensive-line-specific football training academy: private training, small groups, memberships, camps and clinics for youth, high school and college linemen.",
  // PLACEHOLDER: set to the production domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.summitlineacademy.com",
  email: "train@summitlineacademy.com", // taken from the footer reference in the brief
  phone: "(816) 555-0142", // PLACEHOLDER
  phoneHref: "tel:+18165550142", // PLACEHOLDER
  location: {
    name: "Summit Training Site", // PLACEHOLDER
    line1: "Address provided at booking", // PLACEHOLDER
    city: "Kansas City",
    region: "MO",
    full: "Kansas City, MO",
  },
  // Digital waiver / release form (Jotform) supplied in the design brief
  waiverUrl: "https://form.jotform.com/262727147203151",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  // Google Search Console HTML-tag verification token (meta name="google-site-verification")
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  // Google Business Profile place id: powers the "Leave a Google review" link
  googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "",
  // Optional hero background media (put files in /public/photos, e.g. "/photos/hero.jpg" or "/photos/hero.mp4")
  heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO ?? "",
  heroImage: process.env.NEXT_PUBLIC_HERO_IMAGE ?? "/photos/hero.jpg",
};

/** Prefix a /public asset path with the deploy base path (needed on GitHub Pages project sites). */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") && !path.startsWith(`${base}/`) ? `${base}${path}` : path;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/training", label: "Training" },
  { href: "/memberships", label: "Memberships" },
  { href: "/calendar", label: "Calendar" },
  { href: "/camps-clinics", label: "Camps & Clinics" },
  { href: "/content", label: "Content" },
  { href: "/contact", label: "Contact" },
] as const;

// PLACEHOLDER profile URLs. Point these at the real accounts.
export const SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
] as const;

export const LEGAL = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
  { slug: "cancellation-policy", label: "Cancellation Policy" },
  { slug: "refund-policy", label: "Refund Policy" },
  { slug: "waiver", label: "Waiver / Release" },
] as const;

export const PILLARS = ["Technique", "Strength", "IQ", "Discipline"] as const;
