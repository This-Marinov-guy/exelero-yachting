"use client";

import * as tus from "tus-js-client";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { ServicePageKey } from "@/lib/servicePageContent";

const BUCKET = "service-page-media";
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const IMAGE_LIMIT = 10 * 1024 * 1024;
const VIDEO_LIMIT = 50 * 1024 * 1024;

export type ServiceMediaKind = "image" | "video";

export function serviceMediaFileError(file: File, kind: ServiceMediaKind): string | null {
  if (kind === "image") {
    if (!IMAGE_TYPES.has(file.type)) return "Choose a JPEG, PNG or WebP image.";
    if (file.size > IMAGE_LIMIT) return "Choose an image under 10 MB.";
  } else {
    if (file.type !== "video/mp4") return "Choose an MP4 video.";
    if (file.size > VIDEO_LIMIT) return "Choose an MP4 video under 50 MB.";
  }
  if (!file.size) return "This file is empty. Choose another file.";
  return null;
}

export async function uploadServiceMedia(
  file: File,
  kind: ServiceMediaKind,
  page: ServicePageKey,
  slot: string,
  onProgress: (percent: number) => void,
): Promise<string> {
  const fileError = serviceMediaFileError(file, kind);
  if (fileError) throw new Error(fileError);

  const client = getSupabaseBrowserClient();
  const { data: { session }, error } = await client.auth.getSession();
  if (error || !session?.access_token) throw new Error("Your session has expired. Sign in again, then retry the upload.");

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) throw new Error("Media storage is not configured. Contact the site administrator.");
  const base = new URL(baseUrl);
  const host = base.hostname.endsWith(".supabase.co")
    ? base.hostname.replace(/\.supabase\.co$/, ".storage.supabase.co")
    : base.host;
  const endpoint = `${base.protocol}//${host}/storage/v1/upload/resumable`;
  const extension = kind === "video" ? "mp4" : file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const path = `${page}/${slot}/${crypto.randomUUID()}.${extension}`;

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000],
      headers: { authorization: `Bearer ${session.access_token}` },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: { bucketName: BUCKET, objectName: path, contentType: file.type, cacheControl: "3600" },
      chunkSize: 6 * 1024 * 1024,
      onError: (cause) => reject(cause),
      onProgress: (uploaded, total) => onProgress(Math.round((uploaded / total) * 100)),
      onSuccess: () => resolve(),
    });
    upload.start();
  });

  return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
