import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function GET(req: NextRequest, { params }: { params: Promise<{ server: string }> }) {
  try {
    const { server } = await params;
    const serverId = Number(server);
    
    if (!serverId) {
      return NextResponse.json({ error: 'Invalid server ID' }, { status: 400 });
    }
    
    const result = await ploi.listSites(serverId);
    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error('Error in /api/servers/[server]/sites:', e);
    if (e && typeof e === 'object' && 'stack' in e) console.error(e.stack);
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
