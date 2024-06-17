"use client";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { AuthContext } from "@/context/Context.js";

const Navbar = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  function handleLogout() {
    fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((data) => {
      console.log("The data is");
      console.log(data);
      setToken(null);
      Cookies.remove("token");
      setAuthenticated(false);
    });
  }

  useEffect(() => {
    const Ntoken = Cookies.get("token");
    const Nid = localStorage.getItem("id");
    setId(Nid);
    setToken(Ntoken);
    setLoading(false);
  }, []);

  console.log("Is he authenticated? (nav)", authenticated);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-900 w-full">
      <div className="flex space-x-4">
        <a href="/" className="text-white">
          Home
        </a>
        <a href="/documentation" className="text-white">
          Documentation
        </a>
        <a href="/impressium" className="text-white">
          Impressium
        </a>
        {/* Add more links as needed */}
      </div>
      <div>
        {loading ? (
          <div className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg flex justify-center items-center">
            <ImSpinner2 className="animate-spin" />
          </div>
        ) : token && id ? (
          <button
            onClick={handleLogout}
            className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg"
          >
            LOGOUT
          </button>
        ) : (
          <button
            onClick={() => {
              window.location.href = "http://localhost:3001/signin";
            }}
            className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg"
          >
            LOGIN
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
