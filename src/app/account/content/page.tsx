"use client";

import { Panel } from "@/components/AccountShell";
import { LockIcon, PlayIcon } from "@/components/Icons";
import { Button } from "@/components/ui";
import { LIBRARY } from "@/lib/data";
import { isMember, useApp } from "@/lib/store";

const SECTIONS = ["Technique Library", "Training Videos", "Football IQ"] as const;

export default function MemberContentPage() {
  const app = useApp();
  const member = isMember(app);
  const items = [
    ...app.customContent.map((c) => ({ id: c.id, section: c.section, title: c.title, summary: "Added by Summit coaches.", duration: "New", members: c.members })),
    ...LIBRARY,
  ];
  return (
    <>
      {!member && (
        <div className="mb-8 border border-gold bg-steel p-6">
          <div className="flex items-start gap-4">
            <LockIcon className="mt-1 h-6 w-6 shrink-0 text-gold" />
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase">Member content is locked</h2>
              <p className="mt-1 text-mist">Join a Summit membership to unlock the full technique library, training videos and football IQ courses.</p>
              <Button href="/memberships" className="mt-4" arrow>View memberships</Button>
            </div>
          </div>
        </div>
      )}
      {SECTIONS.map((sec) => (
        <Panel key={sec} title={sec}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.filter((i) => i.section === sec).map((i) => {
              const locked = i.members && !member;
              return (
                <article key={i.id} className="border border-iron bg-coal">
                  <div className={`photo-slot flex aspect-video items-center justify-center ${locked ? "opacity-50" : ""}`}>
                    {locked ? <LockIcon className="h-9 w-9 text-white/60" /> : <PlayIcon className="h-11 w-11 text-white/80" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-2xl font-bold uppercase leading-tight">{i.title}</h3>
                    <p className="mt-1 text-sm text-ash">{i.summary}</p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-gold">{locked ? "Members only" : i.duration}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Panel>
      ))}
      <p className="text-xs text-ash">Videos are placeholders. In production they stream from a private video host (Mux, Vimeo, or Cloudflare Stream) with access checked against the member&apos;s plan.</p>
    </>
  );
}
