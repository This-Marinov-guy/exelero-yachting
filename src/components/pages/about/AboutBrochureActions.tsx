"use client";

import { usePublicText } from "@/lib/usePublicText";
import { BROCHURE_DOWNLOAD_NAME, BROCHURE_URL } from "@/constants/brochure";
import { Download, Share2 } from "lucide-react";
import { useState } from "react";

export default function AboutBrochureActions() {
  const tr = usePublicText();
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function shareBrochure() {
    if (sharing) return;
    const url = new URL(BROCHURE_URL, window.location.origin).href;
    setSharing(true);
    setStatus(tr("Opening share options…"));
    setManualUrl("");

    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: tr("Exelero Yachting Company Profile"), url });
          setStatus(tr("Brochure shared."));
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            setStatus("");
            return;
          }
        }
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus(tr("Brochure link copied."));
      } else {
        setManualUrl(url);
        setStatus(tr("Copy the brochure link below."));
      }
    } catch {
      setManualUrl(url);
      setStatus(tr("Copy the brochure link below."));
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="about-guarantee__controls">
      <div className="about-guarantee__actions">
        <a href={BROCHURE_URL} download={BROCHURE_DOWNLOAD_NAME} className="about-guarantee__download">
          <Download size={18} aria-hidden="true" />{tr("Download brochure")}</a>
        <button type="button" className="about-guarantee__share" onClick={shareBrochure} disabled={sharing}>
          <Share2 size={18} aria-hidden="true" />
          {sharing ? tr("Sharing…") : tr("Share brochure")}
        </button>
      </div>
      <p className="about-guarantee__status" role="status" aria-live="polite">{status}</p>
      {manualUrl && (
        <label className="about-guarantee__manual-link">{tr("Brochure link")}<input type="text" readOnly value={manualUrl} onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}
    </div>
  );
}
