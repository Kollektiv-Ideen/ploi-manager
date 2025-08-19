import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body:', body);
    const { serverId, siteId, provider, name, branch } = body;
    if (!serverId || !siteId || !provider || !name || !branch) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await ploi.installRepo(serverId, siteId, { provider, name, branch, script_id: 8157 });
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    console.error('Error in /api/install-repo:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
