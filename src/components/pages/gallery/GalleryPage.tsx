"use client";

import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import Link from "@/components/commonComponents/LocalizedLink";
import { usePublicText } from "@/lib/usePublicText";
import type { SoldYacht } from "@/lib/soldYachts";
import { listingImageThumbnailUrl, listingImageViewUrl } from "@/lib/listingImageUrl";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import styles from "./GalleryPage.module.scss";

type Props = { yachts: SoldYacht[] };

export default function GalleryPage({ yachts }: Props) {
  const tr = usePublicText();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedYacht = yachts.find((yacht) => yacht.id === selectedId);

  return <>
    <Breadcrumbs title={tr("Gallery")} headingLevel={1} url={RouteList.Home.CarDemo1} mainClass="page-breadcrumbs-section" image />
    <section className={styles.section} aria-label={tr("Sold yachts")}>
      <Container>
        {selectedYacht ? <>
          <button type="button" className={styles.backButton} onClick={() => setSelectedId(null)}>
            <i className="ri-arrow-left-line" aria-hidden="true" /> {tr("Back to gallery")}
          </button>
          <div className={styles.heading}>
            <div>
              <h2>{selectedYacht.title}</h2>
              <p>{[selectedYacht.manufacturer, selectedYacht.buildYear, selectedYacht.location].filter(Boolean).join(" · ")}</p>
            </div>
            <span className={styles.photoCount}>{tr("photos")} · {selectedYacht.images.length}</span>
          </div>
          <Gallery>
            <Row className="g-3">
              {selectedYacht.images.map((src, index) => <Col lg={4} md={6} key={`${src}-${index}`}>
                <Item original={listingImageViewUrl(src)} thumbnail={listingImageThumbnailUrl(src)} width={1200} height={800}>
                  {({ ref, open }) => <button
                    type="button"
                    ref={ref}
                    className={styles.photoButton}
                    onClick={open}
                    aria-label={`${tr("View photo")} ${index + 1}: ${selectedYacht.title}`}
                  >
                    <Image src={src} alt={`${selectedYacht.title}, ${tr("photo")} ${index + 1}`} fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw" quality={72} />
                    <span className={styles.zoomIcon} aria-hidden="true"><i className="ri-zoom-in-line" /></span>
                  </button>}
                </Item>
              </Col>)}
            </Row>
          </Gallery>
        </> : <>
          <div className={styles.heading}>
            <div>
              <h2>{tr("Sold yachts")}</h2>
              <p>{tr("Explore yachts sold by Exelero Yachting and browse photographs from completed sales.")}</p>
            </div>
          </div>
          {yachts.length ? <Row className="g-4">
            {yachts.map((yacht) => <Col lg={4} md={6} key={yacht.id}>
              <article className={`${styles.card} ${yacht.images.length ? "" : styles.staticCard}`}>
                <YachtCard yacht={yacht} />
                {yacht.images.length > 0 && <button
                  type="button"
                  className={styles.cardHitbox}
                  onClick={() => setSelectedId(yacht.id)}
                  aria-label={`${tr("View photos")}: ${yacht.title}`}
                />}
              </article>
            </Col>)}
          </Row> : <div className={styles.emptyState}>
            <h3>{tr("No sold yachts yet")}</h3>
            <Link href={RouteList.Pages.Services.Boats} className={styles.browseLink}>{tr("Browse yachts for sale")} <i className="ri-arrow-right-line" aria-hidden="true" /></Link>
          </div>}
        </>}
      </Container>
    </section>
  </>;
}

function YachtCard({ yacht }: { yacht: SoldYacht }) {
  const tr = usePublicText();
  return <>
    <div className={styles.cover}>
      <Image src={yacht.images[0] || "/assets/images/hero/boats.jpg"} alt={yacht.title} fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw" quality={72} />
      <span className={styles.soldBadge}>{tr("Sold")}</span>
    </div>
    <div className={styles.cardContent}>
      <h3>{yacht.title}</h3>
      <p>{[yacht.manufacturer, yacht.buildYear, yacht.location].filter(Boolean).join(" · ")}</p>
      <span className={styles.cardAction}>{yacht.images.length ? `${tr("View photos")} (${yacht.images.length})` : tr("Photos coming soon")} {yacht.images.length > 0 && <i className="ri-arrow-right-line" aria-hidden="true" />}</span>
    </div>
  </>;
}
