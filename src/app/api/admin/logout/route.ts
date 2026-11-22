import { NextResponse } from 'next/server';
import { logoutCookie, validWriteOrigin } from '@/lib/admin-session';

export async function POST(request:Request) {
  if (!validWriteOrigin(request)) return NextResponse.json({error:'Invalid origin'},{status:403});
  const response=NextResponse.json({ok:true});
  response.cookies.set(logoutCookie());
  return response;
}
