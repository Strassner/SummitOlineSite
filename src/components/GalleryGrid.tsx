"use client";

import { useState } from "react";
import { GALLERY } from "@/lib/data";
import { Photo } from "./ui";

const CATS = ["All", "Training", "Athletes", "Coaches", "Camps", "Clinics", "Action", "Facility"] as const;

/** Add real images by setting `src` on items in lib/data.ts (files live in /public/photos). */
export function GalleryGrid() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const items = GALLERY.filter((g) => cat === "All" || g.category === cat);
  return (
    <div>
      <div role="tablist" aria-label="Gallery categories" className="mb-10 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`min-h-11 px-4 font-display text-sm font-bold uppercase tracking-[0.14em] ${cat === c ? "bg-white text-black" : "border border-iron text-mist hover:border-white hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((g) => (
          <figure key={g.id} className="group mb-4 break-inside-avoid overflow-hidden">
            <Photo src={g.src} alt={`${g.category}: ${g.caption}`} label={`${g.category} · ${g.caption}`} className={`w-full transition-transform duration-700 group-hover:scale-[1.03] ${g.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
          </figure>
        ))}
      </div>
    </div>
  );
}
