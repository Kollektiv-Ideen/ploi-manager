"use client";
import * as React from "react";
import { useState } from "react";
import { Stepper } from "@/components/ui/stepper";

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
  const [currentStep, setCurrentStep] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResults(null);
    setCurrentStep(0);
    
    // Simulate progress updates during the process
    const progressInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 3000); // Update every 3 seconds
    
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
      
      clearInterval(progressInterval);
      setSuccess(true);
      setResults(data.data);
      setCurrentStep(4); // All steps completed
      setDomain("");
      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      clearInterval(progressInterval);
      setError(e instanceof Error ? e.message : 'Failed to create site');
    } finally {
      setLoading(false);
    }
  }

  // Define steps for the stepper
  const steps = [
    {
      title: "Create Site",
      description: "Creating new site",
      status: error && currentStep === 0 ? 'error' : currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'pending'
    },
    {
      title: "Install Repo",
      description: "Installing repository",
      status: error && currentStep === 1 ? 'error' : currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      title: "Setup Script",
      description: "Updating deploy script",
      status: error && currentStep === 2 ? 'error' : currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending'
    },
    {
      title: "Add Certificate",
      description: "Creating SSL certificate",
      status: error && currentStep === 3 ? 'error' : currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending'
    },
    {
      title: "Deploy",
      description: "Triggering deployment",
      status: error && currentStep === 4 ? 'error' : currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-gray-700 rounded-lg bg-gray-800 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4 text-white">Create New Site</h3>
      
      {(loading || error) && (
        <div className="mb-6">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Domain</label>
        <input
          type="text"
          className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          required
          placeholder="sub.example.com"
          disabled={loading}
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
