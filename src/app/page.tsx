

import { requireAuth } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  // Require authentication
  await requireAuth();

  return <Dashboard />;
}
