// Lists available .webp image basenames in /public/website/<tab>
// e.g. for /public/website/canterbury/www-foo-com.webp -> "www-foo-com"

import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const tab = req.nextUrl.searchParams.get('tab')?.trim() || '';
    if (!tab) return Response.json({ list: [] });

    const dir = path.join(process.cwd(), 'public', 'website', tab);
    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      // tab folder might not exist yet
      return Response.json({ list: [] });
    }

    const list = files
      .filter((f) => f.toLowerCase().endsWith('.webp'))
      .map((f) => f.replace(/\.webp$/i, ''));

    return Response.json({ list });
  } catch (e: any) {
    return new Response(`images list failed: ${e?.message || e}`, { status: 500 });
  }
}
