'use client';

import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, AlertTriangle, CheckCircle, Info, Download, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { SEOReport, SEOCheck } from '@/lib/seo/types';

interface SEOCheckerProps {
  clients: any[];
}

export default function SEOChecker({ clients }: SEOCheckerProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<SEOReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());

  const runAudit = async (auditUrl: string) => {
    if (!auditUrl) return;
    
    let targetUrl = auditUrl;
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run audit');
      }

      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (id: string) => {
    const next = new Set(expandedChecks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedChecks(next);
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const client = clients.find(c => c.id === e.target.value);
    if (client?.website) {
      setUrl(client.website);
    }
  };

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new URL(report.url).hostname}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  const sortedChecks = report?.checks.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, passed: 3 };
    return order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order];
  });

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="p-6 rounded-xl border bg-opacity-50 backdrop-blur-sm"
           style={{ backgroundColor: 'var(--admin-sidebar-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Client</label>
            <select 
              onChange={handleClientSelect}
              className="w-full p-2.5 rounded-lg border bg-transparent focus:ring-2 focus:ring-zinc-500 transition-all outline-none"
              style={{ borderColor: 'var(--admin-sidebar-border)' }}
            >
              <option value="">Manual Entry</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.companyName}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <div className="relative">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-2.5 pl-10 rounded-lg border bg-transparent focus:ring-2 focus:ring-zinc-500 transition-all outline-none"
                style={{ borderColor: 'var(--admin-sidebar-border)' }}
                onKeyDown={(e) => e.key === 'Enter' && runAudit(url)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => runAudit(url)}
            disabled={isLoading || !url}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              backgroundColor: 'var(--admin-accent)', 
              color: 'var(--admin-accent-text)' 
            }}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Run Audit
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {report && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Gauge */}
            <div className="p-8 rounded-xl border flex flex-col items-center justify-center space-y-4"
                 style={{ backgroundColor: 'var(--admin-sidebar-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
              <div className="relative w-40 h-40">
                 {/* Simple SVG Gauge */}
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="var(--admin-sidebar-border)" strokeWidth="8" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke={report.score >= 80 ? '#22c55e' : report.score >= 50 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="8" 
                      strokeDasharray={`${report.score * 2.827} 282.7`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-1000 ease-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{Math.round(report.score)}</span>
                    <span className="text-xs uppercase tracking-wider text-zinc-500">Score</span>
                 </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-lg">
                  {report.score >= 90 ? 'Excellent' : report.score >= 70 ? 'Good' : report.score >= 50 ? 'Needs Work' : 'Poor'}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-500"/> {report.criticalCount}</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500"/> {report.warningCount}</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500"/> {report.passedCount}</span>
                </div>
              </div>
            </div>

            {/* Summary Info */}
            <div className="lg:col-span-2 p-8 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-8"
                 style={{ backgroundColor: 'var(--admin-sidebar-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Audit Summary
                </h3>
                <div className="space-y-2 prose prose-zinc dark:prose-invert max-w-none text-sm">
                  <p>Audit performed on <strong>{new URL(report.url).hostname}</strong></p>
                  <p>We found {report.criticalCount} critical issues and {report.warningCount} warnings.</p>
                  <p>Completed at {new Date(report.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <a 
                  href={report.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  View Live Site <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                  onClick={downloadJson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-all text-sm"
                >
                  <Download className="w-4 h-4" /> Export Report (JSON)
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Checks */}
          <div className="rounded-xl border overflow-hidden"
               style={{ borderColor: 'var(--admin-sidebar-border)' }}>
            <div className="p-4 border-b bg-zinc-500/5 flex justify-between items-center"
                 style={{ borderColor: 'var(--admin-sidebar-border)' }}>
              <h3 className="font-semibold px-2">Detailed Audit Results</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
              {sortedChecks?.map((check) => (
                <div key={check.id} className="group">
                  <button 
                    onClick={() => toggleCheck(check.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-500/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      {getSeverityIcon(check.severity)}
                      <div>
                        <p className="font-medium text-sm">{check.message}</p>
                        <p className="text-xs text-zinc-500 capitalize">{check.id.replace(/-/g, ' ')}</p>
                      </div>
                    </div>
                    {check.recommendation && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        {expandedChecks.has(check.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    )}
                  </button>
                  {check.recommendation && expandedChecks.has(check.id) && (
                    <div className="px-14 pb-4 pt-1 text-sm text-zinc-400 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-3 rounded-lg bg-zinc-500/5 border border-zinc-500/10">
                        <span className="text-xs font-semibold uppercase text-zinc-500 block mb-1">Recommendation</span>
                        {check.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
