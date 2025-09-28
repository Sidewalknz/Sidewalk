'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../Dashboard.module.css';

type Client = {
  id?: string;
  name: string;
  email: string;
  website: string;
  phone?: string;
  type?: string;
  notes?: string;
};

type SortKey = 'name' | 'website' | 'email' | 'phone' | 'type';
type SortDir = 'asc' | 'desc' | null;

function str(v?: string) {
  return (v ?? '').trim().toLowerCase();
}
function cmpString(a?: string, b?: string) {
  const aa = str(a), bb = str(b);
  if (aa === bb) return 0;
  return aa < bb ? -1 : 1;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
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
        // reuse your existing leads API but point it at the "clients" tab
        const res = await fetch('/api/private/leads?tab=clients', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // be defensive: only keep fields we expect
        const cleaned = (Array.isArray(data) ? data : []).map((c: any, i: number) => ({
          id: c.id ?? `clients-${i}`,
          name: c.name ?? '',
          email: c.email ?? '',
          website: c.website ?? '',
          phone: c.phone ?? '',
          type: c.type ?? '',
          notes: c.notes ?? '',
        }));
        setClients(cleaned);
      } catch (e) {
        setClients([]);
        setError('Could not load clients.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // search
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      [c.name, c.email, c.website, c.phone, c.type, c.notes]
        .some((v) => (v ?? '').toLowerCase().includes(term))
    );
  }, [clients, q]);

  // sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let res = 0;
      switch (sortKey) {
        case 'name':    res = cmpString(a.name, a.name === b.name ? b.email : b.name); break;
        case 'website': res = cmpString(a.website?.replace(/^https?:\/\//, ''), b.website?.replace(/^https?:\/\//, '')); break;
        case 'email':   res = cmpString(a.email, b.email); break;
        case 'phone':   res = cmpString(a.phone, b.phone); break;
        case 'type':    res = cmpString(a.type, b.type); break;
      }
      return sortDir === 'asc' ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // sorting helpers
  const cycleSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) { setSortDir('asc'); return key; }
      setSortDir((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
      return key;
    });
  };
  const indicator = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '');
  const ariaSort = (key: SortKey): React.AriaAttributes['aria-sort'] =>
    sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <main className={styles.container}>
      {loading ? (
        <p>Loading clients…</p>
      ) : (
        <>
          <header className={styles.header}>
            <h1>Clients</h1>
            <input
              className={styles.searchBox}
              placeholder="Search name, email, website, phone, type, notes…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ marginLeft: 'auto' }}
            />
          </header>

          {!!error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

          <div style={{ width: '100%', overflowX: 'hidden' }}>
            <table className={styles.table} style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '18%' }} /> {/* Name */}
                <col style={{ width: '22%' }} /> {/* Website */}
                <col style={{ width: '20%' }} /> {/* Email */}
                <col style={{ width: '14%' }} /> {/* Phone */}
                <col style={{ width: '10%' }} /> {/* Type */}
                <col style={{ width: '16%' }} /> {/* Notes */}
              </colgroup>

              <thead>
                <tr>
                  <th className={styles.th} aria-sort={ariaSort('name')}>
                    <button className={styles.linkReset} onClick={() => cycleSort('name')} style={{ all: 'unset', cursor: 'pointer' }}>
                      Name {indicator('name')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('website')}>
                    <button className={styles.linkReset} onClick={() => cycleSort('website')} style={{ all: 'unset', cursor: 'pointer' }}>
                      Website {indicator('website')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('email')}>
                    <button className={styles.linkReset} onClick={() => cycleSort('email')} style={{ all: 'unset', cursor: 'pointer' }}>
                      Email {indicator('email')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('phone')}>
                    <button className={styles.linkReset} onClick={() => cycleSort('phone')} style={{ all: 'unset', cursor: 'pointer' }}>
                      Phone {indicator('phone')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('type')}>
                    <button className={styles.linkReset} onClick={() => cycleSort('type')} style={{ all: 'unset', cursor: 'pointer' }}>
                      Type {indicator('type')}
                    </button>
                  </th>
                  <th className={styles.th}>Notes</th>
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.td} style={{ textAlign: 'center', opacity: 0.6 }}>
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((c, i) => (
                    <tr key={c.id ?? `c-${i}`}>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>{c.name || '—'}</td>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>
                        {c.website ? (
                          <a href={c.website} target="_blank" rel="noreferrer">
                            {c.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : '—'}
                      </td>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>{c.email || '—'}</td>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>{c.phone || '—'}</td>
                      <td className={styles.td} style={{ wordBreak: 'break-word' }}>{c.type || '—'}</td>
                      <td className={styles.td} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {c.notes || '—'}
                      </td>
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
