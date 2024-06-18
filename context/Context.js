"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  // const [token, setToken] = useState(null);
  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check local storage to see if user is already authenticated
    const token = Cookies.get("token");
    const id = localStorage.getItem("id");
    if (token && id) {
      setAuthenticated(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
