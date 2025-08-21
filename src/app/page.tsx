

import { ploi } from "@/lib/ploi";
import Link from "next/link";
import { ServerCard } from "@/components/ServerCard";

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

export default async function Dashboard() {
  let servers: Server[] = [];
  let error: string | null = null;
  try {
    const res = await ploi.listServers();
    servers = res.data || res;
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : 'Failed to fetch servers';
  }

  // Fetch sites for each server on the server side
  const serversWithSites = await Promise.all(
    servers.map(async (server) => {
      let sites: Site[] = [];
      let sitesError: string | null = null;
      try {
        const res = await ploi.listSites(server.id);
        sites = res.data || res;
      } catch (e: unknown) {
        sitesError = e instanceof Error ? e.message : 'Failed to fetch sites';
      }
      return { ...server, sites, sitesError };
    })
  );

                return (
                <div className="container mx-auto p-3 sm:py-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h1 className="text-3xl text-white pb-4">Democracy Tools Manager</h1>
                    <Link href="/create-site">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Create New Site</button>
                    </Link>
                  </div>
                  {error && (
                    <div className="bg-red-900 text-red-200 p-4 rounded mb-6 border border-red-700">{error}</div>
                  )}
                  <div className="space-y-8">
                    {serversWithSites.length === 0 && !error && (
                      <div className="text-gray-400">No servers found.</div>
                    )}
                    {serversWithSites.map((server) => (
                      <ServerCard key={server.id} {...server} />
                    ))}
                  </div>
                </div>
              );
}
