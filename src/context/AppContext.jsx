"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
      if (res.status === 201) router.push("/login");
    } catch (error) {
      console.error("Error during signup:", error);
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
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setUser(null);
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, signup, login }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => useContext(AppContext);
