import { NextResponse } from 'next/server';
import { isAdmin,validWriteOrigin } from '@/lib/admin-session';
import { publishContent,readContent } from '@/lib/site-content';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401,headers});
  try { return NextResponse.json(await readContent(),{headers}); }
  catch (error) {
    console.error('Admin content read failed',error);
    return NextResponse.json({error:'Could not load content storage'},{status:503,headers});
  }
}
export async function PUT(request:Request) {
  if (!(await isAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401,headers});
  if (!validWriteOrigin(request)) return NextResponse.json({error:'Invalid origin'},{status:403,headers});
  if (Number(request.headers.get('content-length')||'0') > 200000) return NextResponse.json({error:'Content too large'},{status:413,headers});
  try {
    const body = await request.json() as { content?:unknown;revision?:unknown };
    if (typeof body.revision !== 'string') return NextResponse.json({error:'Missing revision'},{status:400,headers});
    const revision=await publishContent(body.content,body.revision);
    return NextResponse.json({ok:true,revision},{headers});
  } catch(error) {
    const message=error instanceof Error?error.message:'Unknown error';
    if (message==='CONTENT_CONFLICT') return NextResponse.json({error:'Content changed elsewhere. Reload the dashboard before saving.'},{status:409,headers});
    if (message.startsWith('Invalid')||message.startsWith('Expected')||message.startsWith('Duplicate')) return NextResponse.json({error:message},{status:400,headers});
    console.error('Admin publish failed',error);
    return NextResponse.json({error:'Publishing failed; content was not changed'},{status:503,headers});
  }
}
