import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function GET(req: NextRequest) {
  try {
    const result = await ploi.listServers();
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('Error in /api/servers:', e);
    if (e && e.stack) console.error(e.stack);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
