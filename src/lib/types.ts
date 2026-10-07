export type SessionKind = "private" | "small-group" | "team" | "camp" | "clinic" | "event";

export interface Session {
  id: string;
  kind: SessionKind;
  title: string;
  /** YYYY-MM-DD (local) */
  date: string;
  /** 24h HH:MM */
  start: string;
  end: string;
  location: string;
  coachId: string;
  capacity: number;
  /** Spots already taken before any bookings made on this device */
  baseTaken: number;
  price: number; // USD
  /** Number of member credits one booking costs (0 = not creditable, e.g. camps) */
  credits: number;
  description?: string;
  ageRange?: string;
  bring?: string[];
}

export interface Coach {
  id: string;
  slug: string;
  name: string;
  role: string;
  position: string;
  playing: string;
  collegePro: string;
  coaching: string;
  certifications: string[];
  philosophy: string;
  bio: string;
  photo?: string;
}

export type BillingFrequency = "month" | "quarter" | "year";

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  billing: BillingFrequency;
  /** Sessions included per billing period; null = unlimited */
  sessions: number | null;
  perks: string[];
  featured?: boolean;
  /** Member price discount on drop-in session rates (0-1) */
  memberDiscount: number;
  description: string;
  photo?: string;
}

export interface Testimonial {
  id: string;
  role: "athlete" | "parent" | "coach";
  name: string;
  detail: string;
  quote: string;
  placeholder?: boolean;
}

export interface ContentPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  body: string[];
  date: string;
  members?: boolean;
  /** Public video posts (YouTube/Vimeo embed id or URL) */
  video?: string;
}

export interface LibraryItem {
  id: string;
  section: "Technique Library" | "Training Videos" | "Football IQ" | "Documents";
  url?: string;
  title: string;
  summary: string;
  duration: string;
  members: boolean;
}

export interface GalleryItem {
  id: string;
  category: "Training" | "Athletes" | "Coaches" | "Camps" | "Clinics" | "Action" | "Facility";
  caption: string;
  src?: string;
  tall?: boolean;
}

/* ------------------------------ app state ------------------------------ */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  guardian?: string;
}

export interface Athlete {
  id: string;
  name: string;
  age: number;
  position: string;
  school?: string;
}

export interface Membership {
  planId: string;
  athleteId?: string;
  startedAt: string;
  renewsAt: string;
  creditsRemaining: number | null;
}

export interface Booking {
  id: string;
  sessionId: string;
  athleteId: string;
  athleteName: string;
  title: string;
  date: string;
  start: string;
  coachId: string;
  status: "confirmed" | "cancelled" | "attended";
  paidWith: "card" | "credit";
  amount: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "refunded";
}
