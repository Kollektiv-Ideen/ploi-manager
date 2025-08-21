import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverId, siteId } = body;
    if (!serverId || !siteId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Trigger the deploy
    const result = await ploi.deploySite(serverId, siteId);
    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    console.error('Error in /api/deploy-site:', e);
    if (e && typeof e === 'object' && 'stack' in e) console.error(e.stack);
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
