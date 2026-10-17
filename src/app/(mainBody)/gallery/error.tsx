"use client";

import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import Link from "@/components/commonComponents/LocalizedLink";
import { usePublicText } from "@/lib/usePublicText";
import { RouteList } from "@/utils/RouteList";
import { Container } from "reactstrap";
import styles from "@/components/pages/gallery/GalleryPage.module.scss";

export default function GalleryError({ reset }: { error: Error; reset: () => void }) {
  const tr = usePublicText();
  return <>
    <Breadcrumbs title={tr("Gallery")} headingLevel={1} url={RouteList.Home.CarDemo1} mainClass="page-breadcrumbs-section" image />
    <section className={styles.section}>
      <Container>
        <div className={styles.emptyState} role="alert">
          <h2>{tr("Gallery is unavailable right now")}</h2>
          <p>{tr("Please try again or browse available yachts.")}</p>
          <div className={styles.errorActions}>
            <button type="button" className={styles.browseLink} onClick={reset}>{tr("Try again")}</button>
            <Link href={RouteList.Pages.Services.Boats} className={styles.backButton}>{tr("Browse yachts for sale")}</Link>
          </div>
        </div>
      </Container>
    </section>
  </>;
}
