"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, RotateCw } from "lucide-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { formatAccountDate } from "@/lib/utils";
import { useUnsavedChanges } from "../useUnsavedChanges";
import CharterInquirySkeleton from "./CharterInquirySkeleton";
import styles from "../AdminShell.module.scss";
import panel from "./CharterInquiries.module.scss";
import local from "./ContactInquiries.module.scss";

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
};

const columns = "id, created_at, name, email, phone, message, answers, context_name, context_path, notification_sent_at, notification_delivered_to";
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
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  useUnsavedChanges(!!busy);

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

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter(item => {
      if (deliveryFilter === "sent" && !item.notification_sent_at) return false;
      if (deliveryFilter === "pending" && !canRetry(item)) return false;
      return !term || [item.name, item.email, item.context_name, item.message, ...Object.values(item.answers ?? {})]
        .some(value => String(value ?? "").toLowerCase().includes(term));
    });
  }, [items, query, deliveryFilter]);

  async function retry(item: ContactInquiry) {
    if (busy) return;
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
      <button type="button" className="profile-table-action-btn" aria-label={`View inquiry from ${item.name}`} onClick={() => setSelected(item)}><Eye aria-hidden="true" /></button>
      {canRetry(item) && <button type="button" className="btn-border" disabled={!!busy} onClick={() => void retry(item)}><RotateCw size={16} aria-hidden="true" />{busy === item.id ? "Sending…" : "Retry email"}</button>}
    </div>;
  }

  const empty = items.length === 0;
  return <div className={panel.manager}>
    <h1 className="dashboard-title">{title}</h1>
    <p className="admin-section-description">Every saved request appears here, even when its email notification is delayed.</p>
    {loading ? <CharterInquirySkeleton kind={kind} showHeading={false} /> : loadFailed ?
      <div className="admin-empty"><h2>Inquiries could not be loaded</h2><p>Try again to see the requests saved for your team.</p><button type="button" className="btn-border" onClick={() => void load()}>Try again</button></div> : <>
      <div className={`admin-toolbar ${panel.filters}`}>
        <label htmlFor={`${kind}-inquiry-search`}>Search inquiries
          <input id={`${kind}-inquiry-search`} type="search" autoComplete="off" placeholder="Name, email, yacht or message" value={query} onChange={event => { setQuery(event.target.value); setLimit(25); }} />
        </label>
        <label htmlFor={`${kind}-delivery-filter`}>Email notification
          <select id={`${kind}-delivery-filter`} value={deliveryFilter} onChange={event => { setDeliveryFilter(event.target.value); setLimit(25); }}>
            <option value="all">All ({items.length})</option>
            <option value="pending">Pending ({items.filter(canRetry).length})</option>
            <option value="sent">Sent ({items.filter(item => item.notification_sent_at).length})</option>
          </select>
        </label>
      </div>
      {visible.length ? <div className={panel.panel}>
        <div className={`${styles.tableRegion} ${panel.tableRegion} ${local.desktopTable}`} tabIndex={0} role="region" aria-label={title}>
          <table><thead><tr><th scope="col">Client</th><th scope="col">Regarding</th><th scope="col">Message</th><th scope="col">Email</th><th scope="col">Received</th><th scope="col">Actions</th></tr></thead>
            <tbody>{visible.slice(0, limit).map(item => <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.email}</small></td>
              <td>{item.context_name || (kind === "boat" ? "Boat inquiry" : "Partner inquiry")}</td>
              <td className={local.preview}>{item.message || "—"}</td>
              <td><span className={styles.status} data-status={item.notification_sent_at ? "confirmed" : canRetry(item) ? "new" : undefined}>{emailStatus(item)}</span></td>
              <td>{formatAccountDate(item.created_at)}</td>
              <td>{actionsFor(item)}</td>
            </tr>)}</tbody></table>
        </div>
        <div className={local.mobileCards} aria-label={title}>{visible.slice(0, limit).map(item => <article className={local.mobileCard} key={item.id}>
          <div className={local.mobileHeading}><strong>{item.name}</strong><span className={styles.status} data-status={item.notification_sent_at ? "confirmed" : canRetry(item) ? "new" : undefined}>{emailStatus(item)}</span></div>
          <a href={`mailto:${item.email}`}>{item.email}</a>
          <p><strong>Regarding</strong>{item.context_name || (kind === "boat" ? "Boat inquiry" : "Partner inquiry")}</p>
          <p className={local.mobileMessage}>{item.message || "—"}</p>
          <div className={local.mobileFooter}><time dateTime={item.created_at}>{formatAccountDate(item.created_at)}</time>{actionsFor(item)}</div>
        </article>)}</div>
        <div className={`${styles.listFooter} ${panel.listFooter}`}><span>Showing {Math.min(limit, visible.length)} of {visible.length} inquiries</span>{limit < visible.length && <button type="button" className="btn-border" onClick={() => setLimit(limit + 25)}>Show more</button>}</div>
      </div> : <div className="admin-empty"><h2>{empty ? "No inquiries yet" : "No matching inquiries"}</h2><p>{empty ? `Requests submitted through ${kind === "boat" ? "boat brokerage" : "partner"} pages will appear here.` : "Try a different search or email status."}</p>{!empty && <button type="button" className="btn-border" onClick={() => { setQuery(""); setDeliveryFilter("all"); }}>Clear filters</button>}</div>}
    </>}

    <Modal fade={false} isOpen={!!selected} toggle={() => { if (!busy) setSelected(null); }} size="lg" className={`${styles.dialog} ${panel.charterDialog}`} contentClassName={`${styles.legacy} ${panel.dialogContent}`} backdrop="static">
      <ModalHeader toggle={busy ? undefined : () => setSelected(null)}>{selected ? `Inquiry from ${selected.name}` : "Inquiry details"}</ModalHeader>
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
      </>}</ModalBody>
      <ModalFooter><button type="button" className="btn-border" disabled={!!busy} onClick={() => setSelected(null)}>Close</button>{selected && canRetry(selected) && <button type="button" className="btn-solid" disabled={!!busy} onClick={() => void retry(selected)}>{busy === selected.id ? "Sending…" : "Retry email"}</button>}</ModalFooter>
    </Modal>
  </div>;
}
