"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { inquiryExtraFields, validateInquiry } from "@/lib/inquiryValidation";
import type { PartnerFormField } from "@/types/Partner";
import styles from "./InquiryForm.module.scss";

type Props = { endpoint: string; subject: string; fields?: PartnerFormField[] };

export default function InquiryForm({ endpoint, subject, fields = [] }: Props) {
  const prefix = useId();
  const busy = useRef(false);
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [invalidField, setInvalidField] = useState<string>();
  const [messageLength, setMessageLength] = useState(0);
  const [confirmation, setConfirmation] = useState<string>();
  const extras = inquiryExtraFields(fields);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const validation = validateInquiry(values, extras);
    if (!validation.data) {
      setInvalidField(validation.field);
      toast.error(validation.error);
      (form.elements.namedItem(validation.field) as HTMLElement | null)?.focus();
      return;
    }
    const fingerprint = JSON.stringify({ endpoint, ...values });
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
    busy.current = true;
    setSending(true);
    setInvalidField(undefined);
    setConfirmation(undefined);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, request_id: attempt.current.id }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.error || "We couldn't send your inquiry. Please try again.");
      form.reset();
      attempt.current = null;
      setMessageLength(0);
      const message = result.notification === "pending"
        ? "Your inquiry has been received. Our team can see it, though the email notification is delayed."
        : "Thank you. Your inquiry has been sent to our team.";
      setConfirmation(message);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error && !(error instanceof TypeError) ? error.message : "We couldn't send your inquiry. Check your connection and try again.");
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  const control = (name: string) => ({ id: `${prefix}-${name}`, name, "aria-invalid": invalidField === name || undefined });
  return <form className={styles.form} aria-label={`Contact about ${subject}`} aria-busy={sending} noValidate onSubmit={submit} onInput={() => { setInvalidField(undefined); setConfirmation(undefined); }}>
    <fieldset disabled={sending}>
      <legend className="visually-hidden">Your contact details and message</legend>
      <div className={styles.field}><label htmlFor={`${prefix}-name`}>Name</label><input {...control("name")} type="text" autoComplete="name" required maxLength={120} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-email`}>Email</label><input {...control("email")} type="email" inputMode="email" autoComplete="email" required maxLength={254} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-phone`}>Phone <span>(optional)</span></label><input {...control("phone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={50} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-message`}>Message</label><textarea {...control("message")} required rows={3} maxLength={3000} onChange={event => setMessageLength(event.target.value.length)} aria-describedby={messageLength >= 2700 ? `${prefix}-count` : undefined} />{messageLength >= 2700 && <small id={`${prefix}-count`}>{messageLength.toLocaleString()} / 3,000 characters</small>}</div>
      <div className={styles.honeypot} aria-hidden="true"><label htmlFor={`${prefix}-website`}>Website</label><input id={`${prefix}-website`} name="website_check" tabIndex={-1} autoComplete="off" /></div>
      {extras.length > 0 && <div className={styles.extras}>{extras.map(field => <div className={styles.field} key={field.id}>
        <label htmlFor={`${prefix}-${field.id}`}>{field.label}{!field.required && <span> (optional)</span>}</label>
        {field.type === "textarea" ? <textarea {...control(field.id)} required={field.required} maxLength={3000} rows={3} /> : field.type === "select" ? <select {...control(field.id)} required={field.required}><option value="">Choose an option</option>{field.options?.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input {...control(field.id)} type={field.type} required={field.required} maxLength={300} autoComplete={field.type === "tel" ? "tel" : "off"} />}
      </div>)}</div>}
    </fieldset>
    <button type="submit" className={styles.submit} disabled={sending}>{sending && <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />}{sending ? "Sending…" : "Send inquiry"}</button>
    {confirmation && <p className={styles.confirmation} role="status">{confirmation}</p>}
  </form>;
}
