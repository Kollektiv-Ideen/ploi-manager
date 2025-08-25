"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ServerCard } from "@/components/ServerCard";
import { LogoutButton } from "@/components/LogoutButton";

interface Server {
  id: number;
  name: string;
  ip_address: string;
  status: string;
}

interface Site {
  id: number;
  domain: string;
  project_type: string;
  status: string;
  has_repository?: boolean;
}

interface ServerWithSites extends Server {
  sites: Site[];
  sitesError: string | null;
}

export function Dashboard() {
  const [servers, setServers] = useState<Server[]>([]);
  const [serversWithSites, setServersWithSites] = useState<ServerWithSites[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchServers() {
    try {
      const res = await fetch("/api/servers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch servers");
      return data.data || data;
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : "Failed to fetch servers");
    }
  }

  async function fetchSitesForServer(serverId: number) {
    try {
      const res = await fetch(`/api/servers/${serverId}/sites`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch sites");
      return data.data || data;
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : "Failed to fetch sites");
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    
    try {
      const serversData = await fetchServers();
      setServers(serversData);

      const serversWithSitesData = await Promise.all(
        serversData.map(async (server: Server) => {
          let sites: Site[] = [];
          let sitesError: string | null = null;
          try {
            sites = await fetchSitesForServer(server.id);
          } catch (e: unknown) {
            sitesError = e instanceof Error ? e.message : "Failed to fetch sites";
          }
          return { ...server, sites, sitesError };
        })
      );
      
      setServersWithSites(serversWithSitesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefreshServer(serverId: number) {
    try {
      const sites = await fetchSitesForServer(serverId);
      setServersWithSites(prev => 
        prev.map(server => 
          server.id === serverId 
            ? { ...server, sites, sitesError: null }
            : server
        )
      );
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch sites";
      setServersWithSites(prev => 
        prev.map(server => 
          server.id === serverId 
            ? { ...server, sitesError: errorMessage }
            : server
        )
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-gray-400 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Ploi Manager</h1>
        <div className="flex items-center gap-4">
          <Link href="/create-site">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Create New Site</button>
          </Link>
          <LogoutButton />
        </div>
      </div>
      {error && (
        <div className="bg-red-900 text-red-200 p-4 rounded mb-6 border border-red-700">{error}</div>
      )}
      <div className="space-y-8">
        {serversWithSites.length === 0 && !error && (
          <div className="text-gray-400">No servers found.</div>
        )}
        {serversWithSites.map((server) => (
          <ServerCard 
            key={server.id} 
            {...server} 
            onRefresh={handleRefreshServer}
          />
        ))}
      </div>
    </div>
  );
}
