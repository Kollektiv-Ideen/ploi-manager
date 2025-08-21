import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest, { params }: { params: Promise<{ server: string; site: string }> }) {
  try {
    const { server, site } = await params;
    const serverId = Number(server);
    const siteId = Number(site);
    if (!serverId || !siteId) {
      return NextResponse.json({ error: 'Missing server or site id' }, { status: 400 });
    }
    const result = await ploi.deploySite(serverId, siteId);
    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    console.error('Error in /api/servers/[server]/sites/[site]/deploy:', e);
    if (e && typeof e === 'object' && 'stack' in e) console.error(e.stack);
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
