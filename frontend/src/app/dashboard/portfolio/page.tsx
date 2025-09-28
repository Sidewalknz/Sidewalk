'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../Dashboard.module.css';

type PortfolioItem = {
  id?: string;
  name: string;
  website: string;
  technologies?: string;
  type?: string;
};

type SortKey = 'name' | 'website' | 'technologies' | 'type';
type SortDir = 'asc' | 'desc' | null;

function str(v?: string) { return (v ?? '').trim().toLowerCase(); }
function cmpString(a?: string, b?: string) {
  const aa = str(a), bb = str(b);
  if (aa === bb) return 0;
  return aa < bb ? -1 : 1;
}

export default function PortfolioPage() {
  const [rows, setRows] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        // Reuse your tabbed API; switch to /api/private/portfolio if you made a dedicated route
        const res = await fetch('/api/private/leads?tab=portfolio', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const cleaned = (Array.isArray(data) ? data : []).map((r: any, i: number) => ({
          id: r.id ?? `portfolio-${i}`,
          name: r.name ?? '',
          website: r.website ?? '',
          technologies: r.technologies ?? r.tech ?? '',
          type: r.type ?? '',
        }));
        setRows(cleaned);
      } catch (e) {
        setRows([]);
        setError('Could not load portfolio.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.name, r.website, r.technologies, r.type]
        .some((v) => (v ?? '').toLowerCase().includes(term))
    );
  }, [rows, q]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let res = 0;
      switch (sortKey) {
        case 'name':         res = cmpString(a.name, b.name); break;
        case 'website':      res = cmpString(a.website?.replace(/^https?:\/\//, ''), b.website?.replace(/^https?:\/\//, '')); break;
        case 'technologies': res = cmpString(a.technologies, b.technologies); break;
        case 'type':         res = cmpString(a.type, b.type); break;
      }
      return sortDir === 'asc' ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const cycleSort = (key: SortKey) => {
    setSortKey((prev) => {
      if (prev !== key) { setSortDir('asc'); return key; }
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return key;
    });
  };
  const indicator = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '');
  const ariaSort = (key: SortKey): React.AriaAttributes['aria-sort'] =>
    sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <main className={styles.container}>
      {loading ? (
        <p>Loading portfolio…</p>
      ) : (
        <>
          <header className={styles.header}>
            <h1>Portfolio</h1>
            <input
              className={styles.searchBox}
              placeholder="Search name, website, technologies, type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ marginLeft: 'auto' }}
            />
          </header>

          {!!error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

          <div style={{ width: '100%', overflowX: 'hidden' }}>
            <table className={styles.table} style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '22%' }} /> {/* Name */}
                <col style={{ width: '28%' }} /> {/* Website */}
                <col style={{ width: '30%' }} /> {/* Technologies */}
                <col style={{ width: '20%' }} /> {/* Type */}
              </colgroup>

              <thead>
                <tr>
                  <th className={styles.th} aria-sort={ariaSort('name')}>
                    <button onClick={() => cycleSort('name')} className={styles.linkReset} style={{ all: 'unset', cursor: 'pointer' }}>
                      Name {indicator('name')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('website')}>
                    <button onClick={() => cycleSort('website')} className={styles.linkReset} style={{ all: 'unset', cursor: 'pointer' }}>
                      Website {indicator('website')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('technologies')}>
                    <button onClick={() => cycleSort('technologies')} className={styles.linkReset} style={{ all: 'unset', cursor: 'pointer' }}>
                      Technologies {indicator('technologies')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('type')}>
                    <button onClick={() => cycleSort('type')} className={styles.linkReset} style={{ all: 'unset', cursor: 'pointer' }}>
                      Type {indicator('type')}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.td} style={{ textAlign: 'center', opacity: 0.6 }}>
                      No portfolio entries found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((r, i) => (
                    <tr key={r.id ?? `p-${i}`}>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>{r.name || '—'}</td>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>
                        {r.website ? (
                          <a href={r.website} target="_blank" rel="noreferrer">
                            {r.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : '—'}
                      </td>
                      <td className={styles.td} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {r.technologies || '—'}
                      </td>
                      <td className={styles.td}>{r.type || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
