"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { RouteList } from "@/utils/RouteList";

const StickyFooterBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  return (
    <div className={`sticky-footer-bar${visible ? " sticky-footer-bar--visible" : ""}`} aria-hidden={!visible}>
      <div className="sticky-footer-bar__inner">
        <p className="sticky-footer-bar__tagline">
          Ready to find your perfect yacht?
        </p>
        <div className="sticky-footer-bar__actions">
          <Link href={RouteList.Pages.Boats} className="sticky-footer-bar__btn sticky-footer-bar__btn--primary">
            Browse Listings <ArrowRight size={16} />
          </Link>
          <Link href={RouteList.Pages.Other.ContactUs1} className="sticky-footer-bar__btn sticky-footer-bar__btn--outline">
            Contact Us
          </Link>
        </div>
      </div>
      <button className="sticky-footer-bar__close" onClick={dismiss} aria-label="Dismiss">
        <X size={18} />
      </button>
    </div>
  );
};

export default StickyFooterBar;
