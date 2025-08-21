import { NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function GET() {
  try {
    const result = await ploi.listServers();
    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error('Error in /api/servers:', e);
    if (e && typeof e === 'object' && 'stack' in e) console.error(e.stack);
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
