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
