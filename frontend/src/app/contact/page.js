"use client";

import { useState } from "react";
import base from "../page.module.css";
import Section from "../../components/sections/Section";
import styles from "./Contact.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.message.trim()) return "Tell us a bit about your project.";
    if (form.company) return "Spam detected."; // honeypot
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "idle", message: "" });

    const error = validate();
    if (error) {
      setStatus({ state: "error", message: error });
      return;
    }

    try {
      setStatus({ state: "loading", message: "Sending…" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          company: form.company, // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to send");
      setStatus({ state: "success", message: "Thanks! We’ll get back to you shortly." });
      setForm({ name: "", email: "", message: "", company: "" });
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Something went wrong." });
    }
  };

  return (
    <Section id="contact" title="contact" className={styles.contactBg}>
      <div className={styles.contactWrap}>
        {/* ROW 1: title/subtitle (left) + image (right) */}
        <div className={styles.introRow}>
          <div className={styles.introLeft}>
            <h1 className={`${styles.title} ${base.splitTitle}`}>tell us what you’re building</h1>
            <p className={`${styles.subtitle} ${base.splitNote}`}>
              drop a few details and we’ll map a lightweight, high-impact plan to get it live.
            </p>
          </div>
          <div className={styles.introRight}>
            {/* Decorative hero image (first viewport: no lazy) */}
            <img
              src="/images/contact-hero.webp"
              alt=""
              aria-hidden="true"
              className={styles.introImage}
              decoding="async"
            />
          </div>
        </div>

        {/* ROW 2: form (left) + contact details (right) */}
        <div className={styles.formGrid}>
          {/* form */}
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {/* honeypot */}
            <input
              type="text"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              className={styles.honeypot}
              onChange={onChange}
              value={form.company}
              aria-hidden="true"
            />

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message">project details *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={onChange}
                required
              />
            </div>

            <div className={base.actionsLeft} style={{ marginTop: ".5rem" }}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status.state === "loading"}
              >
                {status.state === "loading" ? "sending…" : "send message"}
              </button>
            </div>

            <p
              className={
                status.state === "error"
                  ? styles.formStatusError
                  : status.state === "success"
                  ? styles.formStatusSuccess
                  : styles.formStatus
              }
              aria-live="polite"
            >
              {status.message}
            </p>
          </form>

          {/* contact details – compact icon list */}
          <aside className={styles.contactSide}>
            <div className={styles.contactBlock}>
              <div className={styles.contactHeading}>contact</div>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <svg
                    className={styles.contactIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z"
                    />
                  </svg>
                  <div className={styles.contactText}>
                    <a href="mailto:admin@sidewalks.co.nz">admin@sidewalks.co.nz</a>
                  </div>
                </li>
                <li className={styles.contactItem}>
                  <svg
                    className={styles.contactIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                    />
                  </svg>
                  <div className={styles.contactText}>nelson, new zealand</div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
