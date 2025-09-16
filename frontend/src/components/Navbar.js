"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);

  // Lock body scroll when menu open
  useEffect(() => {
    const { body } = document;
    if (open) body.style.overflow = "hidden";
    else body.style.overflow = "";
    return () => {
      body.style.overflow = "";
    };
  }, [open]);

  // Focus first menu item when opening
  useEffect(() => {
    if (open && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [open]);

  // Close on Escape (JS only)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" aria-label="Sidewalk Home">
            <img src="/logo.svg" alt="Sidewalk Logo" className={styles.logoImg} />
          </Link>
        </div>

        {/* Desktop links */}
        <ul className={styles.navLinks}>
          <li><Link href="/about">about us</Link></li>
          <li><Link href="/services">our services</Link></li>
          <li><Link href="/portfolio">our work</Link></li>
          <li>
            <Link href="/contact" className={styles.contactBtn}>
              contact us
            </Link>
          </li>
        </ul>

        {/* Burger (mobile only) */}
        <button
          className={styles.burger}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobileMenu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </nav>

      {/* Backdrop */}
      <button
        type="button"
        className={`${styles.backdrop} ${open ? styles.show : ""}`}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      {/* Slide-down mobile menu */}
      <div
        id="mobileMenu"
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`}
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label="Mobile"
      >
        {/* Logo inside the mobile sheet */}
        <div className={styles.mobileHeader}>
          <Link
            href="/"
            className={styles.mobileLogo}
            aria-label="Sidewalk Home"
            onClick={() => setOpen(false)}
          >
            <img
              src="/logo.svg"
              alt="Sidewalk Logo"
              className={styles.mobileLogoImg}
            />
          </Link>
        </div>

        <ul className={styles.mobileList} aria-hidden={!open}>
          <li>
            <Link href="/about" ref={firstLinkRef} onClick={() => setOpen(false)}>
              about us
            </Link>
          </li>
          <li>
            <Link href="/services" onClick={() => setOpen(false)}>
              our services
            </Link>
          </li>
          <li>
            <Link href="/portfolio" onClick={() => setOpen(false)}>
              our work
            </Link>
          </li>
          <li className={styles.mobileCtaWrap}>
            <Link href="/contact" className={styles.contactBtn} onClick={() => setOpen(false)}>
              contact us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
