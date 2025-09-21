import { NextResponse } from 'next/server';

const USER = process.env.DASH_USER!;
const PASS = process.env.DASH_PASS!;
const SECRET = process.env.AUTH_SECRET!; 

// HMAC sign (Edge-compatible)
async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Buffer.from(new Uint8Array(sig)).toString('base64url');
}

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  if (user !== USER || pass !== PASS) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // short session (e.g., 7 days)
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = JSON.stringify({ u: 'admin', exp });
  const sig = await sign(payload);
  const token = Buffer.from(payload).toString('base64url') + '.' + sig;

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: 'sid',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
