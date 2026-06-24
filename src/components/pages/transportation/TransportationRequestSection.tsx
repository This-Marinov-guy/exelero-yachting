"use client";

import { Col, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

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
  const formRef = useRef<HTMLElement>(null);
  const [formInView, setFormInView] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

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
    setForm((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().slice(0, 10) : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const { name, email, dateStart, deadlineDate, startPoint, endPoint } = form;

    if (!name.trim() || !email.trim() || !dateStart || !deadlineDate || !startPoint.trim() || !endPoint.trim()) {
      toast.error("Please fill in all required fields (name, email, dates, start and end points).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
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
        toast.error(error.message || "Failed to send transportation request. Please try again.");
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

      toast.success("Transportation request sent successfully! We'll get back to you with options.");
      setForm(initialFormState);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send transportation request. Please try again.");
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
        <a href={`#${FORM_ID}`} className="btn-solid text-center transportation-request-cta__btn">
          Request Transportation
        </a>
      </div>

      {/* Form */}
      <section
        id={FORM_ID}
        ref={formRef}
        className="transportation-form-section"
      >
        <div className="transportation-form-wrapper">
          <h2 className="transportation-form__title text-center">Request Transportation</h2>
          <p className="transportation-form__subtitle text-center">
            Fill in the form below and we'll get back to you with options and a quote.
          </p>
          <form className="transportation-form" onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-name" className="form-label">
                    Your name
                  </label>
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
                  <label htmlFor="transport-email" className="form-label">
                    Email
                  </label>
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
                  <label htmlFor="transport-phone" className="form-label">
                    Phone (optional)
                  </label>
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
                  <label className="form-label">Start date</label>
                  <DatePicker
                    selected={form.dateStart ? new Date(form.dateStart) : null}
                    onChange={(date) => handleDateChange("dateStart", date as Date | null)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label className="form-label">Deadline date</label>
                  <DatePicker
                    selected={form.deadlineDate ? new Date(form.deadlineDate) : null}
                    onChange={(date) => handleDateChange("deadlineDate", date as Date | null)}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={form.dateStart ? new Date(form.dateStart) : undefined}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-input">
                  <label htmlFor="transport-start-point" className="form-label">
                    Start point
                  </label>
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
                  <label htmlFor="transport-end-point" className="form-label">
                    End point
                  </label>
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
                  <label htmlFor="transport-weight" className="form-label">
                    Boat weight (kg)
                  </label>
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
                  <label htmlFor="transport-length" className="form-label">
                    Length overall (m)
                  </label>
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
                  <label htmlFor="transport-beam" className="form-label">
                    Beam (m)
                  </label>
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
                  <label htmlFor="transport-draft" className="form-label">
                    Draft (m)
                  </label>
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
                  <label htmlFor="transport-height" className="form-label">
                    Overall height keel to top (m)
                  </label>
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
                  <label htmlFor="transport-note" className="form-label">
                    Note to agent
                  </label>
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
                  {submitting ? "Sending..." : "Send request"}
                </button>
              </Col>
            </Row>
          </form>
        </div>
      </section>
    </>
  );
}
