import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { generatePDF } from '@/lib/seo/pdfReport';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const report = await req.json();
    if (!report) {
      return new Response('Report data is required', { status: 400 });
    }

    const pdfBuffer = await generatePDF(report);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="seo-report-${new URL(report.url).hostname}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
