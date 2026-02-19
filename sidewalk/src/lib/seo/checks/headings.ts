import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkHeadings($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const h1s = $('h1');

  // H1 Check
  if (h1s.length === 0) {
    checks.push({
      id: 'missing-h1',
      severity: 'critical',
      impact: -15,
      message: 'No H1 heading found',
      recommendation: 'Every page should have exactly one H1 tag as the main title.',
    });
  } else if (h1s.length > 1) {
    const details = h1s.get().map(h => `"${$(h).text().trim()}"`);
    checks.push({
      id: 'multiple-h1s',
      severity: 'warning',
      impact: -10,
      message: `Multiple H1 headings found (${h1s.length})`,
      recommendation: 'Use only one H1 per page for better SEO and accessibility.',
      details
    });
  } else {
    checks.push({
      id: 'passed-h1',
      severity: 'passed',
      impact: 0,
      message: 'Single H1 tag found',
    });
  }

  // Hierarchy Check (Basic)
  const headings = $('h1, h2, h3, h4, h5, h6').get();
  let prevLevel = 0;
  const breaks: string[] = [];

  for (const h of headings) {
    const level = parseInt(h.tagName.substring(1));
    if (level > prevLevel + 1 && prevLevel !== 0) {
      breaks.push(`Skipped from H${prevLevel} to H${level} at "${$(h).text().trim().substring(0, 50)}${$(h).text().trim().length > 50 ? '...' : ''}"`);
    }
    prevLevel = level;
  }

  if (breaks.length > 0) {
    checks.push({
      id: 'broken-heading-hierarchy',
      severity: 'warning',
      impact: -5,
      message: 'Heading hierarchy is skipped',
      recommendation: 'Maintain a logical heading order (H1 -> H2 -> H3) without skipping levels.',
      details: breaks
    });
  } else if (headings.length > 0) {
     checks.push({
      id: 'passed-hierarchy',
      severity: 'passed',
      impact: 0,
      message: 'Heading hierarchy is logical',
    });
  }

  return checks;
}
