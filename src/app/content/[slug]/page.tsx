import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container, Photo, Pill } from "@/components/ui";
import { POSTS } from "@/lib/data";
import { formatDate } from "@/lib/dates";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/content/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/content/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function PostPage(props: PageProps<"/content/[slug]">) {
  const { slug } = await props.params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Container className="max-w-3xl">
        <Link href="/content" className="text-sm uppercase tracking-widest text-gold hover:underline">← All content</Link>
        <div className="mt-6 flex items-center gap-3">
          <Pill tone="gold">{post.category}</Pill>
          <span className="text-sm text-ash">{post.readTime} read · {formatDate(post.date, { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
        <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-7xl">{post.title}</h1>
        <p className="mt-6 text-xl text-mist">{post.excerpt}</p>
        <Photo alt={`${post.title} illustration`} label={post.category} className="my-10 aspect-[16/9] w-full" />
        <div className="space-y-6 text-lg leading-relaxed text-mist">
          {post.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div className="mt-14 border border-gold bg-steel p-8">
          <h2 className="font-display text-3xl font-extrabold uppercase">Want more reps with a coach?</h2>
          <p className="mt-2 text-mist">Train with Summit in Kansas City: private, small group, camps and clinics.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/book" arrow>Book a session</Button>
            <Button href="/memberships" variant="outline">View memberships</Button>
          </div>
        </div>
      </Container>
      <Container className="mt-20">
        <h2 className="mb-6 font-display text-3xl font-extrabold uppercase">More from Summit</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/content/${r.slug}`} className="border border-iron bg-steel p-6 hover:border-gold">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">{r.category}</p>
              <p className="mt-2 font-display text-2xl font-bold uppercase leading-tight">{r.title}</p>
            </Link>
          ))}
        </div>
      </Container>
    </article>
  );
}
