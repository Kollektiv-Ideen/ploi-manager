"use client";
import * as React from "react";
import { useState } from "react";

interface CreateSiteFormProps {
  serverId: number;
  onSuccess?: () => void;
}

export function CreateSiteForm({ serverId, onSuccess }: CreateSiteFormProps) {
  const [domain, setDomain] = useState("");
  const [rootDomain, setRootDomain] = useState("");
  const [webDirectory, setWebDirectory] = useState("public");
  const [projectType, setProjectType] = useState("php");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResults(null);
    try {
      const res = await fetch("/api/create-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId,
          domain,
          root_domain: rootDomain,
          web_directory: webDirectory,
          project_type: projectType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create site");
      setSuccess(true);
      setResults(data.data);
      setDomain("");
      setRootDomain("democracytools.ch");
      setWebDirectory("/public");
      setProjectType("php");
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-zinc-900 max-w-md">
      <h3 className="text-lg font-semibold mb-2">Create New Site</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Domain</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          required
          placeholder="sub.example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Root Domain</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={rootDomain}
          onChange={e => setRootDomain(e.target.value)}
          required
          placeholder="example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Web Directory</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={webDirectory}
          onChange={e => setWebDirectory(e.target.value)}
          required
          placeholder="/public"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Project Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={projectType}
          onChange={e => setProjectType(e.target.value)}
        >
          <option value="php">PHP</option>
          <option value="laravel">Laravel</option>
          <option value="statamic">Statamic</option>
          <option value="symfony">Symfony</option>
          <option value="wordpress">WordPress</option>
        </select>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          <div className="font-semibold mb-2">Site created successfully!</div>
          {results && (
            <div className="text-xs space-y-1">
              <div>✅ Site created</div>
              <div>✅ Repository installed</div>
              <div>✅ Deploy script updated</div>
              <div>✅ Certificate requested</div>
              <div>✅ Deployment triggered</div>
            </div>
          )}
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Site"}
      </button>
    </form>
  );
}
