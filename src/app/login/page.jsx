"use client";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  if (user) return null;

  return <AuthForm type="login" />;
}
