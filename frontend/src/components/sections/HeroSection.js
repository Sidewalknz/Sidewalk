"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

export default function HeroSection() {
  return (
    <Section id="hero" title="sidewalk" className={styles.hero}>
      <div className={styles.splitInner}>
        <div className={styles.splitText}>
          <h1 className={styles.splitTitle}>breakaway from the cookiecutter</h1>
          <p className={styles.splitNote}>
            handcrafted websites and designs to express who you are
          </p>
          <div className={styles.actionsLeft}>
            <a className={styles.primaryCta} href="/contact">start a project</a>
            <a className={styles.secondaryCta} href="/portfolio">see our work</a>
          </div>
        </div>

        {/* Animated hero image: plain <img>, no lazy, high fetch priority */}
        <img
          src="/images/section-hero.webp"
          alt="Hand-drawn sidewalk path winding forward with small grass tufts"
          className={styles.splitImage}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </Section>
  );
}
