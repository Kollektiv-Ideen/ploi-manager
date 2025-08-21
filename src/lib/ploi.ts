const API_URL = 'https://ploi.io/api';
const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
  throw new Error('Ploi API token is not set in .env.local');
}

async function ploiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let errorBody = '';
    try {
      errorBody = JSON.stringify(await res.json());
    } catch {}
    throw new Error(`Ploi API error: ${res.status} ${res.statusText} ${errorBody}`);
  }
  return res.json();
}

export const ploi = {
  async listServers() {
    return ploiFetch('/servers');
  },
  async listSites(serverId: number) {
    return ploiFetch(`/servers/${serverId}/sites`);
  },
  async createSite(serverId: number, data: { domain: string; project_type: string; root_domain: string; }) {
    return ploiFetch(`/servers/${serverId}/sites`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        web_directory: '/public',
      }),
    });
  },
  async installRepo(serverId: number, siteId: number, data: { provider: string; name: string; branch: string; script_id?: number }) {
    return ploiFetch(`/servers/${serverId}/sites/${siteId}/repository`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async deploySite(serverId: number, siteId: number, deployScriptId?: number) {
    return ploiFetch(`/servers/${serverId}/sites/${siteId}/deploy`, {
      method: 'POST',
      body: deployScriptId ? JSON.stringify({ script_id: deployScriptId }) : undefined,
    });
  },
  async getScript(scriptId: number) {
    return ploiFetch(`/scripts/${scriptId}`);
  },
  async updateDeployScript(serverId: number, siteId: number, script: string) {
    return ploiFetch(`/servers/${serverId}/sites/${siteId}/deploy/script`, {
      method: 'PATCH',
      body: JSON.stringify({ deploy_script: script }),
    });

  },
  async createCertificate(serverId: number, siteId: number, domain: string) {
    return ploiFetch(`/servers/${serverId}/sites/${siteId}/certificates`, {
      method: 'POST',
      body: JSON.stringify({ type: 'letsencrypt', certificate: domain }),
    });
  },
};
