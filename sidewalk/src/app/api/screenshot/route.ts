import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { url, waitTime = 3000 } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    browser = await chromium.launch({
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu', // Critical for preventing black video frames in headless
        '--disable-software-rasterizer'
      ]
    })

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2, 
      ignoreHTTPSErrors: true
    })

    const page = await context.newPage()

    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Auto-scroll to trigger scroll-based animations and lazy loading
    await page.evaluate(async () => {
      // 1. Ensure videos are ready (not black)
      const videos = Array.from(document.querySelectorAll('video'));
      await Promise.all(videos.map(v => {
          if (v.readyState >= 2) return Promise.resolve();
          return new Promise((resolve) => {
              v.addEventListener('loadeddata', resolve, { once: true });
              setTimeout(resolve, 2000); // Fail-safe
          });
      }));

      // 2. Play all videos briefly to ensure frame is rendered
      videos.forEach(v => {
          v.play().catch(() => {});
          v.muted = true;
      });

      // 3. Perform scroll
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 400; 
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });

    // Additional wait for fade-in animations if specified
    if (waitTime > 0) {
      await page.waitForTimeout(waitTime)
    }

    // Take a full page screenshot
    const buffer = await page.screenshot({ 
      fullPage: true,
      type: 'png'
    })

    const base64Screenshot = `data:image/png;base64,${buffer.toString('base64')}`

    return NextResponse.json({ screenshot: base64Screenshot })

  } catch (error: any) {
    console.error('Screenshot error:', error)
    return NextResponse.json({ error: error.message || 'Failed to capture screenshot' }, { status: 500 })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
