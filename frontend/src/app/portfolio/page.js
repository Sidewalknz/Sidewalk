"use client";

import { useEffect, useRef, useState } from "react";
import base from "../page.module.css";
import styles from "./Portfolio.module.css";
import Section from "../../components/sections/Section";
import projects from "../../data/projects.json"; // { name, type, image }

// Newest entries live at the bottom of projects.json → show newest first
const ALL_PROJECTS = [...projects].reverse();

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "cases", label: "Case studies" },
  { id: "cta", label: "Contact" },
];

export default function PortfolioPage() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const sectionEls = Array.from(document.querySelectorAll(`.${base.section}`));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: 0.6 }
    );
    sectionEls.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Dot nav */}
      <nav className={base.dotWrap} aria-label="Section navigation">
        <ul className={base.dots}>
          {SECTIONS.map((s) => (
            <li key={s.id} className={base.dotItem}>
              <button
                type="button"
                aria-label={s.label}
                aria-current={active === s.id ? "true" : "false"}
                className={`${base.dot} ${active === s.id ? base.active : ""}`}
                onClick={() => handleClick(s.id)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Snap container */}
      <div ref={containerRef} className={base.snapContainer}>
        {/* HERO — split layout */}
        <Section id="hero" title="portfolio" className={`${base.portfolio} ${styles.hero}`}>
          <div className={base.splitInner}>
            <div className={base.splitText}>
              <h1 className={base.splitTitle}>made by sidewalk</h1>
              <p className={base.splitNote}>
                a collection of websites and brands we’ve designed, built, and launched with our clients.
              </p>
              <div className={base.actionsLeft}>
                <a className={base.primaryCta} href="/contact">start a project</a>
                <a className={base.secondaryCta} href="/services">see services</a>
              </div>
            </div>

            {/* Hero illustration (animated/static): keep non-lazy */}
            <img
              src="/images/portfolio-hero.webp"
              alt="hero illustration"
              className={base.splitImage}
              decoding="async"
            />
          </div>
        </Section>

        {/* CASE STUDIES — show ALL projects */}
        <Section id="cases" title="case studies" className={styles.cases}>
          <div className={base.whyGridOuter}>
            {/* Left: title + intro */}
            <div className={base.whyText}>
              <h2 className={base.whyTitle}>the full portfolio</h2>
              <p className={base.whyIntro}>
                from first ideas to final launch, here’s how we help businesses grow online.
              </p>
            </div>

            {/* Right: image-only items, stacked */}
            <div className={base.whyItems}>
              {ALL_PROJECTS.map((p) => (
                <div key={p.name} className={base.whyItem} aria-label={`${p.name} — ${p.type}`}>
                  <img
                    src={p.image}
                    alt={`${p.name} — ${p.type}`}
                    className={base.whyIcon}
                    height={160}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}

              {ALL_PROJECTS.length === 0 && (
                <p className={base.emptyState}>More case studies coming soon.</p>
              )}
            </div>
          </div>
        </Section>

        {/* CTA — Contact-style */}
        <Section id="cta" title="let's talk" className={base.contact}>
          <div className={`${base.contactInner} ${styles.ctaInner}`}>
            {/* Left content */}
            <div className={styles.contactText}>
              <h2 className={base.contactTitle}>let’s build something great</h2>
              <p className={base.contactNote}>tell us about your business and goals</p>
              <a className={base.primaryCta} href="/contact">contact us</a>
            </div>

            {/* Right illustration (decorative on mobile) */}
            <img
              src="/images/section-contact.webp"
              alt=""
              aria-hidden="true"
              className={styles.ctaImage}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Section>
      </div>
    </>
  );
}
