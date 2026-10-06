"use client";
import { useUnsavedChanges } from "../useUnsavedChanges";
import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { formatAccountDate } from "@/lib/utils";
import styles from "../AdminShell.module.scss";
import panel from "./CharterInquiries.module.scss";
import CharterInquirySkeleton from "./CharterInquirySkeleton";

type Inquiry = { id: string; created_at: string; name: string; email: string; status: string; [key: string]: string | number | null };
type Field = { key: string; label: string; type?: "number" | "date" | "email" | "tel" | "textarea" | "select"; required?: boolean; options?: string[] };
const contact: Field[] = [{ key: "name", label: "Name", required: true }, { key: "email", label: "Email", type: "email", required: true }, { key: "phone", label: "Phone", type: "tel" }];
const status: Field = { key: "status", label: "Status", type: "select", options: ["new", "contacted", "confirmed", "cancelled"] };
const groups = {
  charter: [
    { label: "Contact", fields: contact },
    { label: "Request", fields: [{ key: "charter_type", label: "Charter type", type: "select", options: ["cruiser", "power_boat", "racer", "yacht"] }, { key: "date_from", label: "From", type: "date", required: true }, { key: "date_to", label: "To", type: "date", required: true }, { key: "group_size", label: "Guests", type: "number", required: true }, status, { key: "note", label: "Notes", type: "textarea" }] as Field[] },
  ],
  transportation: [
    { label: "Contact", fields: contact },
    { label: "Request", fields: [{ key: "date_start", label: "Start date", type: "date", required: true }, { key: "deadline_date", label: "Deadline", type: "date", required: true }, { key: "start_point", label: "From" }, { key: "end_point", label: "To" }, status, { key: "note", label: "Notes", type: "textarea" }] as Field[] },
    { label: "Boat", fields: [{ key: "boat_weight_kg", label: "Weight (kg)", type: "number" }, { key: "boat_length_m", label: "Length (m)", type: "number" }, { key: "boat_beam_m", label: "Beam (m)", type: "number" }, { key: "boat_draft_m", label: "Draft (m)", type: "number" }, { key: "boat_height_m", label: "Height (m)", type: "number" }] as Field[] },
  ],
};
export default function InquiryManager({ kind }: { kind: "charter" | "transportation" }) {
  const isCharter = kind === "charter";
  const title = kind === "charter" ? "Charter inquiries" : "Transportation inquiries";
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [group, setGroup] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  useUnsavedChanges(dirty || !!busy);
  const load = useCallback(async () => {
    setLoading(true); setLoadFailed(false);
    try {
      const { data, error } = await getSupabaseBrowserClient().from(`${kind}_requests`).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data || []) as Inquiry[]);
    } catch { toast.error(`Could not load ${kind} inquiries. Try again.`); setLoadFailed(true); }
    finally { setLoading(false); }
  }, [kind]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!dirty && !busy) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, busy]);
  const close = () => { if (busy || (dirty && !confirm("Discard unsaved inquiry changes?"))) return; setSelected(null); setDirty(false); };
  const open = (item: Inquiry, edit = false) => { setSelected({ ...item }); setEditing(edit); setDirty(false); setGroup(0); };
  const save = async () => {
    if (!selected || busy) return;
    for (const section of groups[kind]) for (const field of section.fields) {
      const value = selected[field.key];
      if (field.required && (value === null || value === undefined || String(value).trim() === "")) { setGroup(groups[kind].indexOf(section)); toast.error(`Enter ${field.label.toLowerCase()}.`); return; }
      if (field.type === "number" && value !== null && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) { toast.error(`${field.label} must be a positive number.`); return; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selected.email)) { setGroup(0); toast.error("Enter a valid email address."); return; }
    const from = selected[kind === "charter" ? "date_from" : "date_start"], to = selected[kind === "charter" ? "date_to" : "deadline_date"];
    if (String(to) < String(from)) { setGroup(1); toast.error("The end date must be on or after the start date."); return; }
    if (kind === "charter" && (!Number.isInteger(Number(selected.group_size)) || Number(selected.group_size) < 1)) { setGroup(1); toast.error("Enter at least one guest as a whole number."); return; }
    setBusy(selected.id);
    try {
      const patch = Object.fromEntries(groups[kind].flatMap(section => section.fields).map(field => [field.key, selected[field.key] ?? null]));
      const { data, error } = await getSupabaseBrowserClient().from(`${kind}_requests`).update(patch).eq("id", selected.id).select("*").single();
      if (error) throw error;
      setItems(current => current.map(item => item.id === selected.id ? data as Inquiry : item));
      toast.success("Inquiry saved."); setDirty(false); setSelected(null);
    } catch { toast.error("Could not save this inquiry. Your changes are still here."); }
    finally { setBusy(null); }
  };
  const remove = async (item: Inquiry) => {
    if (!confirm(`Delete the inquiry from ${item.name}? This cannot be undone.`)) return;
    setBusy(item.id);
    try {
      const { error } = await getSupabaseBrowserClient().from(`${kind}_requests`).delete().eq("id", item.id);
      if (error) throw error;
      setItems(current => current.filter(row => row.id !== item.id)); toast.success("Inquiry deleted.");
    } catch { toast.error("Could not delete this inquiry. Try again."); }
    finally { setBusy(null); }
  };
  const visible = items.filter(item => (filter === "all" || item.status === filter) && [item.name, item.email, item.start_point, item.end_point, item.charter_type].some(value => String(value || "").toLowerCase().includes(query.toLowerCase())));
  const label = (value: string) => value.replaceAll("_", " ").replace(/^./, letter => letter.toUpperCase());
  return <div className={isCharter ? panel.manager : undefined}><h1 className="dashboard-title">{title}</h1><p className="admin-section-description">Review requests, follow up with clients and keep their status up to date.</p>
    {loading ? <CharterInquirySkeleton showHeading={false} kind={kind} /> : loadFailed ? <div className="admin-empty"><p>The inbox is unavailable.</p><button className="btn-border" onClick={() => void load()}>Try again</button></div> : <>
      <div className={`admin-toolbar ${isCharter ? panel.filters : ""}`}><label htmlFor={`${kind}-search`}>Search inquiries<input id={`${kind}-search`} type="search" autoComplete="off" placeholder="Name, email or request" value={query} onChange={event => { setQuery(event.target.value); setLimit(25); }} /></label><label htmlFor={`${kind}-status`}>Status<select id={`${kind}-status`} value={filter} onChange={event => { setFilter(event.target.value); setLimit(25); }}><option value="all">All statuses ({items.length})</option>{status.options!.map(value => <option key={value} value={value}>{label(value)} ({items.filter(item => item.status === value).length})</option>)}</select></label></div>
      {visible.length ? <div className={isCharter ? panel.panel : undefined}><div className={`${styles.tableRegion} ${isCharter ? panel.tableRegion : ""}`} tabIndex={0} role="region" aria-label={title}><table><thead><tr><th scope="col">Client</th><th scope="col">{kind === "charter" ? "Charter" : "Route"}</th><th scope="col">Dates</th><th scope="col">Status</th><th scope="col">Received</th><th scope="col">Actions</th></tr></thead><tbody>{visible.slice(0, limit).map(item => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.email}</small></td><td>{kind === "charter" ? <>{label(String(item.charter_type))}<small>{item.group_size} guests</small></> : <>{item.start_point || "Unspecified"}<small>→ {item.end_point || "Unspecified"}</small></>}</td><td>{formatAccountDate(String(item[kind === "charter" ? "date_from" : "date_start"]))}<small>to {formatAccountDate(String(item[kind === "charter" ? "date_to" : "deadline_date"]))}</small></td><td><span className={styles.status} data-status={item.status}>{label(item.status)}</span></td><td>{formatAccountDate(item.created_at)}</td><td><div className="d-flex gap-2"><button type="button" className="profile-table-action-btn" aria-label={`View inquiry from ${item.name}`} onClick={() => open(item)}><Eye /></button><button type="button" disabled={!!busy} className="profile-table-action-btn" aria-label={`Edit inquiry from ${item.name}`} onClick={() => open(item, true)}><Pencil /></button><button type="button" disabled={!!busy} className="profile-table-action-btn profile-table-action-btn-danger" aria-label={`Delete inquiry from ${item.name}`} onClick={() => void remove(item)}>{busy === item.id ? "…" : <Trash2 />}</button></div></td></tr>)}</tbody></table></div><div className={`${styles.listFooter} ${isCharter ? panel.listFooter : ""}`}><span>Showing {Math.min(limit, visible.length)} of {visible.length} inquiries</span>{limit < visible.length && <button type="button" className="btn-border" onClick={() => setLimit(limit + 25)}>Show more</button>}</div></div> : <div className="admin-empty"><h2>{items.length ? "No matching inquiries" : "No inquiries yet"}</h2><p>{items.length ? "Try another name or status." : `Requests submitted through the ${kind} page will appear here.`}</p>{items.length > 0 && <button type="button" className="btn-border" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button>}</div>}
    </>}
    <Modal fade={false} isOpen={!!selected} toggle={close} size="lg" className={`${styles.dialog} ${isCharter ? panel.charterDialog : ""}`} contentClassName={`${styles.legacy} ${isCharter ? panel.dialogContent : ""}`} backdrop="static"><ModalHeader toggle={busy ? undefined : close}>{editing ? "Edit inquiry" : "Inquiry details"}{selected ? ` · ${selected.name}` : ""}</ModalHeader><ModalBody className={isCharter ? panel.dialogBody : undefined}>{selected && <>
      {editing ? <><div className={`${styles.segmented} ${isCharter ? panel.sections : ""}`} aria-label="Inquiry sections">{groups[kind].map((section, index) => <button type="button" key={section.label} aria-pressed={group === index} onClick={() => setGroup(index)}>{section.label}</button>)}</div><fieldset disabled={!!busy} className={`${styles.fields} ${isCharter ? panel.fields : ""}`}><legend className="visually-hidden">{groups[kind][group].label}</legend>{groups[kind][group].fields.map(field => <label key={field.key} htmlFor={`inquiry-${field.key}`}>{field.label}{isCharter ? !field.required && field.type !== "select" ? " (optional)" : "" : field.required ? " *" : ""}{field.type === "select" ? <select id={`inquiry-${field.key}`} value={String(selected[field.key] || "")} onChange={event => { setSelected({ ...selected, [field.key]: event.target.value }); setDirty(true); }}>{field.options!.map(value => <option key={value} value={value}>{label(value)}</option>)}</select> : field.type === "textarea" ? <textarea id={`inquiry-${field.key}`} rows={4} value={String(selected[field.key] || "")} onChange={event => { setSelected({ ...selected, [field.key]: event.target.value }); setDirty(true); }} /> : <input id={`inquiry-${field.key}`} autoComplete="off" type={field.type || "text"} min={field.key === "group_size" ? 1 : 0} step={field.key === "group_size" ? 1 : "any"} value={selected[field.key] ?? ""} required={field.required} onChange={event => { setSelected({ ...selected, [field.key]: field.type === "number" ? event.target.value === "" ? null : Number(event.target.value) : event.target.value }); setDirty(true); }} />}</label>)}</fieldset></> : <>{groups[kind].map(section => <section key={section.label} className={`${styles.detailGroup} ${isCharter ? panel.detailPanel : ""}`}><h2>{section.label}</h2><dl>{section.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{field.key === "email" ? <a href={`mailto:${selected.email}`}>{selected.email}</a> : selected[field.key] == null || selected[field.key] === "" ? "—" : field.type === "date" ? formatAccountDate(String(selected[field.key])) : field.type === "select" ? label(String(selected[field.key])) : String(selected[field.key])}</dd></div>)}</dl></section>)}</>}
    </>}</ModalBody><ModalFooter><button type="button" className="btn-border" disabled={!!busy} onClick={close}>{editing ? "Cancel" : "Close"}</button>{editing ? <button type="button" className="btn-solid" disabled={!!busy} onClick={() => void save()}>{busy ? "Saving…" : "Save changes"}</button> : <button type="button" className="btn-solid" onClick={() => { setEditing(true); setGroup(0); }}>Edit inquiry</button>}</ModalFooter></Modal>
  </div>;
}
