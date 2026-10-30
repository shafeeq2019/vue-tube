const UNITS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * A short relative time like "2 days ago" or "last week" for a point in
 * the past (in milliseconds), or "just now" for the last minute.
 */
export function timeAgo(millis, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - millis) / 1000));
  for (const [unit, size] of UNITS) {
    if (seconds >= size) {
      return formatter.format(-Math.floor(seconds / size), unit);
    }
  }
  return "just now";
}
