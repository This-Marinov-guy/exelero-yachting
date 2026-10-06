"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Pencil, RotateCw } from "lucide-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { formatAccountDate } from "@/lib/utils";
import { INQUIRY_STATUSES, inquiryStatusLabel, isInquiryStatus, type InquiryStatus } from "@/lib/inquiryWorkflow";
import { useUnsavedChanges } from "../useUnsavedChanges";
import CharterInquirySkeleton from "./CharterInquirySkeleton";
import { InquiryBulkActions, SelectPageCheckbox } from "./InquiryBulkActions";
import { useInquiryBulkActions } from "./useInquiryBulkActions";
import styles from "../AdminShell.module.scss";
import panel from "./CharterInquiries.module.scss";
import local from "./ContactInquiries.module.scss";
import bulkStyle from "./InquiryBulkActions.module.scss";

type Kind = "boat" | "partner";
type ContactInquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  answers: Record<string, string> | null;
  context_name: string | null;
  context_path: string | null;
  notification_sent_at: string | null;
  notification_delivered_to: string[];
  status: InquiryStatus;
  internal_note: string | null;
};

const columns = "id, created_at, name, email, phone, message, answers, context_name, context_path, notification_sent_at, notification_delivered_to, status, internal_note";
const canRetry = (item: ContactInquiry) => !item.notification_sent_at && !!item.context_path;
const emailStatus = (item: ContactInquiry) => item.notification_sent_at ? "Sent" : item.context_path ? "Pending" : "Not tracked";

function sourceHref(path: string | null) {
  return path?.startsWith("/") && !path.startsWith("//") ? path : null;
}

export default function ContactInquiries({ kind }: { kind: Kind }) {
  const title = kind === "boat" ? "Boat brokerage inquiries" : "Partner inquiries";
  const [items, setItems] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  const bulk = useInquiryBulkActions(`${kind}_inquiries`, items, setItems);
  useUnsavedChanges(dirty || !!busy || bulk.bulkBusy);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from(`${kind}_inquiries`).select(columns).order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as ContactInquiry[];
      setItems(rows);
      setSelected(current => current ? rows.find(row => row.id === current.id) ?? null : null);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => { void load(); }, [load]);

  function open(item: ContactInquiry, edit = false) {
    setSelected({ ...item });
    setEditing(edit);
    setDirty(false);
  }

  function close() {
    if (busy || bulk.bulkBusy || (dirty && !window.confirm("Discard unsaved inquiry changes?"))) return;
    setSelected(null);
    setEditing(false);
    setDirty(false);
  }

  async function save() {
    if (!selected || busy || bulk.bulkBusy) return;
    if (!isInquiryStatus(selected.status)) {
      toast.error("Choose a valid inquiry status.");
      return;
    }
    const internalNote = selected.internal_note?.trim() || null;
    if (internalNote && internalNote.length > 5000) {
      toast.error("Keep the internal note within 5,000 characters.");
      return;
    }
    setBusy(selected.id);
    try {
      const { data, error } = await getSupabaseBrowserClient().from(`${kind}_inquiries`)
        .update({ status: selected.status, internal_note: internalNote })
        .eq("id", selected.id).select(columns).single();
      if (error) throw error;
      const saved = data as ContactInquiry;
      setItems(current => current.map(item => item.id === saved.id ? saved : item));
      setSelected(saved);
      setEditing(false);
      setDirty(false);
      toast.success("Inquiry status and internal note saved.");
    } catch {
      toast.error("Could not save this inquiry. Your changes are still here; try again.");
    } finally {
      setBusy(null);
    }
  }

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter(item => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (deliveryFilter === "sent" && !item.notification_sent_at) return false;
      if (deliveryFilter === "pending" && !canRetry(item)) return false;
      return !term || [item.name, item.email, item.context_name, item.message, item.internal_note, ...Object.values(item.answers ?? {})]
        .some(value => String(value ?? "").toLowerCase().includes(term));
    });
  }, [items, query, statusFilter, deliveryFilter]);
  const pageItems = visible.slice(0, limit);
  const pageIds = pageItems.map(item => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => bulk.selectedIds.includes(id));
  const somePageSelected = pageIds.some(id => bulk.selectedIds.includes(id));

  async function retry(item: ContactInquiry) {
    if (busy || bulk.bulkBusy) return;
    setBusy(item.id);
    try {
      const response = await fetch(`/api/admin/inquiries/${kind}/${item.id}/retry`, { method: "POST" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "Email is still unavailable. This inquiry remains in the account inbox.");
      toast.success("Email notification sent.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Email is still unavailable. This inquiry remains in the account inbox.");
    } finally {
      setBusy(null);
    }
  }

  function actionsFor(item: ContactInquiry) {
    return <div className={local.actions}>
      <button type="button" className="profile-table-action-btn" disabled={!!busy || bulk.bulkBusy} aria-label={`View inquiry from ${item.name}`} onClick={() => open(item)}><Eye aria-hidden="true" /></button>
      <button type="button" className="profile-table-action-btn" disabled={!!busy || bulk.bulkBusy} aria-label={`Edit status and internal note for ${item.name}`} onClick={() => open(item, true)}><Pencil aria-hidden="true" /></button>
      {canRetry(item) && <button type="button" className="btn-border" disabled={!!busy || bulk.bulkBusy} onClick={() => void retry(item)}><RotateCw size={16} aria-hidden="true" />{busy === item.id ? "Sending…" : "Retry email"}</button>}
    </div>;
  }

  const empty = items.length === 0;
  return <div className={panel.manager}>
    <h1 className="dashboard-title">{title}</h1>
    <p className="admin-section-description">Every saved request appears here, even when its email notification is delayed.</p>
    {loading ? <CharterInquirySkeleton kind={kind} showHeading={false} /> : loadFailed ?
      <div className="admin-empty"><h2>Inquiries could not be loaded</h2><p>Try again to see the requests saved for your team.</p><button type="button" className="btn-border" onClick={() => void load()}>Try again</button></div> : <>
      <div className={`admin-toolbar ${panel.filters} ${panel.contactFilters}`}>
        <label htmlFor={`${kind}-inquiry-search`}>Search inquiries
          <input id={`${kind}-inquiry-search`} type="search" autoComplete="off" placeholder="Name, email, yacht or message" value={query} onChange={event => { setQuery(event.target.value); setLimit(25); }} />
        </label>
        <label htmlFor={`${kind}-inquiry-status`}>Status
          <select id={`${kind}-inquiry-status`} value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setLimit(25); }}>
            <option value="all">All statuses ({items.length})</option>
            {INQUIRY_STATUSES.map(value => <option key={value} value={value}>{inquiryStatusLabel(value)} ({items.filter(item => item.status === value).length})</option>)}
          </select>
        </label>
        <label htmlFor={`${kind}-delivery-filter`}>Email notification
          <select id={`${kind}-delivery-filter`} value={deliveryFilter} onChange={event => { setDeliveryFilter(event.target.value); setLimit(25); }}>
            <option value="all">All ({items.length})</option>
            <option value="pending">Pending ({items.filter(canRetry).length})</option>
            <option value="sent">Sent ({items.filter(item => item.notification_sent_at).length})</option>
          </select>
        </label>
      </div>
      <InquiryBulkActions selectedCount={bulk.selectedIds.length} busy={bulk.bulkBusy} disabled={!!busy || bulk.bulkBusy} deleteCount={bulk.deleteIds.length}
        onClear={bulk.clearSelection} onApplyStatus={status => void bulk.applyStatus(status)}
        onRequestDelete={() => bulk.requestDelete(bulk.selectedIds)} onCancelDelete={bulk.cancelDelete} onConfirmDelete={() => void bulk.confirmDelete()} />
      {visible.length ? <div className={panel.panel}>
        <div className={`${styles.tableRegion} ${panel.tableRegion} ${local.desktopTable}`} tabIndex={0} role="region" aria-label={title}>
          <table className={bulkStyle.bulkTable}><thead><tr><th scope="col" className={bulkStyle.selectCell}><SelectPageCheckbox checked={allPageSelected} indeterminate={somePageSelected && !allPageSelected} disabled={!!busy || bulk.bulkBusy} count={pageIds.length} onChange={() => bulk.togglePage(pageIds)} /></th><th scope="col">Client</th><th scope="col">Regarding</th><th scope="col">Message</th><th scope="col">Status</th><th scope="col">Email</th><th scope="col">Received</th><th scope="col">Actions</th></tr></thead>
            <tbody>{pageItems.map(item => <tr key={item.id}>
              <td className={bulkStyle.selectCell}><label className={bulkStyle.selectionLabel}><input type="checkbox" checked={bulk.selectedIds.includes(item.id)} disabled={!!busy || bulk.bulkBusy} onChange={() => bulk.toggleOne(item.id)} aria-label={`Select inquiry from ${item.name}`} /></label></td>
              <td><strong>{item.name}</strong><small>{item.email}</small></td>
              <td>{item.context_name || (kind === "boat" ? "Boat inquiry" : "Partner inquiry")}</td>
              <td className={local.preview}>{item.message || "—"}</td>
              <td><span className={styles.status} data-status={item.status}>{inquiryStatusLabel(item.status)}</span></td>
              <td><span className={styles.status} data-status={item.notification_sent_at ? "confirmed" : canRetry(item) ? "new" : undefined}>{emailStatus(item)}</span></td>
              <td>{formatAccountDate(item.created_at)}</td>
              <td>{actionsFor(item)}</td>
            </tr>)}</tbody></table>
        </div>
        <div className={local.mobileCards} aria-label={title}><button type="button" className={bulkStyle.mobileSelectAll} disabled={!!busy || bulk.bulkBusy} onClick={() => bulk.togglePage(pageIds)}>{allPageSelected ? "Deselect displayed" : `Select displayed (${pageIds.length})`}</button>{pageItems.map(item => <article className={local.mobileCard} key={item.id}>
          <div className={local.mobileHeading}><label className={bulkStyle.selectionLabel}><input type="checkbox" checked={bulk.selectedIds.includes(item.id)} disabled={!!busy || bulk.bulkBusy} onChange={() => bulk.toggleOne(item.id)} aria-label={`Select inquiry from ${item.name}`} /></label><strong>{item.name}</strong><span className={styles.status} data-status={item.status}>{inquiryStatusLabel(item.status)}</span></div>
          <a href={`mailto:${item.email}`}>{item.email}</a>
          <p><strong>Regarding</strong>{item.context_name || (kind === "boat" ? "Boat inquiry" : "Partner inquiry")}</p>
          <p className={local.mobileMessage}>{item.message || "—"}</p>
          <p><strong>Email notification</strong>{emailStatus(item)}</p>
          <div className={local.mobileFooter}><time dateTime={item.created_at}>{formatAccountDate(item.created_at)}</time>{actionsFor(item)}</div>
        </article>)}</div>
        <div className={`${styles.listFooter} ${panel.listFooter}`}><span>Showing {Math.min(limit, visible.length)} of {visible.length} inquiries</span>{limit < visible.length && <button type="button" className="btn-border" onClick={() => setLimit(limit + 25)}>Show more</button>}</div>
      </div> : <div className="admin-empty"><h2>{empty ? "No inquiries yet" : "No matching inquiries"}</h2><p>{empty ? `Requests submitted through ${kind === "boat" ? "boat brokerage" : "partner"} pages will appear here.` : "Try a different search or status."}</p>{!empty && <button type="button" className="btn-border" onClick={() => { setQuery(""); setStatusFilter("all"); setDeliveryFilter("all"); }}>Clear filters</button>}</div>}
    </>}

    <Modal fade={false} isOpen={!!selected} toggle={close} size="lg" className={`${styles.dialog} ${panel.charterDialog}`} contentClassName={`${styles.legacy} ${panel.dialogContent}`} backdrop="static">
      <ModalHeader toggle={busy ? undefined : close}>{selected ? `Inquiry from ${selected.name}` : "Inquiry details"}</ModalHeader>
      <ModalBody className={panel.dialogBody}>{selected && <>
        <section className={`${styles.detailGroup} ${panel.detailPanel}`}><h2>Contact</h2><dl>
          <div><dt>Name</dt><dd>{selected.name}</dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
          <div><dt>Phone</dt><dd>{selected.phone ? <a href={`tel:${selected.phone}`}>{selected.phone}</a> : "—"}</dd></div>
          <div><dt>Message</dt><dd>{selected.message || "—"}</dd></div>
        </dl></section>
        <section className={`${styles.detailGroup} ${panel.detailPanel}`}><h2>Inquiry</h2><dl>
          <div><dt>Regarding</dt><dd>{sourceHref(selected.context_path) ? <a href={selected.context_path!} target="_blank" rel="noopener noreferrer">{selected.context_name || selected.context_path}</a> : selected.context_name || "—"}</dd></div>
          <div><dt>Received</dt><dd>{formatAccountDate(selected.created_at)}</dd></div>
          <div><dt>Email notification</dt><dd>{canRetry(selected) ? "Pending — this request is saved in the account inbox" : emailStatus(selected)}</dd></div>
          {Object.entries(selected.answers ?? {}).map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{String(value)}</dd></div>)}
        </dl></section>
        <section className={`${styles.detailGroup} ${panel.detailPanel}`}><h2>Internal follow-up</h2>{editing ?
          <fieldset className={`${styles.fields} ${panel.fields} ${local.workflowFields}`} disabled={!!busy}>
            <label htmlFor={`${kind}-workflow-status`}>Status
              <select id={`${kind}-workflow-status`} value={selected.status} onChange={event => { setSelected({ ...selected, status: event.target.value as InquiryStatus }); setDirty(true); }}>
                {INQUIRY_STATUSES.map(value => <option key={value} value={value}>{inquiryStatusLabel(value)}</option>)}
              </select>
            </label>
            <label htmlFor={`${kind}-internal-note`}>Internal note (optional)
              <textarea id={`${kind}-internal-note`} rows={5} maxLength={5000} value={selected.internal_note || ""} onChange={event => { setSelected({ ...selected, internal_note: event.target.value }); setDirty(true); }} />
            </label>
            <p className={local.privateHint}>Only account users can see this note. It is never included in email to the client.</p>
          </fieldset> : <dl>
            <div><dt>Status</dt><dd><span className={styles.status} data-status={selected.status}>{inquiryStatusLabel(selected.status)}</span></dd></div>
            <div><dt>Internal note</dt><dd>{selected.internal_note || "—"}</dd></div>
          </dl>}
        </section>
      </>}</ModalBody>
      <ModalFooter><button type="button" className="btn-border" disabled={!!busy} onClick={close}>{editing ? "Cancel" : "Close"}</button>
        {!editing && selected && canRetry(selected) && <button type="button" className="btn-border" disabled={!!busy} onClick={() => void retry(selected)}>{busy === selected.id ? "Sending…" : "Retry email"}</button>}
        {selected && (editing ? <button type="button" className="btn-solid" disabled={!!busy || !dirty} onClick={() => void save()}>{busy ? "Saving…" : "Save changes"}</button> : <button type="button" className="btn-solid" onClick={() => setEditing(true)}>Edit status &amp; note</button>)}
      </ModalFooter>
    </Modal>
  </div>;
}
