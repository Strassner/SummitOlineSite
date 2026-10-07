import Link from "next/link";
import Image from "next/image";
import { CoachCard } from "@/components/cards";
import { ArrowIcon } from "@/components/Icons";
import { Watermark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { UpcomingEvents } from "@/components/Sessions";
import { SocialFeed } from "@/components/SocialFeed";
import { Testimonials } from "@/components/Testimonials";
import { Button, Container, Heading, Photo, Section } from "@/components/ui";
import { COACHES, SERVICES, WHY } from "@/lib/data";
import { asset, PILLARS, SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* HERO: full-bleed photo under a plain white header, brand name centered (design reference) */}
      <section className="bg-white px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="relative isolate flex min-h-[74svh] items-center justify-center overflow-hidden bg-ink text-center">
          {SITE.heroVideo ? (
            <video className="absolute inset-0 -z-20 h-full w-full object-cover" src={asset(SITE.heroVideo)} autoPlay muted loop playsInline poster={SITE.heroImage ? asset(SITE.heroImage) : undefined} />
          ) : SITE.heroImage ? (
            <Image src={asset(SITE.heroImage)} alt="A coach standing on the field of an empty stadium at dusk" fill priority sizes="100vw" className="-z-20 object-cover object-[60%_50%]" />
          ) : (
            <div className="photo-slot absolute inset-0 -z-20" />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-black/10 to-black/55" />
          <div className="w-full max-w-7xl px-5 py-24 text-white sm:py-32">
            <h1 className="font-display text-[2.7rem] uppercase leading-[1] sm:whitespace-nowrap sm:text-7xl lg:text-[6.75rem]">Summit Line Academy</h1>
            <p className="mt-6 font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-4xl">
              Build your game from the <span className="text-gold">ground up.</span>
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Position-specific offensive line training designed to develop stronger, smarter, and more technically sound linemen.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/book" size="lg" arrow>
                Book a Session
              </Button>
              <Button href="/memberships" size="lg" variant="outline">
                View Memberships
              </Button>
              <Button href="#about" size="lg" variant="ghost">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHO / WHAT / WHY / HOW */}
      <section className="border-b border-iron bg-black">
        <Container>
          <ol className="grid divide-iron sm:grid-cols-2 sm:divide-x lg:grid-cols-4 [&>li]:border-b [&>li]:border-iron lg:[&>li]:border-b-0">
            {[
              ["01", "Who we are", "An offensive-line-only academy.", "#about"],
              ["02", "What we do", "Private, group, camps & online.", "#training"],
              ["03", "Why Summit", "Technique, strength, IQ, discipline.", "#why"],
              ["04", "How to start", "Pick a plan. Book. Train.", "#start"],
            ].map(([n, t, d, href]) => (
              <li key={n}>
                <Link href={href} className="group flex items-start gap-4 px-2 py-7 transition-colors hover:bg-steel sm:px-6">
                  <span className="font-display text-4xl text-gold">{n}</span>
                  <span>
                    <span className="block font-display text-2xl uppercase tracking-wide">{t}</span>
                    <span className="block text-sm text-ash">{d}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ABOUT */}
      <Section id="about" tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Heading
              light
              eyebrow="About Summit"
              title={
                <>
                  Built for <span className="text-gold-dim">linemen.</span>
                </>
              }
              intro="Summit Line Academy is an offensive-line-specific football training business developing athletes through position-specific instruction, strength and movement development, football IQ, technique and competitive training."
            />
            <ul className="mb-10 grid gap-3 text-lg sm:grid-cols-2">
              {["Who we are: coaches who live the position", "What makes us different: only offensive line", "Our approach: technique first, then power", "Who we train: youth to college"].map((t) => (
                <li key={t} className="border-l-2 border-gold pl-4 text-neutral-800">
                  {t}
                </li>
              ))}
            </ul>
            <Button href="/about" variant="dark" arrow>
              Our Story
            </Button>
          </Reveal>
          <Reveal delay={150}>
            <Photo alt="Offensive linemen working technique in a Summit small group session" label="Training photography" className="aspect-[4/5] w-full" />
          </Reveal>
        </div>
      </Section>

      {/* TRAINING */}
      <Section id="training">
        <Reveal>
          <Heading eyebrow="Training" title="Choose how you train." intro="Every option is built around the same Summit curriculum: pick the format that fits your athlete." />
        </Reveal>
        <div className="grid gap-px bg-iron sm:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
              <Link href={s.href} className="group flex h-full min-h-56 flex-col justify-between bg-coal p-8 transition-colors hover:bg-white hover:text-black">
                <div>
                  <p className="font-display text-lg text-gold group-hover:text-gold-dim">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-4xl uppercase leading-none">{s.title}</h3>
                  <p className="mt-3 text-ash group-hover:text-neutral-700">{s.blurb}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 font-display text-base uppercase tracking-[0.15em]">
                  Explore <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <Section id="why" tone="light">
        <Reveal>
          <Heading light eyebrow="Why Summit?" title="The complete offensive lineman." />
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={(i % 4) * 90}>
              <div className="border-t-2 border-black pt-5">
                <h3 className="font-display text-3xl uppercase leading-tight">{w.title}</h3>
                <p className="mt-2 text-neutral-600">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* COACHES */}
      <Section tone="dark">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <Heading eyebrow="Coaches" title="Coached by the position." className="!mb-0" />
            <Button href="/coaches" variant="outline" arrow>
              Meet the Coaches
            </Button>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COACHES.map((c, i) => (
            <Reveal key={c.id} delay={i * 120}>
              <CoachCard coach={c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <section className="relative overflow-hidden border-y border-iron bg-black py-24 text-white sm:py-32">
        <Watermark className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />
        <Container className="relative text-center">
          <p className="mb-6 font-display text-lg uppercase tracking-[0.35em] text-gold">Training Philosophy</p>
          <h2 className="font-display text-7xl uppercase leading-[0.95] sm:text-9xl lg:text-[11rem]">
            {PILLARS.map((p) => (
              <span key={p} className="block">
                {p}
                <span className="text-gold">.</span>
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-10 max-w-2xl text-lg text-mist">
            We don&apos;t just train strong linemen. We develop the complete offensive lineman: sound in technique, powerful in movement, sharp in football IQ and disciplined in everything he does.
          </p>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <Section tone="light">
        <Reveal>
          <Heading light eyebrow="Testimonials" title="In their words." />
        </Reveal>
        <Testimonials />
      </Section>

      {/* UPCOMING */}
      <Section>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <Heading eyebrow="Upcoming" title="On the calendar." className="!mb-0" />
            <Button href="/calendar" arrow>
              View Full Calendar
            </Button>
          </div>
        </Reveal>
        <div className="mt-12">
          <UpcomingEvents limit={4} />
        </div>
      </Section>

      {/* HOW TO START */}
      <Section id="start" tone="light">
        <Reveal>
          <Heading light eyebrow="How to get started" title="Four steps to Summit." align="center" />
        </Reveal>
        <ol className="grid gap-8 md:grid-cols-4">
          {[
            ["Learn", "See how we train and who we coach."],
            ["Choose", "Pick private, group or a membership."],
            ["Book", "Select a time, create an account, pay."],
            ["Train", "Show up. Return to your member portal."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <li className="border-t-4 border-black pt-5">
                <p className="font-display text-7xl leading-none text-neutral-300">0{i + 1}</p>
                <h3 className="mt-3 font-display text-4xl uppercase">{t}</h3>
                <p className="mt-2 text-neutral-600">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* MEMBERSHIP CTA */}
      <section className="relative overflow-hidden bg-black py-24 text-white sm:py-32">
        <div className="photo-slot absolute inset-0 opacity-60" />
        <Watermark className="absolute -left-20 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 opacity-[0.07]" />
        <Container className="relative text-center">
          <h2 className="mx-auto max-w-4xl font-display text-6xl uppercase leading-[0.95] sm:text-8xl lg:text-9xl">
            Ready to take your game to the <span className="text-gold">next level?</span>
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/memberships" size="lg" arrow>
              View Memberships
            </Button>
            <Button href="/calendar" size="lg" variant="outline">
              View Calendar
            </Button>
          </div>
        </Container>
      </section>

      <SocialFeed />
    </>
  );
}
