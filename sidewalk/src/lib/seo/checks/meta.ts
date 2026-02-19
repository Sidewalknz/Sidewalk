import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkMeta($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const description = $('meta[name="description"]').attr('content')?.trim();

  if (!description) {
    checks.push({
      id: 'missing-meta-description',
      severity: 'critical',
      impact: -15,
      message: 'Meta description is missing',
      recommendation: 'Add a <meta name="description" content="..."> tag to help with CTR.',
    });
  } else {
    if (description.length < 120) {
      checks.push({
        id: 'short-meta-description',
        severity: 'warning',
        impact: -5,
        message: `Meta description is a bit short (${description.length} chars)`,
        recommendation: 'Aim for 150-160 characters for a more descriptive snippet.',
        details: [`Current: "${description}"`]
      });
    } else if (description.length > 160) {
      checks.push({
        id: 'long-meta-description',
        severity: 'warning',
        impact: -5,
        message: `Meta description is too long (${description.length} chars)`,
        recommendation: 'Keep descriptions under 160 characters to avoid truncation.',
        details: [`Current: "${description}"`]
      });
    } else {
      checks.push({
        id: 'passed-meta-description',
        severity: 'passed',
        impact: 0,
        message: 'Meta description is optimized',
      });
    }
  }

  return checks;
}
