import { SEOCheck, SEOReport } from './types';

export function calculateScore(checks: SEOCheck[]): number {
  let score = 100;
  
  for (const check of checks) {
    if (check.severity === 'critical' || check.severity === 'warning') {
      score += check.impact;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function aggregateReport(url: string, checks: SEOCheck[]): SEOReport {
  const score = calculateScore(checks);
  
  return {
    url,
    score,
    checks,
    criticalCount: checks.filter(c => c.severity === 'critical').length,
    warningCount: checks.filter(c => c.severity === 'warning').length,
    passedCount: checks.filter(c => c.severity === 'passed').length,
    timestamp: new Date().toISOString(),
  };
}
