"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e: unknown) {
      console.error("Logout error:", e);
      // Still redirect even if logout fails
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
