"use client";
import * as React from "react";
import { useState } from "react";

interface CreateSiteFormProps {
  serverId: number;
  onSuccess?: () => void;
}

export function CreateSiteForm({ serverId, onSuccess }: CreateSiteFormProps) {
  const [domain, setDomain] = useState("");
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
          root_domain: domain,
          web_directory: "/public",
          project_type: "php",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create site");
      setSuccess(true);
      setResults(data.data);
      setDomain("");
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
