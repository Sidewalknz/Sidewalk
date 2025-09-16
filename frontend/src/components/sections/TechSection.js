"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

export default function TechSection() {
  return (
    <Section id="tech" title="tech & platforms" className={styles.tech}>
      <div className={styles.splitInner}>
        <div className={styles.splitText}>
          <h2 className={styles.splitTitle}>tech & platforms</h2>
          <p className={styles.splitNote}>
            we specialize in next.js, react, shopify, vercel, and netlify, but
            we’re flexible, and can work with whatever tools you prefer.
          </p>
        </div>

        {/* Animated WebP: plain <img>, lazy + async decode */}
        <img
          src="/images/section-tech.webp"
          alt="Hand-drawn laptop with React, Shopify, and Angular icons"
          className={styles.splitImage}
          width="348"
          height="318"
          loading="lazy"
          decoding="async"
        />
      </div>
    </Section>
  );
}
