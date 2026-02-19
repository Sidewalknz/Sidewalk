import { chromium } from 'playwright';
import { SEOReport, SiteCrawlReport, PreLaunchReport } from './types';

export async function generatePDF(report: any): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const isCrawl = 'pages' in report;
  const isPreLaunch = 'isPreLaunch' in report && report.isPreLaunch;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1C2830; line-height: 1.5; padding: 40px; background-color: #F3ECE3; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D7B350; padding-bottom: 20px; margin-bottom: 30px; }
        .logo svg { height: 40px; width: auto; }
        .timestamp { font-size: 12px; color: #1C2830; opacity: 0.6; font-weight: 600; }
        .summary { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .card { padding: 24px; border: 1px solid rgba(28, 40, 48, 0.1); border-radius: 12px; text-align: center; background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
        .score { font-size: 48px; font-weight: bold; }
        .score-optimized { color: #22c55e; }
        .score-good { color: #D7B350; }
        .score-poor { color: #B74831; }
        .label { font-size: 10px; text-transform: uppercase; color: #1C2830; opacity: 0.6; margin-top: 8px; font-weight: 800; letter-spacing: 0.05em; }
        h2 { border-bottom: 1px solid rgba(28, 40, 48, 0.1); padding-bottom: 10px; margin-top: 40px; font-size: 18px; text-transform: uppercase; letter-spacing: 0.05em; color: #B74831; }
        .check-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid rgba(28, 40, 48, 0.05); }
        .severity { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; align-self: flex-start; min-width: 70px; text-align: center; }
        .sev-critical { background: #B74831; color: white; }
        .sev-warning { background: #D7B350; color: #1C2830; }
        .sev-passed { background: #22c55e; color: white; }
        .recommendation { font-size: 12px; color: #1C2830; opacity: 0.8; margin-top: 5px; }
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; border: 1px solid rgba(28, 40, 48, 0.1); border-radius: 8px; overflow: hidden; background: white; }
        th { background: #1C2830; color: white; text-align: left; font-size: 11px; padding: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 12px; border-bottom: 1px solid rgba(28, 40, 48, 0.05); font-size: 12px; color: #1C2830; }
        tr:last-child td { border-bottom: none; }
        .footer { margin-top: 60px; font-size: 10px; color: #1C2830; opacity: 0.4; text-align: center; border-top: 1px solid rgba(28, 40, 48, 0.1); padding-top: 20px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580.91 170.53">
            <g id="Layer_1-2">
              <path style="fill:#B74831;" d="M62.33,46.69L4.49,56.79C2.14,57.2-.01,55.33,0,52.89L.24,14c.01-1.9,1.36-3.53,3.2-3.85L61.27.06c2.36-.41,4.51,1.45,4.49,3.9l-.24,38.89c-.01,1.9-1.36,3.53-3.2,3.85Z"/>
              <path style="fill:#D7B350;" d="M62.33,103.54l-57.83,10.09C2.14,114.04-.01,112.18,0,109.73l.24-38.89c.01-1.9,1.36-3.53,3.2-3.85l57.83-10.09c2.36-.41,4.51,1.45,4.49,3.9l-.24,38.89c-.01,1.9-1.36,3.53-3.2,3.85Z"/>
              <path style="fill:#1C2830;" d="M62.33,160.38l-57.83,10.09C2.14,170.89-.01,169.02,0,166.58l.24-38.89c.01-1.9,1.36-3.53,3.2-3.85l57.83-10.09c2.36-.41,4.51,1.45,4.49,3.9l-.24,38.89c-.01,1.9-1.36,3.53-3.2,3.85Z"/>
              <path style="fill:#1C2830;" d="M122.22,111.91c.76,1.32,1.74,2.4,2.94,3.24,1.2.84,2.58,1.46,4.14,1.86,1.56.4,3.18.6,4.86.6,1.2,0,2.46-.14,3.78-.42,1.32-.28,2.52-.72,3.6-1.32s1.98-1.4,2.7-2.4c.72-1,1.08-2.26,1.08-3.78,0-2.56-1.7-4.48-5.1-5.76-3.4-1.28-8.14-2.56-14.22-3.84-2.48-.56-4.9-1.22-7.26-1.98-2.36-.76-4.46-1.76-6.3-3-1.84-1.24-3.32-2.8-4.44-4.68-1.12-1.88-1.68-4.18-1.68-6.9,0-4,.78-7.28,2.34-9.84,1.56-2.56,3.62-4.58,6.18-6.06,2.56-1.48,5.44-2.52,8.64-3.12,3.2-.6,6.48-.9,9.84-.9s6.62.32,9.78.96c3.16.64,5.98,1.72,8.46,3.24,2.48,1.52,4.54,3.54,6.18,6.06,1.36,2.08,2.26,4.62,2.72,7.61.15,1.01-.64,1.93-1.66,1.93h-12.84c-.82,0-1.5-.6-1.65-1.41-.46-2.51-1.64-4.26-3.54-5.25-2.24-1.16-4.88-1.74-7.92-1.74-.96,0-2,.06-3.12.18-1.12.12-2.14.38-3.06.78-.92.4-1.7.98-2.34,1.74-.64.76-.96,1.78-.96,3.06,0,1.52.56,2.76,1.68,3.72,1.12.96,2.58,1.74,4.38,2.34s3.86,1.14,6.18,1.62c2.32.48,4.68,1,7.08,1.56,2.48.56,4.9,1.24,7.26,2.04,2.36.8,4.46,1.86,6.3,3.18,1.84,1.32,3.32,2.96,4.44,4.92,1.12,1.96,1.68,4.38,1.68,7.26,0,4.08-.82,7.5-2.46,10.26-1.64,2.76-3.78,4.98-6.42,6.66-2.64,1.68-5.66,2.86-9.06,3.54-3.4.68-6.86,1.02-10.38,1.02s-7.12-.36-10.56-1.08c-3.44-.72-6.5-1.92-9.18-3.6-2.68-1.68-4.88-3.9-6.6-6.66-1.46-2.34-2.35-5.18-2.69-8.52-.1-.99.68-1.86,1.67-1.86h12.83c.85,0,1.55.65,1.66,1.5.15,1.22.5,2.3,1.05,3.25Z"/>
              <path style="fill:#1C2830;" d="M169.44,54.01v-10.69c0-.92.75-1.67,1.67-1.67h13.69c.92,0,1.67.75,1.67,1.67v10.69c0,.92-.75,1.67-1.67,1.67h-13.69c-.92,0-1.67-.75-1.67-1.67ZM186.48,66.96v58.69c0,.92-.75,1.67-1.67,1.67h-13.69c-.92,0-1.67-.75-1.67-1.67v-58.69c0-.92.75-1.67,1.67-1.67h13.69c.92,0,1.67.75,1.67,1.67Z"/>
              <path style="fill:#1C2830;" d="M240.6,119.41c-2,3.36-4.62,5.78-7.86,7.26s-6.9,2.22-10.98,2.22c-4.64,0-8.72-.9-12.24-2.7-3.52-1.8-6.42-4.24-8.7-7.32-2.28-3.08-4-6.62-5.16-10.62-1.16-4-1.74-8.16-1.74-12.48s.58-8.18,1.74-12.06c1.16-3.88,2.88-7.3,5.16-10.26,2.28-2.96,5.14-5.34,8.58-7.14,3.44-1.8,7.44-2.7,12-2.7,3.68,0,7.18.78,10.5,2.34,3.32,1.56,5.94,3.86,7.86,6.9h.24v-29.52c0-.92.75-1.67,1.67-1.67h13.69c.92,0,1.67.75,1.67,1.67v82.33c0,.92-.75,1.67-1.67,1.67h-12.85c-.92,0-1.67-.75-1.67-1.67v-6.25h-.24ZM239.88,88.75c-.48-2.36-1.3-4.44-2.46-6.24-1.16-1.8-2.66-3.26-4.5-4.38-1.84-1.12-4.16-1.68-6.96-1.68s-5.16.56-7.08,1.68c-1.92,1.12-3.46,2.6-4.62,4.44-1.16,1.84-2,3.94-2.52,6.3-.52,2.36-.78,4.82-.78,7.38,0,2.4.28,4.8.84,7.2.56,2.4,1.46,4.54,2.7,6.42,1.24,1.88,2.8,3.4,4.68,4.56,1.88,1.16,4.14,1.74,6.78,1.74,2.8,0,5.14-.56,7.02-1.68,1.88-1.12,3.38-2.62,4.5-4.5,1.12-1.88,1.92-4.02,2.4-6.42.48-2.4.72-4.88.72-7.44s-.24-5.02-.72-7.38Z"/>
              <path style="fill:#1C2830;" d="M284.76,112.45c2.56,2.48,6.24,3.72,11.04,3.72,3.44,0,6.4-.86,8.88-2.58,2.06-1.43,3.46-2.93,4.19-4.49.28-.59.86-.97,1.51-.97h11.49c1.17,0,1.99,1.18,1.57,2.28-2.39,6.26-5.8,10.82-10.24,13.68-4.96,3.2-10.96,4.8-18,4.8-4.88,0-9.28-.78-13.2-2.34-3.92-1.56-7.24-3.78-9.96-6.66-2.72-2.88-4.82-6.32-6.3-10.32-1.48-4-2.22-8.4-2.22-13.2s.76-8.96,2.28-12.96c1.52-4,3.68-7.46,6.48-10.38,2.8-2.92,6.14-5.22,10.02-6.9,3.88-1.68,8.18-2.52,12.9-2.52,5.28,0,9.88,1.02,13.8,3.06,3.92,2.04,7.14,4.78,9.66,8.22,2.52,3.44,4.34,7.36,5.46,11.76.99,3.91,1.42,7.98,1.28,12.2-.03.89-.78,1.6-1.68,1.6h-41.36c-.99,0-1.77.87-1.67,1.85.45,4.57,1.81,7.95,4.07,10.15ZM304.02,79.81c-2.04-2.24-5.14-3.36-9.3-3.36-2.72,0-4.98.46-6.78,1.38-1.8.92-3.24,2.06-4.32,3.42-1.08,1.36-1.84,2.8-2.28,4.32-.21.74-.38,1.43-.51,2.1-.2,1.03.6,1.98,1.65,1.98h23.72c1.09,0,1.9-1.03,1.63-2.08-.84-3.31-2.11-5.89-3.81-7.76Z"/>
              <path style="fill:#1C2830;" d="M386.72,127.33c-.76,0-1.42-.51-1.62-1.25l-10.71-40.39h-.24l-10.24,40.38c-.19.74-.86,1.26-1.62,1.26h-15.11c-.73,0-1.38-.47-1.6-1.17l-18.62-58.69c-.34-1.08.46-2.18,1.6-2.18h14.43c.76,0,1.42.51,1.62,1.24l11.06,40.88h.24l10.01-40.84c.18-.75.86-1.28,1.63-1.28h13.94c.77,0,1.44.52,1.62,1.27l10.24,40.73h.24l11.06-40.76c.2-.73.86-1.24,1.62-1.24h13.95c1.13,0,1.94,1.1,1.6,2.18l-18.5,58.69c-.22.7-.87,1.17-1.6,1.17h-15Z"/>
              <path style="fill:#1C2830;" d="M427.48,84.37c-1.01,0-1.8-.9-1.67-1.9.41-3.16,1.35-5.85,2.82-8.06,1.76-2.64,4-4.76,6.72-6.36,2.72-1.6,5.78-2.74,9.18-3.42,3.4-.68,6.82-1.02,10.26-1.02,3.12,0,6.28.22,9.48.66,3.2.44,6.12,1.3,8.76,2.58,2.64,1.28,4.8,3.06,6.48,5.34,1.68,2.28,2.52,5.3,2.52,9.06v32.28c0,2.8.16,5.48.48,8.04.17,1.38.41,2.57.73,3.58.34,1.08-.46,2.18-1.59,2.18h-13.49c-.76,0-1.42-.51-1.62-1.24-.15-.56-.29-1.12-.4-1.7,0,0,0-.02,0-.03-.24-1.22-1.67-1.78-2.65-1.01-2.19,1.74-4.65,3.03-7.37,3.86-3.68,1.12-7.44,1.68-11.28,1.68-2.96,0-5.72-.36-8.28-1.08-2.56-.72-4.8-1.84-6.72-3.36-1.92-1.52-3.42-3.44-4.5-5.76-1.08-2.32-1.62-5.08-1.62-8.28,0-3.52.62-6.42,1.86-8.7,1.24-2.28,2.84-4.1,4.8-5.46,1.96-1.36,4.2-2.38,6.72-3.06,2.52-.68,5.06-1.22,7.62-1.62,2.56-.4,5.08-.72,7.56-.96,2.48-.24,4.68-.6,6.6-1.08,1.92-.48,3.44-1.18,4.56-2.1,1.12-.92,1.64-2.26,1.56-4.02,0-1.84-.3-3.3-.9-4.38s-1.4-1.92-2.4-2.52c-1-.6-2.16-1-3.48-1.2-1.32-.2-2.74-.3-4.26-.3-3.36,0-6,.72-7.92,2.16-1.65,1.23-2.71,3.17-3.17,5.82-.14.8-.83,1.38-1.64,1.38h-13.74ZM465,99.87c0-1.17-1.16-1.99-2.25-1.57-.15.06-.29.11-.45.16-1.08.36-2.24.66-3.48.9-1.24.24-2.54.44-3.9.6-1.36.16-2.72.36-4.08.6-1.28.24-2.54.56-3.78.96-1.24.4-2.32.94-3.24,1.62-.92.68-1.66,1.54-2.22,2.58-.56,1.04-.84,2.36-.84,3.96s.28,2.8.84,3.84c.56,1.04,1.32,1.86,2.28,2.46.96.6,2.08,1.02,3.36,1.26,1.28.24,2.6.36,3.96.36,3.36,0,5.96-.56,7.8-1.68,1.84-1.12,3.2-2.46,4.08-4.02.88-1.56,1.42-3.14,1.62-4.74.2-1.6.3-2.88.3-3.84v-3.45Z"/>
              <path style="fill:#1C2830;" d="M509.4,43.32v82.33c0,.92-.75,1.67-1.67,1.67h-13.69c-.92,0-1.67-.75-1.67-1.67V43.32c0-.92.75-1.67,1.67-1.67h13.69c.92,0,1.67.75,1.67,1.67Z"/>
              <path style="fill:#1C2830;" d="M538.07,43.32v40.13c0,1.51,1.84,2.25,2.88,1.16l18.1-18.81c.32-.33.75-.51,1.21-.51h15.33c1.5,0,2.24,1.83,1.17,2.87l-19.46,18.96c-.58.56-.67,1.45-.23,2.13l23.55,35.48c.74,1.11-.06,2.6-1.4,2.6h-16.58c-.58,0-1.12-.3-1.43-.8l-15.46-25.15c-.56-.91-1.82-1.07-2.59-.33l-4.59,4.42c-.33.32-.51.75-.51,1.21v18.97c0,.92-.75,1.67-1.67,1.67h-13.69c-.92,0-1.67-.75-1.67-1.67V43.32c0-.92.75-1.67,1.67-1.67h13.69c.92,0,1.67.75,1.67,1.67Z"/>
            </g>
          </svg>
        </div>
        <div class="timestamp">${new Date(report.timestamp).toLocaleDateString()}</div>
      </div>

      <div class="summary">
        <div class="card">
          <div class="score ${report.score >= 90 ? 'score-optimized' : report.score >= 70 ? 'score-good' : 'score-poor'}">
            ${Math.round(report.score)}
          </div>
          <div class="label">Overall Score</div>
        </div>
        <div class="card">
          <div style="font-size: 24px; font-weight: bold;">${report.criticalCount} / ${report.warningCount}</div>
          <div class="label">Critical / Warnings</div>
        </div>
        <div class="card">
          <div style="font-size: 18px; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${new URL(report.url).hostname}
          </div>
          <div class="label">Target Site</div>
        </div>
      </div>

      ${isPreLaunch ? `
        <h2>Pre-Launch Checklist</h2>
        <div style="display: grid; grid-template-cols: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div class="card" style="padding: 10px; background: ${report.checklist.robotsTxt ? '#f0fdf4' : '#fef2f2'}">
            <div style="font-size: 12px;">Robots.txt: ${report.checklist.robotsTxt ? 'YES' : 'NO'}</div>
          </div>
          <div class="card" style="padding: 10px; background: ${report.checklist.sitemap ? '#f0fdf4' : '#fef2f2'}">
            <div style="font-size: 12px;">Sitemap: ${report.checklist.sitemap ? 'YES' : 'NO'}</div>
          </div>
          <div class="card" style="padding: 10px; background: ${report.checklist.https ? '#f0fdf4' : '#fef2f2'}">
            <div style="font-size: 12px;">HTTPS: ${report.checklist.https ? 'YES' : 'NO'}</div>
          </div>
          <div class="card" style="padding: 10px; background: ${report.checklist.brokenLinks === 0 ? '#f0fdf4' : '#fef2f2'}">
            <div style="font-size: 12px;">Broken Links: ${report.checklist.brokenLinks}</div>
          </div>
        </div>
      ` : ''}

      ${isCrawl ? `
        <h2>Site-Wide Issues</h2>
        ${report.siteLevelChecks.map((check: any) => `
          <div class="check-item">
            <span class="severity sev-${check.severity}">${check.severity}</span>
            <div>
              <div style="font-weight: 600; font-size: 14px;">${check.message}</div>
              ${check.recommendation ? `<div class="recommendation">${check.recommendation}</div>` : ''}
            </div>
          </div>
        `).join('')}

        <h2>Crawled Pages Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Score</th>
              <th>URL</th>
              <th>Issues (C/W)</th>
            </tr>
          </thead>
          <tbody>
            ${report.pages.map((p: any) => `
              <tr>
                <td>${p.status}</td>
                <td style="font-weight: bold; color: ${p.score >= 80 ? '#22c55e' : p.score >= 50 ? '#f59e0b' : '#ef4444'}">${p.score}</td>
                <td>${p.url}</td>
                <td>${p.checks.filter((c: any) => c.severity === 'critical').length} / ${p.checks.filter((c: any) => c.severity === 'warning').length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <h2>Detailed Checks</h2>
        ${report.checks.filter((c: any) => c.severity !== 'passed').map((check: any) => `
          <div class="check-item">
            <span class="severity sev-${check.severity}">${check.severity}</span>
            <div>
              <div style="font-weight: 600; font-size: 14px;">${check.message}</div>
              ${check.recommendation ? `<div class="recommendation">${check.recommendation}</div>` : ''}
            </div>
          </div>
        `).join('')}
      `}

      <div class="footer">
        Generated by Sidewalk SEO Checker &bull; Confidential Agency Report
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    printBackground: true
  });

  await browser.close();
  return pdfBuffer;
}
