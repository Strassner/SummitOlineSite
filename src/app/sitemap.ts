import type { MetadataRoute } from "next";
import { COACHES, POSTS } from "@/lib/data";
import { LEGAL_DOCS } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/training", "/memberships", "/calendar", "/camps-clinics", "/content", "/coaches", "/gallery", "/contact", "/book"];
  const lastModified = new Date("2026-10-01");
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...COACHES.map((c) => ({ url: `${SITE.url}/coaches/${c.slug}`, lastModified, priority: 0.6 })),
    ...POSTS.map((p) => ({ url: `${SITE.url}/content/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
    ...LEGAL_DOCS.map((d) => ({ url: `${SITE.url}/legal/${d.slug}`, lastModified, priority: 0.2 })),
  ];
}
