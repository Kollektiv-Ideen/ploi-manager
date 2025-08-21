import { NextRequest, NextResponse } from 'next/server';
import { ploi } from '@/lib/ploi';

// Helper function to wait for 5 seconds
function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

    // Wait 5 seconds
    await wait(5000);

    // 2) Install repository
    const install = await ploi.installRepo(serverId, siteId, {
      provider: process.env.REPO_PROVIDER || 'github',
      name: process.env.REPO_NAME || 'Kollektiv-Ideen/democracy-tools',
      branch: process.env.REPO_BRANCH || 'kirby5',
    });
    context.installRepo = install;

    // Wait 5 seconds
    await wait(5000);

    // 3) Update deploy script from account script id 8157
    console.log('Fetching script 8157...');
    const scriptId = process.env.DEPLOY_SCRIPT_ID || '8157';
    const scriptRes = await ploi.getScript(Number(scriptId));
    console.log('Script response:', JSON.stringify(scriptRes, null, 2));
    
    // Try different possible response formats
    let script = null;
    if (scriptRes?.data?.script) {
      script = scriptRes.data.script;
    } else if (scriptRes?.script) {
      script = scriptRes.script;
    } else if (scriptRes?.data?.content) {
      script = scriptRes.data.content;
    } else if (scriptRes?.content) {
      script = scriptRes.content;
    } else if (typeof scriptRes === 'string') {
      script = scriptRes;
    }
    
    if (!script) {
      console.error('Script response structure:', scriptRes);
      throw new Error(`Could not fetch script content for script 8157. Response: ${JSON.stringify(scriptRes)}`);
    }
    const updateScript = await ploi.updateDeployScript(serverId, siteId, script);
    context.updateDeployScript = updateScript;

    // Wait 5 seconds
    await wait(5000);

    // 4) Create certificate for the domain (Let's Encrypt)
    const cert = await ploi.createCertificate(serverId, siteId, domain);
    context.createCertificate = cert;

    // Wait 5 seconds
    await wait(5000);

    // 5) Deploy site
    const deploy = await ploi.deploySite(serverId, siteId);
    context.deploy = deploy;

    return NextResponse.json({ success: true, data: context });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e), context }, { status: 500 });
  }
}
