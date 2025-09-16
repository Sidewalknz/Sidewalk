"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

export default function ContactSection() {
  return (
    <Section id="contact" title="let's talk" className={styles.contact}>
      <div className={styles.splitInner}>
        <div className={styles.splitText}>
          <h2 className={styles.splitTitle}>let’s build something great</h2>
          <p className={styles.splitNote}>tell us about your business and goals</p>
          <a className={styles.primaryCta} href="/contact">contact us</a>
        </div>

        {/* Decorative animated image: lazy + async decode */}
        <img
          src="/images/section-contact2.webp"
          alt=""
          aria-hidden="true"
          className={styles.splitImage}
          loading="lazy"
          decoding="async"
        />
      </div>
    </Section>
  );
}
