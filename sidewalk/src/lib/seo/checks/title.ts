import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkTitle($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const title = $('title').text().trim();

  if (!title) {
    checks.push({
      id: 'missing-title',
      severity: 'critical',
      impact: -20,
      message: 'Page title is missing',
      recommendation: 'Add a <title> tag within the <head> of your document.',
    });
  } else {
    if (title.length < 50) {
      checks.push({
        id: 'short-title',
        severity: 'warning',
        impact: -5,
        message: `Title is too short (${title.length} chars)`,
        recommendation: 'Aim for 50-60 characters to maximize SERP visibility.',
        details: [`Current: "${title}"`]
      });
    } else if (title.length > 60) {
      checks.push({
        id: 'long-title',
        severity: 'warning',
        impact: -5,
        message: `Title is too long (${title.length} chars)`,
        recommendation: 'Keep titles under 60 characters to avoid truncation in search results.',
        details: [`Current: "${title}"`]
      });
    } else {
      checks.push({
        id: 'passed-title',
        severity: 'passed',
        impact: 0,
        message: 'Title is optimized',
      });
    }
  }

  return checks;
}
