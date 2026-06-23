"use client";

import { Col, Container, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

const FORM_ID = "charter-form";
const INFORMATION_ID = "charter-information";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  type: "",
  dateFrom: "",
  dateTo: "",
  groupSize: "",
  note: "",
};

export default function CharterRequestSection() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "dateFrom" | "dateTo", date: Date | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().slice(0, 10) : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const { name, email, type, dateFrom, dateTo, groupSize } = form;

    if (!name.trim() || !email.trim() || !type || !dateFrom || !dateTo || !groupSize) {
      toast.error("Please fill in all required fields (name, email, type, dates, group size).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const groupSizeNum = Number(groupSize);
    if (!Number.isFinite(groupSizeNum) || groupSizeNum <= 0) {
      toast.error("Group size must be a positive number.");
      return;
    }

    try {
      setSubmitting(true);
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("charter_requests").insert({
        name: name.trim(),
        email: email.trim(),
        phone: form.phone.trim() || null,
        charter_type: type,
        date_from: dateFrom,
        date_to: dateTo,
        group_size: groupSizeNum,
        note: form.note.trim() || null,
      });

      if (error) {
        toast.error(error.message || "Failed to send charter request. Please try again.");
        return;
      }

      // Notify exelerodev@gmail.com (fire-and-forget)
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "charter",
          data: {
            name: name.trim(),
            email: email.trim(),
            phone: form.phone.trim() || null,
            charter_type: type,
            date_from: dateFrom,
            date_to: dateTo,
            group_size: groupSizeNum,
            note: form.note.trim() || null,
          },
        }),
      }).catch(() => {});

      toast.success("Charter request sent successfully! We’ll get back to you soon.");
      setForm(initialFormState);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send charter request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky CTA: visible only when form is not in view */}
      <div
        className="charter-request-cta charter-request-cta--sticky"
        aria-hidden={!showStickyBtn}
        style={{
          opacity: showStickyBtn ? 1 : 0,
          pointerEvents: showStickyBtn ? "auto" : "none",
        }}
      >
        <a href={`#${FORM_ID}`} className="btn-solid charter-request-cta__btn">
          Request a Charter
        </a>
        <a href={`#${INFORMATION_ID}`} className="charter-request-cta__learn">
          Learn more
        </a>
      </div>

      {/* Form section */}
      <section
        id={FORM_ID}
        ref={formRef}
        className="charter-form-section section-b-space"
      >
        <Container>
          <div className="charter-form-wrapper">
            <h2 className="charter-form__title text-center">Request a Charter</h2>
            <p className="charter-form__subtitle text-center">
              Fill in the form below and we’ll get back to you with options.
            </p>
            <form className="charter-form" onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <div className="form-input">
                    <label htmlFor="charter-name" className="form-label">
                      Your name
                    </label>
                    <input
                      id="charter-name"
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
                    <label htmlFor="charter-email" className="form-label">
                      Email
                    </label>
                    <input
                      id="charter-email"
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
                    <label htmlFor="charter-phone" className="form-label">
                      Phone (optional)
                    </label>
                    <input
                      id="charter-phone"
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
                    <label htmlFor="charter-type" className="form-label">
                      Type of boat
                    </label>
                    <select
                      id="charter-type"
                      className="form-control"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="cruiser">Cruiser</option>
                      <option value="power_boat">Power boat</option>
                      <option value="racer">Racer</option>
                      <option value="yacht">Yacht</option>
                    </select>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-input">
                    <label className="form-label">Date from</label>
                    <DatePicker
                      selected={form.dateFrom ? new Date(form.dateFrom) : null}
                      onChange={(date) => handleDateChange("dateFrom", date as Date | null)}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-input">
                    <label className="form-label">Date to</label>
                    <DatePicker
                      selected={form.dateTo ? new Date(form.dateTo) : null}
                      onChange={(date) => handleDateChange("dateTo", date as Date | null)}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      minDate={form.dateFrom ? new Date(form.dateFrom) : undefined}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-input">
                    <label htmlFor="charter-group-size" className="form-label">
                      Group size
                    </label>
                    <input
                      id="charter-group-size"
                      type="number"
                      className="form-control"
                      name="groupSize"
                      value={form.groupSize}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="form-input">
                    <label htmlFor="charter-note" className="form-label">
                      Note to agent
                    </label>
                    <textarea
                      id="charter-note"
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
        </Container>
      </section>
    </>
  );
}
