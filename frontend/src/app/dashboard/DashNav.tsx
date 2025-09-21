'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './DashNav.module.css';

/* Tiny inline icon set (no extra deps) */
function Icon({
  name,
}: {
  name: 'home' | 'leads' | 'chevL' | 'chevR' | 'power';
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case 'leads':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'chevL':
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'chevR':
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case 'power':
      return (
        <svg {...common}>
          <path d="M12 2v8" />
          <path d="M5.5 5.5a8 8 0 1 0 13 0" />
        </svg>
      );
  }
}

export default function DashNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sw_dash_collapsed');
    if (saved) setCollapsed(saved === '1');
  }, []);
  useEffect(() => {
    localStorage.setItem('sw_dash_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const items = [
    { href: '/dashboard', label: 'Home', icon: 'home', active: pathname === '/dashboard' },
    { href: '/dashboard/leads', label: 'Leads', icon: 'leads', active: pathname.startsWith('/dashboard/leads') },
  ] as const;

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.top}>
        <div className={styles.brand} aria-label="Sidewalk dashboard">
          <div className={styles.brandMark}>
            <img
              src="/logo4.svg"
              alt="Sidewalk logo"
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.brandText}>Sidewalk</div>
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((v) => !v)}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Icon name={collapsed ? 'chevR' : 'chevL'} />
        </button>
      </div>

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
        <button
          className={styles.logout}
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
        >
          <span className={styles.icon} aria-hidden>
            <Icon name="power" />
          </span>
          <span className={styles.label}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
