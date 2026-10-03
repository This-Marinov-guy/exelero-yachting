"use client";
import React from "react";
import Link from "next/link";
import { Container } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import { useEffect, useState } from "react";

const HomeHeroSection = () => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const prefersStillImage = window.matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersStillImage || connection?.saveData || /(?:slow-)?2g/.test(connection?.effectiveType || "")) {
      return;
    }

    const timeout = window.setTimeout(() => setLoadVideo(true), 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="exelero-home-hero">
      <div className="home-hero-bg" aria-hidden="true">
        <Image
          src="/assets/images/hero/x-yachts.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="home-hero-image"
        />
        {loadVideo && (
          <video
            className={`home-hero-video${videoPlaying ? " is-playing" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setVideoPlaying(true)}
          >
            <source src="/assets/video/hero/performance.m4v" type="video/mp4" />
          </video>
        )}
        <div className="home-hero-overlay" />
      </div>

      <div className="home-hero-content">
        <Container>
          <div className="home-hero-text" data-aos="fade-up" data-aos-duration={600}>
            {/* <p className="home-hero-eyebrow">Exelero Group</p> */}
            <h1 className="home-hero-title">Performance &amp; Luxury Yachts</h1>
            <p className="home-hero-subtitle">
              Yachts, brokerage, charters, and marine services for clients across Southeast Europe.
            </p>
          </div>
        </Container>

        <div className="home-hero-bottom">
          <Link href={RouteList.Pages.Boats} className="home-hero-btn">
            Browse Boats <ArrowRight size={18} />
          </Link>

          <div className="home-hero-scroll" aria-hidden="true">
            <div className="hero-scroll-mouse">
              <div className="hero-scroll-wheel" />
            </div>
            <span className="hero-scroll-label">Scroll</span>
          </div>

          <Link href={RouteList.Pages.Other.ContactUs1} className="home-hero-btn">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
