"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [token, setToken] = useState();
  const [id, setId] = useState();
  function handleLogout() {
    fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((data) => {
      console.log("The data is");
      console.log(data);
      setToken(null);
    });
  }
  useEffect(() => {
    const Ntoken = Cookies.get("token");
    console.log(Ntoken);
    const Nid = localStorage.getItem("id");
    setId(Nid);
    setToken(Ntoken);
  }, [token]);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-900 w-full">
      <div className="flex space-x-4">
        {token && id ? (
          <a href="/" className="text-white">
            Home
          </a>
        ) : null}

        <a href="/documentation" className="text-white">
          Documentation
        </a>
        <a href="/impressium" className="text-white">
          Impressium
        </a>
        {/* Add more links as needed */}
      </div>
      <div className="">
        {token && id ? (
          <div className="">
            <button
              onClick={handleLogout}
              className="bg-red-400 text-white font-bold p-3 rounded-lg"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="">
            <button
              onClick={() => {
                window.location.href = "http://localhost:3001/signin";
              }}
              className="bg-red-400 text-white font-bold p-3 rounded-lg"
            >
              LOGIN
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
