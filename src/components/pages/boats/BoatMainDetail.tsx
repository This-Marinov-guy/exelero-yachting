"use client";
import { FC, useState } from "react";
import { ProductType } from "@/types/Product";
import Link from "next/link";
import { Href } from "@/constants";
import ShareModal from "@/components/commonComponents/productDetail/mainDetail/ShareModal";
import { useAppDispatch } from "@/redux/hooks";
import { setShareModal, setShareData } from "@/redux/reducers/LayoutSlice";
import { Share2, FileDown, Bookmark, MapPin } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { trackClarityEvent } from "@/lib/clarity";
import { usePublicText } from "@/lib/usePublicText";
import { usePublicLocale } from "@/app/i18n/i18n-context";

interface BoatMainDetailProps {
  boat: ProductType;
}

const BoatMainDetail: FC<BoatMainDetailProps> = ({ boat }) => {
  const tr = usePublicText();
  const locale = usePublicLocale();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [saveBoat, setSaveBoat] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const boatTypeLabel = boat.boatType
    ? tr(boat.boatType === "racer" ? "Racer" : boat.boatType === "cruiser" ? "Cruiser" : boat.boatType)
    : null;
  const conditionLabel = boat.condition
    ? tr(boat.condition === "new" ? "New" : boat.condition === "pre-owned" ? "Pre-owned" : boat.condition)
    : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainImage = boat.image?.[0] ?? "";
    const priceStr = boat.price != null ? `${formatPrice(boat.price)} €` : tr("Price upon inquiry");
    const descriptionParts = [boat.location, conditionLabel, boatTypeLabel, priceStr].filter(Boolean);
    dispatch(
      setShareData({
        title: boat.title || tr("Boat listing"),
        description: descriptionParts.join(" · "),
        imageUrl: mainImage,
      })
    );
    dispatch(setShareModal());
  };

  const handleDownloadPdf = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      toast.message(tr("Generating PDF…"));

      const [{ pdf }, { default: BoatListingPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pages/boats/BoatListingPdfDocument"),
      ]);
      const baseUrl = window.location.origin;
      const blob = await pdf(<BoatListingPdfDocument boat={boat} baseUrl={baseUrl} locale={locale} />).toBlob();

      const safeTitle = (boat.title || "boat-listing").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
      const filename = `${safeTitle || "boat-listing"}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success(tr("PDF downloaded."));
      trackClarityEvent("boat_pdf_downloaded");
    } catch (err: any) {
      toast.error(err?.message || tr("Failed to generate PDF. Please try again."));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const newSaveState = !saveBoat;
    setSaveBoat(newSaveState);
    if (newSaveState) {
      toast.success(tr("Boat saved to favorites"));
    } else {
      toast.success(tr("Boat removed from favorites"));
    }
  };

  return (
    <div className="property-detail-main">
      <div className="main-detail-flex">
        <div className="boat-detail-overview">
          <p className="boat-detail-location">
            <MapPin aria-hidden="true" />
            <span>{boat.location || tr("Location TBD")}</span>
          </p>
          {(boatTypeLabel || conditionLabel || boat.manufacturer) && (
            <div className="boat-detail-badges">
              {boatTypeLabel && (
                <span className="boat-detail-badge" title={boatTypeLabel}>
                  {boatTypeLabel}
                </span>
              )}
              {conditionLabel && (
                <span className="boat-detail-badge" title={conditionLabel}>
                  {conditionLabel}
                </span>
              )}
              {boat.manufacturer && (
                <span className="boat-detail-badge" title={boat.manufacturer}>{boat.manufacturer}</span>
              )}
            </div>
          )}
        </div>
        <div className="price-box">
          <h4>
            {boat.price != null ? (
              <>
                {formatPrice(boat.price)} <span style={{ fontFamily: "Satisfy", color: 'black' }}>€</span>
              </>
            ) : tr("Price upon inquiry")}
            {boat.vatIncluded && <span className="text-muted" style={{ fontSize: "14px" }}> ({tr("VAT Included")})</span>}
          </h4>
          <ul className="detail-social-list">
            <li>
              <Link scroll={false} href={Href} onClick={handleShare}>
                <Share2 className="h-5 w-5" />
                {tr("Share")}
              </Link>
            </li>
            <li>
              <Link scroll={false} href={Href} className="print-button" onClick={handleDownloadPdf} aria-disabled={isGeneratingPdf}>
                <FileDown className="h-5 w-5" />
                {isGeneratingPdf ? tr("Generating PDF…") : tr("Download PDF")}
              </Link>
            </li>
            {/* <li>
              <Link
                scroll={false}
                href={Href}
                className={`${saveBoat ? "clicked" : ""} add-to-fav`}
                onClick={handleSave}
              >
                <Bookmark className={`h-5 w-5 ${saveBoat ? 'fill-current' : ''}`} />
                Save
              </Link>
            </li> */}
          </ul>
        </div>
        <ShareModal />
      </div>
    </div>
  );
};

export default BoatMainDetail;
