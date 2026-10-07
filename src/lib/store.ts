"use client";

/**
 * Client-side demo "backend".
 *
 * The brief calls for accounts, memberships, booking, payments and an admin portal. Those need a
 * real server (database + auth + Stripe). This module is a thin, swappable stand-in that persists to
 * localStorage so the entire customer journey and admin tools are fully clickable today.
 *
 * To go live, replace the action functions below with calls to your API / providers
 * (see README "Going to production"). Components only talk to `useApp()` and the actions exported here.
 */

import { useSyncExternalStore } from "react";
import { addDays, toISO } from "./dates";
import { buildSeedSessions, COACHES, PLANS } from "./data";
import type { Athlete, Booking, Coach, Membership, Payment, Plan, Session, User } from "./types";

export interface ContentItem {
  id: string;
  title: string;
  section: "Technique Library" | "Training Videos" | "Football IQ";
  members: boolean;
}

export interface AppState {
  ready: boolean;
  today: string;
  user: User | null;
  savedUser: User | null;
  athletes: Athlete[];
  membership: Membership | null;
  bookings: Booking[];
  payments: Payment[];
  planOverrides: Record<string, Partial<Plan>>;
  customSessions: Session[];
  removedSessionIds: string[];
  customCoaches: Coach[];
  removedCoachIds: string[];
  customContent: ContentItem[];
  announcement: string;
}

const KEY = "summit-line-academy:v1";

const EMPTY: AppState = {
  ready: false,
  today: "2026-01-01",
  user: null,
  savedUser: null,
  athletes: [],
  membership: null,
  bookings: [],
  payments: [],
  planOverrides: {},
  customSessions: [],
  removedSessionIds: [],
  customCoaches: [],
  removedCoachIds: [],
  customContent: [],
  announcement: "",
};

let state: AppState | null = null;
const listeners = new Set<() => void>();

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);

function load(): AppState {
  let saved: Partial<AppState> = {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) saved = JSON.parse(raw);
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return { ...EMPTY, ...saved, ready: true, today: toISO(new Date()) };
}

function persist(s: AppState) {
  try {
    const { ready: _r, today: _t, ...rest } = s;
    void _r;
    void _t;
    window.localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* ignore */
  }
}

function set(updater: (s: AppState) => AppState) {
  state = updater(getSnapshot());
  persist(state);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): AppState {
  if (state === null) state = load();
  return state;
}

function getServerSnapshot(): AppState {
  return EMPTY;
}

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ------------------------------- selectors ------------------------------- */

export function getPlans(s: AppState): Plan[] {
  return PLANS.map((p) => ({ ...p, ...(s.planOverrides[p.id] ?? {}) }));
}

export function getCoaches(s: AppState): Coach[] {
  return [...COACHES, ...s.customCoaches].filter((c) => !s.removedCoachIds.includes(c.id));
}

let seedCache: { today: string; list: Session[] } | null = null;
function seedSessions(today: string): Session[] {
  if (!seedCache || seedCache.today !== today) seedCache = { today, list: buildSeedSessions(today) };
  return seedCache.list;
}

export function getSessions(s: AppState): Session[] {
  if (!s.ready) return [];
  return [...seedSessions(s.today), ...s.customSessions]
    .filter((x) => !s.removedSessionIds.includes(x.id))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

export function bookedCount(s: AppState, sessionId: string): number {
  return s.bookings.filter((b) => b.sessionId === sessionId && b.status !== "cancelled").length;
}

export function spotsLeft(s: AppState, session: Session): number {
  return Math.max(0, session.capacity - session.baseTaken - bookedCount(s, session.id));
}

export function getPlan(s: AppState, id: string | undefined | null): Plan | undefined {
  return id ? getPlans(s).find((p) => p.id === id) : undefined;
}

/** Price after applying member discount, if the signed-in user has an active membership */
export function priceFor(s: AppState, session: Session): number {
  const plan = getPlan(s, s.membership?.planId);
  if (!plan) return session.price;
  return Math.round(session.price * (1 - plan.memberDiscount));
}

export function canUseCredit(s: AppState, session: Session): boolean {
  const m = s.membership;
  if (!m || session.credits <= 0) return false;
  if (m.creditsRemaining === null) return session.kind === "small-group";
  return m.creditsRemaining >= session.credits;
}

export function isMember(s: AppState): boolean {
  return !!s.user && !!s.membership;
}

/* -------------------------------- actions -------------------------------- */

export function signUp(input: { name: string; email: string; phone?: string; guardian?: string }): User {
  const user: User = { id: uid(), role: "customer", name: input.name, email: input.email.trim().toLowerCase(), phone: input.phone, guardian: input.guardian };
  set((s) => ({ ...s, user, savedUser: user }));
  return user;
}

/** Demo sign-in: restores the account created on this device. Replace with real auth. */
export function signIn(email: string): boolean {
  const s = getSnapshot();
  const candidate = s.user ?? s.savedUser;
  if (candidate && candidate.email === email.trim().toLowerCase()) {
    set((cur) => ({ ...cur, user: candidate }));
    return true;
  }
  return false;
}

export function signOut() {
  set((s) => ({ ...s, user: null, savedUser: s.user ?? s.savedUser }));
}

/** Seeds a ready-made demo family (matches the "Parent → Multiple Athletes" example in the brief) */
export function signInDemo(role: "customer" | "admin") {
  const today = getSnapshot().today;
  if (role === "admin") {
    set((s) => ({ ...s, user: { id: "admin-1", role: "admin", name: "Summit Admin", email: "admin@summitlineacademy.com" } }));
    return;
  }
  const user: User = { id: "demo-parent", role: "customer", name: "John Smith", email: "john.smith@example.com", phone: "(816) 555-0100" };
  const athletes: Athlete[] = [
    { id: "ath-jack", name: "Jack Smith", age: 10, position: "OL", school: "Northland Youth Football" },
    { id: "ath-jake", name: "Jake Smith", age: 13, position: "OL", school: "Lee's Summit Middle School" },
  ];
  const membership: Membership = { planId: "elite", athleteId: "ath-jake", startedAt: addDays(today, -41), renewsAt: addDays(today, 19), creditsRemaining: 5 };
  const bookings: Booking[] = [
    { id: "bk-1", sessionId: "past-1", athleteId: "ath-jake", athleteName: "Jake Smith", title: "Pass Protection Lab · Small Group", date: addDays(today, -4), start: "18:00", coachId: "coach-2", status: "attended", paidWith: "credit", amount: 0, createdAt: addDays(today, -9) },
    { id: "bk-2", sessionId: "past-2", athleteId: "ath-jack", athleteName: "Jack Smith", title: "Youth OL Academy · Small Group", date: addDays(today, -9), start: "10:30", coachId: "coach-1", status: "attended", paidWith: "card", amount: 36, createdAt: addDays(today, -12) },
    { id: "bk-3", sessionId: "past-3", athleteId: "ath-jake", athleteName: "Jake Smith", title: "Private Training · 1-on-1", date: addDays(today, -16), start: "16:00", coachId: "coach-1", status: "cancelled", paidWith: "credit", amount: 0, createdAt: addDays(today, -20) },
  ];
  const payments: Payment[] = [
    { id: "pay-1", date: addDays(today, -41), description: "Summit Elite · monthly membership", amount: 229, status: "paid" },
    { id: "pay-2", date: addDays(today, -12), description: "Youth OL Academy · Small Group (Jack)", amount: 36, status: "paid" },
    { id: "pay-3", date: addDays(today, -11), description: "Summit Elite · monthly membership", amount: 229, status: "paid" },
  ];
  set((s) => ({ ...s, user, savedUser: user, athletes, membership, bookings, payments }));
}

export function addAthlete(a: Omit<Athlete, "id">): Athlete {
  const athlete = { ...a, id: uid() };
  set((s) => ({ ...s, athletes: [...s.athletes, athlete] }));
  return athlete;
}

export function removeAthlete(id: string) {
  set((s) => ({ ...s, athletes: s.athletes.filter((a) => a.id !== id) }));
}

export function updateProfile(patch: Partial<User>) {
  set((s) => (s.user ? { ...s, user: { ...s.user, ...patch }, savedUser: { ...s.user, ...patch } } : s));
}

export function purchasePlan(planId: string, athleteId?: string): boolean {
  const s = getSnapshot();
  const plan = getPlan(s, planId);
  if (!plan || !s.user) return false;
  const months = plan.billing === "month" ? 1 : plan.billing === "quarter" ? 3 : 12;
  const membership: Membership = {
    planId,
    athleteId,
    startedAt: s.today,
    renewsAt: addDays(s.today, months * 30),
    creditsRemaining: plan.sessions,
  };
  const payment: Payment = { id: uid(), date: s.today, description: `${plan.name} · ${plan.billing}ly membership`, amount: plan.price, status: "paid" };
  set((cur) => ({ ...cur, membership, payments: [payment, ...cur.payments] }));
  return true;
}

export function cancelMembership() {
  set((s) => ({ ...s, membership: null }));
}

export interface BookResult {
  ok: boolean;
  error?: string;
  booking?: Booking;
}

export function bookSession(sessionId: string, athleteId: string, payWith: "card" | "credit"): BookResult {
  const s = getSnapshot();
  const session = getSessions(s).find((x) => x.id === sessionId);
  const athlete = s.athletes.find((a) => a.id === athleteId);
  if (!s.user) return { ok: false, error: "Please sign in to book." };
  if (!session) return { ok: false, error: "That session is no longer available." };
  if (!athlete) return { ok: false, error: "Choose an athlete." };
  if (spotsLeft(s, session) <= 0) return { ok: false, error: "Sorry, this session is full." };
  if (s.bookings.some((b) => b.sessionId === sessionId && b.athleteId === athleteId && b.status !== "cancelled"))
    return { ok: false, error: `${athlete.name} is already booked for this session.` };
  if (payWith === "credit" && !canUseCredit(s, session)) return { ok: false, error: "No eligible credits remaining." };

  const amount = payWith === "credit" ? 0 : priceFor(s, session);
  const booking: Booking = {
    id: uid(),
    sessionId,
    athleteId,
    athleteName: athlete.name,
    title: session.title,
    date: session.date,
    start: session.start,
    coachId: session.coachId,
    status: "confirmed",
    paidWith: payWith,
    amount,
    createdAt: s.today,
  };
  set((cur) => ({
    ...cur,
    bookings: [booking, ...cur.bookings],
    payments:
      payWith === "card"
        ? [{ id: uid(), date: cur.today, description: `${session.title} (${athlete.name})`, amount, status: "paid" as const }, ...cur.payments]
        : cur.payments,
    membership:
      payWith === "credit" && cur.membership && cur.membership.creditsRemaining !== null
        ? { ...cur.membership, creditsRemaining: cur.membership.creditsRemaining - session.credits }
        : cur.membership,
  }));
  return { ok: true, booking };
}

export function cancelBooking(id: string) {
  set((s) => {
    const b = s.bookings.find((x) => x.id === id);
    if (!b || b.status !== "confirmed") return s;
    const session = getSessions(s).find((x) => x.id === b.sessionId);
    return {
      ...s,
      bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: "cancelled" as const } : x)),
      membership:
        b.paidWith === "credit" && s.membership && s.membership.creditsRemaining !== null
          ? { ...s.membership, creditsRemaining: s.membership.creditsRemaining + (session?.credits ?? 1) }
          : s.membership,
      payments:
        b.paidWith === "card" && b.amount > 0
          ? [{ id: uid(), date: s.today, description: `Refund: ${b.title} (${b.athleteName})`, amount: b.amount, status: "refunded" as const }, ...s.payments]
          : s.payments,
    };
  });
}

/* ---- admin actions (the "CMS") ---- */

export function upsertSession(session: Omit<Session, "id" | "baseTaken"> & { id?: string }) {
  const full: Session = { ...session, id: session.id ?? `custom-${uid()}`, baseTaken: 0 };
  set((s) => ({ ...s, customSessions: [...s.customSessions.filter((x) => x.id !== full.id), full] }));
}

export function removeSession(id: string) {
  set((s) => ({
    ...s,
    customSessions: s.customSessions.filter((x) => x.id !== id),
    removedSessionIds: s.removedSessionIds.includes(id) ? s.removedSessionIds : [...s.removedSessionIds, id],
  }));
}

export function updatePlan(id: string, patch: Partial<Plan>) {
  set((s) => ({ ...s, planOverrides: { ...s.planOverrides, [id]: { ...(s.planOverrides[id] ?? {}), ...patch } } }));
}

export function setAnnouncement(text: string) {
  set((s) => ({ ...s, announcement: text }));
}

export function addCoach(c: Omit<Coach, "id" | "slug">) {
  const id = `coach-${uid()}`;
  const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || id;
  set((s) => ({ ...s, customCoaches: [...s.customCoaches, { ...c, id, slug: `${slug}-${id.slice(-3)}` }] }));
}

export function removeCoach(id: string) {
  set((s) => ({
    ...s,
    customCoaches: s.customCoaches.filter((c) => c.id !== id),
    removedCoachIds: s.removedCoachIds.includes(id) ? s.removedCoachIds : [...s.removedCoachIds, id],
  }));
}

export function addContentItem(item: Omit<ContentItem, "id">) {
  set((s) => ({ ...s, customContent: [{ ...item, id: uid() }, ...s.customContent] }));
}

export function removeContentItem(id: string) {
  set((s) => ({ ...s, customContent: s.customContent.filter((c) => c.id !== id) }));
}

export function resetDemo() {
  set(() => ({ ...EMPTY, ready: true, today: toISO(new Date()) }));
}
