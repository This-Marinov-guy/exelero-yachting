"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useUnsavedChanges } from "../useUnsavedChanges";
import { CharterMediaEditor, TransportationMediaEditor, type PendingServiceFiles } from "./ServiceMediaEditor";
import { uploadServiceMedia } from "@/lib/serviceMediaUpload";
import {
  type CharterInfoTab,
  type CharterPageContent,
  type LabeledText,
  type ServicePageContentMap,
  type ServicePageKey,
  type TransportationPageContent,
  type TransportationParagraph,
  type TransportationSection,
  validateServicePageContent,
} from "@/lib/servicePageContent";
import styles from "./ServiceContentManager.module.scss";

type SavedPage<K extends ServicePageKey = ServicePageKey> = {
  content: ServicePageContentMap[K];
  updated_at: string | null;
};
type SavedPages = { charters: SavedPage<"charters">; transportation: SavedPage<"transportation"> };
type Drafts = ServicePageContentMap;
type SectionKey = "media" | "why" | "who" | "when-where" | "models" | "skippers" | "road" | "sea";

const CHARTER_SECTIONS: { id: SectionKey; label: string }[] = [
  { id: "media", label: "Photos & video" },
  { id: "why", label: "Why X-Yachts" },
  { id: "who", label: "Who is it for?" },
  { id: "when-where", label: "When & where?" },
  { id: "models", label: "Available models" },
  { id: "skippers", label: "Skipper options" },
];
const TRANSPORT_SECTIONS: { id: SectionKey; label: string }[] = [
  { id: "media", label: "Photos & video" },
  { id: "road", label: "By road" },
  { id: "sea", label: "By sea" },
];

function mediaSlotLabel(slot: string): string {
  if (slot === "banner") return "the page banner";
  if (slot.endsWith("-poster")) return "the video poster";
  return "a page media item";
}

function withUploadedMedia<K extends ServicePageKey>(page: K, content: ServicePageContentMap[K], slot: string, url: string): ServicePageContentMap[K] {
  if (slot === "banner" && page === "charters") {
    const current = content as CharterPageContent;
    if (!current.media.banner) throw new Error("The charter banner was removed. Reload and try again.");
    return { ...current, media: { ...current.media, banner: { ...current.media.banner, src: url } } } as ServicePageContentMap[K];
  }
  const poster = slot.endsWith("-poster");
  const id = slot.slice(6, poster ? -7 : undefined);
  if (!slot.startsWith("asset-") || !/^[a-zA-Z0-9-]{1,80}$/.test(id)) throw new Error("Unknown page media slot.");
  const gallery = content.media.gallery.map((item) => {
    if (item.id !== id) return item;
    if (poster) {
      if (item.type !== "video") throw new Error("Only videos can have poster images.");
      return { ...item, poster: url };
    }
    return { ...item, src: url };
  });
  return { ...content, media: { ...content.media, gallery } } as ServicePageContentMap[K];
}

function mediaKindForSlot<K extends ServicePageKey>(content: ServicePageContentMap[K], slot: string): "image" | "video" {
  if (slot === "banner" || slot.endsWith("-poster")) return "image";
  const id = slot.replace(/^asset-/, "");
  const item = content.media.gallery.find((entry) => entry.id === id);
  if (!item) throw new Error("This media item was removed. Reload and try again.");
  return item.type;
}

export default function ServiceContentManager({ page }: { page: ServicePageKey }) {
  const [pages, setPages] = useState<SavedPages | null>(null);
  const [drafts, setDrafts] = useState<Drafts | null>(null);
  const [section, setSection] = useState<SectionKey>(page === "charters" ? "why" : "road");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveConflict, setSaveConflict] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingServiceFiles>({});
  const previewUrls = useRef<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<{ label: string; percent: number } | null>(null);

  const pageDirty = !!pages && !!drafts && (JSON.stringify(pages[page].content) !== JSON.stringify(drafts[page]) || Object.keys(pendingFiles).length > 0);
  useUnsavedChanges(pageDirty || saving);

  const clearPendingFile = useCallback((slot: string) => {
    if (previewUrls.current[slot]) URL.revokeObjectURL(previewUrls.current[slot]);
    delete previewUrls.current[slot];
    setPendingFiles((current) => {
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }, []);
  const clearPendingFiles = useCallback(() => {
    Object.values(previewUrls.current).forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = {};
    setPendingFiles({});
  }, []);
  useEffect(() => () => {
    Object.values(previewUrls.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);
  const chooseMediaFile = (slot: string, file: File) => {
    if (previewUrls.current[slot]) URL.revokeObjectURL(previewUrls.current[slot]);
    const preview = URL.createObjectURL(file);
    previewUrls.current[slot] = preview;
    setPendingFiles((current) => ({ ...current, [slot]: { file, preview } }));
    setSaveError(""); setSaveConflict(false); setSavedMessage("");
  };

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/service-content", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load page content. Try again.");
      const loaded = result.pages as SavedPages;
      setPages(loaded);
      setDrafts({ charters: structuredClone(loaded.charters.content), transportation: structuredClone(loaded.transportation.content) });
      clearPendingFiles();
      setSaveError("");
      setSaveConflict(false);
      setSavedMessage("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load page content. Try again.");
    } finally {
      setLoading(false);
    }
  }, [clearPendingFiles]);
  useEffect(() => { void load(); }, [load]);

  const editCharters = (change: (current: CharterPageContent) => CharterPageContent) => {
    setDrafts((current) => current ? { ...current, charters: change(current.charters) } : current);
    setSaveError(""); setSaveConflict(false); setSavedMessage("");
  };
  const editTransportation = (change: (current: TransportationPageContent) => TransportationPageContent) => {
    setDrafts((current) => current ? { ...current, transportation: change(current.transportation) } : current);
    setSaveError(""); setSaveConflict(false); setSavedMessage("");
  };
  const editTab = (id: string, change: (tab: CharterInfoTab) => CharterInfoTab) =>
    editCharters((current) => ({ ...current, infoTabs: current.infoTabs.map((tab) => tab.id === id ? change(tab) : tab) }));
  const editTransportSection = (id: string, change: (item: TransportationSection) => TransportationSection) =>
    editTransportation((current) => ({ ...current, sections: current.sections.map((item) => item.id === id ? change(item) : item) }));

  const discard = () => {
    if (!pages || !drafts || !window.confirm(`Discard unsaved ${page === "charters" ? "charter" : "transportation"} content changes?`)) return;
    setDrafts({ ...drafts, [page]: structuredClone(pages[page].content) });
    clearPendingFiles();
    setSaveError(""); setSaveConflict(false); setSavedMessage("");
  };

  const save = async () => {
    if (!pages || !drafts || saving || !pageDirty) return;
    let validationDraft = structuredClone(drafts[page]);
    for (const slot of Object.keys(pendingFiles)) {
      const kind = mediaKindForSlot(validationDraft, slot);
      const placeholder = kind === "video" ? "/assets/images/charter/x46-greece.mp4" : "/assets/images/hero/main2.png";
      validationDraft = withUploadedMedia(page, validationDraft, slot, placeholder);
    }
    const parsed = validateServicePageContent(page, validationDraft);
    if (!parsed.content) { setSaveError(parsed.error); return; }
    setSaving(true); setSaveError(""); setSaveConflict(false); setSavedMessage("");
    try {
      let content = structuredClone(drafts[page]);
      for (const [slot, pending] of Object.entries(pendingFiles)) {
        const label = mediaSlotLabel(slot);
        setUploadProgress({ label, percent: 0 });
        let url: string;
        try {
          url = await uploadServiceMedia(pending.file, mediaKindForSlot(content, slot), page, slot, (percent) => setUploadProgress({ label, percent }));
        } catch (cause) {
          throw new Error(`Could not upload ${label}. ${cause instanceof Error ? cause.message : "Check your connection and try again."}`);
        }
        content = withUploadedMedia(page, content, slot, url);
        setDrafts((current) => current ? { ...current, [page]: content } : current);
        clearPendingFile(slot);
      }
      setUploadProgress(null);
      const updated = validateServicePageContent(page, content);
      if (!updated.content) throw new Error(updated.error);
      const response = await fetch("/api/admin/service-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, content: updated.content, updated_at: pages[page].updated_at }),
      });
      const result = await response.json();
      if (response.status === 409) setSaveConflict(true);
      if (!response.ok) throw new Error(result.error || "Could not save page content. Try again.");
      setPages((current) => current ? { ...current, [page]: result.page } : current);
      setDrafts((current) => current ? { ...current, [page]: structuredClone(result.page.content) } : current);
      setSavedMessage(`${page === "charters" ? "Charter" : "Transportation"} content saved. The public page is updated.`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save page content. Check your connection and try again.");
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  if (loading) return <div className={styles.loading} role="status" aria-busy="true" aria-label={`Loading ${page === "charters" ? "charter" : "transportation"} content`}><div className={styles.loadingHeading} /><div className={styles.loadingLayout}><div className={styles.loadingNav} /><div className={styles.loadingEditor} /></div></div>;
  if (loadError || !pages || !drafts) return <div className={styles.errorState}><h1>{page === "charters" ? "Charter content" : "Transportation content"}</h1><p>{loadError || "Could not load page content. Try again."}</p><button type="button" className={styles.secondary} onClick={() => void load()}>Try again</button></div>;

  const sections = page === "charters" ? CHARTER_SECTIONS : TRANSPORT_SECTIONS;
  const charterTab = page === "charters" ? drafts.charters.infoTabs.find((tab) => tab.id === section) : undefined;
  const transportSection = page === "transportation" ? drafts.transportation.sections.find((item) => item.id === section) : undefined;
  const updatedAt = pages[page].updated_at;

  return <div className={styles.manager}>
    <div className={styles.heading}>
      <div><h1>{page === "charters" ? "Charter content" : "Transportation content"}</h1><p>Edit the information visitors see on the {page === "charters" ? "charter" : "transportation"} page.</p></div>
      <Link className={styles.publicLink} href={`/services/${page}`} target="_blank" rel="noopener noreferrer">View public page <ExternalLink size={16} aria-hidden="true" /></Link>
    </div>

    <div className={styles.layout}>
      <nav className={styles.sectionNav} aria-label={`${page === "charters" ? "Charter" : "Transportation"} content sections`}>
        <h2>Sections</h2>
        {sections.map((item) => <button key={item.id} type="button" aria-current={section === item.id ? "true" : undefined} onClick={() => setSection(item.id)}>{item.label}</button>)}
      </nav>

      <form className={styles.editor} onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <fieldset disabled={saving}>
          <legend className="visually-hidden">{page === "charters" ? "Charter" : "Transportation"} content</legend>
          {section === "media" && page === "charters" && <CharterMediaEditor content={drafts.charters} onChange={(content) => editCharters(() => content)} pending={pendingFiles} onChoose={chooseMediaFile} onClear={clearPendingFile} />}
          {section === "media" && page === "transportation" && <TransportationMediaEditor content={drafts.transportation} onChange={(content) => editTransportation(() => content)} pending={pendingFiles} onChoose={chooseMediaFile} onClear={clearPendingFile} />}
          {charterTab && <>
            <div className={styles.editorHeading}><h2>{charterTab.label}</h2><p>Edit the tab label, paragraphs and list shown in the charter panel.</p></div>
            <div className={styles.field}><label htmlFor={`tab-label-${charterTab.id}`}>Tab heading</label><input id={`tab-label-${charterTab.id}`} value={charterTab.label} maxLength={120} onChange={(event) => editTab(charterTab.id, (tab) => ({ ...tab, label: event.target.value }))} /></div>
            {(charterTab.id === "why" || charterTab.id === "when-where") && <section className={styles.group}><h3>Paragraphs</h3>{charterTab.paragraphs.map((paragraph, index) => <div className={styles.entry} key={index}><div className={styles.entryHeading}><label htmlFor={`tab-${charterTab.id}-paragraph-${index}`}>Paragraph {index + 1}</label><button type="button" className={styles.remove} aria-label={`Remove paragraph ${index + 1}`} onClick={() => editTab(charterTab.id, (tab) => ({ ...tab, paragraphs: tab.paragraphs.filter((_, position) => position !== index) }))}><Trash2 size={16} aria-hidden="true" /> Remove</button></div><textarea id={`tab-${charterTab.id}-paragraph-${index}`} rows={4} maxLength={3000} value={paragraph} onChange={(event) => editTab(charterTab.id, (tab) => ({ ...tab, paragraphs: tab.paragraphs.map((value, position) => position === index ? event.target.value : value) }))} /></div>)}<button type="button" className={styles.add} disabled={charterTab.paragraphs.length >= 10} onClick={() => editTab(charterTab.id, (tab) => ({ ...tab, paragraphs: [...tab.paragraphs, ""] }))}><Plus size={16} aria-hidden="true" /> Add paragraph</button></section>}
            {charterTab.id !== "why" && <section className={styles.group}><h3>List items</h3>{charterTab.items.map((item, index) => <EditableListItem key={index} item={item} index={index} prefix={`tab-${charterTab.id}`} onChange={(change) => editTab(charterTab.id, (tab) => ({ ...tab, items: tab.items.map((value, position) => position === index ? change(value) : value) }))} onRemove={() => editTab(charterTab.id, (tab) => ({ ...tab, items: tab.items.filter((_, position) => position !== index) }))} />)}<button type="button" className={styles.add} disabled={charterTab.items.length >= 20} onClick={() => editTab(charterTab.id, (tab) => ({ ...tab, items: [...tab.items, { label: "", text: "" }] }))}><Plus size={16} aria-hidden="true" /> Add item</button></section>}
          </>}

          {page === "charters" && section === "skippers" && <><div className={styles.editorHeading}><h2>Skipper options</h2><p>Edit the labels and descriptions in the charter skipper panel. The four options stay in their current order.</p></div><section className={styles.group}>{drafts.charters.skipperOptions.map((option, index) => <details key={option.id} className={styles.disclosure}><summary>{option.label || `Option ${index + 1}`}</summary><div className={styles.disclosureBody}><div className={styles.field}><label htmlFor={`skipper-${option.id}-label`}>Option label</label><input id={`skipper-${option.id}-label`} value={option.label} maxLength={120} onChange={(event) => editCharters((content) => ({ ...content, skipperOptions: content.skipperOptions.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item) }))} /></div><div className={styles.field}><label htmlFor={`skipper-${option.id}-description`}>Description</label><textarea id={`skipper-${option.id}-description`} rows={4} maxLength={2000} value={option.description} onChange={(event) => editCharters((content) => ({ ...content, skipperOptions: content.skipperOptions.map((item) => item.id === option.id ? { ...item, description: event.target.value } : item) }))} /></div></div></details>)}</section></>}

          {transportSection && <>
            <div className={styles.editorHeading}>
              <h2>{transportSection.heading}</h2>
              <p>Edit the heading and paragraphs in this transportation panel.</p>
            </div>
            <div className={styles.field}>
              <label htmlFor={`transport-${transportSection.id}-heading`}>Section heading</label>
              <input id={`transport-${transportSection.id}-heading`} value={transportSection.heading} maxLength={120} onChange={(event) => editTransportSection(transportSection.id, (current) => ({ ...current, heading: event.target.value }))} />
            </div>
            <section className={styles.group}>
              <h3>Paragraphs</h3>
              {transportSection.paragraphs.map((paragraph, index) => (
                <EditableTransportParagraph
                  key={index}
                  paragraph={paragraph}
                  index={index}
                  sectionId={transportSection.id}
                  onChange={(change) => editTransportSection(transportSection.id, (current) => ({ ...current, paragraphs: current.paragraphs.map((item, position) => position === index ? change(item) : item) }))}
                  onRemove={() => editTransportSection(transportSection.id, (current) => ({ ...current, paragraphs: current.paragraphs.filter((_, position) => position !== index) }))}
                />
              ))}
              <button type="button" className={styles.add} disabled={transportSection.paragraphs.length >= 12} onClick={() => editTransportSection(transportSection.id, (current) => ({ ...current, paragraphs: [...current.paragraphs, { lead: "", text: "" }] }))}><Plus size={16} aria-hidden="true" /> Add paragraph</button>
            </section>
          </>}
        </fieldset>
        <div className={styles.actions}>
          <div className={styles.status} role="status" aria-live="polite">
            {saveError ? <span className={styles.saveError}>{saveError}{saveConflict && <button type="button" className={styles.reload} onClick={() => { if (window.confirm("Reload the latest content? Unsaved changes on this page will be discarded.")) void load(); }}>Reload latest content</button>}</span> : savedMessage ? <span className={styles.saved}>{savedMessage}</span> : pageDirty ? "Unsaved changes" : updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString()}` : "Using the current website copy"}
          </div>
          {uploadProgress && <div className={styles.uploadProgress} role="status">Uploading {uploadProgress.label}: {uploadProgress.percent}%<progress value={uploadProgress.percent} max={100} /></div>}
          {pageDirty && <button type="button" className={styles.discard} disabled={saving} onClick={discard}>Discard changes</button>}
          <button type="submit" className={styles.save} disabled={!pageDirty || saving} aria-busy={saving}>{saving ? uploadProgress ? "Uploading…" : "Saving…" : "Save and publish"}</button>
        </div>
      </form>
    </div>
  </div>;
}

function EditableListItem({ item, index, prefix, onChange, onRemove }: {
  item: LabeledText;
  index: number;
  prefix: string;
  onChange: (change: (item: LabeledText) => LabeledText) => void;
  onRemove: () => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { if (!item.label && detailsRef.current) detailsRef.current.open = true; }, [item.label]);
  return <div className={styles.listItem}><details ref={detailsRef} className={styles.disclosure}><summary>{item.label || `Item ${index + 1}`}</summary><div className={styles.disclosureBody}><div className={styles.field}><label htmlFor={`${prefix}-item-${index}-label`}>Item label</label><input id={`${prefix}-item-${index}-label`} value={item.label} maxLength={120} onChange={(event) => onChange((current) => ({ ...current, label: event.target.value }))} /></div><div className={styles.field}><label htmlFor={`${prefix}-item-${index}-text`}>Description</label><textarea id={`${prefix}-item-${index}-text`} rows={3} maxLength={2000} value={item.text} onChange={(event) => onChange((current) => ({ ...current, text: event.target.value }))} /></div></div></details><button type="button" className={styles.remove} aria-label={`Remove ${item.label || `item ${index + 1}`}`} onClick={onRemove}><Trash2 size={16} aria-hidden="true" /></button></div>;
}

function EditableTransportParagraph({ paragraph, index, sectionId, onChange, onRemove }: {
  paragraph: TransportationParagraph;
  index: number;
  sectionId: string;
  onChange: (change: (paragraph: TransportationParagraph) => TransportationParagraph) => void;
  onRemove: () => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { if (!paragraph.text && detailsRef.current) detailsRef.current.open = true; }, [paragraph.text]);
  return <div className={styles.listItem}>
    <details ref={detailsRef} className={styles.disclosure}>
      <summary>{paragraph.lead || `Paragraph ${index + 1}`}</summary>
      <div className={styles.disclosureBody}>
        <div className={styles.field}>
          <label htmlFor={`transport-${sectionId}-lead-${index}`}>Bold lead-in <span className={styles.optional}>(optional)</span></label>
          <input id={`transport-${sectionId}-lead-${index}`} value={paragraph.lead} maxLength={120} onChange={(event) => onChange((current) => ({ ...current, lead: event.target.value }))} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`transport-${sectionId}-text-${index}`}>Paragraph text</label>
          <textarea id={`transport-${sectionId}-text-${index}`} rows={4} maxLength={3000} value={paragraph.text} onChange={(event) => onChange((current) => ({ ...current, text: event.target.value }))} />
        </div>
      </div>
    </details>
    <button type="button" className={styles.remove} aria-label={`Remove paragraph ${index + 1}`} onClick={onRemove}><Trash2 size={16} aria-hidden="true" /></button>
  </div>;
}
