/** Local-time date helpers. Dates are handled as "YYYY-MM-DD" strings to avoid timezone drift. */

const pad = (n: number) => String(n).padStart(2, "0");

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return fromISO(iso).toLocaleDateString("en-US", opts ?? { weekday: "short", month: "short", day: "numeric" });
}

export function formatLong(iso: string): string {
  return formatDate(iso, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${pad(m)} ${suffix}`;
}

export function formatRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function money(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

/** Monday = 0 ... Sunday = 6 */
export function weekdayIndex(iso: string): number {
  return (fromISO(iso).getDay() + 6) % 7;
}
