"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AppContext";
import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  if (user) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Taskify
          </CardTitle>
          <CardContent className="mt-2 space-y-4">
            <Button
              onClick={() => router.push("/login")}
              className="w-full flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/signup")}
              className="w-full flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Button>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
