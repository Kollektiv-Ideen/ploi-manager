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
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create site');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800 max-w-md">
      <h3 className="text-lg font-semibold mb-2 text-white">Create New Site</h3>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Domain</label>
        <input
          type="text"
          className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          required
          placeholder="sub.example.com"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && (
        <div className="text-green-400 text-sm">
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Site"}
      </button>
    </form>
  );
}
