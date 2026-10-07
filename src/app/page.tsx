import Link from "next/link";
import { CoachCard, TestimonialCard } from "@/components/cards";
import { ArrowIcon } from "@/components/Icons";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { UpcomingEvents } from "@/components/Sessions";
import { Button, Container, Heading, Photo, Section } from "@/components/ui";
import { COACHES, SERVICES, TESTIMONIALS, WHY } from "@/lib/data";
import { PILLARS, SITE, SOCIALS } from "@/lib/site";
import { SOCIAL_ICONS } from "@/components/Icons";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="photo-slot relative isolate flex min-h-[88svh] items-end overflow-hidden border-b border-iron">
        {/* Drop a full-width hero photo/video here: <Photo src="/photos/hero.jpg" .../> */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <LogoMark className="absolute -right-24 top-10 -z-10 h-[38rem] w-[38rem] text-white opacity-[0.05] sm:right-0" />
        <Container className="pb-16 pt-32 sm:pb-24">
          <p className="mb-6 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.35em] text-gold">
            <span className="h-px w-10 bg-current" />
            Offensive Line Training · {SITE.location.full}
          </p>
          <h1 className="max-w-5xl font-display text-[3.6rem] font-extrabold uppercase leading-[0.88] tracking-tight sm:text-8xl lg:text-[9.5rem]">
            Build your game from the <span className="text-gold">ground up.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">
            Position-specific offensive line training designed to develop stronger, smarter, and more technically sound linemen.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
        </Container>
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
                  <span className="font-display text-3xl font-extrabold text-gold">{n}</span>
                  <span>
                    <span className="block font-display text-xl font-bold uppercase tracking-wide">{t}</span>
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
                <li key={t} className="flex gap-3 border-l-2 border-gold pl-4 text-neutral-800">
                  {t}
                </li>
              ))}
            </ul>
            <Button href="/about" variant="dark" arrow>
              Our Story
            </Button>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative">
              <Photo alt="Offensive linemen working technique in a Summit small group session" label="Training photography" className="cut-lg aspect-[4/5] w-full" />
              <div className="absolute -bottom-5 -left-3 hidden bg-black p-5 text-white sm:block">
                <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold">Youth → College</p>
                <p className="font-display text-2xl font-extrabold uppercase">One position. Total focus.</p>
              </div>
            </div>
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
                  <p className="font-display text-sm font-bold text-gold group-hover:text-gold-dim">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none">{s.title}</h3>
                  <p className="mt-3 text-ash group-hover:text-neutral-700">{s.blurb}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em]">
                  Explore <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <Section id="why" tone="steel">
        <Reveal>
          <Heading eyebrow="Why Summit?" title="The complete offensive lineman." />
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={(i % 4) * 90}>
              <div className="border-t-2 border-gold pt-5">
                <h3 className="font-display text-2xl font-bold uppercase leading-tight">{w.title}</h3>
                <p className="mt-2 text-ash">{w.text}</p>
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
              <CoachCard coach={c} compact />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <section className="relative overflow-hidden border-y border-iron bg-black py-24 sm:py-32">
        <LogoMark className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 text-white opacity-[0.035]" />
        <Container className="relative text-center">
          <p className="mb-6 font-display text-sm font-bold uppercase tracking-[0.35em] text-gold">Training Philosophy</p>
          <h2 className="font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-8xl lg:text-9xl">
            {PILLARS.map((p, i) => (
              <span key={p} className="block">
                {p}
                <span className="text-gold">.</span>
                {i === 0 && <span className="sr-only"> </span>}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-10 max-w-2xl text-lg text-mist">
            We don&apos;t just train strong linemen. We develop the complete offensive lineman: sound in technique, powerful in movement, sharp in football IQ and disciplined in everything he does.
          </p>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <Section tone="steel">
        <Reveal>
          <Heading eyebrow="Testimonials" title="In their words." />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
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
                <p className="font-display text-6xl font-extrabold leading-none text-neutral-300">0{i + 1}</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold uppercase">{t}</h3>
                <p className="mt-2 text-neutral-600">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* MEMBERSHIP CTA */}
      <section className="relative overflow-hidden bg-black py-24 sm:py-32">
        <div className="photo-slot absolute inset-0 opacity-60" />
        <Container className="relative text-center">
          <h2 className="mx-auto max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
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

      {/* SOCIAL */}
      <section className="border-t border-iron bg-coal py-12">
        <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-display text-2xl font-bold uppercase tracking-[0.15em]">Follow the work. @summitlineacademy</p>
          <div className="flex gap-3">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.key];
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center border border-iron text-mist transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
