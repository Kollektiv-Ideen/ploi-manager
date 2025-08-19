import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  try {
    const { serverId, domain, project_type, root_domain } = await req.json();
    if (!serverId || !domain || !project_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await ploi.createSite(serverId, { domain, project_type, root_domain });
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
