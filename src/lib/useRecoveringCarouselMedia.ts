"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BoatMedia } from "@/types/Product";
import { listingImageThumbnailUrl } from "@/lib/listingImageUrl";
import { retryImageSource } from "@/lib/retryListingImage";

const RETRY_DELAYS_MS = [1500, 3000, 6000];

export function useRecoveringCarouselMedia(media: BoatMedia[]) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});
  const [recovered, setRecovered] = useState<Record<string, string>>({});
  const attempts = useRef(new Map<string, number>());
  const pending = useRef(new Map<string, { timer?: number; image?: HTMLImageElement }>());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const requests = pending.current;
    return () => {
      mounted.current = false;
      for (const request of requests.values()) {
        if (request.timer !== undefined) window.clearTimeout(request.timer);
        if (request.image) {
          request.image.onload = null;
          request.image.onerror = null;
        }
      }
      requests.clear();
    };
  }, []);

  const startRetry = useCallback((source: string) => {
    if (pending.current.has(source) || (attempts.current.get(source) || 0) >= RETRY_DELAYS_MS.length) return;
    const attempt = (attempts.current.get(source) || 0) + 1;
    attempts.current.set(source, attempt);
    setRetrying((current) => ({ ...current, [source]: true }));

    const timer = window.setTimeout(() => {
      if (!mounted.current) return;
      const candidate = retryImageSource(source, attempt);
      const image = new window.Image();
      pending.current.set(source, { image });
      image.onload = () => {
        pending.current.delete(source);
        if (!mounted.current) return;
        if (!image.naturalWidth || !image.naturalHeight) {
          if (attempt < RETRY_DELAYS_MS.length) startRetry(source);
          else setRetrying((current) => {
            const next = { ...current };
            delete next[source];
            return next;
          });
          return;
        }
        setRecovered((current) => ({ ...current, [source]: candidate }));
        setFailed((current) => {
          const next = { ...current };
          delete next[source];
          return next;
        });
        setRetrying((current) => {
          const next = { ...current };
          delete next[source];
          return next;
        });
      };
      image.onerror = () => {
        pending.current.delete(source);
        if (!mounted.current) return;
        if (attempt < RETRY_DELAYS_MS.length) startRetry(source);
        else setRetrying((current) => {
          const next = { ...current };
          delete next[source];
          return next;
        });
      };
      image.src = listingImageThumbnailUrl(candidate);
    }, RETRY_DELAYS_MS[attempt - 1]);
    pending.current.set(source, { timer });
  }, []);

  const onImageError = useCallback((source: string) => {
    setFailed((current) => current[source] ? current : { ...current, [source]: true });
    startRetry(source);
  }, [startRetry]);

  const retryFailed = useCallback(() => {
    for (const source of Object.keys(failed)) {
      if (pending.current.has(source)) continue;
      attempts.current.delete(source);
      startRetry(source);
    }
  }, [failed, startRetry]);

  const availableMedia = media.filter((item) => item.type !== "image" || !failed[item.url]);
  const failedCount = media.filter((item) => item.type === "image" && failed[item.url]).length;
  const isRetrying = Object.values(retrying).some(Boolean);
  const imageSource = (source: string) => recovered[source] || source;

  return { availableMedia, failedCount, isRetrying, imageSource, onImageError, retryFailed };
}
