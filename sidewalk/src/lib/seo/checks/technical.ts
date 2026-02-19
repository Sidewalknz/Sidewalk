import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkTechnical($: CheerioAPI, url: string): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // Canonical Check
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    checks.push({
      id: 'missing-canonical',
      severity: 'warning',
      impact: -10,
      message: 'Missing canonical tag',
      recommendation: 'Add a <link rel="canonical" href="..."> tag to prevent duplicate content issues.',
    });
  } else {
    try {
      const canonicalUrl = new URL(canonical, url).href;
      const currentUrl = new URL(url).href;
      
      if (canonicalUrl !== currentUrl) {
        checks.push({
          id: 'canonical-mismatch',
          severity: 'warning',
          impact: -5,
          message: 'Canonical URL does not match current URL',
          recommendation: 'Ensure canonical points to the primary version of this page.',
        });
      } else {
        checks.push({
          id: 'passed-canonical',
          severity: 'passed',
          impact: 0,
          message: 'Canonical tag is correct',
        });
      }
    } catch (e) {
      checks.push({
        id: 'invalid-canonical',
        severity: 'critical',
        impact: -10,
        message: 'Invalid canonical URL format',
        recommendation: 'Fix the canonical link target URL.',
      });
    }
  }

  // Robots Check
  const robots = $('meta[name="robots"]').attr('content')?.toLowerCase();
  if (robots && (robots.includes('noindex'))) {
    checks.push({
      id: 'noindex-detected',
      severity: 'critical',
      impact: -50,
      message: 'noindex tag detected',
      recommendation: 'Remove noindex if you want this page to be discoverable in search engines.',
    });
  } else {
    checks.push({
      id: 'passed-robots',
      severity: 'passed',
      impact: 0,
      message: 'Page is indexable',
    });
  }

  return checks;
}
