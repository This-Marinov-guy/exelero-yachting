"use client";
/* eslint-disable @next/next/no-img-element -- Local blob previews need a native image element before upload. */

import { useState, type DragEvent } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2, Upload, Video } from "lucide-react";
import type { CharterGalleryItem, CharterPageContent, TransportationPageContent } from "@/lib/servicePageContent";
import { serviceMediaFileError, type ServiceMediaKind } from "@/lib/serviceMediaUpload";
import styles from "./ServiceContentManager.module.scss";

export type PendingServiceFile = { file: File; preview: string };
export type PendingServiceFiles = Record<string, PendingServiceFile>;

type CommonProps = {
  pending: PendingServiceFiles;
  onChoose: (slot: string, file: File) => void;
  onClear: (slot: string) => void;
};

function MediaFileField({ id, label, kind, src, poster, pending, onChoose, onClear }: {
  id: string;
  label: string;
  kind: ServiceMediaKind;
  src: string;
  poster?: string;
  pending?: PendingServiceFile;
  onChoose: (file: File) => void;
  onClear: () => void;
}) {
  const [error, setError] = useState("");
  const selectFile = (file?: File) => {
    if (!file) return;
    const issue = serviceMediaFileError(file, kind);
    if (issue) { setError(issue); return; }
    setError("");
    onChoose(file);
  };
  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files[0]);
  };
  const preview = pending?.preview || src;

  return <div className={styles.mediaFile}>
    <div className={styles.mediaPreview}>
      {preview ? kind === "image"
        ? <img src={preview} alt="" />
        : <video src={preview} poster={poster} controls preload="metadata" aria-label={`${label} preview`} />
        : <div className={styles.mediaPlaceholder}>{kind === "video" ? <Video size={28} aria-hidden="true" /> : <ImageIcon size={28} aria-hidden="true" />}<span>No file selected</span></div>}
    </div>
    <label className={styles.mediaDrop} htmlFor={id} onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      <Upload size={18} aria-hidden="true" />
      <span>Drop or choose {kind === "image" ? "an image" : "a video"} to {src ? `replace ${label.toLowerCase()}` : `add ${label.toLowerCase()}`}</span>
      <input id={id} className={styles.mediaInput} type="file" accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4"} onChange={(event) => { selectFile(event.target.files?.[0]); event.target.value = ""; }} />
    </label>
    <p className={styles.mediaHint}>{kind === "image" ? "JPEG, PNG or WebP · up to 10 MB" : "MP4 · up to 50 MB"}</p>
    {pending && <div className={styles.mediaPending}><span>{pending.file.name} is ready to upload when you save.</span><button type="button" onClick={() => { onClear(); setError(""); }}>{src ? "Keep current file" : "Clear selection"}</button></div>}
    {error && <p className={styles.mediaError} role="alert">{error}</p>}
  </div>;
}

function AssetListEditor({ gallery, onChange, pending, onChoose, onClear, page }: CommonProps & {
  gallery: CharterGalleryItem[];
  onChange: (gallery: CharterGalleryItem[]) => void;
  page: "charters" | "transportation";
}) {
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const update = (id: string, change: (item: CharterGalleryItem) => CharterGalleryItem) =>
    onChange(gallery.map((item) => item.id === id ? change(item) : item));
  const add = (type: "image" | "video") => {
    if (gallery.length >= 12) return;
    const id = crypto.randomUUID();
    const item: CharterGalleryItem = type === "image"
      ? { id, type, src: "", alt: "", label: "", fit: "cover" }
      : { id, type, src: "", poster: "", alt: "", label: "" };
    onChange([...gallery, item]);
    setNewItemId(id);
  };
  const remove = (id: string) => {
    onClear(`asset-${id}`);
    onClear(`asset-${id}-poster`);
    onChange(gallery.filter((item) => item.id !== id));
  };
  const move = (index: number, offset: number) => {
    const next = [...gallery];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };

  return <section className={styles.group}>
    <h3>Page media</h3>
    <p className={styles.mediaHint}>Open an item to edit it. The order below is the order visitors see. Removing an item takes it off the page when you save.</p>
    <div className={styles.mediaList}>
      {gallery.length === 0 && <p className={styles.emptyMedia}>No photos or videos on this page. Add one below.</p>}
      {gallery.map((item, index) => {
        const slot = `asset-${item.id}`;
        const thumbnail = item.type === "video" ? pending[`${slot}-poster`]?.preview || item.poster : pending[slot]?.preview || item.src;
        return <div className={styles.mediaRow} key={item.id}>
        <details className={styles.mediaItem} ref={(node) => { if (node && item.id === newItemId && !node.dataset.initialized) { node.open = true; node.dataset.initialized = "true"; } }}>
          <summary className={styles.mediaSummary}>
            {thumbnail ? <img src={thumbnail} alt="" /> : <span className={styles.mediaSummaryPlaceholder}>{item.type === "video" ? <Video size={20} aria-hidden="true" /> : <ImageIcon size={20} aria-hidden="true" />}</span>}
            <span>{index + 1}. {item.label || `New ${item.type}`}</span><span className={styles.mediaType}>{item.type}</span>
          </summary>
          <div className={styles.mediaItemBody}>
            <MediaFileField id={`${page}-${item.id}-file`} label={`${item.type} ${index + 1}`} kind={item.type} src={item.src} poster={item.type === "video" ? pending[`${slot}-poster`]?.preview || item.poster : undefined} pending={pending[slot]} onChoose={(file) => onChoose(slot, file)} onClear={() => onClear(slot)} />
            {item.type === "video" && <MediaFileField id={`${page}-${item.id}-poster`} label="video poster image" kind="image" src={item.poster} pending={pending[`${slot}-poster`]} onChoose={(file) => onChoose(`${slot}-poster`, file)} onClear={() => onClear(`${slot}-poster`)} />}
            <div className={styles.field}><label htmlFor={`${page}-${item.id}-label`}>Gallery label</label><input id={`${page}-${item.id}-label`} value={item.label} maxLength={120} onChange={(event) => update(item.id, (current) => ({ ...current, label: event.target.value }))} /></div>
            <div className={styles.field}><label htmlFor={`${page}-${item.id}-alt`}>{item.type === "video" ? "Video description" : "Image description"}</label><input id={`${page}-${item.id}-alt`} value={item.alt} maxLength={180} onChange={(event) => update(item.id, (current) => ({ ...current, alt: event.target.value }))} /></div>
            {item.type === "image" && <div className={styles.field}><label htmlFor={`${page}-${item.id}-fit`}>Photo display</label><select id={`${page}-${item.id}-fit`} value={item.fit} onChange={(event) => update(item.id, (current) => current.type === "image" ? { ...current, fit: event.target.value as "cover" | "contain" } : current)}><option value="cover">Crop to fill</option><option value="contain">Show whole image</option></select></div>}
            <div className={styles.mediaItemActions}>
              <button type="button" className={styles.secondary} disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${item.label || item.type} up`}><ArrowUp size={16} aria-hidden="true" /> Move up</button>
              <button type="button" className={styles.secondary} disabled={index === gallery.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${item.label || item.type} down`}><ArrowDown size={16} aria-hidden="true" /> Move down</button>
            </div>
          </div>
        </details>
        <button type="button" className={styles.mediaRowRemove} onClick={() => remove(item.id)} aria-label={`Remove ${item.label || item.type} from page`}><Trash2 size={16} aria-hidden="true" /> Remove</button>
        </div>;
      })}
    </div>
    <div className={styles.mediaAddActions}>
      <button type="button" className={styles.add} disabled={gallery.length >= 12} onClick={() => add("image")}><Plus size={16} aria-hidden="true" /> Add photo</button>
      <button type="button" className={styles.add} disabled={gallery.length >= 12} onClick={() => add("video")}><Plus size={16} aria-hidden="true" /> Add video</button>
    </div>
    {gallery.length >= 12 && <p className={styles.mediaHint}>This page has reached its 12-item limit.</p>}
  </section>;
}

export function CharterMediaEditor({ content, onChange, pending, onChoose, onClear }: CommonProps & {
  content: CharterPageContent;
  onChange: (content: CharterPageContent) => void;
}) {
  const [bannerAdded, setBannerAdded] = useState(false);
  const banner = content.media.banner;
  return <>
    <div className={styles.editorHeading}><h2>Photos & video</h2><p>Manage the banner and the media visitors see on the charter page.</p></div>
    {banner ? <div className={styles.mediaRow}>
    <details className={styles.mediaItem} ref={(node) => { if (node && bannerAdded && !node.dataset.initialized) { node.open = true; node.dataset.initialized = "true"; } }}>
      <summary className={styles.mediaSummary}>{pending.banner?.preview || banner.src ? <img src={pending.banner?.preview || banner.src} alt="" /> : <span className={styles.mediaSummaryPlaceholder}><ImageIcon size={20} aria-hidden="true" /></span>}<span>Page banner</span><span className={styles.mediaType}>image</span></summary>
      <div className={styles.mediaItemBody}>
        <MediaFileField id="charter-banner-file" label="page banner" kind="image" src={banner.src} pending={pending.banner} onChoose={(file) => onChoose("banner", file)} onClear={() => onClear("banner")} />
        <div className={styles.field}><label htmlFor="charter-banner-alt">Image description</label><input id="charter-banner-alt" value={banner.alt} maxLength={180} onChange={(event) => onChange({ ...content, media: { ...content.media, banner: { ...banner, alt: event.target.value } } })} /></div>
      </div>
    </details>
    <button type="button" className={styles.mediaRowRemove} onClick={() => { onClear("banner"); onChange({ ...content, media: { ...content.media, banner: null } }); }} aria-label="Remove page banner"><Trash2 size={16} aria-hidden="true" /> Remove</button>
    </div> : <div className={styles.emptyBanner}><p>No banner image. The page heading uses a plain background.</p><button type="button" className={styles.add} onClick={() => { setBannerAdded(true); onChange({ ...content, media: { ...content.media, banner: { src: "", alt: "" } } }); }}><Plus size={16} aria-hidden="true" /> Add banner</button></div>}
    <AssetListEditor page="charters" gallery={content.media.gallery} onChange={(gallery) => onChange({ ...content, media: { ...content.media, gallery } })} pending={pending} onChoose={onChoose} onClear={onClear} />
  </>;
}

export function TransportationMediaEditor({ content, onChange, pending, onChoose, onClear }: CommonProps & {
  content: TransportationPageContent;
  onChange: (content: TransportationPageContent) => void;
}) {
  return <>
    <div className={styles.editorHeading}><h2>Photos & video</h2><p>Add, remove and reorder the media in the transportation page.</p></div>
    <AssetListEditor page="transportation" gallery={content.media.gallery} onChange={(gallery) => onChange({ ...content, media: { gallery } })} pending={pending} onChoose={onChoose} onClear={onClear} />
  </>;
}
