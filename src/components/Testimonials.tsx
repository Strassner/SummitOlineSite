"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import { SITE } from "@/lib/site";
import { TestimonialCard } from "./cards";
import { PlayIcon } from "./Icons";
import { Button } from "./ui";

const TABS = ["all", "athlete", "parent", "coach"] as const;

/** Athlete / parent / coach testimonials with a video-testimonial slot and a Google reviews link. */
export function Testimonials() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const items = TESTIMONIALS.filter((t) => tab === "all" || t.role === tab);
  const reviewHref = SITE.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${SITE.googlePlaceId}` : undefined;

  return (
    <div>
      <div role="tablist" aria-label="Testimonials" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-10 rounded-full px-5 font-display text-sm uppercase tracking-[0.12em] transition-colors ${tab === t ? "bg-black text-white" : "border border-black text-black hover:bg-black hover:text-white"}`}
          >
            {t === "all" ? "All" : `${t}s`}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        {/* Video testimonial slot */}
        <div className="photo-slot relative flex min-h-56 items-center justify-center rounded-sm text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <PlayIcon className="h-7 w-7" />
          </span>
          <p className="absolute bottom-4 left-5 font-display text-sm uppercase tracking-[0.2em] text-white/60">Video testimonial</p>
        </div>
        <div className="flex flex-col justify-center border border-black p-8">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-gold-dim">Google Reviews</p>
          <p className="mt-2 font-display text-4xl uppercase leading-none">Train with us? Tell Kansas City.</p>
          <div className="mt-6">
            {reviewHref ? (
              <Button href={reviewHref} variant="dark">Leave a Google review</Button>
            ) : (
              <p className="text-sm text-neutral-500">Reviews feed connects once the Google Business Profile is set up.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
