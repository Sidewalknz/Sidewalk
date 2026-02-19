export type SEOSeverity = 'critical' | 'warning' | 'info' | 'passed';

export interface SEOCheck {
  id: string;
  severity: SEOSeverity;
  impact: number;
  message: string;
  recommendation?: string;
}

export interface SEOReport {
  url: string;
  score: number;
  checks: SEOCheck[];
  criticalCount: number;
  warningCount: number;
  passedCount: number;
  timestamp: string;
}

export interface AuditRequest {
  url: string;
}
