import { describe, expect, it } from "vitest";
import { toYouTubeEmbedUrl } from "../src/utils/video.js";

describe("toYouTubeEmbedUrl", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ"],
    ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=42s"],
    ["  https://www.youtube.com/shorts/dQw4w9WgXcQ  "],
  ])("converts %s", (url) => {
    expect(toYouTubeEmbedUrl(url)).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it.each([
    [""],
    ["   "],
    [null],
    ["not a url"],
    ["https://vimeo.com/76979871"],
    ["https://example.com/watch?v=dQw4w9WgXcQ"],
  ])("rejects %s", (url) => {
    expect(toYouTubeEmbedUrl(url)).toBeNull();
  });
});
