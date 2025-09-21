"use client";

import { useEffect, useRef } from "react";
import styles from "../../page.module.css";

/**
 * Base Section wrapper: handles id, data-title, visibility class, and common layout.
 * Props:
 * - id: string (anchor)
 * - title: string (used for data-title background text)
 * - className: string (section-specific background styles from page.module.css, e.g., styles.hero)
 * - children: content
 */
export default function Section({ id, title, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(styles.isVisible, entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      data-title={title}
      className={`${styles.section} ${className || ""}`}
    >
      <div className={styles.content}>{children}</div>
    </section>
  );
}
