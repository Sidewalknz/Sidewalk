import * as cheerio from 'cheerio';
import { auditPage } from './auditPage';
import { SiteCrawlReport, CrawlResult, SEOCheck, LighthouseScores } from './types';
import { checkSiteLevel } from './checks/siteLevel';
import { analyzeContent } from './checks/content';
import { fetchLighthouse } from './checks/lighthouse';

export interface CrawlProgress {
  pagesAudited: number;
  totalDiscovered: number;
  currentUrl: string;
}

export async function crawlSite(
  startUrl: string,
  onProgress?: (progress: CrawlProgress) => void,
  onPageResult?: (result: CrawlResult) => void,
  maxPages = 50,
  seedUrls: string[] = [],
  includeLighthouse = false
): Promise<SiteCrawlReport> {
  const domain = new URL(startUrl).hostname;
  const visited = new Set<string>();
  const queue: string[] = [startUrl, ...seedUrls.filter(u => new URL(u).hostname === domain)];
  const results: CrawlResult[] = [];
  
  let pagesAudited = 0;
  let homepageLighthouse: LighthouseScores | undefined;

  // Cleanup queue to remove duplicates
  const uniqueQueue = Array.from(new Set(queue));
  queue.length = 0;
  queue.push(...uniqueQueue);

  while (queue.length > 0 && pagesAudited < maxPages) {
    const batch = queue.splice(0, 2); // Concurrency: 2
    const batchPromises = batch.map(async (url) => {
      if (visited.has(url)) return null;
      visited.add(url);

      onProgress?.({
        pagesAudited,
        totalDiscovered: queue.length + pagesAudited,
        currentUrl: url,
      });

      try {
        const report = await auditPage(url);
        
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);
        
        // --- Phase 3: Content Analysis ---
        const { analysis: contentAnalysis, checks: contentChecks } = analyzeContent($);
        report.checks.push(...contentChecks);
        
        // --- Phase 3: Lighthouse (First URL only, if requested) ---
        let lighthouse: LighthouseScores | undefined;
        if (includeLighthouse && pagesAudited === 0) {
          const { scores, checks: lhChecks } = await fetchLighthouse(url);
          lighthouse = scores;
          homepageLighthouse = scores;
          report.checks.push(...lhChecks);
        }

        // Extract internal links for further crawling
        $('a[href]').each((_, el) => {
          try {
            const href = $(el).attr('href');
            if (!href) return;
            
            const absoluteUrl = new URL(href, url);
            absoluteUrl.hash = ''; // Remove fragments
            
            const normalizedUrl = absoluteUrl.href;
            if (
              absoluteUrl.hostname === domain && 
              !visited.has(normalizedUrl) && 
              !queue.includes(normalizedUrl)
            ) {
              queue.push(normalizedUrl);
            }
          } catch (e) {}
        });

        const crawlResult: CrawlResult = {
          url,
          status: 200, 
          title: $('title').text().trim(),
          description: $('meta[name="description"]').attr('content') || '',
          h1Count: $('h1').length,
          checks: report.checks,
          score: report.score,
          contentAnalysis,
          lighthouse,
        };

        onPageResult?.(crawlResult);
        pagesAudited++;
        return crawlResult;
      } catch (error) {
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(r => {
      if (r) results.push(r);
    });
  }

  const siteLevelChecks = checkSiteLevel(results);
  
  // Site level metrics
  const criticalCount = siteLevelChecks.filter(c => c.severity === 'critical').length + results.reduce((acc, p) => acc + p.checks.filter(c => c.severity === 'critical').length, 0);
  const warningCount = siteLevelChecks.filter(c => c.severity === 'warning').length + results.reduce((acc, p) => acc + p.checks.filter(c => c.severity === 'warning').length, 0);
  const passedCount = siteLevelChecks.filter(c => c.severity === 'passed').length + results.reduce((acc, p) => acc + p.checks.filter(c => c.severity === 'passed').length, 0);

  const totalPossible = results.length * 100;
  const totalDeductions = results.reduce((acc, p) => acc + (100 - p.score), 0) + siteLevelChecks.reduce((acc, c) => acc + Math.abs(c.impact), 0);
  const siteScore = Math.max(0, 100 - (totalDeductions / results.length));

  return {
    url: startUrl,
    score: Math.round(siteScore),
    pages: results,
    siteLevelChecks,
    criticalCount,
    warningCount,
    passedCount,
    timestamp: new Date().toISOString(),
    lighthouse: homepageLighthouse,
  } as any;
}
