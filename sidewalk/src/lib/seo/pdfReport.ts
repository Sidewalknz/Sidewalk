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
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #18181b; line-height: 1.5; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #18181b; }
        .timestamp { font-size: 12px; color: #71717a; }
        .summary { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .card { padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px; text-align: center; }
        .score { font-size: 48px; font-weight: bold; }
        .score-optimized { color: #22c55e; }
        .score-good { color: #f59e0b; }
        .score-poor { color: #ef4444; }
        .label { font-size: 12px; text-transform: uppercase; color: #71717a; margin-top: 5px; }
        h2 { border-bottom: 1px solid #e4e4e7; padding-bottom: 10px; margin-top: 40px; }
        .check-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #f4f4f5; }
        .severity { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-bold; text-transform: uppercase; align-self: flex-start; }
        .sev-critical { background: #fee2e2; color: #991b1b; }
        .sev-warning { background: #fef3c7; color: #92400e; }
        .sev-passed { background: #dcfce7; color: #166534; }
        .recommendation { font-size: 12px; color: #52525b; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8fafc; text-align: left; font-size: 12px; padding: 10px; border-bottom: 1px solid #e2e8f0; }
        td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
        .footer { margin-top: 60px; font-size: 10px; color: #a1a1aa; text-align: center; border-top: 1px solid #e4e4e7; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SIDEWALK SEO REPORT</div>
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
