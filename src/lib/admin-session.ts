import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'baraa_admin_session';
const EXPIRES = 12 * 60 * 60;

function mac(text: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 40) throw new Error('Admin session secret missing');
  return createHmac('sha256',secret).update(text).digest('base64url');
}

export function verifyAdminPassword(password: string): boolean {
  const data = process.env.ADMIN_PASSWORD_HASH?.split(':');
  if (!data || data.length !== 2 || !/^[a-f0-9]+$/.test(data[0]) || !/^[a-f0-9]{64}$/.test(data[1])) return false;
  if (password.length > 512) return false;
  const expected = Buffer.from(data[1],'hex');
  const actual = pbkdf2Sync(password,Buffer.from(data[0],'hex'),210000,32,'sha256');
  return timingSafeEqual(actual,expected);
}

export function newSession(): string {
  const payload = `${Math.floor(Date.now()/1000)+EXPIRES}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${mac(payload)}`;
}

export function validSession(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expires,nonce,sig] = parts;
  if (!/^\d+$/.test(expires) || !/^[a-f0-9]{32}$/.test(nonce)) return false;
  if (Number(expires) <= Date.now()/1000) return false;
  const expected=Buffer.from(mac(`${expires}.${nonce}`));
  const actual=Buffer.from(sig);
  return expected.length===actual.length && timingSafeEqual(expected,actual);
}

export async function isAdmin(): Promise<boolean> {
  return validSession((await cookies()).get(COOKIE)?.value);
}

export function sessionCookie(token: string) {
  return { name: COOKIE, value: token, httpOnly: true, secure: process.env.NODE_ENV==='production',
    sameSite: 'strict' as const, path:'/', maxAge:EXPIRES };
}
export function logoutCookie() {
  return { name: COOKIE, value:'', httpOnly:true, secure:process.env.NODE_ENV==='production',
    sameSite:'strict' as const, path:'/', maxAge:0 };
}

export function validWriteOrigin(request: Request): boolean {
  const origin=request.headers.get('origin');
  const host=request.headers.get('host');
  if (!origin || !host) return false;
  try {
    const url=new URL(origin);
    return (url.protocol==='https:' || (process.env.NODE_ENV!=='production' && url.protocol==='http:')) && url.host===host;
  } catch { return false; }
}
