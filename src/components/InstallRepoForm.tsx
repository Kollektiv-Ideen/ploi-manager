"use client";
import * as React from "react";

interface InstallRepoFormProps {
  serverId: number;
  siteId: number;
  onSuccess?: () => void;
}

export function InstallRepoForm({ serverId, siteId, onSuccess }: InstallRepoFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const provider = "github";
  const name = "Kollektiv-Ideen/democracy-tools";
  const branch = "kirby5";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/install-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId, siteId, provider, name, branch }),
      });
      if (!res.ok) throw new Error("Failed to install repo");
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-zinc-900 max-w-md">
      <h3 className="text-lg font-semibold mb-2">Install GitHub Repo</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Provider</label>
        <input type="text" className="w-full border rounded px-3 py-2 bg-gray-100" value={provider} disabled />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Repository</label>
        <input type="text" className="w-full border rounded px-3 py-2 bg-gray-100" value={name} disabled />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Branch</label>
        <input type="text" className="w-full border rounded px-3 py-2 bg-gray-100" value={branch} disabled />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Repository installed successfully!</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Installing..." : "Install Repo"}
      </button>
    </form>
  );
}
