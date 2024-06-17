"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage to see if user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
