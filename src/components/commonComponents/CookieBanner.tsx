"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Button, Container } from "reactstrap";
import {
  getAnalyticsConsent,
  getClarityPageType,
  isClarityProductionHost,
  isClarityPublicPath,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveAnalyticsConsent,
} from "@/lib/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "vekv1ut2zw";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const googleConfigured = Boolean(GA_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID));

type AnalyticsWindow = Window & { clarity?: (...args: unknown[]) => void };

export default function CookieBanner() {
  const pathname = usePathname() || "/";
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isProductionHost, setIsProductionHost] = useState(false);
  const essentialButtonRef = useRef<HTMLButtonElement>(null);
  const trackPage = isProductionHost && isClarityPublicPath(pathname) && consent === true;
  const trackGoogle = isProductionHost && consent === true && (isClarityPublicPath(pathname) || pathname === "/gallery" || pathname === "/pages/gallery") && googleConfigured;

  useEffect(() => {
    const saved = getAnalyticsConsent();
    setConsent(saved);
    setShowBanner(saved === null);
    setIsProductionHost(isClarityProductionHost());

    const openSettings = () => setShowBanner(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (showBanner) essentialButtonRef.current?.focus();
  }, [showBanner]);

  useEffect(() => {
    if (trackPage) {
      (window as AnalyticsWindow).clarity?.(
        "set",
        "page_type",
        getClarityPageType(pathname)
      );
    }
  }, [pathname, trackPage]);

  const choose = (allowAnalytics: boolean) => {
    const previouslyAllowed = consent === true;
    saveAnalyticsConsent(allowAnalytics);
    setConsent(allowAnalytics);
    setShowBanner(false);

    if (!allowAnalytics && previouslyAllowed) {
      const clarity = (window as AnalyticsWindow).clarity;
      clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      clarity?.("consent", false);
      window.location.reload();
    }
  };

  return (
    <>
      {trackPage && (
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          onReady={() => {
            (window as Window & { clarity?: (...args: unknown[]) => void }).clarity?.(
              "set",
              "page_type",
              getClarityPageType(pathname)
            );
          }}
        >
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"granted"});`}
        </Script>
      )}
      {trackGoogle && (
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','${GA_MEASUREMENT_ID}');var gaScript=document.createElement('script');gaScript.async=true;gaScript.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(gaScript);`}
        </Script>
      )}
      {showBanner && (
        <div className="cookie-banner" role="region" aria-label="Cookie settings">
          <Container>
            <div className="cookie-banner-content">
              <div className="cookie-banner-text">
                <h5>Cookie settings</h5>
                <p>
                  We use Microsoft Clarity{googleConfigured ? " and Google Analytics" : ""} to understand how visitors use this site.
                  Analytics runs only if you allow it. Essential site features work either way.
                </p>
              </div>
              <div className="cookie-banner-buttons">
                <Button
                  innerRef={essentialButtonRef}
                  className="btn-outline cookie-btn"
                  type="button"
                  onClick={() => choose(false)}
                >
                  Essential only
                </Button>
                <Button
                  className="btn-solid cookie-btn"
                  type="button"
                  onClick={() => choose(true)}
                >
                  Allow analytics
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
