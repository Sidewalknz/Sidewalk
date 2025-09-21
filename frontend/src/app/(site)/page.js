"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import WhySection from "./components/sections/WhySection";
import ServicesSection from "./components/sections/ServicesSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import TechSection from "./components/sections/TechSection";
import ContactSection from "./components/sections/ContactSection";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About us" },
  { id: "why-us", label: "Why us" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Our work" },
  { id: "tech", label: "Tech & platforms" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Observe all sections for active state (just for the dot nav)
    const sectionEls = Array.from(document.querySelectorAll(`.${styles.section}`));
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
      {/* Left-side skewed-rectangle nav */}
      <nav className={styles.dotWrap} aria-label="Section navigation">
        <ul className={styles.dots}>
          {SECTIONS.map((s) => (
            <li key={s.id} className={styles.dotItem}>
              <button
                type="button"
                aria-label={s.label}
                aria-current={active === s.id ? "true" : "false"}
                className={`${styles.dot} ${active === s.id ? styles.active : ""}`}
                onClick={() => handleClick(s.id)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Snap container */}
      <div ref={containerRef} className={styles.snapContainer}>
        <HeroSection />
        <AboutSection />
        <WhySection />
        <ServicesSection />
        <PortfolioSection />
        <TechSection />
        <ContactSection />
      </div>
    </>
  );
}
