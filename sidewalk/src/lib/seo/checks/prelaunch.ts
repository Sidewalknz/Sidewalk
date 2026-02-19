import { SEOCheck } from '../types';

export async function checkRobotsTxt(baseUrl: string): Promise<{ exists: boolean; check: SEOCheck }> {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    const res = await fetch(robotsUrl);
    
    if (res.ok) {
      const text = await res.text();
      const isBlockingAll = text.includes('Disallow: /') && !text.includes('Disallow: / ');
      
      return {
        exists: true,
        check: {
          id: 'robots-txt',
          severity: isBlockingAll ? 'critical' : 'passed',
          impact: isBlockingAll ? -50 : 0,
          message: isBlockingAll ? 'robots.txt is blocking search engines' : 'robots.txt exists and is accessible',
          recommendation: isBlockingAll ? 'Check Disallow rules in robots.txt before launch.' : undefined,
        }
      };
    }
  } catch (e) {}
  
  return {
    exists: false,
    check: {
      id: 'robots-txt-missing',
      severity: 'warning',
      impact: -5,
      message: 'robots.txt not found',
      recommendation: 'Add a robots.txt file to guide search engine crawlers.',
    }
  };
}

export async function checkSitemap(baseUrl: string): Promise<{ exists: boolean; check: SEOCheck; urls: string[] }> {
  try {
    const sitemapUrl = new URL('/sitemap.xml', baseUrl).href;
    const res = await fetch(sitemapUrl);
    
    if (res.ok) {
      const text = await res.text();
      const urls: string[] = [];
      const locMatches = text.match(/<loc>(.*?)<\/loc>/g);
      
      if (locMatches) {
        locMatches.forEach(match => {
          const u = match.replace(/<\/?loc>/g, '');
          if (u.startsWith('http')) urls.push(u);
        });
      }

      return {
        exists: true,
        check: {
          id: 'sitemap-xml',
          severity: 'passed',
          impact: 0,
          message: `sitemap.xml found with ${urls.length} internal URLs`,
        },
        urls
      };
    }
  } catch (e) {}
  
  return {
    exists: false,
    urls: [],
    check: {
      id: 'sitemap-xml-missing',
      severity: 'warning',
      impact: -10,
      message: 'sitemap.xml not found',
      recommendation: 'A sitemap helps search engines discover your pages faster.',
    }
  };
}
