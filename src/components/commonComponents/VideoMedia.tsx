import type { CSSProperties } from "react";
import Image from "next/image";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/videoLinks";

type VideoMediaProps = {
  url: string;
  title: string;
  className?: string;
  style?: CSSProperties;
};

export const VideoPoster = ({ url, title, className, style }: VideoMediaProps) => {
  const thumbnail = getYouTubeThumbnailUrl(url);

  return thumbnail ? (
    <Image
      src={thumbnail}
      alt={title}
      width={640}
      height={360}
      className={className}
      style={style}
    />
  ) : (
    <video
      src={url}
      muted
      loop
      autoPlay
      playsInline
      preload="metadata"
      className={className}
      style={style}
    />
  );
};

export const VideoPlayer = ({ url, title, className, style }: VideoMediaProps) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  return embedUrl ? (
    <div className={className} style={{ aspectRatio: "16 / 9", ...style }}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </div>
  ) : (
    <video src={url} controls autoPlay playsInline className={className} style={style} />
  );
};
