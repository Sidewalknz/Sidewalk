import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect dashboard and private APIs
export const config = { matcher: ['/dashboard/:path*', '/api/private/:path*'] };

const SECRET = process.env.AUTH_SECRET!;

async function verify(token: string) {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return false;
  const payload = Buffer.from(b64, 'base64url').toString();

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expectedB64 = Buffer.from(new Uint8Array(expected)).toString('base64url');
  if (expectedB64 !== sig) return false;

  const data = JSON.parse(payload) as { exp: number };
  return data.exp > Math.floor(Date.now() / 1000);
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sid')?.value;
  if (token && await verify(token)) return NextResponse.next();
  return NextResponse.redirect(new URL('/login', req.url));
}
