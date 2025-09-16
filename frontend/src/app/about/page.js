"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import base from "../page.module.css";           // shared layout system (snap, lists, etc.)
import styles from "./About.module.css";         // about-specific tweaks
import Section from "../../components/sections/Section";

const SECTIONS = [
  { id: "hero",   label: "Home" },
  { id: "values", label: "Our values" },
  { id: "team",   label: "Team" },
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    // Ensure Section renders an element with className={base.section}
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
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

      <div ref={containerRef} className={base.snapContainer}>
        {/* ============================= HERO ============================= */}
        <Section id="hero" title="sidewalk" className={`${base.hero} ${styles.hero}`}>
          <div className={base.splitInner}>
            <div className={base.splitText}>
              <h1 className={`${base.splitTitle} ${styles.titleTight}`}>we are sidewalk</h1>
              <p className={base.splitNote}>
                we’re a nelson-based duo passionate about crafting websites and building brands that connect.
                at sidewalk, we bring design and development together to help companies stand out online.
              </p>
              <div className={base.actionsLeft}>
                <a className={base.primaryCta} href="/contact">start a project</a>
                <a className={base.secondaryCta} href="/portfolio">see our work</a>
              </div>
            </div>

            {/* Animated hero: keep unoptimized, keep priority; remove quality/sizes (no-ops) */}
            <Image
              src="/images/about-hero.webp"
              alt="Hand-drawn kiwi in front of mountains holding colorful blocks"
              className={base.splitImage}
              width={700}
              height={520}
              unoptimized
              priority
              fetchPriority="high"
            />
          </div>
        </Section>

        {/* ============================= VALUES ============================= */}
        <Section id="values" title="values" className={styles.values}>
          <div className={base.listSectionGrid}>
            <div className={base.listSectionText}>
              <h2 className={base.listSectionTitle}>what we stand for</h2>
              <p className={base.listSectionIntro}>
                clarity, distinctiveness, and speed. principles that guide everything we design and build.
              </p>
            </div>

            <div className={base.listItems}>
              {/* For tiny animated icons, use <img> and lazy-load */}
              <div className={base.listItem}>
                <div className={base.listIconWrap}>
                  <img
                    src="/images/about-values-1.webp"
                    alt="Kiwi bird illustration for clarity over clutter"
                    width="80"
                    height="80"
                    loading="lazy"
                    className={base.listIcon}
                  />
                </div>
                <p>
                  <strong>clarity over clutter</strong>
                  we design for decisions, honest hierarchy, clear messaging, frictionless paths.
                </p>
              </div>

              <div className={base.listItem}>
                <div className={base.listIconWrap}>
                  <img
                    src="/images/about-values-2.webp"
                    alt="Star on textured background for distinctive by default"
                    width="80"
                    height="80"
                    loading="lazy"
                    className={base.listIcon}
                  />
                </div>
                <p>
                  <strong>distinctive by default</strong>
                  no templates; expressive systems that look and feel like you.
                </p>
              </div>

              <div className={base.listItem}>
                <div className={base.listIconWrap}>
                  <img
                    src="/images/about-values-3.webp"
                    alt="Yellow balloon among grey balloons for performance as brand"
                    width="80"
                    height="80"
                    loading="lazy"
                    className={base.listIcon}
                  />
                </div>
                <p>
                  <strong>performance as brand</strong>
                  speed and accessibility shape perception. we bake them in from day one.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================= TEAM (matches services layout) ============================= */}
        <Section id="team" title="team" className={styles.team}>
          <div className={base.listSectionGrid}>
            <div className={base.listSectionText}>
              <h2 className={base.listSectionTitle}>the people</h2>
              <p className={base.listSectionIntro}>
                two people, many skills, working closely to bring ideas to life.
              </p>
            </div>

            <div className={base.listItems}>
              {/* Person 1 (static JPG: let Next optimize; lazy below-the-fold) */}
              <div className={`${base.listItem} ${styles.personRow}`}>
                <div className={styles.avatarWrap}>
                  <Image
                    className={styles.avatar}
                    src="/images/team_ezekiel.jpg"
                    alt="Portrait of Ezekiel Brown"
                    width={96}
                    height={96}
                    sizes="96px"
                    quality={72}
                    loading="lazy"
                  />
                </div>
                <div className={styles.personText}>
                  <strong className={styles.name}>Ezekiel Brown</strong>
                  <div className={styles.role}>co-founder — tech lead &amp; web design</div>
                </div>
              </div>

              {/* Person 2 */}
              <div className={`${base.listItem} ${styles.personRow}`}>
                <div className={styles.avatarWrap}>
                  <Image
                    className={styles.avatar}
                    src="/images/team_keegan.jpg"
                    alt="Portrait of Keegan Jeffries"
                    width={96}
                    height={96}
                    sizes="96px"
                    quality={72}
                    loading="lazy"
                  />
                </div>
                <div className={styles.personText}>
                  <strong className={styles.name}>Keegan Jeffries</strong>
                  <div className={styles.role}>co-founder — sales &amp; marketing</div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
