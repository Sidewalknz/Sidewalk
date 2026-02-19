import { LighthouseScores, SEOCheck } from '../types';

export async function fetchLighthouse(url: string, apiKey?: string): Promise<{ scores: LighthouseScores; checks: SEOCheck[] }> {
  try {
    const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    apiUrl.searchParams.append('url', url);
    apiUrl.searchParams.append('category', 'performance');
    apiUrl.searchParams.append('category', 'accessibility');
    apiUrl.searchParams.append('category', 'best-practices');
    apiUrl.searchParams.append('category', 'seo');
    if (apiKey) apiUrl.searchParams.append('key', apiKey);

    const res = await fetch(apiUrl.href);
    if (!res.ok) throw new Error('Lighthouse fetch failed');
    
    const data = await res.json();
    const categories = data.lighthouseResult.categories;
    
    const scores: LighthouseScores = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };

    const checks: SEOCheck[] = [];
    
    // Add checks for each category
    const categoriesList = [
      { id: 'lh-perf', name: 'Lighthouse Performance', score: scores.performance },
      { id: 'lh-a11y', name: 'Lighthouse Accessibility', score: scores.accessibility },
      { id: 'lh-best', name: 'Lighthouse Best Practices', score: scores.bestPractices },
      { id: 'lh-seo', name: 'Lighthouse SEO', score: scores.seo },
    ];

    categoriesList.forEach(c => {
      checks.push({
        id: c.id,
        severity: c.score >= 90 ? 'passed' : c.score >= 50 ? 'warning' : 'critical',
        impact: c.score >= 90 ? 0 : c.score >= 50 ? -5 : -15,
        message: `${c.name} score is ${c.score}/100`,
        recommendation: c.score < 90 ? `Run a full Lighthouse audit for specific ${c.name.split(' ')[1].toLowerCase()} fixes.` : undefined,
      });
    });

    return { scores, checks };
  } catch (e) {
    return {
      scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
      checks: [{
        id: 'lighthouse-failed',
        severity: 'info',
        impact: 0,
        message: 'Lighthouse audit unavailable',
        recommendation: 'Check your internet connection or PageSpeed Insights API status.',
      }]
    };
  }
}
