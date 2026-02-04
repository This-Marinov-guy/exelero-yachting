"use client";

import { Col, Container, Row } from "reactstrap";
import { useEffect, useRef, useState } from "react";

const FORM_ID = "transportation-form";

export default function TransportationRequestSection() {
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
        className="transportation-request-cta transportation-request-cta--sticky"
        aria-hidden={!showStickyBtn}
        style={{
          opacity: showStickyBtn ? 1 : 0,
          pointerEvents: showStickyBtn ? "auto" : "none",
        }}
      >
        <a href={`#${FORM_ID}`} className="btn-solid transportation-request-cta__btn">
          Request Transportation
        </a>
      </div>

      {/* Form section */}
      <section
        id={FORM_ID}
        ref={formRef}
        className="transportation-form-section section-b-space"
      >
        <Container>
          <div className="transportation-form-wrapper mt-5">
            <h2 className="transportation-form__title">Request Transportation</h2>
            <p className="transportation-form__subtitle">
              Fill in the form below and we’ll get back to you with options and a quote.
            </p>
            <form className="transportation-form">
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
                      placeholder="Pick-up location"
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Destination"
                      disabled
                    />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="form-input">
                    <textarea
                      className="form-control"
                      placeholder="Tell us about your boat (length, type) and preferred timeline…"
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
