"use client";

import { Col, Container, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";

const FORM_ID = "charter-form";

export default function CharterRequestSection() {
  const formRef = useRef<HTMLElement>(null);
  const [formInView, setFormInView] = useState(false);

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
      </div>

      {/* Form section */}
      <section
        id={FORM_ID}
        ref={formRef}
        className="charter-form-section section-b-space"
      >
        <Container>
          <div className="charter-form-wrapper">
            <h2 className="charter-form__title">Request a Charter</h2>
            <p className="charter-form__subtitle">
              Fill in the form below and we’ll get back to you with options.
            </p>
            <form className="charter-form">
              <Row className="g-3">
                <Col md={6}>
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-input">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Preferred dates"
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Group size"
                      disabled
                    />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="form-input">
                    <textarea
                      className="form-control"
                      placeholder="Tell us about your trip (destination, duration, type of boat…)"
                      rows={4}
                      disabled
                    />
                  </div>
                </Col>
                <Col xs={12}>
                  <button type="submit" className="btn-solid" disabled>
                    Send request (mock)
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
