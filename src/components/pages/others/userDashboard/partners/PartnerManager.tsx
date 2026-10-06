"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import styles from "./PartnerManager.module.scss";
import PartnerImageUpload from "./PartnerImageUpload";
import PartnerManagerSkeleton from "./PartnerManagerSkeleton";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Partner, PartnerFormField, PartnerInput, PartnerStatus } from "@/types/Partner";

const blank: PartnerInput = {
  slug: "", name: "", logo_url: "", breadcrumb_image_url: "", hero_image_url: null,
  content: "", website_url: null, primary_color: "#1a1a1a", secondary_color: "#ffffff",
  form_type: "standard", custom_fields: [], status: "draft", show_on_home: true, show_on_new_yachts: false, sort_order: 0,
};
const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const uniqueSlug = (name: string, partners: Partner[]) => {
  const base = slugify(name).slice(0, 90).replace(/-+$/, "") || `partner-${crypto.randomUUID().slice(0, 8)}`;
  const used = new Set(partners.map(partner => partner.slug));
  let slug = base;
  for (let suffix = 2; used.has(slug); suffix++) slug = `${base}-${suffix}`;
  return slug;
};
const nextSortOrder = (partners: Partner[]) => Math.min(10000, Math.max(0, ...partners.map(partner => partner.sort_order)) + 1);
const editable = (partner: Partner): PartnerInput => ({
  slug: partner.slug, name: partner.name, logo_url: partner.logo_url, breadcrumb_image_url: partner.breadcrumb_image_url,
  hero_image_url: partner.hero_image_url, content: partner.content, website_url: partner.website_url,
  primary_color: partner.primary_color, secondary_color: partner.secondary_color,
  form_type: partner.form_type, custom_fields: partner.custom_fields, status: partner.status,
  show_on_home: partner.show_on_home, show_on_new_yachts: partner.show_on_new_yachts, sort_order: partner.sort_order,
});

type MediaKey = "logo_url" | "breadcrumb_image_url" | "hero_image_url";
export default function PartnerManager({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PartnerInput>({ ...blank });
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<MediaKey | null>(null);
  const [loadError, setLoadError] = useState(false);
  const uploadInFlight = useRef(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageWarning, setImageWarning] = useState("");
  useEffect(() => { onDirtyChange(dirty || !!uploading || saving); }, [dirty, uploading, saving, onDirtyChange]);
  useEffect(() => {
    if (!dirty && !uploading && !saving) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty, uploading, saving]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  const load = useCallback(async () => {
    setLoading(true); setLoadError(false);
    try {
      const response = await fetch("/api/admin/partners", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load partners.");
      setPartners(result.partners);
      if (result.partners[0]) { setSelectedId(result.partners[0].id); setDraft(editable(result.partners[0])); }
    } catch (cause) { setLoadError(true); toast.error(cause instanceof Error ? cause.message : "Could not load partners."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const change = <K extends keyof PartnerInput>(key: K, value: PartnerInput[K]) => {
    setDraft((current) => ({ ...current, [key]: value })); setDirty(true);
  };
  const choose = (partner: Partner | null) => {
    if (dirty && !window.confirm("Discard unsaved partner changes?")) return;
    setSelectedId(partner?.id ?? null);
    setDraft(partner ? editable(partner) : { ...blank, custom_fields: [], sort_order: nextSortOrder(partners) });
    setDirty(false); setImageWarning("");
  };
  const updateField = (index: number, patch: Partial<PartnerFormField>) => change("custom_fields", draft.custom_fields.map((field, position) => position === index ? { ...field, ...patch } : field));
  const addField = () => change("custom_fields", [...draft.custom_fields, { id: `field-${crypto.randomUUID().slice(0, 8)}`, label: "", type: "text", required: false }]);

  async function upload(key: MediaKey, file: File) {
    if (uploadInFlight.current || saving) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      toast.error("Choose a JPEG, PNG or WebP image under 10 MB."); return;
    }
    uploadInFlight.current = true;
    setUploading(key);
    try {
      let warning = "";
      if (key === "breadcrumb_image_url") {
        const bitmap = await createImageBitmap(file);
        if (bitmap.width < 1600 || bitmap.height < 800 || Math.abs(bitmap.width / bitmap.height - 2) > 0.3) {
          warning = `This image is ${bitmap.width} × ${bitmap.height}px. Recommended: 2560 × 1280px (2:1), minimum 1600 × 800px.`;
        }
        bitmap.close();
      }
      const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
      const path = `${crypto.randomUUID()}.${ext}`;
      const client = getSupabaseBrowserClient();
      const { error: uploadError } = await client.storage.from("partner-assets").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = client.storage.from("partner-assets").getPublicUrl(path);
      change(key, data.publicUrl);
      if (key === "breadcrumb_image_url") setImageWarning(warning);
      toast.success("Image uploaded. Save your changes to apply it.");
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Image upload failed. Check your connection and try again."); }
    finally { setUploading(null); uploadInFlight.current = false; }
  }

  async function save(status: PartnerStatus) {
    if (saving || uploading) return;
    if (status === "draft" && partners.find((partner) => partner.id === selectedId)?.status === "published" && !window.confirm("Move this partner to draft? Its page, homepage card and New Yachts listing will be hidden.")) return;
    if (!draft.name.trim()) { toast.error("Enter a partner name."); return; }
    setSaving(true);
    try {
      const response = await fetch(selectedId ? `/api/admin/partners/${selectedId}` : "/api/admin/partners", {
        method: selectedId ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save partner.");
      const saved = result.partner as Partner;
      setPartners((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)));
      setSelectedId(saved.id); setDraft(editable(saved)); setDirty(false);
      toast.success(status === "published" ? "Partner published. Its public page is live." : "Draft saved. It is hidden from the public site.");
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Could not save partner."); }
    finally { setSaving(false); }
  }

  if (loading) return <PartnerManagerSkeleton />;
  if (loadError) return <div className={`partner-admin ${styles.manager}`}><h1>Partners</h1><p>The partner list is unavailable.</p><button type="button" className="partner-admin__secondary" onClick={() => void load()}>Try again</button></div>;

  const busy = saving || !!uploading;
  const visible = partners.filter(partner => partner.name.toLowerCase().includes(query.trim().toLowerCase()) && (statusFilter === "all" || partner.status === statusFilter));
  const selected = partners.find(partner => partner.id === selectedId);
  return <div className={`partner-admin ${styles.manager}`}>
    <div className="partner-admin__heading">
      <div><h1>Partners</h1><p>Manage the brands shown on the website.</p></div>
      <button type="button" className="partner-admin__secondary" disabled={busy} onClick={() => choose(null)}><Plus size={18} aria-hidden="true" />Add partner</button>
    </div>
    <div className={styles.filters}>
      <div className={styles.field}><label htmlFor="partner-search">Search partners</label><input id="partner-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name" autoComplete="off" /></div>
      <div className={styles.field}><label htmlFor="partner-status">Status</label><select id="partner-status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="all">All partners ({partners.length})</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
    </div>
    <section className={styles.library} aria-labelledby="partner-library-label">
      <div className={styles.libraryHeading}><h2 id="partner-library-label">Choose a partner</h2><span>{visible.length} of {partners.length}</span></div>
      {partners.length === 0 ? <div className={styles.empty}>No partners yet. Add your first partner using the form below.</div> : visible.length === 0 ? <div className={styles.empty}><p>No partners match your filters.</p><button type="button" className="partner-admin__secondary" onClick={() => { setQuery(""); setStatusFilter("all"); }}>Clear filters</button></div> :
        <div className={styles.partnerRail}>
          {visible.map(partner => <button type="button" key={partner.id} disabled={busy} className={`${styles.partnerCard} ${selectedId === partner.id ? styles.selectedCard : ""}`} aria-pressed={selectedId === partner.id} onClick={() => { if (selectedId !== partner.id) choose(partner); }}>
            <span className={styles.partnerLogo}>{partner.logo_url ? <Image src={partner.logo_url} alt="" width={112} height={48} unoptimized /> : <span className={styles.logoFallback}>{partner.name.slice(0, 2).toUpperCase()}</span>}</span>
            <span className={styles.partnerCardName}>{partner.name}</span>
            <span className={styles.partnerCardStatus}>{partner.status === "published" ? "Published" : "Draft"}{selectedId === partner.id && <Check size={14} aria-hidden="true" />}</span>
          </button>)}
        </div>}
    </section>
    <form noValidate className="partner-admin__editor" onSubmit={event => { event.preventDefault(); void save("published"); }}>
      <div className={styles.editorHeading}><h2>{selectedId ? draft.name : "New partner"}</h2><span className={styles.badge}>{draft.status === "published" ? "Published" : "Draft"}</span>{selected && selected.status === "published" && <Link href={`/partners/${selected.slug}`} target="_blank" rel="noopener noreferrer">View page ↗</Link>}</div>
      <details className={styles.section} open><summary>Basics</summary><fieldset disabled={busy}><legend className="visually-hidden">Basics</legend>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="partner-name">Partner name</label>
            <input id="partner-name" value={draft.name} maxLength={120} autoComplete="off" onChange={event => { const name = event.target.value; setDraft(current => ({ ...current, name, slug: selectedId ? current.slug : name.trim() ? uniqueSlug(name, partners) : "" })); setDirty(true); }} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="partner-website">Website URL <span className={styles.optional}>(optional)</span></label>
            <input id="partner-website" type="url" inputMode="url" autoComplete="off" placeholder="https://example.com" value={draft.website_url || ""} onChange={event => change("website_url", event.target.value)} />
          </div>
        </div>
        <div className={styles.visibility}>
          <label htmlFor="partner-home" className={styles.check}><input id="partner-home" type="checkbox" checked={draft.show_on_home} onChange={event => change("show_on_home", event.target.checked)} /><span>Show on homepage</span></label>
          <label htmlFor="partner-new-yachts" className={styles.check}><input id="partner-new-yachts" type="checkbox" checked={draft.show_on_new_yachts} onChange={event => change("show_on_new_yachts", event.target.checked)} /><span>Show in New Yachts<small>Visitors can explore this brand and send an inquiry.</small></span></label>
        </div>
      </fieldset></details>
      <details className={styles.section}><summary>Images</summary><fieldset disabled={busy}><legend className="visually-hidden">Images</legend>
        <div className={styles.assetGrid}>
          <PartnerImageUpload id="partner-logo" label="Logo" hint="A transparent PNG or WebP works best." contain value={draft.logo_url} disabled={busy} uploading={uploading === "logo_url"} onUpload={file => void upload("logo_url", file)} onRemove={() => change("logo_url", "")} />
          <PartnerImageUpload id="partner-breadcrumb" label="Breadcrumb image" hint="2560 × 1280px (2:1) recommended. Minimum 1600 × 800px." value={draft.breadcrumb_image_url} disabled={busy} uploading={uploading === "breadcrumb_image_url"} onUpload={file => void upload("breadcrumb_image_url", file)} onRemove={() => { change("breadcrumb_image_url", ""); setImageWarning(""); }} />
          <PartnerImageUpload id="partner-content-image" label="Content image" hint="Displayed above the text on the partner page." optional value={draft.hero_image_url} disabled={busy} uploading={uploading === "hero_image_url"} onUpload={file => void upload("hero_image_url", file)} onRemove={() => change("hero_image_url", null)} />
        </div>
        {imageWarning && <p className="partner-admin__warning" role="status">{imageWarning}</p>}
      </fieldset></details>
      <details className={styles.section}><summary>Page content</summary><fieldset disabled={busy}><legend className="visually-hidden">Page content</legend>
        <div className={styles.field}><label htmlFor="partner-content">About this partner</label><textarea id="partner-content" value={draft.content} onChange={event => change("content", event.target.value)} rows={8} maxLength={20000} aria-describedby="partner-content-hint" placeholder="Introduce the brand, its products and your partnership." /><p id="partner-content-hint" className={styles.hint}>Separate paragraphs with a blank line.{draft.content.length > 18000 && ` ${draft.content.length.toLocaleString()} / 20,000 characters.`}</p></div>
      </fieldset></details>
      <details className={styles.section}><summary>Contact form</summary><fieldset disabled={busy}><legend className="visually-hidden">Contact form</legend>
        <p className={styles.formIntro}>Every form asks for name, email, phone and message. Custom forms can include additional fields.</p>
        <div className={styles.formChoices}>
          <label htmlFor="partner-form-standard" className={styles.check}><input id="partner-form-standard" type="radio" name="form-type" checked={draft.form_type === "standard"} onChange={() => change("form_type", "standard")} /><span>Standard form<small>Name, email, phone and message</small></span></label>
          <label htmlFor="partner-form-custom" className={styles.check}><input id="partner-form-custom" type="radio" name="form-type" checked={draft.form_type === "custom"} onChange={() => change("form_type", "custom")} /><span>Custom form<small>Add fields to the standard form</small></span></label>
        </div>
        {draft.form_type === "custom" && <div className={styles.customFields}>
          {draft.custom_fields.map((field, index) => <div className={styles.customField} key={field.id}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><label htmlFor={`label-${field.id}`}>Field {index + 1} label</label><input id={`label-${field.id}`} value={field.label} maxLength={80} onChange={event => updateField(index, { label: event.target.value })} /></div>
              <div className={styles.field}><label htmlFor={`type-${field.id}`}>Field type</label><select id={`type-${field.id}`} value={field.type} onChange={event => updateField(index, { type: event.target.value as PartnerFormField["type"] })}><option value="text">Short text</option><option value="tel">Phone</option><option value="textarea">Long text</option><option value="select">Dropdown</option></select></div>
            </div>
            {field.type === "select" && <div className={styles.field}><label htmlFor={`options-${field.id}`}>Dropdown options</label><textarea id={`options-${field.id}`} value={(field.options || []).join("\n")} rows={3} aria-describedby={`options-hint-${field.id}`} onChange={event => updateField(index, { options: event.target.value.split("\n") })} /><p id={`options-hint-${field.id}`} className={styles.hint}>Enter one option per line.</p></div>}
            <div className={styles.fieldActions}><label htmlFor={`required-${field.id}`} className={styles.check}><input id={`required-${field.id}`} type="checkbox" checked={field.required} onChange={event => updateField(index, { required: event.target.checked })} />Required field</label><button type="button" className={styles.removeImage} aria-label={`Remove ${field.label || `field ${index + 1}`}`} onClick={() => { if (!field.label || window.confirm(`Remove the “${field.label}” field?`)) change("custom_fields", draft.custom_fields.filter((_, position) => position !== index)); }}>Remove field</button></div>
          </div>)}
          <button type="button" className="partner-admin__secondary" onClick={addField} disabled={draft.custom_fields.length >= 8}><Plus size={16} aria-hidden="true" />Add field</button>
          <p className={styles.hint}>Up to eight fields. Your team receives the answers with each inquiry.</p>
        </div>}
      </fieldset></details>
      <div className="partner-admin__actions"><span className={styles.saveState} role="status">{uploading ? "Uploading image…" : saving ? "Saving changes…" : dirty ? "Unsaved changes" : selectedId ? "All changes saved" : "Not saved yet"}</span><button type="button" className="partner-admin__secondary" onClick={() => void save("draft")} disabled={busy}>{saving ? "Saving…" : draft.status === "published" ? "Unpublish to draft" : "Save draft"}</button><button type="submit" className="partner-admin__primary" disabled={busy}>{saving ? "Saving…" : draft.status === "published" ? "Save changes" : "Publish partner"}</button></div>
    </form>
  </div>;
}
