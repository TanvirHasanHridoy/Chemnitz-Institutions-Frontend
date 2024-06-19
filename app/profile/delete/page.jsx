"use client";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/Context";
import { set } from "date-fns";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteProfile = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  // checking if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    setToken(token);
    setId(id);
    console.log("Token and id is", token, id);
    if (!token || !id) {
      window.location.href = "/signin";
    }
  }, []);

  const handleDelete = async () => {
    try {
      const endpoint = `http://localhost:3000/user/deleteuser/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Deleted user", {
          duration: 3000,
          position: "top-center",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        Cookies.remove("token");
        setAuthenticated(false);
        window.location.href = "/";
      } else {
        const data = await response.json();
        console.log("Error:", data);
        toast.error(data.message, {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Failed to update user", {
        duration: 3000,
        position: "top-center",
      });

      console.error("Server error:", err);
    }
  };

  return (
    <div className="h-screen w-full ">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto p-6 sm:p-10 h-full space-y-12">
        <h1 className="text-2xl">Delete Profile</h1>
        <div className="">
          <p className="mb-8">Are you sure you want to delete your profile?</p>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
