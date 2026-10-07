"use client";

import Link from "next/link";
import { useState } from "react";
import { POST_CATEGORIES, POSTS } from "@/lib/data";
import { formatDate } from "@/lib/dates";
import { Photo, Pill } from "./ui";

export function PostBrowser() {
  const [cat, setCat] = useState<string>("All");
  const posts = POSTS.filter((p) => cat === "All" || p.category === cat);
  return (
    <div>
      <div role="tablist" aria-label="Categories" className="mb-10 flex flex-wrap gap-2">
        {["All", ...POST_CATEGORIES].map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`min-h-11 px-4 font-display text-sm font-bold uppercase tracking-[0.14em] ${cat === c ? "bg-white text-black" : "border border-iron text-mist hover:border-white hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.slug} className="group flex flex-col bg-steel">
            <Link href={`/content/${p.slug}`} aria-label={p.title} className="block overflow-hidden">
              <Photo alt={`${p.title} cover image`} label={p.category} className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.04]" />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center gap-3">
                <Pill tone="gold">{p.category}</Pill>
                <span className="text-xs text-ash">{p.readTime}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase leading-tight">
                <Link href={`/content/${p.slug}`} className="hover:text-gold">{p.title}</Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-ash">{p.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-ash">{formatDate(p.date, { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
