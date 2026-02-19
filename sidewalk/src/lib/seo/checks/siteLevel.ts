import { CrawlResult, SEOCheck } from '../types';

export function checkSiteLevel(pages: CrawlResult[]): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // 1. Duplicate Titles
  const titleMap = new Map<string, string[]>();
  pages.forEach(p => {
    if (p.title) {
      const urls = titleMap.get(p.title) || [];
      urls.push(p.url);
      titleMap.set(p.title, urls);
    }
  });

  const duplicateTitles = Array.from(titleMap.entries()).filter(([_, urls]) => urls.length > 1);
  if (duplicateTitles.length > 0) {
    const details = duplicateTitles.slice(0, 5).map(([title, urls]) => 
      `"${title}": used on ${urls.length} pages (e.g., ${urls[0].replace(new URL(urls[0]).origin, '')})`
    );
    if (duplicateTitles.length > 5) details.push(`...and ${duplicateTitles.length - 5} more duplicate groups`);

    checks.push({
      id: 'duplicate-titles',
      severity: 'warning',
      impact: -10,
      message: `Duplicate titles found across ${duplicateTitles.length} page groups`,
      recommendation: 'Each page should have a unique title tag to avoid competition in SERPs.',
      details
    });
  } else {
    checks.push({
      id: 'passed-duplicate-titles',
      severity: 'passed',
      impact: 0,
      message: 'No duplicate titles found',
    });
  }

  // 2. Duplicate Meta Descriptions
  const metaMap = new Map<string, string[]>();
  pages.forEach(p => {
    if (p.description) {
      const urls = metaMap.get(p.description) || [];
      urls.push(p.url);
      metaMap.set(p.description, urls);
    }
  });

  const duplicateMetas = Array.from(metaMap.entries()).filter(([_, urls]) => urls.length > 1);
  if (duplicateMetas.length > 0) {
    const details = duplicateMetas.slice(0, 5).map(([meta, urls]) =>
      `"${meta.substring(0, 50)}...": used on ${urls.length} pages (e.g., ${urls[0].replace(new URL(urls[0]).origin, '')})`
    );
    if (duplicateMetas.length > 5) details.push(`...and ${duplicateMetas.length - 5} more duplicate groups`);

    checks.push({
      id: 'duplicate-meta-descriptions',
      severity: 'warning',
      impact: -10,
      message: `Duplicate meta descriptions found across ${duplicateMetas.length} page groups`,
      recommendation: 'Unique meta descriptions help search engines and users understand page differences.',
      details
    });
  } else {
    checks.push({
      id: 'passed-duplicate-metas',
      severity: 'passed',
      impact: 0,
      message: 'No duplicate meta descriptions found',
    });
  }

  // 3. 404 Pages
  const notFoundPages = pages.filter(p => p.status === 404);
  if (notFoundPages.length > 0) {
    const details = notFoundPages.slice(0, 10).map(p => p.url.replace(new URL(p.url).origin, ''));
    if (notFoundPages.length > 10) details.push(`...and ${notFoundPages.length - 10} more 404s`);

    checks.push({
      id: 'site-404s',
      severity: 'critical',
      impact: -20,
      message: `${notFoundPages.length} pages returned 404 Not Found`,
      recommendation: 'Fix or redirect broken pages to maintain link equity and user experience.',
      details
    });
  } else {
    checks.push({
      id: 'passed-404s',
      severity: 'passed',
      impact: 0,
      message: 'No 404 errors detected during crawl',
    });
  }

  // 4. Missing H1s
  const missingH1s = pages.filter(p => p.h1Count === 0);
  if (missingH1s.length > 0) {
    const details = missingH1s.slice(0, 10).map(p => p.url.replace(new URL(p.url).origin, ''));
    if (missingH1s.length > 10) details.push(`...and ${missingH1s.length - 10} more pages`);

    checks.push({
      id: 'site-missing-h1s',
      severity: 'warning',
      impact: -5,
      message: `${missingH1s.length} pages are missing an H1 heading`,
      recommendation: 'Ensure every page has one primary H1 tag for structure.',
      details
    });
  }

  return checks;
}
