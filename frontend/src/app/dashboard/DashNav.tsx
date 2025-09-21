'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './DashNav.module.css';

/* Tiny inline icon set (no extra deps) */
function Icon({ name }: { name: 'home' | 'leads' | 'chevL' | 'chevR' | 'power' | 'menu' | 'x' }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (name) {
    case 'home':  return (<svg {...common}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10.5V20h14v-9.5" /><path d="M9 20v-6h6v6" /></svg>);
    case 'leads': return (<svg {...common}><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="4" /></svg>);
    case 'chevL': return (<svg {...common}><path d="M15 18l-6-6 6-6" /></svg>);
    case 'chevR': return (<svg {...common}><path d="M9 6l6 6-6 6" /></svg>);
    case 'power': return (<svg {...common}><path d="M12 2v8" /><path d="M5.5 5.5a8 8 0 1 0 13 0" /></svg>);
    case 'menu':  return (<svg {...common}><path d="M3 6h18M3 12h18M3 18h18" /></svg>);
    case 'x':     return (<svg {...common}><path d="M18 6L6 18M6 6l12 12" /></svg>);
  }
}

export default function DashNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);  // desktop collapse
  const [open, setOpen] = useState(false);            // mobile drawer open
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* Load persisted state */
  useEffect(() => {
    const saved = localStorage.getItem('sw_dash_collapsed');
    if (saved) setCollapsed(saved === '1');
  }, []);

  /* Persist state (desktop collapse) */
  useEffect(() => {
    localStorage.setItem('sw_dash_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  /* Auto-collapse on ≤ 1024px, otherwise respect saved preference */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const apply = () => {
      if (mql.matches) setCollapsed(true);
      else setCollapsed(localStorage.getItem('sw_dash_collapsed') === '1');
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  /* Cmd/Ctrl+B toggles sidebar (desktop), Esc closes drawer (mobile) */
  const onKey = useCallback((e: KeyboardEvent) => {
    const metaOrCtrl = e.metaKey || e.ctrlKey;
    if (metaOrCtrl && e.key.toLowerCase() === 'b') { e.preventDefault(); setCollapsed(v => !v); }
    if (e.key === 'Escape') setOpen(false);
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [open]);

  /* Focus the close button when drawer opens (a tiny focus trap) */
  useEffect(() => {
    if (open) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [open]);

  /* Close drawer when navigating */
  useEffect(() => { setOpen(false); }, [pathname]);

  const items = [
    { href: '/dashboard', label: 'Home', icon: 'home', active: pathname === '/dashboard' },
    { href: '/dashboard/leads', label: 'Leads', icon: 'leads', active: pathname?.startsWith('/dashboard/leads') },
  ] as const;

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <>
      {/* DESKTOP/TABLET SIDEBAR */}
      <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.top}>
          <div className={styles.brand} aria-label="Sidewalk dashboard">
            <div className={styles.brandMark}>
              <img src="/logo4.svg" alt="Sidewalk logo" className={styles.brandLogo} />
            </div>
            <div className={styles.brandText}>Sidewalk</div>
          </div>

          {/* desktop collapse control (hidden on mobile via CSS) */}
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(v => !v)}
            aria-pressed={collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <Icon name={collapsed ? 'chevR' : 'chevL'} />
          </button>

          {/* mobile hamburger (shown only on ≤720px via CSS) */}
          <button
            type="button"
            className={styles.hamburgerBtn}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>

        {/* Keep the regular nav/footer for desktop/tablet */}
        <nav className={styles.nav} aria-label="Dashboard sections">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`${styles.link} ${it.active ? styles.active : ''}`}
              title={collapsed ? it.label : undefined}
            >
              <span className={styles.icon} aria-hidden>
                <Icon name={it.icon as 'home' | 'leads'} />
              </span>
              <span className={styles.label}>{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logout} onClick={logout}>
            <span className={styles.icon} aria-hidden><Icon name="power" /></span>
            <span className={styles.label}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div
        className={`${styles.sheetOverlay} ${open ? styles.openOverlay : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.sheetHeader}>
          <div className={styles.brand} aria-hidden>
            <div className={styles.brandMark}>
              <img src="/logo4.svg" alt="" className={styles.brandLogo} />
            </div>
            <div className={styles.brandText}>Sidewalk</div>
          </div>
          <button
            ref={closeBtnRef}
            className={styles.sheetClose}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="x" />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Mobile menu">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`${styles.link} ${it.active ? styles.active : ''}`}
            >
              <span className={styles.icon} aria-hidden>
                <Icon name={it.icon as 'home' | 'leads'} />
              </span>
              <span className={styles.label}>{it.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sheetFooter}>
          <button className={styles.logout} onClick={logout}>
            <span className={styles.icon} aria-hidden><Icon name="power" /></span>
            <span className={styles.label}>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
