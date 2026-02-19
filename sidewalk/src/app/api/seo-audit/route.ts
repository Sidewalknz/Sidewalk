import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { auditPage } from '@/lib/seo/auditPage';

// Simple in-memory lock to prevent concurrent audits on the same server instance
let isAuditing = false;

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Lock check
    if (isAuditing) {
      return NextResponse.json({ error: 'An audit is already in progress. Please try again in a few seconds.' }, { status: 429 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 3. Run audit
    isAuditing = true;
    const report = await auditPage(url);
    isAuditing = false;

    return NextResponse.json(report);
  } catch (error: any) {
    isAuditing = false;
    console.error('SEO Audit Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
