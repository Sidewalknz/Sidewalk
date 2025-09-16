"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

export default function WhySection() {
  return (
    <Section id="why-us" title="why us" className={styles.why}>
      <div className={styles.listSectionGrid}>
        <div className={styles.listSectionText}>
          <h2 className={styles.listSectionTitle}>why sidewalk?</h2>
          <p className={styles.listSectionIntro}>
            we combine creativity, technical skill, and local values to deliver digital experiences that last.
          </p>
        </div>

        <div className={styles.listItems}>
          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-why-craft.webp"
                alt="Hand-drawn pencil illustration representing craft, not templates"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>craft, not templates</strong> design tuned to your brand and goals.
            </p>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-why-performance.webp"
                alt="Hand-drawn speedometer illustration symbolizing performance first"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>performance first</strong> speed, accessibility and SEO baked in from day one.
            </p>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-why-local.webp"
                alt="Hand-drawn chat bubble over a location pin representing local and dependable"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>local & dependable</strong> nelson locals looking to make a difference.
            </p>
          </div>

          <div className={styles.listItem}>
            <div className={styles.listIconWrap}>
              <img
                src="/images/section-why-idea.webp"
                alt="Hand-drawn rocket illustration symbolizing from idea to launch"
                width="80"
                height="80"
                className={styles.listIcon}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p>
              <strong>from idea to launch</strong> strategy, design, build, and ongoing care.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
