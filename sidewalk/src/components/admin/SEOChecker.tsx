'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, AlertCircle, AlertTriangle, CheckCircle, Info, Download, ChevronDown, ChevronRight, ExternalLink, Globe, Rocket, FileText, Zap, FileDown, BookOpen, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { SEOReport, SEOCheck, CrawlResult, SiteCrawlReport, PreLaunchReport, LighthouseScores, ContentAnalysis } from '@/lib/seo/types';

interface SEOCheckerProps {
  clients: any[];
}

type TabType = 'single' | 'crawl' | 'prelaunch';

export default function SEOChecker({ clients }: SEOCheckerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
  
  // Crawl states
  const [crawlProgress, setCrawlProgress] = useState<{ pagesAudited: number; totalDiscovered: number; currentUrl: string } | null>(null);
  const [crawledPages, setCrawledPages] = useState<CrawlResult[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const runSingleAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    try {
      const response = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, type: 'single' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Audit failed');
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runStreamAudit = async (targetUrl: string, type: 'crawl' | 'prelaunch') => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    setCrawlProgress(null);
    setCrawledPages([]);
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/seo-audit/stream?url=${encodeURIComponent(targetUrl)}&type=${type}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Crawl failed to start');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += new TextDecoder().decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('event: ')) continue;
          
          const eventMatch = line.match(/event: (.+)\ndata: (.+)/s);
          if (!eventMatch) continue;

          const [, event, dataStr] = eventMatch;
          const data = JSON.parse(dataStr);

          if (event === 'progress') {
            setCrawlProgress(data);
          } else if (event === 'page-result') {
            setCrawledPages(prev => [...prev, data]);
          } else if (event === 'complete') {
            setReport(data);
            setIsLoading(false);
          } else if (event === 'error') {
            throw new Error(data.message);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;
    setIsExporting(true);
    try {
      const response = await fetch('/api/seo-audit/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seo-report-${new URL(report.url).hostname}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

    if (activeTab === 'single') runSingleAudit(targetUrl);
    else runStreamAudit(targetUrl, activeTab);
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const client = clients.find(c => c.id === e.target.value);
    if (client?.website) setUrl(client.website);
  };

  const toggleCheck = (id: string) => {
    const next = new Set(expandedChecks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedChecks(next);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const MiniGauge = ({ score, label, size = "sm" }: { score: number, label: string, size?: "sm" | "md" }) => (
    <div className="flex flex-col items-center gap-1.5">
        <div className={clsx("relative", size === "sm" ? "w-10 h-10" : "w-16 h-16")}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" />
                <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={score >= 90 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'} 
                    strokeWidth="10" 
                    strokeDasharray={`${score * 2.827} 282.7`}
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={clsx("font-bold text-[var(--admin-text)]", size === "sm" ? "text-[10px]" : "text-sm")}>{score}</span>
            </div>
        </div>
        <span className="text-[10px] text-[var(--admin-text-muted)] font-medium uppercase tracking-tighter">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-[var(--admin-sidebar-border)]">
        {[
          { id: 'single', label: 'Single Page', icon: FileText },
          { id: 'crawl', label: 'Site Crawl', icon: Globe },
          { id: 'prelaunch', label: 'Pre-Launch', icon: Rocket },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id as TabType); setReport(null); setError(null); }}
            className={clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all",
              activeTab === t.id 
                ? "border-[var(--admin-accent)] text-[var(--admin-text)] bg-[var(--admin-hover)]" 
                : "border-transparent text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border backdrop-blur-sm space-y-4 shadow-sm"
           style={{ backgroundColor: 'var(--admin-sidebar-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">Select Client</label>
            <select 
              onChange={handleClientSelect}
              className="w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--admin-accent)] transition-all outline-none text-sm shadow-sm"
              style={{ backgroundColor: 'var(--admin-bg)', borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
            >
              <option value="">Manual Entry</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.companyName}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-text-muted)]">Target URL</label>
            <div className="relative">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-2.5 pl-10 rounded-lg border focus:ring-2 focus:ring-[var(--admin-accent)] transition-all outline-none text-sm shadow-sm"
                style={{ backgroundColor: 'var(--admin-bg)', borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
            <div className="text-xs text-[var(--admin-text-muted)] italic max-w-sm">
                {activeTab === 'single' && "Audits the current URL + Content Quality & Lighthouse."}
                {activeTab === 'crawl' && "Crawls up to 50 internal pages from Sitemap & Links."}
                {activeTab === 'prelaunch' && "Full site audit + Robots.txt, Sitemap, HTTPS & Lighthouse."}
            </div>
            <button 
                type="submit"
                disabled={isLoading || !url}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 hover:brightness-110 active:scale-[0.98] shadow-md"
                style={{ backgroundColor: 'var(--admin-accent)', color: 'var(--admin-accent-text, #FFF)' }}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {activeTab === 'single' ? 'Run Audit' : activeTab === 'crawl' ? 'Start Crawl' : 'Run Pre-Launch QA'}
            </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </form>

      {/* Progress Section */}
      {isLoading && crawlProgress && (
        <div className="p-6 rounded-xl border bg-[var(--admin-sidebar-bg)] border-[var(--admin-sidebar-border)] animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--admin-accent)]" />
                    <div>
                        <h4 className="text-sm font-medium text-[var(--admin-text)]">Auditing Site...</h4>
                        <p className="text-xs text-[var(--admin-text-muted)] truncate max-w-md">{crawlProgress.currentUrl}</p>
                    </div>
                </div>
                <span className="text-sm font-mono text-[var(--admin-text-muted)]">{crawlProgress.pagesAudited} / {Math.min(50, crawlProgress.totalDiscovered)} pages</span>
            </div>
            <div className="w-full h-2 bg-[var(--admin-bg)] rounded-full overflow-hidden border border-[var(--admin-sidebar-border)]">
                <div 
                    className="h-full bg-[var(--admin-accent)] transition-all duration-300"
                    style={{ width: `${(crawlProgress.pagesAudited / Math.min(50, Math.max(1, crawlProgress.totalDiscovered))) * 100}%` }}
                />
            </div>
        </div>
      )}

      {/* Results Section */}
      {report && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-20">
          
          {/* Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border flex flex-col items-center justify-center space-y-3 bg-[var(--admin-sidebar-bg)] border-[var(--admin-sidebar-border)] shadow-sm">
                <MiniGauge score={Math.round(report.score)} label="SEO Score" size="md" />
                <div className="text-center">
                    <p className="text-sm font-bold text-[var(--admin-text)]">{report.score >= 90 ? 'Optimized' : report.score >= 70 ? 'Good' : 'Needs Repair'}</p>
                </div>
            </div>

            <div className="p-6 rounded-xl border bg-[var(--admin-sidebar-bg)] border-[var(--admin-sidebar-border)] flex flex-col justify-center shadow-sm">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--admin-text-muted)] mb-4">Issue Breakdown</p>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 self-start font-medium text-[var(--admin-text)]"><AlertCircle className="w-4 h-4 text-red-500"/> Critical</span>
                        <span className="font-bold text-[var(--admin-text)]">{report.criticalCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 self-start font-medium text-[var(--admin-text)]"><AlertTriangle className="w-4 h-4 text-amber-500"/> Warnings</span>
                        <span className="font-bold text-[var(--admin-text)]">{report.warningCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 self-start font-medium text-[var(--admin-text)]"><CheckCircle className="w-4 h-4 text-green-500"/> Passed</span>
                        <span className="font-bold text-[var(--admin-text)]">{report.passedCount}</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 p-6 rounded-xl border bg-[var(--admin-sidebar-bg)] border-[var(--admin-sidebar-border)] flex flex-col justify-between shadow-sm">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--admin-text-muted)]">Audit Details</p>
                            <h3 className="font-bold flex items-center gap-2 truncate text-[var(--admin-text)] mt-1">
                                {new URL(report.url).hostname}
                            </h3>
                        </div>
                        {report.lighthouse && (
                            <div className="flex gap-4 p-2 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-sidebar-border)] shadow-inner">
                                <MiniGauge score={report.lighthouse.performance} label="Perf" />
                                <MiniGauge score={report.lighthouse.accessibility} label="A11y" />
                                <MiniGauge score={report.lighthouse.bestPractices} label="Best" />
                                <MiniGauge score={report.lighthouse.seo} label="SEO" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">
                        {report.pages ? `Crawled ${report.pages.length} pages` : 'Single page audit'} • {new Date(report.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex gap-3 mt-4">
                    <button onClick={handleExportPDF} disabled={isExporting}
                       className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--admin-bg)] text-xs font-bold text-[var(--admin-text)] border border-[var(--admin-sidebar-border)] hover:bg-[var(--admin-hover)] transition-all disabled:opacity-50 shadow-sm">
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin"/> : <FileDown className="w-3 h-3" />} Export PDF
                    </button>
                    <button onClick={() => {
                        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `seo-report-${new URL(report.url).hostname}.json`;
                        link.click();
                    }} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--admin-bg)] text-xs font-bold text-[var(--admin-text)] border border-[var(--admin-sidebar-border)] hover:bg-[var(--admin-hover)] transition-all shadow-sm">
                        <Download className="w-3 h-3" /> Export JSON
                    </button>
                </div>
            </div>
          </div>

          {/* Site-Level Checklist (Pre-launch only) */}
          {report.isPreLaunch && (
            <div className="p-6 rounded-xl border bg-[var(--admin-sidebar-bg)] border-[var(--admin-sidebar-border)] shadow-sm">
                <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest text-[var(--admin-text-muted)]">Pre-Launch Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Robots.txt', status: report.checklist.robotsTxt },
                        { label: 'Sitemap.xml', status: report.checklist.sitemap },
                        { label: 'HTTPS Protocol', status: report.checklist.https },
                        { label: 'Broken Links', status: report.checklist.brokenLinks === 0 },
                    ].map(item => (
                        <div key={item.label} className="p-4 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-sidebar-border)] flex items-center justify-between shadow-sm">
                            <span className="text-sm font-medium text-[var(--admin-text)]">{item.label}</span>
                            {item.status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Detailed Checks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Site/Page Issues */}
            <div className="lg:col-span-2 space-y-4">
                {/* Site Level Issues (if crawl) */}
               {report.siteLevelChecks && report.siteLevelChecks.length > 0 && (
                 <div className="rounded-xl border border-[var(--admin-sidebar-border)] overflow-hidden bg-[var(--admin-sidebar-bg)] shadow-sm">
                    <div className="px-4 py-3 bg-[var(--admin-sidebar-bg)] border-b border-[var(--admin-sidebar-border)]">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)]">Site-Wide Observations</h4>
                    </div>
                    <div className="divide-y divide-[var(--admin-sidebar-border)]">
                        {report.siteLevelChecks.map((check: SEOCheck) => (
                            <div key={check.id} className="p-4 hover:bg-[var(--admin-hover)] transition-all">
                                <div className="flex items-start gap-4">
                                    {getSeverityIcon(check.severity)}
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[var(--admin-text)]">{check.message}</p>
                                        {check.recommendation && <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">{check.recommendation}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
               )}

                {/* Crawled Pages Table (if crawl) */}
               {report.pages && (
                 <div className="rounded-xl border border-[var(--admin-sidebar-border)] overflow-hidden bg-[var(--admin-sidebar-bg)] shadow-sm">
                    <div className="px-4 py-3 bg-[var(--admin-sidebar-bg)] border-b border-[var(--admin-sidebar-border)] flex justify-between items-center">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)]">Crawled Pages</h4>
                        <span className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-tight">{report.pages.length} pages found</span>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-[var(--admin-sidebar-bg)] z-10 text-[10px] text-[var(--admin-text-muted)] uppercase border-b border-[var(--admin-sidebar-border)]">
                                <tr className="border-b border-[var(--admin-sidebar-border)]">
                                    <th className="px-4 py-3 font-bold tracking-widest">Status</th>
                                    <th className="px-4 py-3 font-bold tracking-widest text-center">Score</th>
                                    <th className="px-4 py-3 font-bold tracking-widest">URL / Title</th>
                                    <th className="px-4 py-3 font-bold tracking-widest">Content</th>
                                    <th className="px-4 py-3 font-bold tracking-widest text-right">Issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-sidebar-border)]">
                                {report.pages.map((p: any) => (
                                    <tr key={p.url} className="hover:bg-[var(--admin-hover)] transition-all">
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded text-[10px] font-bold border",
                                                p.status === 200 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={clsx(
                                                "font-mono font-bold",
                                                p.score >= 80 ? "text-green-500" : p.score >= 50 ? "text-amber-500" : "text-red-500"
                                            )}>{p.score}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="truncate font-bold text-[var(--admin-text)] max-w-[200px]">{p.title || 'Untitled Page'}</div>
                                            <div className="truncate text-[10px] text-[var(--admin-text-muted)] font-medium max-w-[200px]">{p.url}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.contentAnalysis && (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--admin-text-muted)]"><FileText className="w-2.5 h-2.5"/> {p.contentAnalysis.wordCount} words</span>
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--admin-text-muted)] uppercase"><BookOpen className="w-2.5 h-2.5"/> {p.contentAnalysis.readingLevel}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {p.checks.filter((c: any) => c.severity === 'critical').length > 0 && (
                                                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                                )}
                                                {p.checks.filter((c: any) => c.severity === 'warning').length > 0 && (
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
               )}

               {/* Single Page Content Insight */}
                {activeTab === 'single' && report.contentAnalysis && (
                    <div className="p-6 rounded-xl border border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar-bg)] shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-4 h-4 text-[var(--admin-accent)]" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)]">Content Insights</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-[var(--admin-text-muted)] font-bold tracking-widest">Word Count</p>
                                <p className="text-lg font-bold text-[var(--admin-text)]">{report.contentAnalysis.wordCount}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-[var(--admin-text-muted)] font-bold tracking-widest">Readability</p>
                                <p className="text-lg font-bold text-[var(--admin-text)] uppercase">{report.contentAnalysis.readingLevel}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-[var(--admin-text-muted)] font-bold tracking-widest">Top Keyword</p>
                                <p className="text-lg font-bold truncate text-[var(--admin-text)]">
                                    {report.contentAnalysis.keywordDensity[0]?.phrase || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-[var(--admin-text-muted)] font-bold tracking-widest">Text Ratio</p>
                                <p className="text-lg font-bold text-[var(--admin-text)]">{report.contentAnalysis.contentRatio}%</p>
                            </div>
                        </div>
                    </div>
                )}

               {/* Detailed Checks Section */}
               {report.checks && (
                 <div className="rounded-xl border border-[var(--admin-sidebar-border)] divide-y divide-[var(--admin-sidebar-border)] overflow-hidden bg-[var(--admin-sidebar-bg)] shadow-sm">
                    {report.checks.sort((a: any, b: any) => {
                        const order = { critical: 0, warning: 1, info: 2, passed: 3 };
                        return order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order];
                    }).map((check: SEOCheck) => (
                        <div key={check.id} className="group">
                            <button 
                                onClick={() => toggleCheck(check.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-[var(--admin-hover)] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {getSeverityIcon(check.severity)}
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-[var(--admin-text)]">{check.message}</p>
                                        <p className="text-[10px] text-[var(--admin-text-muted)] font-bold uppercase tracking-widest">{check.id.replace(/-/g, ' ')}</p>
                                    </div>
                                </div>
                                {check.recommendation && (
                                    <div className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)] transition-all">
                                        {expandedChecks.has(check.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>
                                )}
                            </button>
                            {check.recommendation && expandedChecks.has(check.id) && (
                                <div className="px-14 pb-4 animate-in slide-in-from-top-1 duration-200">
                                    <div className="p-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-sidebar-border)] text-xs text-[var(--admin-text-muted)] font-medium leading-relaxed shadow-inner">
                                        <span className="text-[9px] font-bold uppercase text-[var(--admin-accent)] block mb-1 tracking-widest">Recommendation</span>
                                        {check.recommendation}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Side info / Legend */}
            <div className="space-y-6">
                <div className="p-6 rounded-xl border border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar-bg)] shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)] mb-4">Severity Guide</h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-1 h-8 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                            <div>
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Critical</p>
                                <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5 font-medium italic leading-tight">High impact. Prevents indexing or major user experience issues.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1 h-8 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                            <div>
                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Warning</p>
                                <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5 font-medium italic leading-tight">Medium impact. Sub-optimal for SEO performance and ranking.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Info</p>
                                <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5 font-medium italic leading-tight">Best practices. General improvements for metadata and social.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
