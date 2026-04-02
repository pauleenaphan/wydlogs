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

/** Day of month in local time: 1–31. Defaults to “now”. */
export function getCurrentDayOfMonth(d = new Date()) {
  return d.getDate();
}

/** Month in local time: 1 = January … 12 = December. Defaults to “now”. */
export function getCurrentMonth(d = new Date()) {
  return d.getMonth() + 1;
}

/** `{ day, month, year }` in local time. Defaults to “now”. */
export function getCurrentCalendarParts(d = new Date()) {
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}
