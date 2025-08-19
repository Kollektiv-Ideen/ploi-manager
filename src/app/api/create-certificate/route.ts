import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body:', body);
    const { serverId, siteId, domain } = body;
    if (!serverId || !siteId || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await ploi.createCertificate(serverId, siteId, domain);
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    console.error('Error in /api/create-certificate:', e);
    if (e && e.stack) console.error(e.stack);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
