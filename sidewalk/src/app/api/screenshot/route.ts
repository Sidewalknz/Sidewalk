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
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2, // Higher quality
    })

    const page = await context.newPage()

    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Auto-scroll to trigger scroll-based animations and lazy loading
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 400; // Larger distance for faster scroll
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            // Scroll back to top
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
