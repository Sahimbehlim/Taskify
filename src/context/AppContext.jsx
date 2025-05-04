"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/me", { withCredentials: true });
        setUser(data.user);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching user:", error);
        }
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const signup = async (data) => {
    try {
      const res = await axios.post("/api/auth/signup", data, {
        withCredentials: true,
      });
      if (res.status === 201) {
        router.push("/login");
        toast("User registered successfully");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast(error.response?.data?.message || "Failed to signup");
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      if (data.user) {
        setUser(data.user);
        router.push("/dashboard");
        toast(data?.message || "Login success");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast(error.response?.data?.message || "Failed to login");
      setUser(null);
    }
  };

  const logout = async () => {
    const { data } = await axios.post("/api/auth/logout");
    setUser(null);
    router.push("/");
    toast(data?.message || "Logged out");
  };

  return (
    <AppContext.Provider value={{ user, setUser, signup, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => useContext(AppContext);
