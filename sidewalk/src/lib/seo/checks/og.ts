import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkOG($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const ogTags = [
    { property: 'og:title', message: 'Missing og:title tag' },
    { property: 'og:description', message: 'Missing og:description tag' },
    { property: 'og:image', message: 'Missing og:image tag' },
  ];

  for (const tag of ogTags) {
    if (!$(`meta[property="${tag.property}"]`).attr('content')) {
      checks.push({
        id: `missing-${tag.property.replace(':', '-')}`,
        severity: 'info',
        impact: 0,
        message: tag.message,
        recommendation: `Add an ${tag.property} tag to control how your page looks when shared on Facebook and LinkedIn.`,
      });
    }
  }

  if (checks.length === 0) {
    checks.push({
      id: 'passed-og',
      severity: 'passed',
      impact: 0,
      message: 'OpenGraph tags are present',
    });
  }

  return checks;
}
