import * as cheerio from 'cheerio';
import { checkTitle } from './checks/title';
import { checkMeta } from './checks/meta';
import { checkHeadings } from './checks/headings';
import { checkImages } from './checks/images';
import { checkTechnical } from './checks/technical';
import { checkOG } from './checks/og';
import { checkTwitter } from './checks/twitter';
import { aggregateReport } from './scoring';
import { SEOReport } from './types';

export async function auditPage(url: string): Promise<SEOReport> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000), // 10s timeout
      headers: {
        'User-Agent': 'Sidewalk-SEO-Checker/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
        // We'll still try to parse it if we can
    }

    // Limit to 2MB
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    let chunks = [];
    let totalLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalLength += value.length;
      if (totalLength > 2 * 1024 * 1024) {
        break; // Stop at 2MB
      }
    }
    const html = new TextDecoder().decode(Buffer.concat(chunks));

    const $ = cheerio.load(html);

    const checks = [
      ...checkTitle($),
      ...checkMeta($),
      ...checkHeadings($),
      ...checkImages($),
      ...checkTechnical($, url),
      ...checkOG($),
      ...checkTwitter($),
    ];

    return aggregateReport(url, checks);
  } catch (error: any) {
    return {
      url,
      score: 0,
      checks: [
        {
          id: 'fetch-failed',
          severity: 'critical',
          impact: -100,
          message: `Could not audit page: ${error.message}`,
          recommendation: 'Ensure the URL is accessible and the server is responding.',
        },
      ],
      criticalCount: 1,
      warningCount: 0,
      passedCount: 0,
      timestamp: new Date().toISOString(),
    };
  }
}
