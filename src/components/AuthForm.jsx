"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AppContext";

export default function AuthForm({ type }) {
  const { register, handleSubmit } = useForm();
  const { signup, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");

    try {
      type === "signup" ? await signup(data) : await login(data);
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold capitalize text-center">
            {type === "login" ? "Login to Your Account" : "Create an Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {type === "signup" && (
              <Input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              {loading
                ? type === "login"
                  ? "Logging in..."
                  : "Signing up..."
                : type === "login"
                ? "Login"
                : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
