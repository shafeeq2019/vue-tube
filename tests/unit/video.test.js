import { describe, expect, it } from "vitest";
import {
  findYouTubeUrl,
  thumbnailUrl,
  toYouTubeEmbedUrl,
  videoIdFromEmbedUrl,
} from "../../src/utils/video.js";

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

describe("thumbnails", () => {
  it("extracts the id from an embed URL", () => {
    expect(videoIdFromEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(videoIdFromEmbedUrl("https://example.com/")).toBeNull();
    expect(videoIdFromEmbedUrl(undefined)).toBeNull();
  });

  it("builds the thumbnail URL", () => {
    expect(thumbnailUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
    expect(thumbnailUrl("nope")).toBeNull();
  });
});

describe("findYouTubeUrl", () => {
  it("finds the YouTube link in shared text", () => {
    expect(findYouTubeUrl("Look at this! https://youtu.be/dQw4w9WgXcQ?si=abc")).toBe(
      "https://youtu.be/dQw4w9WgXcQ?si=abc"
    );
    expect(
      findYouTubeUrl("https://example.com first, then https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("returns null without a YouTube link", () => {
    expect(findYouTubeUrl("no links here")).toBeNull();
    expect(findYouTubeUrl("https://example.com")).toBeNull();
    expect(findYouTubeUrl(undefined)).toBeNull();
  });
});
