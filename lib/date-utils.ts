import { format, isValid, parse } from 'date-fns';

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

/**
 * Start of the **next** clock hour in local time (minutes/seconds/ms zeroed, then +1 hour).
 * e.g. 8:30am → 9:00am; 8:00am (any sub-minute time) → 9:00am; 11:15pm → 12:00am next day.
 */
export function getNextSolidHour(d = new Date()) {
  const date = new Date(d);
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);
  return date;
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
