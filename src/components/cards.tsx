import Link from "next/link";
import type { Coach, Testimonial } from "@/lib/types";
import { Button, Photo, Pill } from "./ui";

export function CoachCard({ coach, compact = false }: { coach: Coach; compact?: boolean }) {
  return (
    <article className="group flex flex-col bg-steel">
      <Link href={`/coaches/${coach.slug}`} className="block overflow-hidden" aria-label={`${coach.name} profile`}>
        <Photo
          src={coach.photo}
          alt={`${coach.name}, ${coach.role}`}
          label="Coach photo"
          className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold">{coach.position}</p>
        <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none">{coach.name}</h3>
        <p className="mt-1 text-sm text-ash">{coach.role}</p>
        {!compact && (
          <>
            <p className="mt-4 text-mist">{coach.bio}</p>
            <dl className="mt-4 space-y-1 text-sm text-ash">
              <div>
                <dt className="inline font-semibold text-bone">Playing: </dt>
                <dd className="inline">{coach.playing}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-bone">Coaching: </dt>
                <dd className="inline">{coach.coaching}</dd>
              </div>
            </dl>
          </>
        )}
        <div className="mt-auto pt-6">
          <Button href={`/coaches/${coach.slug}`} variant="outline" size="sm" arrow>
            View profile
          </Button>
        </div>
      </div>
    </article>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col border border-iron bg-steel p-8">
      <div className="mb-5 flex items-center justify-between">
        <Pill tone="gold">{t.role}</Pill>
        {t.placeholder && <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-ash">Sample</span>}
      </div>
      <blockquote className="flex-1 text-xl leading-relaxed text-bone">“{t.quote}”</blockquote>
      <figcaption className="mt-6 border-t border-iron pt-4">
        <p className="font-display text-lg font-bold uppercase tracking-wide">{t.name}</p>
        <p className="text-sm text-ash">{t.detail}</p>
      </figcaption>
    </figure>
  );
}
