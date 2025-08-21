import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

export async function POST(req: NextRequest) {
  const context: Record<string, any> = {};
  try {
    const body = await req.json();
    const { serverId, domain, root_domain, project_type } = body;
    if (!serverId || !domain || !root_domain || !project_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1) Create site
    const created = await ploi.createSite(serverId, { domain, root_domain, project_type });
    context.createSite = created;
    const siteId = created?.data?.id ?? created?.id;
    if (!siteId) {
      throw new Error('Could not determine created site id');
    }

    // 2) Install repository
    const install = await ploi.installRepo(serverId, siteId, {
      provider: 'github',
      name: 'Kollektiv-Ideen/democracy-tools',
      branch: 'kirby5',
    });
    context.installRepo = install;

    // 3) Update deploy script from account script id 8157
    const scriptRes = await ploi.getScript(8157);
    const script = scriptRes?.data?.script ?? scriptRes?.script;
    if (!script) {
      throw new Error('Could not fetch script content for script 8157');
    }
    const updateScript = await ploi.updateDeployScript(serverId, siteId, script);
    context.updateDeployScript = updateScript;

    // 4) Create certificate for the domain (Let’s Encrypt)
    const cert = await ploi.createCertificate(serverId, siteId, domain);
    context.createCertificate = cert;

    // 5) Deploy site
    const deploy = await ploi.deploySite(serverId, siteId);
    context.deploy = deploy;

    return NextResponse.json({ success: true, data: context });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e), context }, { status: 500 });
  }
}
