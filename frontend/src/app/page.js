"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const screenRef = useRef(null);

  useEffect(() => {
    // ----- helpers -----
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    class ScreenEffect {
      constructor(parent, options) {
        this.parent = parent; // pass element (not selector)
        this.config = { ...options };
        this.effects = {};
        this.events = { resize: this.onResize.bind(this) };
        window.addEventListener("resize", this.events.resize, false);
        this.render();
      }

      render() {
        const container = document.createElement("div");
        container.classList.add(styles.screenContainer);

        const wrapper1 = document.createElement("div");
        wrapper1.classList.add(styles.screenWrapper);

        const wrapper2 = document.createElement("div");
        wrapper2.classList.add(styles.screenWrapper);

        const wrapper3 = document.createElement("div");
        wrapper3.classList.add(styles.screenWrapper);

        wrapper1.appendChild(wrapper2);
        wrapper2.appendChild(wrapper3);
        container.appendChild(wrapper1);

        // Insert container before parent; move parent inside wrapper3
        this.parent.parentNode.insertBefore(container, this.parent);
        wrapper3.appendChild(this.parent);

        this.nodes = { container, wrapper1, wrapper2, wrapper3 };
        this.onResize();
      }

      onResize() {
        this.rect = this.parent.getBoundingClientRect();

        // DPR scale helps reduce shimmer/flicker
        const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        this.dpr = dpr;

        // Resize any existing canvases to DPR but keep CSS size the same
        ["vcr", "snow"].forEach((key) => {
          const eff = this.effects[key];
          if (!eff || !eff.node) return;
          const cssW = this.rect.width;
          const cssH = this.rect.height;
          eff.node.width = Math.max(1, Math.floor(cssW * dpr));
          eff.node.height = Math.max(1, Math.floor(cssH * dpr));
          eff.node.style.width = cssW + "px";
          eff.node.style.height = cssH + "px";
          if (eff.ctx) {
            eff.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            eff.ctx.imageSmoothingEnabled = false;
          }
        });

        if (this.effects.vcr && !!this.effects.vcr.enabled) {
          this.generateVCRNoise();
        }
      }

      add(type, options) {
        const config = Object.assign({ fps: 30, blur: 1 }, options);

        if (Array.isArray(type)) {
          for (const t of type) this.add(t);
          return this;
        }

        if (type === "snow") {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: true });
          canvas.classList.add(styles.canvasBase, styles.snowCanvas);

          // DPR-aware sizing
          const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
          const cssW = this.rect?.width || window.innerWidth;
          const cssH = this.rect?.height || window.innerHeight;
          canvas.width = Math.max(1, Math.floor(cssW * dpr));
          canvas.height = Math.max(1, Math.floor(cssH * dpr));
          canvas.style.width = cssW + "px";
          canvas.style.height = cssH + "px";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = false;

          this.nodes.wrapper2.appendChild(canvas);

          // Throttle snow to ~15fps
          const intervalMs = 66;
          const tick = () => this.generateSnow(ctx);
          tick();
          this.snowInterval = setInterval(tick, intervalMs);

          this.effects[type] = {
            wrapper: this.nodes.wrapper2,
            node: canvas,
            enabled: true,
            config,
          };
          return this;
        }

        if (type === "roll") {
          return this.enableRoll();
        }

        if (type === "vcr") {
          const canvas = document.createElement("canvas");
          canvas.classList.add(styles.canvasBase, styles.vcrCanvas);
          this.nodes.wrapper2.appendChild(canvas);

          // DPR-aware sizing
          const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
          const cssW = this.rect?.width || window.innerWidth;
          const cssH = this.rect?.height || window.innerHeight;
          canvas.width = Math.max(1, Math.floor(cssW * dpr));
          canvas.height = Math.max(1, Math.floor(cssH * dpr));
          canvas.style.width = cssW + "px";
          canvas.style.height = cssH + "px";

          const ctx = canvas.getContext("2d", { alpha: true });
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = false;

          this.effects[type] = {
            wrapper: this.nodes.wrapper2,
            node: canvas,
            ctx,
            enabled: true,
            config,
          };

          this.generateVCRNoise();
          return this;
        }

        let node = null;
        let wrapper = this.nodes.wrapper2;

        switch (type) {
          case "wobblex":
            wrapper.classList.add(styles.wobblex);
            break;
          case "wobbley":
            wrapper.classList.add(styles.wobbley);
            break;
          case "scanlines":
            node = document.createElement("div");
            node.classList.add(styles.scanlines);
            wrapper.appendChild(node);
            break;
          case "vignette":
            wrapper = this.nodes.container;
            node = document.createElement("div");
            node.classList.add(styles.vignette);
            wrapper.appendChild(node);
            break;
          case "image":
            wrapper = this.parent;
            node = document.createElement("img");
            node.classList.add(styles.image);
            node.src = (config && config.src) || "";
            wrapper.appendChild(node);
            break;
          case "video":
            wrapper = this.parent;
            node = document.createElement("video");
            node.classList.add(styles.video);
            node.src = (config && config.src) || "";
            node.crossOrigin = "anonymous";
            node.autoplay = true;
            node.muted = true;
            node.loop = true;
            wrapper.appendChild(node);
            break;
        }

        this.effects[type] = { wrapper, node, enabled: true, config };
        return this;
      }

      remove(type) {
        const obj = this.effects[type];
        if (type in this.effects && !!obj.enabled) {
          obj.enabled = false;

          if (type === "roll" && obj.original) {
            this.parent.appendChild(obj.original);
          }
          if (type === "vcr") {
            if (this.vcrInterval) clearInterval(this.vcrInterval);
            if (this.vcrRAF) cancelAnimationFrame(this.vcrRAF);
          }
          if (type === "snow") {
            if (this.snowInterval) clearInterval(this.snowInterval);
            if (this.snowframe) cancelAnimationFrame(this.snowframe);
          }
          if (obj.node) {
            obj.wrapper.removeChild(obj.node);
          } else {
            obj.wrapper.classList.remove(styles.wobblex, styles.wobbley);
          }
        }
        return this;
      }

      enableRoll() {
        const el = this.parent.firstElementChild;
        if (el) {
          const div = document.createElement("div");
          div.classList.add(styles.roller);
          this.parent.appendChild(div);
          div.appendChild(el);
          div.appendChild(el.cloneNode(true));

          this.effects.roll = {
            enabled: true,
            wrapper: this.parent,
            node: div,
            original: el,
          };
        }
      }

      generateVCRNoise() {
        const { config } = this.effects.vcr;
        // Cap to calmer 24–30 fps
        const fps = Math.max(10, Math.min(30, config.fps || 24));
        const period = Math.round(1000 / fps);

        // Clear previous loops
        if (this.vcrRAF) cancelAnimationFrame(this.vcrRAF);
        if (this.vcrInterval) clearInterval(this.vcrInterval);

        this.vcrInterval = setInterval(() => {
          this.renderTrackingNoise();
        }, period);
      }

      // CRT "snow"
      generateSnow(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const d = ctx.createImageData(w, h);
        const b = new Uint32Array(d.data.buffer);
        const len = b.length;

        for (let i = 0; i < len; i++) {
          b[i] = ((255 * Math.random()) | 0) << 24;
        }
        ctx.putImageData(d, 0, 0);
      }

      renderTrackingNoise(radius = 2, xmax, ymax) {
        const canvas = this.effects.vcr.node;
        const ctx = this.effects.vcr.ctx;
        const config = this.effects.vcr.config;

        let posy1 = config.miny || 0;
        let posy2 = config.maxy || canvas.height;
        let posy3 = config.miny2 || 0;
        const num = Math.min(35, config.num || 25); // fewer -> calmer

        if (xmax === undefined) xmax = canvas.width;
        if (ymax === undefined) ymax = canvas.height;

        canvas.style.filter = `blur(${config.blur || 1.5}px)`; // soften
        ctx.globalAlpha = 0.6; // less harsh
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `#fff`;

        ctx.beginPath();
        for (let i = 0; i <= num; i++) {
          const x = Math.random(i) * xmax;
          const y1 = getRandomInt((posy1 += 3), posy2);
          const y2 = getRandomInt(0, (posy3 -= 3));
          ctx.fillRect(x, y1, radius, radius);
          ctx.fillRect(x, y2, radius, radius);

          this.renderTail(ctx, x, y1, radius);
          this.renderTail(ctx, x, y2, radius);
        }
        ctx.closePath();
      }

      renderTail(ctx, x, y, radius) {
        const n = getRandomInt(1, 20); // shorter tails
        const dirs = [1, -1];
        let rd = radius;
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        for (let i = 0; i < n; i++) {
          const step = 0.01;
          const r = getRandomInt((rd -= step), radius);
          let dx = getRandomInt(1, 4);
          radius -= 0.1;
          dx *= dir;
          ctx.fillRect((x += dx), y, r, r);
        }
      }
    }

    // init
    if (!screenRef.current) return;
    const screen = new ScreenEffect(screenRef.current, {});
    // gentler defaults
    const textWrapper = document.createElement("div");
    textWrapper.classList.add(styles.centerTextWrapper);

    const title = document.createElement("h1");
    title.textContent = "Sidewalk";
    title.classList.add(styles.centerText, styles.rgbGlitch);

    const tagline = document.createElement("h3");
    tagline.textContent = "Web and Brand Developers";
    tagline.classList.add(styles.tagline, styles.rgbGlitchSoft);

    const subtitle = document.createElement("h2");
    subtitle.textContent = "Coming Soon";
    subtitle.classList.add(styles.subText, styles.rgbGlitchSoft);

    // Email line
    const email = document.createElement("p");
    email.classList.add(styles.emailText, styles.rgbGlitchSoft);
    email.appendChild(document.createTextNode("For enquiries: "));

    const emailLink = document.createElement("a");
    emailLink.href = "mailto:admin@sidewalks.co.nz";
    emailLink.textContent = "admin@sidewalks.co.nz";
    emailLink.classList.add(styles.emailLink);
    emailLink.title = "Click to email (also copies address)";
    emailLink.setAttribute("aria-label", "Email admin at sidewalks dot co dot nz");

    // Copy-to-clipboard toast
    const toast = document.createElement("span");
    toast.classList.add(styles.copyToast);
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = "Copied!";

    email.appendChild(emailLink);
    email.appendChild(toast);

    // Copy logic (keeps mailto behavior)
    const copyAddress = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText("admin@sidewalks.co.nz");
          toast.classList.add(styles.show);
          setTimeout(() => toast.classList.remove(styles.show), 1400);
        }
      } catch {
        // ignore copy failures silently
      }
    };

    const onClick = () => copyAddress();
    const onKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") copyAddress();
    };

    emailLink.addEventListener("click", onClick);
    emailLink.addEventListener("keydown", onKeyDown);

    textWrapper.appendChild(title);
    textWrapper.appendChild(tagline);
    textWrapper.appendChild(subtitle);
    textWrapper.appendChild(email);
    screenRef.current.appendChild(textWrapper);

    screen.add("vignette");
    screen.add("scanlines");
    screen.add("vcr", { opacity: 0.6, miny: 220, miny2: 220, num: 28, fps: 24, blur: 1.6 });
    screen.add("wobbley");
    screen.add("snow", { opacity: 0.15 });

    return () => {
      emailLink.removeEventListener("click", onClick);
      emailLink.removeEventListener("keydown", onKeyDown);

      screen.remove("snow");
      screen.remove("vcr");
      screen.remove("scanlines");
      screen.remove("vignette");
      screen.remove("wobbley");
      screen.remove("image");
    };
  }, []);

  return (
    <div className={styles.page}>
      <div ref={screenRef} className={styles.screen} />
    </div>
  );
}
