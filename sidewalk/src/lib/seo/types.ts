export type SEOSeverity = 'critical' | 'warning' | 'info' | 'passed';

export interface SEOCheck {
  id: string;
  severity: SEOSeverity;
  impact: number;
  message: string;
  recommendation?: string;
}

export interface SEOReport {
  url: string;
  score: number;
  checks: SEOCheck[];
  criticalCount: number;
  warningCount: number;
  passedCount: number;
  timestamp: string;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface ContentAnalysis {
  wordCount: number;
  readingLevel: string;
  keywordDensity: { phrase: string; density: number }[];
  contentRatio: number; // Text to HTML ratio
}

export interface CrawlResult {
  url: string;
  status: number;
  title: string;
  description: string;
  h1Count: number;
  checks: SEOCheck[];
  score: number;
  contentAnalysis?: ContentAnalysis;
  lighthouse?: LighthouseScores;
}

export interface SiteCrawlReport {
  url: string;
  score: number;
  pages: CrawlResult[];
  siteLevelChecks: SEOCheck[];
  criticalCount: number;
  warningCount: number;
  passedCount: number;
  timestamp: string;
}

export interface PreLaunchReport extends SiteCrawlReport {
  isPreLaunch: true;
  checklist: {
    robotsTxt: boolean;
    sitemap: boolean;
    https: boolean;
    brokenLinks: number;
  };
}

export interface AuditRequest {
  url: string;
  type?: 'single' | 'crawl' | 'prelaunch';
}
