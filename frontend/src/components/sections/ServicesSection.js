"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

export default function ServicesSection() {
  return (
    <Section id="services" title="services" className={styles.services}>
      <div className={styles.listSectionGrid}>
        <div className={styles.listSectionText}>
          <h2 className={styles.listSectionTitle}>services</h2>
          <p className={styles.listSectionIntro}>
            from branding foundations to custom websites and ongoing growth, we’ve got you covered.
          </p>
        </div>

        <div className={styles.listItems}>
          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-services-1.webp"
                alt="Brand identity illustration"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>brand identity</strong> naming, logo, colour, typography.
            </p>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-services-2.webp"
                alt="Web design and development illustration"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>web design &amp; development</strong> static (portfolio),
              CMS, e-commerce (Shopify) sites.
            </p>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-services-3.webp"
                alt="Care and growth illustration"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>care &amp; growth</strong> hosting, monitoring, SEO,
              content support, and continuous improvements.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
