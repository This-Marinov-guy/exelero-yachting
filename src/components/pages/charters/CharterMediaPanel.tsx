"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MEDIA = [
  { type: "image" as const, src: "/assets/images/charter/cruiser.webp", alt: "Sailing charter" },
  { type: "image" as const, src: "/assets/images/charter/racing.jpg", alt: "Racing yacht" },
  { type: "video" as const, src: "/assets/images/charter/yacht.mp4", alt: "Custom charter" },
];

const DURATION = 4000;

export default function CharterMediaPanel() {
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0); // incremented on each slide change to restart CSS animation
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(index);
    setTick((t) => t + 1);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setActive((a) => (a + 1) % MEDIA.length);
      setTick((t) => t + 1);
    }, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [tick]);

  return (
    <div className="charter-media-panel-wrap">
      <div className="charter-media-panel">
        {MEDIA.map((item, i) => (
          <div
            key={i}
            className={`charter-media-panel__item${i === active ? " charter-media-panel__item--active" : ""}`}
            onClick={() => goTo(i)}
            role="button"
            aria-label={`View ${item.alt}`}
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 991px) 100vw, 50vw"
                className="charter-media-panel__media"
              />
            ) : (
              <video
                src={item.src}
                className="charter-media-panel__media"
                muted
                loop
                playsInline
                autoPlay
                aria-label={item.alt}
              />
            )}
            <div className="charter-media-panel__overlay" />
          </div>
        ))}
      </div>

      {/* Progress bars — below the panel */}
      <div className="charter-media-panel__progress">
        {MEDIA.map((_, i) => (
          <button
            key={i}
            className="charter-media-panel__progress-track"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`charter-media-panel__progress-fill${i === active ? " charter-media-panel__progress-fill--active" : ""}`}
              style={i < active ? { width: "100%" } : undefined}
              key={i === active ? tick : i}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
