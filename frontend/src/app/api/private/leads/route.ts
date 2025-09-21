// CRUD for leads rows in Google Sheets
//   GET    /api/private/leads?tab=<worksheet>
//   POST   /api/private/leads?tab=<worksheet>     body: Lead
//   PATCH  /api/private/leads?tab=<worksheet>     body: { id?: string, website?: string, needsNew?: boolean, dontNeed?: boolean, ...partial }
//   DELETE /api/private/leads?tab=<worksheet>&id=<id>

import { NextRequest } from 'next/server';
import { getSheets, cfg } from '../../../../lib/googleSheets';

export const runtime = 'nodejs';

type Lead = {
  id?: string;
  name?: string;
  email?: string;
  website?: string;
  phone?: string;
  image?: string;
  needsNew?: boolean;
  dontNeed?: boolean;
  type?: string;
  notes?: string;
};

const COLS = ['id','name','email','website','phone','image','needsNew','dontNeed','type','notes'] as const;

const toBool = (v: any) =>
  typeof v === 'boolean'
    ? v
    : ['true', 'yes', '1', 'y'].includes(String(v ?? '').trim().toLowerCase());

const toCell = (v: any) =>
  typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : (v ?? '');

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// normalize header -> key map
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ''); // drop spaces, hyphens, etc.
const KEY_MAP: Record<string, keyof Lead> = {
  id: 'id',
  name: 'name',
  email: 'email',
  website: 'website',
  phone: 'phone',
  image: 'image',
  needsnew: 'needsNew', // "Needs new"
  dontneed: 'dontNeed', // "Dont need"
  type: 'type',
  notes: 'notes',
};

function mapRow(header: string[], row: string[]) {
  const out: any = {};
  header.forEach((h, i) => {
    const keyNorm = norm(h);
    const key = KEY_MAP[keyNorm];
    if (!key) return; // ignore unknown columns
    let val: any = row[i] ?? '';
    if (key === 'needsNew' || key === 'dontNeed') val = toBool(val);
    out[key] = val;
  });
  return out as Lead;
}

function normalizeWebsite(s?: string) {
  if (!s) return '';
  return String(s)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .replace(/\.+$/, '')
    .toLowerCase();
}

export async function GET(req: NextRequest) {
  try {
    const sheets = getSheets();
    const { spreadsheetId, tab: defaultTab } = cfg();
    const urlTab = req.nextUrl.searchParams.get('tab')?.trim();
    const tab = urlTab || defaultTab;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A1:Z`,
    });

    const rows = res.data.values || [];
    if (!rows.length) return Response.json([]);

    const header = rows[0] as string[];
    const data = rows
      .slice(1)
      .filter((r) => (r as string[]).some((c) => (c ?? '').toString().trim() !== ''))
      .map((r) => mapRow(header, r as string[]));

    return Response.json(data);
  } catch (err: any) {
    return new Response(`Sheets GET failed: ${err?.message || err}`, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Lead;
    const sheets = getSheets();
    const { spreadsheetId, tab: defaultTab } = cfg();
    const urlTab = req.nextUrl.searchParams.get('tab')?.trim();
    const tab = urlTab || defaultTab;

    const id = body.id || nowId();
    const values = [
      id,
      body.name ?? '',
      body.email ?? '',
      body.website ?? '',
      body.phone ?? '',
      body.image ?? '',
      toCell(!!body.needsNew),
      toCell(!!body.dontNeed),
      body.type ?? '',
      body.notes ?? '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });

    return Response.json({ ok: true, id });
  } catch (err: any) {
    return new Response(`Sheets POST failed: ${err?.message || err}`, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Lead & {
      id?: string;
      website?: string;
    };

    const sheets = getSheets();
    const { spreadsheetId, tab: defaultTab } = cfg();
    const urlTab = req.nextUrl.searchParams.get('tab')?.trim();
    const tab = urlTab || defaultTab;

    // locate row by id OR by website
    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A1:J1`,
    });
    const header = (headerRes.data.values?.[0] || COLS) as string[];

    const idCol = header.findIndex((h) => norm(h) === 'id');
    const webCol = header.findIndex((h) => norm(h) === 'website');

    const allRowsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A1:J`,
    });
    const rows = (allRowsRes.data.values || []) as string[][];
    if (!rows.length) return new Response('Sheet empty', { status: 400 });

    const targetId = String(body.id || '').trim();
    const targetWeb = normalizeWebsite(body.website);

    let rowIndex = -1; // 0-based index into rows (including header at 0)
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i] || [];
      const idMatch =
        !!targetId && idCol >= 0 && (r[idCol] || '').toString().trim() === targetId;
      const webMatch =
        !!targetWeb &&
        webCol >= 0 &&
        normalizeWebsite(r[webCol]) === targetWeb;
      if (idMatch || webMatch) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex < 1) {
      return new Response('Row not found (id/website)', { status: 404 });
    }

    // Build next row from header, preserving any untouched cells.
    const existingRow =
      (await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${tab}!A${rowIndex + 1}:J${rowIndex + 1}`,
      })).data.values?.[0] || new Array(header.length).fill('');

    const updates: Record<string, any> = { ...body };

    // Keep mutually exclusive semantics if either provided
    if (typeof updates.needsNew === 'boolean') {
      updates.dontNeed = false;
    }
    if (typeof updates.dontNeed === 'boolean') {
      updates.needsNew = false;
    }

    const nextRow = header.map((h, i) => {
      const k = KEY_MAP[norm(h)] as keyof Lead | undefined;
      const incoming = k ? updates[k] : undefined;
      if (typeof incoming !== 'undefined') {
        if (k === 'needsNew' || k === 'dontNeed') return toCell(toBool(incoming));
        return toCell(incoming);
      }
      return existingRow[i] ?? '';
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tab}!A${rowIndex + 1}:J${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [nextRow] },
    });

    return Response.json({ ok: true, row: rowIndex + 1 });
  } catch (err: any) {
    return new Response(`Sheets PATCH failed: ${err?.message || err}`, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get('id');
    let id = idFromQuery;

    if (!id) {
      try {
        const json = (await req.json()) as any;
        id = json?.id;
      } catch {
        // ignore
      }
    }

    if (!id) return new Response('Missing id', { status: 400 });

    const sheets = getSheets();
    const { spreadsheetId, tab: defaultTab } = cfg();
    const urlTab = searchParams.get('tab')?.trim();
    const tab = urlTab || defaultTab;

    const colA = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A1:A`,
    });
    const vals = (colA.data.values || []).flat();
    const rowIndex = vals.findIndex((v) => v === id);
    if (rowIndex < 1) return new Response('ID not found', { status: 404 });

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${tab}!A${rowIndex + 1}:J${rowIndex + 1}`,
    });
    return Response.json({ ok: true, clearedRow: rowIndex + 1 });
  } catch (err: any) {
    return new Response(`Sheets DELETE failed: ${err?.message || err}`, { status: 500 });
  }
}
