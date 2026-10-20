"use client";
import React from "react";
import Link from "@/components/commonComponents/LocalizedLink";
import { usePublicText } from "@/lib/usePublicText";
import { Container } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { RouteList } from "@/utils/RouteList";
import { getImageProps } from "next/image";
import { useEffect, useState } from "react";

const MAX_720_SCALE = 1.15;
const VIDEO_MOBILE = "/assets/video/hero/spring-sailing-mobile.m4v";
const VIDEO_720 = "/assets/video/hero/spring-sailing-720.m4v";
const VIDEO_1080 = "/assets/video/hero/spring-sailing-1080.m4v";

const HomeHeroSection = () => {
  const t = usePublicText();
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [playingSource, setPlayingSource] = useState<string | null>(null);
  const { props: desktopImage } = getImageProps({
    src: "/assets/images/breadcrumbs/x-yachts.jpg",
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 82,
    loading: "eager",
    fetchPriority: "high",
    className: "home-hero-image",
  });
  const { props: mobileImage } = getImageProps({
    src: "/assets/images/hero/x-yachts.jpg",
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 82,
  });

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    }).connection;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateVideo = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const scale720 = Math.max(
        (window.innerWidth * pixelRatio) / 1280,
        (window.innerHeight * pixelRatio) / 720
      );
      const skipVideo = motionQuery.matches || connection?.saveData;
      const source = skipVideo
        ? null
        : window.innerHeight > window.innerWidth
          ? VIDEO_MOBILE
          : window.innerWidth < 1024 || scale720 <= MAX_720_SCALE
            ? VIDEO_720
            : VIDEO_1080;

      setVideoSource(source);
    };

    updateVideo();
    window.addEventListener("resize", updateVideo);
    motionQuery.addEventListener("change", updateVideo);
    connection?.addEventListener?.("change", updateVideo);
    return () => {
      window.removeEventListener("resize", updateVideo);
      motionQuery.removeEventListener("change", updateVideo);
      connection?.removeEventListener?.("change", updateVideo);
    };
  }, []);

  const hideVideo = (source: string) => {
    setPlayingSource((current) => (current === source ? null : current));
  };

  return (
    <section className="exelero-home-hero">
      <div className="home-hero-bg" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileImage.srcSet} sizes="100vw" />
          <img {...desktopImage} />
        </picture>
        {videoSource && (
          <video
            key={videoSource}
            className={`home-hero-video${playingSource === videoSource ? " is-playing" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setPlayingSource(videoSource)}
            onWaiting={() => hideVideo(videoSource)}
            onPause={() => hideVideo(videoSource)}
            onError={() => hideVideo(videoSource)}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        )}
        <div className="home-hero-overlay" />
      </div>

      <div className="home-hero-content">
        <Container>
          <div className="home-hero-text" data-aos="fade-up" data-aos-duration={600}>
            {/* <p className="home-hero-eyebrow">Exelero Group</p> */}
            <h1 className="home-hero-title">{t("Performance & Luxury Yachts")}</h1>
            <p className="home-hero-subtitle">
              {t("New yachts, Brokerage and marine services")}
            </p>
          </div>
        </Container>

        <div className="home-hero-bottom">
          <Link href={RouteList.Pages.Boats} className="home-hero-btn">
            {t("Browse Boats")} <ArrowRight size={18} />
          </Link>

          <div className="home-hero-scroll" aria-hidden="true">
            <div className="hero-scroll-mouse">
              <div className="hero-scroll-wheel" />
            </div>
            <span className="hero-scroll-label">{t("Scroll")}</span>
          </div>

          <Link href={RouteList.Pages.Other.ContactUs1} className="home-hero-btn">
            {t("Get in Touch")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
