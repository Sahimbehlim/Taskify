"use client";

import { useAuth } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user]);

  if (user === null) return null;

  return <div>{children}</div>;
}
