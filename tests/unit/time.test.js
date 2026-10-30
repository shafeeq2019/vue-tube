import { describe, expect, it } from "vitest";
import { timeAgo } from "../../src/utils/time.js";

const NOW = Date.UTC(2026, 9, 30, 12);
const ago = (seconds) => NOW - seconds * 1000;

describe("timeAgo", () => {
  it("says just now for the last minute", () => {
    expect(timeAgo(ago(30), NOW)).toBe("just now");
    // Clock skew can put a server timestamp slightly in the future
    expect(timeAgo(ago(-5), NOW)).toBe("just now");
  });

  it("uses the largest whole unit", () => {
    expect(timeAgo(ago(5 * 60), NOW)).toBe("5 minutes ago");
    expect(timeAgo(ago(3 * 3600), NOW)).toBe("3 hours ago");
    expect(timeAgo(ago(24 * 3600), NOW)).toBe("yesterday");
    expect(timeAgo(ago(2 * 24 * 3600), NOW)).toBe("2 days ago");
    expect(timeAgo(ago(8 * 24 * 3600), NOW)).toBe("last week");
    expect(timeAgo(ago(65 * 24 * 3600), NOW)).toBe("2 months ago");
    expect(timeAgo(ago(400 * 24 * 3600), NOW)).toBe("last year");
  });
});
