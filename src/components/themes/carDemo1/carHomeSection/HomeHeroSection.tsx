"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { ArrowRight } from "lucide-react";
import { RouteList } from "@/utils/RouteList";

const HomeHeroSection = () => {
  return (
    <section className="exelero-home-hero">
      <div className="home-hero-bg" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/images/hero/x-yachts.jpg"
          className="home-hero-video"
        >
          <source src="/assets/video/hero/performance.m4v" type="video/mp4" />
        </video>
        <div className="home-hero-overlay" />
      </div>

      <div className="home-hero-content">
        <Container>
          <div className="home-hero-text" data-aos="fade-up" data-aos-duration={600}>
            {/* <p className="home-hero-eyebrow">Exelero Group</p> */}
            <h1 className="home-hero-title">Performance &amp; Luxury Yachts</h1>
            <p className="home-hero-subtitle">
              Exclusive dealers for X‑Yachts and Omaya Yachts. Brokerage, charters, and sailing gear — all under one roof.
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
