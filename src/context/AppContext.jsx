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

  // Check if the user is authenticated and fetch user data
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/me", { withCredentials: true });
      setTasks(data.tasks);
      setUser(data.user);
    } catch (error) {
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
      const res = await axios.post("/api/auth/signup", data, {
        withCredentials: true,
      });
      if (res.status === 201) {
        toast("User registered successfully");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast(error.response?.data?.message || "Failed to signup");
    }
  };

  // Log in user
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      if (data.user) {
        setUser(data.user);
        setTasks(data.tasks);
        toast(data?.message || "Login success");
        router.push("/dashboard");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast(error.response?.data?.message || "Failed to login");
      setUser(null);
    }
  };

  // Log out user
  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
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
