"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const PHOTO_DURATION_MS = 5000;
const TRANSITION_MS = 360;
type MediaStatus = "ready" | "error";

const MEDIA = [
  {
    type: "image" as const,
    src: "/assets/images/charter/xc47-aegean-bay.webp",
    alt: "Xc 47 yacht anchored in a Greek bay",
    label: "Xc 47 in the Aegean",
    fit: "cover" as const,
  },
  {
    type: "video" as const,
    src: "/assets/images/charter/x46-greece.mp4",
    poster: "/assets/images/charter/x46-greece-poster.webp",
    alt: "X4.6 sailing in Greece",
    label: "X4.6 in Greece",
  },
  {
    type: "image" as const,
    src: "/assets/images/charter/fleet-at-marina.webp",
    alt: "X-Yachts charter fleet moored at the marina",
    label: "The charter fleet",
    fit: "cover" as const,
  },
  {
    type: "image" as const,
    src: "/assets/images/charter/xp44-saloon.webp",
    alt: "Warm wood interior of the Xp 44 saloon",
    label: "Xp 44 saloon",
    fit: "cover" as const,
  },
];

export default function CharterMediaPanel() {
  const [displayed, setDisplayed] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<Record<string, MediaStatus>>({});
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({});
  const [restartKey, setRestartKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = MEDIA[displayed];
  const selectedIndex = pending ?? displayed;
  const pendingMedia = pending === null ? null : MEDIA[pending];
  const pendingReady = pendingMedia ? mediaStatus[pendingMedia.src] !== undefined : false;
  const currentStatus = mediaStatus[current.src];

  const markStatus = useCallback((src: string, status: MediaStatus) => {
    setMediaStatus((previous) => previous[src] === status ? previous : { ...previous, [src]: status });
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + MEDIA.length) % MEDIA.length;
    setRestartKey((key) => key + 1);
    setPlayBlocked(false);
    setShowPending(false);

    if (next === displayed) {
      setPending(null);
      return;
    }

    const nextMedia = MEDIA[next];
    if (nextMedia.type === "video") {
      setMediaStatus((previous) => {
        const updated = { ...previous };
        delete updated[nextMedia.src];
        return updated;
      });
      setRetryCounts((previous) => ({
        ...previous,
        [nextMedia.src]: (previous[nextMedia.src] ?? 0) + 1,
      }));
    }
    setPending(next);
  }, [displayed]);

  const retryMedia = (src: string) => {
    setShowPending(false);
    setMediaStatus((previous) => {
      const updated = { ...previous };
      delete updated[src];
      return updated;
    });
    setRetryCounts((previous) => ({ ...previous, [src]: (previous[src] ?? 0) + 1 }));
    setPlayBlocked(false);
    if (!reducedMotion) setPaused(false);
  };

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(motionPreference.matches);
      if (motionPreference.matches) setPaused(true);
    };
    updatePreference();
    motionPreference.addEventListener("change", updatePreference);
    return () => motionPreference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (pending === null || !pendingReady) return;

    if (reducedMotion) {
      setDisplayed(pending);
      setPending(null);
      return;
    }

    const frame = window.requestAnimationFrame(() => setShowPending(true));
    return () => window.cancelAnimationFrame(frame);
  }, [pending, pendingReady, reducedMotion]);

  useEffect(() => {
    if (pending === null || !showPending) return;

    const timer = window.setTimeout(() => {
      setDisplayed(pending);
      setPending(null);
      setShowPending(false);
    }, TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [pending, showPending]);

  useEffect(() => {
    if (paused || pending !== null || current.type !== "image" || currentStatus !== "ready") return;

    const timer = window.setTimeout(() => goTo(displayed + 1), PHOTO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [displayed, pending, paused, current.type, currentStatus, restartKey, goTo]);

  useEffect(() => {
    if (current.type !== "video" || currentStatus !== "ready") return;
    const video = videoRef.current;
    if (!video) return;

    if (paused || pending !== null) {
      video.pause();
      return;
    }

    let cancelled = false;
    void video.play().then(() => {
      if (!cancelled) setPlayBlocked(false);
    }).catch(() => {
      if (!cancelled) {
        setPlayBlocked(true);
        setPaused(true);
      }
    });

    return () => {
      cancelled = true;
      video.pause();
    };
  }, [displayed, pending, paused, current.type, currentStatus]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    if (!strip) return;

    const revealSelected = (behavior: ScrollBehavior) => {
      const thumbnail = thumbnailRefs.current[selectedIndex];
      if (!thumbnail) return;

      const stripBounds = strip.getBoundingClientRect();
      const thumbnailBounds = thumbnail.getBoundingClientRect();
      const leftOverflow = thumbnailBounds.left - stripBounds.left;
      const rightOverflow = thumbnailBounds.right - stripBounds.right;
      const distance = leftOverflow < 0 ? leftOverflow : rightOverflow > 0 ? rightOverflow : 0;
      if (distance !== 0) strip.scrollBy({ left: distance, behavior });
    };

    revealSelected(reducedMotion ? "auto" : "smooth");
    const handleResize = () => revealSelected("auto");
    window.addEventListener("resize", handleResize);

    if ("ResizeObserver" in window) {
      let observedWidth = strip.clientWidth;
      const observer = new ResizeObserver(() => {
        if (strip.clientWidth === observedWidth) return;
        observedWidth = strip.clientWidth;
        revealSelected("auto");
      });
      observer.observe(strip);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedIndex, reducedMotion]);

  const playVideo = () => {
    setPlayBlocked(false);
    setPaused(false);
    void videoRef.current?.play().catch(() => {
      setPlayBlocked(true);
      setPaused(true);
    });
  };

  const togglePaused = () => {
    if (paused && current.type === "video" && currentStatus === "ready") {
      playVideo();
      return;
    }
    setPaused((value) => !value);
  };

  const renderSlide = (item: (typeof MEDIA)[number], index: number, incoming: boolean) => {
    const failed = mediaStatus[item.src] === "error";
    const attempt = retryCounts[item.src] ?? 0;

    return (
      <div
        key={item.src}
        className={`charter-media-panel__slide${incoming ? ` charter-media-panel__slide--incoming${showPending ? " charter-media-panel__slide--visible" : ""}` : ""}`}
        aria-hidden={incoming}
      >
        {failed ? (
          <div className="charter-media-panel__error" role={incoming ? undefined : "alert"}>
            <span>We couldn&apos;t load this {item.type === "video" ? "video" : "photo"}.</span>
            <button type="button" disabled={incoming} onClick={() => retryMedia(item.src)}>Try again</button>
          </div>
        ) : item.type === "image" ? (
          <Image
            key={`${item.src}-${attempt}`}
            src={item.src}
            alt={incoming ? "" : item.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 991px) 100vw, 50vw"
            className={`charter-media-panel__media charter-media-panel__media--${item.fit}`}
            onLoad={() => markStatus(item.src, "ready")}
            onError={() => markStatus(item.src, "error")}
          />
        ) : (
          <>
            <Image
              key={`${item.poster}-${attempt}`}
              src={item.poster}
              alt=""
              fill
              sizes="(max-width: 991px) 100vw, 50vw"
              className="charter-media-panel__media charter-media-panel__media--video-poster"
              onLoad={() => markStatus(item.src, "ready")}
              onError={() => markStatus(item.src, "error")}
            />
            {index === displayed && (
              <video
                key={`${item.src}-${attempt}`}
                ref={videoRef}
                className="charter-media-panel__media charter-media-panel__media--video"
                muted
                playsInline
                preload="auto"
                poster={item.poster}
                aria-label={item.alt}
                onError={() => markStatus(item.src, "error")}
                onEnded={() => goTo(displayed + 1)}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <section className="charter-media-panel-wrap" aria-label="Charter photos and video">
      <div className="charter-media-panel" aria-busy={pending !== null}>
        {renderSlide(current, displayed, false)}
        {pending !== null && pendingMedia && renderSlide(pendingMedia, pending, true)}

        {current.type === "video" && playBlocked && pending === null && currentStatus === "ready" && (
          <button
            type="button"
            className="charter-media-panel__play"
            onClick={playVideo}
            aria-label="Play charter video"
          >
            <Play size={24} fill="currentColor" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="charter-media-panel__arrow charter-media-panel__arrow--previous"
          onClick={() => goTo(selectedIndex - 1)}
          aria-label="Previous charter media"
        >
          <ChevronLeft size={26} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="charter-media-panel__arrow charter-media-panel__arrow--next"
          onClick={() => goTo(selectedIndex + 1)}
          aria-label="Next charter media"
        >
          <ChevronRight size={26} aria-hidden="true" />
        </button>
      </div>

      <span className="visually-hidden" aria-live="polite">
        {current.label}, {displayed + 1} of {MEDIA.length}
      </span>

      <div className="charter-media-panel__controls">
        <div ref={thumbnailStripRef} className="charter-media-panel__thumbnails" role="group" aria-label="Choose charter media">
          {MEDIA.map((item, index) => (
            <button
              key={item.src}
              ref={(node) => { thumbnailRefs.current[index] = node; }}
              type="button"
              className={`charter-media-panel__thumbnail${index === selectedIndex ? " charter-media-panel__thumbnail--active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`View ${item.label}${item.type === "video" ? " video" : " photo"}`}
              aria-pressed={index === selectedIndex}
            >
              <Image
                src={item.type === "video" ? item.poster : item.src}
                alt=""
                fill
                sizes="72px"
                className="charter-media-panel__thumbnail-image"
              />
              {item.type === "video" && (
                <span className="charter-media-panel__thumbnail-play" aria-hidden="true">
                  <Play size={12} fill="currentColor" />
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="charter-media-panel__toggle"
          onClick={togglePaused}
          aria-label={paused ? "Resume gallery" : "Pause gallery"}
          aria-pressed={paused}
        >
          {paused ? <Play size={17} fill="currentColor" aria-hidden="true" /> : <Pause size={17} fill="currentColor" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
