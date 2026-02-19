import { CheerioAPI } from 'cheerio';
import { SEOCheck } from '../types';

export function checkImages($: CheerioAPI): SEOCheck[] {
  const checks: SEOCheck[] = [];
  const images = $('img');
  
  if (images.length === 0) {
    checks.push({
      id: 'no-images',
      severity: 'passed',
      impact: 0,
      message: 'No images found on page to audit',
    });
    return checks;
  }

  const imagesWithoutAlt = images.filter((_, img) => {
    const alt = $(img).attr('alt');
    return alt === undefined || alt === null || alt.trim() === '';
  });

  const missingAltCount = imagesWithoutAlt.length;
  const totalCount = images.length;
  const coveragePercent = Math.round(((totalCount - missingAltCount) / totalCount) * 100);

  if (missingAltCount > 0) {
    checks.push({
      id: 'missing-alt-tags',
      severity: missingAltCount > 5 ? 'critical' : 'warning',
      impact: missingAltCount > 5 ? -15 : -5,
      message: `${missingAltCount} images are missing alt text (${coveragePercent}% coverage)`,
      recommendation: 'Add descriptive alt text to all informative images for SEO and accessibility.',
    });
  } else {
    checks.push({
      id: 'passed-images',
      severity: 'passed',
      impact: 0,
      message: 'All images have alt text',
    });
  }

  return checks;
}
