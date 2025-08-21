"use client";
import * as React from "react";
import { CreateSiteForm } from "@/components/CreateSiteForm";
import { InstallRepoForm } from "@/components/InstallRepoForm";

interface ServerCardProps {
  id: number;
  name: string;
  ip_address: string;
  status: string;
  sites: any[];
  sitesError: string | null;
}

export function ServerCard({ id, name, ip_address, status, sites, sitesError }: ServerCardProps) {
  const [created, setCreated] = React.useState(false);

  function handleSuccess() {
    setCreated(true);
  }

  return (
    <div className="border rounded-lg p-6 shadow-lg bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <div className="text-gray-500 text-sm">{ip_address}</div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
      </div>
      <div className="mt-4">
        <h3 className="font-medium mb-2">Sites</h3>
        {sitesError && <div className="text-red-600 text-sm mb-2">{sitesError}</div>}
        {sites.length === 0 && !sitesError ? (
          <div className="text-gray-400 text-sm">No sites found for this server.</div>
        ) : (
          <ul className="space-y-2">
            {sites.map((site: any) => (
              <li key={site.id} className="border p-3 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <a 
                    href={`https://${site.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-sans font-semibold text-lg text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {site.domain}
                  </a>
                  <span className="ml-2 text-xs text-gray-500">({site.project_type})</span>
                </div>
                <span className={`mt-1 sm:mt-0 px-2 py-0.5 rounded text-xs font-medium ${site.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{site.status}</span>
                <div className="mt-2">
                  {site.has_repository && <DeploySiteButton serverId={id} siteId={site.id} />}
                  {site.has_repository && <CreateCertificateButton serverId={id} siteId={site.id} domain={site.domain} />}
                  {!site.has_repository && <InstallRepoForm serverId={id} siteId={site.id} />}
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleDeploy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Deploying..." : "Deploy Site"}
      </button>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-1">Deploy script copied and deployment triggered!</div>}
    </div>
  );
}

function CreateCertificateButton({ serverId, siteId, domain }: { serverId: number; siteId: number; domain: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/create-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId, siteId, domain }),
      });
      if (!res.ok) throw new Error("Failed to create certificate");
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleCreate}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Certificate"}
      </button>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-1">Certificate requested!</div>}
    </div>
  );
}
