import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { crawlSite } from '@/lib/seo/crawlSite';
import { checkRobotsTxt, checkSitemap } from '@/lib/seo/checks/prelaunch';
import { PreLaunchReport } from '@/lib/seo/types';

// Simple in-memory lock (shared with main route if possible, but route files are separate)
// NOTE: For a real production app, use Redis for locking if running multiple instances.
let isAuditing = false;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const type = searchParams.get('type') || 'crawl';

  if (!url) {
    return new Response('URL is required', { status: 400 });
  }

  // 1. Auth check
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (isAuditing) {
    return new Response('Another audit is in progress', { status: 429 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        isAuditing = true;
        
        if (type === 'prelaunch') {
          sendEvent('starting-prelaunch', { url });
          
          const [robots, sitemap] = await Promise.all([
            checkRobotsTxt(url),
            checkSitemap(url),
          ]);
          
          sendEvent('prelaunch-checklist', {
            robotsTxt: robots.exists,
            sitemap: sitemap.exists,
            https: url.startsWith('https'),
          });

          // Seed crawler with sitemap URLs
          const report = await crawlSite(
            url,
            (progress) => sendEvent('progress', progress),
            (pageResult) => sendEvent('page-result', pageResult),
            50,
            sitemap.urls,
            true // Include Lighthouse for prelaunch
          );

          const preLaunchReport = {
            ...report,
            isPreLaunch: true,
            checklist: {
              robotsTxt: robots.exists,
              sitemap: sitemap.exists,
              https: url.startsWith('https'),
              brokenLinks: report.pages.reduce((acc, p) => acc + p.checks.filter(c => c.id === 'site-404s').length, 0),
            },
            siteLevelChecks: [
              ...report.siteLevelChecks,
              robots.check,
              sitemap.check,
            ]
          } as PreLaunchReport;

          sendEvent('complete', preLaunchReport);
        } else {
          // Normal crawl
          sendEvent('starting-crawl', { url });
          const report = await crawlSite(
            url,
            (progress) => sendEvent('progress', progress),
            (pageResult) => sendEvent('page-result', pageResult)
          );
          sendEvent('complete', report);
        }

      } catch (error: any) {
        sendEvent('error', { message: error.message });
      } finally {
        isAuditing = false;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
