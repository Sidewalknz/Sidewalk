'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../Dashboard.module.css';

const TYPE_VALUES = ['none', 'ecommerce', 'portfolio', 'saas', 'booking'] as const;
type LeadType = typeof TYPE_VALUES[number];

type Lead = {
  id?: string;
  name: string;
  email: string;
  website: string;
  needsNew?: boolean;
  image?: string;
  type?: string; // raw from sheet; we'll normalize when displaying
};

const DEFAULT_TAB = process.env.NEXT_PUBLIC_DEFAULT_LEADS_TAB || 'nelson';

function normalizeType(v?: string): LeadType | null {
  const s = String(v ?? '').trim().toLowerCase();
  return (TYPE_VALUES as readonly string[]).includes(s) ? (s as LeadType) : null;
}
function labelType(t: LeadType) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// Use email as the selection key (only selectable if email exists)
const emailKey = (l: Lead) => (l.email || '').trim().toLowerCase();

// ---- Sorting helpers ----
type SortKey = 'name' | 'website' | 'email' | 'needsNew' | 'type';
type SortDir = 'asc' | 'desc' | null;

function str(v?: string) {
  return (v ?? '').trim().toLowerCase();
}
function cmpString(a?: string, b?: string) {
  const aa = str(a), bb = str(b);
  if (aa === bb) return 0;
  return aa < bb ? -1 : 1;
}
function cmpBool(a?: boolean, b?: boolean) {
  const aa = !!a, bb = !!b;
  if (aa === bb) return 0;
  return aa ? 1 : -1; // false < true
}

export default function LeadsPage() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [q, setQ] = useState('');
  const [onlyNeedsNew, setOnlyNeedsNew] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: show type filter
  const [showType, setShowType] = useState<'all' | LeadType>('all');

  // NEW: sorting state
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Selection state: set of lowercased emails
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const res = await fetch('/api/private/leads/tabs', { cache: 'no-store' });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setTabs(list);
        setSelectedTab(list.includes(DEFAULT_TAB) ? DEFAULT_TAB : (list[0] || DEFAULT_TAB));
      } catch {
        setTabs([]);
      } finally {
        setLoadingTabs(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedTab) return;
    (async () => {
      try {
        setLoadingLeads(true);
        setError(null);
        const res = await fetch(
          `/api/private/leads?tab=${encodeURIComponent(selectedTab)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
        // Clear any selections that are from a different tab
        setSelectedEmails(new Set());
      } catch {
        setError('Could not load leads for this tab.');
        setLeads([]);
        setSelectedEmails(new Set());
      } finally {
        setLoadingLeads(false);
      }
    })();
  }, [selectedTab]);

  // Apply search + needsNew + type filter
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (onlyNeedsNew && !l.needsNew) return false;

      const t = normalizeType(l.type);
      if (showType !== 'all') {
        // special-case "none" means either explicit 'none' or no recognized type
        if (showType === 'none') {
          if (t !== 'none') return false;
        } else {
          if (t !== showType) return false;
        }
      }

      if (!term) return true;
      return (
        l.name?.toLowerCase().includes(term) ||
        l.email?.toLowerCase().includes(term) ||
        l.website?.toLowerCase().includes(term)
      );
    });
  }, [leads, q, onlyNeedsNew, showType]);

  // Sort after filtering
  const sorted = useMemo(() => {
    if (!sortDir || !sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let res = 0;
      switch (sortKey) {
        case 'name':
          res = cmpString(a.name, b.name);
          break;
        case 'website':
          res = cmpString(a.website?.replace(/^https?:\/\//, ''), b.website?.replace(/^https?:\/\//, ''));
          break;
        case 'email':
          res = cmpString(a.email, b.email);
          break;
        case 'needsNew':
          res = cmpBool(a.needsNew, b.needsNew);
          break;
        case 'type': {
          const ta = normalizeType(a.type);
          const tb = normalizeType(b.type);
          // sort by label text so visual order matches what users see
          res = cmpString(ta ? labelType(ta) : '', tb ? labelType(tb) : '');
          break;
        }
      }
      return sortDir === 'asc' ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // Visible selectable email keys (filtered & with email)
  const visibleEmailKeys = useMemo(
    () => sorted.map(emailKey).filter(Boolean),
    [sorted]
  );

  const allVisibleSelected =
    visibleEmailKeys.length > 0 &&
    visibleEmailKeys.every((k) => selectedEmails.has(k));
  const someVisibleSelected =
    visibleEmailKeys.some((k) => selectedEmails.has(k)) && !allVisibleSelected;

  // Indeterminate header checkbox
  const headCheckRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headCheckRef.current) {
      headCheckRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const toggleAllVisible = () => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        // unselect all visible
        visibleEmailKeys.forEach((k) => next.delete(k));
      } else {
        // select all visible
        visibleEmailKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  const toggleOne = (lead: Lead) => {
    const k = emailKey(lead);
    if (!k) return; // ignore rows without email
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  // Sorting UI handlers
  const cycleSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        setSortDir('asc');
        return key;
      }
      // toggle asc/desc
      setSortDir((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
      return key;
    });
  };
  const indicator = (key: SortKey) => {
    if (sortKey !== key || !sortDir) return '';
    return sortDir === 'asc' ? '▲' : '▼';
  };
  const ariaSort = (key: SortKey): React.AriaAttributes['aria-sort'] =>
    sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  const selectedList = useMemo(
    () => leads.filter((l) => selectedEmails.has(emailKey(l))),
    [leads, selectedEmails]
  );
  const selectedEmailsCsv = selectedList
    .map((l) => l.email?.trim())
    .filter(Boolean)
    .join(', ');

  const composeMailto = () => {
    if (!selectedEmailsCsv) return;
    const subject = 'Website improvements from Sidewalk';
    const body =
      `Kia ora,\n\nWe had a few quick ideas that could improve your website experience and conversions.\nHappy to share a brief audit or mockups if you’re keen.\n\nCheers,\nSidewalk`;
    const href = `mailto:?bcc=${encodeURIComponent(
      selectedEmailsCsv
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(selectedEmailsCsv);
      alert('Emails copied to clipboard.');
    } catch {
      // fallback
      const ok = window.confirm(
        'Clipboard copy failed. Show emails so you can copy manually?'
      );
      if (ok) prompt('Copy these emails:', selectedEmailsCsv);
    }
  };

  const isLoading = loadingTabs || loadingLeads;

  return (
    <main className={styles.container}>
      {isLoading ? (
        <p>Loading leads…</p>
      ) : (
        <>
          <header className={styles.header}>
            <h1>Leads</h1>

            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <label className={styles.checkbox}>
                <span style={{ fontSize: 12, opacity: 0.8 }}>Location</span>
                <select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  className={styles.searchBox}
                  style={{ minWidth: 180 }}
                >
                  {(tabs.length ? tabs : [selectedTab]).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <input
                className={styles.searchBox}
                placeholder="Search name, email, website…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={onlyNeedsNew}
                  onChange={(e) => setOnlyNeedsNew(e.target.checked)}
                />
                Needs new only
              </label>

              {/* NEW: Show type filter */}
              <label className={styles.checkbox}>
                <span style={{ fontSize: 12, opacity: 0.8 }}>Show type</span>
                <select
                  value={showType}
                  onChange={(e) => setShowType(e.target.value as any)}
                  className={styles.searchBox}
                  style={{ minWidth: 150 }}
                >
                  <option value="all">All</option>
                  {TYPE_VALUES.map((t) => (
                    <option key={t} value={t}>
                      {labelType(t)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          {!!error && (
            <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>
          )}

          {/* Bulk actions bar (only if we have any selection) */}
          {selectedEmails.size > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--panel)',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: 13, opacity: 0.85 }}>
                Selected: <strong>{selectedEmails.size}</strong>
              </div>
              <button
                className={styles.btn}
                onClick={composeMailto}
                disabled={!selectedEmailsCsv}
              >
                ✉️ Compose Email
              </button>
              <button
                className={styles.btn}
                onClick={copyEmails}
                disabled={!selectedEmailsCsv}
              >
                📋 Copy Emails
              </button>
            </div>
          )}

          {/* Table */}
          <div style={{ width: '100%', overflowX: 'hidden' }}>
            <table
              className={styles.table}
              style={{ tableLayout: 'fixed', width: '100%' }}
            >
              <colgroup>
                <col style={{ width: '36px' }} />   {/* checkbox */}
                <col style={{ width: '22%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '13%' }} />
              </colgroup>

              <thead>
                <tr>
                  <th className={styles.th} style={{ textAlign: 'center' }}>
                    <input
                      ref={headCheckRef}
                      type="checkbox"
                      aria-label="Select all (filtered)"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                    />
                  </th>

                  {/* Sortable headers */}
                  <th className={styles.th} aria-sort={ariaSort('name')}>
                    <button
                      className={styles.linkReset}
                      onClick={() => cycleSort('name')}
                      title="Sort by name"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      Name {indicator('name')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('website')}>
                    <button
                      className={styles.linkReset}
                      onClick={() => cycleSort('website')}
                      title="Sort by website"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      Website {indicator('website')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('email')}>
                    <button
                      className={styles.linkReset}
                      onClick={() => cycleSort('email')}
                      title="Sort by email"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      Email {indicator('email')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('needsNew')}>
                    <button
                      className={styles.linkReset}
                      onClick={() => cycleSort('needsNew')}
                      title="Sort by needs new"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      Needs New? {indicator('needsNew')}
                    </button>
                  </th>
                  <th className={styles.th} aria-sort={ariaSort('type')}>
                    <button
                      className={styles.linkReset}
                      onClick={() => cycleSort('type')}
                      title="Sort by type"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      Type {indicator('type')}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Empty state when there are literally no leads in this tab */}
                {leads.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan={6}
                      className={styles.td}
                      style={{ textAlign: 'center', opacity: 0.7 }}
                    >
                      No leads found in “{selectedTab}”.
                    </td>
                  </tr>
                )}

                {/* Normal rows or filtered empty state */}
                {leads.length > 0 && (
                  <>
                    {sorted.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className={styles.td}
                          style={{ textAlign: 'center', opacity: 0.6 }}
                        >
                          No leads match your filters.
                        </td>
                      </tr>
                    ) : (
                      sorted.map((lead, i) => {
                        const t = normalizeType(lead.type);
                        const k = emailKey(lead);
                        const selectable = !!k;
                        const isChecked = selectable && selectedEmails.has(k);

                        return (
                          <tr key={lead.id ?? `${selectedTab}-${i}`}>
                            <td
                              className={styles.td}
                              style={{ textAlign: 'center' }}
                            >
                              <input
                                type="checkbox"
                                aria-label={
                                  selectable
                                    ? `Select ${lead.name || lead.email || 'lead'}`
                                    : 'No email available'
                                }
                                disabled={!selectable}
                                checked={!!isChecked}
                                onChange={() => toggleOne(lead)}
                                title={!selectable ? 'No email on this row' : undefined}
                              />
                            </td>
                            <td className={styles.td} style={{ wordBreak: 'break-word' }}>
                              {lead.name || '—'}
                            </td>
                            <td className={styles.td} style={{ wordBreak: 'break-word' }}>
                              {lead.website ? (
                                <a href={lead.website} target="_blank" rel="noreferrer">
                                  {lead.website.replace(/^https?:\/\//, '')}
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className={styles.td} style={{ wordBreak: 'break-word' }}>
                              {lead.email || '—'}
                            </td>
                            <td
                              className={styles.td}
                              aria-label={lead.needsNew ? 'Needs new' : 'Does not need new'}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  padding: '2px 8px',
                                  border: '1px solid var(--border)',
                                  borderRadius: 999,
                                  background: 'var(--card)',
                                  display: 'inline-block',
                                  lineHeight: 1.6,
                                  boxShadow: lead.needsNew
                                    ? 'inset 0 0 0 9999px var(--accent-weak)'
                                    : undefined,
                                  borderColor: lead.needsNew ? 'var(--accent)' : undefined,
                                }}
                              >
                                {lead.needsNew ? 'Needs' : 'No'}
                              </span>
                            </td>
                            <td className={styles.td}>
                              {t ? (
                                <span
                                  style={{
                                    fontSize: 12,
                                    padding: '2px 8px',
                                    border: '1px solid var(--border)',
                                    borderRadius: 999,
                                    background: 'var(--card)',
                                    display: 'inline-block',
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {labelType(t)}
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
