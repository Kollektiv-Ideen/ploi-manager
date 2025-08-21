"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateSiteForm } from "@/components/CreateSiteForm";

interface Server {
  id: number;
  name: string;
  ip_address: string;
  status: string;
}

export default function CreateSitePage() {
  const [serverId, setServerId] = useState<number | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchServers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/servers");
        const data = await res.json();
        setServers(data.data || data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to fetch servers');
      } finally {
        setLoading(false);
      }
    }
    fetchServers();
  }, []);

  async function handleSuccess() {
    // Trigger a revalidation of the dashboard
    try {
      await fetch('/api/revalidate?path=/');
    } catch {
      // Ignore revalidation errors
    }
    router.push("/");
  }

  return (
    <div className="container mx-auto p-3 sm:py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">Create New Site</h1>
      {error && <div className="bg-red-900 text-red-200 p-4 rounded mb-6 border border-red-700">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading servers...</div>
      ) : (
        <div className="max-w-lg">
          <label className="block text-sm font-medium mb-2 text-white">Select Server</label>
          <select
            className="w-full border border-gray-600 rounded px-3 py-2 mb-6 bg-gray-800 text-white"
            value={serverId ?? ''}
            onChange={e => setServerId(Number(e.target.value))}
          >
            <option value="" disabled>Select a server</option>
            {servers.map((server: Server) => (
              <option key={server.id} value={server.id}>{server.name} ({server.ip_address})</option>
            ))}
          </select>
          {serverId && (
            <CreateSiteForm serverId={serverId} onSuccess={handleSuccess} />
          )}
        </div>
      )}
    </div>
  );
}
