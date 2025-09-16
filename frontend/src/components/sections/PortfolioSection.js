"use client";

import Section from "./Section";
import styles from "../../app/page.module.css";

const CLIENT_LOGOS = [
  {
    src: "/portfolio/anythingelectronic.webp",
    alt: "Anything Electronic logo",
    href: "https://anythingelectronic.vercel.app/",
  },
  {
    src: "/portfolio/richmondafc.webp",
    alt: "Richmond AFC logo",
    href: "https://richmondathletic.vercel.app/",
  },
  {
    src: "/portfolio/kiwiexplorer.webp",
    alt: "Kiwi Explorers logo",
    href: "https://kiwiexplorers.vercel.app/",
  },
];

export default function PortfolioSection() {
  return (
    <Section id="portfolio" title="our work" className={styles.portfolio}>
      <div className={styles.portfolioGrid}>
        <div className={styles.portfolioText}>
          <h2 className={styles.portfolioTitle}>featured work</h2>
          <p className={styles.portfolioIntro}>
            a selection of recent projects, showcasing how we help brands stand
            out with thoughtful design and clean code.
          </p>
        </div>

        <ul className={styles.portfolioItems}>
          {CLIENT_LOGOS.map((logo) => (
            <li className={styles.portfolioItem} key={logo.src}>
              <a
                className={styles.logoLink}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${logo.alt} — opens in a new tab`}
                title="Opens in a new tab"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={160}
                  className={styles.portfolioImage}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
