# Summit Line Academy: website

Next.js (App Router) + React + TypeScript + Tailwind CSS v4, built from the *Website Design & Development Brief*.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What's built

| Brief section | Where |
|---|---|
| Home (hero, about, training, why, coaches, philosophy, testimonials, upcoming events, CTA) | `src/app/page.tsx` |
| About, Training, Memberships (+ compare, FAQ), Camps & Clinics, Content/blog, Gallery, Contact | `src/app/*` |
| Coach profiles | `src/app/coaches/[slug]` |
| Calendar (filters, month grid, availability, price, coach) | `src/components/CalendarView.tsx` |
| Online booking: type → date/time → account → pay → confirmation (+ .ics invite) | `src/components/BookingFlow.tsx` |
| Membership checkout | `src/components/CheckoutFlow.tsx` |
| Customer dashboard: profile, athletes (parent → multiple athletes), membership & credits, bookings, member-only content, payments | `src/app/account/*` |
| Coach/Admin portal: schedule, memberships/pricing, customers, bookings, payments, content, coaches, announcements | `src/components/AdminPortal.tsx` |
| Legal pages + Jotform waiver | `src/app/legal/[slug]`, `src/lib/legal.ts` |
| SEO: metadata per page, `sitemap.xml`, `robots.txt`, JSON-LD, alt text, GA hook | `src/app/layout.tsx`, `sitemap.ts`, `robots.ts` |
| Brand: logo (white/black/mark/transparent SVGs), favicon | `public/brand/*`, `src/components/Logo.tsx`, `src/app/icon.svg` |

## Demo mode: read this

The brief needs a real backend (accounts, recurring payments, scheduling, email). Those can't live in a static front end, so
`src/lib/store.ts` is a **localStorage-backed stand-in** that makes the whole customer + admin journey clickable now:

* **Log in → "Demo: Member"** loads a sample family (John Smith with athletes Jack and Jake, an Elite membership with credits).
* **Log in → "Demo: Admin"** opens `/admin`. Changes to sessions, prices, coaches and the banner update the public site live.
* No passwords are stored and **no card data is ever collected**. Payment is simulated.
* Data lives only in the visiting browser. Admin → *Reset demo* clears it.

## Replace before launch

All placeholder content is marked `PLACEHOLDER`:

* `src/lib/site.ts`: contact info, address, social URLs, waiver link (Jotform from the brief is already wired in)
* `src/lib/data.ts`: coaches, membership names/prices, schedule template, testimonials (`placeholder: true` shows a "Sample" tag), blog posts, member library
* `src/lib/legal.ts`: template policy text, so have counsel review
* Photos/video: drop files in `public/photos/` and pass `src="/photos/x.jpg"` to `<Photo>` (hero, about, coaches via `coach.photo`, gallery via `src`). Until then branded placeholders render.
* Logo: swap `src/components/Logo.tsx` and `public/brand/*.svg` for the official artwork.

## Going to production (answers to brief §36)

| Need | Recommended |
|---|---|
| Payments + recurring memberships | **Stripe** (Checkout + Billing + Customer Portal). Lowest friction for subscriptions/credits |
| Accounts / auth | Clerk or Auth.js; roles `customer` / `admin` |
| Database | Postgres (Supabase / Neon) + Prisma. Tables mirror `src/lib/types.ts` |
| Scheduling & capacity | Built on the `Session` / `Booking` model here (or embed Acuity/Cal.com if you prefer a hosted scheduler) |
| Private video | Mux, Vimeo or Cloudflare Stream; check the member's plan server-side |
| Email / SMS reminders | Resend or Postmark + Twilio, triggered from booking events; calendar invite via the `.ics` generator in `BookingFlow` |
| CMS for non-coders | Sanity or Payload, or the admin portal backed by the DB |
| Contact form | `src/app/api/contact/route.ts` validates + honeypot; wire to email/CRM |
| Hosting | Vercel (HTTPS, CDN, image optimization) |
| Analytics | Set `NEXT_PUBLIC_GA_ID`; add Search Console + Business Profile verification |
| Store / digital products | Add `/shop` using Stripe Products; layout, `Plan`/`Session` types and cart-ready cards are designed to extend |

Environment: copy `.env.example` → `.env.local`.
