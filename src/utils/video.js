import getVideoId from "get-video-id";

/**
 * Returns the YouTube embed URL for a YouTube video link,
 * or null if the link is not a valid YouTube video URL.
 */
export function toYouTubeEmbedUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }
  const { id, service } = getVideoId(url.trim());
  if (!id || service !== "youtube" || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return null;
  }
  return "https://www.youtube.com/embed/" + id;
}

/** Extracts the video id from a stored embed URL. */
export function videoIdFromEmbedUrl(embedUrl) {
  const match = /\/embed\/([A-Za-z0-9_-]+)/.exec(embedUrl || "");
  return match ? match[1] : null;
}

/** The YouTube thumbnail image for an embed URL, or null. */
export function thumbnailUrl(embedUrl) {
  const id = videoIdFromEmbedUrl(embedUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Finds the first YouTube video link in a shared text, e.g. what the
 * YouTube app sends to the share target ("Check this out https://youtu.be/…").
 */
export function findYouTubeUrl(text) {
  if (typeof text !== "string") {
    return null;
  }
  const candidates = text.match(/https?:\/\/[^\s]+/g) || [];
  return candidates.find((candidate) => toYouTubeEmbedUrl(candidate)) || null;
}
