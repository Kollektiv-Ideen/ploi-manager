"use client";
import * as React from "react";

interface ServerCardProps {
  id: number;
  name: string;
  ip_address: string;
  status: string;
  sites: Site[];
  sitesError: string | null;
}

interface Site {
  id: number;
  domain: string;
  project_type: string;
  status: string;
  has_repository?: boolean;
}

export function ServerCard({ id, name, ip_address, status, sites, sitesError }: ServerCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-6 shadow-lg bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-white">{name}</h2>
          <div className="text-gray-400 text-sm">{ip_address}</div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'active' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>{status}</span>
      </div>
      <div className="mt-4">
        <h3 className="font-medium mb-2 text-white">Sites</h3>
        {sitesError && <div className="text-red-400 text-sm mb-2">{sitesError}</div>}
        {sites.length === 0 && !sitesError ? (
          <div className="text-gray-500 text-sm">No sites found for this server.</div>
        ) : (
          <ul className="space-y-2">
            {sites.map((site: Site) => (
              <li key={site.id} className="border border-gray-700 p-3 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-750">
                <div>
                  <a 
                    href={`https://${site.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-lg text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {site.domain}
                  </a>
                  <span className="ml-2 text-xs text-gray-400">({site.project_type})</span>
                </div>
                <span className={`mt-1 sm:mt-0 px-2 py-0.5 rounded text-xs font-medium ${site.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>{site.status}</span>
                <div className="mt-2">
                  {site.has_repository && <DeploySiteButton serverId={id} siteId={site.id} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DeploySiteButton({ serverId, siteId }: { serverId: number; siteId: number }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleDeploy() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // 1. Setup script
      const setupRes = await fetch("/api/setup-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId, siteId }),
      });
      if (!setupRes.ok) throw new Error("Failed to update deploy script");
      // 2. Trigger deploy
      const deployRes = await fetch(`/api/servers/${serverId}/sites/${siteId}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!deployRes.ok) throw new Error("Failed to trigger deployment");
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to deploy');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleDeploy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        disabled={loading}
      >
        {loading ? "Deploying..." : "Deploy Site"}
      </button>
      {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-1">Deploy script copied and deployment triggered!</div>}
    </div>
  );
}


