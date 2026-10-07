import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Container, Photo } from "@/components/ui";
import { COACHES } from "@/lib/data";

export function generateStaticParams() {
  return COACHES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/coaches/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const coach = COACHES.find((c) => c.slug === slug);
  if (!coach) return {};
  return {
    title: `${coach.name} | ${coach.role}`,
    description: `${coach.name}, ${coach.role} at Summit Line Academy. ${coach.bio}`,
    alternates: { canonical: `/coaches/${coach.slug}` },
  };
}

export default async function CoachPage(props: PageProps<"/coaches/[slug]">) {
  const { slug } = await props.params;
  const coach = COACHES.find((c) => c.slug === slug);
  if (!coach) notFound();

  const facts: [string, string][] = [
    ["Position", coach.position],
    ["Playing background", coach.playing],
    ["College / pro experience", coach.collegePro],
    ["Coaching experience", coach.coaching],
  ];

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Photo src={coach.photo} alt={`${coach.name}, ${coach.role}`} label="Coach photo" priority className="cut-lg aspect-[4/5] w-full" />
          <div>
            <p className="mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 bg-current" />
              {coach.role}
            </p>
            <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-7xl">{coach.name}</h1>
            <p className="mt-6 text-lg leading-relaxed text-mist">{coach.bio}</p>

            <dl className="mt-10 divide-y divide-iron border-y border-iron">
              {facts.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                  <dt className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">{k}</dt>
                  <dd className="text-bone">{v}</dd>
                </div>
              ))}
              <div className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                <dt className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">Certifications</dt>
                <dd className="text-bone">{coach.certifications.join(" · ")}</dd>
              </div>
            </dl>

            <blockquote className="mt-10 border-l-4 border-gold pl-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold">Coaching philosophy</p>
              <p className="mt-2 text-xl leading-relaxed">{coach.philosophy}</p>
            </blockquote>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/book?coach=${coach.id}`} size="lg" arrow>
                Book with {coach.name}
              </Button>
              <Button href="/coaches" size="lg" variant="outline">
                All coaches
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
