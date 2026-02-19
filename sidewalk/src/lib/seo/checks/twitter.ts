import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkTwitter($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const twitterTags = [
    { name: 'twitter:card', message: 'Missing twitter:card tag' },
    { name: 'twitter:title', message: 'Missing twitter:title tag' },
    { name: 'twitter:image', message: 'Missing twitter:image tag' },
  ];

  for (const tag of twitterTags) {
    if (!$(`meta[name="${tag.name}"]`).attr('content')) {
      checks.push({
        id: `missing-${tag.name.replace(':', '-')}`,
        severity: 'info',
        impact: 0,
        message: tag.message,
        recommendation: `Add a ${tag.name} tag to control how your page looks when shared on X/Twitter.`,
      });
    }
  }

  if (checks.length === 0) {
    checks.push({
      id: 'passed-twitter',
      severity: 'passed',
      impact: 0,
      message: 'Twitter card tags are present',
    });
  }

  return checks;
}
