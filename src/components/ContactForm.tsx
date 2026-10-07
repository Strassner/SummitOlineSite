"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { CheckIcon } from "./Icons";
import { Button } from "./ui";

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

export const CONTACT_TOPICS = ["General Question", "Private Training", "Membership", "Camps/Clinics", "Team Training", "Partnership/Sponsorship"];

export function ContactForm() {
  const params = useSearchParams();
  const wanted = params.get("topic");
  const defaultTopic = CONTACT_TOPICS.find((t) => t.toLowerCase().startsWith((wanted ?? "").toLowerCase()) && wanted) ?? CONTACT_TOPICS[0];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    body.name = `${body.firstName ?? ""} ${body.lastName ?? ""}`.trim();
    if (body.website) return setStatus("sent"); // honeypot: silently drop bots

    // Static hosting has no server, so submit to a form service (Formspree, Basin, etc.) when configured,
    // otherwise fall back to the visitor's email app.
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`[${body.topic}] ${body.name}`);
      const text = encodeURIComponent([body.message, "", body.name, body.email, body.phone].filter((l) => l !== undefined && l !== "").join("\n"));
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${text}`;
      return setStatus("sent");
    }
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Something went wrong. Please email us directly.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div className="border border-black p-8">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white"><CheckIcon className="h-7 w-7" /></span>
        <h2 className="font-display text-4xl uppercase">Message sent.</h2>
        <p className="mt-2 text-neutral-600">Thanks for reaching out. A Summit coach will reply within one business day.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <p className="mb-1.5 text-sm">Name</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs">First Name <span className="text-neutral-500">(required)</span></span>
            <input name="firstName" required autoComplete="given-name" className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs">Last Name <span className="text-neutral-500">(required)</span></span>
            <input name="lastName" required autoComplete="family-name" className="field" />
          </label>
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm">Email <span className="text-xs text-neutral-500">(required)</span></span>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm">Phone <span className="text-xs text-neutral-500">(optional)</span></span>
          <input name="phone" type="tel" autoComplete="tel" className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm">I&apos;m reaching out about</span>
          <select name="topic" defaultValue={defaultTopic} className="field">
            {CONTACT_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm">Message <span className="text-xs text-neutral-500">(required)</span></span>
        <textarea name="message" required minLength={5} rows={4} className="field" />
      </label>
      {/* honeypot spam protection */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="dark" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
