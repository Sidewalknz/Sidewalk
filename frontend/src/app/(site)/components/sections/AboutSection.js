"use client";

import Section from "./Section";
import styles from "../../page.module.css";

export default function AboutSection() {
  return (
    <Section id="about" title="about" className={styles.about}>
      <div className={styles.splitInner}>
        <div className={styles.splitText}>
          <h2 className={styles.splitTitle}>we are sidewalk</h2>
          <p className={styles.splitNote}>
            a nelson-based creative duo crafting websites and brands with care.
            we believe in building digital experiences that feel personal,
            local, and timeless.
          </p>
          <div className={styles.actionsLeft}>
            <a className={styles.primaryCta} href="/about">learn more →</a>
          </div>
        </div>

        {/* Animated WebP: use <img>, lazy-load since it's below the hero */}
        <img
          src="/images/section-about.webp"
          alt="Hand-drawn animated coffee mug illustration, representing Sidewalk’s creative style"
          className={styles.splitImage}
          width={348}
          height={444}
          loading="lazy"
          decoding="async"
        />
      </div>
    </Section>
  );
}
