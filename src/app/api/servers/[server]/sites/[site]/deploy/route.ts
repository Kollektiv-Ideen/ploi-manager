import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest, { params }: { params: { server: string; site: string } }) {
  try {
    const serverId = Number(params.server);
    const siteId = Number(params.site);
    if (!serverId || !siteId) {
      return NextResponse.json({ error: 'Missing server or site id' }, { status: 400 });
    }
    const result = await ploi.deploySite(serverId, siteId);
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    console.error('Error in /api/servers/[server]/sites/[site]/deploy:', e);
    if (e && e.stack) console.error(e.stack);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
