"use client";
/* eslint-disable @next/next/no-img-element -- Local blob previews need a native image element before upload. */

import { useState, type DragEvent } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, ImageIcon, Plus, Trash2, Upload, Video } from "lucide-react";
import type { CharterGalleryItem, CharterPageContent, TransportationPageContent } from "@/lib/servicePageContent";
import { serviceMediaFileError, type ServiceMediaKind } from "@/lib/serviceMediaUpload";
import styles from "./ServiceContentManager.module.scss";

export type PendingServiceFile = { file: File; preview: string };
export type PendingServiceFiles = Record<string, PendingServiceFile>;

type CommonProps = {
  pending: PendingServiceFiles;
  onChoose: (slot: string, file: File) => void;
  onClear: (slot: string) => void;
  onReorder: (gallery: CharterGalleryItem[]) => void;
  disabled: boolean;
  orderFeedback: { message: string; tone: "info" | "success" | "error"; action?: { label: string; onClick: () => void } } | null;
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

function SortableAssetRow({ item, index, count, page, pending, onChoose, onClear, onUpdate, onMove, onRemove, newItemId, disabled }: {
  item: CharterGalleryItem;
  index: number;
  count: number;
  page: "charters" | "transportation";
  pending: PendingServiceFiles;
  onChoose: (slot: string, file: File) => void;
  onClear: (slot: string) => void;
  onUpdate: (id: string, change: (item: CharterGalleryItem) => CharterGalleryItem) => void;
  onMove: (index: number, offset: number) => void;
  onRemove: (id: string) => void;
  newItemId: string | null;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled });
  const slot = `asset-${item.id}`;
  const thumbnail = item.type === "video" ? pending[`${slot}-poster`]?.preview || item.poster : pending[slot]?.preview || item.src;

  return <div ref={setNodeRef} className={`${styles.mediaRow} ${styles.mediaSortableRow}${isDragging ? ` ${styles.mediaDragging}` : ""}`} style={{ transform: CSS.Transform.toString(transform), transition }}>
    <button type="button" ref={setActivatorNodeRef} className={styles.mediaDragHandle} disabled={disabled} {...attributes} {...listeners} aria-label={`Drag to reorder ${item.label || item.type}`}><GripVertical size={20} aria-hidden="true" /></button>
    <details className={styles.mediaItem} ref={(node) => { if (node && item.id === newItemId && !node.dataset.initialized) { node.open = true; node.dataset.initialized = "true"; } }}>
      <summary className={styles.mediaSummary}>
        {thumbnail ? <img src={thumbnail} alt="" /> : <span className={styles.mediaSummaryPlaceholder}>{item.type === "video" ? <Video size={20} aria-hidden="true" /> : <ImageIcon size={20} aria-hidden="true" />}</span>}
        <span>{index + 1}. {item.label || `New ${item.type}`}</span><span className={styles.mediaType}>{item.type}</span>
      </summary>
      <div className={styles.mediaItemBody}>
        <MediaFileField id={`${page}-${item.id}-file`} label={`${item.type} ${index + 1}`} kind={item.type} src={item.src} poster={item.type === "video" ? pending[`${slot}-poster`]?.preview || item.poster : undefined} pending={pending[slot]} onChoose={(file) => onChoose(slot, file)} onClear={() => onClear(slot)} />
        {item.type === "video" && <MediaFileField id={`${page}-${item.id}-poster`} label="video poster image" kind="image" src={item.poster} pending={pending[`${slot}-poster`]} onChoose={(file) => onChoose(`${slot}-poster`, file)} onClear={() => onClear(`${slot}-poster`)} />}
        <div className={styles.field}><label htmlFor={`${page}-${item.id}-label`}>Gallery label</label><input id={`${page}-${item.id}-label`} value={item.label} maxLength={120} onChange={(event) => onUpdate(item.id, (current) => ({ ...current, label: event.target.value }))} /></div>
        <div className={styles.field}><label htmlFor={`${page}-${item.id}-alt`}>{item.type === "video" ? "Video description" : "Image description"}</label><input id={`${page}-${item.id}-alt`} value={item.alt} maxLength={180} onChange={(event) => onUpdate(item.id, (current) => ({ ...current, alt: event.target.value }))} /></div>
        {item.type === "image" && <div className={styles.field}><label htmlFor={`${page}-${item.id}-fit`}>Photo display</label><select id={`${page}-${item.id}-fit`} value={item.fit} onChange={(event) => onUpdate(item.id, (current) => current.type === "image" ? { ...current, fit: event.target.value as "cover" | "contain" } : current)}><option value="cover">Crop to fill</option><option value="contain">Show whole image</option></select></div>}
        <div className={styles.mediaItemActions}>
          <button type="button" className={styles.secondary} disabled={disabled || index === 0} onClick={() => onMove(index, -1)} aria-label={`Move ${item.label || item.type} up`}><ArrowUp size={16} aria-hidden="true" /> Move up</button>
          <button type="button" className={styles.secondary} disabled={disabled || index === count - 1} onClick={() => onMove(index, 1)} aria-label={`Move ${item.label || item.type} down`}><ArrowDown size={16} aria-hidden="true" /> Move down</button>
        </div>
      </div>
    </details>
    <button type="button" className={styles.mediaRowRemove} disabled={disabled} onClick={() => onRemove(item.id)} aria-label={`Remove ${item.label || item.type} from page`}><Trash2 size={16} aria-hidden="true" /> Remove</button>
  </div>;
}

function AssetListEditor({ gallery, onChange, onReorder, pending, onChoose, onClear, page, disabled, orderFeedback }: CommonProps & {
  gallery: CharterGalleryItem[];
  onChange: (gallery: CharterGalleryItem[]) => void;
  page: "charters" | "transportation";
}) {
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
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
    onReorder(arrayMove(gallery, index, index + offset));
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = gallery.findIndex((item) => item.id === active.id);
    const newIndex = gallery.findIndex((item) => item.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) onReorder(arrayMove(gallery, oldIndex, newIndex));
  };

  return <section className={styles.group}>
    <h3>Page media</h3>
    <p className={styles.mediaHint}>Open an item to edit it. Drag a handle or use Move up/down to reorder. Saved media updates automatically; new or removed items need Save and publish.</p>
    {orderFeedback && <div className={`${styles.mediaOrderFeedback} ${orderFeedback.tone === "error" ? styles.saveError : orderFeedback.tone === "success" ? styles.saved : ""}`}>
      <span>{orderFeedback.message}</span>
      {orderFeedback.action && <button type="button" className={styles.reload} onClick={orderFeedback.action.onClick}>{orderFeedback.action.label}</button>}
    </div>}
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={gallery.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.mediaList}>
          {gallery.length === 0 && <p className={styles.emptyMedia}>No photos or videos on this page. Add one below.</p>}
          {gallery.map((item, index) => <SortableAssetRow key={item.id} item={item} index={index} count={gallery.length} page={page} pending={pending} onChoose={onChoose} onClear={onClear} onUpdate={update} onMove={move} onRemove={remove} newItemId={newItemId} disabled={disabled} />)}
        </div>
      </SortableContext>
    </DndContext>
    <div className={styles.mediaAddActions}>
      <button type="button" className={styles.add} disabled={gallery.length >= 12} onClick={() => add("image")}><Plus size={16} aria-hidden="true" /> Add photo</button>
      <button type="button" className={styles.add} disabled={gallery.length >= 12} onClick={() => add("video")}><Plus size={16} aria-hidden="true" /> Add video</button>
    </div>
    {gallery.length >= 12 && <p className={styles.mediaHint}>This page has reached its 12-item limit.</p>}
  </section>;
}

export function CharterMediaEditor({ content, onChange, onReorder, pending, onChoose, onClear, disabled, orderFeedback }: CommonProps & {
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
    <AssetListEditor page="charters" gallery={content.media.gallery} onChange={(gallery) => onChange({ ...content, media: { ...content.media, gallery } })} onReorder={onReorder} pending={pending} onChoose={onChoose} onClear={onClear} disabled={disabled} orderFeedback={orderFeedback} />
  </>;
}

export function TransportationMediaEditor({ content, onChange, onReorder, pending, onChoose, onClear, disabled, orderFeedback }: CommonProps & {
  content: TransportationPageContent;
  onChange: (content: TransportationPageContent) => void;
}) {
  return <>
    <div className={styles.editorHeading}><h2>Photos & video</h2><p>Add, remove and reorder the media in the transportation page.</p></div>
    <AssetListEditor page="transportation" gallery={content.media.gallery} onChange={(gallery) => onChange({ ...content, media: { gallery } })} onReorder={onReorder} pending={pending} onChoose={onChoose} onClear={onClear} disabled={disabled} orderFeedback={orderFeedback} />
  </>;
}
