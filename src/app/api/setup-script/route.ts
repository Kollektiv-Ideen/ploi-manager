import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body:', body);
    const { serverId, siteId } = body;
    if (!serverId || !siteId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // 1. Get the script content
    const scriptRes = await ploi.getScript(8157);

    const script = scriptRes.data?.content;
    if (!script) {
      return NextResponse.json({ error: 'Could not fetch deploy script 8157' }, { status: 500 });
    }
    // 2. Update the site's deploy script
    await ploi.updateDeployScript(serverId, siteId, script);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Error in /api/setup-script:', e);
    if (e && e.stack) console.error(e.stack);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
