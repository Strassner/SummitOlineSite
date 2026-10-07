import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { LEGAL_DOCS } from "@/lib/legal";
import { LEGAL, SITE } from "@/lib/site";
import Link from "next/link";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  return doc ? { title: doc.title, description: `${doc.title} for ${SITE.name}.`, alternates: { canonical: `/legal/${doc.slug}` } } : {};
}

export default async function LegalPage(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <Container className="py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Legal" className="lg:sticky lg:top-28 lg:h-fit">
          <ul className="space-y-2">
            {LEGAL.map((l) => (
              <li key={l.slug}>
                <Link href={`/legal/${l.slug}`} aria-current={l.slug === slug ? "page" : undefined} className={`block border-l-2 py-1 pl-4 text-sm uppercase tracking-widest ${l.slug === slug ? "border-gold text-white" : "border-iron text-ash hover:text-white"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-3xl">
          <h1 className="font-display text-6xl font-extrabold uppercase leading-none">{doc.title}</h1>
          <p className="mt-3 text-sm text-ash">Last updated {doc.updated}. Template text: to be reviewed by counsel before launch.</p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-gold">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-mist">{p}</p>
              ))}
            </section>
          ))}
          {doc.slug === "waiver" && (
            <div className="mt-10">
              <Button href={SITE.waiverUrl} size="lg" arrow>Complete the waiver</Button>
              <iframe title="Summit Line Academy digital waiver form" src={SITE.waiverUrl} loading="lazy" className="mt-8 h-[900px] w-full border border-iron bg-white" />
            </div>
          )}
        </article>
      </div>
    </Container>
  );
}
