"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Unified auth check and task fetching
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/tasks", { withCredentials: true });
      setUser(data.user);
      setTasks(data.tasks);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setTasks([]);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Sign up new user
  const signup = async (data) => {
    try {
      await axios.post("/api/auth/signup", data, {
        withCredentials: true,
      });
      toast("User registered successfully");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast(error.response?.data?.error || "Failed to sign up");
    }
  };

  // Log in user
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      setUser(data.user);
      setTasks(data.tasks);
      toast(data.message || "Login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast(error.response?.data?.error || "Failed to login");
      setUser(null);
    }
  };

  // Log out user
  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setTasks([]);
      router.push("/");
      toast(data.message || "Logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        logout,
        tasks,
        setTasks,
        checkAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => useContext(AppContext);
