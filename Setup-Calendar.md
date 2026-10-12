---
doc: Setup-Calendar
purpose: Create the in-person offensive line group coaching sessions in a real scheduler, then embed that scheduler on the site's /calendar page so athletes can book a spot
audience: Claude Code (an AI agent) working in this repo, guiding a non-technical site owner
repo: Summit Line Academy marketing site (Next.js App Router + Tailwind, static export on GitHub Pages)
estimated_time: 30-45 minutes
result: Visitors click "Book a Session", land on /calendar, and reserve a spot in an in-person group coaching session (with a capped number of athletes per session)
recommended_path: calendly (group events with a max-invitee cap). Google Calendar cannot cap group size natively.
facts_last_checked: 2026-10 (Calendly Help Center: group event types are on paid plans, 2 to 9,999 invitees)
---

# Setup-Calendar: create group coaching sessions and embed the booking calendar

## 0. Rules for the AI agent (read first)

1. **Read `AGENTS.md` before writing code.** This repo uses a newer Next.js than your training data. Docs are in `node_modules/next/dist/docs/`. Do not guess APIs.
2. **Do not commit or push unless the user says so.** Make the edits, verify, then ask.
3. **This is a static site** (`output: "export"` in `next.config.ts`, hosted on GitHub Pages). No server routes, no secrets. The booking URL is public, so it is safe to store in the repo.
4. **Match the owner's convention: comment code out instead of deleting it** so it can be restored. Use `//` or `{/* */}`.
5. Use the Edit tool for edits, not shell `sed` on Windows paths.
6. Markers used below:
   - `[ASK USER]` ask the owner and wait for the answer.
   - `[HUMAN STEP]` something only the owner can do in a browser (Google / Calendly account). Give them the steps, then wait. Do not log in to their accounts for them or ask for their passwords.
   - `[CODE]` an edit you perform.
   - `[VERIFY]` a check you run and report on.
7. Be honest about product limits. Menu names and plan limits change; if the owner's screen differs from the steps, adapt to the nearest equivalent and say so.

## 1. What exists today (facts about this repo)

| Thing | Location | Notes |
|---|---|---|
| Demo calendar page | `src/app/calendar/page.tsx` renders `<CalendarView />` | Fake sessions stored in the visitor's browser. This is what we replace. |
| Demo calendar UI | `src/components/CalendarView.tsx`, `src/components/Sessions.tsx` | Keep the files, stop using them. |
| Demo booking flow | `src/app/book/page.tsx` renders `<BookingFlow />` | Replaced by a redirect to `/calendar`. |
| Demo session data | `src/lib/data.ts` (`WEEKLY` array) | Source of the example schedule in section 3. |
| Site config | `src/lib/site.ts` | We add a `BOOKING` constant here. |
| CTAs | Header, hero, cards already say "Book a Session" and link to `/calendar` | Nothing to rename. |
| Links still pointing at the demo flow | `src/components/cards.tsx`, `src/app/coaches/[slug]/page.tsx`, `src/app/page.tsx` (Upcoming section) | Retargeted in step 6.4. |
| Waiver form (already used by the site) | `https://form.jotform.com/262727147203151` | Reuse it in the booking flow (step 4.4). |
| Hosting | GitHub Pages via `.github/workflows/deploy.yml` on push to `main` | Site URL: `https://strassner.github.io/SummitOlineSite/` |

## 2. Choose a path

`[ASK USER]` Say this to the owner first, in plain language:

> Your sessions are in-person group coaching with a limited number of athletes per session. I'll set up a scheduler that shows each session, how many spots are left, collects the athlete's details, and emails a confirmation. The best fit is **Calendly** (paid plan). Google Calendar can also be embedded, but it can't limit a session to a set number of athletes. Which do you want?

| | Path A: Google Calendar | Path B: Calendly (recommended) |
|---|---|---|
| Several athletes in one session slot | **No.** Appointment schedules book one person per slot; verify in the owner's account whether a multi-attendee option exists | **Yes.** "Group" event type, 2 to 9,999 invitees per slot |
| Shows "spots left" | No | Yes (setting on the group event) |
| In-person location with address | Yes | Yes |
| Custom questions (athlete name, age, position) | Yes | Yes |
| Take payment at booking | Only on some Workspace plans (verify) | Yes (Stripe or PayPal, paid plan) |
| Free tier | Yes | **No. Group events need a paid plan.** |
| Appears in the coach's own calendar | Yes, natively | Yes (syncs to Google/Outlook) |

Rule of thumb for the AI: if the owner wants a **cap on athletes per session**, steer to Path B. Only continue with Path A if they accept that each time slot books one athlete and capacity is managed by hand.

Set a variable for the rest of the session: `PROVIDER = "google"` or `PROVIDER = "calendly"`.

---

## 3. Plan the group sessions (do this before touching any scheduler)

`[ASK USER]` Collect these answers. Offer the example schedule as a starting point; the owner edits it.

**Questions**

1. Training **address** (street, city, state, ZIP) and any arrival notes (field, door, parking).
2. For each session type: **name, day and time, length, max athletes, price (or free), age or grade range, coach**.
3. How far ahead can athletes book (for example 30 days), and what is the **minimum notice** (for example 4 hours)?
4. **Cancellation policy** (the site's template says cancel up to 24 hours before for a refund).
5. Who receives the booking notifications (email)?

**Example starting schedule** (taken from the demo data; the owner confirms or changes every row):

| Session (event name) | Day / time | Length | Max athletes | Price | Ages / grades |
|---|---|---|---|---|---|
| OL Fundamentals: Small Group | Mon 5:30 PM | 60 min | 8 | $45 | Grades 6 to 12 |
| Pass Protection Lab: Small Group | Wed 6:00 PM | 75 min | 8 | $45 | Grades 8 to 12 + college |
| Strength & Movement: Small Group | Thu 6:00 PM | 60 min | 10 | $40 | Grades 7 to 12 |
| Run Game Lab: Small Group | Sat 9:00 AM | 75 min | 8 | $45 | Grades 8 to 12 + college |
| Youth OL Academy: Small Group | Sat 10:30 AM | 60 min | 10 | $40 | Ages 9 to 13 |

Keep a copy of the owner's final answers; the steps below refer to them as `SESSION_PLAN`.

---

## 4. Path B: Calendly (recommended)

### B1. `[HUMAN STEP]` Account and plan

1. Create or sign in to a Calendly account at calendly.com.
2. Confirm the plan includes **Group** event types (paid plans). If the owner is on the free plan, they must upgrade first or use Path A.
3. **Connect a calendar** (Google or Outlook) under Integrations / Calendar connections so booked sessions show up in the coach's calendar and double-booking is prevented.

### B2. `[HUMAN STEP]` Create one Group event type per session in `SESSION_PLAN`

Repeat these steps for each row of the plan:

1. **Create > Event type > Group** (one host, many invitees).
2. **Event name:** the session name (for example `OL Fundamentals: Small Group`).
3. **Duration:** from the plan.
4. **Location:** choose **In-person meeting** and enter the training address. Add arrival notes in the description.
5. **Description / instructions:** what to bring (cleats or turf shoes, practice gear, water, mouthguard), the age or grade range, and the cancellation policy.
6. **Max invitees:** the cap from the plan. Turn on **Display remaining spots** so athletes see how many are left.
7. **Availability (this creates the recurring weekly session):**
   - Set the **weekly hours** to match the session exactly, for example Monday 5:30 PM to 6:30 PM. One window per session.
   - If the group event is offered as repeating start times inside that window, set the **time slot interval** equal to the **duration** so there is only one start time.
   - Set the **date range / booking window** (for example 30 days into the future) and **minimum scheduling notice** from the answers in section 3.
   - Set **buffers** to 0 unless the coach needs travel or setup time.
8. **Invitee questions** (the booking form). Add:
   - Athlete's full name (required)
   - Athlete's age and grade (required)
   - Position (dropdown: OL, OT, OG, C, DL, Other)
   - Parent or guardian name and mobile number (required)
   - Emergency contact name and phone (required)
   - A checkbox: `I have completed the liability waiver and agree to the cancellation policy.` (required)
9. **Payments** (if charging): Payments / Collect payment > connect Stripe or PayPal and set the price from the plan.
10. **Notifications and reminders:** keep the confirmation email on. If the plan has **Workflows**, add a reminder email (and optional text) about 24 hours before.
11. **After booking, send people to the waiver:** under the confirmation page settings choose **Redirect to an external site** (if the plan supports it) and use `https://form.jotform.com/262727147203151`. If redirect is not available, put the waiver link at the top of the event description and in the confirmation message.
12. **Save**, then switch the event type **On** (not hidden or disabled).

> Why one event type per session: each session is a different day, time, capacity and price. Calendly then shows each with its own remaining spots.

### B3. `[HUMAN STEP]` Get the link to embed

1. If there is **more than one** session type: use the owner's **Calendly profile page**, `https://calendly.com/USERNAME`. It lists every event type, and athletes pick the session they want.
2. If there is **only one** session type: use that event's link, `https://calendly.com/USERNAME/EVENT-SLUG` (**Copy link** on the event card).
3. Open the link in a **signed-out browser window** and confirm it loads and shows the sessions and spots.

`[ASK USER]` Ask them to paste the link. Then continue at section 6 with `PROVIDER = "calendly"`.

> The code in section 6 uses Calendly's iframe embed and adds `embed_domain` automatically, so no script tag or dependency is needed.

---

## 5. Path A: Google Calendar (limited: one athlete per slot)

`[ASK USER]` Before starting, tell the owner plainly: Google appointment schedules take **one booker per time slot**, so they cannot cap a session at 8 athletes or show spots left. Confirm they accept that, or switch to Path B. Also check in their account whether a multi-person or group slot option exists; if it does, use it and note it in your report.

### A1. `[HUMAN STEP]` Put the group sessions on the coach calendar

So the coach's calendar always shows the real sessions, create each session in `SESSION_PLAN` as a normal **recurring event** in Google Calendar: title, **location = the training address**, repeat weekly on the right day, and the description with age range and what to bring.

### A2. `[HUMAN STEP]` Create the appointment schedule

1. Open Google Calendar > **Create** > **Appointment schedule**.
2. Title: `Summit Line Academy: Group Coaching`.
3. **Duration:** the session length. **Availability:** only the session days and hours from `SESSION_PLAN`.
4. **Booking form:** add athlete name, age, position, parent phone, emergency contact.
5. **Location:** In person, with the training address.
6. Set the **scheduling window** and **minimum notice** from section 3.
7. Choose the calendar bookings are saved to. Turn on confirmation emails and reminders if offered. **Save**.

> Because each slot books one person, a session closes after the first athlete. If that is a problem, stop and use Path B.

### A3. `[HUMAN STEP]` Get the embed link

1. Open the schedule and choose **Share** (wording may be "Booking page" or "Embed / Add to website").
2. Google shows an `<iframe>` snippet like:

```html
<iframe src="https://calendar.google.com/calendar/appointments/schedules/XXXXXXXX?gv=true" style="border: 0" width="100%" height="600" frameborder="0"></iframe>
```

3. Copy **only the URL inside `src="..."`**.
4. Confirm the booking page opens in a signed-out browser window.

`[ASK USER]` Ask them to paste the URL. Then continue at section 6 with `PROVIDER = "google"`.

---

## 6. Code changes (both paths)

### 6.1 `[CODE]` Add the booking config to `src/lib/site.ts`

Append at the end of the file (do not remove anything):

```ts
/** Real booking calendar embedded on /calendar. See Setup-Calendar.md. */
export const BOOKING = {
  /** "google" = Google Calendar appointment schedule URL, "calendly" = Calendly profile or event link */
  provider: "PROVIDER_HERE" as "google" | "calendly",
  /** The public booking URL (the src="..." from Google's embed code, or the Calendly link) */
  url: "BOOKING_URL_HERE",
};
```

Replace `PROVIDER_HERE` with `google` or `calendly`, and `BOOKING_URL_HERE` with the URL the owner gave you. If you do not have the URL yet, set `url: ""`; the site shows a friendly "being set up" message instead of breaking.

### 6.2 `[CODE]` Create `src/components/BookingEmbed.tsx`

```tsx
import { BOOKING, SITE } from "@/lib/site";

function embedSrc(): string {
  if (BOOKING.provider !== "calendly") return BOOKING.url;
  // Calendly expects the embedding site's hostname so it can allow the frame.
  const u = new URL(BOOKING.url);
  u.searchParams.set("embed_domain", new URL(SITE.url).hostname);
  u.searchParams.set("embed_type", "Inline");
  u.searchParams.set("hide_gdpr_banner", "1");
  return u.toString();
}

export function BookingEmbed() {
  if (!BOOKING.url) {
    return <div className="border border-dashed border-iron p-10 text-center text-ash">The booking calendar is being set up. Check back soon.</div>;
  }
  return (
    <div>
      <iframe title="Book a Summit Line Academy session" src={embedSrc()} loading="lazy" className="h-[900px] w-full border-0 bg-white sm:h-[760px]" />
      <p className="mt-4 text-sm text-ash">
        Trouble loading the calendar?{" "}
        <a href={BOOKING.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}
```

### 6.3 `[CODE]` Replace the demo calendar on `/calendar`

Edit `src/app/calendar/page.tsx`:

1. Add `import { BookingEmbed } from "@/components/BookingEmbed";`
2. Comment out the `Suspense` and `CalendarView` import and usage (keep them in the file as comments).
3. Render `<BookingEmbed />` inside the existing `<Section>`.
4. Update the hero `intro` and `metadata.description` to match the offer, for example: `Pick a session, reserve your spot and get a confirmation email. In-person offensive line group coaching in Kansas City.`

Resulting body (for reference):

```tsx
<Section>
  {/* <Suspense fallback={<div className="h-96 animate-pulse bg-steel" />}>
    <CalendarView />
  </Suspense> */}
  <BookingEmbed />
</Section>
```

Comment out the now-unused `Suspense` and `CalendarView` imports so `eslint` stays clean.

### 6.4 `[CODE]` Retarget links that pointed at the demo booking flow

| File | Find | Change to |
|---|---|---|
| `src/components/cards.tsx` | `href={`/book?coach=${coach.id}`}` | `href="/calendar"` |
| `src/app/coaches/[slug]/page.tsx` | `href={`/book?coach=${coach.id}`}` | `href="/calendar"` |
| `src/app/page.tsx` | the `{/* UPCOMING */}` `<Section>` that renders `<UpcomingEvents limit={4} />` | Comment out the whole section (it lists fake demo sessions) and the now-unused `UpcomingEvents` import |
| `src/app/sitemap.ts` | `"/book"` in the `pages` array | Remove it (comment it out) |

### 6.5 `[CODE]` Make `/book` redirect to `/calendar`

Create `src/components/RedirectToCalendar.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

export function RedirectToCalendar() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/calendar");
  }, [router]);
  return (
    <Container className="py-32 text-center">
      <p className="mb-6 text-ash">Taking you to the booking calendar…</p>
      <Button href="/calendar" size="lg">
        Book a Session
      </Button>
    </Container>
  );
}
```

Replace the contents of `src/app/book/page.tsx` with (keep the old version as a comment block if you want a restore path):

```tsx
import type { Metadata } from "next";
import { RedirectToCalendar } from "@/components/RedirectToCalendar";

export const metadata: Metadata = {
  title: "Book a Session",
  robots: { index: false },
  alternates: { canonical: "/calendar" },
};

export default function BookPage() {
  return <RedirectToCalendar />;
}
```

### 6.6 What to leave alone

Do not delete `CalendarView.tsx`, `BookingFlow.tsx`, `Sessions.tsx`, `src/lib/store.ts` or `src/lib/data.ts`. The demo code stays in the repo, unused, so it can be restored.

---

## 7. Verify

`[VERIFY]` Run in the repo root and report results:

```bash
npx tsc --noEmit
npx eslint
npm run build
```

All three must pass. Then check in the browser with the dev server (`npm run dev`, or the project's `summit-dev` preview):

| Check | Expected |
|---|---|
| `/calendar` | The real scheduler loads in the page. If `BOOKING.url` is empty: the "being set up" message, no errors. |
| Session list | Every session in `SESSION_PLAN` appears with the right day, time, in-person address and (Calendly) spots left |
| Header "Book a Session" | Goes to `/calendar` |
| `/book` | Redirects to `/calendar` |
| A coach card "Book a Session" | Goes to `/calendar` |
| Home page | No "On the calendar" section listing fake sessions |
| Phone width (375px) | Scheduler is usable, no horizontal scroll |
| **Real test booking** (Calendly) | The booking form asks the athlete questions; the confirmation email arrives; the owner is notified; **remaining spots drop by one**; the waiver link or redirect appears. Cancel the test booking afterward. |
| **Capacity test** (Calendly) | Book until the cap is hit (or temporarily set the cap to 1): the slot shows as full and cannot be booked |

---

## 8. Deploy (only when the user asks)

```bash
git add -A
git commit -m "Embed real booking calendar"
git push origin main
```

Then confirm the live page at `https://strassner.github.io/SummitOlineSite/calendar/` loads the scheduler.

**Custom domain later?** The code derives Calendly's `embed_domain` from `SITE.url` (`src/lib/site.ts`, driven by `NEXT_PUBLIC_SITE_URL`). Make sure that matches the real public hostname or Calendly may refuse to frame.

---

## 9. Ongoing: how the owner runs sessions after launch

Give the owner this short list:

- **Add or change a session:** edit the event type in Calendly (hours, capacity, price). The website updates by itself; no code change is needed.
- **Cancel one session** (weather, coach out): in Calendly, block that date or cancel the booked invitees from the scheduled events list. They are emailed automatically.
- **See who is coming:** Calendly > Scheduled events > click the session to see every athlete signed up and their answers.
- **Seasonal schedule change:** update availability on each event type; add new event types for new session types.
- **New session type:** create another Group event (section 4, B2). If the site uses the profile link it appears automatically.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank iframe, console says it refused to connect | Google schedule not published, or Calendly event is off or hidden | Open the URL in a signed-out window. Fix visibility in the product, then reload. |
| Google shows "schedule not found" | URL copied from the editor's address bar, not the share/embed link | Re-copy the `src` URL from the **Embed** option |
| Calendly page loads but is cut off | Frame too short | Increase `h-[900px]` / `sm:h-[760px]` in `BookingEmbed.tsx` |
| Calendly shows a cookie banner | GDPR banner | Already hidden with `hide_gdpr_banner=1`; remove that line if wanted |
| Session shows only one start time slot or many | Time slot interval does not equal the duration | In the event type, set the interval equal to the duration |
| No "spots left" shown | Setting off | Turn on **Display remaining spots** in the group event |
| Cannot create a Group event | Free plan | Upgrade to a paid plan, or use Path A |
| Group sessions only allow one booker (Google) | Appointment schedules book one person per slot | Use Path B |
| Embed works locally but not on the live site | `embed_domain` / site URL mismatch (Calendly) | Set `NEXT_PUBLIC_SITE_URL` to the live URL and redeploy |
| Booker never gets an email | Notification settings | Turn on confirmation and reminder emails in Calendly or Google settings |
| `npm run build` fails on `new URL(...)` | `BOOKING.url` is not a full `https://` URL | Paste the complete URL including `https://` |

## 11. Rollback

To go back to the demo calendar: set `BOOKING.url` to `""` (shows the "being set up" notice), or restore the commented-out code in `src/app/calendar/page.tsx`, `src/app/book/page.tsx` and the files in step 6.4. `git checkout -- <file>` restores any file you have not committed.

## 12. Machine-readable task list

```json
{
  "doc": "Setup-Calendar",
  "inputs": [
    "provider: calendly (recommended) | google",
    "booking_url: https URL (Calendly profile/event link, or Google appointment schedule embed src)",
    "SESSION_PLAN: address + per-session name/day/time/length/capacity/price/age range",
    "cancellation_policy, notification_email"
  ],
  "human_steps": ["create group event types (one per session) or a Google appointment schedule", "copy the public booking URL", "run a real test booking and a capacity test"],
  "files_create": ["src/components/BookingEmbed.tsx", "src/components/RedirectToCalendar.tsx"],
  "files_edit": [
    "src/lib/site.ts (append BOOKING)",
    "src/app/calendar/page.tsx (render BookingEmbed, comment out CalendarView)",
    "src/app/book/page.tsx (redirect to /calendar)",
    "src/components/cards.tsx (coach CTA -> /calendar)",
    "src/app/coaches/[slug]/page.tsx (coach CTA -> /calendar)",
    "src/app/page.tsx (comment out UPCOMING section + UpcomingEvents import)",
    "src/app/sitemap.ts (drop /book)"
  ],
  "verify": ["npx tsc --noEmit", "npx eslint", "npm run build", "manual: /calendar loads scheduler with all sessions", "manual: real test booking reduces spots left", "manual: capacity test"],
  "do_not": ["commit or push without being asked", "delete demo components", "ask for or enter the owner's passwords", "store secrets (none are needed)"],
  "sources": ["https://calendly.com/help/group-event-type-overview", "https://help.calendly.com/hc/en-us/articles/5430450060439"]
}
```
