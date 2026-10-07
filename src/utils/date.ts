const DAY_MS = 86_400_000;
const LOCALE = 'en-GB';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
const timeFormatter = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

/** ISO timestamp `offsetDays` from today (negative = past) at a given local time. */
export function daysFromToday(offsetDays: number, hour = 10, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));

export const formatDateTime = (iso: string): string => dateTimeFormatter.format(new Date(iso));

export const formatTime = (iso: string): string => timeFormatter.format(new Date(iso));

export const formatLongToday = (): string => weekdayFormatter.format(new Date());

export function getGreeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Weeks start on Monday. */
export function startOfWeek(date: Date): Date {
  const result = startOfDay(date);
  const offset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - offset);
  return result;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Calendar-day difference: 0 = today, 1 = tomorrow, -1 = yesterday. */
export function dayDifference(iso: string, now = new Date()): number {
  return Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY_MS);
}

export function formatRelative(iso: string, now = new Date()): string {
  const days = dayDifference(iso, now);
  const absDays = Math.abs(days);
  if (absDays < 7) return relativeFormatter.format(days, 'day');
  if (absDays < 30) return relativeFormatter.format(Math.trunc(days / 7), 'week');
  if (absDays < 365) return relativeFormatter.format(Math.trunc(days / 30), 'month');
  return relativeFormatter.format(Math.trunc(days / 365), 'year');
}

/** `YYYY-MM-DD` in local time, for `<input type="date">`. */
export function toDateInputValue(iso: string): string {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Midday local time so the date never shifts across time zones. */
export function fromDateInputValue(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12).toISOString();
}

export const todayInputValue = (): string => toDateInputValue(new Date().toISOString());
