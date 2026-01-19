"use client";
import { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";

const COOKIE_CONSENT_KEY = "excelero_cookie_consent";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = (acceptAll: boolean) => {
    const consent = {
      mandatory: true,
      all: acceptAll,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <Container>
        <div className="cookie-banner-content">
          <div className="cookie-banner-text">
            <h5>Cookie Consent</h5>
            <p>
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies. You can also choose "Mandatory Only" 
              to accept only essential cookies.
            </p>
          </div>
          <div className="cookie-banner-buttons">
            <Button 
              className="btn-outline cookie-btn" 
              onClick={() => handleAccept(false)}
            >
              Mandatory Only
            </Button>
            <Button 
              className="btn-solid cookie-btn" 
              onClick={() => handleAccept(true)}
            >
              Accept All
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CookieBanner;
