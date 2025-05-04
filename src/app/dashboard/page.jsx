"use client";

import { useAuth } from "@/context/AppContext";

export default function OverviewPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <p className="text-lg font-semibold">Welcome {user?.name}</p>
    </div>
  );
}
