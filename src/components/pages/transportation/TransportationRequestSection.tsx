"use client";

import { usePublicError, usePublicText } from "@/lib/usePublicText";
import { Col, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { format, parseISO, startOfDay } from "date-fns";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { trackClarityEvent } from "@/lib/clarity";
import BookingCalendarHeader, { bookingCalendarDayClassName } from "@/components/commonComponents/BookingCalendarHeader";

const FORM_ID = "transportation-form";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  dateStart: "",
  deadlineDate: "",
  startPoint: "",
  endPoint: "",
  weight: "",
  length: "",
  beam: "",
  draft: "",
  height: "",
  note: "",
};

export default function TransportationRequestSection() {
  const tr = usePublicText();
  const localError = usePublicError();
  const formRef = useRef<HTMLElement>(null);
  const [formInView, setFormInView] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const today = startOfDay(new Date());
  const minDeadlineDate = form.dateStart ? parseISO(form.dateStart) : undefined;

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showStickyBtn = !formInView;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "dateStart" | "deadlineDate", date: Date | null) => {
    const value = date ? format(date, "yyyy-MM-dd") : "";
    setForm((prev) => field === "dateStart"
      ? { ...prev, dateStart: value, deadlineDate: value && prev.deadlineDate < value ? "" : prev.deadlineDate }
      : { ...prev, deadlineDate: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const { name, email, dateStart, deadlineDate, startPoint, endPoint } = form;

    if (!name.trim() || !email.trim() || !dateStart || !deadlineDate || !startPoint.trim() || !endPoint.trim()) {
      toast.error(tr("Please fill in all required fields (name, email, dates, start and end points)."));
      return;
    }

    if (dateStart < format(new Date(), "yyyy-MM-dd")) {
      toast.error(tr("Choose today or a later start date."));
      return;
    }

    if (deadlineDate < dateStart) {
      toast.error(tr("Deadline date must be on or after the start date."));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error(tr("Please enter a valid email address."));
      return;
    }

    const toNumberOrNull = (value: string) => {
      const num = Number(value);
      return value.trim() && Number.isFinite(num) ? num : null;
    };

    try {
      setSubmitting(true);
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("transportation_requests").insert({
        name: name.trim(),
        email: email.trim(),
        phone: form.phone.trim() || null,
        date_start: dateStart,
        deadline_date: deadlineDate,
        start_point: startPoint.trim(),
        end_point: endPoint.trim(),
        boat_weight_kg: toNumberOrNull(form.weight),
        boat_length_m: toNumberOrNull(form.length),
        boat_beam_m: toNumberOrNull(form.beam),
        boat_draft_m: toNumberOrNull(form.draft),
        boat_height_m: toNumberOrNull(form.height),
        note: form.note.trim() || null,
      });

      if (error) {
        toast.error(error.message ? localError(error.message, "Failed to send transportation request. Please try again.") : tr("Failed to send transportation request. Please try again."));
        return;
      }

      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "transportation",
          data: {
            name: name.trim(),
            email: email.trim(),
            phone: form.phone.trim() || null,
            date_start: dateStart,
            deadline_date: deadlineDate,
            start_point: startPoint.trim(),
            end_point: endPoint.trim(),
            boat_weight_kg: toNumberOrNull(form.weight),
            boat_length_m: toNumberOrNull(form.length),
            boat_beam_m: toNumberOrNull(form.beam),
            boat_draft_m: toNumberOrNull(form.draft),
            boat_height_m: toNumberOrNull(form.height),
            note: form.note.trim() || null,
          },
        }),
      }).catch(() => {});

      toast.success(tr("Transportation request sent successfully! We'll get back to you with options."));
      trackClarityEvent("transport_request_submitted");
      setForm(initialFormState);
    } catch (err: any) {
      toast.error(err?.message ? localError(err.message, "Failed to send transportation request. Please try again.") : tr("Failed to send transportation request. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky CTA: mobile only, visible when form is not in view */}
      <div
        className="transportation-request-cta transportation-request-cta--sticky"
        aria-hidden={!showStickyBtn}
        style={{
          opacity: showStickyBtn ? 1 : 0,
          pointerEvents: showStickyBtn ? "auto" : "none",
        }}
      >
        <a href={`#${FORM_ID}`} className="btn-solid text-center transportation-request-cta__btn">{tr("Request Yacht Transportation")}</a>
      </div>

      {/* Form */}
      <section
        id={FORM_ID}
        ref={formRef}
        className="transportation-form-section"
      >
        <div className="transportation-form-wrapper">
          <h2 className="transportation-form__title text-center">{tr("Request Yacht Transportation")}</h2>
          <p className="transportation-form__subtitle text-center">{tr("Fill in the form below and we'll get back to you with options and a quote.")}</p>
          <form className="transportation-form" onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-name" className="form-label">{tr("Your name")}</label>
                  <input
                    id="transport-name"
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-email" className="form-label">{tr("Email")}</label>
                  <input
                    id="transport-email"
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-phone" className="form-label">{tr("Phone (optional)")}</label>
                  <input
                    id="transport-phone"
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-date-start" className="form-label">{tr("Start date")}</label>
                  <DatePicker
                    id="transport-date-start"
                    selected={form.dateStart ? parseISO(form.dateStart) : null}
                    onChange={(date) => handleDateChange("dateStart", date as Date | null)}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                    minDate={today}
                    calendarStartDay={1}
                    calendarClassName="booking-calendar"
                    dayClassName={bookingCalendarDayClassName}
                    renderCustomHeader={(props) => <BookingCalendarHeader {...props} minDate={today} />}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-deadline-date" className="form-label">{tr("Deadline date")}</label>
                  <DatePicker
                    id="transport-deadline-date"
                    selected={form.deadlineDate ? parseISO(form.deadlineDate) : null}
                    onChange={(date) => handleDateChange("deadlineDate", date as Date | null)}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                    minDate={minDeadlineDate}
                    calendarStartDay={1}
                    calendarClassName="booking-calendar"
                    dayClassName={bookingCalendarDayClassName}
                    renderCustomHeader={(props) => <BookingCalendarHeader {...props} minDate={minDeadlineDate} />}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-start-point" className="form-label">{tr("Start point")}</label>
                  <input
                    id="transport-start-point"
                    type="text"
                    className="form-control"
                    name="startPoint"
                    value={form.startPoint}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-end-point" className="form-label">{tr("End point")}</label>
                  <input
                    id="transport-end-point"
                    type="text"
                    className="form-control"
                    name="endPoint"
                    value={form.endPoint}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-weight" className="form-label">{tr("Boat weight (kg)")}</label>
                  <input
                    id="transport-weight"
                    type="number"
                    className="form-control"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-length" className="form-label">{tr("Length overall (m)")}</label>
                  <input
                    id="transport-length"
                    type="number"
                    className="form-control"
                    name="length"
                    value={form.length}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-beam" className="form-label">{tr("Beam (m)")}</label>
                  <input
                    id="transport-beam"
                    type="number"
                    className="form-control"
                    name="beam"
                    value={form.beam}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-draft" className="form-label">{tr("Draft (m)")}</label>
                  <input
                    id="transport-draft"
                    type="number"
                    className="form-control"
                    name="draft"
                    value={form.draft}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-height" className="form-label">{tr("Overall height keel to top (m)")}</label>
                  <input
                    id="transport-height"
                    type="number"
                    className="form-control"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                  />
                </div>
              </Col>
              <Col xs={12}>
                <div className="form-input">
                  <label htmlFor="transport-note" className="form-label">{tr("Note to agent")}</label>
                  <textarea
                    id="transport-note"
                    className="form-control"
                    rows={4}
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col xs={12} className="form-submit-col">
                <button type="submit" className="btn-solid px-2" disabled={submitting}>
                  {submitting ? tr("Sending...") : tr("Send request")}
                </button>
              </Col>
            </Row>
          </form>
        </div>
      </section>
    </>
  );
}
