const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const parseHttpUrl = (value: string): URL | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
};

export const getYouTubeVideoId = (value: string): string | null => {
  const url = parseHttpUrl(value);
  if (!url || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const isShortLink = url.hostname.toLowerCase().endsWith("youtu.be");
  const candidate = isShortLink
    ? segments[0]
    : segments[0] === "watch"
      ? url.searchParams.get("v")
      : ["embed", "shorts", "live", "v"].includes(segments[0])
        ? segments[1]
        : null;

  return candidate && VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
};

export const getYouTubeThumbnailUrl = (value: string): string | null => {
  const id = getYouTubeVideoId(value);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
};

export const getYouTubeEmbedUrl = (value: string): string | null => {
  const id = getYouTubeVideoId(value);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
};

const validateDirectVideoUrl = (url: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute("src");
      video.load();
    };
    const fail = () => {
      cleanup();
      reject(new Error("This video file could not be loaded. Use a direct video file URL or a YouTube link."));
    };
    const timeout = window.setTimeout(fail, 8000);

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => {
      cleanup();
      resolve();
    };
    video.onerror = fail;
    video.src = url;
  });

export const prepareVideoLink = async (value: string): Promise<{ url: string; name: string }> => {
  const url = parseHttpUrl(value.trim());
  if (!url) throw new Error("Enter a valid http or https video URL.");

  if (YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
    const id = getYouTubeVideoId(url.toString());
    if (!id) throw new Error("This YouTube link needs a valid video ID. Copy the video share link and try again.");
    return { url: `https://www.youtube.com/watch?v=${id}`, name: "YouTube video" };
  }

  await validateDirectVideoUrl(url.toString());
  return { url: url.toString(), name: url.pathname.split("/").pop() || "Linked video" };
};
