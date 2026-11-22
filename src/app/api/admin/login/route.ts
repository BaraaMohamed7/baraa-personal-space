import { NextResponse } from 'next/server';
import { newSession, sessionCookie, validWriteOrigin, verifyAdminPassword } from '@/lib/admin-session';

export const runtime='nodejs';
export async function POST(request: Request) {
  if (!validWriteOrigin(request)) return NextResponse.json({error:'Invalid origin'},{status:403});
  let password = '';
  try {
    const payload = await request.json() as {password?:unknown};
    password = typeof payload.password === 'string' ? payload.password : '';
  } catch { return NextResponse.json({error:'Invalid request'},{status:400}); }
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({error:'Incorrect password'},{status:401,headers:{'Cache-Control':'no-store'}});
  }
  const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  response.cookies.set(sessionCookie(newSession()));
  return response;
}
