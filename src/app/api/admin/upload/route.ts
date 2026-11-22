import { NextResponse } from 'next/server';
import { isAdmin,validWriteOrigin } from '@/lib/admin-session';
import { uploadImage } from '@/lib/site-content';

export const runtime='nodejs';
export async function POST(request:Request) {
  if (!(await isAdmin())) return NextResponse.json({error:'Unauthorized'},{status:401});
  if (!validWriteOrigin(request)) return NextResponse.json({error:'Invalid origin'},{status:403});
  if (Number(request.headers.get('content-length')||'0')>3_200_000) return NextResponse.json({error:'Maximum image size is 3 MB'},{status:413});
  try {
    const form=await request.formData();
    const file=form.get('file');
    if (!(file instanceof File)) return NextResponse.json({error:'Select an image'},{status:400});
    if (file.size>3_000_000) return NextResponse.json({error:'Maximum image size is 3 MB'},{status:413});
    const url=await uploadImage(new Uint8Array(await file.arrayBuffer()),file.type);
    return NextResponse.json({url},{headers:{'Cache-Control':'no-store'}});
  }catch(error) {
    const message=error instanceof Error?error.message:'Upload failed';
    if (message.startsWith('Only')||message.startsWith('Image exceeds')||message.startsWith('File signature'))return NextResponse.json({error:message},{status:400});
    console.error('Image upload failed',error);
    return NextResponse.json({error:'Upload failed'},{status:503});
  }
}
