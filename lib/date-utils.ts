import { endOfMonth, format, isValid, parse, startOfMonth } from 'date-fns';

/** `yyyy-MM-dd` in the runtime local calendar (for URLs and history). */
export const DATE_KEY_FORMAT = 'yyyy-MM-dd';

export function formatDateKey(d: Date) {
  return format(d, DATE_KEY_FORMAT);
}

/** Parse `yyyy-MM-dd`; invalid values fall back to today. */
export function parseDateKey(ymd: string) {
  const d = parse(ymd, DATE_KEY_FORMAT, new Date());
  return isValid(d) ? d : new Date();
}

/** `yyyy-MM` for report month filter (URL). */
export const MONTH_KEY_FORMAT = 'yyyy-MM';

export function formatMonthKey(d: Date) {
  return format(d, MONTH_KEY_FORMAT);
}

/** Parse `yyyy-MM` to the first instant of that month; invalid → current month. */
export function parseMonthKey(ym: string) {
  const trimmed = ym.trim();
  if (!/^\d{4}-\d{2}$/.test(trimmed)) return startOfMonth(new Date());
  const d = parse(`${trimmed}-01`, 'yyyy-MM-dd', new Date());
  return isValid(d) ? startOfMonth(d) : startOfMonth(new Date());
}

export function monthRangeFromKey(ym: string) {
  const from = parseMonthKey(ym);
  return { from, to: endOfMonth(from) };
}

/** Local calendar day bounds (server / runtime timezone). */
export function startOfDay(d = new Date()) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(d = new Date()) {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
}

const REMINDER_START_HOUR = 10; // 10am CST
const REMINDER_END_HOUR = 17;  // 5pm CST

/**
 * Next reminder hour within the 10am–5pm CST window.
 * - Current hour + 1, clamped to the window.
 * - If past 5pm (or at 5pm+), returns 10am the next day.
 * - If before 10am, returns 10am today.
 */
export function getNextReminderHour(d = new Date()): Date {
  const cst = new Date(
    d.toLocaleString('en-US', { timeZone: 'America/Chicago' }),
  );
  const currentHour = cst.getHours();

  let nextHour: number;
  let dayOffset = 0;

  if (currentHour < REMINDER_START_HOUR) {
    nextHour = REMINDER_START_HOUR;
  } else if (currentHour >= REMINDER_END_HOUR) {
    nextHour = REMINDER_START_HOUR;
    dayOffset = 1;
  } else {
    nextHour = currentHour + 1;
  }

  const result = new Date(cst);
  result.setDate(result.getDate() + dayOffset);
  result.setHours(nextHour, 0, 0, 0);
  return result;
}

/** e.g. `Tuesday, April 4` in local time (weekday + month + day). */
export function formatWeekdayMonthDay(d = new Date(), locale = "en-US") {
  return d.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** e.g. `9:30pm` in local time (12-hour, no space before am/pm). */
export function formatTime12h(d: Date, locale = "en-US") {
  return d
    .toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/ (AM|PM)$/i, (_, ap) => ap.toLowerCase());
}

/** `{ day, month, year }` in local time. Defaults to “now”. */
export function getCurrentCalendarParts(d = new Date()) {
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}
