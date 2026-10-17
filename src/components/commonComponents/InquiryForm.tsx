"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { inquiryExtraFields, validateInquiry } from "@/lib/inquiryValidation";
import type { PartnerFormField } from "@/types/Partner";
import styles from "./InquiryForm.module.scss";
import { usePublicError, usePublicText } from "@/lib/usePublicText";

type Props = { endpoint: string; subject: string; fields?: PartnerFormField[]; displayFields?: PartnerFormField[] };

export default function InquiryForm({ endpoint, subject, fields = [], displayFields = [] }: Props) {
  const tr = usePublicText();
  const localError = usePublicError();
  const prefix = useId();
  const busy = useRef(false);
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [invalidField, setInvalidField] = useState<string>();
  const [messageLength, setMessageLength] = useState(0);
  const extras = inquiryExtraFields(fields);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const validation = validateInquiry(values, extras);
    if (!validation.data) {
      setInvalidField(validation.field);
      toast.error(localError(validation.error, "We couldn't send your inquiry. Please try again."));
      (form.elements.namedItem(validation.field) as HTMLElement | null)?.focus();
      return;
    }
    const fingerprint = JSON.stringify({ endpoint, ...values });
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
    busy.current = true;
    setSending(true);
    setInvalidField(undefined);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, request_id: attempt.current.id }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.error ? localError(result.error, "We couldn't send your inquiry. Please try again.") : tr("We couldn't send your inquiry. Please try again."));
      form.reset();
      attempt.current = null;
      setMessageLength(0);
      const message = tr("Thank you. Your inquiry has been received.");
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error && !(error instanceof TypeError) ? localError(error.message, "We couldn't send your inquiry. Please try again.") : tr("We couldn't send your inquiry. Check your connection and try again."));
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  const control = (name: string) => ({ id: `${prefix}-${name}`, name, "aria-invalid": invalidField === name || undefined });
  return <form className={styles.form} aria-label={`${tr("Contact about")} ${subject}`} aria-busy={sending} noValidate onSubmit={submit} onInput={() => setInvalidField(undefined)}>
    <fieldset disabled={sending}>
      <legend className="visually-hidden">{tr("Your contact details")}</legend>
      <div className={styles.field}><label htmlFor={`${prefix}-name`}>{tr("Name")}</label><input {...control("name")} type="text" autoComplete="name" required maxLength={120} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-email`}>{tr("Email")}</label><input {...control("email")} type="email" inputMode="email" autoComplete="email" required maxLength={254} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-phone`}>{tr("Phone")} <span>{tr("(optional)")}</span></label><input {...control("phone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={50} /></div>
      <div className={styles.field}><label htmlFor={`${prefix}-message`}>{tr("Message")} <span>{tr("(optional)")}</span></label><textarea {...control("message")} rows={3} maxLength={3000} onChange={event => setMessageLength(event.target.value.length)} aria-describedby={messageLength >= 2700 ? `${prefix}-count` : undefined} />{messageLength >= 2700 && <small id={`${prefix}-count`}>{messageLength.toLocaleString()} / 3,000 {tr("characters")}</small>}</div>
      <div className={styles.honeypot} aria-hidden="true"><label htmlFor={`${prefix}-website`}>Website</label><input id={`${prefix}-website`} name="website_check" tabIndex={-1} autoComplete="off" /></div>
      {extras.length > 0 && <div className={styles.extras}>{extras.map(field => <div className={styles.field} key={field.id}>
        <label htmlFor={`${prefix}-${field.id}`}>{displayFields.find((item) => item.id === field.id)?.label || field.label}{!field.required && <span> {tr("(optional)")}</span>}</label>
        {field.type === "textarea" ? <textarea {...control(field.id)} required={field.required} maxLength={3000} rows={3} /> : field.type === "select" ? <select {...control(field.id)} required={field.required}><option value="">{tr("Choose an option")}</option>{field.options?.map((option, index) => <option key={option} value={option}>{displayFields.find((item) => item.id === field.id)?.options?.[index] || option}</option>)}</select> : <input {...control(field.id)} type={field.type} required={field.required} maxLength={300} autoComplete={field.type === "tel" ? "tel" : "off"} />}
      </div>)}</div>}
    </fieldset>
    <button type="submit" className={styles.submit} disabled={sending}>{sending && <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />}{sending ? tr("Sending…") : tr("Send inquiry")}</button>
  </form>;
}
