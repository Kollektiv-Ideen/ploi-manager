

import { ploi } from "@/lib/ploi";
import Link from "next/link";
import { ServerCard } from "@/components/ServerCard";

export default async function Dashboard() {
  let servers: any[] = [];
  let error = null;
  try {
    const res = await ploi.listServers();
    servers = res.data || res;
  } catch (e: any) {
    error = e.message;
  }

  // Fetch sites for each server on the server side
  const serversWithSites = await Promise.all(
    servers.map(async (server) => {
      let sites: any[] = [];
      let sitesError = null;
      try {
        const res = await ploi.listSites(server.id);
        sites = res.data || res;
      } catch (e: any) {
        sitesError = e.message;
      }
      return { ...server, sites, sitesError };
    })
  );

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Democracy Tools Manager</h1>
        <Link href="/create-site">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create New Site</button>
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">{error}</div>
      )}
      <div className="space-y-8">
        {serversWithSites.length === 0 && !error && (
          <div className="text-gray-500">No servers found.</div>
        )}
        {serversWithSites.map((server) => (
          <ServerCard key={server.id} {...server} />
        ))}
      </div>
    </div>
  );
}
